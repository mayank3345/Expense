import { useEffect, useState } from "react";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import MonthlyExpensesChart from "../components/MonthlyExpensesChart";

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchTransactions();
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Personal Finance Visualizer
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Add Transaction</h2>
          <TransactionForm onSubmit={handleSubmitTransaction} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Monthly Overview</h2>
          <MonthlyExpensesChart data={chartData} />
        </div>
      </div>
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <TransactionList
          transactions={transactions}
          onUpdate={fetchTransactions}
        />
      </div>
    </div>
  );
}
