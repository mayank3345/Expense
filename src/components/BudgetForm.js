import { useState } from "react";
import { TRANSACTION_CATEGORIES } from "../lib/constants";

export default function BudgetForm({ onSubmit, initialBudgets }) {
  const [budgets, setBudgets] = useState(
    initialBudgets ||
      TRANSACTION_CATEGORIES.reduce((acc, cat) => {
        acc[cat.id] = "";
        return acc;
      }, {})
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(budgets);
    } catch (error) {
      console.error("Error submitting budgets:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Income Input */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pb-4 border-b border-gray-200">
        <label className="text-sm font-medium text-gray-700 sm:w-1/2">
          Monthly Income
        </label>
        <input
          type="number"
          value={budgets.income || ""}
          onChange={(e) => setBudgets({ ...budgets, income: e.target.value })}
          min="0"
          step="0.01"
          className="w-full sm:w-1/2 rounded-md border-gray-300 shadow-sm 
            focus:border-indigo-500 focus:ring-indigo-500 text-sm
            p-2 border"
          placeholder="0.00"
        />
      </div>

      {/* Expense Categories */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-500">Monthly Expenses</h3>
        {TRANSACTION_CATEGORIES.map((category) => {
          if (category.id === "income") return null;

          return (
            <div
              key={category.id}
              className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
            >
              <label className="text-sm font-medium text-gray-700 sm:w-1/2">
                {category.label}
              </label>
              <input
                type="number"
                value={budgets[category.id]}
                onChange={(e) =>
                  setBudgets({ ...budgets, [category.id]: e.target.value })
                }
                min="0"
                step="0.01"
                className="w-full sm:w-1/2 rounded-md border-gray-300 shadow-sm 
                  focus:border-indigo-500 focus:ring-indigo-500 text-sm
                  p-2 border"
                placeholder="0.00"
              />
            </div>
          );
        })}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md 
          hover:bg-indigo-700 focus:outline-none focus:ring-2 
          focus:ring-indigo-500 focus:ring-offset-2 transition-colors
          font-medium disabled:opacity-50 text-sm sm:text-base"
      >
        {isSubmitting ? "Saving..." : "Save Budgets"}
      </button>
    </form>
  );
}
