import React, { useMemo } from "react";
import { useExpenseStore } from "../store/useExpenseStore";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Helper to format cents as €
const euro = (amt: number) => (amt / 100).toLocaleString("de-DE", { style: "currency", currency: "EUR" });

// Get current month and year
const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();

const StatsSidebar: React.FC = () => {
  const { expenses, categories, targets } = useExpenseStore();

  // Get target for the current month
  const monthlyTarget = useMemo(
    () =>
      targets.find((t) => t.month === currentMonth && t.year === currentYear)?.amount ?? 0,
    [targets]
  );

  // Expenses for this month
  const monthlyExpenses = useMemo(
    () =>
      expenses.filter((exp) => {
        const d = new Date(exp.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      }),
    [expenses]
  );

  const totalSpent = useMemo(
    () => monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0),
    [monthlyExpenses]
  );

  // Totals by category
  const categoryTotals = useMemo(() => {
    const map: Record<string, number> = {};
    monthlyExpenses.forEach((exp) => {
      map[exp.categoryId] = (map[exp.categoryId] || 0) + exp.amount;
    });
    return Object.entries(map).map(([catId, amount]) => ({
      name: categories.find((c) => c.id === catId)?.name ?? "Other",
      color: categories.find((c) => c.id === catId)?.color ?? "#ddd",
      amount,
    }));
  }, [monthlyExpenses, categories]);

  // Over/under target
  const delta = monthlyTarget ? totalSpent - monthlyTarget : 0;
  const deltaColor = delta > 0 ? "text-red-600" : "text-green-700";

  return (
    <aside className="w-full max-w-xs bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col gap-6">
      <div>
        <div className="font-semibold text-lg mb-1">This Month</div>
        <div className="text-3xl font-bold">{euro(totalSpent)}</div>
        {monthlyTarget > 0 && (
          <div className="mt-1 text-sm">
            Target: <span className="font-semibold">{euro(monthlyTarget)}</span>
            <br />
            <span className={`font-medium ${deltaColor}`}>
              {delta > 0 ? "Over" : "Under"} by {euro(Math.abs(delta))}
            </span>
          </div>
        )}
      </div>

      <div>
        <div className="font-semibold mb-2">By Category</div>
        {categoryTotals.length === 0 ? (
          <div className="text-gray-400 text-sm">No data this month</div>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={categoryTotals} layout="vertical" margin={{ left: 16, right: 16 }}>
              <XAxis type="number" hide domain={[0, "dataMax"]} />
              <YAxis
                type="category"
                dataKey="name"
                width={90}
                tick={{ fontSize: 12, fill: "#555" }}
              />
              <Tooltip formatter={(v) => euro(Number(v))} />
              <Bar dataKey="amount">
                {categoryTotals.map((entry, idx) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
        <ul className="mt-3 space-y-1">
          {categoryTotals.map((c) => (
            <li key={c.name} className="flex items-center gap-2 text-sm">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ background: c.color }}
              />
              <span className="flex-1">{c.name}</span>
              <span className="font-medium">{euro(c.amount)}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default StatsSidebar;
