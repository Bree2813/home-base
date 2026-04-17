"use client";

import { FormEvent, useState } from "react";
import { IconName } from "@/components/AppIcon";
import { WidgetShell, WidgetTheme } from "@/components/WidgetShell";
import { InventoryItem } from "@/types/dashboard";

type InventorySection = {
  key: string;
  title: string;
  description: string;
  items: InventoryItem[];
};

type InventoryWidgetProps = {
  eyebrow: string;
  title: string;
  description: string;
  theme: WidgetTheme;
  icon: IconName;
  sections: InventorySection[];
  onSaveItem: (sectionKey: string, entry: Omit<InventoryItem, "id">, editingId?: string) => void;
  onRemoveItem: (sectionKey: string, itemId: string) => void;
};

type DraftState = Record<
  string,
  {
    editingId?: string;
    name: string;
    quantity: string;
    notes: string;
    lowStock: boolean;
  }
>;

function emptyDraft() {
  return {
    editingId: undefined,
    name: "",
    quantity: "",
    notes: "",
    lowStock: false,
  };
}

export function InventoryWidget({
  eyebrow,
  title,
  description,
  theme,
  icon,
  sections,
  onSaveItem,
  onRemoveItem,
}: InventoryWidgetProps) {
  const [drafts, setDrafts] = useState<DraftState>({});

  function readDraft(sectionKey: string) {
    return drafts[sectionKey] ?? emptyDraft();
  }

  function updateDraft(
    sectionKey: string,
    patch: Partial<{
      editingId?: string;
      name: string;
      quantity: string;
      notes: string;
      lowStock: boolean;
    }>,
  ) {
    setDrafts((current) => ({
      ...current,
      [sectionKey]: {
        ...readDraft(sectionKey),
        ...patch,
      },
    }));
  }

  function resetDraft(sectionKey: string) {
    setDrafts((current) => ({
      ...current,
      [sectionKey]: emptyDraft(),
    }));
  }

  function submitItem(event: FormEvent<HTMLFormElement>, sectionKey: string) {
    event.preventDefault();
    const draft = readDraft(sectionKey);
    if (!draft.name.trim()) {
      return;
    }

    onSaveItem(
      sectionKey,
      {
        name: draft.name.trim(),
        quantity: draft.quantity.trim(),
        notes: draft.notes.trim(),
        lowStock: draft.lowStock,
      },
      draft.editingId,
    );
    resetDraft(sectionKey);
  }

  return (
    <WidgetShell
      eyebrow={eyebrow}
      title={title}
      description={description}
      theme={theme}
      icon={icon}
    >
      <div className="space-y-5">
        {sections.map((section) => {
          const draft = readDraft(section.key);

          return (
            <section key={section.key} className="rounded-2xl bg-white/74 p-5 ring-1 ring-white/80">
              <div className="mb-4">
                <h3 className="text-base font-semibold text-slate-800">{section.title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">{section.description}</p>
              </div>

              <form
                className="grid gap-3 sm:grid-cols-[minmax(0,1.25fr)_minmax(0,0.8fr)]"
                onSubmit={(event) => submitItem(event, section.key)}
              >
                <input
                  value={draft.name}
                  onChange={(event) => updateDraft(section.key, { name: event.target.value })}
                  placeholder="Item name"
                  className="soft-input"
                />
                <input
                  value={draft.quantity}
                  onChange={(event) => updateDraft(section.key, { quantity: event.target.value })}
                  placeholder="Quantity"
                  className="soft-input"
                />
                <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                  <label className="flex items-center gap-3 rounded-xl bg-white/85 px-4 py-3 text-sm text-slate-700 ring-1 ring-white/80">
                    <input
                      type="checkbox"
                      checked={draft.lowStock}
                      onChange={(event) =>
                        updateDraft(section.key, { lowStock: event.target.checked })
                      }
                    />
                    Low stock
                  </label>
                  <div className="flex gap-3">
                    {draft.editingId ? (
                      <button
                        type="button"
                        className="soft-button-secondary"
                        onClick={() => resetDraft(section.key)}
                      >
                        Cancel
                      </button>
                    ) : null}
                    <button type="submit" className="soft-button">
                      {draft.editingId ? "Save item" : "Add item"}
                    </button>
                  </div>
                </div>
              </form>

              <div className="mt-4 space-y-3">
                {section.items.length === 0 ? (
                  <p className="text-sm leading-6 text-slate-500">
                    Nothing here yet. Add one item and keep it simple.
                  </p>
                ) : null}

                {section.items.map((item) => (
                  <div key={item.id} className="rounded-2xl bg-white/86 p-4 ring-1 ring-white/90">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-base font-semibold text-slate-800">{item.name}</p>
                          {item.lowStock ? (
                            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-800">
                              Low stock
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-2 text-sm text-slate-600">
                          {item.quantity || "Quantity not set"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="soft-button-secondary"
                          onClick={() =>
                            updateDraft(section.key, {
                              editingId: item.id,
                              name: item.name,
                              quantity: item.quantity,
                              notes: item.notes,
                              lowStock: item.lowStock,
                            })
                          }
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="soft-button-secondary"
                          onClick={() => onRemoveItem(section.key, item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </WidgetShell>
  );
}
