import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { getBalanceHistory, getCategoryData, formatCurrency } from '../utils/formatters';

export const BalanceHistoryChart = ({ transactions }) => {
  const data = getBalanceHistory(transactions);

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#94a3b8" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
            itemStyle={{ color: '#f8fafc' }}
            formatter={(value) => [formatCurrency(value), 'Balance']}
          />
          <Area 
            type="monotone" 
            dataKey="balance" 
            stroke="#38bdf8" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorBalance)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const DistributionChart = ({ transactions }) => {
  const data = getCategoryData(transactions);

  return (
    <div className="h-[300px] w-full mt-4 flex justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
             contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
             itemStyle={{ color: '#f8fafc' }}
             formatter={(value) => formatCurrency(value)}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
