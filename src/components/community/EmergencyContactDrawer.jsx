import React, { useState } from 'react';
import { PhoneCall, ShieldAlert, X, Radio, LifeBuoy } from 'lucide-react';

export default function EmergencyContactDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  const contacts = [
    { title: 'State Disaster Helpline', number: '1070', desc: 'Tamil Nadu Emergency Control Room' },
    { title: 'Indian Coast Guard SAR', number: '1554', desc: 'Maritime Search & Rescue Hotline' },
    { title: 'Marine Police Emergency', number: '1093', desc: 'Coastal Security Police Patrol' },
    { title: 'Chennai Harbor Master', number: '044-25361301', desc: 'Port Vessel Traffic Management' },
  ];

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 font-bold px-4 py-3 rounded-2xl transition-all flex items-center justify-between text-xs active:scale-[0.99] shadow-lg"
      >
        <div className="flex items-center gap-2">
          <LifeBuoy className="h-4 w-4 text-red-400 animate-pulse" />
          <span>Emergency Helplines & SOS Contacts</span>
        </div>
        <span className="bg-red-500/30 text-red-200 text-[10px] font-black px-2 py-0.5 rounded-full border border-red-500/40 uppercase">
          1-Tap SOS
        </span>
      </button>

      {/* Emergency Drawer / Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-5 space-y-4 shadow-2xl animate-slideUp">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-red-500" />
                <h3 className="text-base font-bold text-white tracking-tight">Coastal Emergency Helplines</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl flex items-center gap-2 text-xs text-red-300">
              <Radio className="h-4 w-4 text-red-400 shrink-0 animate-pulse" />
              <span>In case of distress at sea, call Coast Guard Search & Rescue immediately.</span>
            </div>

            <div className="space-y-2">
              {contacts.map((c, idx) => (
                <a
                  key={idx}
                  href={`tel:${c.number.replace(/-/g, '')}`}
                  className="bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-red-500/40 p-3 rounded-2xl flex items-center justify-between transition-all group"
                >
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-red-400 transition-colors">{c.title}</h4>
                    <p className="text-[10px] text-slate-400">{c.desc}</p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-red-600 text-white font-extrabold text-xs px-3 py-1.5 rounded-xl shrink-0 shadow-md">
                    <PhoneCall className="h-3.5 w-3.5" />
                    <span>{c.number}</span>
                  </div>
                </a>
              ))}
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 rounded-xl text-xs transition-all"
            >
              Close Emergency Directory
            </button>
          </div>
        </div>
      )}
    </>
  );
}
