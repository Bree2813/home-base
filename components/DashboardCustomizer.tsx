"use client";

import { AppIcon } from "@/components/AppIcon";
import { widgetCatalog } from "@/lib/dashboard";
import { WidgetKey } from "@/types/dashboard";

type DashboardCustomizerProps = {
  enabledWidgets: WidgetKey[];
  onToggle: (widget: WidgetKey) => void;
};

export function DashboardCustomizer({
  enabledWidgets,
  onToggle,
}: DashboardCustomizerProps) {
  return (
    <section className="app-card bg-gradient-to-br from-white via-slate-50 to-blue-50/62">
      <div className="mb-6 h-1.5 rounded-full bg-gradient-to-r from-blue-300 via-violet-200 to-emerald-200" />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
            Customize
          </p>
          <h2 className="mt-3 text-[1.8rem] font-semibold leading-tight text-slate-900">
            Choose your dashboard cards
          </h2>
          <p className="mt-3 text-[15px] leading-7 text-slate-600">
            Keep only the areas you want to see right now.
          </p>
        </div>
        <p className="text-sm font-medium text-slate-600">{enabledWidgets.length} widgets visible</p>
      </div>

      <div className="mt-8 flex flex-wrap gap-3.5">
        {widgetCatalog.map((widget) => {
          const enabled = enabledWidgets.includes(widget.key);

          return (
            <button
              key={widget.key}
              type="button"
              onClick={() => onToggle(widget.key)}
              className={`flex items-center gap-3 rounded-[1.2rem] px-4 py-3.5 text-left text-sm font-medium shadow-[0_8px_22px_rgba(148,163,184,0.08)] transition ${
                enabled
                  ? "bg-gradient-to-r from-sky-200 via-blue-100 to-violet-100 text-slate-900 ring-1 ring-sky-200 shadow-[0_8px_20px_rgba(125,165,255,0.18)]"
                  : "bg-white/86 text-slate-700 ring-1 ring-slate-200 hover:bg-white"
              }`}
            >
              <span
                className={`inline-flex h-7 w-7 items-center justify-center rounded-lg ${
                  enabled ? "bg-white/80 text-slate-800 ring-1 ring-sky-200" : "bg-slate-100 text-slate-600"
                }`}
              >
                <AppIcon name={widget.icon} className="h-3 w-3" />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className={enabled ? "text-slate-900" : "text-slate-800"}>{widget.title}</span>
                <span className={`text-xs ${enabled ? "text-slate-700" : "text-slate-500"}`}>
                  {enabled ? "Visible on your dashboard" : "Tap to show"}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
