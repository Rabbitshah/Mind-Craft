import { useEffect, useState } from "react";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import {
  Badge,
  Button,
  SectionHeading,
  StatBars,
  TabPanel,
  Tabs,
} from "../components/primitives";
import { Icon } from "../components/Icons";
import { getInstructorDashboard } from "../api/dashboardApi";

export function InstructorDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadDashboard() {
      try {
        setLoading(true);
        const data = await getInstructorDashboard();
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
    return <div className="app-shell"><Header /><div className="page-section py-20 text-center text-[var(--muted-foreground)]">Loading instructor dashboard...</div></div>;
  }

  if (error || !dashboard) {
    return <div className="app-shell"><Header /><div className="page-section py-20 text-center text-[var(--danger)]">{error || "Unable to load instructor dashboard."}</div></div>;
  }

  return (
    <div className="app-shell">
      <Header />

      <div className="page-section py-12">
        <SectionHeading
          eyebrow="Instructor Dashboard"
          title="Manage your courses and track your impact"
          description="The generated instructor analytics page is now translated into native project UI, including stats, tabbed analytics, action panels, and course management."
          action={
            <Button>
              <Icon name="plus" className="h-5 w-5" />
              Create New Course
            </Button>
          }
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            [dashboard.stats.revenueMonth, "This Month's Revenue", "card"],
            [dashboard.stats.totalStudents, "Total Students", "users"],
            [dashboard.stats.averageRating, "Average Rating", "star"],
            [dashboard.stats.publishedCourses, "Published Courses", "play"],
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
              <h2 className="mb-5 text-2xl font-bold">Performance Analytics</h2>
              <Tabs
                tabs={[
                  { value: "revenue", label: "Revenue" },
                  { value: "enrollment", label: "Enrollment" },
                ]}
                defaultTab="revenue"
              >
                <TabPanel value="revenue">
                  <StatBars
                    data={dashboard.analytics.revenue}
                    color="var(--success)"
                  />
                </TabPanel>
                <TabPanel value="enrollment">
                  <StatBars data={dashboard.analytics.enrollment} />
                </TabPanel>
              </Tabs>
            </div>

            <div className="rounded-[2rem] border border-[var(--border)] bg-white p-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-2xl font-bold">My Courses</h2>
                <Button variant="outline">View All Analytics</Button>
              </div>
              <div className="overflow-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="text-[var(--muted-foreground)]">
                    <tr>
                      <th className="pb-4 pr-4 font-medium">Course</th>
                      <th className="pb-4 pr-4 font-medium">Students</th>
                      <th className="pb-4 pr-4 font-medium">Revenue</th>
                      <th className="pb-4 pr-4 font-medium">Rating</th>
                      <th className="pb-4 pr-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.courses.map((course) => (
                      <tr key={course.title} className="border-t border-[var(--border)]">
                        <td className="py-4 pr-4">
                          <p className="font-semibold text-[var(--foreground)]">{course.title}</p>
                        </td>
                        <td className="py-4 pr-4">{course.students.toLocaleString()}</td>
                        <td className="py-4 pr-4 font-semibold text-[var(--success)]">
                          {course.revenue}
                        </td>
                        <td className="py-4 pr-4">
                          {course.rating} ({course.reviews})
                        </td>
                        <td className="py-4 pr-4">
                          <Badge tone="success">{course.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-[var(--border)] bg-white p-6">
              <h3 className="text-lg font-bold">Quick Actions</h3>
              <div className="mt-4 space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Icon name="plus" className="h-4 w-4" />
                  Upload New Lesson
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Icon name="comment" className="h-4 w-4" />
                  Reply to Students
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Icon name="calendar" className="h-4 w-4" />
                  Schedule Live Session
                </Button>
              </div>
            </div>

            <div className="mesh-card rounded-[2rem] p-6 text-white">
              <h3 className="text-3xl font-black">{dashboard.stats.lifetimeEarnings}</h3>
              <p className="mt-2 text-white/80">Lifetime Earnings</p>
              <Button variant="soft" className="mt-6 w-full">
                View Payout Details
              </Button>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
