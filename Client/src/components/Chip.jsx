import { Icon } from "./Icons";

export function Chip({ label, onRemove, selected = false, onClick, tone = "neutral" }) {
  const tones = {
    neutral: selected
      ? "bg-[var(--primary)] text-white"
      : "bg-[var(--surface-alt)] text-[var(--foreground)] hover:bg-[#dde8ff]",
    primary: "bg-[var(--primary)] text-white",
    outline: selected
      ? "border border-[var(--primary)] bg-[var(--primary-100)] text-[var(--primary)]"
      : "border border-[var(--border)] bg-white text-[var(--foreground)] hover:border-[var(--primary)]",
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${tones[tone]} ${onClick ? "cursor-pointer" : ""}`}
    >
      <span>{label}</span>
      {onRemove ? (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onRemove();
          }}
          className="rounded-full p-0.5 hover:bg-white/20"
        >
          <Icon name="close" className="h-3 w-3" />
        </button>
      ) : null}
    </div>
  );
}
