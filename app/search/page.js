"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SiteHeader from "../../components/SiteHeader";
 
export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
 
  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (!trimmed) return;
    router.push(`/search/results?q=${encodeURIComponent(trimmed)}`);
  };
 
  return (
    <main className="min-h-screen bg-white text-black font-sans pb-20">
      <SiteHeader />
 
      <div className="max-w-7xl mx-auto px-10 pt-5">
        {/* Breadcrumb */}
        <div className="mb-10">
          <p className="text-[10px] uppercase tracking-widest font-bold">
            <span className="text-gray-300">ARCHIVE / </span>
            <span className="text-[#9E1817]">SEARCH</span>
          </p>
          <h1 className="text-4xl font-normal text-gray-800 mt-1">Search the Archive</h1>
        </div>
 
        {/* Tab Row (display only for now) */}
        <div className="flex gap-2 mb-8">
          {["Productions", "Contributors", "Characters"].map((tab) => (
            <button
              key={tab}
              className={`px-6 py-2 text-[11px] font-bold tracking-[0.15em] uppercase rounded-sm border transition-all ${
                tab === "Productions"
                  ? "bg-[#9E1817] text-white border-[#9E1817]"
                  : "bg-white text-gray-400 border-gray-200 cursor-default"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
 
        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex border border-gray-300 rounded-sm overflow-hidden h-14 shadow-sm bg-white max-w-3xl">
          <div className="flex items-center px-5 text-gray-300 border-r border-gray-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            className="flex-1 px-5 py-2 text-sm outline-none placeholder:text-gray-400 italic bg-transparent"
            placeholder="Search productions by title, composer, or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="px-4 text-gray-400 hover:text-black text-xl font-light border-r border-gray-200"
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
 
        <p className="text-xs text-gray-400 mt-4 max-w-3xl">
          Currently searching <span className="font-bold text-gray-600">Productions</span>. 
          Contributor and Character search coming soon.
        </p>
      </div>
    </main>
  );
}
 