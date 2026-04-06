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
  const [showSeasonAccordion, setShowSeasonAccordion] = useState(false);
  const [counts, setCounts] = useState({ contributors: 317, productions: 0, characters: 87 });

  // Form State
  const [formData, setFormData] = useState({
    title: "", composer: "", librettist: "", 
    season: "", year: "", language: "", duration: ""
  });
  const [error, setError] = useState(null);

  // --- 2. Database Logic ---
  // Memoized so it doesn't change on every render
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
      console.error("Error fetching archive data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // SAFE EFFECT: Prevents cascading renders by isolating the call
  useEffect(() => {
    let isSubscribed = true;

    const setup = async () => {
      if (isSubscribed) {
        await fetchData();
      }
    };

    setup();

    return () => {
      isSubscribed = false;
    };
  }, [fetchData]);

  // --- 3. Event Handlers ---
  const handleSubmit = async (e, addMore = false) => {
    e.preventDefault();
    setError(null);

    // Step 13: Year Format Validation
    if (!/^\d{4}$/.test(formData.year)) {
      setError("Year must be in YYYY format.");
      return;
    }

    const { error: addError } = await addProduction(formData);
    
    if (addError) {
      setError(addError);
    } else {
      alert("Success: Production added!");
      await fetchData(); // Refresh the counts and table
      
      if (addMore) {
        setFormData({ title: "", composer: "", librettist: "", season: "", year: "", language: "", duration: "" });
      } else {
        setShowModal(false);
        setFormData({ title: "", composer: "", librettist: "", season: "", year: "", language: "", duration: "" });
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
    <main className="min-h-screen bg-white text-black relative">
      <SiteHeader />

      <div className="max-w-7xl mx-auto px-8 pt-0 -mt-12">
        {/* Breadcrumbs */}
        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-widest font-bold">
            <span className="text-gray-400">ADMIN / </span>
            <span className="text-[#9E1817]">MANAGE ARCHIVE</span>
          </p>
          <h1 className="text-4xl font-normal text-gray-800 mt-2">Manage Archive</h1>
        </div>

        {/* Stats Bar (Dynamic) */}
        <div className="flex gap-12 mb-8 text-sm text-gray-500 border-b border-gray-100 pb-6">
          <div><span className="text-2xl font-light text-black mr-2">{counts.contributors}</span> CONTRIBUTORS</div>
          <div className="border-l border-gray-300 pl-12">
            <span className="text-2xl font-light text-black mr-2">{counts.productions}</span> PRODUCTIONS
          </div>
          <div className="border-l border-gray-300 pl-12">
            <span className="text-2xl font-light text-black mr-2">{counts.characters}</span> CHARACTERS
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-10 mb-8 border-b border-gray-200">
          {["Contributors", "Productions", "Characters"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-2 text-sm font-bold transition-all ${
                activeTab === tab ? "border-b-2 border-[#9E1817] text-[#9E1817]" : "text-gray-400 hover:text-black"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Actions Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-stretch">
            <input className="border border-gray-300 p-2 px-4 w-80 text-sm outline-none" placeholder="Search archive..." />
            <button className="bg-[#9E1817] text-white px-8 py-2 text-sm font-bold hover:bg-[#821413]">SEARCH</button>
          </div>
          <button onClick={() => setShowModal(true)} className="bg-[#9E1817] text-white px-6 py-2 rounded-sm font-bold text-sm hover:shadow-md transition-all">
            Add New Production +
          </button>
        </div>

        {/* Table Results */}
        <div className="bg-[#D1CCC5] rounded-sm overflow-hidden shadow-sm">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="uppercase text-[11px] font-bold text-gray-600">
                <th className="p-4 w-12"><input type="checkbox" className="w-4 h-4" /></th>
                <th className="p-4">Name</th>
                <th className="p-4">Year/Type</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-[#F9F8F6]">
              {loading ? (
                <tr><td colSpan="5" className="p-20 text-center text-gray-400 italic">Loading Archive...</td></tr>
              ) : productions.length === 0 ? (
                <tr><td colSpan="5" className="p-20 text-center text-gray-500">No records found.</td></tr>
              ) : (
                productions.map((prod) => (
                  <tr key={prod.id} className="border-b border-gray-200 hover:bg-white text-sm text-black transition-colors">
                    <td className="p-4"><input type="checkbox" /></td>
                    <td className="p-4 font-medium">{prod.title || prod.name}</td>
                    <td className="p-4 text-gray-600">{prod.year || "N/A"}</td>
                    <td className="p-4">
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

      {/* --- ADD NEW MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-[#9E1817] font-bold text-xl mb-6 border-b pb-2 uppercase tracking-tight">Add New Production</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Title *</label>
                  <input required className="border-2 rounded-lg p-2 w-full text-sm outline-none focus:border-[#9E1817]" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Composer *</label>
                  <input required className="border-2 rounded-lg p-2 w-full text-sm outline-none focus:border-[#9E1817]" value={formData.composer} onChange={e => setFormData({...formData, composer: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Librettist *</label>
                  <input required className="border-2 rounded-lg p-2 w-full text-sm outline-none focus:border-[#9E1817]" value={formData.librettist} onChange={e => setFormData({...formData, librettist: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Language</label>
                  <input className="border-2 rounded-lg p-2 w-full text-sm outline-none focus:border-[#9E1817]" value={formData.language} onChange={e => setFormData({...formData, language: e.target.value})} />
                </div>
              </div>

              <div className="bg-gray-50 p-4 border rounded-lg">
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Season *</label>
                <select required className="border-2 rounded-lg p-2 w-full text-sm mb-2" value={formData.season} onChange={e => setFormData({...formData, season: e.target.value})}>
                  <option value="">Select Season</option>
                  {seasons.map(s => <option key={s.id} value={s.label}>{s.label}</option>)}
                </select>
                <button type="button" onClick={() => setShowSeasonAccordion(!showSeasonAccordion)} className="text-[#9E1817] text-xs font-bold hover:underline">
                  + Add New Season
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Year (YYYY) *</label>
                  <input required className="border-2 rounded-lg p-2 w-full text-sm outline-none focus:border-[#9E1817]" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Duration (mins)</label>
                  <input type="number" className="border-2 rounded-lg p-2 w-full text-sm outline-none focus:border-[#9E1817]" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} />
                </div>
              </div>

              {error && <p className="text-red-600 text-xs italic bg-red-50 p-2 rounded border border-red-100">{error}</p>}

              <div className="flex justify-between items-center pt-6 border-t mt-6">
                <button type="button" onClick={handleCancel} className="text-gray-400 font-bold text-sm hover:text-black">EXIT</button>
                <div className="flex gap-4">
                  <button type="button" onClick={(e) => handleSubmit(e, true)} className="border-2 border-[#9E1817] text-[#9E1817] px-4 py-2 font-bold text-sm hover:bg-red-50 transition-colors">ADD MORE</button>
                  <button type="button" onClick={(e) => handleSubmit(e, false)} className="bg-[#9E1817] text-white px-8 py-2 font-bold text-sm shadow-lg hover:bg-[#821413] transition-colors">SAVE</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}