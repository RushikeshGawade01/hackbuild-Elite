import Layout from "../components/Layout";
import { Card, Stat, Pill } from "../components/UI";
import { campaigns, monthlySpend } from "../data/mock";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Play, PlusCircle, Import, Wand2 } from "lucide-react";
import { useMemo, useState, useEffect, useRef } from "react";
import gsap from "gsap";

const statusColor = (s) =>
  s === "Running" ? "text-green-600 bg-green-50" : s === "Paused" ? "text-yellow-600 bg-yellow-50" : "text-gray-600 bg-gray-50";

export default function CampaignHub() {
  const [filters, setFilters] = useState({ platform: "All", perf: "All" });

  // Animation refs
  const actionsRef = useRef();
  const formRef = useRef();
  const statsRef = useRef();
  const filtersRef = useRef();
  const tableRef = useRef();

  useEffect(() => {
    gsap.fromTo(actionsRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" });
    gsap.fromTo(formRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.1, ease: "power3.out" });
    gsap.fromTo(statsRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: "power3.out" });
    gsap.fromTo(filtersRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.3, ease: "power3.out" });
    gsap.fromTo(tableRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.4, ease: "power3.out" });
  }, []);

  const filtered = useMemo(() => {
    return campaigns.filter(c => (filters.platform === "All" || c.platform === filters.platform));
  }, [filters]);

  const avgRoi = Math.round(filtered.reduce((a, c) => a + c.roi, 0) / (filtered.length || 1));

  return (
    <Layout title="Campaign Hub">
      {/* Quick Actions */}
      <div ref={actionsRef} className="grid md:grid-cols-3 gap-4">
        <button className="flex items-center gap-2 justify-center rounded-2xl border bg-white p-4 hover:bg-gray-50">
          <Wand2 size={18}/> Generate from competitor analysis
        </button>
        <button className="flex items-center gap-2 justify-center rounded-2xl border bg-white p-4 hover:bg-gray-50">
          <PlusCircle size={18}/> Create custom campaign
        </button>
        <button className="flex items-center gap-2 justify-center rounded-2xl border bg-white p-4 hover:bg-gray-50">
          <Import size={18}/> Import for optimization
        </button>
      </div>

      {/* Form */}
      <Card ref={formRef} className="mt-5">
        <div className="grid md:grid-cols-5 gap-4">
          <input className="border rounded-xl px-3 py-2" placeholder="Product name / category"/>
          <input className="border rounded-xl px-3 py-2" placeholder="Target audience"/>
          <input className="border rounded-xl px-3 py-2" placeholder="Budget range (e.g. 5k-20k)"/>
          <select className="border rounded-xl px-3 py-2">
            <option>Meta</option><option>Google</option><option>LinkedIn</option>
          </select>
          <select className="border rounded-xl px-3 py-2">
            <option>AI: Copy + Visuals + Targeting</option>
            <option>AI: Copy only</option>
            <option>AI: Targeting only</option>
          </select>
        </div>
        <div className="mt-4 flex justify-end">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl flex items-center gap-2">
            <Play size={16}/> Generate Campaign
          </button>
        </div>
      </Card>

      {/* Stats */}
      <div ref={statsRef} className="grid md:grid-cols-4 gap-4 mt-6">
        <Stat label="Total Campaigns" value={filtered.length} sub="+2 this month"/>
        <Stat label="Average ROI" value={`${avgRoi}%`} sub="↑ vs last month"/>
        <Stat label="Best Platform" value="Google" sub="ROI 148%, CPC $2.6"/>
        <Card>
          <div className="text-sm text-gray-500 mb-2">Monthly spend vs last month</div>
          <div className="h-28">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlySpend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month"/>
                <YAxis/>
                <Tooltip/>
                <Line type="monotone" dataKey="spend" strokeWidth={2}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div ref={filtersRef} className="flex items-center gap-3 mt-8">
        <select
          className="border rounded-xl px-3 py-2 bg-white"
          value={filters.platform}
          onChange={(e) => setFilters(f => ({...f, platform: e.target.value}))}
        >
          <option>All</option><option>Meta</option><option>Google</option><option>LinkedIn</option>
        </select>
        <select
          className="border rounded-xl px-3 py-2 bg-white"
          value={filters.perf}
          onChange={(e) => setFilters(f => ({...f, perf: e.target.value}))}
        >
          <option>All</option><option>High</option><option>Medium</option><option>Low</option>
        </select>
      </div>

      {/* Table */}
      <Card ref={tableRef} className="mt-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-gray-500">
            <tr>
              <th className="py-2">Name</th>
              <th>Platform</th>
              <th>Status</th>
              <th>Budget</th>
              <th>ROI%</th>
              <th>Success Score</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="[&>tr:not(:last-child)]:border-b">
            {filtered.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="py-2 font-medium">{row.name}</td>
                <td>{row.platform}</td>
                <td>
                  <span className={`px-2 py-1 rounded-full text-xs ${statusColor(row.status)}`}>
                    {row.status}
                  </span>
                </td>
                <td>${row.budget.toLocaleString()}</td>
                <td>{row.roi}%</td>
                <td>{row.score}/10</td>
                <td className="space-x-2">
                  <Pill>Pause</Pill>
                  <Pill>Optimize</Pill>
                  <Pill>View</Pill>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Layout>
  );
}
