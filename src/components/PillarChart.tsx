
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DailyEntry } from '@/types/pillar';

interface PillarChartProps {
  entries: DailyEntry[];
  color: string;
}

export const PillarChart = ({ entries, color }: PillarChartProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' });
  };

  const chartData = entries.map(entry => ({
    date: formatDate(entry.date),
    score: entry.score,
    fullDate: entry.date
  }));

  const getGradientId = () => {
    return color.replace(/[^a-zA-Z0-9]/g, '');
  };

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <defs>
            <linearGradient id={getGradientId()} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="date" 
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            domain={[0, 10]}
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{
              background: 'white',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              padding: '12px'
            }}
            labelStyle={{ color: '#334155', fontWeight: 'semibold' }}
            formatter={(value: any) => [`${value}/10`, 'Pontuação']}
            labelFormatter={(label: any) => `Data: ${label}`}
          />
          <Line 
            type="monotone" 
            dataKey="score" 
            stroke="#8B5CF6"
            strokeWidth={3}
            dot={{ fill: '#8B5CF6', strokeWidth: 0, r: 6 }}
            activeDot={{ r: 8, stroke: '#8B5CF6', strokeWidth: 2, fill: 'white' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
