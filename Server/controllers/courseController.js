import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import { sampleCourses, sampleEnrollments } from "../data/sampleData.js";

function hasDatabaseConnection() {
  return Course.db.readyState === 1;
}

function buildCourseAccess(course, enrollment) {
  return {
    isEnrolled: Boolean(enrollment),
    canAccess: Boolean(enrollment),
    enrollment: enrollment
      ? {
          progress: enrollment.progress,
          currentLesson: enrollment.currentLesson,
          completedLessons: enrollment.completedLessons,
          totalLessons: enrollment.totalLessons,
          timeSpent: enrollment.timeSpent,
          lastAccessed: enrollment.lastAccessed,
          status: enrollment.status,
          certificateEarned: enrollment.certificateEarned,
        }
      : {
          progress: 0,
          currentLesson: course.lessons?.[0]?.title || "Getting started",
          completedLessons: 0,
          totalLessons: course.lessons?.length || 0,
          timeSpent: "0h 00m",
          lastAccessed: "Not started",
          status: "not-enrolled",
          certificateEarned: false,
        },
  };
}

function formatMinutesAsTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${String(minutes).padStart(2, "0")}m`;
}

function buildNextLesson(lessons, completedLessons, fallbackCurrentLesson) {
  if (!Array.isArray(lessons) || !lessons.length) {
    return fallbackCurrentLesson || "Getting started";
  }

  if (completedLessons >= lessons.length) {
    return "Course Complete";
  }

  return lessons[completedLessons]?.title || fallbackCurrentLesson || lessons[0].title;
}

export async function getCourses(req, res) {
  const { search, category, sort = "popular", featured } = req.query;
  if (!hasDatabaseConnection()) {
    let courses = [...sampleCourses];

    if (featured === "true") {
      courses = courses.filter((course) => course.featured);
    }

    if (category) {
      courses = courses.filter((course) => course.category === category);
    }

    if (search) {
      const query = search.toLowerCase();
      courses = courses.filter((course) =>
        `${course.title} ${course.instructorName} ${course.category}`
          .toLowerCase()
          .includes(query)
      );
    }

    if (sort === "rating") courses.sort((a, b) => b.rating - a.rating);
    if (sort === "price-low") courses.sort((a, b) => a.price - b.price);
    if (sort === "price-high") courses.sort((a, b) => b.price - a.price);
    if (sort === "popular") courses.sort((a, b) => Number(b.featured) - Number(a.featured) || b.studentCount - a.studentCount);

    res.json({ courses });
    return;
  }

  const query = {};

  if (featured === "true") {
    query.featured = true;
  }

  if (category) {
    query.category = category;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { instructorName: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
    ];
  }

  let courseQuery = Course.find(query);

  if (sort === "rating") courseQuery = courseQuery.sort({ rating: -1 });
  if (sort === "price-low") courseQuery = courseQuery.sort({ price: 1 });
  if (sort === "price-high") courseQuery = courseQuery.sort({ price: -1 });
  if (sort === "newest") courseQuery = courseQuery.sort({ createdAt: -1 });
  if (sort === "popular") courseQuery = courseQuery.sort({ featured: -1, studentCount: -1 });

  const courses = await courseQuery;
  res.json({ courses });
}

export async function getCourseBySlug(req, res) {
  if (!hasDatabaseConnection()) {
    const course = sampleCourses.find(
      (item) => item.slug === req.params.courseId || item.id === req.params.courseId
    );

    if (!course) {
      res.status(404);
      throw new Error("Course not found.");
    }

    const sampleEnrollment =
      req.user?.role === "learner"
        ? sampleEnrollments.find(
            (entry) =>
              entry.userEmail === req.user.email &&
              (entry.courseSlug === course.slug || entry.courseSlug === course.id)
          )
        : null;

    res.json({
      course,
      access: buildCourseAccess(course, sampleEnrollment),
    });
    return;
  }

  const course = await Course.findOne({
    $or: [{ slug: req.params.courseId }, { _id: req.params.courseId }],
  });

  if (!course) {
    res.status(404);
    throw new Error("Course not found.");
  }

  let enrollment = null;
  if (req.user?.role === "learner") {
    enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: course._id,
    }).lean();
  }

  res.json({
    course,
    access: buildCourseAccess(course, enrollment),
  });
}

export async function updateCourseProgress(req, res) {
  if (!req.user || req.user.role !== "learner") {
    res.status(403);
    throw new Error("Learner access is required to update course progress.");
  }

  const { lessonTitle } = req.body;

  if (!lessonTitle) {
    res.status(400);
    throw new Error("lessonTitle is required.");
  }

  if (!hasDatabaseConnection()) {
    const course = sampleCourses.find(
      (item) => item.slug === req.params.courseId || item.id === req.params.courseId
    );

    if (!course) {
      res.status(404);
      throw new Error("Course not found.");
    }

    const existingEnrollment = sampleEnrollments.find(
      (entry) =>
        entry.userEmail === req.user.email &&
        (entry.courseSlug === course.slug || entry.courseSlug === course.id)
    );

    if (!existingEnrollment) {
      res.status(403);
      throw new Error("Enroll in this course before updating progress.");
    }

    const lessons = course.lessons || [];
    const targetIndex = lessons.findIndex((lesson) => lesson.title === lessonTitle);

    if (targetIndex === -1) {
      res.status(404);
      throw new Error("Lesson not found.");
    }

    const completedLessons = Math.max(existingEnrollment.completedLessons, targetIndex + 1);
    const totalLessons = lessons.length || existingEnrollment.totalLessons || 1;
    const progress = Math.min(100, Math.round((completedLessons / totalLessons) * 100));
    const status = progress >= 100 ? "completed" : "active";

    existingEnrollment.completedLessons = completedLessons;
    existingEnrollment.totalLessons = totalLessons;
    existingEnrollment.progress = progress;
    existingEnrollment.currentLesson = buildNextLesson(
      lessons,
      completedLessons,
      existingEnrollment.currentLesson
    );
    existingEnrollment.timeSpent = formatMinutesAsTime(completedLessons * 20);
    existingEnrollment.lastAccessed = "Just now";
    existingEnrollment.status = status;
    existingEnrollment.certificateEarned = progress >= 100;

    res.json({
      message: progress >= 100 ? "Course completed." : "Lesson progress updated.",
      progress: buildCourseAccess(course, existingEnrollment),
    });
    return;
  }

  const course = await Course.findOne({
    $or: [{ slug: req.params.courseId }, { _id: req.params.courseId }],
  }).lean();

  if (!course) {
    res.status(404);
    throw new Error("Course not found.");
  }

  const enrollment = await Enrollment.findOne({
    user: req.user._id,
    course: course._id,
  });

  if (!enrollment) {
    res.status(403);
    throw new Error("Enroll in this course before updating progress.");
  }

  const lessons = course.lessons || [];
  const targetIndex = lessons.findIndex((lesson) => lesson.title === lessonTitle);

  if (targetIndex === -1) {
    res.status(404);
    throw new Error("Lesson not found.");
  }

  const completedLessons = Math.max(enrollment.completedLessons, targetIndex + 1);
  const totalLessons = lessons.length || enrollment.totalLessons || 1;
  const progress = Math.min(100, Math.round((completedLessons / totalLessons) * 100));

  enrollment.completedLessons = completedLessons;
  enrollment.totalLessons = totalLessons;
  enrollment.progress = progress;
  enrollment.currentLesson = buildNextLesson(lessons, completedLessons, enrollment.currentLesson);
  enrollment.timeSpent = formatMinutesAsTime(completedLessons * 20);
  enrollment.lastAccessed = "Just now";
  enrollment.status = progress >= 100 ? "completed" : "active";
  enrollment.certificateEarned = progress >= 100;
  await enrollment.save();

  res.json({
    message: progress >= 100 ? "Course completed." : "Lesson progress updated.",
    progress: buildCourseAccess(course, enrollment.toObject()),
  });
}
