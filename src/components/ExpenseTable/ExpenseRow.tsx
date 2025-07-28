/****************************
 * ExpenseRow Component
 ***************************/
interface ExpenseRowProps {
  expense: Expense;
}

export const ExpenseRow: React.FC<ExpenseRowProps> = ({ expense }) => {
  const { categories, updateExpense, deleteExpense } = useExpenseStore();

  const handleChange = (
    key: keyof Omit<Expense, "id">,
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value =
      key === "amount" ? Math.round(parseFloat(e.target.value) * 100) : e.target.value;
    updateExpense(expense.id, { [key]: value } as Partial<Expense>);
  };

  return (
    <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
      {/* Date */}
      <td className="p-2">
        <input
          type="date"
          value={expense.date}
          onChange={(e) => handleChange("date", e)}
          className="bg-transparent w-full"
        />
      </td>
      {/* Description */}
      <td className="p-2">
        <input
          type="text"
          value={expense.description}
          onChange={(e) => handleChange("description", e)}
          className="bg-transparent w-full"
        />
      </td>
      {/* Category */}
      <td className="p-2">
        <select
          value={expense.categoryId}
          onChange={(e) => handleChange("categoryId", e)}
          className="bg-transparent w-full"
        >
          <option value="">–</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </td>
      {/* Amount */}
      <td className="p-2 text-right">
        <input
          type="number"
          step="0.01"
          min="0"
          value={(expense.amount / 100).toFixed(2)}
          onChange={(e) => handleChange("amount", e)}
          className="bg-transparent w-full text-right"
        />
      </td>
      {/* Actions */}
      <td className="p-2 text-center">
        <button
          onClick={() => deleteExpense(expense.id)}
          className="text-red-500 hover:text-red-700"
          aria-label="Delete"
        >
          ✕
        </button>
      </td>
    </tr>
  );
};