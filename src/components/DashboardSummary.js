import { TRANSACTION_CATEGORIES } from "../lib/constants";

export default function DashboardSummary({ transactions, budgets }) {
  const totalIncome = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

  const netSavings = totalIncome - totalExpenses;
  const monthlyIncome = Number(budgets?.income || 0);

  const categoryTotals = transactions.reduce((acc, transaction) => {
    const amount = Math.abs(Number(transaction.amount));
    acc[transaction.category] = (acc[transaction.category] || 0) + amount;
    return acc;
  }, {});

  const topCategories = Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category:
        TRANSACTION_CATEGORIES.find((c) => c.id === category)?.label ||
        category,
      amount,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-xs sm:text-sm font-medium text-gray-500 truncate">
            Monthly Budget
          </h3>
          <p className="mt-1 text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">
            ${monthlyIncome.toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-xs sm:text-sm font-medium text-gray-500 truncate">
            Total Income
          </h3>
          <p className="mt-1 text-lg sm:text-xl lg:text-2xl font-bold text-green-600">
            ${totalIncome.toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-xs sm:text-sm font-medium text-gray-500 truncate">
            Total Expenses
          </h3>
          <p className="mt-1 text-lg sm:text-xl lg:text-2xl font-bold text-red-600">
            ${totalExpenses.toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-xs sm:text-sm font-medium text-gray-500 truncate">
            Net Savings
          </h3>
          <p
            className={`mt-1 text-lg sm:text-xl lg:text-2xl font-bold ${
              netSavings >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            ${Math.abs(netSavings).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Top Categories */}
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">
          Top Categories
        </h3>
        <div className="grid gap-2">
          {topCategories.map(({ category, amount }) => (
            <div
              key={category}
              className="flex items-center justify-between py-1 border-b border-gray-100 last:border-0"
            >
              <div className="flex items-center space-x-2">
                <span className="text-xs sm:text-sm text-gray-600 truncate">
                  {category}
                </span>
              </div>
              <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
                ${amount.toFixed(2)}
              </span>
            </div>
          ))}
          {topCategories.length === 0 && (
            <p className="text-xs sm:text-sm text-gray-500 text-center py-2">
              No transactions yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
