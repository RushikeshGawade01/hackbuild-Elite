import Layout from "../components/Layout";
import { Card, Stat } from "../components/UI";
import { platformRevenue, platformMetrics } from "../data/mock";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from "recharts";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Dashboard() {
  const totalRevenue = platformRevenue.reduce((a,b)=>a+b.value,0);
  const activeCampaigns = 12;
  const roi = 138;
  const cpa = 42;

  // Refs for animated sections
  const topCardsRef = useRef();
  const chartsRef = useRef();
  const campaignsRef = useRef();
  const metricsRef = useRef();

  useEffect(() => {
    gsap.fromTo(topCardsRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" });
    gsap.fromTo(chartsRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: "power3.out" });
    gsap.fromTo(campaignsRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.4, ease: "power3.out" });
    gsap.fromTo(metricsRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.6, ease: "power3.out" });
  }, []);

  return (
    <Layout title="Company Dashboard">
      {/* Top cards */}
      <div ref={topCardsRef} className="grid md:grid-cols-4 gap-4">
        <Stat label="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} sub="+12% MoM"/>
        <Stat label="Active Campaigns" value={activeCampaigns} sub="Across Meta/Google/LinkedIn"/>
        <Stat label="Overall ROI" value={`${roi}%`} sub="Trending up"/>
        <Stat label="CPA" value={`$${cpa}`} sub="Benchmark: $50"/>
      </div>

      {/* Platform performance */}
      <div ref={chartsRef} className="grid md:grid-cols-2 gap-4 mt-6">
        <Card>
          <div className="text-sm text-gray-500 mb-2">Revenue Distribution</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={platformRevenue} dataKey="value" nameKey="name" outerRadius={90} label>
                  {platformRevenue.map((_, i) => <Cell key={i} />)}
                </Pie>
                <Tooltip/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 text-sm text-gray-600">
            {platformRevenue.map(p => (
              <div key={p.name} className="flex justify-between">
                <span>{p.name}</span><span>${p.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="text-sm text-gray-500 mb-2">Platform Metrics</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name"/>
                <YAxis/>
                <Tooltip/>
                <Legend />
                <Bar dataKey="CTR" />
                <Bar dataKey="CPC" />
                <Bar dataKey="CVR" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Active campaigns grid */}
      <div ref={campaignsRef} className="mt-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({length:6}).map((_,i)=>(
            <Card key={i} className="overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-gray-100 to-gray-200"/>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold">Campaign #{i+1}</div>
                  <div className="text-xs text-gray-500">ROI {(120+i*3)}% • CTR {(1.1 + i*0.1).toFixed(1)}%</div>
                </div>
                <div className={`w-2.5 h-2.5 rounded-full ${i%3===0?"bg-green-500":i%3===1?"bg-yellow-500":"bg-red-500"}`} />
              </div>
              <div className="mt-3 flex gap-2">
                <button className="px-2 py-1 rounded-lg bg-gray-100 text-xs">Pause</button>
                <button className="px-2 py-1 rounded-lg bg-gray-100 text-xs">Optimize</button>
                <button className="px-2 py-1 rounded-lg bg-gray-100 text-xs">View</button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Real-time metrics */}
      <div ref={metricsRef} className="grid md:grid-cols-4 gap-4 mt-6">
        <Card><div className="text-xs text-gray-500">Live spend rate</div><div className="text-xl font-bold mt-1">$420/hr</div></Card>
        <Card><div className="text-xs text-gray-500">Impressions / hour</div><div className="text-xl font-bold mt-1">58,200</div></Card>
        <Card><div className="text-xs text-gray-500">Conversions</div><div className="text-xl font-bold mt-1">384</div></Card>
        <Card><div className="text-xs text-gray-500">Budget alerts</div><div className="text-xl font-bold mt-1 text-yellow-600">2 warnings</div></Card>
      </div>
    </Layout>
  );
}
