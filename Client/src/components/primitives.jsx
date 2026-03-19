import { useMemo, useState } from "react";

export function Button({
  as: Tag = "button",
  children,
  className = "",
  variant = "primary",
  size = "md",
  ...props
}) {
  const variants = {
    primary: "bg-[var(--primary)] text-white hover:bg-[var(--primary-700)]",
    secondary: "bg-[var(--secondary)] text-white hover:bg-[var(--secondary-soft)]",
    outline: "border border-[var(--border)] bg-white text-[var(--foreground)] hover:bg-[var(--surface-alt)]",
    ghost: "bg-transparent text-[var(--foreground)] hover:bg-[var(--surface-alt)]",
    soft: "bg-[var(--primary-100)] text-[var(--primary)] hover:bg-[#c7dcff]",
    danger: "bg-[var(--danger)] text-white hover:opacity-90",
  };

  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-5 text-sm",
    lg: "h-13 px-6 text-base",
    icon: "h-11 w-11 p-0",
  };

  return (
    <Tag
      className={`inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:ring-4 focus:ring-[rgba(29,78,216,0.12)] ${className}`}
      {...props}
    />
  );
}

export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={`w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:ring-4 focus:ring-[rgba(29,78,216,0.12)] ${className}`}
      {...props}
    />
  );
}

export function Label({ children, className = "", ...props }) {
  return (
    <label className={`text-sm font-semibold text-[var(--foreground)] ${className}`} {...props}>
      {children}
    </label>
  );
}

export function Badge({ children, tone = "neutral", className = "" }) {
  const tones = {
    neutral: "bg-[var(--surface-alt)] text-[var(--foreground)]",
    primary: "bg-[var(--primary-100)] text-[var(--primary)]",
    dark: "bg-[var(--secondary)] text-white",
    accent: "bg-[#fff1cf] text-[#9a6500]",
    success: "bg-[#daf6ed] text-[var(--success)]",
    danger: "bg-[#fee2e2] text-[var(--danger)]",
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}

export function Separator({ className = "" }) {
  return <div className={`h-px w-full bg-[var(--border)] ${className}`} />;
}

export function ProgressBar({ value, className = "" }) {
  return (
    <div className={`h-2.5 w-full overflow-hidden rounded-full bg-[var(--surface-alt)] ${className}`}>
      <div className="h-full rounded-full bg-[var(--primary)] transition-all" style={{ width: `${value}%` }} />
    </div>
  );
}

export function Checkbox({ checked, onChange, label, id }) {
  return (
    <label htmlFor={id} className="flex items-start gap-3 cursor-pointer">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange?.(event.target.checked)}
        className="mt-1 h-4 w-4 rounded border-[var(--border)] accent-[var(--primary)]"
      />
      <span className="text-sm text-[var(--muted-foreground)]">{label}</span>
    </label>
  );
}

export function Select({ options, value, onChange, className = "" }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={`h-11 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm font-medium text-[var(--foreground)] outline-none focus:border-[var(--primary)] ${className}`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function Tabs({ tabs, defaultTab, children }) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.value);
  const content = useMemo(
    () => children.find((child) => child.props.value === activeTab),
    [activeTab, children]
  );

  return (
    <div>
      <div className="grid gap-2 rounded-3xl bg-white p-2 sm:flex">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value)}
            className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
              activeTab === tab.value
                ? "bg-[var(--primary)] text-white"
                : "text-[var(--muted-foreground)] hover:bg-[var(--surface-alt)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-6">{content}</div>
    </div>
  );
}

export function TabPanel({ children }) {
  return <>{children}</>;
}

export function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow ? <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">{eyebrow}</p> : null}
        <h2 className="editorial-title text-4xl font-black text-[var(--foreground)]">{title}</h2>
        {description ? <p className="mt-3 max-w-2xl text-base text-[var(--muted-foreground)]">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function ImageFallback({ src, alt, className = "" }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`flex items-center justify-center bg-[var(--surface-alt)] text-sm font-semibold text-[var(--muted-foreground)] ${className}`}>
        {alt}
      </div>
    );
  }

  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} />;
}

export function StatBars({ data, color = "var(--primary)" }) {
  const maxValue = Math.max(...data.map((item) => item.value));

  return (
    <div className="dashboard-chart space-y-4 rounded-[2rem] bg-white p-6">
      {data.map((item) => (
        <div key={item.label}>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-[var(--muted-foreground)]">{item.label}</span>
            <span className="font-semibold text-[var(--foreground)]">{item.valueLabel || item.value}</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-[var(--surface-alt)]">
            <div
              className="h-full rounded-full"
              style={{ width: `${(item.value / maxValue) * 100}%`, backgroundColor: color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
