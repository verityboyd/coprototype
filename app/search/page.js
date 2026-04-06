"use client";
import { useState, useEffect, useCallback } from "react"; // <--- Make sure useCallback is here
import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";
import SiteHeader from "../components/SiteHeader";
import Link from "next/link";

export default function SearchPage() {
  const [activeTab, setActiveTab] = useState("Productions");
  const [productions, setProductions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const prodSnapshot = await getDocs(collection(db, "productions"));
      const prodList = prodSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      setProductions(prodList);
    } catch (err) {
      console.error("Error fetching archive:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <main className="min-h-screen bg-white text-black">
      <SiteHeader />

      <div className="max-w-7xl mx-auto px-8 pt-0 -mt-12">
        {/* Breadcrumbs */}
        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-widest font-bold">
            <span className="text-gray-400">ADMIN / </span>
            <span className="text-[#9E1817]">ARCHIVE SEARCH</span>
          </p>
          <h1 className="text-4xl font-normal text-gray-800 mt-2">Search Archive</h1>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-between items-end mb-8 border-b border-gray-200">
          <div className="flex gap-10">
            {["Contributors", "Productions", "Characters"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-2 text-sm font-bold transition-all ${
                  activeTab === tab 
                  ? "border-b-2 border-[#9E1817] text-[#9E1817]" 
                  : "text-gray-400 hover:text-black"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar & Add New Button */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-stretch">
            <input 
              className="border border-gray-300 p-2 px-4 w-80 text-sm outline-none focus:ring-1 focus:ring-[#9E1817]" 
              placeholder={`Search by name...`} 
            />
            <button className="bg-[#9E1817] text-white px-8 py-2 text-sm font-bold hover:bg-[#821413]">
              SEARCH
            </button>
          </div>
          
          <Link href="/manage">
            <button className="bg-[#9E1817] text-white px-6 py-2 rounded-sm flex items-center gap-3 font-bold text-sm hover:shadow-md transition-shadow">
              Add New <span className="text-xl">+</span>
            </button>
          </Link>
        </div>

        {/* Results Table */}
        <div className="bg-[#D1CCC5] rounded-sm overflow-hidden shadow-sm">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="uppercase text-[11px] font-bold text-gray-600">
                <th className="p-4 w-12"><input type="checkbox" className="w-4 h-4" /></th>
                <th className="p-4">Name</th>
                <th className="p-4">Year/Type</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-[#F9F8F6]">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-20 text-center text-gray-400 italic">
                    Loading Archive...
                  </td>
                </tr>
              ) : productions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-20 text-center text-gray-500">
                    No records found.
                  </td>
                </tr>
              ) : (
                productions.map((prod) => (
                  <tr key={prod.id} className="border-b border-gray-200 hover:bg-white transition-colors text-sm text-black">
                    <td className="p-4 border-b border-gray-200"><input type="checkbox" /></td>
                    <td className="p-4 border-b border-gray-200 font-medium">{prod.title || prod.name}</td>
                    <td className="p-4 border-b border-gray-200 text-gray-600">{prod.year || "N/A"}</td>
                    <td className="p-4 border-b border-gray-200 text-gray-600">Active</td>
                    <td className="p-4 border-b border-gray-200">
                      <div className="flex justify-center gap-2">
                        <button className="bg-[#2D2D2D] text-white px-4 py-1 rounded-sm text-[10px] font-bold">EDIT</button>
                        <button className="bg-[#4A4A4A] text-white px-4 py-1 rounded-sm text-[10px] font-bold">VIEW</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}