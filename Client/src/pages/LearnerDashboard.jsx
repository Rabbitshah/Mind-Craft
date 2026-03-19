import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import {
  Badge,
  Button,
  ImageFallback,
  ProgressBar,
  SectionHeading,
  StatBars,
  TabPanel,
  Tabs,
} from "../components/primitives";
import { Icon } from "../components/Icons";
import { getLearnerDashboard } from "../api/dashboardApi";

export function LearnerDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadDashboard() {
      try {
        setLoading(true);
        const data = await getLearnerDashboard();
        if (!ignore) {
          setDashboard(data.dashboard);
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

    loadDashboard();

    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return <div className="app-shell"><Header /><div className="page-section py-20 text-center text-[var(--muted-foreground)]">Loading learner dashboard...</div></div>;
  }

  if (error || !dashboard) {
    return <div className="app-shell"><Header /><div className="page-section py-20 text-center text-[var(--danger)]">{error || "Unable to load learner dashboard."}</div></div>;
  }

  return (
    <div className="app-shell">
      <Header />

      <div className="page-section py-12">
        <SectionHeading
          eyebrow="Learner Dashboard"
          title="My Learning"
          description="The dashboard layouts from the generated designs are now mapped into the current project with local cards, tabs, progress bars, and stat sections."
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            [String(dashboard.stats.enrolledCourses), "Courses Enrolled", "book"],
            [String(dashboard.stats.completedCourses), "Completed", "check"],
            [dashboard.stats.learningTime, "Learning Time", "clock"],
            [String(dashboard.stats.certificates), "Certificates", "award"],
          ].map(([value, label, icon]) => (
            <div key={label} className="rounded-[2rem] border border-[var(--border)] bg-white p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-[var(--primary-100)] text-[var(--primary)]">
                <Icon name={icon} className="h-6 w-6" />
              </div>
              <p className="mt-5 text-3xl font-black">{value}</p>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr,320px]">
          <div className="space-y-8">
            <div>
              <h2 className="mb-5 text-2xl font-bold">Continue Learning</h2>
              <div className="space-y-5">
                {dashboard.currentCourses.map((item) => (
                  <div key={item.courseId} className="rounded-[2rem] border border-[var(--border)] bg-white p-6">
                    <div className="grid gap-5 md:grid-cols-[240px,1fr]">
                      <div className="relative overflow-hidden rounded-[1.5rem]">
                        <ImageFallback
                          src={item.course?.thumbnail}
                          alt={item.course?.title || "Course"}
                          className="min-h-[180px] w-full object-cover"
                        />
                        <div className="absolute left-4 top-4">
                          <Badge className="bg-black/45 text-white">{item.lastAccessed}</Badge>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{item.course?.title}</h3>
                        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                          by {item.course?.instructorName}
                        </p>
                        <div className="mt-5">
                          <div className="mb-2 flex items-center justify-between text-sm">
                            <span>
                              {item.completedLessons} of {item.totalLessons} lessons complete
                            </span>
                            <span className="font-semibold text-[var(--primary)]">
                              {item.progress}%
                            </span>
                          </div>
                          <ProgressBar value={item.progress} />
                        </div>
                        <div className="mt-4 flex items-center gap-4 text-sm text-[var(--muted-foreground)]">
                          <span className="inline-flex items-center gap-1">
                            <Icon name="clock" className="h-4 w-4" />
                            {item.timeSpent}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Icon name="play" className="h-4 w-4" />
                            {item.currentLesson}
                          </span>
                        </div>
                        <Link to={`/learn/${item.course?.slug || item.courseId}`}>
                          <Button className="mt-5">
                            Continue Course
                            <Icon name="arrowRight" className="h-5 w-5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-5 text-2xl font-bold">Learning Analytics</h2>
              <Tabs
                tabs={[
                  { value: "weekly", label: "Weekly" },
                  { value: "monthly", label: "Monthly" },
                  { value: "category", label: "By Category" },
                ]}
                defaultTab="weekly"
              >
                <TabPanel value="weekly">
                  <StatBars
                    data={dashboard.analytics.weekly}
                  />
                </TabPanel>
                <TabPanel value="monthly">
                  <StatBars
                    data={dashboard.analytics.monthly}
                    color="var(--success)"
                  />
                </TabPanel>
                <TabPanel value="category">
                  <StatBars data={dashboard.analytics.category} color="var(--accent)" />
                </TabPanel>
              </Tabs>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-[var(--border)] bg-white p-6">
              <h3 className="flex items-center gap-2 text-lg font-bold">
                <Icon name="calendar" className="h-5 w-5 text-[var(--primary)]" />
                Upcoming Sessions
              </h3>
              <div className="mt-4 space-y-4">
                {dashboard.upcomingSessions.map((session) => (
                  <div key={session.title} className="rounded-[1.5rem] bg-[var(--background)] p-4">
                    <Badge tone="primary" className="mb-3">
                      Live Session
                    </Badge>
                    <p className="font-semibold">{session.title}</p>
                    <p className="mt-2 text-sm text-[var(--muted-foreground)]">{session.date}</p>
                    <p className="text-sm text-[var(--muted-foreground)]">{session.time}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mesh-card rounded-[2rem] p-6 text-white">
              <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-white/20">
                <Icon name="zap" className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-2xl font-black">7 Day Streak</h3>
              <p className="mt-3 text-sm text-white/80">
                Keep going. The new designs now support milestone-style motivational cards and sidebar modules cleanly.
              </p>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
