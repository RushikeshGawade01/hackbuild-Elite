import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { Menu, Home, Compass, BarChart3, Sparkles } from "lucide-react";
import gsap from "gsap";

const navItem =
  "flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition";

export default function Layout({ title = "AI Marketing", children }) {
  const [open, setOpen] = useState(false);
  const sidebarRef = useRef();
  const headerRef = useRef();
  const mainRef = useRef();

  useEffect(() => {
    gsap.fromTo(sidebarRef.current, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" });
    gsap.fromTo(headerRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.1, ease: "power3.out" });
    gsap.fromTo(mainRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.2, ease: "power3.out" });
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside ref={sidebarRef} className={`z-20 fixed md:static inset-y-0 left-0 w-72 bg-white shadow-lg p-4 ${open ? "block" : "hidden"} md:block`}>
        <div className="flex items-center justify-between mb-6">
          <div className="text-xl font-extrabold tracking-tight">AI Marketing</div>
          <button className="md:hidden" onClick={() => setOpen(false)}>✕</button>
        </div>
        <nav className="space-y-1">
          <NavLink to="/" className={({isActive}) => `${navItem} ${isActive ? "bg-gray-100 font-semibold" : ""}`}>
            <Home size={18}/> <span>Landing</span>
          </NavLink>
          <NavLink to="/campaigns" className={({isActive}) => `${navItem} ${isActive ? "bg-gray-100 font-semibold" : ""}`}>
            <Compass size={18}/> <span>Campaign Hub</span>
          </NavLink>
          <NavLink to="/dashboard" className={({isActive}) => `${navItem} ${isActive ? "bg-gray-100 font-semibold" : ""}`}>
            <BarChart3 size={18}/> <span>Company Dashboard</span>
          </NavLink>
          <NavLink to="/competitors" className={({isActive}) => `${navItem} ${isActive ? "bg-gray-100 font-semibold" : ""}`}>
            <Compass size={18}/> <span>Competitor Intel</span>
          </NavLink>
          <NavLink to="/insights" className={({isActive}) => `${navItem} ${isActive ? "bg-gray-100 font-semibold" : ""}`}>
            <Sparkles size={18}/> <span>AI Insights</span>
          </NavLink>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 md:ml-0 ml-0">
        <header ref={headerRef} className="sticky top-0 z-10 bg-gray-50/70 backdrop-blur border-b">
          <div className="px-6 py-4 flex items-center justify-between">
            <button className="md:hidden" onClick={() => setOpen(true)}>
              <Menu size={24}/>
            </button>
            <h2 className="text-lg font-semibold">{title}</h2>
            <div className="w-9 h-9 rounded-full bg-gray-300" />
          </div>
        </header>
        <main ref={mainRef} className="p-6">{children}</main>
      </div>
    </div>
  );
}
