import { useEffect, useState } from "react";
import { Chip } from "../components/Chip";
import { CourseCard } from "../components/CourseCard";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Button, Input, Select } from "../components/primitives";
import { Icon } from "../components/Icons";
import { categories } from "../data/mockData";
import { getCourses } from "../api/courseApi";

export function CourseCatalog() {
  const [search, setSearch] = useState("");
  const [activeCategories, setActiveCategories] = useState([]);
  const [sortBy, setSortBy] = useState("popular");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadCourses() {
      setLoading(true);
      setError("");

      try {
        const data = await getCourses({
          search,
          category: activeCategories[0] || "",
          sort: sortBy,
        });

        if (!ignore) {
          setResults(data.courses || []);
        }
      } catch (requestError) {
        if (!ignore) {
          setError(requestError.message);
          setResults([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadCourses();

    return () => {
      ignore = true;
    };
  }, [activeCategories, search, sortBy]);

  const toggleCategory = (category) => {
    if (category === "All Courses") {
      setActiveCategories([]);
      return;
    }

    setActiveCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category]
    );
  };

  return (
    <div className="app-shell">
      <Header />

      <section className="mesh-card py-16 text-white">
        <div className="page-section">
          <h1 className="editorial-title text-5xl font-black">Explore Courses</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            Browse the Figma-inspired course marketplace with filters, sorting, and
            richer card density than the original single landing page.
          </p>
          <div className="relative mt-8 max-w-2xl">
            <Icon
              name="search"
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--muted-foreground)]"
            />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-14 pl-12 text-base"
              placeholder="Search for courses, instructors, or topics..."
            />
          </div>
        </div>
      </section>

      <div className="page-section py-12">
        <div className="grid gap-8 lg:grid-cols-[280px,1fr]">
          <aside className="h-fit rounded-[2rem] border border-[var(--border)] bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <Icon name="filter" className="h-5 w-5 text-[var(--primary)]" />
                Filters
              </h2>
              <button
                type="button"
                className="text-sm font-semibold text-[var(--primary)]"
                onClick={() => {
                  setSearch("");
                  setActiveCategories([]);
                }}
              >
                Clear
              </button>
            </div>
            <div className="space-y-2">
              {categories.map((category) => {
                const selected =
                  category === "All Courses"
                    ? activeCategories.length === 0
                    : activeCategories.includes(category);

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => toggleCategory(category)}
                    className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                      selected
                        ? "bg-[var(--primary)] text-white"
                        : "bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--surface-alt)]"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </aside>

          <main>
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap gap-2">
                {activeCategories.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    tone="primary"
                    onRemove={() => toggleCategory(category)}
                  />
                ))}
              </div>
              <Select
                value={sortBy}
                onChange={setSortBy}
                options={[
                  { value: "popular", label: "Most Popular" },
                  { value: "rating", label: "Highest Rated" },
                  { value: "price-low", label: "Price: Low to High" },
                  { value: "price-high", label: "Price: High to Low" },
                ]}
              />
            </div>
            <p className="mb-6 text-sm text-[var(--muted-foreground)]">
              Showing {results.length} courses
            </p>
            {loading ? (
              <div className="rounded-[2rem] border border-[var(--border)] bg-white p-10 text-center text-[var(--muted-foreground)]">
                Loading courses...
              </div>
            ) : error ? (
              <div className="rounded-[2rem] border border-[var(--border)] bg-white p-10 text-center">
                <p className="text-[var(--danger)]">{error}</p>
                <Button variant="outline" className="mt-4" onClick={() => setSortBy((value) => value)}>
                  Try Again
                </Button>
              </div>
            ) : results.length === 0 ? (
              <div className="rounded-[2rem] border border-[var(--border)] bg-white p-10 text-center text-[var(--muted-foreground)]">
                No courses match your current filters.
              </div>
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {results.map((course) => (
                    <CourseCard key={course.id || course.slug} course={course} />
                  ))}
                </div>
                <div className="mt-10 text-center">
                  <Button variant="outline">Load More Courses</Button>
                </div>
              </>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
