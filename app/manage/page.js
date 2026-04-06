"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // To handle "Cancel" redirect
import { addProduction, getSeasons } from "../_services/ArchiveServices";
import SiteHeader from "../components/SiteHeader";

export default function ManagePage() {
  const router = useRouter();
  const [seasons, setSeasons] = useState([]);
  const [showSeasonAccordion, setShowSeasonAccordion] = useState(false);
  const [error, setError] = useState(null);

  // Use Case 1: All required and optional fields
  const [formData, setFormData] = useState({
    title: "",
    composer: "",
    librettist: "",
    season: "",
    year: "",
    language: "",
    duration: ""
  });

  // Step 10: Populate seasons from DB
  useEffect(() => {
    getSeasons().then(setSeasons);
  }, []);

  // Alternate Flow 1.1: Cancel/Exit logic
  const handleCancel = () => {
    if (formData.title || formData.composer || formData.year) {
      if (window.confirm("Are you sure you want to cancel? Any data entered will be deleted.")) {
        router.push("/search"); // Redirect back to search
      }
    } else {
      router.push("/search");
    }
  };

  const handleSubmit = async (e, addMore = false) => {
    e.preventDefault();
    setError(null);

    // Step 13: Year Format Validation (YYYY)
    if (!/^\d{4}$/.test(formData.year)) {
      setError("Year must be in YYYY format.");
      return;
    }

    const { error: addError } = await addProduction(formData);
    
    if (addError) {
      setError(addError);
    } else {
      alert("Success: Production added to database.");
      
      if (addMore) {
        // Alternate Flow 16.1: Reset fields but stay on page
        setFormData({ title: "", composer: "", librettist: "", season: "", year: "", language: "", duration: "" });
      } else {
        // Step 18: Exit to search
        router.push("/search");
      }
    }
  };

  return (
    <main className="min-h-screen bg-white text-black">
      <SiteHeader />

      <div className="max-w-4xl mx-auto px-8 -mt-12 pb-20">
        {/* Breadcrumbs */}
        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-widest font-bold">
            <span className="text-gray-400">ADMIN / </span>
            <span className="text-[#9E1817]">MANAGE ARCHIVE</span>
          </p>
          <h1 className="text-4xl font-normal text-gray-800 mt-2">Add New Production</h1>
        </div>

        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-8 bg-[#F9F8F6] p-10 rounded-sm border border-gray-200 shadow-sm">
          
          {/* Section: Basic Info (Steps 3-8) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Production Title *</label>
              <input required className="border-2 border-gray-300 rounded-lg p-3 w-full text-sm outline-none focus:border-[#9E1817]" 
                value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Carmen" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Composer *</label>
              <input required className="border-2 border-gray-300 rounded-lg p-3 w-full text-sm outline-none focus:border-[#9E1817]" 
                value={formData.composer} onChange={e => setFormData({...formData, composer: e.target.value})} placeholder="e.g. Georges Bizet" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Librettist *</label>
              <input required className="border-2 border-gray-300 rounded-lg p-3 w-full text-sm outline-none focus:border-[#9E1817]" 
                value={formData.librettist} onChange={e => setFormData({...formData, librettist: e.target.value})} />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Language</label>
              <input className="border-2 border-gray-300 rounded-lg p-3 w-full text-sm outline-none focus:border-[#9E1817]" 
                value={formData.language} onChange={e => setFormData({...formData, language: e.target.value})} placeholder="e.g. French" />
            </div>
          </div>

          {/* Section: Season Selection (Step 9 & Alt Flow 9.1) */}
          <div className="bg-white p-6 border rounded-lg">
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Season *</label>
            <select required className="border-2 border-gray-300 rounded-lg p-3 w-full text-sm mb-3 outline-none focus:border-[#9E1817]" 
              value={formData.season} onChange={e => setFormData({...formData, season: e.target.value})}>
              <option value="">Select an existing season</option>
              {seasons.map(s => <option key={s.id} value={s.label}>{s.label}</option>)}
            </select>
            <button type="button" onClick={() => setShowSeasonAccordion(!showSeasonAccordion)} className="text-[#9E1817] text-xs font-bold hover:underline">
              {showSeasonAccordion ? "- Close" : "+ Add New Season"}
            </button>
            
            {showSeasonAccordion && (
              <div className="mt-4 p-4 border-t bg-gray-50 rounded animate-fadeIn">
                <input placeholder="New Season Label (e.g. 2023-2024)" className="border p-2 w-full text-sm mb-2" />
                <div className="flex gap-2">
                  <button type="button" className="bg-black text-white px-4 py-1 text-[10px] font-bold">SAVE SEASON</button>
                  <button type="button" onClick={() => setShowSeasonAccordion(false)} className="text-[10px] font-bold text-gray-500">CANCEL</button>
                </div>
              </div>
            )}
          </div>

          {/* Section: Technical Details (Steps 12-15) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Year (YYYY) *</label>
              <input required className="border-2 border-gray-300 rounded-lg p-3 w-full text-sm outline-none focus:border-[#9E1817]" 
                value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} placeholder="2026" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Duration (minutes)</label>
              <input type="number" className="border-2 border-gray-300 rounded-lg p-3 w-full text-sm outline-none focus:border-[#9E1817]" 
                value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} placeholder="150" />
            </div>
          </div>

          {error && <p className="text-red-600 text-xs italic bg-red-50 p-2 rounded">{error}</p>}

          {/* Action Footer (Steps 16-19) */}
          <div className="flex justify-between items-center pt-8 border-t border-gray-200 mt-10">
            <button type="button" onClick={handleCancel} className="text-gray-400 font-bold text-sm hover:text-black transition-colors">
              EXIT / CANCEL
            </button>
            <div className="flex gap-4">
              <button type="button" onClick={(e) => handleSubmit(e, true)} className="border-2 border-[#9E1817] text-[#9E1817] px-6 py-2 font-bold text-sm hover:bg-red-50 transition-colors">
                ADD MORE
              </button>
              <button type="submit" className="bg-[#9E1817] text-white px-10 py-3 font-bold text-sm hover:bg-[#821413] transition-colors shadow-lg">
                SAVE PRODUCTION
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}