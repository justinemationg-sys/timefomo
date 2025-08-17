import React, { useState, useEffect, useMemo } from 'react';

// Lazy load recharts to avoid SSR/context issues
const LazyPieChart = React.lazy(() => 
  import('recharts').then(module => ({
    default: ({ data, innerRadius = 35, outerRadius = 60, children, ...props }: any) => {
      const { PieChart, Pie, ResponsiveContainer } = module;
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={2}
              dataKey="value"
              {...props}
            >
              {children}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      );
    }
  }))
);

const LazyCell = React.lazy(() => 
  import('recharts').then(module => ({ default: module.Cell }))
);

const LazyTooltip = React.lazy(() => 
  import('recharts').then(module => ({ default: module.Tooltip }))
);

interface PieChartData {
  name: string;
  value: number;
  color: string;
}

interface SafePieChartProps {
  data: PieChartData[];
  innerRadius?: number;
  outerRadius?: number;
  formatter?: (value: any, name: any) => [any, any];
  tooltipStyle?: React.CSSProperties;
}

const SafePieChart: React.FC<SafePieChartProps> = ({ 
  data, 
  innerRadius = 35, 
  outerRadius = 60,
  formatter,
  tooltipStyle
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const memoizedData = useMemo(() => data, [data]);

  const fallback = (
    <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse flex items-center justify-center">
      <span className="text-gray-500 dark:text-gray-400 text-xs">Loading...</span>
    </div>
  );

  if (!isClient) {
    return fallback;
  }

  try {
    return (
      <React.Suspense fallback={fallback}>
        <LazyPieChart 
          data={memoizedData}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
        >
          {memoizedData.map((entry, index) => (
            <React.Suspense key={`cell-${index}`} fallback={null}>
              <LazyCell fill={entry.color} />
            </React.Suspense>
          ))}
          <React.Suspense fallback={null}>
            <LazyTooltip 
              formatter={formatter}
              contentStyle={tooltipStyle}
            />
          </React.Suspense>
        </LazyPieChart>
      </React.Suspense>
    );
  } catch (error) {
    console.warn('SafePieChart error:', error);
    return (
      <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
        <span className="text-gray-500 dark:text-gray-400 text-xs">Chart Error</span>
      </div>
    );
  }
};

export default SafePieChart;
