import { TRANSACTION_CATEGORIES } from "../lib/constants";

export default function SpendingInsights({ budgets, actualSpending }) {
  const insights = [];

  // Add income insight
  const monthlyIncome = Number(budgets.income || 0);
  if (monthlyIncome > 0) {
    const totalExpenses = Object.values(actualSpending).reduce(
      (sum, val) => sum + Math.abs(Number(val || 0)),
      0
    );
    const savingsRate = ((monthlyIncome - totalExpenses) / monthlyIncome) * 100;

    if (savingsRate > 0) {
      insights.push({
        type: "success",
        message: `You're saving ${savingsRate.toFixed(0)}% of your income!`,
      });
    }
  }

  // Calculate overspending categories
  const overspentCategories = TRANSACTION_CATEGORIES.filter(
    (cat) => cat.id !== "income" && cat.id !== "other"
  )
    .map((category) => {
      const budget = Number(budgets[category.id] || 0);
      const actual = Math.abs(actualSpending[category.id] || 0);
      const difference = actual - budget;
      return {
        category: category.label,
        difference,
        percentage: budget > 0 ? (difference / budget) * 100 : 0,
      };
    })
    .filter((cat) => cat.difference > 0)
    .sort((a, b) => b.difference - a.difference);

  if (overspentCategories.length > 0) {
    insights.push({
      type: "warning",
      message: `Overspent in ${
        overspentCategories[0].category
      } by $${overspentCategories[0].difference.toFixed(
        2
      )} (${overspentCategories[0].percentage.toFixed(0)}% over budget)`,
    });
  }

  // Calculate total budget vs actual
  const totalBudget = Object.values(budgets).reduce(
    (sum, val) => sum + Number(val || 0),
    0
  );
  const totalSpending = Object.values(actualSpending).reduce(
    (sum, val) => sum + Math.abs(Number(val || 0)),
    0
  );

  if (totalSpending < totalBudget) {
    insights.push({
      type: "success",
      message: `You're under total budget by $${(
        totalBudget - totalSpending
      ).toFixed(2)}!`,
    });
  }

  // Find categories with no spending
  const unusedBudgets = TRANSACTION_CATEGORIES.filter(
    (cat) => cat.id !== "income" && cat.id !== "other"
  )
    .filter(
      (category) =>
        Number(budgets[category.id] || 0) > 0 && !actualSpending[category.id]
    )
    .map((category) => category.label);

  if (unusedBudgets.length > 0) {
    insights.push({
      type: "info",
      message: `No spending in ${unusedBudgets.join(", ")} this month.`,
    });
  }

  // Add income vs expenses insight
  if (monthlyIncome > 0) {
    const totalExpenses = Object.values(actualSpending).reduce(
      (sum, val) => sum + Math.abs(Number(val || 0)),
      0
    );
    if (totalExpenses > monthlyIncome) {
      insights.push({
        type: "warning",
        message: `Your expenses ($${totalExpenses.toFixed(
          2
        )}) exceed your income ($${monthlyIncome.toFixed(2)})`,
      });
    }
  }

  return (
    <div className="space-y-3">
      {insights.map((insight, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg ${
            insight.type === "warning"
              ? "bg-yellow-50 text-yellow-700"
              : insight.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-blue-50 text-blue-700"
          }`}
        >
          {insight.message}
        </div>
      ))}
      {insights.length === 0 && (
        <div className="text-gray-500 text-center py-4">
          No insights available yet. Set some budgets to get started!
        </div>
      )}
    </div>
  );
}
