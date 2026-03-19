import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    duration: { type: String, default: "" },
    preview: { type: Boolean, default: false },
    summary: { type: String, default: "" },
    objectives: { type: [String], default: [] },
    resources: {
      type: [
        new mongoose.Schema(
          {
            title: { type: String, default: "" },
            type: { type: String, default: "guide" },
          },
          { _id: false }
        ),
      ],
      default: [],
    },
  },
  { _id: false }
);

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    category: { type: String, default: "Design" },
    level: { type: String, default: "Beginner" },
    price: { type: Number, default: 0 },
    originalPrice: { type: Number, default: 0 },
    duration: { type: String, default: "" },
    thumbnail: { type: String, default: "" },
    instructorName: { type: String, default: "" },
    instructorTitle: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    studentCount: { type: Number, default: 0 },
    lessons: { type: [lessonSchema], default: [] },
    learningOutcomes: { type: [String], default: [] },
    reviews: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;
