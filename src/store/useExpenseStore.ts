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

  // Expenses
  addExpense: (e: Omit<Expense, "id">) => void;
  updateExpense: (id: string, patch: Partial<Omit<Expense, "id">>) => void;
  deleteExpense: (id: string) => void;

  // Categories
  addCategory: (cat: Category) => void;
  updateCategory: (id: string, patch: Partial<Omit<Category, "id">>) => void;
  deleteCategory: (id: string) => void;

  // Targets
  setTarget: (month: number, year: number, amount: number) => void;

  // Helpers
  guessCategory: (description: string) => string | null;
}

export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set, get) => ({
      categories: [],
      expenses: [],
      targets: [],

      // ---- Expenses ----
      addExpense: (e) =>
        set((s) => ({ expenses: [...s.expenses, { id: uuid(), ...e }] })),

      updateExpense: (id, patch) =>
        set((s) => ({
          expenses: s.expenses.map((x) => (x.id === id ? { ...x, ...patch } : x)),
        })),

      deleteExpense: (id) =>
        set((s) => ({ expenses: s.expenses.filter((x) => x.id !== id) })),

      // ---- Categories ----
      addCategory: (cat) =>
        set((s) => ({ categories: [...s.categories, cat] })),

      updateCategory: (id, patch) =>
        set((s) => ({
          categories: s.categories.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        })),

      deleteCategory: (id) =>
        set((s) => ({
          categories: s.categories.filter((c) => c.id !== id),
          // orphaned expenses lose the category
          expenses: s.expenses.map((e) => (e.categoryId === id ? { ...e, categoryId: "" } : e)),
        })),

      // ---- Targets ----
      setTarget: (month, year, amount) =>
        set((s) => {
          const i = s.targets.findIndex((t) => t.month === month && t.year === year);
          if (i >= 0) {
            const copy = s.targets.slice();
            copy[i] = { ...copy[i], amount };
            return { targets: copy };
          }
          return { targets: [...s.targets, { month, year, amount }] };
        }),

      // ---- Guess category by linked descriptions (case-insensitive substring) ----
      guessCategory: (description) => {
        const d = description.trim().toLowerCase();
        if (!d) return null;
        for (const c of get().categories) {
          if (c.linkedDescriptions.some((ld) => d.includes(ld.toLowerCase()))) {
            return c.id;
          }
        }
        return null;
      },
    }),
    { name: "expense-tracker" } // key in localStorage
  )
);
