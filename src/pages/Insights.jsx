import Layout from "../components/Layout";
import { Card, Stat } from "../components/UI";
import { successRadar, qualityVsReading } from "../data/mock";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ScatterChart, Scatter, ZAxis
} from "recharts";
import { useEffect, useRef } from "react";
import gsap from "gsap";


export default function Insights() {
  // Refs for animated sections
  const statsRef = useRef();
  const chartsRef = useRef();
  const recsRef = useRef();
  const matrixRef = useRef();
  const whatIfRef = useRef();

  useEffect(() => {
    gsap.fromTo(statsRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
    gsap.fromTo(chartsRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power3.out" });
    gsap.fromTo(recsRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.4, ease: "power3.out" });
    gsap.fromTo(matrixRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.6, ease: "power3.out" });
    gsap.fromTo(whatIfRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.8, ease: "power3.out" });
  }, []);

  return (
    <Layout title="AI Strategic Insights & Recommendations">
      {/* Strategic Overview */}
      <div ref={statsRef} className="grid md:grid-cols-4 gap-4">
        <Stat label="Your Unique Positioning Score" value="78/100" sub="Differentiation rating"/>
        <Stat label="Market Gap Opportunities" value="5" sub="Underutilized angles"/>
        <Stat label="Moat Strength" value="Strong" sub="Data + Models + Brand"/>
        <Stat label="Threat Assessment" value="Medium" sub="3 active risks"/>
      </div>

      {/* Charts */}
      <div ref={chartsRef} className="grid lg:grid-cols-3 gap-4 mt-6">
        <Card className="lg:col-span-2">
          <div className="text-sm text-gray-500 mb-2">Success Probability (Strategy Mix)</div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={successRadar}>
                <PolarGrid />
                <PolarAngleAxis dataKey="factor" />
                <PolarRadiusAxis />
                <Radar dataKey="score" name="Success %" strokeWidth={2} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="text-sm text-gray-500 mb-2">Reading Level vs Quality Score</div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={qualityVsReading}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="level" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="quality" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recommendations */}
      <div ref={recsRef} className="grid md:grid-cols-2 gap-4 mt-6">
        <Card>
          <div className="font-semibold mb-2">Content Strategy Optimization</div>
          <ul className="list-disc pl-5 text-sm space-y-1 text-gray-700">
            <li>Increase CTA strength — ~70% competitors use weak CTAs → +40% performance opportunity.</li>
            <li>Add urgency elements — current market “Low” urgency; try “Limited Time” → +25% CTR.</li>
            <li>Leverage social proof — “10,000+ students”, “Industry-recognized”.</li>
            <li>Consider aspiration triggers over authority (market saturation).</li>
          </ul>
        </Card>
        <Card>
          <div className="font-semibold mb-2">Performance-Based Campaign Strategy</div>
          <ul className="list-disc pl-5 text-sm space-y-1 text-gray-700">
            <li>Target Quality Score &gt; 4.6 (above competitor average).</li>
            <li>Emphasize certification messaging — correlates with higher quality.</li>
            <li>Optimize for Medium+ reading level.</li>
            <li>LinkedIn: Avg CTR 0.4% — target 0.6%+ with stronger CTAs.</li>
          </ul>
        </Card>
      </div>

      {/* Priority Matrix (simple grid) */}
      <Card ref={matrixRef} className="mt-6">
        <div className="font-semibold mb-3">Implementation Priority Matrix</div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-semibold">High Impact, Low Effort</div>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Strengthen CTA language</li>
              <li>Add urgency phrases</li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold">High Impact, Medium Effort</div>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Job guarantee messaging</li>
              <li>Social proof modules</li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold">High Impact, High Effort</div>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Mentor-focused campaign</li>
              <li>Placement tracking loop</li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold">Medium Impact, Low Effort</div>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Tune reading level</li>
              <li>Optimize keyword density</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* What-if/Scenario placeholder */}
      <div ref={whatIfRef} className="grid md:grid-cols-3 gap-4 mt-6">
        <Card>
          <div className="text-sm text-gray-500 mb-1">Budget Reallocation</div>
          <div className="text-xl font-bold">+12% ROI</div>
          <div className="text-xs text-gray-500">Shift 10% to Google</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-500 mb-1">Creative Approach</div>
          <div className="text-xl font-bold">+8% CTR</div>
          <div className="text-xs text-gray-500">Casual tone + Strong CTA</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-500 mb-1">Targeting Expansion</div>
          <div className="text-xl font-bold">-6% CPA</div>
          <div className="text-xs text-gray-500">New geo segments</div>
        </Card>
      </div>
    </Layout>
  );
}
