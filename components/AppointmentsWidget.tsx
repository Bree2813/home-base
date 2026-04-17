"use client";

import { FormEvent, useState } from "react";
import { WidgetShell } from "@/components/WidgetShell";
import { AppointmentItem } from "@/types/dashboard";

type AppointmentsWidgetProps = {
  appointments: AppointmentItem[];
  onAddAppointment: (title: string, when: string, details: string) => void;
};

export function AppointmentsWidget({
  appointments,
  onAddAppointment,
}: AppointmentsWidgetProps) {
  const [title, setTitle] = useState("");
  const [when, setWhen] = useState("");
  const [details, setDetails] = useState("");

  function submitAppointment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !when.trim()) {
      return;
    }

    onAddAppointment(title.trim(), when, details.trim());
    setTitle("");
    setWhen("");
    setDetails("");
  }

  return (
    <WidgetShell
      eyebrow="Appointments"
      title="Upcoming places to be"
      description="Appointments stay visible in one calm list."
      theme="rose"
      icon="appointments"
    >
      <form
        className="space-y-4 rounded-2xl bg-rose-50/70 p-5 ring-1 ring-rose-100"
        onSubmit={submitAppointment}
      >
        <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Appointment title"
            className="soft-input"
          />
          <input
            type="datetime-local"
            value={when}
            onChange={(event) => setWhen(event.target.value)}
            className="soft-input"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <input
            value={details}
            onChange={(event) => setDetails(event.target.value)}
            placeholder="Optional details"
            className="soft-input"
          />
          <button type="submit" className="soft-button">
            Add
          </button>
        </div>
      </form>

      <div className="mt-7 space-y-3">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="rounded-2xl bg-rose-50/65 p-5 ring-1 ring-rose-100"
          >
            <p className="text-base font-medium text-slate-700">{appointment.title}</p>
            <p className="mt-2 text-sm text-slate-500">{appointment.when.replace("T", " ")}</p>
            {appointment.details ? (
              <p className="mt-3 text-sm leading-7 text-slate-500">{appointment.details}</p>
            ) : null}
          </div>
        ))}
      </div>
    </WidgetShell>
  );
}
