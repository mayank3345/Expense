import { useEffect, useState } from "react";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import MonthlyExpensesChart from "../components/MonthlyExpensesChart";
import DashboardSummary from "../components/DashboardSummary";
import CategoryPieChart from "../components/CategoryPieChart";
import BudgetForm from "../components/BudgetForm";
import BudgetComparison from "../components/BudgetComparison";
import SpendingInsights from "../components/SpendingInsights";

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [budgets, setBudgets] = useState({});

  useEffect(() => {
    fetchTransactions();
    fetchBudgets();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/transactions");
      const data = await res.json();
      setTransactions(data);
      setChartData(processMonthlyData(data));
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const fetchBudgets = async () => {
    try {
      const res = await fetch("/api/budgets");
      const data = await res.json();
      setBudgets(data);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  };

  const processMonthlyData = (transactions) => {
    const monthlyData = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;

      if (!acc[monthYear]) {
        acc[monthYear] = 0;
      }
      acc[monthYear] += Number(transaction.amount);
      return acc;
    }, {});

    return Object.entries(monthlyData)
      .map(([month, amount]) => ({
        month,
        amount,
      }))
      .sort((a, b) => {
        const [aMonth, aYear] = a.month.split("/");
        const [bMonth, bYear] = b.month.split("/");
        return new Date(aYear, aMonth - 1) - new Date(bYear, bMonth - 1);
      });
  };

  const processCategoryData = (transactions) => {
    return transactions.reduce((acc, transaction) => {
      const category = transaction.category || "other";
      acc[category] = (acc[category] || 0) + Number(transaction.amount);
      return acc;
    }, {});
  };

  const handleSubmitTransaction = async (data) => {
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        fetchTransactions(); // Refresh data after successful submission
      }
    } catch (error) {
      console.error("Error submitting transaction:", error);
    }
  };

  const handleSubmitBudgets = async (data) => {
    try {
      const res = await fetch("/api/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        fetchBudgets();
      }
    } catch (error) {
      console.error("Error submitting budgets:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8 max-w-6xl">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-center">
        Personal Finance Visualizer
      </h1>

      {/* Dashboard Summary */}
      <div className="mb-4 sm:mb-8">
        <DashboardSummary transactions={transactions} budgets={budgets} />
      </div>

      {/* Main Content */}
      <div className="space-y-4 sm:space-y-8">
        {/* Transactions and Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              Add Transaction
            </h2>
            <TransactionForm onSubmit={handleSubmitTransaction} />
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              Category Breakdown
            </h2>
            <CategoryPieChart data={processCategoryData(transactions)} />
          </div>
        </div>

        {/* Budgets Section */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Monthly Budgets
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
            <div>
              <h3 className="text-base sm:text-lg font-medium mb-4">
                Set Budgets
              </h3>
              <BudgetForm
                onSubmit={handleSubmitBudgets}
                initialBudgets={budgets}
              />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-medium mb-4">
                Spending Insights
              </h3>
              <SpendingInsights
                budgets={budgets}
                actualSpending={processCategoryData(transactions)}
              />
            </div>
          </div>
        </div>

        {/* Budget Comparison */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Budget vs Actual
          </h2>
          <BudgetComparison
            budgets={budgets}
            actualSpending={processCategoryData(transactions)}
          />
        </div>

        {/* Charts and Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              Monthly Overview
            </h2>
            <MonthlyExpensesChart data={chartData} />
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              Recent Transactions
            </h2>
            <TransactionList
              transactions={transactions}
              onUpdate={fetchTransactions}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
