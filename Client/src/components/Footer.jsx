import { Link } from "react-router-dom";
import { Icon } from "./Icons";

export function Footer() {
  return (
    <footer className="mt-20 bg-[var(--secondary)] text-white">
      <div className="page-section py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[var(--primary)]">
                <Icon name="book" className="h-6 w-6" />
              </div>
              <span className="text-2xl font-black">MindCraft</span>
            </Link>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/70">
              Learn design, development, and digital craft through project-led courses shaped for real creative careers.
            </p>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Learn</h4>
            <div className="space-y-3 text-sm text-white/70">
              <Link to="/courses">All Courses</Link>
              <p>Design</p>
              <p>Development</p>
              <p>Digital Craft</p>
            </div>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Company</h4>
            <div className="space-y-3 text-sm text-white/70">
              <p>About</p>
              <p>Careers</p>
              <p>Press</p>
              <p>Contact</p>
            </div>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Paths</h4>
            <div className="space-y-3 text-sm text-white/70">
              <Link to="/learn">Learner Dashboard</Link>
              <Link to="/teach">Instructor Dashboard</Link>
              <Link to="/components">Component Library</Link>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-6 text-sm text-white/50">
          © {new Date().getFullYear()} MindCraft. Built for creative momentum.
        </div>
      </div>
    </footer>
  );
}
