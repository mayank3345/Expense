import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function MonthlyExpensesChart({ data }) {
  return (
    <div className="w-full h-[300px] -ml-4 sm:ml-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 20,
            bottom: 60,
            left: 40,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="month"
            stroke="#6b7280"
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={60}
            interval={0}
            tickMargin={5}
          />
          <YAxis
            stroke="#6b7280"
            fontSize={12}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            formatter={(value) => [`$${value}`, "Total Expenses"]}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              padding: "8px",
            }}
            cursor={{ fill: "rgba(79, 70, 229, 0.1)" }}
          />
          <Bar
            dataKey="amount"
            fill="#4F46E5"
            radius={[4, 4, 0, 0]}
            maxBarSize={50}
            name="Total Expenses"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
