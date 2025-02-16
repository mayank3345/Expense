import { useState } from "react";
// import { Button, Input, Label } from "./ui/button"; // Example shadcn/ui components
import { TRANSACTION_CATEGORIES } from "../lib/constants";

export default function TransactionForm({ onSubmit, initialData }) {
  const [amount, setAmount] = useState(initialData?.amount || "");
  const [date, setDate] = useState(
    initialData?.date || new Date().toISOString().split("T")[0]
  );
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [category, setCategory] = useState(initialData?.category || "other");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        amount: Number(amount),
        date,
        description,
        category,
      });
      // Reset form after successful submission
      setAmount("");
      setDate(new Date().toISOString().split("T")[0]);
      setDescription("");
      setCategory("other");
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Amount
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          step="0.01"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
            focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
            p-2 border"
          placeholder="0.00"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
            focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
            p-2 border"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
            focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
            p-2 border"
          placeholder="Enter description"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
            focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
            p-2 border"
        >
          {TRANSACTION_CATEGORIES.map(({ id, label }) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md 
          hover:bg-indigo-700 focus:outline-none focus:ring-2 
          focus:ring-indigo-500 focus:ring-offset-2 transition-colors
          font-medium disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : "Save Transaction"}
      </button>
    </form>
  );
}
