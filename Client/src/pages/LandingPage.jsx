import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CourseCard } from "../components/CourseCard";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Badge, Button, ImageFallback, SectionHeading } from "../components/primitives";
import { Icon } from "../components/Icons";
import { testimonials } from "../data/mockData";
import { getCourses } from "../api/courseApi";

export function LandingPage() {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [courseError, setCourseError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadFeaturedCourses() {
      try {
        setLoadingCourses(true);
        const data = await getCourses({ featured: true, sort: "popular" });
        if (!ignore) {
          setFeaturedCourses((data.courses || []).slice(0, 3));
        }
      } catch (requestError) {
        if (!ignore) {
          setCourseError(requestError.message);
        }
      } finally {
        if (!ignore) {
          setLoadingCourses(false);
        }
      }
    }

    loadFeaturedCourses();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="app-shell">
      <Header />

      <section className="overflow-hidden py-18">
        <div className="page-section hero-grid items-center">
          <div>
            <Badge tone="primary" className="mb-6">
              500,000+ learners building modern creative careers
            </Badge>
            <h1 className="editorial-title text-5xl font-black leading-none text-[var(--foreground)] md:text-7xl">
              Master creative skills with a bold, production-ready workflow.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--muted-foreground)]">
              Learn design, development, and digital craft through project-based courses,
              instructor feedback, and premium learning tools.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/courses">
                <Button size="lg">
                  Explore Courses
                  <Icon name="arrowRight" className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/learn">
                <Button size="lg" variant="outline">
                  <Icon name="play" className="h-5 w-5" />
                  See Learner View
                </Button>
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4">
              {[
                ["2,500+", "Courses"],
                ["4.8/5", "Average rating"],
                ["50K+", "Certificates"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-[1.75rem] border border-[var(--border)] bg-white p-5">
                  <p className="text-3xl font-black text-[var(--foreground)]">{value}</p>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="mesh-card rounded-[2rem] p-5 text-white course-card-shadow">
              <div className="rounded-[1.75rem] bg-white/10 p-4">
                <ImageFallback
                  src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80"
                  alt="Creative workspace"
                  className="h-[440px] w-full rounded-[1.5rem] object-cover"
                />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="rounded-[1.5rem] bg-white/10 p-4">
                  <p className="text-sm text-white/70">Now trending</p>
                  <p className="mt-2 text-lg font-bold">Advanced UI systems</p>
                </div>
                <div className="rounded-[1.5rem] bg-white/10 p-4">
                  <p className="text-sm text-white/70">Live support</p>
                  <p className="mt-2 text-lg font-bold">AI course assistant</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="page-section">
          <SectionHeading
            eyebrow="Trending Now"
            title="Featured Courses"
            description="A premium first pass through the Figma-generated course marketplace, rebuilt with native project components."
            action={
              <Link to="/courses">
                <Button variant="outline">View All</Button>
              </Link>
            }
          />
          {loadingCourses ? (
            <div className="rounded-[2rem] border border-[var(--border)] bg-white p-10 text-center text-[var(--muted-foreground)]">
              Loading featured courses...
            </div>
          ) : courseError ? (
            <div className="rounded-[2rem] border border-[var(--border)] bg-white p-10 text-center text-[var(--danger)]">
              {courseError}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {featuredCourses.map((course) => (
                <CourseCard key={course.id || course.slug} course={course} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-12">
        <div className="page-section grid gap-6 lg:grid-cols-4">
          {[
            { icon: "users", title: "Active Learners", value: "500K+" },
            { icon: "book", title: "Expert Courses", value: "2,500+" },
            { icon: "award", title: "Certificates Issued", value: "50K+" },
            { icon: "trend", title: "Career Growth", value: "87%" },
          ].map((item) => (
            <div key={item.title} className="rounded-[2rem] border border-[var(--border)] bg-white p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-[var(--primary-100)] text-[var(--primary)]">
                <Icon name={item.icon} className="h-7 w-7" />
              </div>
              <p className="mt-5 text-4xl font-black">{item.value}</p>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">{item.title}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12">
        <div className="page-section grid items-center gap-10 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-[var(--border)] bg-white p-5">
            <ImageFallback
              src="https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80"
              alt="Instructor spotlight"
              className="h-[520px] w-full rounded-[1.5rem] object-cover"
            />
          </div>
          <div>
            <Badge tone="accent" className="mb-4">
              Instructor Spotlight
            </Badge>
            <h2 className="editorial-title text-4xl font-black">
              Learn from leaders who still practice the craft.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[var(--muted-foreground)]">
              Every featured instructor is chosen for both real-world experience and the
              ability to teach with clarity. The designs you shared lean into premium
              editorial structure, so we preserved that tone here.
            </p>
            <div className="mt-8 space-y-4">
              {[
                "Project-based lessons that create portfolio-ready outcomes",
                "Feedback loops designed for both learners and instructors",
                "A route structure ready for auth, checkout, and dashboards",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-[1.5rem] border border-[var(--border)] bg-white p-4">
                  <div className="mt-1 text-[var(--success)]">
                    <Icon name="check" className="h-5 w-5" />
                  </div>
                  <p className="text-[var(--foreground)]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="page-section">
          <SectionHeading
            eyebrow="Testimonials"
            title="Loved by creative professionals"
            description="The layouts now support testimonial sections, stat blocks, and denser card systems across routes."
          />
          <div className="grid gap-6 md:grid-cols-2">
            {testimonials.map((item) => (
              <div key={item.name} className="rounded-[2rem] border border-[var(--border)] bg-white p-8">
                <div className="mb-5 flex gap-1 text-[var(--accent)]">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Icon key={index} name="star" className="h-5 w-5" />
                  ))}
                </div>
                <p className="text-lg leading-8 text-[var(--foreground)]">"{item.quote}"</p>
                <div className="mt-6">
                  <p className="font-bold">{item.name}</p>
                  <p className="text-sm text-[var(--muted-foreground)]">{item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="page-section">
          <div className="mesh-card rounded-[2.5rem] px-8 py-12 text-center text-white md:px-16">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
              Start now
            </p>
            <h2 className="editorial-title mt-4 text-4xl font-black md:text-5xl">
              Ready to turn the new Figma direction into the live app?
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/80">
              The client is now prepared for landing, catalog, detail, auth,
              dashboards, checkout, and component-library flows.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/sign-up">
                <Button size="lg" variant="soft">Create Account</Button>
              </Link>
              <Link to="/components">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-white/10 text-white hover:bg-white/15"
                >
                  View Components
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
