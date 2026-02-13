
import React from 'react';

interface ShieldToggleProps {
  contributionAmount: number;
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

const UbuntuShieldToggle: React.FC<ShieldToggleProps> = ({ 
  contributionAmount, 
  isEnabled, 
  onToggle 
}) => {
  const shieldAmount = (contributionAmount * 0.05);
  const totalAmount = contributionAmount + shieldAmount;

  return (
    <div className={`p-8 rounded-[40px] border-2 transition-all duration-500 cursor-pointer ${
      isEnabled 
        ? 'bg-[#8CA082]/10 border-[#8CA082] shadow-xl' 
        : 'bg-white dark:bg-[#252826] border-[#F1F0EE] dark:border-[#3A3D3B] grayscale opacity-60'
    }`}
    onClick={() => onToggle(!isEnabled)}
    >
      <div className="flex items-start gap-6">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${isEnabled ? 'bg-[#8CA082] text-white' : 'bg-[#F9F9F8] dark:bg-[#1A1C1B] text-[#9EA39F]'}`}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div className="flex-1 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black text-[#2D302E] dark:text-[#FDFCFB] uppercase tracking-tighter">Ubuntu Shield</h3>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isEnabled ? 'border-[#8CA082] bg-[#8CA082]' : 'border-[#F1F0EE]'}`}>
              {isEnabled && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
            </div>
          </div>
          
          <p className="text-xs text-[#6B706C] dark:text-[#9EA39F] leading-relaxed font-medium italic">
            "We've got your back." Build a 5% safety buffer. If you ever miss a payment, your Shield automatically covers it—protecting your Ubuntu Score.
          </p>

          <div className="grid grid-cols-2 gap-4">
             <div className="bg-[#F9F9F8] dark:bg-[#1A1C1B] p-4 rounded-2xl">
                <p className="text-[9px] font-black text-[#9EA39F] uppercase mb-1">Protection Cost</p>
                <p className="text-lg font-black text-[#8CA082] leading-none">R {shieldAmount.toFixed(0)}</p>
             </div>
             <div className="bg-[#F9F9F8] dark:bg-[#1A1C1B] p-4 rounded-2xl">
                <p className="text-[9px] font-black text-[#9EA39F] uppercase mb-1">New Total</p>
                <p className="text-lg font-black text-[#2D302E] dark:text-[#FDFCFB] leading-none">R {totalAmount.toFixed(0)}</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UbuntuShieldToggle;
