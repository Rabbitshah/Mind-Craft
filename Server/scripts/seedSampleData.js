import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDatabase } from "../config/db.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import User from "../models/User.js";
import {
  sampleCourses,
  sampleEnrollments,
  sampleUsers,
} from "../data/sampleData.js";

dotenv.config();

async function seedCourses() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required to run the seed script.");
  }

  await connectDatabase();

  for (const course of sampleCourses) {
    await Course.findOneAndUpdate(
      { slug: course.slug },
      {
        title: course.title,
        slug: course.slug,
        description: course.description,
        category: course.category,
        level: course.level,
        price: course.price,
        originalPrice: course.originalPrice,
        duration: course.duration,
        thumbnail: course.thumbnail,
        instructorName: course.instructorName,
        instructorTitle: course.instructorTitle,
        rating: course.rating,
        reviewCount: course.reviewCount,
        studentCount: course.studentCount,
        lessons: course.lessons,
        learningOutcomes: course.learningOutcomes,
        reviews: course.reviews,
        featured: course.featured,
        trending: course.trending,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  console.log(`Seeded ${sampleCourses.length} sample courses.`);
}

async function seedUsersAndEnrollments() {
  const userMap = new Map();
  const courseMap = new Map();

  for (const user of sampleUsers) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const savedUser = await User.findOneAndUpdate(
      { email: user.email },
      {
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: user.role,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    userMap.set(user.email, savedUser);
  }

  const courses = await Course.find({
    slug: { $in: sampleEnrollments.map((entry) => entry.courseSlug) },
  });

  courses.forEach((course) => {
    courseMap.set(course.slug, course);
  });

  for (const enrollment of sampleEnrollments) {
    const user = userMap.get(enrollment.userEmail);
    const course = courseMap.get(enrollment.courseSlug);

    if (!user || !course) continue;

    await Enrollment.findOneAndUpdate(
      { user: user._id, course: course._id },
      {
        user: user._id,
        course: course._id,
        progress: enrollment.progress,
        currentLesson: enrollment.currentLesson,
        completedLessons: enrollment.completedLessons,
        totalLessons: enrollment.totalLessons,
        timeSpent: enrollment.timeSpent,
        lastAccessed: enrollment.lastAccessed,
        status: enrollment.status,
        certificateEarned: enrollment.certificateEarned,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  console.log(`Seeded ${sampleUsers.length} users and ${sampleEnrollments.length} enrollments.`);
}

seedCourses()
  .then(seedUsersAndEnrollments)
  .then(async () => {
    await mongoose.disconnect();
    console.log("Seed script completed.");
  })
  .catch(async (error) => {
    console.error("Seed script failed:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  });
