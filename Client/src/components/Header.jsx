import { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "./primitives";
import { Icon } from "./Icons";
import { AuthContext } from "../context/AuthContext";

const navItems = [
  { to: "/courses", label: "Explore Courses" },
  { to: "/teach", label: "Teach" },
  { to: "/learn", label: "My Learning" },
  { to: "/components", label: "Components" },
];

export function Header() {
  const { user, logout } = useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/85 backdrop-blur-xl">
      <div className="page-section flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--primary)] text-white">
            <Icon name="book" className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xl font-black tracking-tight text-[var(--foreground)]">MindCraft</p>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Creative Learning</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-semibold transition ${isActive ? "text-[var(--primary)]" : "text-[var(--foreground)] hover:text-[var(--primary)]"}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link to="/checkout">
            <Button variant="ghost" size="icon" aria-label="Cart">
              <Icon name="cart" className="h-5 w-5" />
            </Button>
          </Link>
          {user ? (
            <>
              <span className="text-sm font-semibold text-[var(--muted-foreground)]">
                {user.name}
              </span>
              <Button variant="ghost" onClick={logout}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/sign-in">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/sign-up">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </div>

        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen((value) => !value)}>
          <Icon name="menu" className="h-6 w-6" />
        </Button>
      </div>

      {mobileOpen ? (
        <div className="page-section pb-6 lg:hidden">
          <div className="rounded-[2rem] border border-[var(--border)] bg-white p-4">
            <div className="flex flex-col gap-3">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} onClick={() => setMobileOpen(false)} className="rounded-2xl px-4 py-3 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--surface-alt)]">
                  {item.label}
                </NavLink>
              ))}
              {user ? (
                <Button
                  variant="outline"
                  className="mt-3 w-full"
                  onClick={async () => {
                    await logout();
                    setMobileOpen(false);
                  }}
                >
                  Sign Out
                </Button>
              ) : (
                <div className="mt-3 flex gap-3">
                  <Link className="flex-1" to="/sign-in" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full">Sign In</Button>
                  </Link>
                  <Link className="flex-1" to="/sign-up" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
