type IconName =
  | "habits"
  | "tasks"
  | "reminders"
  | "homeschool"
  | "groceries"
  | "meals"
  | "pantry"
  | "cleaning"
  | "household"
  | "animals"
  | "bills"
  | "appointments"
  | "projects"
  | "work"
  | "college";

type AppIconProps = {
  name: IconName;
  className?: string;
};

const baseProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export type { IconName };

export function AppIcon({ name, className = "h-3.5 w-3.5" }: AppIconProps) {
  const shellClass = `${className} shrink-0`;

  switch (name) {
    case "habits":
      return (
        <svg viewBox="0 0 24 24" className={shellClass} aria-hidden="true">
          <path {...baseProps} d="M7 3.5h10a1.5 1.5 0 0 1 1.5 1.5v15l-6.5-3-6.5 3V5A1.5 1.5 0 0 1 7 3.5Z" />
          <path {...baseProps} d="m9.5 10.5 1.7 1.7 3.3-3.4" />
        </svg>
      );
    case "tasks":
      return (
        <svg viewBox="0 0 24 24" className={shellClass} aria-hidden="true">
          <path {...baseProps} d="M8.5 6.5h9" />
          <path {...baseProps} d="M8.5 12h9" />
          <path {...baseProps} d="M8.5 17.5h7" />
          <path {...baseProps} d="m4.7 6.7.8.8 1.7-1.9" />
          <path {...baseProps} d="m4.7 12.2.8.8 1.7-1.9" />
          <circle {...baseProps} cx="5.8" cy="17.5" r="1.2" />
        </svg>
      );
    case "reminders":
      return (
        <svg viewBox="0 0 24 24" className={shellClass} aria-hidden="true">
          <path {...baseProps} d="M7 9a5 5 0 1 1 10 0v3.2c0 .7.2 1.4.7 1.9l.8.9H5.5l.8-.9c.5-.5.7-1.2.7-1.9Z" />
          <path {...baseProps} d="M10.2 18a2 2 0 0 0 3.6 0" />
          <path {...baseProps} d="M12 4V2.8" />
        </svg>
      );
    case "homeschool":
      return (
        <svg viewBox="0 0 24 24" className={shellClass} aria-hidden="true">
          <path {...baseProps} d="M4.5 6.5a2 2 0 0 1 2-2H11v14H6.5a2 2 0 0 0-2 2Z" />
          <path {...baseProps} d="M19.5 6.5a2 2 0 0 0-2-2H13v14h4.5a2 2 0 0 1 2 2Z" />
          <path {...baseProps} d="M8 8.5h1.7" />
          <path {...baseProps} d="M14.3 8.5H16" />
        </svg>
      );
    case "groceries":
      return (
        <svg viewBox="0 0 24 24" className={shellClass} aria-hidden="true">
          <path {...baseProps} d="M6 7h12l-1 10H7L6 7Z" />
          <path {...baseProps} d="M9 7a3 3 0 1 1 6 0" />
        </svg>
      );
    case "pantry":
      return (
        <svg viewBox="0 0 24 24" className={shellClass} aria-hidden="true">
          <path {...baseProps} d="M7 4.5h10v15H7z" />
          <path {...baseProps} d="M9.5 8h5" />
          <path {...baseProps} d="M9.5 12h5" />
        </svg>
      );
    case "cleaning":
      return (
        <svg viewBox="0 0 24 24" className={shellClass} aria-hidden="true">
          <path {...baseProps} d="M9 4.5h6" />
          <path {...baseProps} d="M10 4.5v4l-3 4.5a4.3 4.3 0 0 0 3.5 6.5h3a4.3 4.3 0 0 0 3.5-6.5L14 8.5v-4" />
        </svg>
      );
    case "household":
      return (
        <svg viewBox="0 0 24 24" className={shellClass} aria-hidden="true">
          <path {...baseProps} d="M6 7.5h12v10H6z" />
          <path {...baseProps} d="M9 7.5V6a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 6v1.5" />
          <path {...baseProps} d="M10 11.5h4" />
          <path {...baseProps} d="M12 9.5v4" />
        </svg>
      );
    case "meals":
      return (
        <svg viewBox="0 0 24 24" className={shellClass} aria-hidden="true">
          <path {...baseProps} d="M7 3.5v7" />
          <path {...baseProps} d="M10 3.5v7" />
          <path {...baseProps} d="M8.5 10.5V20" />
          <path {...baseProps} d="M15.5 3.5c1.7 1.4 2.4 4.2 0 6v10.5" />
        </svg>
      );
    case "animals":
      return (
        <svg viewBox="0 0 24 24" className={shellClass} aria-hidden="true">
          <circle {...baseProps} cx="8" cy="8" r="2" />
          <circle {...baseProps} cx="16" cy="8" r="2" />
          <circle {...baseProps} cx="6.5" cy="14.5" r="1.6" />
          <circle {...baseProps} cx="17.5" cy="14.5" r="1.6" />
          <path {...baseProps} d="M12 10.5c2.9 0 5 2 5 4.3 0 2.1-1.9 3.7-5 3.7s-5-1.6-5-3.7c0-2.3 2.1-4.3 5-4.3Z" />
        </svg>
      );
    case "bills":
      return (
        <svg viewBox="0 0 24 24" className={shellClass} aria-hidden="true">
          <path {...baseProps} d="M7 4.5h10v15l-2-1.2-2 1.2-2-1.2-2 1.2-2-1.2Z" />
          <path {...baseProps} d="M9 9h6" />
          <path {...baseProps} d="M9 13h4.5" />
        </svg>
      );
    case "appointments":
      return (
        <svg viewBox="0 0 24 24" className={shellClass} aria-hidden="true">
          <rect {...baseProps} x="4.5" y="6" width="15" height="13" rx="2" />
          <path {...baseProps} d="M8 4v4" />
          <path {...baseProps} d="M16 4v4" />
          <path {...baseProps} d="M4.5 10h15" />
        </svg>
      );
    case "projects":
      return (
        <svg viewBox="0 0 24 24" className={shellClass} aria-hidden="true">
          <path {...baseProps} d="m6 15 9-9 3 3-9 9-4 1Z" />
          <path {...baseProps} d="M13 8l3 3" />
        </svg>
      );
    case "work":
      return (
        <svg viewBox="0 0 24 24" className={shellClass} aria-hidden="true">
          <rect {...baseProps} x="4" y="7" width="16" height="11" rx="2" />
          <path {...baseProps} d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
          <path {...baseProps} d="M4 12h16" />
        </svg>
      );
    case "college":
      return (
        <svg viewBox="0 0 24 24" className={shellClass} aria-hidden="true">
          <path {...baseProps} d="m4 9 8-4 8 4-8 4-8-4Z" />
          <path {...baseProps} d="M7 10.5v3.2c0 1.4 2.2 2.8 5 2.8s5-1.4 5-2.8v-3.2" />
        </svg>
      );
  }
}
