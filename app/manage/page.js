"use client";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";
import SiteHeader from "../components/SiteHeader";

export default function ManageArchive() {
  const [activeTab, setActiveTab] = useState("Productions");
  const [productions, setProductions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductions = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "productions"));
        const prodList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProductions(prodList);
      } catch (error) {
        console.error("Error fetching archive:", error);
      }
      setLoading(false);
    };

    fetchProductions();
  }, []);

  return (
    <main className="min-h-screen bg-white text-black">
      <SiteHeader />

      <div className="max-w-7xl mx-auto p-8">
        {/* Breadcrumbs & Title */}
        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-widest text-[#9E1817] font-bold">
            ADMIN / <span className="text-gray-400">MANAGE ARCHIVE</span>
          </p>
          <h1 className="text-4xl font-normal text-gray-800 mt-2">Manage Archive</h1>
        </div>

        {/* Dynamic Stats Bar (Matching Figma counts) */}
        <div className="flex gap-12 mb-8 text-sm text-gray-500 border-b border-gray-100 pb-6">
          <div><span className="text-2xl font-light text-black mr-2">317</span> CONTRIBUTORS</div>
          <div className="border-l border-gray-300 pl-12">
            <span className="text-2xl font-light text-black mr-2">{productions.length}</span> PRODUCTIONS
          </div>
          <div className="border-l border-gray-300 pl-12">
            <span className="text-2xl font-light text-black mr-2">87</span> CHARACTERS
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-10 mb-8 border-b border-gray-200">
          {["Contributors", "Productions", "Characters"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-2 text-sm font-bold tracking-tight transition-all ${
                activeTab === tab 
                ? "border-b-2 border-[#9E1817] text-[#9E1817]" 
                : "text-gray-400 hover:text-black"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Controls Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-stretch">
            <input 
              className="border border-gray-300 p-2 px-4 w-80 text-sm outline-none focus:ring-1 focus:ring-[#9E1817]" 
              placeholder={`Search by name, voice type, role, status`} 
            />
            <button className="bg-[#9E1817] text-white px-8 py-2 text-sm font-bold hover:bg-[#821413]">
              SEARCH
            </button>
          </div>
          
          <button className="bg-[#9E1817] text-white px-6 py-2 rounded-sm flex items-center gap-3 font-bold text-sm hover:shadow-lg transition-shadow">
            Add New <span className="text-xl">+</span>
          </button>
        </div>

        {/* Table Container */}
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
                  <td colSpan="5" className="p-20 text-center text-gray-500 animate-pulse">
                    Loading Archive...
                  </td>
                </tr>
              ) : (
                productions.map((prod) => (
                  <tr key={prod.id} className="border-b border-gray-200 hover:bg-white transition-colors text-sm">
                    <td className="p-4 border-b border-gray-200"><input type="checkbox" /></td>
                    <td className="p-4 border-b border-gray-200 font-medium">{prod.name}</td>
                    <td className="p-4 border-b border-gray-200 text-gray-600">{prod.year || "2026"}</td>
                    <td className="p-4 border-b border-gray-200 text-gray-600">Status</td>
                    <td className="p-4 border-b border-gray-200">
                      <div className="flex justify-center gap-2">
                        <button className="bg-[#2D2D2D] text-white px-4 py-1 rounded-sm text-[10px] font-bold hover:bg-black">
                          EDIT
                        </button>
                        <button className="bg-[#4A4A4A] text-white px-4 py-1 rounded-sm text-[10px] font-bold hover:bg-black">
                          VIEW
                        </button>
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