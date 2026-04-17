"use client";

import { FormEvent, useState } from "react";
import { EncouragementStyle } from "@/types/dashboard";

type EncouragementCardProps = {
  message: string;
  mode: EncouragementStyle;
  customMessages: string[];
  onNextMessage: () => void;
  onModeChange: (mode: EncouragementStyle) => void;
  onAddMessage: (message: string) => void;
  onRemoveMessage: (message: string) => void;
};

export function EncouragementCard({
  message,
  mode,
  customMessages,
  onNextMessage,
  onModeChange,
  onAddMessage,
  onRemoveMessage,
}: EncouragementCardProps) {
  const [draft, setDraft] = useState("");
  const [showEditor, setShowEditor] = useState(false);

  function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) {
      return;
    }
    onAddMessage(trimmed);
    setDraft("");
  }

  return (
    <div className="app-card bg-gradient-to-br from-amber-50 via-white to-rose-50/80 ring-amber-100/70">
      <div className="mb-6 h-1.5 rounded-full bg-gradient-to-r from-amber-300 via-rose-200 to-sky-200" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-600">
            Encouragement
          </p>
          <h2 className="mt-2 text-[1.55rem] font-semibold leading-tight text-slate-900">
            A calm word for right now
          </h2>
          <p className="mt-4 max-w-2xl text-lg font-medium leading-8 text-slate-800">{message}</p>
        </div>
        <div className="flex gap-3">
          <button type="button" className="soft-button-secondary" onClick={onNextMessage}>
            Next message
          </button>
          <button
            type="button"
            className="soft-button-secondary"
            onClick={() => setShowEditor((current) => !current)}
          >
            {showEditor ? "Close editor" : "Edit messages"}
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-white/70 p-4 ring-1 ring-white/85">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onModeChange("standard")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              mode === "standard"
                ? "bg-white text-slate-900 ring-1 ring-slate-200 shadow-[0_6px_14px_rgba(148,163,184,0.1)]"
                : "bg-white/75 text-slate-700 ring-1 ring-white/80 hover:bg-white"
            }`}
          >
            Standard
          </button>
          <button
            type="button"
            onClick={() => onModeChange("christian")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              mode === "christian"
                ? "bg-white text-slate-900 ring-1 ring-slate-200 shadow-[0_6px_14px_rgba(148,163,184,0.1)]"
                : "bg-white/75 text-slate-700 ring-1 ring-white/80 hover:bg-white"
            }`}
          >
            Christian
          </button>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {mode === "christian"
            ? "Christian mode keeps the tone gentle and adds short Bible-based encouragement with simple verse references."
            : "Standard mode keeps encouragement supportive, neutral, and low-pressure."}
        </p>
      </div>

      {showEditor ? (
        <div className="mt-5 rounded-2xl bg-white/72 p-5 ring-1 ring-white/90">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800">Edit your encouragement list</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Add personal reminders you want to hear again later. Remove any that no longer fit.
              </p>
            </div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">
              {customMessages.length} custom messages
            </p>
          </div>

          <form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={submitMessage}>
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={
                mode === "christian"
                  ? "Add a custom encouragement or gentle verse reminder"
                  : "Add a custom encouragement"
              }
              className="soft-input flex-1"
            />
            <button type="submit" className="soft-button">
              Save message
            </button>
          </form>

          {customMessages.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {customMessages.map((entry) => (
                <button
                  key={entry}
                  type="button"
                  onClick={() => onRemoveMessage(entry)}
                  className="rounded-full bg-white/85 px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200 transition hover:bg-white"
                >
                  Remove: {entry}
                </button>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm leading-6 text-slate-600">
              No custom messages yet. Add one whenever you want something more personal here.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
