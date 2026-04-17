"use client";

import { FormEvent, useState } from "react";
import { WidgetShell } from "@/components/WidgetShell";
import { formatDateLabel } from "@/lib/dashboard";
import { BillItem } from "@/types/dashboard";

type BillsWidgetProps = {
  bills: BillItem[];
  onAddBill: (title: string, amount: string, dueDate: string) => void;
  onTogglePaid: (billId: string) => void;
};

export function BillsWidget({ bills, onAddBill, onTogglePaid }: BillsWidgetProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  function submitBill(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !dueDate.trim()) {
      return;
    }

    onAddBill(title.trim(), amount.trim(), dueDate);
    setTitle("");
    setAmount("");
    setDueDate("");
  }

  return (
    <WidgetShell
      eyebrow="Bills"
      title="Know what is coming due"
      description="Keep due dates and paid status visible without needing a separate spreadsheet."
      theme="rose"
      icon="bills"
    >
      <form
        className="grid gap-3 rounded-2xl bg-rose-50/70 p-5 ring-1 ring-rose-100 sm:grid-cols-[1fr_140px_170px_auto]"
        onSubmit={submitBill}
      >
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Bill name"
          className="soft-input"
        />
        <input
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="$ amount"
          className="soft-input"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
          className="soft-input"
        />
        <button type="submit" className="soft-button">
          Add
        </button>
      </form>

      <div className="mt-7 space-y-3">
        {bills.map((bill) => (
          <button
            key={bill.id}
            type="button"
            onClick={() => onTogglePaid(bill.id)}
            className={`flex w-full items-center justify-between rounded-2xl px-5 py-4 text-left ring-1 ring-rose-100 transition ${
              bill.paid ? "bg-rose-100/70" : "bg-white/78 hover:bg-white"
            }`}
          >
            <div>
              <p
                className={`text-base font-medium text-slate-700 ${
                  bill.paid ? "line-through opacity-60" : ""
                }`}
              >
                {bill.title}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                {bill.amount || "Amount TBD"} - {formatDateLabel(bill.dueDate)}
              </p>
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              {bill.paid ? "Paid" : "Open"}
            </span>
          </button>
        ))}
      </div>
    </WidgetShell>
  );
}
