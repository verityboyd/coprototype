"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function SiteHeader() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-gray-100 relative z-[100]">
      <div className="max-w-7xl mx-auto px-10 h-24 flex justify-between items-center">
        
        {/* 1. Logo Section - Scaled down (110px) with baseline text */}
        <Link href="/search">
          <div className="flex items-center gap-2 cursor-pointer group">
            <Image
              src="/assets/logo.png"
              alt="Calgary Opera"
              width={110} 
              height={32}
              priority
              className="object-contain"
            />
            <span className="text-[18px] font-bold tracking-tighter text-black leading-none transform translate-y-[1px]">
              ARCHIVE
            </span>
          </div>
        </Link>

        {/* 2. Center Navigation - Fixed Highlighting Logic */}
        <div className="flex gap-12 text-[12px] font-bold tracking-[0.2em] items-center">
          <Link 
            href="/search" 
            className={`transition-colors duration-200 hover:text-black ${
              pathname === '/search' 
                ? 'text-[#9E1817]' 
                : 'text-[#A0AEC0]' 
            }`}
          >
            SEARCH
          </Link>
          
          <span className="text-[#CBD5E0] cursor-not-allowed">
            DASHBOARD
          </span>
          
          <span className="text-[#CBD5E0] cursor-not-allowed">
            REPORTS
          </span>
        </div>

        {/* 3. Profile & Admin Pill */}
        <div className="flex items-center gap-6">
          {/* Static Admin Pill */}
          <div className="bg-black text-white px-8 py-2 rounded-full text-[11px] font-bold tracking-widest uppercase cursor-default">
            Admin
          </div>

          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 group focus:outline-none"
            >
              {/* Figma Circle Avatar Icon */}
              <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="19" stroke="black" strokeWidth="2"/>
                <circle cx="20" cy="15" r="6" stroke="black" strokeWidth="2"/>
                <path d="M10 32C10 26.4772 14.4772 22 20 22C25.5228 22 30 26.4772 30 32" stroke="black" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              
              <span className={`text-[13px] font-bold transition-colors ${isProfileOpen ? 'text-[#9E1817]' : 'text-black group-hover:text-[#9E1817]'}`}>
                Admin
              </span>
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <>
                <div className="fixed inset-0 z-[-1]" onClick={() => setIsProfileOpen(false)}></div>
                <div className="absolute right-0 mt-6 w-48 bg-white shadow-2xl border border-gray-100 rounded-sm py-8 z-[110] animate-in fade-in zoom-in duration-150">
                  <div className="flex flex-col items-center text-center space-y-6">
                    <Link 
                      href="/manage" 
                      onClick={() => setIsProfileOpen(false)} 
                      className={`text-sm font-bold transition-colors ${pathname === '/manage' ? 'text-[#9E1817]' : 'text-black hover:text-[#9E1817]'}`}
                    >
                      Manage Archive
                    </Link>
                    <span className="text-sm text-gray-300 cursor-not-allowed">Manage Profile</span>
                    <span className="text-sm text-gray-300 cursor-not-allowed">Settings</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}