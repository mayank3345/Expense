import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TRANSACTION_CATEGORIES } from "../lib/constants";

export default function BudgetComparison({ budgets, actualSpending }) {
  const data = TRANSACTION_CATEGORIES.filter(
    (cat) => cat.id !== "income" && cat.id !== "other"
  )
    .map((category) => ({
      name: category.label,
      budget: Number(budgets[category.id] || 0),
      actual: Math.abs(actualSpending[category.id] || 0),
      color: category.color,
    }))
    .filter((item) => item.budget > 0 || item.actual > 0);

  return (
    <div className="w-full h-[400px] -ml-4 sm:ml-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 20,
            bottom: 60,
            left: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="name"
            stroke="#6b7280"
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={80}
            interval={0}
            tickMargin={5}
          />
          <YAxis
            stroke="#6b7280"
            fontSize={12}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            formatter={(value) => `$${value.toFixed(2)}`}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              padding: "8px",
            }}
          />
          <Legend
            wrapperStyle={{
              paddingTop: "20px",
            }}
          />
          <Bar dataKey="budget" name="Budget" fill="#9BA3AF" maxBarSize={50} />
          <Bar dataKey="actual" name="Actual" fill="#4F46E5" maxBarSize={50} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
