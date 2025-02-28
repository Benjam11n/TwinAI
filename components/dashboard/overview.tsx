'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  {
    name: 'Jan',
    'Mental Wellbeing': 65,
    'Stress Level': 40,
    'Sleep Quality': 72,
  },
  {
    name: 'Feb',
    'Mental Wellbeing': 59,
    'Stress Level': 52,
    'Sleep Quality': 67,
  },
  {
    name: 'Mar',
    'Mental Wellbeing': 62,
    'Stress Level': 48,
    'Sleep Quality': 70,
  },
  {
    name: 'Apr',
    'Mental Wellbeing': 71,
    'Stress Level': 35,
    'Sleep Quality': 73,
  },
  {
    name: 'May',
    'Mental Wellbeing': 68,
    'Stress Level': 42,
    'Sleep Quality': 75,
  },
  {
    name: 'Jun',
    'Mental Wellbeing': 75,
    'Stress Level': 30,
    'Sleep Quality': 78,
  },
  {
    name: 'Jul',
    'Mental Wellbeing': 79,
    'Stress Level': 28,
    'Sleep Quality': 82,
  },
  {
    name: 'Aug',
    'Mental Wellbeing': 81,
    'Stress Level': 25,
    'Sleep Quality': 84,
  },
  {
    name: 'Sep',
    'Mental Wellbeing': 78,
    'Stress Level': 32,
    'Sleep Quality': 80,
  },
  {
    name: 'Oct',
    'Mental Wellbeing': 82,
    'Stress Level': 24,
    'Sleep Quality': 85,
  },
  {
    name: 'Nov',
    'Mental Wellbeing': 80,
    'Stress Level': 26,
    'Sleep Quality': 83,
  },
  {
    name: 'Dec',
    'Mental Wellbeing': 85,
    'Stress Level': 22,
    'Sleep Quality': 87,
  },
];

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 10,
          left: 10,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            borderColor: 'hsl(var(--border))',
            borderRadius: '8px',
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="Mental Wellbeing"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="Stress Level"
          stroke="hsl(var(--destructive))"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="Sleep Quality"
          stroke="hsl(var(--secondary))"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
