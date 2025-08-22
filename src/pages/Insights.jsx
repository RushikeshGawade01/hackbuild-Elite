
// src/pages/Insights.jsx
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/Ui"; // Updated to match Ui.jsx
import { Button } from "@/components/Ui"; // Updated to match Ui.jsx
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";
import { motion } from "framer-motion";

// Configure API URL
const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/insight_gen";

export default function Insights() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setInsights([]);
        } else {
          setInsights(data.insights || []);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch insights. Please try again later.");
        setInsights([]);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center text-lg mt-10" role="status">Loading insights...</p>;
  if (error) return (
    <div className="text-center text-lg mt-10 text-red-600" role="alert">
      {error}
      <div className="mt-4"><Button onClick={() => window.location.reload()}>🔄 Try Again</Button></div>
    </div>
  );
  if (insights.length === 0) return (
    <div className="text-center text-lg mt-10" role="alert">
      No insights available. Please upload your data and try again.
      <div className="mt-4"><Button onClick={() => window.location.reload()}>🔄 Refresh</Button></div>
    </div>
  );

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center" role="heading" aria-level="1">📊 AI-Powered Insights</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {insights.map((insight, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: idx * 0.1 }}>
            <Card className="shadow-lg rounded-2xl border border-gray-200 hover:shadow-xl transition">
              <CardContent className="p-4">
                <h2 className="font-semibold text-lg mb-2" aria-label={`Insight ${idx + 1}`}>Insight {idx + 1}</h2>
                <p className="text-gray-700">{insight}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-md p-4">
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-4" aria-label="Radar Overview">Radar Overview</h2>
            <ResponsiveContainer width="100%" height="100%" aspect={4/3}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={insights.map((i, idx) => ({ name: `Insight ${idx + 1}`, value: i.length }))} aria-label="Radar chart showing insight metrics">
                <PolarGrid /><PolarAngleAxis dataKey="name" /><PolarRadiusAxis /><Radar name="Insights" dataKey="value" stroke="#4f46e5" fill="#6366f1" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="shadow-md p-4">
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-4" aria-label="Line Trend">Line Trend</h2>
            <ResponsiveContainer width="100%" height="100%" aspect={4/3}>
              <LineChart data={insights.map((i, idx) => ({ name: `Insight ${idx + 1}`, value: i.length }))}>
                <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <div className="text-center mt-6"><Button onClick={() => window.location.reload()}>🔄 Refresh Insights</Button></div>
    </div>
  );
}
