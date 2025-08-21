import Layout from "../components/Layout";
import { Card, Pill } from "../components/UI";
import { competitorList, competitorAds } from "../data/mock";
import { useState, Fragment, useEffect, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import gsap from "gsap";

function AdCard({ ad, onOpen }) {
  return (
    <Card className="hover:shadow-md transition cursor-pointer" onClick={() => onOpen(ad)}>
      <div className="text-xs text-gray-500">{ad.platform} • {ad.type}</div>
      <div className="font-semibold mt-1">{ad.title}</div>
      <div className="text-sm text-gray-600 line-clamp-2">{ad.desc}</div>
      <div className="text-xs text-gray-500 mt-2">Last analyzed: {ad.timestamp}</div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Pill>Pred CTR: {ad.metrics.ctr}%</Pill>
        <Pill>Quality: {ad.metrics.quality}/10</Pill>
        <Pill>Engagement: {ad.metrics.engagement}/10</Pill>
        <Pill>CTA: {ad.metrics.cta}</Pill>
      </div>
    </Card>
  );
}

export default function Competitors() {
  const [platform, setPlatform] = useState("All");
  const [modal, setModal] = useState(null);

  // Animation refs
  const leftPanelRef = useRef();
  const filtersRef = useRef();
  const adsGridRef = useRef();

  useEffect(() => {
    gsap.fromTo(leftPanelRef.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" });
    gsap.fromTo(filtersRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: "power3.out" });
    gsap.fromTo(adsGridRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.4, ease: "power3.out" });
  }, []);

  const list = competitorAds.filter(a => platform === "All" || a.platform === platform);

  return (
    <Layout title="Competitor Intelligence">
      <div className="grid md:grid-cols-[260px_1fr] gap-5">
        {/* Left panel */}
        <Card ref={leftPanelRef}>
          <div className="font-semibold mb-3">Tracked Competitors</div>
          <div className="space-y-2">
            {competitorList.map(c => (
              <div key={c.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gray-200 grid place-items-center">{c.logo}</div>
                  <div className="text-sm">{c.name}</div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${c.tracked ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-600"}`}>
                  {c.tracked ? "Tracking" : "Idle"}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <div className="text-xs text-gray-500 mb-1">Industry Benchmarks</div>
            <div className="text-sm">CTR 0.4% • Quality 4.6 • CPC $28.36</div>
          </div>

          <div className="mt-5">
            <input className="w-full border rounded-xl px-3 py-2" placeholder="Add competitor (search)"/>
            <button className="mt-2 w-full px-3 py-2 rounded-xl bg-blue-600 text-white">Add</button>
          </div>
        </Card>

        {/* Main */}
        <div>
          {/* Filters */}
          <div ref={filtersRef} className="flex flex-wrap gap-3 mb-4">
            <select className="border rounded-xl px-3 py-2 bg-white" value={platform} onChange={(e)=>setPlatform(e.target.value)}>
              <option>All</option><option>LinkedIn</option><option>Meta</option><option>Google</option>
            </select>
            <select className="border rounded-xl px-3 py-2 bg-white">
              <option>Sort: Quality Score</option>
              <option>Sort: Engagement</option>
              <option>Sort: CTA Strength</option>
            </select>
            <select className="border rounded-xl px-3 py-2 bg-white">
              <option>Last 30 days</option><option>Last 7 days</option><option>Last 90 days</option>
            </select>
            <select className="border rounded-xl px-3 py-2 bg-white">
              <option>All performers</option><option>High</option><option>Medium</option><option>Low</option>
            </select>
          </div>

          {/* Live Ad Monitoring Grid */}
          <div ref={adsGridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {list.map(ad => <AdCard key={ad.id} ad={ad} onOpen={setModal} />)}
          </div>
        </div>
      </div>

      {/* Modal */}
      <Transition show={!!modal} as={Fragment}>
        <Dialog onClose={()=>setModal(null)} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
            leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          <div className="fixed inset-0 grid place-items-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
              leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-5">
                {modal && (
                  <>
                    <Dialog.Title className="text-lg font-bold">{modal.title}</Dialog.Title>
                    <div className="text-sm text-gray-600">{modal.desc}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {modal.platform} • {modal.type} • Last analyzed {modal.timestamp}
                    </div>

                    {/* NLP Results */}
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <Card>
                        <div className="text-sm font-semibold mb-2">NLP Analysis</div>
                        <div className="text-sm">Sentiment: {modal.analysis.sentiment} (Conf {modal.analysis.confidence})</div>
                        <div className="text-sm">Tone: {modal.analysis.tone}</div>
                        <div className="text-sm">Reading Level: {modal.analysis.readingLevel}</div>
                        <div className="text-sm">Word/Char: {modal.analysis.words}/{modal.analysis.chars}</div>
                      </Card>
                      <Card>
                        <div className="text-sm font-semibold mb-2">Marketing Effectiveness</div>
                        <div className="text-sm">Engagement: {modal.metrics.engagement}</div>
                        <div className="text-sm">Urgency: {modal.analysis.urgency}</div>
                        <div className="text-sm">Triggers: [{modal.analysis.triggers.join(", ")}]</div>
                        <div className="text-sm">Persuasion Elements: {modal.analysis.persuasion}</div>
                      </Card>
                    </div>

                    {/* Predictions */}
                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                      <Card><div className="text-xs text-gray-500">Estimated Daily Impressions</div><div className="text-xl font-bold">{modal.analysis.dailyImpressions.toLocaleString()}</div></Card>
                      <Card><div className="text-xs text-gray-500">Predicted CPC</div><div className="text-xl font-bold">${modal.analysis.cpc}</div></Card>
                      <Card><div className="text-xs text-gray-500">Quality Score</div><div className="text-xl font-bold">{modal.metrics.quality}</div></Card>
                    </div>

                    <div className="mt-5 flex justify-end gap-2">
                      <button className="px-4 py-2 rounded-xl bg-gray-100" onClick={()=>setModal(null)}>Close</button>
                      <button className="px-4 py-2 rounded-xl bg-blue-600 text-white">Export Report</button>
                    </div>
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </Layout>
  );
}
