"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../utils/firebase";
import SiteHeader from "../../../components/SiteHeader";

async function searchProductions(rawQuery) {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return [];

  const snap = await getDocs(collection(db, "productions"));
  const results = [];

  snap.forEach((doc) => {
    const data = doc.data();
    // Search across title, composer, librettist, language, season fields
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

    const matches = searchableFields.some((field) => field.includes(q));
    if (matches) {
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
    if (!query) {
      setLoading(false);
      return;
    }
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
    <main className="min-h-screen bg-white text-black font-sans pb-20">
      <SiteHeader />

      <div className="max-w-7xl mx-auto px-10 pt-5">
        {/* Breadcrumb */}
        <div className="mb-6">
          <p className="text-[10px] uppercase tracking-widest font-bold">
            <span className="text-gray-300">ARCHIVE / </span>
            <button
              onClick={() => router.push("/search")}
              className="text-gray-300 hover:text-[#9E1817] transition-colors"
            >
              SEARCH
            </button>
            <span className="text-gray-300"> / </span>
            <span className="text-[#9E1817]">RESULTS</span>
          </p>
          <h1 className="text-4xl font-normal text-gray-800 mt-1">Search Results</h1>
        </div>

        {/* Inline search bar for refining */}
        <form
          onSubmit={handleNewSearch}
          className="flex border border-gray-300 rounded-sm overflow-hidden h-12 shadow-sm bg-white max-w-3xl mb-8"
        >
          <div className="flex items-center px-5 text-gray-300 border-r border-gray-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            className="flex-1 px-5 py-2 text-sm outline-none placeholder:text-gray-400 italic bg-transparent"
            placeholder="Refine your search..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button
            type="submit"
            className="bg-[#9E1817] text-white px-10 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#821413] transition-colors"
          >
            Search
          </button>
        </form>

        {/* Results count */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
          {loading ? (
            <p className="text-sm text-gray-400 italic">Searching...</p>
          ) : (
            <p className="text-sm text-gray-500">
              <span className="font-bold text-black">{results.length}</span>{" "}
              result{results.length !== 1 ? "s" : ""} for{" "}
              <span className="text-[#9E1817] font-bold">"{query}"</span>{" "}
              in Productions
            </p>
          )}
          <button
            onClick={() => router.push("/search")}
            className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#9E1817] transition-colors"
          >
            ← New Search
          </button>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse flex gap-6 p-5 border border-gray-100 rounded-sm bg-[#F9F8F6]">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-4 bg-gray-200 rounded w-1/5" />
              </div>
            ))}
          </div>
        )}

        {/* No results */}
        {!loading && results.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-gray-400 italic">No productions found for "{query}".</p>
            <button
              onClick={() => router.push("/search")}
              className="mt-2 text-[11px] font-bold uppercase tracking-widest text-[#9E1817] hover:underline"
            >
              Try a new search
            </button>
          </div>
        )}

        {/* Results list */}
        {!loading && results.length > 0 && (
          <div className="bg-[#D1CCC5] rounded-sm overflow-hidden shadow-sm">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead>
                <tr className="uppercase text-[10px] font-bold text-black opacity-70">
                  <th className="p-4 border-b border-gray-200">Production Title</th>
                  <th className="p-4 border-b border-gray-200">Composer</th>
                  <th className="p-4 border-b border-gray-200">Librettist</th>
                  <th className="p-4 border-b border-gray-200">Language</th>
                  <th className="p-4 border-b border-gray-200 text-center">Year</th>
                  <th className="p-4 border-b border-gray-200">Season</th>
                  <th className="p-4 border-b border-gray-200 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-[#F9F8F6]">
                {results.map((prod) => (
                  <tr
                    key={prod.id}
                    className="border-t border-gray-200 hover:bg-white transition-colors text-[13px]"
                  >
                    <td className="p-4 border-t border-gray-200 font-bold">{prod.title}</td>
                    <td className="p-4 border-t border-gray-200 text-gray-600">{prod.composer}</td>
                    <td className="p-4 border-t border-gray-200 text-gray-600 truncate max-w-[150px]" title={prod.librettist}>
                      {prod.librettist}
                    </td>
                    <td className="p-4 border-t border-gray-200 text-gray-600">{prod.language}</td>
                    <td className="p-4 border-t border-gray-200 text-center text-gray-600">{prod.year}</td>
                    <td className="p-4 border-t border-gray-200 text-gray-600">{prod.season}</td>
                    <td className="p-4 border-t border-gray-200 text-center">
                      <div className="flex justify-center gap-2">
                        <button className="bg-[#3D3D3D] text-white px-4 py-1 rounded-sm text-[10px] font-bold tracking-tighter">
                          EDIT
                        </button>
                        <button className="bg-[#4D4D4D] text-white px-4 py-1 rounded-sm text-[10px] font-bold tracking-tighter">
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