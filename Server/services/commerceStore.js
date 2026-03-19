import crypto from "crypto";
import Cart from "../models/Cart.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import { sampleCourses } from "../data/sampleData.js";

const promoCodes = {
  MIND10: { type: "percent", value: 10 },
  STUDENT20: { type: "percent", value: 20 },
};

const store = {
  cart: {
    items: sampleCourses.slice(0, 2).map((course) => ({
      courseId: course.slug,
      addedAt: new Date().toISOString(),
    })),
    promoCode: "",
    discountPercent: 0,
  },
  latestOrder: null,
};

function hasDatabaseConnection() {
  return Course.db.readyState === 1;
}

async function resolveActiveUser() {
  if (!hasDatabaseConnection()) return null;
  return User.findOne({ role: "learner" });
}

async function resolveCommerceUser(user) {
  if (!hasDatabaseConnection()) return null;
  if (user?.role === "learner") {
    return User.findById(user._id);
  }

  if (user) {
    return null;
  }

  return resolveActiveUser();
}

async function resolveCourse(courseId) {
  if (hasDatabaseConnection()) {
    const liveCourse = await Course.findOne({
      $or: [{ slug: courseId }, { _id: courseId }],
    }).lean();

    if (liveCourse) {
      return {
        id: liveCourse._id.toString(),
        slug: liveCourse.slug,
        title: liveCourse.title,
        instructorName: liveCourse.instructorName,
        thumbnail: liveCourse.thumbnail,
        price: liveCourse.price,
        originalPrice: liveCourse.originalPrice || liveCourse.price,
      };
    }
  }

  return sampleCourses.find((course) => course.slug === courseId || course.id === courseId) || null;
}

function buildSummary(items, promoCode = "", discountPercent = 0) {
  const originalTotal = items.reduce((sum, item) => sum + (item.originalPrice || item.price), 0);
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const discount = Number((subtotal * (discountPercent / 100)).toFixed(2));
  const discountedSubtotal = subtotal - discount;
  const tax = Number((discountedSubtotal * 0.08).toFixed(2));
  const total = Number((discountedSubtotal + tax).toFixed(2));

  return {
    promoCode,
    discountPercent,
    summary: {
      originalTotal,
      subtotal,
      discount,
      tax,
      total,
    },
  };
}

function formatOrder(order) {
  return {
    id: order._id?.toString?.() || order.id,
    orderNumber: order.orderNumber,
    paymentMethod: order.paymentMethod,
    paymentProvider: order.paymentProvider,
    billingDetails: order.billingDetails,
    items: (order.items || []).map((item) => ({
      courseId: item.course?.toString?.() || item.courseId || "",
      title: item.title,
      instructorName: item.instructorName,
      thumbnail: item.thumbnail,
      price: item.price,
      originalPrice: item.originalPrice,
    })),
    summary: order.summary,
    createdAt: order.createdAt,
  };
}

async function syncEnrollmentsFromOrder(userId, orderItems) {
  const validItems = orderItems.filter((item) => item.course);

  await Promise.all(
    validItems.map(async (item) => {
      const course = await Course.findById(item.course).lean();
      if (!course) return;

      const totalLessons = Array.isArray(course.lessons) ? course.lessons.length : 0;

      await Enrollment.findOneAndUpdate(
        { user: userId, course: course._id },
        {
          $setOnInsert: {
            user: userId,
            course: course._id,
            progress: 0,
            currentLesson: totalLessons ? course.lessons[0]?.title || "Getting started" : "Getting started",
            completedLessons: 0,
            totalLessons,
            timeSpent: "0h 00m",
            lastAccessed: "Just enrolled",
            status: "active",
            certificateEarned: false,
          },
        },
        { upsert: true, new: true }
      );
    })
  );
}

export async function buildCartPayload(user) {
  const activeUser = await resolveCommerceUser(user);

  if (activeUser) {
    let cart = await Cart.findOne({ user: activeUser._id }).populate("items.course");

    if (!cart) {
      cart = await Cart.create({
        user: activeUser._id,
        items: [],
        promoCode: "",
        discountPercent: 0,
      });
      cart = await Cart.findById(cart._id).populate("items.course");
    }

    const items = cart.items
      .map((item) => item.course)
      .filter(Boolean)
      .map((course) => ({
        courseId: course.slug || course._id.toString(),
        title: course.title,
        instructorName: course.instructorName,
        thumbnail: course.thumbnail,
        price: course.price,
        originalPrice: course.originalPrice || course.price,
      }));

    return {
      items,
      ...buildSummary(items, cart.promoCode, cart.discountPercent),
    };
  }

  const itemEntries = await Promise.all(
    store.cart.items.map(async (item) => {
      const course = await resolveCourse(item.courseId);
      if (!course) return null;

      return {
        courseId: course.slug || course.id,
        title: course.title,
        instructorName: course.instructorName,
        thumbnail: course.thumbnail,
        price: course.price,
        originalPrice: course.originalPrice || course.price,
      };
    })
  );

  const items = itemEntries.filter(Boolean);

  return {
    items,
    ...buildSummary(items, store.cart.promoCode, store.cart.discountPercent),
  };
}

