import { useState } from "react";

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
          className="py-4 flex justify-between items-center"
        >
          <div>
            <p className="font-medium text-gray-900">
              {transaction.description}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(transaction.date).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <p
              className={`font-semibold ${
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
              className="text-red-600 hover:text-red-800 disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
      {transactions.length === 0 && (
        <p className="py-4 text-center text-gray-500">No transactions found</p>
      )}
    </div>
  );
}
