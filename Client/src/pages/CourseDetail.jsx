import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AIAssistantPanel } from "../components/AIAssistantPanel";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import {
  Badge,
  Button,
  ImageFallback,
  ProgressBar,
  Separator,
  TabPanel,
  Tabs,
} from "../components/primitives";
import { Icon } from "../components/Icons";
import { addToCart } from "../api/commerceApi";
import { getCourseById, getCourses, updateCourseProgress } from "../api/courseApi";
import { AuthContext } from "../context/AuthContext";

export function CourseDetail() {
  const { courseId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [openModules, setOpenModules] = useState([0]);
  const [showAssistant, setShowAssistant] = useState(false);
  const [course, setCourse] = useState(null);
  const [access, setAccess] = useState(null);
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartMessage, setCartMessage] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);
  const [progressMessage, setProgressMessage] = useState("");
  const [activeLesson, setActiveLesson] = useState("");
  const [updatingLesson, setUpdatingLesson] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadCourse() {
      setLoading(true);
      setError("");

      try {
        const [courseData, relatedData] = await Promise.all([getCourseById(courseId), getCourses()]);

        if (!ignore) {
          setCourse(courseData.course);
          setAccess(courseData.access || null);
          setActiveLesson(
            courseData.access?.enrollment?.currentLesson ||
              courseData.access?.currentLesson ||
              courseData.course?.lessons?.[0]?.title ||
              ""
          );
          setRelatedCourses(
            (relatedData.courses || []).filter((item) => item.slug !== courseId).slice(0, 2)
          );
        }
      } catch (requestError) {
        if (!ignore) {
          setError(requestError.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadCourse();

    return () => {
      ignore = true;
    };
  }, [courseId, user?.id]);

  const toggleModule = (index) => {
    setOpenModules((current) =>
      current.includes(index) ? current.filter((item) => item !== index) : [...current, index]
    );
  };

  async function handleAddToCart() {
    try {
      setAddingToCart(true);
      setCartMessage("");
      const data = await addToCart(course.slug || course.id);
      setCartMessage(data.message);
    } catch (requestError) {
      setCartMessage(requestError.message);
    } finally {
      setAddingToCart(false);
    }
  }

  async function handleCompleteLesson(lessonTitle) {
    try {
      setUpdatingLesson(lessonTitle);
      setProgressMessage("");
      const data = await updateCourseProgress(course.slug || course.id, lessonTitle);
      setAccess(data.progress);
      setActiveLesson(data.progress.enrollment.currentLesson);
      setProgressMessage(data.message);
    } catch (requestError) {
      setProgressMessage(requestError.message);
    } finally {
      setUpdatingLesson("");
    }
  }

  if (loading) {
    return (
      <div className="app-shell">
        <Header />
        <div className="page-section py-20 text-center text-[var(--muted-foreground)]">
          Loading course...
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="app-shell">
        <Header />
        <div className="page-section py-20 text-center">
          <p className="text-[var(--danger)]">{error || "Course not found."}</p>
          <Link to="/courses">
            <Button variant="outline" className="mt-4">
              Back to Catalog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const curriculum = [
    {
      title: "Course Lessons",
      duration: course.duration,
      lessons: course.lessons || [],
    },
  ];
  const enrollment = access?.enrollment || null;
  const isLearner = user?.role === "learner";
  const canAccessCourse = Boolean(access?.canAccess);

  return (
    <div className="app-shell">
      <Header />

      <section className="mesh-card py-14 text-white">
        <div className="page-section grid gap-10 lg:grid-cols-[1.3fr,0.7fr]">
          <div>
            <div className="mb-4 flex gap-3">
              <Badge tone="accent">Best Seller</Badge>
              <Badge className="bg-white/10 text-white">{course.category}</Badge>
            </div>
            <h1 className="editorial-title text-5xl font-black">{course.title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/80">
              Master a full creative workflow from research to production handoff with lessons
              that stay practical and portfolio-driven.
            </p>
            <div className="mt-6 flex flex-wrap gap-5 text-sm text-white/80">
              <span className="inline-flex items-center gap-2">
                <Icon name="star" className="h-4 w-4 text-[var(--accent)]" />
                {course.rating} ({course.reviewCount} reviews)
              </span>
              <span className="inline-flex items-center gap-2">
                <Icon name="users" className="h-4 w-4" />
                {course.studentCount.toLocaleString()} students
              </span>
              <span className="inline-flex items-center gap-2">
                <Icon name="clock" className="h-4 w-4" />
                {course.duration}
              </span>
            </div>
            <div className="mt-8 flex items-center gap-4 rounded-[1.5rem] bg-white/10 p-4">
              <ImageFallback
                src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=80"
                alt={course.instructorName}
                className="h-16 w-16 rounded-2xl object-cover"
              />
              <div>
                <p className="text-sm text-white/70">Created by</p>
                <p className="text-lg font-bold">{course.instructorName}</p>
                <p className="text-sm text-white/70">{course.instructorTitle}</p>
              </div>
            </div>
          </div>

          <aside className="course-card-shadow rounded-[2rem] bg-white p-5 text-[var(--foreground)]">
            <div className="overflow-hidden rounded-[1.5rem]">
              <ImageFallback
                src={course.thumbnail}
                alt={course.title}
                className="h-[220px] w-full object-cover"
              />
            </div>
            <div className="mt-5 flex items-end gap-3">
              <span className="text-4xl font-black">${course.price}</span>
              <span className="text-sm text-[var(--muted-foreground)] line-through">
                ${course.originalPrice}
              </span>
            </div>
            {canAccessCourse ? (
              <div className="mt-5 rounded-[1.5rem] bg-[var(--background)] p-4">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-semibold text-[var(--foreground)]">Your progress</span>
                  <span className="font-semibold text-[var(--primary)]">
                    {enrollment?.progress || 0}%
                  </span>
                </div>
                <ProgressBar value={enrollment?.progress || 0} />
                <p className="mt-3 text-sm text-[var(--muted-foreground)]">
                  Current lesson: {activeLesson || enrollment?.currentLesson}
                </p>
              </div>
            ) : null}
            <div className="mt-6 space-y-3">
              {canAccessCourse ? (
                <Button className="w-full" onClick={() => navigate(`/learn/${course.slug || course.id}`)}>
                  <Icon name="play" className="h-5 w-5" />
                  Continue Learning
                </Button>
              ) : (
                <Button className="w-full" onClick={handleAddToCart} disabled={addingToCart}>
                  <Icon name="cart" className="h-5 w-5" />
                  {addingToCart ? "Adding..." : "Add to Cart"}
                </Button>
              )}
              <Button variant="outline" className="w-full" disabled={canAccessCourse}>
                {canAccessCourse ? "Enrolled" : "Buy Now"}
              </Button>
            </div>
            {cartMessage ? (
              <p
                className={`mt-3 text-sm ${
                  cartMessage.toLowerCase().includes("added")
                    ? "text-[var(--success)]"
                    : "text-[var(--danger)]"
                }`}
              >
                {cartMessage}
              </p>
            ) : null}
            <Separator className="my-6" />
            <div className="space-y-3 text-sm text-[var(--muted-foreground)]">
              {[
                `${course.duration} of lessons`,
                "Resources and templates",
                "Certificate of completion",
                "Lifetime access",
                "Access on desktop and mobile",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <Icon name="check" className="h-4 w-4 text-[var(--success)]" />
                  {item}
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <div className="page-section py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr,320px]">
          <div>
            <Tabs
              tabs={[
                { value: "overview", label: "Overview" },
                { value: "curriculum", label: "Curriculum" },
                { value: "instructor", label: "Instructor" },
                { value: "reviews", label: "Reviews" },
              ]}
              defaultTab="overview"
            >
              <TabPanel value="overview">
                <div className="rounded-[2rem] border border-[var(--border)] bg-white p-8">
                  <h2 className="text-2xl font-bold">What you'll learn</h2>
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {(course.learningOutcomes || []).map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-3 rounded-[1.5rem] bg-[var(--background)] p-4"
                      >
                        <Icon name="check" className="mt-1 h-5 w-5 text-[var(--success)]" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabPanel>
              <TabPanel value="curriculum">
                <div className="rounded-[2rem] border border-[var(--border)] bg-white p-8">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Course Curriculum</h2>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      {curriculum.length} modules
                    </p>
                  </div>
                  <div className="space-y-4">
                    {curriculum.map((module, index) => (
                      <div
                        key={module.title}
                        className="overflow-hidden rounded-[1.5rem] border border-[var(--border)]"
                      >
                        <button
                          type="button"
                          onClick={() => toggleModule(index)}
                          className="flex w-full items-center justify-between bg-white px-5 py-4 text-left"
                        >
                          <div>
                            <p className="font-semibold">{module.title}</p>
                            <p className="text-sm text-[var(--muted-foreground)]">
                              {module.lessons.length} lessons · {module.duration}
                            </p>
                          </div>
                          <Icon
                            name={openModules.includes(index) ? "chevronUp" : "chevronDown"}
                            className="h-5 w-5 text-[var(--muted-foreground)]"
                          />
                        </button>
                        {openModules.includes(index) ? (
                          <div className="space-y-3 bg-[var(--background)] px-5 py-4">
                            {module.lessons.map((lesson, lessonIndex) => {
                              const lessonTitle = lesson.title || lesson;
                              const isCompleted = (enrollment?.completedLessons || 0) > lessonIndex;
                              const isCurrentLesson = activeLesson === lessonTitle;

                              return (
                                <div
                                  key={lessonTitle}
                                  className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3"
                                >
                                  <span className="flex items-center gap-2 text-sm">
                                    <Icon
                                      name={isCompleted ? "check" : "play"}
                                      className={`h-4 w-4 ${
                                        isCompleted
                                          ? "text-[var(--success)]"
                                          : "text-[var(--primary)]"
                                      }`}
                                    />
                                    <span>
                                      {lessonTitle}
                                      {isCurrentLesson ? (
                                        <span className="ml-2 text-xs font-semibold text-[var(--primary)]">
                                          Current
                                        </span>
                                      ) : null}
                                    </span>
                                  </span>
                                  <div className="flex items-center gap-3">
                                    <span className="text-xs text-[var(--muted-foreground)]">
                                      {lesson.duration || "Preview"}
                                    </span>
                                    {canAccessCourse && isLearner ? (
                                      <Button
                                        variant={isCompleted ? "outline" : "soft"}
                                        className="h-9 px-3 text-xs"
                                        onClick={() => handleCompleteLesson(lessonTitle)}
                                        disabled={isCompleted || updatingLesson === lessonTitle}
                                      >
                                        {isCompleted
                                          ? "Completed"
                                          : updatingLesson === lessonTitle
                                            ? "Saving..."
                                            : "Mark Complete"}
                                      </Button>
                                    ) : null}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                  {progressMessage ? (
                    <p
                      className={`mt-4 text-sm ${
                        progressMessage.toLowerCase().includes("updated") ||
                        progressMessage.toLowerCase().includes("completed")
                          ? "text-[var(--success)]"
                          : "text-[var(--danger)]"
                      }`}
                    >
                      {progressMessage}
                    </p>
                  ) : null}
                </div>
              </TabPanel>
              <TabPanel value="instructor">
                <div className="rounded-[2rem] border border-[var(--border)] bg-white p-8">
                  <div className="flex flex-col gap-6 md:flex-row">
                    <ImageFallback
                      src="https://images.unsplash.com/photo-1544723795-432537d12f6c?auto=format&fit=crop&w=400&q=80"
                      alt={course.instructorName}
                      className="h-36 w-36 rounded-[2rem] object-cover"
                    />
                    <div>
                      <h2 className="text-3xl font-black">{course.instructorName}</h2>
                      <p className="mt-2 text-[var(--primary)]">{course.instructorTitle}</p>
                      <p className="mt-4 leading-8 text-[var(--muted-foreground)]">
                        {course.description}
                      </p>
                    </div>
                  </div>
                </div>
              </TabPanel>
              <TabPanel value="reviews">
                <div className="rounded-[2rem] border border-[var(--border)] bg-white p-8">
                  <div className="mb-8 grid gap-6 md:grid-cols-[220px,1fr]">
                    <div className="rounded-[1.5rem] bg-[var(--background)] p-6 text-center">
                      <p className="text-5xl font-black">{course.rating}</p>
                      <div className="mt-3 flex justify-center gap-1 text-[var(--accent)]">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Icon key={index} name="star" className="h-5 w-5" />
                        ))}
                      </div>
                      <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                        Course rating
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span>5 star</span>
                          <span>85%</span>
                        </div>
                        <ProgressBar value={85} />
                      </div>
                      <div>
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span>4 star</span>
                          <span>10%</span>
                        </div>
                        <ProgressBar value={10} />
                      </div>
                      <div>
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span>3 star and below</span>
                          <span>5%</span>
                        </div>
                        <ProgressBar value={5} />
                      </div>
                    </div>
                  </div>
                  {(course.reviews || []).map((review) => (
                    <div key={review} className="mb-4 rounded-[1.5rem] bg-[var(--background)] p-5">
                      <div className="mb-3 flex gap-1 text-[var(--accent)]">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Icon key={index} name="star" className="h-4 w-4" />
                        ))}
                      </div>
                      <p className="leading-7 text-[var(--foreground)]">{review}</p>
                    </div>
                  ))}
                </div>
              </TabPanel>
            </Tabs>
          </div>

          <aside className="space-y-6">
            <div className="mesh-card rounded-[2rem] p-6 text-white">
              <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-white/20">
                <Icon name="sparkles" className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-2xl font-black">AI Learning Assistant</h3>
              <p className="mt-3 text-sm leading-7 text-white/80">
                The generated AI panel is now rebuilt locally and can sit on top of the course
                experience without any external component imports.
              </p>
              <Button variant="soft" className="mt-5 w-full" onClick={() => setShowAssistant(true)}>
                Try AI Assistant
              </Button>
            </div>

            <div className="rounded-[2rem] border border-[var(--border)] bg-white p-6">
              <h3 className="text-lg font-bold">Students also bought</h3>
              <div className="mt-4 space-y-4">
                {relatedCourses.map((item) => (
                  <Link
                    key={item.id || item.slug}
                    to={`/courses/${item.slug || item.id}`}
                    className="flex gap-3 rounded-[1.5rem] bg-[var(--background)] p-3"
                  >
                    <ImageFallback
                      src={item.thumbnail}
                      alt={item.title}
                      className="h-18 w-24 rounded-[1rem] object-cover"
                    />
                    <div>
                      <p className="line-clamp-2 text-sm font-semibold">{item.title}</p>
                      <p className="mt-2 text-sm font-bold">${item.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {showAssistant ? <AIAssistantPanel onClose={() => setShowAssistant(false)} /> : null}
      <Footer />
    </div>
  );
}
