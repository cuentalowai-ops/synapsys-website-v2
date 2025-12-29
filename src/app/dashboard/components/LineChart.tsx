"use client"

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

interface LineChartProps {
  data: Array<{ name: string; value: number }>
}

export function LineChart({ data }: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
        <XAxis
          dataKey="name"
          className="text-xs text-gray-600 dark:text-gray-400"
          stroke="currentColor"
        />
        <YAxis
          className="text-xs text-gray-600 dark:text-gray-400"
          stroke="currentColor"
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--background)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#FFB088"
          strokeWidth={2}
          dot={{ fill: "#FFB088", r: 4 }}
          name="Verifications"
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}

