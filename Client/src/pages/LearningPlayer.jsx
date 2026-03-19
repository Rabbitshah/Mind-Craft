import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Badge, Button, ProgressBar, Textarea } from "../components/primitives";
import { Icon } from "../components/Icons";
import { getCourseById, updateCourseProgress } from "../api/courseApi";

function resolveLessonIndex(course, access, requestedLesson) {
  const lessons = course?.lessons || [];
  if (!lessons.length) return 0;

  const requestedIndex = Number(requestedLesson);
  if (Number.isInteger(requestedIndex) && requestedIndex >= 0 && requestedIndex < lessons.length) {
    return requestedIndex;
  }

  const currentLessonTitle = access?.enrollment?.currentLesson;
  const currentIndex = lessons.findIndex((lesson) => lesson.title === currentLessonTitle);

  return currentIndex >= 0 ? currentIndex : 0;
}

function buildFallbackSummary(course, lesson) {
  return `${lesson?.title || "This lesson"} builds on ${course?.title || "the course"} with a practical walkthrough designed to help you apply the concepts immediately.`;
}

function buildFallbackObjectives(lesson) {
  return [
    `Understand the core ideas behind ${lesson?.title || "this lesson"}`,
    `Apply the lesson in a guided practical workflow`,
    "Leave with a concrete next step for your project",
  ];
}

function buildFallbackResources(course, lesson) {
  return [
    { title: `${lesson?.title || "Lesson"} notes`, type: "guide" },
    { title: `${course?.category || "Course"} reference sheet`, type: "reference" },
    { title: "Practice prompt", type: "worksheet" },
  ];
}

