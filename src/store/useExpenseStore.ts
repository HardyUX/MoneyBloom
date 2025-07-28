import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuid } from "uuid";

// ----- Interfaces -----
export interface Category {
  id: string;
  name: string;
  color: string;
  linkedDescriptions: string[];
}
export interface Expense {
  id: string;
  date: string;        // ISO yyyy-mm-dd
  description: string;
  amount: number;      // cents
  categoryId: string;
}
export interface MonthlyTarget {
  month: number;       // 0-11
  year: number;
  amount: number;      // cents
}

// ----- Store -----
interface ExpenseState {
  categories: Category[];
  expenses: Expense[];
  targets: MonthlyTarget[];

  addExpense: (e: Omit<Expense, "id">) => void;
  /* …other mutators (update, delete, etc.) … */
}

export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set) => ({
      categories: [],
      expenses: [],
      targets: [],

      addExpense: (e) =>
        set((s) => ({
          expenses: [...s.expenses, { id: uuid(), ...e }],
        })),
    }),
    { name: "expense-tracker" } // key in localStorage
  )
);
