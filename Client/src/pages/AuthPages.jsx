import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Checkbox, Input, Label } from "../components/primitives";
import { Icon } from "../components/Icons";
import { AuthContext } from "../context/AuthContext";

function AuthShell({ title, description, children, footer }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary)] text-white">
            <Icon name="book" className="h-6 w-6" />
          </div>
          <span className="text-3xl font-black">MindCraft</span>
        </Link>
        <div className="course-card-shadow rounded-[2.25rem] border border-[var(--border)] bg-white p-8">
          <h1 className="text-center text-3xl font-black">{title}</h1>
          <p className="mt-3 text-center text-[var(--muted-foreground)]">{description}</p>
          <div className="mt-8">{children}</div>
          {footer ? (
            <div className="mt-6 text-center text-sm text-[var(--muted-foreground)]">{footer}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const data = await login({ email, password });
      const fallbackPath = data.user.role === "instructor" ? "/teach" : "/learn";
      navigate(location.state?.from || fallbackPath);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Welcome Back"
      description="Sign in to continue your learning journey."
      footer={
        <>
          Don't have an account?{" "}
          <Link to="/sign-up" className="font-semibold text-[var(--primary)]">
            Sign Up
          </Link>
        </>
      }
    >
      <div className="space-y-4">
        <Button variant="outline" className="w-full">
          Continue with Google
        </Button>
        <Button variant="outline" className="w-full">
          Continue with GitHub
        </Button>
      </div>
      <div className="my-6 text-center text-sm text-[var(--muted-foreground)]">
        Or continue with email
      </div>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="sign-in-email">Email Address</Label>
          <Input
            id="sign-in-email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="sign-in-password">Password</Label>
            <Link to="/forgot-password" className="text-sm font-semibold text-[var(--primary)]">
              Forgot?
            </Link>
          </div>
          <Input
            id="sign-in-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2"
            placeholder="Enter your password"
          />
        </div>
        {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
        <Button className="w-full" type="submit" disabled={submitting}>
          {submitting ? "Signing In..." : "Sign In"}
        </Button>
      </form>
    </AuthShell>
  );
}

export function SignUpPage() {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "learner",
    agreed: false,
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      navigate(form.role === "instructor" ? "/teach" : "/learn");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Start Your Journey"
      description="Join thousands of learners building skills that translate into real work."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/sign-in" className="font-semibold text-[var(--primary)]">
            Sign In
          </Link>
        </>
      }
    >
      <div className="space-y-4">
        <Button variant="outline" className="w-full">
          Sign up with Google
        </Button>
        <Button variant="outline" className="w-full">
          Sign up with GitHub
        </Button>
      </div>
      <div className="my-6 text-center text-sm text-[var(--muted-foreground)]">
        Or sign up with email
      </div>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="sign-up-name">Full Name</Label>
          <Input
            id="sign-up-name"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            className="mt-2"
            placeholder="John Doe"
          />
        </div>
        <div>
          <Label htmlFor="sign-up-email">Email Address</Label>
          <Input
            id="sign-up-email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            className="mt-2"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <Label htmlFor="sign-up-password">Password</Label>
          <Input
            id="sign-up-password"
            type="password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            className="mt-2"
            placeholder="At least 8 characters"
          />
        </div>
        <div>
          <Label htmlFor="sign-up-role">I want to join as</Label>
          <select
            id="sign-up-role"
            value={form.role}
            onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
            className="mt-2 flex h-12 w-full rounded-2xl border border-[var(--border)] bg-white px-4 text-sm outline-none transition focus:border-[var(--primary)]"
          >
            <option value="learner">Learner</option>
            <option value="instructor">Instructor</option>
          </select>
        </div>
        <Checkbox
          id="agree-terms"
          checked={form.agreed}
          onChange={(checked) => setForm((current) => ({ ...current, agreed: checked }))}
          label="I agree to the Terms of Service and Privacy Policy."
        />
        {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
        <Button className="w-full" disabled={!form.agreed || submitting} type="submit">
          {submitting ? "Creating Account..." : "Create Account"}
        </Button>
      </form>
    </AuthShell>
  );
}

export function ForgotPasswordPage() {
  const { forgotPassword } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  return (
    <AuthShell
      title={submitted ? "Check Your Email" : "Reset Password"}
      description={
        submitted
          ? "A reset link would be sent to the email below in the live flow."
          : "Enter your email and we'll send you a reset link."
      }
      footer={
        <Link to="/sign-in" className="font-semibold text-[var(--primary)]">
          Back to Sign In
        </Link>
      }
    >
      {submitted ? (
        <div className="rounded-[1.5rem] bg-[var(--background)] p-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#daf6ed] text-[var(--success)]">
            <Icon name="check" className="h-8 w-8" />
          </div>
          <p className="mt-4 font-semibold">{email}</p>
          <Button variant="outline" className="mt-6 w-full" onClick={() => setSubmitted(false)}>
            Try another email
          </Button>
        </div>
      ) : (
        <form
          className="space-y-5"
          onSubmit={async (event) => {
            event.preventDefault();
            setSubmitting(true);
            setError("");

            try {
              await forgotPassword({ email });
              setSubmitted(true);
            } catch (requestError) {
              setError(requestError.message);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <div>
            <Label htmlFor="forgot-email">Email Address</Label>
            <Input
              id="forgot-email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2"
              placeholder="you@example.com"
            />
          </div>
          {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
          <Button className="w-full" type="submit" disabled={submitting}>
            {submitting ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
