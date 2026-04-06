"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function SiteHeader() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-gray-300 relative z-[100] mb-15">
      <div className="max-w-7xl mx-auto px-10 py-5 flex justify-between items-end">
        
        <Link href="/search">
          <div className="flex flex-row items-end cursor-pointer group">
            <Image
              src="/assets/Logo.png"
              alt="Calgary Opera logo"
              width={100}
              height={100}
              style={{ backgroundColor: "white" }}
              priority
            />
            <div className="font-bold text-xl ml-2 tracking-tighter">ARCHIVE</div>
          </div>
        </Link>

        <div className="flex gap-8 pb-1 text-sm font-bold tracking-widest">
          <Link 
            href="/search" 
            className={`transition-colors duration-200 hover:text-black ${
              pathname === '/search' 
                ? 'text-[#9E1817]' 
                : 'text-gray-400' 
            }`}
          >
            SEARCH
          </Link>
          
          {/* Disabled Dashboard */}
          <span className="text-gray-300 cursor-not-allowed">
            DASHBOARD
          </span>
          
          {/* Disabled Reports */}
          <span className="text-gray-300 cursor-not-allowed">
            REPORTS
          </span>
        </div>

        {/* Profile Dropdown Section */}
        <div className="relative pb-1">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 group focus:outline-none"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-6 w-6 transition-colors ${isProfileOpen ? 'text-[#9E1817]' : 'text-gray-800 group-hover:text-[#9E1817]'}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className={`text-sm font-bold transition-colors ${isProfileOpen ? 'text-[#9E1817]' : 'text-black group-hover:text-[#9E1817]'}`}>
              Admin
            </span>
          </button>

          {/* Vertical Dropdown Menu */}
          {isProfileOpen && (
            <>
              <div className="fixed inset-0 z-[-1]" onClick={() => setIsProfileOpen(false)}></div>
              
              <div className="absolute right-0 mt-6 w-48 bg-white shadow-2xl border border-gray-100 rounded-sm py-8 z-[110] animate-in fade-in zoom-in duration-150">
                <div className="flex flex-col items-center text-center space-y-6">
                  
                  <div className="flex flex-col items-center gap-1 mb-2">
                    <svg xmlns="http://www.w3.org/2000/00/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Admin</span>
                  </div>

                  {/* Disabled Profile Link */}
                  <span className="text-sm text-gray-300 cursor-not-allowed">
                    Manage Profile
                  </span>

                  {/* ACTIVE LINK: Manage Archive */}
                  <Link 
                    href="/manage" 
                    onClick={() => setIsProfileOpen(false)}
                    className={`text-sm hover:text-[#9E1817] transition-colors ${pathname === '/manage' ? 'text-[#9E1817] font-bold' : 'text-black'}`}
                  >
                    Manage Archive
                  </Link>

                  {/* Disabled Settings Link */}
                  <span className="text-sm text-gray-300 cursor-not-allowed">
                    Settings
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}