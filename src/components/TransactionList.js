import { useState } from "react";
import { TRANSACTION_CATEGORIES } from "../lib/constants";

export default function TransactionList({ transactions, onUpdate }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id) => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      const res = await fetch("/api/transactions", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="divide-y divide-gray-200">
      {transactions.map((transaction) => (
        <div
          key={transaction._id}
          className="py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0"
        >
          <div className="flex-1">
            <p className="font-medium text-gray-900 text-sm sm:text-base">
              {transaction.description}
            </p>
            <div className="flex items-center justify-between sm:justify-start gap-4">
              <p className="text-xs sm:text-sm text-gray-500">
                {new Date(transaction.date).toLocaleDateString()}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                {TRANSACTION_CATEGORIES.find(
                  (cat) => cat.id === transaction.category
                )?.label || "Other"}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-4">
            <p
              className={`font-semibold text-sm sm:text-base ${
                Number(transaction.amount) >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              ${Math.abs(transaction.amount).toFixed(2)}
            </p>
            <button
              onClick={() => handleDelete(transaction._id)}
              disabled={isDeleting}
              className="text-red-600 hover:text-red-800 disabled:opacity-50 text-sm sm:text-base"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
      {transactions.length === 0 && (
        <p className="py-4 text-center text-gray-500 text-sm sm:text-base">
          No transactions found
        </p>
      )}
    </div>
  );
}