export async function addItemToCart(courseId, user) {
  const course = await resolveCourse(courseId);

  if (!course) {
    throw new Error("Course not found.");
  }

  const activeUser = await resolveCommerceUser(user);

  if (activeUser && hasDatabaseConnection()) {
    let cart = await Cart.findOne({ user: activeUser._id });
    if (!cart) {
      cart = await Cart.create({ user: activeUser._id, items: [] });
    }

    const courseDoc = await Course.findOne({
      $or: [{ slug: course.slug || course.id }, { _id: course.id }],
    });

    if (courseDoc && !cart.items.some((item) => item.course.toString() === courseDoc._id.toString())) {
      cart.items.push({ course: courseDoc._id, addedAt: new Date() });
      await cart.save();
    }

    return buildCartPayload(user);
  }

  const existing = store.cart.items.find((item) => item.courseId === (course.slug || course.id));

  if (!existing) {
    store.cart.items.push({
      courseId: course.slug || course.id,
      addedAt: new Date().toISOString(),
    });
  }

  return buildCartPayload(user);
}

export async function removeItemFromCart(courseId, user) {
  const activeUser = await resolveCommerceUser(user);

  if (activeUser && hasDatabaseConnection()) {
    const cart = await Cart.findOne({ user: activeUser._id });
    if (cart) {
      const targetCourse = await Course.findOne({
        $or: [{ slug: courseId }, { _id: courseId }],
      });
      if (targetCourse) {
        cart.items = cart.items.filter(
          (item) => item.course.toString() !== targetCourse._id.toString()
        );
        await cart.save();
      }
    }
    return buildCartPayload(user);
  }

  store.cart.items = store.cart.items.filter((item) => item.courseId !== courseId);
  return buildCartPayload(user);
}

export async function applyPromoCode(code, user) {
  const normalizedCode = String(code || "").trim().toUpperCase();
  const promo = promoCodes[normalizedCode];

  if (!promo) {
    throw new Error("Promo code is invalid.");
  }

  const activeUser = await resolveCommerceUser(user);

  if (activeUser && hasDatabaseConnection()) {
    let cart = await Cart.findOne({ user: activeUser._id });
    if (!cart) {
      cart = await Cart.create({ user: activeUser._id, items: [] });
    }
    cart.promoCode = normalizedCode;
    cart.discountPercent = promo.value;
    await cart.save();
    return buildCartPayload(user);
  }

  store.cart.promoCode = normalizedCode;
  store.cart.discountPercent = promo.value;
  return buildCartPayload(user);
}

export async function clearPromoCode(user) {
  const activeUser = await resolveCommerceUser(user);

  if (activeUser && hasDatabaseConnection()) {
    const cart = await Cart.findOne({ user: activeUser._id });
    if (cart) {
      cart.promoCode = "";
      cart.discountPercent = 0;
      await cart.save();
    }
    return buildCartPayload(user);
  }

  store.cart.promoCode = "";
  store.cart.discountPercent = 0;
  return buildCartPayload(user);
}

export async function createOrder({ paymentMethod, billingDetails, user }) {
  const activeUser = await resolveCommerceUser(user);
  const cart = await buildCartPayload(user);

  if (!cart.items.length) {
    throw new Error("Cart is empty.");
  }

  const memoryOrder = {
    id: crypto.randomUUID(),
    orderNumber: `MC-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
    paymentMethod,
    paymentProvider: "mock",
    billingDetails,
    items: cart.items,
    summary: cart.summary,
    createdAt: new Date().toISOString(),
  };

  if (activeUser && hasDatabaseConnection()) {
    const orderItems = await Promise.all(
      cart.items.map(async (item) => {
        const courseDoc = await Course.findOne({ slug: item.courseId });
        return {
          course: courseDoc?._id,
          title: item.title,
          instructorName: item.instructorName,
          thumbnail: item.thumbnail,
          price: item.price,
          originalPrice: item.originalPrice,
        };
      })
    );

    const savedOrderRecord = await Order.create({
      user: activeUser._id,
      orderNumber: memoryOrder.orderNumber,
      paymentMethod,
      paymentProvider: "mock",
      billingDetails,
      items: orderItems,
      summary: cart.summary,
    });

    await syncEnrollmentsFromOrder(activeUser._id, orderItems);

    const savedOrder = await Order.findById(savedOrderRecord._id).lean();
    const userCart = await Cart.findOne({ user: activeUser._id });
    if (userCart) {
      userCart.items = [];
      userCart.promoCode = "";
      userCart.discountPercent = 0;
      await userCart.save();
    }

    store.latestOrder = formatOrder(savedOrder);

    return store.latestOrder;
  }

  store.latestOrder = memoryOrder;
  store.cart.items = [];
  store.cart.promoCode = "";
  store.cart.discountPercent = 0;

  return memoryOrder;
}

export async function getLatestOrder(user) {
  const activeUser = await resolveCommerceUser(user);

  if (activeUser && hasDatabaseConnection()) {
    const order = await Order.findOne({ user: activeUser._id }).sort({ createdAt: -1 }).lean();
    if (!order) return null;

    return formatOrder(order);
  }

  return store.latestOrder;
}

export async function getOrderHistory(user) {
  const activeUser = await resolveCommerceUser(user);

  if (activeUser && hasDatabaseConnection()) {
    const orders = await Order.find({ user: activeUser._id }).sort({ createdAt: -1 }).lean();
    return orders.map(formatOrder);
  }

  return store.latestOrder ? [store.latestOrder] : [];
}
