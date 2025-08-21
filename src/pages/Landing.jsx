import Layout from "../components/Layout";
import { Card } from "../components/UI";
import { Rocket, Target, Brain, Lightbulb } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const features = [
  { icon: Target, title: "Multi-Platform Monitoring", desc: "Track ads across Meta, Google, LinkedIn" },
  { icon: Brain, title: "AI Campaign Creation", desc: "Generate ad copies, targeting, budget allocation" },
  { icon: Rocket, title: "Smart Analytics", desc: "NLP + Computer Vision competitor analysis" },
  { icon: Lightbulb, title: "Predictive Insights", desc: "AI recommendations before you launch" },
];

export default function Landing() {
  const heroRef = useRef();
  const featuresRef = useRef();
  const howItWorksRef = useRef();

  useEffect(() => {
    gsap.fromTo(heroRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
    gsap.fromTo(featuresRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.3, ease: "power3.out" });
    gsap.fromTo(howItWorksRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.5, ease: "power3.out" });
  }, []);

  return (
    <Layout title="What We Do">
      {/* Hero */}
      <section ref={heroRef} className="text-center py-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          AI-Powered Competitive Marketing Intelligence
        </h1>
        <p className="text-lg text-gray-600 mt-4">
          Monitor competitor ads, create winning campaigns, maximize ROI
        </p>
        <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700">
          Start Free Trial
        </button>
      </section>

      {/* Features */}
      <section ref={featuresRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {features.map(({icon:Icon, title, desc}) => (
          <Card key={title} className="hover:shadow-md transition">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-blue-50"><Icon size={22}/></div>
              <div>
                <div className="font-semibold">{title}</div>
                <div className="text-sm text-gray-600 mt-1">{desc}</div>
              </div>
            </div>
          </Card>
        ))}
      </section>

      {/* How It Works */}
      <section ref={howItWorksRef} className="mt-14">
        <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { step: "Connect", desc: "Link accounts + select competitors" },
            { step: "Analyze", desc: "AI processes competitor data" },
            { step: "Optimize", desc: "Get actionable insights + generated campaigns" },
          ].map(s => (
            <Card key={s.step} className="text-center bg-blue-50/40">
              <div className="text-xl font-bold text-blue-700">{s.step}</div>
              <p className="text-gray-600 mt-2">{s.desc}</p>
            </Card>
          ))}
        </div>
      </section>
    </Layout>
  );
}
