import React, { useMemo } from "react";
import { useExpenseStore } from "../store/useExpenseStore";

// Helper to format month/year
const formatMonth = (month: number, year: number) =>
  new Date(year, month).toLocaleString("default", { month: "long", year: "numeric" });

// Helper to format euro
const euro = (amt: number) => (amt / 100).toLocaleString("de-DE", { style: "currency", currency: "EUR" });

const getNextMonth = (month: number, year: number) =>
  month === 11 ? { month: 0, year: year + 1 } : { month: month + 1, year };
const getPrevMonth = (month: number, year: number) =>
  month === 0 ? { month: 11, year: year - 1 } : { month: month - 1, year };

const Header: React.FC = () => {
  // In a more advanced app, month/year could be state in your store or via URL.
  // For now, we keep it local.
  const today = new Date();
  const [month, setMonth] = React.useState(today.getMonth());
  const [year, setYear] = React.useState(today.getFullYear());

  const { targets, setTarget } = useExpenseStore();

  // Find existing target for selected month/year
  const target = useMemo(
    () => targets.find((t) => t.month === month && t.year === year)?.amount ?? 0,
    [targets, month, year]
  );

  // Handler for setting a new target
  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.round(parseFloat(e.target.value || "0") * 100);
    setTarget(month, year, value);
  };

  // Month navigation
  const handlePrev = () => {
    const { month: m, year: y } = getPrevMonth(month, year);
    setMonth(m);
    setYear(y);
  };
  const handleNext = () => {
    const { month: m, year: y } = getNextMonth(month, year);
    setMonth(m);
    setYear(y);
  };

  // Optional: Dark mode toggle (uses Tailwind 4 .dark class)
  const toggleDark = () => {
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 py-3 px-4 bg-white dark:bg-gray-900 shadow rounded-b-lg">
      <div className="flex items-center gap-2">
        <button
          aria-label="Previous Month"
          onClick={handlePrev}
          className="rounded bg-gray-100 hover:bg-gray-200 p-1 text-lg"
        >
          &lt;
        </button>
        <span className="text-xl font-semibold px-2">
          {formatMonth(month, year)}
        </span>
        <button
          aria-label="Next Month"
          onClick={handleNext}
          className="rounded bg-gray-100 hover:bg-gray-200 p-1 text-lg"
        >
          &gt;
        </button>
      </div>
      <div className="flex items-center gap-2">
        <label className="mr-2 font-medium" htmlFor="target">
          Target:
        </label>
        <input
          id="target"
          type="number"
          step="0.01"
          min="0"
          className="w-24 border rounded px-2 py-1 text-right"
          value={target ? (target / 100).toFixed(2) : ""}
          onChange={handleTargetChange}
          placeholder="€0.00"
        />
      </div>
      <button
        onClick={toggleDark}
        className="ml-2 rounded bg-gray-100 hover:bg-gray-200 px-3 py-1"
        title="Toggle dark mode"
        type="button"
      >
        🌗
      </button>
    </header>
  );
};

export default Header;
