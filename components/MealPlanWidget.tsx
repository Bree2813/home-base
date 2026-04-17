"use client";

import { FormEvent, useState } from "react";
import { WidgetShell } from "@/components/WidgetShell";
import { MealPlanItem } from "@/types/dashboard";

type MealPlanWidgetProps = {
  meals: MealPlanItem[];
  autoSyncGroceries: boolean;
  onToggleAutoSync: () => void;
  onAddMeal: (day: string, meal: string, mealName: string, ingredients: string) => void;
};

export function MealPlanWidget({
  meals,
  autoSyncGroceries,
  onToggleAutoSync,
  onAddMeal,
}: MealPlanWidgetProps) {
  const [day, setDay] = useState("Monday");
  const [meal, setMeal] = useState("Dinner");
  const [mealName, setMealName] = useState("");
  const [ingredients, setIngredients] = useState("");

  function submitMeal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = mealName.trim();
    if (!trimmed) {
      return;
    }

    onAddMeal(day, meal, trimmed, ingredients);
    setMealName("");
    setIngredients("");
  }

  return (
    <WidgetShell
      eyebrow="Meals"
      title="Low-pressure meal planning"
      description="A simple plan is enough. Add ingredients only if they help your grocery list."
      theme="green"
      icon="meals"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/74 px-4 py-3 ring-1 ring-white/80">
        <div>
          <p className="text-sm font-semibold text-slate-800">Sync groceries with meals</p>
          <p className="mt-1 text-sm text-slate-600">
            {autoSyncGroceries
              ? "Ingredients from saved meals will be added to groceries when missing."
              : "Keep groceries separate unless you turn sync on."}
          </p>
        </div>
        <button type="button" className="soft-button-secondary" onClick={onToggleAutoSync}>
          {autoSyncGroceries ? "Turn sync off" : "Turn sync on"}
        </button>
      </div>

      <form
        className="grid gap-3 rounded-2xl bg-emerald-50/70 p-5 ring-1 ring-emerald-100 sm:grid-cols-[120px_140px_1fr_auto]"
        onSubmit={submitMeal}
      >
        <select value={day} onChange={(event) => setDay(event.target.value)} className="soft-input">
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((entry) => (
            <option key={entry} value={entry}>
              {entry}
            </option>
          ))}
        </select>
        <select value={meal} onChange={(event) => setMeal(event.target.value)} className="soft-input">
          {["Breakfast", "Lunch", "Dinner", "Snack"].map((entry) => (
            <option key={entry} value={entry}>
              {entry}
            </option>
          ))}
        </select>
        <input
          value={mealName}
          onChange={(event) => setMealName(event.target.value)}
          placeholder="Meal name"
          className="soft-input"
        />
        <button type="submit" className="soft-button">
          Save meal
        </button>
        <input
          value={ingredients}
          onChange={(event) => setIngredients(event.target.value)}
          placeholder="Ingredients list, comma separated"
          className="soft-input sm:col-span-4"
        />
      </form>

      <div className="mt-7 space-y-3">
        {meals.length === 0 ? (
          <div className="rounded-[1.3rem] border border-dashed border-emerald-200/85 bg-white/65 px-4 py-5 text-sm leading-7 text-slate-600">
            No meals planned yet. A loose plan for even one day is enough to make this useful.
          </div>
        ) : null}
        {meals.map((entry) => (
          <div key={entry.id} className="rounded-2xl bg-emerald-50/70 p-5 ring-1 ring-emerald-100">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700">
              {entry.day} - {entry.meal}
            </p>
            <p className="mt-3 text-base font-medium text-slate-800">{entry.plan}</p>
            {entry.ingredients.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {entry.ingredients.map((ingredient) => (
                  <span key={`${entry.id}-${ingredient}`} className="rounded-full bg-white/85 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-white/90">
                    {ingredient}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </WidgetShell>
  );
}
