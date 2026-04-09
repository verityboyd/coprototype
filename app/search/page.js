"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../utils/firebase";
import SiteHeader from "../components/SiteHeader";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Productions");
  const [upcomingProductions, setUpcomingProductions] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUpcoming = async () => {
      setLoading(true);
      try {
        const snap = await getDocs(
          query(collection(db, "productions"), orderBy("year", "desc"), limit(6))
        );
        setUpcomingProductions(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching upcoming productions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUpcoming();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (!trimmed) return;
    router.push(`/search/results?q=${encodeURIComponent(trimmed)}`);
  };

  const milestones = [
    { name: "Contributor Name", badge: "50th Performance", color: "bg-[#9E1817] text-white" },
    { name: "Production Name", badge: "25th Production", color: "bg-[#3D3D3D] text-white" },
    { name: "Contributor Name", badge: "10 Year Anniversary", color: "bg-[#D1CCC5] text-[#3D3D3D]" },
  ];

  return (
    <main className="min-h-screen bg-white text-black font-sans pb-24">
      <SiteHeader />

      {/* ── Hero Section ── */}
      <div className="bg-[#F9F8F6] border-b border-gray-200 py-16 px-10">
        <div className="max-w-7xl mx-auto flex flex-col items-center">

          {/* Eyebrow */}
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#9E1817] mb-4">
            Calgary Opera Archive
          </p>

          {/* Heading */}
          <h1 className="text-5xl font-light text-gray-900 tracking-tight text-center mb-2">
            Explore the Archive
          </h1>
          <p className="text-sm text-gray-400 mb-10 tracking-wide">
            Search productions, contributors, and characters spanning decades of performance.
          </p>

          {/* Tab Selector */}
          <div className="flex gap-0 mb-6 border border-gray-200 rounded-sm overflow-hidden shadow-sm">
            {["Productions", "Contributors", "Characters"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-2.5 text-[11px] font-bold tracking-[0.15em] uppercase transition-all ${
                  activeTab === tab
                    ? "bg-[#9E1817] text-white"
                    : "bg-white text-gray-400 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="flex w-full max-w-2xl border border-gray-300 rounded-sm overflow-hidden h-13 shadow-md bg-white"
            style={{ height: "52px" }}
          >
            <div className="flex items-center px-5 text-gray-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              className="flex-1 px-2 py-2 text-sm outline-none placeholder:text-gray-400 bg-transparent text-gray-800"
              placeholder={`Search ${activeTab.toLowerCase()} by title, name, or keyword...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="px-4 text-gray-300 hover:text-gray-600 text-xl font-light"
              >
                ×
              </button>
            )}
            <button
              type="submit"
              className="bg-[#9E1817] text-white px-12 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#821413] transition-colors"
            >
              Search
            </button>
          </form>

        </div>
      </div>

      {/* ── Content Section ── */}
      <div className="max-w-7xl mx-auto px-10 pt-12">

        {/* Section label */}
        <div className="flex items-center gap-4 mb-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400">
            Archive Overview
          </p>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        <div className="flex gap-8 items-start">

          {/* ── Upcoming Productions Table ── */}
          <div className="flex-1 border border-gray-200 rounded-sm overflow-hidden shadow-sm">
            {/* Table Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-800">
                  Upcoming Productions
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">Most recent entries in the archive</p>
              </div>
              <button className="text-[10px] font-bold uppercase tracking-widest text-gray-400 border border-gray-200 px-4 py-1.5 rounded-sm">
                View All
              </button>
            </div>

            <table className="w-full text-left border-separate border-spacing-0">
              <thead>
                <tr className="bg-[#F9F8F6] text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  <th className="px-6 py-3 border-b border-gray-200">Title</th>
                  <th className="px-6 py-3 border-b border-gray-200">Year</th>
                  <th className="px-6 py-3 border-b border-gray-200">Venue</th>
                  <th className="px-6 py-3 border-b border-gray-200">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse border-t border-gray-100">
                      <td className="px-6 py-4"><div className="h-3 bg-gray-100 rounded w-3/4" /></td>
                      <td className="px-6 py-4"><div className="h-3 bg-gray-100 rounded w-1/2" /></td>
                      <td className="px-6 py-4"><div className="h-3 bg-gray-100 rounded w-1/2" /></td>
                      <td className="px-6 py-4"><div className="h-3 bg-gray-100 rounded w-1/3" /></td>
                    </tr>
                  ))
                ) : upcomingProductions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-xs text-gray-400 italic">
                      No productions found.
                    </td>
                  </tr>
                ) : (
                  upcomingProductions.map((prod, i) => (
                    <tr
                      key={prod.id}
                      className={`hover:bg-[#FDFCFB] transition-colors text-[13px] ${
                        i !== 0 ? "border-t border-gray-100" : ""
                      }`}
                    >
                      <td className="px-6 py-4 font-semibold text-gray-800">{prod.title}</td>
                      <td className="px-6 py-4 text-gray-500">{prod.year}</td>
                      <td className="px-6 py-4 text-gray-500">{prod.venue ?? "—"}</td>
                      <td className="px-6 py-4 text-gray-500">{prod.status ?? "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── Milestones Panel ── */}
          <div className="w-72 border border-gray-200 rounded-sm shadow-sm overflow-hidden">
            {/* Panel Header */}
            <div className="px-6 py-4 bg-white border-b border-gray-200">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-800">
                Upcoming Milestones
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">Notable anniversaries & achievements</p>
            </div>

            {/* Milestone Items */}
            <div className="bg-white divide-y divide-gray-100">
              {milestones.map((m, i) => (
                <div key={i} className="px-6 py-4 flex items-center justify-between gap-3">
                  <span className="text-[13px] text-gray-700 font-medium">{m.name}</span>
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-sm whitespace-nowrap ${m.color}`}>
                    {m.badge}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-[#F9F8F6] border-t border-gray-200">
              <button className="w-full bg-[#1a1a1a] text-white text-[10px] font-bold uppercase tracking-[0.2em] py-3 rounded-sm hover:bg-black transition-colors">
                Full Report
              </button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}