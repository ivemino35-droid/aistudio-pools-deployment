
import React from 'react';
import { Pool, PoolStatus, PoolType } from '../types';
import { useCurrency } from '../contexts/CurrencyContext';

interface PoolCardProps {
  pool: Pool;
  onClick: (id: string) => void;
  onContribute: (id: string) => void;
}

const PoolCard: React.FC<PoolCardProps> = ({ pool, onClick, onContribute }) => {
  const { formatValue } = useCurrency();
  const isHealthy = pool.status === PoolStatus.HEALTHY;
  const isWarning = pool.status === PoolStatus.WARNING;

  const getTierIcon = () => {
    switch (pool.type) {
      case PoolType.FAMILY_RESERVE: return 'Generational';
      case PoolType.SME_WHOLESALE: return 'Operational';
      case PoolType.CROWD_ASSET: return 'Asset-Buy';
      default: return 'Savings';
    }
  };

  const getProgressPercentage = () => {
    if (pool.type === PoolType.CROWD_ASSET && pool.targetAsset) {
      return (pool.targetAsset.currentProgress / pool.targetAsset.targetPrice) * 100;
    }
    return 85; // Default for rotation
  };

  return (
    <div className="bg-white dark:bg-[#252826] rounded-[40px] border-2 border-[#F1F0EE] dark:border-[#3A3D3B] flex flex-col hover:border-[#8CA082] transition-all duration-500 group overflow-hidden shadow-sm hover:shadow-xl">
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-[#2D302E] dark:text-[#FDFCFB] leading-tight tracking-tight">{pool.name}</h3>
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-black bg-[#8CA082]/10 text-[#8CA082] px-2 py-0.5 rounded-full uppercase tracking-widest">{getTierIcon()}</span>
              <p className="text-[10px] font-bold text-[#9EA39F] uppercase tracking-[0.2em]">{pool.type}</p>
            </div>
          </div>
          <div className={`w-3 h-3 rounded-full animate-pulse ${
            isHealthy ? 'bg-[#5C7A67]' : isWarning ? 'bg-[#D4AF37]' : 'bg-[#B36A5E]'
          }`} />
        </div>

        {pool.targetAsset && (
          <div className="bg-[#F9F9F8] dark:bg-[#1A1C1B] p-4 rounded-3xl border border-[#F1F0EE] dark:border-[#3A3D3B] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
               <img src={pool.targetAsset.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="Asset" />
            </div>
            <div>
               <p className="text-[8px] font-black text-[#9EA39F] uppercase">Collective Target</p>
               <p className="text-xs font-black text-[#2D302E] dark:text-[#FDFCFB]">{pool.targetAsset.name}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#F9F9F8] dark:bg-[#1A1C1B] p-4 rounded-3xl">
            <p className="text-[9px] font-black text-[#9EA39F] uppercase mb-1">Monthly</p>
            <p className="text-lg font-black text-[#2D302E] dark:text-[#FDFCFB]">{formatValue(pool.contributionAmount)}</p>
          </div>
          <div className="bg-[#F9F9F8] dark:bg-[#1A1C1B] p-4 rounded-3xl">
            <p className="text-[9px] font-black text-[#9EA39F] uppercase mb-1">Next Payout</p>
            <p className="text-lg font-black text-[#8CA082]">{pool.nextDueDate}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-[10px] font-bold uppercase text-[#9EA39F]">
            <span>{pool.type === PoolType.CROWD_ASSET ? 'Funding Goal' : 'Community Strength'}</span>
            <span className="text-[#2D302E] dark:text-[#FDFCFB]">{pool.type === PoolType.CROWD_ASSET ? `${Math.round(getProgressPercentage())}%` : `${pool.totalMembers} Members`}</span>
          </div>
          <div className="h-2 bg-[#F1F0EE] dark:bg-[#3A3D3B] rounded-full overflow-hidden">
            <div className="h-full bg-[#8CA082] transition-all duration-1000" style={{ width: `${getProgressPercentage()}%` }} />
          </div>
        </div>

        <div className="pt-4 flex gap-3">
          <button 
            onClick={() => onContribute(pool.id)}
            className="flex-grow bg-[#2D302E] dark:bg-[#FDFCFB] text-white dark:text-[#2D302E] py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#8CA082] dark:hover:bg-[#8CA082] dark:hover:text-white transition-all shadow-lg shadow-[#2D302E]/10"
          >
            Contribute
          </button>
          <button 
            onClick={() => onClick(pool.id)}
            className="w-12 h-12 flex items-center justify-center border-2 border-[#F1F0EE] dark:border-[#3A3D3B] rounded-2xl hover:bg-[#F9F9F8] dark:hover:bg-[#3A3D3B] transition-all"
          >
            <svg className="w-5 h-5 text-[#2D302E] dark:text-[#FDFCFB]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PoolCard;
