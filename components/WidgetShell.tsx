import { ReactNode } from "react";
import { AppIcon, IconName } from "@/components/AppIcon";

export type WidgetTheme =
  | "blue"
  | "peach"
  | "yellow"
  | "lavender"
  | "green"
  | "rose"
  | "slate";

type WidgetShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  theme?: WidgetTheme;
  icon?: IconName;
  children: ReactNode;
};

const themeStyles: Record<WidgetTheme, { shell: string; badge: string; accent: string; edge: string }> = {
  blue: {
    shell: "bg-gradient-to-br from-blue-50/95 via-white to-sky-50/90 ring-blue-100/85",
    badge: "bg-blue-100/95 text-blue-700 ring-1 ring-blue-200/80",
    accent: "from-blue-300 via-sky-300 to-blue-200",
    edge: "before:bg-blue-200/95",
  },
  peach: {
    shell: "bg-gradient-to-br from-orange-50/95 via-white to-amber-50/88 ring-orange-100/85",
    badge: "bg-orange-100/95 text-orange-700 ring-1 ring-orange-200/80",
    accent: "from-orange-300 via-amber-300 to-orange-200",
    edge: "before:bg-orange-200/95",
  },
  yellow: {
    shell: "bg-gradient-to-br from-yellow-50/95 via-white to-amber-50/88 ring-yellow-100/90",
    badge: "bg-yellow-100/95 text-yellow-700 ring-1 ring-yellow-200/80",
    accent: "from-yellow-300 via-amber-300 to-yellow-200",
    edge: "before:bg-yellow-200/95",
  },
  lavender: {
    shell: "bg-gradient-to-br from-violet-50/95 via-white to-fuchsia-50/82 ring-violet-100/85",
    badge: "bg-violet-100/95 text-violet-700 ring-1 ring-violet-200/80",
    accent: "from-violet-300 via-fuchsia-200 to-violet-200",
    edge: "before:bg-violet-200/95",
  },
  green: {
    shell: "bg-gradient-to-br from-emerald-50/95 via-white to-lime-50/82 ring-emerald-100/85",
    badge: "bg-emerald-100/95 text-emerald-700 ring-1 ring-emerald-200/80",
    accent: "from-emerald-300 via-lime-200 to-emerald-200",
    edge: "before:bg-emerald-200/95",
  },
  rose: {
    shell: "bg-gradient-to-br from-rose-50/95 via-white to-orange-50/82 ring-rose-100/85",
    badge: "bg-rose-100/95 text-rose-700 ring-1 ring-rose-200/80",
    accent: "from-rose-300 via-orange-200 to-rose-200",
    edge: "before:bg-rose-200/95",
  },
  slate: {
    shell: "bg-gradient-to-br from-slate-50/98 via-white to-slate-100/82 ring-slate-200/85",
    badge: "bg-slate-100/95 text-slate-700 ring-1 ring-slate-200/80",
    accent: "from-slate-300 via-slate-200 to-slate-300",
    edge: "before:bg-slate-200/95",
  },
};

export function WidgetShell({
  eyebrow,
  title,
  description,
  theme = "slate",
  icon,
  children,
}: WidgetShellProps) {
  const palette = themeStyles[theme];

  return (
    <section className={`app-card relative overflow-hidden pl-7 ${palette.shell} before:absolute before:bottom-6 before:left-0 before:top-6 before:w-1.5 before:rounded-full ${palette.edge}`}>
      <div className={`mb-6 h-1.5 rounded-full bg-gradient-to-r ${palette.accent}`} />
      <div className="mb-8">
        <div className="flex items-start gap-3.5">
          {icon ? (
            <span
              className={`mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/75 shadow-[0_10px_20px_rgba(255,255,255,0.25)] ${palette.badge}`}
            >
              <AppIcon name={icon} className="h-3.5 w-3.5" />
            </span>
          ) : null}
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-600">
              {eyebrow}
            </p>
            <h2 className="mt-2 text-[1.8rem] font-semibold leading-tight text-slate-900">
              {title}
            </h2>
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-700">{description}</p>
      </div>
      {children}
    </section>
  );
}
