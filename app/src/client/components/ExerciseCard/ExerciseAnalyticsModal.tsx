import React, { useState, useEffect } from 'react';
import { getExerciseAnalytics } from 'wasp/client/operations';
import { toast } from 'sonner';
import * as Recharts from 'recharts';

type AnalyticsData = {
  totalShares: number;
  totalCompletions: number;
  averageScore: number;
  averageTimeSpent: number; // in minutes
  completionRate: number; // percentage
  userProgress: {
    email: string;
    completed: boolean;
    score: number | null;
    timeSpent: number | null; // in minutes
    startedAt: string | null;
    completedAt: string | null;
  }[];
};

// Replace the COLORS array with your tailwind theme colors
const COLORS = [
  '#05c49b',  // primary-500 (Teal/Green)
  '#134fff',  // secondary-500 (Blue)
  '#c76905',  // tertiary-500 (Orange)
  '#219653',  // success (Green)
  '#D34053'   // danger (Red)
];

// Use components through the namespace
const { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} = Recharts as any;

// Format time display in "X min Y sec" or just "Y sec" format
const formatTimeDisplay = (seconds: number | null) => {
  if (seconds === null) return '-';
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  
  if (mins === 0) {
    return `${secs} sec`;
  } else {
    return `${mins} min ${secs} sec`;
  }
};

const ExerciseAnalyticsModal: React.FC<{
  exerciseId: string;
  exerciseName: string;
  onClose: () => void;
}> = ({ exerciseId, exerciseName, onClose }) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        const response = await getExerciseAnalytics({ exerciseId });
        console.log(response);
        if (response.success) {
          setAnalyticsData(response.data);
        } else {
          toast.error(response.message || 'Failed to load analytics');
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
        toast.error('Failed to load analytics data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [exerciseId]);

  // Prepare data for completion status pie chart
  const completionStatusData = analyticsData ? [
    { name: 'Completed', value: analyticsData.totalCompletions },
    { name: 'Not Completed', value: analyticsData.totalShares - analyticsData.totalCompletions }
  ] : [];

  // Prepare data for time spent distribution
  const timeSpentDistribution = analyticsData?.userProgress
    .filter(user => user.timeSpent !== null)
    .reduce((acc, user) => {
      // Get time in minutes for grouping
      const timeInMinutes = Math.floor((user.timeSpent || 0) / 60);
      
      // Create time ranges in 1-minute increments
      const rangeKey = timeInMinutes === 0 
        ? '< 1 min' 
        : `${timeInMinutes} min`;
      
      acc[rangeKey] = (acc[rangeKey] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const timeSpentDistributionData = timeSpentDistribution 
    ? Object.entries(timeSpentDistribution)
        .map(([range, count]) => ({ range, count }))
        .sort((a, b) => {
          // Special handling for "< 1 min" to always be first
          if (a.range === '< 1 min') return -1;
          if (b.range === '< 1 min') return 1;
          return parseInt(a.range) - parseInt(b.range);
        })
    : [];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white w-full max-w-4xl p-6 rounded-lg shadow-lg font-montserrat relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        
        <h2 className="text-title-sm font-manrope font-semibold mb-4 text-gray-900">
          Analytics for: {exerciseName}
        </h2>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : analyticsData ? (
          <div className="space-y-8">
            {/* Summary metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Total Shares</h3>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.totalShares}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Completion Rate</h3>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.completionRate}%</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Average Score</h3>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.averageScore.toFixed(1)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Avg. Time</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {formatTimeDisplay(analyticsData.averageTimeSpent)}
                </p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Completion Status */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-4">Completion Status</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={completionStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }: { name: string; percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {completionStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Time Spent Distribution */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-4">Time Spent Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={timeSpentDistributionData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS[1]} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={COLORS[1]} stopOpacity={0.2}/>
                        </linearGradient>
                      </defs>
                      <Bar 
                        type="monotone" 
                        dataKey="count" 
                        name="Number of Students" 
                        stroke={COLORS[1]} 
                        fillOpacity={1} 
                        fill="url(#colorCount)" 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* User Progress Table */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">Individual Progress</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time Spent
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Started
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Completed
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {analyticsData.userProgress.map((user, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.completed 
                              ? 'bg-green-100 text-green-800' 
                              : user.startedAt 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.completed 
                              ? 'Completed' 
                              : user.startedAt 
                                ? 'In Progress' 
                                : 'Not Started'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.score !== null ? user.score : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.timeSpent !== null ? formatTimeDisplay(user.timeSpent) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.startedAt ? new Date(user.startedAt).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.completedAt ? new Date(user.completedAt).toLocaleDateString() : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No analytics data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseAnalyticsModal;