export function LearningPlayerPage() {
  const { courseId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [course, setCourse] = useState(null);
  const [access, setAccess] = useState(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [progressMessage, setProgressMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState("");

  const noteStorageKey = useMemo(
    () => `mindcraft_notes_${courseId}_${activeLessonIndex}`,
    [courseId, activeLessonIndex]
  );

  useEffect(() => {
    let ignore = false;

    async function loadCourse() {
      try {
        setLoading(true);
        setError("");
        const data = await getCourseById(courseId);

        if (!ignore) {
          if (!data.access?.canAccess) {
            setError("You need to enroll in this course before you can start learning.");
            setCourse(data.course);
            setAccess(data.access || null);
            return;
          }

          setCourse(data.course);
          setAccess(data.access || null);
          setActiveLessonIndex(resolveLessonIndex(data.course, data.access, searchParams.get("lesson")));
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
  }, [courseId, searchParams]);

  useEffect(() => {
    const savedNotes = localStorage.getItem(noteStorageKey) || "";
    setNotes(savedNotes);
  }, [noteStorageKey]);

  const lessons = course?.lessons || [];
  const activeLesson = lessons[activeLessonIndex];
  const enrollment = access?.enrollment;
  const completedLessons = enrollment?.completedLessons || 0;
  const isCompleted = completedLessons > activeLessonIndex;
  const isLastLesson = activeLessonIndex >= lessons.length - 1;

  const completionLabel = useMemo(() => {
    if (!lessons.length) return "No lessons available";
    if (enrollment?.status === "completed") return "Course completed";
    return `${completedLessons} of ${lessons.length} lessons completed`;
  }, [completedLessons, enrollment?.status, lessons.length]);
  const lessonSummary = activeLesson?.summary || buildFallbackSummary(course, activeLesson);
  const lessonObjectives =
    activeLesson?.objectives?.length ? activeLesson.objectives : buildFallbackObjectives(activeLesson);
  const lessonResources =
    activeLesson?.resources?.length ? activeLesson.resources : buildFallbackResources(course, activeLesson);

  async function markCurrentLessonComplete() {
    if (!activeLesson?.title || isCompleted) return;

    try {
      setSaving(true);
      setProgressMessage("");
      const data = await updateCourseProgress(course.slug || course.id, activeLesson.title);
      setAccess(data.progress);
      setProgressMessage(data.message);

      if (!isLastLesson) {
        const nextIndex = activeLessonIndex + 1;
        setActiveLessonIndex(nextIndex);
        setSearchParams({ lesson: String(nextIndex) });
      }
    } catch (requestError) {
      setProgressMessage(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  function goToLesson(index) {
    setActiveLessonIndex(index);
    setSearchParams({ lesson: String(index) });
    setProgressMessage("");
  }

  function handleNotesChange(value) {
    setNotes(value);
    localStorage.setItem(noteStorageKey, value);
  }

  if (loading) {
    return (
      <div className="app-shell">
        <Header />
        <div className="page-section py-20 text-center text-[var(--muted-foreground)]">
          Loading learning session...
        </div>
      </div>
    );
  }

  if (error && !course) {
    return (
      <div className="app-shell">
        <Header />
        <div className="page-section py-20 text-center">
          <p className="text-[var(--danger)]">{error}</p>
          <Link to="/learn">
            <Button variant="outline" className="mt-4">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Header />

      <div className="page-section py-12">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              to={`/courses/${course.slug || course.id}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)]"
            >
              <Icon name="arrowLeft" className="h-4 w-4" />
              Back to course overview
            </Link>
            <h1 className="mt-4 text-4xl font-black text-[var(--foreground)]">{course.title}</h1>
            <p className="mt-3 max-w-3xl text-[var(--muted-foreground)]">{course.description}</p>
          </div>
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-white px-5 py-4">
            <p className="text-sm font-semibold text-[var(--foreground)]">Your progress</p>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">{completionLabel}</p>
            <ProgressBar className="mt-3" value={enrollment?.progress || 0} />
          </div>
        </div>

        {error ? (
          <div className="mb-8 rounded-[1.5rem] border border-[#fecaca] bg-[#fff5f5] px-5 py-4 text-sm text-[var(--danger)]">
            {error}
          </div>
        ) : null}

        <div className="grid gap-8 lg:grid-cols-[1fr,340px]">
          <div className="space-y-8">
            <div className="rounded-[2rem] border border-[var(--border)] bg-white p-8">
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="primary">Lesson {activeLessonIndex + 1}</Badge>
              {isCompleted ? <Badge tone="success">Completed</Badge> : null}
              {activeLesson?.preview ? <Badge tone="accent">Preview Lesson</Badge> : null}
            </div>

            <h2 className="mt-5 text-3xl font-black text-[var(--foreground)]">
              {activeLesson?.title || "Course lesson"}
            </h2>
            <p className="mt-3 text-sm text-[var(--muted-foreground)]">
              Duration: {activeLesson?.duration || "Self-paced"}
            </p>

            <div className="mt-8 rounded-[2rem] bg-[var(--background)] p-8">
              <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-full bg-[var(--primary)] text-white">
                <Icon name="play" className="h-8 w-8" />
              </div>
              <p className="mx-auto mt-5 max-w-2xl text-center text-[var(--muted-foreground)]">
                {lessonSummary}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() => goToLesson(Math.max(activeLessonIndex - 1, 0))}
                disabled={activeLessonIndex === 0}
              >
                <Icon name="arrowLeft" className="h-4 w-4" />
                Previous Lesson
              </Button>
              <Button onClick={markCurrentLessonComplete} disabled={saving || isCompleted || !activeLesson}>
                <Icon name="check" className="h-4 w-4" />
                {isCompleted ? "Completed" : saving ? "Saving..." : "Mark Lesson Complete"}
              </Button>
              <Button
                variant="soft"
                onClick={() => goToLesson(Math.min(activeLessonIndex + 1, lessons.length - 1))}
                disabled={isLastLesson || !lessons.length}
              >
                Next Lesson
                <Icon name="arrowRight" className="h-4 w-4" />
              </Button>
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

            <div className="grid gap-8 xl:grid-cols-[1fr,320px]">
              <div className="rounded-[2rem] border border-[var(--border)] bg-white p-8">
                <h3 className="text-2xl font-bold text-[var(--foreground)]">Key Takeaways</h3>
                <div className="mt-5 space-y-4">
                  {lessonObjectives.map((objective) => (
                    <div
                      key={objective}
                      className="flex items-start gap-3 rounded-[1.5rem] bg-[var(--background)] p-4"
                    >
                      <Icon name="check" className="mt-1 h-5 w-5 text-[var(--success)]" />
                      <span className="text-[var(--foreground)]">{objective}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-[var(--border)] bg-white p-6">
                <h3 className="text-lg font-bold text-[var(--foreground)]">Lesson Resources</h3>
                <div className="mt-4 space-y-3">
                  {lessonResources.map((resource) => (
                    <div
                      key={`${resource.title}-${resource.type}`}
                      className="flex items-center justify-between rounded-[1.5rem] bg-[var(--background)] px-4 py-4"
                    >
                      <div>
                        <p className="font-semibold text-[var(--foreground)]">{resource.title}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                          {resource.type}
                        </p>
                      </div>
                      <Button variant="soft" size="sm">
                        <Icon name="download" className="h-4 w-4" />
                        Open
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[var(--border)] bg-white p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-[var(--foreground)]">My Notes</h3>
                  <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                    Notes are saved locally in your browser for this lesson.
                  </p>
                </div>
                <Badge tone="primary">Autosaved</Badge>
              </div>
              <Textarea
                className="mt-5 min-h-[180px]"
                value={notes}
                onChange={(event) => handleNotesChange(event.target.value)}
                placeholder="Write down key ideas, examples, and action items from this lesson..."
              />
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-[var(--border)] bg-white p-6">
              <h3 className="text-lg font-bold text-[var(--foreground)]">Course Lessons</h3>
              <div className="mt-4 space-y-3">
                {lessons.map((lesson, index) => {
                  const lessonComplete = completedLessons > index;
                  const lessonActive = index === activeLessonIndex;

                  return (
                    <button
                      key={lesson.title}
                      type="button"
                      onClick={() => goToLesson(index)}
                      className={`w-full rounded-[1.5rem] border px-4 py-4 text-left transition ${
                        lessonActive
                          ? "border-[var(--primary)] bg-[var(--primary-100)]"
                          : "border-[var(--border)] bg-[var(--background)] hover:border-[var(--primary)]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-[var(--foreground)]">
                            Lesson {index + 1}
                          </p>
                          <p className="mt-1 text-sm text-[var(--muted-foreground)]">{lesson.title}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {lessonComplete ? <Badge tone="success">Done</Badge> : null}
                          <Icon
                            name={lessonComplete ? "check" : "play"}
                            className={`h-4 w-4 ${
                              lessonComplete ? "text-[var(--success)]" : "text-[var(--primary)]"
                            }`}
                          />
                        </div>
                      </div>
                      <p className="mt-3 text-xs text-[var(--muted-foreground)]">
                        {lesson.duration || "Self-paced"}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mesh-card rounded-[2rem] p-6 text-white">
              <h3 className="text-2xl font-black">Next Up</h3>
              <p className="mt-3 text-sm text-white/80">
                Current lesson: {enrollment?.currentLesson || activeLesson?.title || "Getting started"}
              </p>
              <p className="mt-2 text-sm text-white/80">
                Time invested: {enrollment?.timeSpent || "0h 00m"}
              </p>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
