import React, { useState, useEffect } from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";

// UI Components
const Card = ({ children, className = "", ...props }) => {
  return (
    <div 
      className={`bg-gray-50 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const CardContent = ({ children, className = "", ...props }) => {
  return (
    <div 
      className={`p-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const Button = ({ 
  children, 
  onClick, 
  disabled = false, 
  className = "", 
  variant = "primary",
  ...props 
}) => {
  const baseClasses = "px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-blue-100 text-blue-800 hover:bg-blue-200 focus:ring-blue-300 disabled:bg-gray-200 disabled:text-gray-500",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-300 disabled:bg-gray-200 disabled:text-gray-500",
    success: "bg-green-100 text-green-800 hover:bg-green-200 focus:ring-green-300 disabled:bg-gray-200 disabled:text-gray-500",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Navigation Component
const Navigation = ({ currentPage, onPageChange }) => {
  const navItems = [
    { id: 'landing', label: 'Landing' },
    { id: 'campaign-hub', label: 'Campaign Hub' },
    { id: 'company-dashboard', label: 'Company Dashboard' },
    { id: 'competitor-intel', label: 'Competitor Intel' },
    { id: 'ai-insights', label: 'AI Insights' }
  ];

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-800">
              Competitor Intelligence Dashboard
            </h1>
          </div>
          
          <div className="flex space-x-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 border-b-2 ${
                  currentPage === item.id
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700 border-transparent hover:border-gray-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// AI Insights Page Component
const AIInsightsPage = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('');

  // Configure API URL
  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  const testConnection = async () => {
    try {
      const response = await fetch(`${API_URL}/`);
      const data = await response.json();
      console.log('API Connection:', data);
      return response.ok;
    } catch (err) {
      console.error('API Connection failed:', err);
      return false;
    }
  };

  const loadTestInsights = async () => {
    setLoading(true);
    setError(null);
    setStatus('');
    try {
      const response = await fetch(`${API_URL}/test-insights`);
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        setInsights([]);
      } else {
        setInsights(data.insights || []);
        setStatus('Test insights loaded successfully!');
      }
    } catch (err) {
      console.error('Error loading test insights:', err);
      setError("Failed to load test insights. Please check if the backend is running on port 8000.");
      setInsights([]);
    }
    setLoading(false);
  };

  const generateInsights = async () => {
    setLoading(true);
    setError(null);
    setStatus('Generating insights...');

    try {
      const response = await fetch(`${API_URL}/insight_gen`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setInsights([]);
        setStatus('');
      } else {
        setInsights(data.insights || []);
        setStatus('Insights generated successfully!');
      }
    } catch (err) {
      console.error('Error generating insights:', err);
      setError("Failed to generate insights. Please check your connection and try again.");
      setInsights([]);
      setStatus('');
    }
    setLoading(false);
  };

  useEffect(() => {
    testConnection();
  }, []);

  // Update chartData to differentiate positive and negative insights
  const chartData = insights.map((insight, idx) => ({
    name: `Insight ${idx + 1}`,
    value: Math.min(insight.length, 100),
    score: Math.floor(Math.random() * 100) + 1,
    type: insight.startsWith('Positive') ? 'Positive' : 'Negative',
  }));

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-semibold bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent mb-3">
          🚀 AI-Powered Marketing Insights
        </h1>
        <p className="text-gray-600 text-base">Generate insights from pre-loaded competitor and campaign data</p>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
        <h2 className="text-xl font-medium mb-4 text-center text-gray-800">📊 Generate Insights</h2>
        <div className="flex justify-center space-x-4">
          <Button 
            onClick={generateInsights}
            disabled={loading}
            className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-6 py-2 rounded-md disabled:bg-gray-200"
          >
            {loading ? "🔄 Generating..." : "🎯 Generate AI Insights"}
          </Button>
          
          <Button 
            onClick={loadTestInsights}
            disabled={loading}
            className="bg-green-100 hover:bg-green-200 text-green-800 px-6 py-2 rounded-md"
          >
            {loading ? "🔄 Loading..." : "🧪 Try Test Insights"}
          </Button>
        </div>

        {status && (
          <div className="mt-3 p-2 bg-green-50 border border-green-100 text-green-700 rounded-md text-center text-sm">
            {status}
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-2 rounded-md text-center text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center text-base py-6">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-300 mb-2"></div>
          <p>🤖 AI is analyzing your data...</p>
        </div>
      )}

      {/* Insights Display */}
      {insights.length > 0 && !loading && (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.map((insight, idx) => {
              const isPositive = insight.startsWith('Positive');
              return (
                <div
                  key={idx}
                  className="transform hover:scale-102 transition-transform duration-200"
                >
                  <Card className={`h-full shadow-sm rounded-lg border ${isPositive ? 'border-green-100' : 'border-red-100'} hover:shadow-md bg-gradient-to-br from-gray-50 to-white`}>
                    <CardContent className="p-4">
                      <div className="flex items-center mb-2">
                        <div className={`rounded-full w-6 h-6 flex items-center justify-center font-bold mr-2 ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                          {idx + 1}
                        </div>
                        <h3 className="font-medium text-base text-gray-800">
                          {isPositive ? 'Positive Insight' : 'Negative Insight'}
                        </h3>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{insight}</p>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>

          {/* Charts Section */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="shadow-sm rounded-lg p-5 bg-white">
              <h3 className="text-lg font-medium mb-3 text-center text-gray-800">
                📈 Insights Overview
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#60A5FA" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="shadow-sm rounded-lg p-5 bg-white">
              <h3 className="text-lg font-medium mb-3 text-center text-gray-800">
                🎯 Performance Radar
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={chartData}>
                  <PolarGrid stroke="#E5E7EB" />
                  <PolarAngleAxis dataKey="name" stroke="#6B7280" />
                  <PolarRadiusAxis stroke="#6B7280" />
                  <Radar
                    name="Insights"
                    dataKey="score"
                    stroke="#8B5CF6"
                    fill="#8B5CF6"
                    fillOpacity={0.2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <div className="text-center">
            <Button 
              onClick={() => {
                setInsights([]);
                setStatus('');
                setError(null);
              }}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-md"
            >
              🔄 Reset Insights
            </Button>
          </div>
        </>
      )}

      {/* Empty State */}
      {insights.length === 0 && !loading && !error && (
        <div className="text-center py-10 bg-gradient-to-br from-gray-50 to-white rounded-lg">
          <div className="text-5xl mb-3">📊</div>
          <h2 className="text-xl font-medium text-gray-800 mb-2">Ready to Generate Insights</h2>
          <p className="text-gray-600 text-base mb-4">Click 'Generate AI Insights' or 'Try Test Insights' to analyze pre-loaded data</p>
        </div>
      )}
    </div>
  );
};

// Other Page Components
const LandingPage = () => (
  <div className="min-h-screen bg-gray-50 p-6">
    <div className="max-w-7xl mx-auto">
      <div className="bg-white border-b border-gray-100 py-6 mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Landing Page</h1>
        <p className="text-gray-600 mt-2 text-base">Welcome to the Competitor Intelligence Dashboard</p>
      </div>
      <Card className="shadow-sm border border-gray-100">
        <CardContent className="p-6 text-center">
          <h2 className="text-lg font-medium text-gray-800 mb-3">Coming Soon</h2>
          <p className="text-gray-600 text-base">This page is under development.</p>
        </CardContent>
      </Card>
    </div>
  </div>
);

const CampaignHubPage = () => (
  <div className="min-h-screen bg-gray-50 p-6">
    <div className="max-w-7xl mx-auto">
      <div className="bg-white border-b border-gray-100 py-6 mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Campaign Hub</h1>
        <p className="text-gray-600 mt-2 text-base">Manage and analyze your marketing campaigns</p>
      </div>
      <Card className="shadow-sm border border-gray-100">
        <CardContent className="p-6 text-center">
          <h2 className="text-lg font-medium text-gray-800 mb-3">Coming Soon</h2>
          <p className="text-gray-600 text-base">Campaign management features are being developed.</p>
        </CardContent>
      </Card>
    </div>
  </div>
);

const CompanyDashboardPage = () => (
  <div className="min-h-screen bg-gray-50 p-6">
    <div className="max-w-7xl mx-auto">
      <div className="bg-white border-b border-gray-100 py-6 mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Company Dashboard</h1>
        <p className="text-gray-600 mt-2 text-base">Overview of your company's performance metrics</p>
      </div>
      <Card className="shadow-sm border border-gray-100">
        <CardContent className="p-6 text-center">
          <h2 className="text-lg font-medium text-gray-800 mb-3">Coming Soon</h2>
          <p className="text-gray-600 text-base">Company dashboard features are being developed.</p>
        </CardContent>
      </Card>
    </div>
  </div>
);

const CompetitorIntelPage = () => (
  <div className="min-h-screen bg-gray-50 p-6">
    <div className="max-w-7xl mx-auto">
      <div className="bg-white border-b border-gray-100 py-6 mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Competitor Intelligence</h1>
        <p className="text-gray-600 mt-2 text-base">Analyze competitor strategies and performance</p>
      </div>
      <Card className="shadow-sm border border-gray-100">
        <CardContent className="p-6 text-center">
          <h2 className="text-lg font-medium text-gray-800 mb-3">Coming Soon</h2>
          <p className="text-gray-600 text-base">Competitor intelligence features are being developed.</p>
        </CardContent>
      </Card>
    </div>
  </div>
);

// Main App Component
function App() {
  const [currentPage, setCurrentPage] = useState('ai-insights');

  const handlePageChange = (pageId) => {
    setCurrentPage(pageId);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage />;
      case 'campaign-hub':
        return <CampaignHubPage />;
      case 'company-dashboard':
        return <CompanyDashboardPage />;
      case 'competitor-intel':
        return <CompetitorIntelPage />;
      case 'ai-insights':
        return <AIInsightsPage />;
      default:
        return <AIInsightsPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage={currentPage} onPageChange={handlePageChange} />
      <main className="min-h-screen">
        {renderCurrentPage()}
      </main>
    </div>
  );
}

export default App;