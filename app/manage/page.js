"use client";
import { useState, useEffect, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";
import { addProduction, getSeasons } from "../_services/ArchiveServices"; 
import SiteHeader from "../components/SiteHeader";

export default function ManageArchive() {
  // --- 1. State Management ---
  const [activeTab, setActiveTab] = useState("Productions");
  const [productions, setProductions] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); 
  const [counts, setCounts] = useState({ contributors: 317, productions: 0, characters: 87 });

  const [formData, setFormData] = useState({
    title: "",
    composer: "",
    librettist: "",
    language: "",
    season: "",
    year: "",
    duration: ""
  });
  const [error, setError] = useState(null);

  // --- 2. Database Logic ---
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [prodSnap, seasonList, contribSnap, charSnap] = await Promise.all([
        getDocs(collection(db, "productions")),
        getSeasons(),
        getDocs(collection(db, "contributors")),
        getDocs(collection(db, "characters"))
      ]);

      setProductions(prodSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setSeasons(seasonList);
      
      setCounts({
        productions: prodSnap.size,
        contributors: contribSnap.size || 317,
        characters: charSnap.size || 87
      });
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isSubscribed = true;
    if (isSubscribed) {
      fetchData();
    }
    return () => { isSubscribed = false; };
  }, [fetchData]);

  // --- 3. Handlers ---
  const handleSubmit = async (e, addMore = false) => {
    e.preventDefault();
    setError(null);

    // Auto-generate prodId based on current collection size + 1
    const nextId = String(productions.length + 1);
    
    const submissionData = {
      ...formData,
      prodId: nextId
    };

    if (!/^\d{4}$/.test(formData.year)) {
      setError("Year must be in YYYY format.");
      return;
    }

    const { error: apiError } = await addProduction(submissionData);
    
    if (apiError) {
      setError(apiError);
    } else {
      alert("Success: Production added to the archive.");
      
      await fetchData(); 
      
      const resetForm = { title: "", composer: "", librettist: "", season: "", year: "", language: "", duration: "" };
      setFormData(resetForm);
      
      if (!addMore) {
        setShowModal(false);
      }
    }
  };

  const handleCancel = () => {
    if (formData.title || formData.composer || formData.year) {
      if (window.confirm("Are you sure? Progress will be lost.")) {
        setShowModal(false);
        setFormData({ title: "", composer: "", librettist: "", season: "", year: "", language: "", duration: "" });
        setError(null);
      }
    } else {
      setShowModal(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-black font-sans pb-20">
      <SiteHeader />

      <div className="max-w-7xl mx-auto px-10 -mt-10">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <p className="text-[10px] uppercase tracking-widest font-bold">
            <span className="text-gray-300">ADMIN / </span>
            <span className="text-[#9E1817]">MANAGE ARCHIVE</span>
          </p>
          <h1 className="text-4xl font-normal text-gray-800 mt-1">Manage Archive</h1>
        </div>

        {/* Dynamic Stats Bar */}
        <div className="flex items-center gap-10 mb-10 text-[11px] font-bold text-gray-400 border-b border-gray-100 pb-8">
          <div><span className="text-3xl font-light text-black mr-2">{counts.contributors}</span> CONTRIBUTORS</div>
          <div className="h-8 border-l border-gray-300"></div>
          <div><span className="text-3xl font-light text-black mr-2">{counts.productions}</span> PRODUCTIONS</div>
          <div className="h-8 border-l border-gray-300"></div>
          <div><span className="text-3xl font-light text-black mr-2">{counts.characters}</span> CHARACTERS</div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-12 border-b border-gray-200 mb-8">
          {["Contributors", "Productions", "Characters"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-2 text-base font-bold transition-all ${
                activeTab === tab ? "border-b-2 border-[#9E1817] text-[#9E1817]" : "text-gray-500 hover:text-black"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search & Actions Row */}
        <div className="flex gap-4 mb-6">
          <div className="flex flex-1 border border-gray-300 rounded-sm overflow-hidden h-10">
            <input 
              className="flex-1 px-4 py-2 text-sm outline-none placeholder:text-gray-400 italic" 
              placeholder="Search by name, year, season..." 
            />
            <button className="bg-[#9E1817] text-white px-8 text-xs font-bold tracking-widest uppercase">Search</button>
          </div>
          
          <select className="bg-[#F1EFED] border-none rounded-sm px-4 py-2 text-sm text-gray-500 font-medium outline-none min-w-[180px]">
            <option>All Seasons</option>
          </select>

          <select className="bg-[#F1EFED] border-none rounded-sm px-4 py-2 text-sm text-gray-500 font-medium outline-none min-w-[180px]">
            <option>All Languages</option>
          </select>

          <button 
            onClick={() => setShowModal(true)}
            className="bg-[#9E1817] text-white px-6 py-2 rounded-sm font-bold text-sm flex items-center gap-4 hover:bg-[#821413] transition-all"
          >
            Add New <span className="text-lg">+</span>
          </button>
        </div>

        {/* Archive Table */}
        <div className="bg-[#D1CCC5] rounded-sm overflow-hidden shadow-sm">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="uppercase text-[10px] font-bold text-black opacity-70">
                <th className="p-4 w-12 border-b border-gray-200"><input type="checkbox" className="w-4 h-4 rounded-sm border-gray-400" /></th>
                <th className="p-4 border-b border-gray-200">Production Name</th>
                <th className="p-4 border-b border-gray-200">Composer</th>
                <th className="p-4 border-b border-gray-200">Librettist</th>
                <th className="p-4 border-b border-gray-200">Language</th>
                <th className="p-4 border-b border-gray-200 text-center">Year</th>
                <th className="p-4 border-b border-gray-200">Season</th>
                <th className="p-4 border-b border-gray-200 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-[#F9F8F6]">
              {loading ? (
                <tr><td colSpan="8" className="p-20 text-center text-gray-400 italic">Loading archive...</td></tr>
              ) : (
                productions.map((prod) => (
                  <tr key={prod.id} className="border-t border-gray-200 hover:bg-white transition-colors text-[13px]">
                    <td className="p-4 border-t border-gray-200"><input type="checkbox" className="w-4 h-4 rounded-sm border-gray-400" /></td>
                    <td className="p-4 border-t border-gray-200 font-bold">{prod.title}</td>
                    <td className="p-4 border-t border-gray-200 text-gray-600">{prod.composer}</td>
                    <td className="p-4 border-t border-gray-200 text-gray-600 truncate max-w-[150px]" title={prod.librettist}>{prod.librettist}</td>
                    <td className="p-4 border-t border-gray-200 text-gray-600">{prod.language}</td>
                    <td className="p-4 border-t border-gray-200 text-center text-gray-600">{prod.year}</td>
                    <td className="p-4 border-t border-gray-200 text-gray-600">{prod.season}</td>
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

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-8">
           <span className="bg-[#FDF1EE] text-[#9E1817] px-3 py-1 rounded-sm text-xs font-bold">Page 1</span>
           <span className="text-gray-400 text-xs font-bold cursor-pointer hover:text-black">2</span>
           <span className="text-gray-400 text-xs font-bold cursor-pointer hover:text-black">3</span>
           <span className="text-gray-400">→</span>
        </div>
      </div>

      {/* --- ADD NEW PRODUCTION MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[200] p-4">
          <div className="bg-white p-10 rounded-lg max-w-2xl w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-8 text-gray-400 hover:text-black font-bold text-xl">×</button>
            
            <h2 className="text-[#9E1817] font-bold text-xl mb-1 uppercase tracking-tight">Add New Production</h2>
            <div className="w-full h-[1px] bg-[#9E1817] mb-8"></div>
            
            <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Production Title *</label>
                  <input required className="border border-gray-300 rounded-sm p-3 text-sm outline-none focus:border-[#9E1817]" 
                    value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Tosca" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Composer *</label>
                  <input required className="border border-gray-300 rounded-sm p-3 text-sm outline-none focus:border-[#9E1817]" 
                    value={formData.composer} onChange={e => setFormData({...formData, composer: e.target.value})} placeholder="e.g. Puccini" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Librettist(s) *</label>
                <input required className="border border-gray-300 rounded-sm p-3 text-sm outline-none focus:border-[#9E1817]" 
                  value={formData.librettist} onChange={e => setFormData({...formData, librettist: e.target.value})} placeholder="e.g. Luigi Illica, Giuseppe Giacosa" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Season *</label>
                  <input required className="border border-gray-300 rounded-sm p-3 text-sm outline-none focus:border-[#9E1817]" 
                    value={formData.season} onChange={e => setFormData({...formData, season: e.target.value})} placeholder="e.g. 2001-2002" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Year (YYYY) *</label>
                  <input required className="border border-gray-300 rounded-sm p-3 text-sm outline-none focus:border-[#9E1817]" 
                    value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} placeholder="2001" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Language</label>
                  <input className="border border-gray-300 rounded-sm p-3 text-sm outline-none focus:border-[#9E1817]" 
                    value={formData.language} onChange={e => setFormData({...formData, language: e.target.value})} placeholder="e.g. Italian" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Duration</label>
                  <input type="text" className="border border-gray-300 rounded-sm p-3 text-sm outline-none focus:border-[#9E1817]" 
                    value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} placeholder="e.g. 2h 20m" />
                </div>
              </div>

              {error && <p className="text-red-600 text-xs italic bg-red-50 p-2 border border-red-100 rounded-sm">{error}</p>}

              <div className="flex justify-between items-center pt-6 border-t border-gray-100 mt-4">
                <button type="button" onClick={handleCancel} className="text-gray-400 font-bold text-[11px] uppercase tracking-widest hover:text-black">Exit / Cancel</button>
                <div className="flex gap-4">
                  <button type="button" onClick={(e) => handleSubmit(e, true)} className="border border-[#9E1817] text-[#9E1817] px-6 py-2 font-bold text-[11px] uppercase tracking-widest hover:bg-red-50">Add More</button>
                  <button type="submit" className="bg-[#9E1817] text-white px-8 py-2 font-bold text-[11px] uppercase tracking-widest shadow-lg hover:bg-[#821413]">Save Production</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}