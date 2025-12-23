
import React from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PILLARS } from '@/lib/constants/pillars';

// --- COLORS ---
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57', '#ffc0cb'];

// --- 1. RADAR CHART (7 Pillars) ---
export const PillarRadarChart = ({ tasks }) => {
  const completedTasks = tasks.filter(t => t.status === 'wisdom');
  
  const data = PILLARS.map(pillar => {
    const total = tasks.filter(t => t.pillar === pillar.key).length;
    const completed = completedTasks.filter(t => t.pillar === pillar.key).length;
    // Normalized score (0-100), default 20 if no tasks to show "potential"
    const score = total === 0 ? 20 : Math.round((completed / total) * 100);
    
    return {
      subject: pillar.label,
      A: score,
      fullMark: 100,
      fill: pillar.color
    };
  });

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Progresso"
            dataKey="A"
            stroke="#8b5cf6"
            strokeWidth={2}
            fill="#8b5cf6"
            fillOpacity={0.3}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }}
            itemStyle={{ color: '#fff' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

// --- 2. BAR CHART (Sprints & Tasks) ---
export const ProductivityBarChart = ({ sprints, tasks }) => {
  // Group by Sprint
  const data = sprints.map(sprint => {
    const sprintTasks = tasks.filter(t => t.sprint_id === sprint.id || t.sprintId === sprint.id);
    const completed = sprintTasks.filter(t => t.status === 'wisdom').length;
    return {
      name: sprint.title.substring(0, 10) + '...',
      Total: sprintTasks.length,
      Concluídas: completed
    };
  }).slice(-5); // Last 5 sprints

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} />
          <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} />
          <Tooltip 
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }}
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          <Bar dataKey="Total" fill="#3f3f46" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Concluídas" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// --- 3. PIE CHART (Sub-pillars Distribution) ---
export const SubPillarPieChart = ({ tasks }) => {
  // Aggregate by sub_pillar
  const dist = {};
  tasks.forEach(t => {
    const key = t.sub_pillar || 'Geral';
    dist[key] = (dist[key] || 0) + 1;
  });

  const data = Object.entries(dist)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6); // Top 6

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
             contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }}
          />
          <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '10px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
