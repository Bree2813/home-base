"use client";

import { FormEvent, useState } from "react";
import { WidgetShell, WidgetTheme } from "@/components/WidgetShell";
import { IconName } from "@/components/AppIcon";
import { ChecklistItem } from "@/types/dashboard";

type SimpleListWidgetProps = {
  eyebrow: string;
  title: string;
  description: string;
  items: ChecklistItem[];
  secondaryItems?: ChecklistItem[];
  secondaryTitle?: string;
  addLabel: string;
  secondaryAddLabel?: string;
  theme?: WidgetTheme;
  icon?: IconName;
  onAddItem: (title: string, listKey?: "primary" | "secondary") => void;
  onToggleItem: (itemId: string, listKey?: "primary" | "secondary") => void;
  onSaveItem?: (itemId: string, title: string, listKey?: "primary" | "secondary") => void;
  onRemoveItem?: (itemId: string, listKey?: "primary" | "secondary") => void;
};

export function SimpleListWidget({
  eyebrow,
  title,
  description,
  items,
  secondaryItems,
  secondaryTitle,
  addLabel,
  secondaryAddLabel,
  theme = "slate",
  icon,
  onAddItem,
  onToggleItem,
  onSaveItem,
  onRemoveItem,
}: SimpleListWidgetProps) {
  const [primaryDraft, setPrimaryDraft] = useState("");
  const [secondaryDraft, setSecondaryDraft] = useState("");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingListKey, setEditingListKey] = useState<"primary" | "secondary">("primary");
  const [editingDraft, setEditingDraft] = useState("");

  function submitPrimary(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = primaryDraft.trim();
    if (!trimmed) {
      return;
    }
    onAddItem(trimmed, "primary");
    setPrimaryDraft("");
  }

  function submitSecondary(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = secondaryDraft.trim();
    if (!trimmed) {
      return;
    }
    onAddItem(trimmed, "secondary");
    setSecondaryDraft("");
  }

  function startEditing(item: ChecklistItem, listKey: "primary" | "secondary") {
    setEditingItemId(item.id);
    setEditingListKey(listKey);
    setEditingDraft(item.title);
  }

  function cancelEditing() {
    setEditingItemId(null);
    setEditingDraft("");
    setEditingListKey("primary");
  }

  function submitEditing(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = editingDraft.trim();
    if (!trimmed || !editingItemId || !onSaveItem) {
      return;
    }

    onSaveItem(editingItemId, trimmed, editingListKey);
    cancelEditing();
  }

  function renderItems(sectionItems: ChecklistItem[], listKey: "primary" | "secondary") {
    if (sectionItems.length === 0) {
      return (
        <div className="rounded-[1.2rem] border border-dashed border-slate-200/85 bg-white/55 px-4 py-4 text-sm leading-7 text-slate-600">
          Nothing here yet. Add one item to get this list started.
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {sectionItems.map((item) => (
          <div
            key={item.id}
            className={`rounded-xl px-4 py-4 ring-1 ring-white/80 transition ${
              item.checked ? "bg-white/65 text-slate-600" : "bg-white/78 text-slate-800"
            }`}
          >
            {editingItemId === item.id ? (
              <form className="flex flex-col gap-3 sm:flex-row" onSubmit={submitEditing}>
                <input
                  value={editingDraft}
                  onChange={(event) => setEditingDraft(event.target.value)}
                  className="soft-input flex-1"
                />
                <div className="flex gap-2">
                  <button type="button" className="soft-button-secondary" onClick={cancelEditing}>
                    Cancel
                  </button>
                  <button type="submit" className="soft-button">
                    Save
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onToggleItem(item.id, listKey)}
                  className="flex min-w-0 flex-1 items-center justify-between text-left"
                >
                  <span className={item.checked ? "line-through" : ""}>{item.title}</span>
                  <span className="ml-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                    {item.checked ? "Done" : "Tap"}
                  </span>
                </button>
                {onSaveItem ? (
                  <button
                    type="button"
                    className="soft-button-secondary"
                    onClick={() => startEditing(item, listKey)}
                  >
                    Edit
                  </button>
                ) : null}
                {onRemoveItem ? (
                  <button
                    type="button"
                    className="soft-button-secondary"
                    onClick={() => onRemoveItem(item.id, listKey)}
                  >
                    Remove
                  </button>
                ) : null}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <WidgetShell
      eyebrow={eyebrow}
      title={title}
      description={description}
      theme={theme}
      icon={icon}
    >
      <div className="space-y-7">
        <div>
          <form className="flex flex-col gap-3 sm:flex-row" onSubmit={submitPrimary}>
            <input
              value={primaryDraft}
              onChange={(event) => setPrimaryDraft(event.target.value)}
              placeholder={addLabel}
              className="soft-input flex-1"
            />
            <button type="submit" className="soft-button">
              Add item
            </button>
          </form>
          <div className="mt-5">{renderItems(items, "primary")}</div>
        </div>

        {secondaryItems && secondaryTitle ? (
          <div className="rounded-2xl border border-dashed border-white/80 bg-white/40 p-5">
            <p className="text-sm font-medium text-slate-700">{secondaryTitle}</p>
            <form className="mt-3 flex flex-col gap-3 sm:flex-row" onSubmit={submitSecondary}>
              <input
                value={secondaryDraft}
                onChange={(event) => setSecondaryDraft(event.target.value)}
                placeholder={secondaryAddLabel ?? "Add another item"}
                className="soft-input flex-1"
              />
              <button type="submit" className="soft-button-secondary">
                Add item
              </button>
            </form>
            <div className="mt-5">{renderItems(secondaryItems, "secondary")}</div>
          </div>
        ) : null}
      </div>
    </WidgetShell>
  );
}
