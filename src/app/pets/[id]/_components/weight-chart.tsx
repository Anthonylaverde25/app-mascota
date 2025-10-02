'use client';

import * as React from 'react';
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import type { Weight } from '@/lib/data';
import { formatDate } from '@/lib/utils';
import { useTheme } from 'next-themes';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../../../../tailwind.config';

const fullConfig = resolveConfig(tailwindConfig);

type WeightChartProps = {
  data: Weight[];
};

export function WeightChart({ data }: WeightChartProps) {
  const { theme } = useTheme();

  const primaryColor = fullConfig.theme.colors.primary.DEFAULT.replace(
    /hsl\(([^)]+)\)/,
    (match, values) => {
      const [h, s, l] = values.split(' ');
      return `hsl(${h}, ${s}, ${l})`;
    }
  );

  const formattedData = data.map((item) => ({
    ...item,
    fecha: formatDate(item.fecha),
  }));

  return (
    <div style={{ width: '100%', height: 250 }}>
      <ResponsiveContainer>
        <LineChart
          data={formattedData}
          margin={{
            top: 5,
            right: 20,
            left: -10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
          <XAxis 
            dataKey="fecha"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            domain={['dataMin - 2', 'dataMax + 2']}
            tickFormatter={(value) => `${value}kg`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: theme === 'dark' ? '#09090b' : '#ffffff',
              borderColor: theme === 'dark' ? '#27272a' : '#e4e4e7',
              borderRadius: '0.5rem',
            }}
            labelStyle={{ fontWeight: 'bold' }}
            formatter={(value, name) => [`${value} kg`, 'Weight']}
          />
          <Line
            type="monotone"
            dataKey="peso"
            stroke={primaryColor}
            strokeWidth={2}
            activeDot={{ r: 8 }}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
