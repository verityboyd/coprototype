"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebase";
import SiteHeader from "../../components/SiteHeader";

async function searchProductions(rawQuery) {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return [];

  const snap = await getDocs(collection(db, "productions"));
  const results = [];

  snap.forEach((doc) => {
    const data = doc.data();
    const searchableFields = [
      data.title,
      data.composer,
      data.librettist,
      data.language,
      data.season,
      data.year,
    ]
      .filter(Boolean)
      .map((v) => String(v).toLowerCase());

    if (searchableFields.some((field) => field.includes(q))) {
      results.push({ id: doc.id, ...data });
    }
  });

  return results;
}

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    setSearchInput(query);
    if (!query) { setLoading(false); return; }
    setLoading(true);
    searchProductions(query)
      .then(setResults)
      .catch((err) => console.error("Search error:", err))
      .finally(() => setLoading(false));
  }, [query]);

  const handleNewSearch = (e) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    if (!trimmed) return;
    router.push(`/search/results?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <main className="min-h-screen bg-white text-black font-sans pb-24">
      <SiteHeader />

      {/* ── Hero Banner ── */}
      <div className="bg-[#F9F8F6] border-b border-gray-200 py-12 px-10">
        <div className="max-w-7xl mx-auto">

          {/* Breadcrumb */}
          <p className="text-[10px] uppercase tracking-[0.25em] font-bold mb-4">
            <button
              onClick={() => router.push("/search")}
              className="text-gray-400 hover:text-[#9E1817] transition-colors"
            >
              Archive
            </button>
            <span className="text-gray-300 mx-2">/</span>
            <button
              onClick={() => router.push("/search")}
              className="text-gray-400 hover:text-[#9E1817] transition-colors"
            >
              Search
            </button>
            <span className="text-gray-300 mx-2">/</span>
            <span className="text-[#9E1817]">Results</span>
          </p>

          <h1 className="text-5xl font-light text-gray-900 tracking-tight mb-2">
            Search Results
          </h1>
          <p className="text-sm text-gray-400 mb-8 tracking-wide">
            Searching across <span className="font-semibold text-gray-600">Productions</span>
          </p>

          {/* Refine Search Bar */}
          <form
            onSubmit={handleNewSearch}
            className="flex w-full max-w-2xl border border-gray-300 rounded-sm overflow-hidden shadow-md bg-white"
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
              placeholder="Refine your search..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput("")}
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

      {/* ── Results Body ── */}
      <div className="max-w-7xl mx-auto px-10 pt-10">

        {/* Results meta row */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400">
              {loading ? "Searching..." : (
                <>
                  <span className="text-gray-900 text-sm font-bold normal-case tracking-normal">{results.length}</span>
                  {" "}result{results.length !== 1 ? "s" : ""} for{" "}
                  <span className="text-[#9E1817] normal-case tracking-normal">"{query}"</span>
                </>
              )}
            </p>
            <div className="h-px w-16 bg-gray-200" />
          </div>
          <button
            onClick={() => router.push("/search")}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-[#9E1817] transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            New Search
          </button>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="border border-gray-200 rounded-sm overflow-hidden shadow-sm">
            <div className="bg-[#F9F8F6] px-6 py-3 border-b border-gray-200">
              <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse" />
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex gap-8 px-6 py-4 border-t border-gray-100 bg-white">
                <div className="h-3 bg-gray-100 rounded w-1/4" />
                <div className="h-3 bg-gray-100 rounded w-1/5" />
                <div className="h-3 bg-gray-100 rounded w-1/5" />
                <div className="h-3 bg-gray-100 rounded w-1/6" />
                <div className="h-3 bg-gray-100 rounded w-1/6" />
              </div>
            ))}
          </div>
        )}

        {/* No results */}
        {!loading && results.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-32 text-center border border-gray-100 rounded-sm bg-[#F9F8F6]">
            <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-gray-400 text-sm">No productions found for <span className="font-semibold text-gray-600">"{query}"</span>.</p>
            <p className="text-xs text-gray-300">Try a different title, composer, or keyword.</p>
            <button
              onClick={() => router.push("/search")}
              className="mt-2 bg-[#9E1817] text-white text-[10px] font-bold uppercase tracking-[0.2em] px-8 py-2.5 rounded-sm hover:bg-[#821413] transition-colors"
            >
              New Search
            </button>
          </div>
        )}

        {/* Results table */}
        {!loading && results.length > 0 && (
          <div className="border border-gray-200 rounded-sm overflow-hidden shadow-sm">
            {/* Table header bar */}
            <div className="bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-800">Productions</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{results.length} matching record{results.length !== 1 ? "s" : ""}</p>
              </div>
            </div>

            <table className="w-full text-left border-separate border-spacing-0">
              <thead>
                <tr className="bg-[#F9F8F6] text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  <th className="px-6 py-3 border-b border-gray-200">Title</th>
                  <th className="px-6 py-3 border-b border-gray-200">Composer</th>
                  <th className="px-6 py-3 border-b border-gray-200">Librettist</th>
                  <th className="px-6 py-3 border-b border-gray-200">Language</th>
                  <th className="px-6 py-3 border-b border-gray-200 text-center">Year</th>
                  <th className="px-6 py-3 border-b border-gray-200">Season</th>
                  <th className="px-6 py-3 border-b border-gray-200 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {results.map((prod, i) => (
                  <tr
                    key={prod.id}
                    className={`hover:bg-[#FDFCFB] transition-colors text-[13px] ${
                      i !== 0 ? "border-t border-gray-100" : ""
                    }`}
                  >
                    <td className="px-6 py-4 font-semibold text-gray-800">{prod.title}</td>
                    <td className="px-6 py-4 text-gray-500">{prod.composer}</td>
                    <td className="px-6 py-4 text-gray-500 truncate max-w-[150px]" title={prod.librettist}>
                      {prod.librettist}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{prod.language}</td>
                    <td className="px-6 py-4 text-center text-gray-500">{prod.year}</td>
                    <td className="px-6 py-4 text-gray-500">{prod.season}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button className="bg-[#3D3D3D] text-white px-4 py-1.5 rounded-sm text-[10px] font-bold tracking-widest hover:bg-black transition-colors">
                          EDIT
                        </button>
                        <button className="border border-gray-300 text-gray-600 px-4 py-1.5 rounded-sm text-[10px] font-bold tracking-widest hover:border-gray-400 hover:text-gray-800 transition-colors">
                          VIEW
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}