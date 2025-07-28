import React, { useState, ChangeEvent, FormEvent } from "react";
import { useExpenseStore } from "../../store/useExpenseStore";
import type { Expense, Category } from "../../store/useExpenseStore";
import { clsx } from "clsx";
import { ExpenseRow } from "./ExpenseRow";
import { AddExpenseForm } from "./AddExpenseForm";


/****************************
 * ExpenseTable Component
 ***************************/
export const ExpenseTable: React.FC = () => {
  const { expenses } = useExpenseStore();

  return (
    <div className="overflow-auto rounded-lg shadow-md bg-white dark:bg-gray-800">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="p-2 text-left font-semibold">Date</th>
            <th className="p-2 text-left font-semibold">Description</th>
            <th className="p-2 text-left font-semibold">Category</th>
            <th className="p-2 text-right font-semibold">Amount (€)</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => (
            <ExpenseRow key={exp.id} expense={exp} />
          ))}
          {/* Add form row */}
          <AddExpenseForm />
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseTable;
