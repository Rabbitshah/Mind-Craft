import { Link } from "react-router-dom";
import { Badge, ImageFallback } from "./primitives";
import { Icon } from "./Icons";

export function CourseCard({ course }) {
  const courseLink = `/courses/${course.slug || course.id}`;
  const instructorName = course.instructorName || course.instructor;

  return (
    <Link to={courseLink} className="group block">
      <article className="course-card-shadow overflow-hidden rounded-[2rem] border border-[var(--border)] bg-white transition hover:-translate-y-1">
        <div className="relative aspect-[16/10] overflow-hidden">
          <ImageFallback
            src={course.thumbnail}
            alt={course.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
          <div className="absolute left-4 top-4 flex gap-2">
            {course.trending ? <Badge tone="accent">Trending</Badge> : null}
            {course.level ? <Badge>{course.level}</Badge> : null}
          </div>
        </div>
        <div className="p-5">
          <Badge tone="primary" className="mb-3">{course.category}</Badge>
          <h3 className="line-clamp-2 text-xl font-bold text-[var(--foreground)] transition group-hover:text-[var(--primary)]">
            {course.title}
          </h3>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">by {instructorName}</p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-[var(--muted-foreground)]">
            <span className="inline-flex items-center gap-1">
              <Icon name="star" className="h-4 w-4 text-[var(--accent)]" />
              <strong className="text-[var(--foreground)]">{course.rating}</strong>
            </span>
            <span className="inline-flex items-center gap-1">
              <Icon name="clock" className="h-4 w-4" />
              {course.duration}
            </span>
            <span className="inline-flex items-center gap-1">
              <Icon name="users" className="h-4 w-4" />
              {course.studentCount.toLocaleString()}
            </span>
          </div>
          <div className="mt-5 flex items-end gap-3">
            <span className="text-3xl font-black text-[var(--foreground)]">${course.price}</span>
            {course.originalPrice ? (
              <span className="text-sm text-[var(--muted-foreground)] line-through">${course.originalPrice}</span>
            ) : null}
          </div>
        </div>
      </article>
    </Link>
  );
}
