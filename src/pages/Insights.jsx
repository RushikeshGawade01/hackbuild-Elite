// src/App.jsx - Complete App with Navigation and All Pages
import React, { useState, useEffect } from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar
} from "recharts";

// UI Components
const Card = ({ children, className = "", ...props }) => {
  return (
    <div 
      className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}
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
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-gray-400",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 disabled:bg-gray-400",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 disabled:bg-gray-400",
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
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">
              Competitor Intelligence Dashboard
            </h1>
          </div>
          
          <div className="flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 border-b-2 ${
                  currentPage === item.id
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700 border-transparent hover:border-gray-300'
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
  const [files, setFiles] = useState({ competitors: null, campaigns: null });
  const [uploadStatus, setUploadStatus] = useState('');

  // Configure API URL - Vite uses import.meta.env instead of process.env
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
    try {
      const response = await fetch(`${API_URL}/test-insights`);
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        setInsights([]);
      } else {
        setInsights(data.insights || []);
        setUploadStatus('Test insights loaded successfully!');
      }
    } catch (err) {
      console.error('Error loading test insights:', err);
      setError("Failed to load test insights. Please check if the backend is running on port 8000.");
      setInsights([]);
    }
    setLoading(false);
  };

  const generateInsights = async () => {
    if (!files.competitors || !files.campaigns) {
      setError('Please upload both competitors and campaigns CSV files.');
      return;
    }

    setLoading(true);
    setError(null);
    setUploadStatus('Generating insights...');

    try {
      const formData = new FormData();
      formData.append('competitors', files.competitors);
      formData.append('campaigns', files.campaigns);

      const response = await fetch(`${API_URL}/insight_gen`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setInsights([]);
        setUploadStatus('');
      } else {
        setInsights(data.insights || []);
        setUploadStatus('Insights generated successfully!');
      }
    } catch (err) {
      console.error('Error generating insights:', err);
      setError("Failed to generate insights. Please check your connection and try again.");
      setInsights([]);
      setUploadStatus('');
    }
    setLoading(false);
  };

  const handleFileChange = (type, event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      setFiles(prev => ({ ...prev, [type]: file }));
      setError(null);
    } else {
      setError('Please select a valid CSV file.');
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  const chartData = insights.map((insight, idx) => ({
    name: `Insight ${idx + 1}`,
    value: Math.min(insight.length, 100),
    score: Math.floor(Math.random() * 100) + 1,
  }));

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          🚀 AI-Powered Marketing Insights
        </h1>
        <p className="text-gray-600 text-lg">Upload your data or try test insights to get started</p>
      </div>

      {/* File Upload Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-center">📊 Upload Your Data</h2>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Competitors Data (CSV)
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => handleFileChange('competitors', e)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {files.competitors && (
              <p className="text-sm text-green-600">✓ {files.competitors.name}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Campaigns Data (CSV)
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => handleFileChange('campaigns', e)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {files.campaigns && (
              <p className="text-sm text-green-600">✓ {files.campaigns.name}</p>
            )}
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <Button 
            onClick={generateInsights}
            disabled={loading || !files.competitors || !files.campaigns}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg disabled:bg-gray-400"
          >
            {loading ? "🔄 Generating..." : "🎯 Generate Insights"}
          </Button>
          
          <Button 
            onClick={loadTestInsights}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
          >
            {loading ? "🔄 Loading..." : "🧪 Try Test Insights"}
          </Button>
        </div>

        {uploadStatus && (
          <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center">
            {uploadStatus}
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
          ⚠️ {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center text-lg py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p>🤖 AI is analyzing your data...</p>
        </div>
      )}

      {/* Insights Display */}
      {insights.length > 0 && !loading && (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {insights.map((insight, idx) => (
              <div
                key={idx}
                className="transform hover:scale-105 transition-transform duration-200"
              >
                <Card className="h-full shadow-lg rounded-xl border border-gray-200 hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-gray-50">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-3">
                      <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
                        {idx + 1}
                      </div>
                      <h3 className="font-semibold text-lg text-gray-800">
                        Insight {idx + 1}
                      </h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{insight}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="shadow-lg rounded-xl p-6 bg-white">
              <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">
                📈 Insights Overview
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="shadow-lg rounded-xl p-6 bg-white">
              <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">
                🎯 Performance Radar
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={chartData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis />
                  <Radar
                    name="Insights"
                    dataKey="score"
                    stroke="#8B5CF6"
                    fill="#8B5CF6"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <div className="text-center">
            <Button 
              onClick={() => {
                setInsights([]);
                setFiles({ competitors: null, campaigns: null });
                setUploadStatus('');
                setError(null);
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg"
            >
              🔄 Reset & Upload New Data
            </Button>
          </div>
        </>
      )}

      {/* Empty State */}
      {insights.length === 0 && !loading && !error && (
        <div className="text-center py-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Ready to Generate Insights</h2>
          <p className="text-gray-600 mb-6">Upload your CSV files or try our test insights to get started</p>
        </div>
      )}
    </div>
  );
};

// Other Page Components
const LandingPage = () => (
  <div className="min-h-screen bg-gray-50 p-6">
    <div className="max-w-7xl mx-auto">
      <div className="bg-white border-b border-gray-200 py-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Landing Page</h1>
        <p className="text-gray-600 mt-2">Welcome to the Competitor Intelligence Dashboard</p>
      </div>
      <Card className="shadow-sm border border-gray-200">
        <CardContent className="p-8 text-center">
          <h2 className="text-xl font-medium text-gray-900 mb-4">Coming Soon</h2>
          <p className="text-gray-600">This page is under development.</p>
        </CardContent>
      </Card>
    </div>
  </div>
);

const CampaignHubPage = () => (
  <div className="min-h-screen bg-gray-50 p-6">
    <div className="max-w-7xl mx-auto">
      <div className="bg-white border-b border-gray-200 py-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Campaign Hub</h1>
        <p className="text-gray-600 mt-2">Manage and analyze your marketing campaigns</p>
      </div>
      <Card className="shadow-sm border border-gray-200">
        <CardContent className="p-8 text-center">
          <h2 className="text-xl font-medium text-gray-900 mb-4">Coming Soon</h2>
          <p className="text-gray-600">Campaign management features are being developed.</p>
        </CardContent>
      </Card>
    </div>
  </div>
);

const CompanyDashboardPage = () => (
  <div className="min-h-screen bg-gray-50 p-6">
    <div className="max-w-7xl mx-auto">
      <div className="bg-white border-b border-gray-200 py-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Company Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your company's performance metrics</p>
      </div>
      <Card className="shadow-sm border border-gray-200">
        <CardContent className="p-8 text-center">
          <h2 className="text-xl font-medium text-gray-900 mb-4">Coming Soon</h2>
          <p className="text-gray-600">Company dashboard features are being developed.</p>
        </CardContent>
      </Card>
    </div>
  </div>
);

const CompetitorIntelPage = () => (
  <div className="min-h-screen bg-gray-50 p-6">
    <div className="max-w-7xl mx-auto">
      <div className="bg-white border-b border-gray-200 py-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Competitor Intelligence</h1>
        <p className="text-gray-600 mt-2">Analyze competitor strategies and performance</p>
      </div>
      <Card className="shadow-sm border border-gray-200">
        <CardContent className="p-8 text-center">
          <h2 className="text-xl font-medium text-gray-900 mb-4">Coming Soon</h2>
          <p className="text-gray-600">Competitor intelligence features are being developed.</p>
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