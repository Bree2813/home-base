"use client";

import { FormEvent, useState } from "react";
import { WidgetShell } from "@/components/WidgetShell";
import { HomeschoolProject } from "@/types/dashboard";

type ProjectsWidgetProps = {
  selectedChildId: string | null;
  projects: HomeschoolProject[];
  onSaveProject: (entry: Omit<HomeschoolProject, "id">, editingId?: string) => void;
  onRemoveProject: (projectId: string) => void;
};

export function ProjectsWidget({
  selectedChildId,
  projects,
  onSaveProject,
  onRemoveProject,
}: ProjectsWidgetProps) {
  const [draft, setDraft] = useState<{
    editingId?: string;
    name: string;
    category: string;
    neededSupplies: string;
    ownedSupplies: string;
    notes: string;
    targetDate: string;
  }>({
    editingId: undefined,
    name: "",
    category: "",
    neededSupplies: "",
    ownedSupplies: "",
    notes: "",
    targetDate: "",
  });

  function resetDraft() {
    setDraft({
      editingId: undefined,
      name: "",
      category: "",
      neededSupplies: "",
      ownedSupplies: "",
      notes: "",
      targetDate: "",
    });
  }

  function submitProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedChildId || !draft.name.trim()) {
      return;
    }

    onSaveProject(
      {
        childId: selectedChildId,
        name: draft.name.trim(),
        category: draft.category.trim(),
        neededSupplies: draft.neededSupplies.trim(),
        ownedSupplies: draft.ownedSupplies.trim(),
        notes: draft.notes.trim(),
        targetDate: draft.targetDate.trim(),
      },
      draft.editingId,
    );
    resetDraft();
  }

  return (
    <WidgetShell
      eyebrow="Projects / Crafts"
      title="Homeschool projects and crafts"
      description="Keep project ideas, supplies, and timing in one simple place."
      theme="lavender"
      icon="projects"
    >
      {!selectedChildId ? (
        <div className="rounded-2xl bg-violet-50/72 p-5 text-sm leading-7 text-slate-600 ring-1 ring-violet-100">
          Add or choose a homeschool child first, and project ideas will have a calm place to live.
        </div>
      ) : null}

      <form className="grid gap-3 rounded-2xl bg-violet-50/72 p-5 ring-1 ring-violet-100 sm:grid-cols-2" onSubmit={submitProject}>
        <input value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} placeholder="Project name" className="soft-input" />
        <input value={draft.category} onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))} placeholder="Subject or category" className="soft-input" />
        <input value={draft.neededSupplies} onChange={(event) => setDraft((current) => ({ ...current, neededSupplies: event.target.value }))} placeholder="Needed supplies" className="soft-input sm:col-span-2" />
        <input value={draft.ownedSupplies} onChange={(event) => setDraft((current) => ({ ...current, ownedSupplies: event.target.value }))} placeholder="Supplies already owned" className="soft-input sm:col-span-2" />
        <input value={draft.targetDate} onChange={(event) => setDraft((current) => ({ ...current, targetDate: event.target.value }))} placeholder="Due date or target month" className="soft-input sm:col-span-2" />
        <textarea value={draft.notes} onChange={(event) => setDraft((current) => ({ ...current, notes: event.target.value }))} placeholder="Notes" className="soft-input min-h-24 sm:col-span-2" />
        <div className="flex gap-3 sm:col-span-2 sm:justify-end">
          {draft.editingId ? (
            <button type="button" className="soft-button-secondary" onClick={resetDraft}>
              Cancel
            </button>
          ) : null}
          <button type="submit" className="soft-button">
            {draft.editingId ? "Save project" : "Add project"}
          </button>
        </div>
      </form>

      <div className="mt-6 space-y-3">
        {projects.map((project) => (
          <div key={project.id} className="rounded-2xl bg-violet-50/70 p-5 ring-1 ring-violet-100">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-base font-semibold text-slate-800">{project.name}</p>
                <p className="mt-2 text-sm text-slate-600">{project.category || "General project"}</p>
                {project.targetDate ? (
                  <p className="mt-1 text-sm text-slate-600">{project.targetDate}</p>
                ) : null}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="soft-button-secondary"
                  onClick={() =>
                    setDraft({
                      editingId: project.id,
                      name: project.name,
                      category: project.category,
                      neededSupplies: project.neededSupplies,
                      ownedSupplies: project.ownedSupplies,
                      notes: project.notes,
                      targetDate: project.targetDate,
                    })
                  }
                >
                  Edit
                </button>
                <button type="button" className="soft-button-secondary" onClick={() => onRemoveProject(project.id)}>
                  Remove
                </button>
              </div>
            </div>
            {project.neededSupplies ? (
              <p className="mt-3 text-sm leading-6 text-slate-700">
                <span className="font-semibold">Needed:</span> {project.neededSupplies}
              </p>
            ) : null}
            {project.ownedSupplies ? (
              <p className="mt-2 text-sm leading-6 text-slate-700">
                <span className="font-semibold">Owned:</span> {project.ownedSupplies}
              </p>
            ) : null}
            {project.notes ? (
              <p className="mt-2 text-sm leading-6 text-slate-600">{project.notes}</p>
            ) : null}
          </div>
        ))}
      </div>
    </WidgetShell>
  );
}
