/****************************
 * AddExpenseForm Component
 ***************************/
import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useExpenseStore } from "../../store/useExpenseStore";
import type { Expense } from "../../store/useExpenseStore";

export const AddExpenseForm: React.FC = () => {
  const { addExpense, categories, guessCategory } = useExpenseStore();

  const [form, setForm] = useState<Omit<Expense, "id">>({
    date: new Date().toISOString().slice(0, 10),
    description: "",
    amount: 0,
    categoryId: "",
  });

  const handleChange = (
    key: keyof Omit<Expense, "id">,
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value =
      key === "amount" ? Math.round(parseFloat(e.target.value || "0") * 100) : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));

    // Prefill category on description change
    if (key === "description") {
      const catId = guessCategory(e.target.value);
      if (catId) setForm((f) => ({ ...f, categoryId: catId }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.description || form.amount <= 0) return;
    addExpense(form);
    // reset
    setForm({
      date: new Date().toISOString().slice(0, 10),
      description: "",
      amount: 0,
      categoryId: "",
    });
  };

  return (
    <tr>
      <td colSpan={5} className="p-2">
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 items-center">
          <input
            type="date"
            value={form.date}
            onChange={(e) => handleChange("date", e)}
            className="border rounded p-1"
          />
          <input
            type="text"
            placeholder="Description"
            value={form.description}
            onChange={(e) => handleChange("description", e)}
            className="flex-1 border rounded p-1"
          />
          <select
            value={form.categoryId}
            onChange={(e) => handleChange("categoryId", e)}
            className="border rounded p-1"
          >
            <option value="">Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="Amount"
            value={form.amount ? (form.amount / 100).toFixed(2) : ""}
            onChange={(e) => handleChange("amount", e)}
            className="w-28 border rounded p-1 text-right"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
          >
            Add
          </button>
        </form>
      </td>
    </tr>
  );
};