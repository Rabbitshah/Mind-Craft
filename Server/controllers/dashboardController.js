import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import User from "../models/User.js";
import { instructorDashboardData, learnerDashboardData, sampleCourses } from "../data/sampleData.js";

function hasDatabaseConnection() {
  return Course.db.readyState === 1;
}

export async function getLearnerDashboard(req, res) {
  if (hasDatabaseConnection()) {
    if (req.user && req.user.role !== "learner") {
      res.status(403);
      throw new Error("Learner access is required for this dashboard.");
    }

    const learner = req.user ? await User.findById(req.user._id).lean() : await User.findOne({ role: "learner" }).lean();

    if (learner) {
      const enrollments = await Enrollment.find({ user: learner._id }).populate("course").lean();

      if (enrollments.length) {
        const completedCourses = enrollments.filter((entry) => entry.status === "completed").length;
        const totalMinutes = enrollments.reduce((sum, entry) => {
          const match = String(entry.timeSpent || "").match(/(\d+)h\s*(\d+)m/i);
          if (!match) return sum;
          return sum + Number(match[1]) * 60 + Number(match[2]);
        }, 0);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        res.json({
          dashboard: {
            stats: {
              enrolledCourses: enrollments.length,
              completedCourses,
              learningTime: `${hours}h ${String(minutes).padStart(2, "0")}m`,
              certificates: enrollments.filter((entry) => entry.certificateEarned).length,
            },
            currentCourses: enrollments.slice(0, 2).map((entry) => ({
              courseId: entry.course.slug,
              progress: entry.progress,
              currentLesson: entry.currentLesson,
              completedLessons: entry.completedLessons,
              totalLessons: entry.totalLessons,
              timeSpent: entry.timeSpent,
              lastAccessed: entry.lastAccessed,
              course: entry.course,
            })),
            analytics: learnerDashboardData.analytics,
            upcomingSessions: learnerDashboardData.upcomingSessions,
          },
        });
        return;
      }
    }
  }

  const courseLookup = new Map(sampleCourses.map((course) => [course.slug, course]));
  const currentCourses = learnerDashboardData.currentCourses.map((entry) => {
    const course = courseLookup.get(entry.courseId);
    return {
      ...entry,
      course: course || null,
    };
  });

  res.json({
    dashboard: {
      ...learnerDashboardData,
      currentCourses,
    },
  });
}

export async function getInstructorDashboard(req, res) {
  let dashboardCourses = instructorDashboardData.courses;
  let dashboardStats = instructorDashboardData.stats;

  if (hasDatabaseConnection()) {
    if (req.user && req.user.role !== "instructor") {
      res.status(403);
      throw new Error("Instructor access is required for this dashboard.");
    }

    const courseQuery = req.user ? { instructorName: req.user.name } : {};
    const liveCourses = await Course.find(courseQuery).sort({ studentCount: -1 }).limit(3);
    if (liveCourses.length) {
      const allCourses = await Course.find(courseQuery).lean();
      const lifetimeRevenue = allCourses.reduce(
        (sum, course) => sum + Math.round(course.studentCount * course.price),
        0
      );
      const totalStudents = allCourses.reduce((sum, course) => sum + course.studentCount, 0);
      const averageRating =
        allCourses.reduce((sum, course) => sum + course.rating, 0) / allCourses.length;

      dashboardCourses = liveCourses.map((course) => ({
        title: course.title,
        students: course.studentCount,
        revenue: `$${Math.round(course.studentCount * course.price).toLocaleString()}`,
        rating: course.rating,
        reviews: course.reviewCount,
        status: "Published",
      }));

      dashboardStats = {
        revenueMonth: `$${Math.round(lifetimeRevenue * 0.095).toLocaleString()}`,
        totalStudents: totalStudents.toLocaleString(),
        averageRating: averageRating.toFixed(1),
        publishedCourses: String(allCourses.length),
        lifetimeEarnings: `$${lifetimeRevenue.toLocaleString()}`,
      };
    }
  }

  res.json({
    dashboard: {
      ...instructorDashboardData,
      stats: dashboardStats,
      courses: dashboardCourses,
    },
  });
}
