"use client";
import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../utils/firebase";
import SiteHeader from "../components/SiteHeader";

const TABS = ["Productions", "Contributors", "Characters"];

const FILTERS = {
  Productions: [
    { label: "Season", key: "season", placeholder: "e.g. 2001-2002" },
    { label: "Language", key: "language", placeholder: "e.g. Italian" },
    { label: "Composer", key: "composer", placeholder: "e.g. Puccini" },
  ],
  Contributors: [
    { label: "Role", key: "role", placeholder: "e.g. Soprano" },
    { label: "Nationality", key: "nationality", placeholder: "e.g. Canadian" },
  ],
  Characters: [
    { label: "Voice Type", key: "voiceType", placeholder: "e.g. Tenor" },
    { label: "Production", key: "production", placeholder: "e.g. Tosca" },
  ],
};

const COLUMNS = {
  Productions: ["Title", "Composer", "Librettist", "Language", "Year", "Season"],
  Contributors: ["Name", "Role", "Nationality", "Productions", "Debut Year"],
  Characters: ["Character Name", "Voice Type", "Production", "Composer", "Notes"],
};

export default function SearchPage() {
  const [activeTab, setActiveTab] = useState("Productions");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValues, setFilterValues] = useState({});
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [recentSearches, setRecentSearches] = useState([
    "Tosca", "Puccini", "2023-2024 Season", "Soprano"
  ]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFilterValues({});
    setResults([]);
    setHasSearched(false);
    setSearchTerm("");
  };

  const handleSearch = async () => {
    if (!searchTerm.trim() && Object.values(filterValues).every(v => !v)) return;
    setLoading(true);
    setHasSearched(true);

    try {
      const collectionMap = {
        Productions: "productions",
        Contributors: "contributors",
        Characters: "characters",
      };
      const snap = await getDocs(collection(db, collectionMap[activeTab]));
      const allDocs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const term = searchTerm.toLowerCase();
      const filtered = allDocs.filter(doc => {
        const values = Object.values(doc).join(" ").toLowerCase();
        const matchesTerm = !term || values.includes(term);
        const matchesFilters = Object.entries(filterValues).every(([key, val]) =>
          !val || (doc[key] && doc[key].toLowerCase().includes(val.toLowerCase()))
        );
        return matchesTerm && matchesFilters;
      });

      setResults(filtered);

      if (searchTerm.trim() && !recentSearches.includes(searchTerm.trim())) {
        setRecentSearches(prev => [searchTerm.trim(), ...prev].slice(0, 6));
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const clearAll = () => {
    setSearchTerm("");
    setFilterValues({});
    setResults([]);
    setHasSearched(false);
  };

  const columns = COLUMNS[activeTab];
  const filters = FILTERS[activeTab];

  return (
    <main className="min-h-screen bg-white text-black font-sans pb-20">
      <SiteHeader />

      {/* ── Hero Search Banner ── */}
      <div className="bg-[#F9F8F6] border-b border-gray-200 px-10 py-14">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <p className="text-[10px] uppercase tracking-widest font-bold mb-1">
            <span className="text-gray-300">ARCHIVE / </span>
            <span className="text-[#9E1817]">SEARCH</span>
          </p>
          <h1 className="text-4xl font-normal text-gray-800 mb-8">Search the Archive</h1>

          {/* Tab Selector */}
          <div className="flex gap-2 mb-6">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-6 py-2 text-[11px] font-bold tracking-[0.15em] uppercase rounded-sm border transition-all ${
                  activeTab === tab
                    ? "bg-[#9E1817] text-white border-[#9E1817]"
                    : "bg-white text-gray-500 border-gray-200 hover:border-[#9E1817] hover:text-[#9E1817]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Main Search Bar */}
          <div className="flex border border-gray-300 rounded-sm overflow-hidden h-14 shadow-sm bg-white mb-5">
            <div className="flex items-center px-5 text-gray-300 border-r border-gray-200">
              {/* Search Icon */}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              className="flex-1 px-5 py-2 text-sm outline-none placeholder:text-gray-400 italic bg-transparent"
              placeholder={`Search ${activeTab.toLowerCase()} by name, keyword, or year...`}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {(searchTerm || Object.values(filterValues).some(v => v)) && (
              <button
                onClick={clearAll}
                className="px-4 text-gray-400 hover:text-black text-lg font-light border-r border-gray-200"
              >
                ×
              </button>
            )}
            <button
              onClick={handleSearch}
              className="bg-[#9E1817] text-white px-12 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#821413] transition-colors"
            >
              Search
            </button>
          </div>

          {/* Inline Filters */}
          <div className="flex flex-wrap gap-3 items-end">
            {filters.map(f => (
              <div key={f.key} className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{f.label}</label>
                <input
                  className="border border-gray-200 rounded-sm px-4 py-2 text-xs outline-none focus:border-[#9E1817] bg-white w-44 placeholder:text-gray-300"
                  placeholder={f.placeholder}
                  value={filterValues[f.key] || ""}
                  onChange={e => setFilterValues(prev => ({ ...prev, [f.key]: e.target.value }))}
                  onKeyDown={handleKeyDown}
                />
              </div>
            ))}
            {filters.length > 0 && (
              <button
                onClick={clearAll}
                className="text-[10px] text-gray-400 hover:text-[#9E1817] font-bold uppercase tracking-widest pb-2 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-7xl mx-auto px-10 pt-10">

        {/* Pre-search state: Recent searches + tips */}
        {!hasSearched && (
          <div className="flex gap-12">
            {/* Recent Searches */}
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Recent Searches</p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term, i) => (
                  <button
                    key={i}
                    onClick={() => { setSearchTerm(term); }}
                    className="flex items-center gap-2 bg-[#F9F8F6] border border-gray-200 px-4 py-2 rounded-sm text-xs text-gray-600 hover:border-[#9E1817] hover:text-[#9E1817] transition-all group"
                  >
                    <svg className="w-3 h-3 text-gray-300 group-hover:text-[#9E1817]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Tips */}
            <div className="w-72">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Search Tips</p>
              <ul className="space-y-3 text-xs text-gray-500">
                {[
                  "Use the tab buttons above to switch between Productions, Contributors, and Characters.",
                  "Narrow results with the inline filters for season, language, or role.",
                  "Press Enter to search quickly.",
                ].map((tip, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-[#9E1817] font-bold mt-0.5">—</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Results */}
        {hasSearched && (
          <>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">
                {loading ? (
                  <span className="italic">Searching…</span>
                ) : (
                  <>
                    <span className="font-bold text-black">{results.length}</span>
                    {" "}result{results.length !== 1 ? "s" : ""} for{" "}
                    {searchTerm && <span className="text-[#9E1817] font-bold">"{searchTerm}"</span>}
                    {searchTerm && " "}in <span className="font-bold">{activeTab}</span>
                  </>
                )}
              </p>
              <button
                onClick={clearAll}
                className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#9E1817] transition-colors"
              >
                Clear Results
              </button>
            </div>

            {/* Results Table */}
            {!loading && (
              <div className="bg-[#D1CCC5] rounded-sm overflow-hidden shadow-sm">
                <table className="w-full text-left border-separate border-spacing-0">
                  <thead>
                    <tr className="uppercase text-[10px] font-bold text-black opacity-70">
                      <th className="p-4 w-12 border-b border-gray-200">
                        <input type="checkbox" className="w-4 h-4 rounded-sm border-gray-400" />
                      </th>
                      {columns.map(col => (
                        <th key={col} className="p-4 border-b border-gray-200">{col}</th>
                      ))}
                      <th className="p-4 border-b border-gray-200 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-[#F9F8F6]">
                    {results.length === 0 ? (
                      <tr>
                        <td colSpan={columns.length + 2} className="p-20 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <p className="text-gray-400 italic text-sm">No results found. Try adjusting your search or filters.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      results.map(row => (
                        <tr key={row.id} className="border-t border-gray-200 hover:bg-white transition-colors text-[13px]">
                          <td className="p-4 border-t border-gray-200">
                            <input type="checkbox" className="w-4 h-4 rounded-sm border-gray-400" />
                          </td>
                          {activeTab === "Productions" && <>
                            <td className="p-4 border-t border-gray-200 font-bold">{row.title}</td>
                            <td className="p-4 border-t border-gray-200 text-gray-600">{row.composer}</td>
                            <td className="p-4 border-t border-gray-200 text-gray-600 truncate max-w-[150px]" title={row.librettist}>{row.librettist}</td>
                            <td className="p-4 border-t border-gray-200 text-gray-600">{row.language}</td>
                            <td className="p-4 border-t border-gray-200 text-gray-600 text-center">{row.year}</td>
                            <td className="p-4 border-t border-gray-200 text-gray-600">{row.season}</td>
                          </>}
                          {activeTab === "Contributors" && <>
                            <td className="p-4 border-t border-gray-200 font-bold">{row.name}</td>
                            <td className="p-4 border-t border-gray-200 text-gray-600">{row.role}</td>
                            <td className="p-4 border-t border-gray-200 text-gray-600">{row.nationality}</td>
                            <td className="p-4 border-t border-gray-200 text-gray-600">{row.productions}</td>
                            <td className="p-4 border-t border-gray-200 text-gray-600">{row.debutYear}</td>
                          </>}
                          {activeTab === "Characters" && <>
                            <td className="p-4 border-t border-gray-200 font-bold">{row.name}</td>
                            <td className="p-4 border-t border-gray-200 text-gray-600">{row.voiceType}</td>
                            <td className="p-4 border-t border-gray-200 text-gray-600">{row.production}</td>
                            <td className="p-4 border-t border-gray-200 text-gray-600">{row.composer}</td>
                            <td className="p-4 border-t border-gray-200 text-gray-600 truncate max-w-[150px]">{row.notes}</td>
                          </>}
                          <td className="p-4 border-t border-gray-200 text-center">
                            <div className="flex justify-center gap-2">
                              <button className="bg-[#3D3D3D] text-white px-4 py-1 rounded-sm text-[10px] font-bold tracking-tighter">EDIT</button>
                              <button className="bg-[#4D4D4D] text-white px-4 py-1 rounded-sm text-[10px] font-bold tracking-tighter">VIEW</button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Loading skeleton */}
            {loading && (
              <div className="bg-[#D1CCC5] rounded-sm overflow-hidden shadow-sm">
                <div className="bg-[#F9F8F6]">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex gap-4 p-4 border-b border-gray-200 animate-pulse">
                      <div className="w-4 h-4 bg-gray-200 rounded-sm" />
                      <div className="h-4 bg-gray-200 rounded w-1/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/5" />
                      <div className="h-4 bg-gray-200 rounded w-1/6" />
                      <div className="h-4 bg-gray-200 rounded w-1/6" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pagination */}
            {!loading && results.length > 0 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <span className="bg-[#FDF1EE] text-[#9E1817] px-3 py-1 rounded-sm text-xs font-bold">Page 1</span>
                <span className="text-gray-400 text-xs font-bold cursor-pointer hover:text-black">2</span>
                <span className="text-gray-400 text-xs font-bold cursor-pointer hover:text-black">3</span>
                <span className="text-gray-400">→</span>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}