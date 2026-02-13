
import React from 'react';

interface ManagedAccountProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  monthlyFee?: number;
}

const ManagedAccountToggle: React.FC<ManagedAccountProps> = ({ 
  isEnabled, 
  onToggle,
  monthlyFee = 50
}) => {
  return (
    <div className={`p-8 rounded-[40px] border-2 transition-all duration-500 cursor-pointer ${
      isEnabled 
        ? 'bg-[#D4AF37]/10 border-[#D4AF37] shadow-xl' 
        : 'bg-white dark:bg-[#252826] border-[#F1F0EE] dark:border-[#3A3D3B] grayscale opacity-60'
    }`}
    onClick={() => onToggle(!isEnabled)}
    >
      <div className="flex items-start gap-6">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${isEnabled ? 'bg-[#D4AF37] text-white' : 'bg-[#F9F9F8] dark:bg-[#1A1C1B] text-[#9EA39F]'}`}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className="flex-1 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-black text-[#2D302E] dark:text-[#FDFCFB] uppercase tracking-tighter">Managed Admin</h3>
              <span className="text-[8px] font-black bg-[#D4AF37] text-white px-2 py-0.5 rounded-full uppercase tracking-widest">Premium</span>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isEnabled ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-[#F1F0EE]'}`}>
              {isEnabled && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
            </div>
          </div>
          
          <p className="text-xs text-[#6B706C] dark:text-[#9EA39F] leading-relaxed font-medium italic">
            Let us handle the details. Automated collections, priority WhatsApp alerts, and access to penalty-free advances on your future payouts.
          </p>

          <div className="flex items-center justify-between bg-[#F9F9F8] dark:bg-[#1A1C1B] p-4 rounded-2xl">
             <p className="text-[10px] font-black text-[#9EA39F] uppercase tracking-widest">Monthly Service Fee</p>
             <p className="text-lg font-black text-[#D4AF37]">R {monthlyFee}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagedAccountToggle;
