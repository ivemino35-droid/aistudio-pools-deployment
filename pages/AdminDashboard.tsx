
import React, { useState } from 'react';
import { MOCK_MEMBERS, MOCK_POOLS } from '../constants';
import { MemberTier, Pool, AdvanceRequest } from '../types';
import { generateWholesaleProposal, generateMediationAdvice, AiResponse } from '../services/ai';

const MOCK_ADVANCES: AdvanceRequest[] = [
  { id: 'adv-1', userId: 'm1', userName: 'Lindiwe M.', poolId: 'p1', amount: 15000, status: 'Pending', tier: 'Tier 1 (Exceptional)', requestedAt: '2025-10-10' },
  { id: 'adv-2', userId: 'm2', userName: 'Sipho K.', poolId: 'p1', amount: 5000, status: 'Approved', tier: 'Tier 2 (Good)', requestedAt: '2025-10-11' }
];

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedPoolId, setSelectedPoolId] = useState(MOCK_POOLS[0].id);
  const [proposalPartner, setProposalPartner] = useState('');
  const [proposalOutput, setProposalOutput] = useState<AiResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Mediation state
  const [isMediating, setIsMediating] = useState(false);
  const [mediationAdvice, setMediationAdvice] = useState<AiResponse | null>(null);
  const [isSent, setIsSent] = useState(false);

  const selectedPool = MOCK_POOLS.find(p => p.id === selectedPoolId) || MOCK_POOLS[0];

  const handleGenerateProposal = async () => {
    if (!proposalPartner || !selectedPool) return;
    setIsGenerating(true);
    const result = await generateWholesaleProposal(selectedPool.name, selectedPool.totalPoolValue, selectedPool.totalMembers, proposalPartner);
    setProposalOutput(result);
    setIsGenerating(false);
  };

  const handleMediate = async (name: string, daysLate: number, amount: number) => {
    setIsMediating(true);
    setIsSent(false);
    const result = await generateMediationAdvice(name, daysLate, amount);
    setMediationAdvice(result);
    setIsMediating(false);
  };

  const handleSendNudge = () => {
    setIsSent(true);
    setTimeout(() => {
        setMediationAdvice(null);
        setIsSent(false);
    }, 2000);
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-1000 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <h1 className="text-6xl lg:text-7xl font-black text-[#2D302E] dark:text-[#FDFCFB] tracking-tighter uppercase leading-[0.85]">
            Admin <br /> <span className="text-[#D6CFC7] dark:text-[#6B706C]">Console</span>
          </h1>
          <p className="text-lg font-medium text-[#6B706C] dark:text-[#9EA39F] max-w-sm tracking-tight leading-relaxed">
            Advanced governance for community and business circles.
          </p>
        </div>
      </div>

      <div className="flex gap-12 border-b border-[#F1F0EE] dark:border-[#3A3D3B] overflow-x-auto no-scrollbar scroll-smooth">
        {['Overview', 'Partnerships', 'Advances', 'Violations', 'Deployment'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-6 text-[11px] font-black uppercase tracking-[0.3em] whitespace-nowrap border-b-2 transition-all ${
              activeTab === tab 
                ? 'border-[#8CA082] text-[#2D302E] dark:text-[#FDFCFB]' 
                : 'border-transparent text-[#9EA39F] dark:text-[#6B706C] hover:text-[#2D302E]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Total Pool Funds', value: 'R 56,700', trend: '+12.5%' },
            { label: 'Platform Fees', value: 'R 3,200', trend: '+5.2%' },
            { label: 'Active Circles', value: '8', trend: 'Stable' },
            { label: 'Late Commitments', value: '4', trend: '-2.1%' }
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-[#252826] p-10 rounded-[40px] border border-[#F1F0EE] dark:border-[#3A3D3B]">
              <p className="text-[10px] font-black text-[#9EA39F] uppercase mb-4">{stat.label}</p>
              <div className="flex items-end justify-between">
                <h3 className="text-3xl font-black text-[#2D302E] dark:text-[#FDFCFB] italic">{stat.value}</h3>
                <span className="text-[10px] font-black text-[#7C9082] bg-[#FDFCFB] dark:bg-[#1A1C1B] px-3 py-1.5 rounded-full">{stat.trend}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Advances' && (
        <div className="space-y-12 animate-in slide-in-from-bottom-4">
           <div className="bg-white dark:bg-[#252826] p-12 rounded-[60px] border border-[#F1F0EE] dark:border-[#3A3D3B] space-y-10">
              <h3 className="text-2xl font-black uppercase tracking-tighter italic leading-none">Managed Advances Dashboard</h3>
              <div className="space-y-6">
                {MOCK_ADVANCES.map((adv) => (
                  <div key={adv.id} className="bg-[#F9F9F8] dark:bg-[#1A1C1B] p-8 rounded-[32px] border border-[#F1F0EE] dark:border-[#3A3D3B] flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex gap-6 items-center">
                       <div className="w-12 h-12 bg-[#8CA082] rounded-2xl flex items-center justify-center text-white font-black shadow-lg">{adv.userName.charAt(0)}</div>
                       <div>
                         <p className="text-sm font-black dark:text-white uppercase leading-none mb-1">{adv.userName}</p>
                         <p className="text-[10px] font-bold text-[#8CA082] uppercase tracking-widest">{adv.tier} • R {adv.amount.toLocaleString()}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex-1 text-center ${
                        adv.status === 'Approved' ? 'bg-[#8CA082]/10 text-[#8CA082]' : 'bg-[#D4AF37]/10 text-[#D4AF37]'
                      }`}>
                        {adv.status}
                      </span>
                      <button className="bg-[#2D302E] dark:bg-[#FDFCFB] text-white dark:text-[#2D302E] px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#8CA082] transition-all flex-1">
                        Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </div>
      )}

      {activeTab === 'Violations' && (
        <div className="space-y-12 animate-in slide-in-from-bottom-4">
          <div className="bg-white dark:bg-[#252826] p-12 rounded-[60px] border border-[#F1F0EE] dark:border-[#3A3D3B] space-y-10">
            <h3 className="text-2xl font-black uppercase tracking-tighter italic leading-none">Late Payment Mediation</h3>
            <div className="space-y-6">
              {[
                { name: 'Zanele T.', amount: 2500, days: 3 },
                { name: 'Sipho K.', amount: 1200, days: 1 }
              ].map((v, i) => (
                <div key={i} className="flex flex-col md:flex-row items-center justify-between p-8 bg-[#F9F9F8] dark:bg-[#1A1C1B] rounded-[32px] gap-6">
                  <div className="flex gap-6 items-center">
                    <div className="w-12 h-12 bg-[#B36A5E] rounded-2xl flex items-center justify-center text-white font-black shadow-lg">{v.name.charAt(0)}</div>
                    <div>
                      <p className="text-sm font-black dark:text-white uppercase leading-none mb-1">{v.name}</p>
                      <p className="text-[10px] font-bold text-[#B36A5E] uppercase tracking-widest">{v.days} Days Overdue • R {v.amount}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleMediate(v.name, v.days, v.amount)}
                    className="bg-[#2D302E] dark:bg-[#FDFCFB] text-white dark:text-[#2D302E] px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#8CA082] transition-all w-full md:w-auto"
                  >
                    Draft Mediation
                  </button>
                </div>
              ))}
            </div>
          </div>

          {mediationAdvice && (
            <div className={`p-12 rounded-[60px] border-2 space-y-6 animate-in zoom-in-95 transition-all ${isSent ? 'bg-[#8CA082]/10 border-[#8CA082]' : 'bg-[#E6D5C3]/20 border-[#D4AF37]'}`}>
              <div className="flex justify-between items-center pb-4 border-b border-[#2D302E]/10">
                <h4 className="text-[10px] font-black uppercase text-[#8CA082] tracking-widest">Nudge of Restoration</h4>
                <button onClick={() => setMediationAdvice(null)} className="text-[9px] font-black uppercase text-[#9EA39F]">Close</button>
              </div>
              <div className="text-sm font-medium italic leading-relaxed text-[#2D302E] dark:text-[#FDFCFB]">
                {isSent ? "Restoration nudge dispatched successfully via WhatsApp Business API." : mediationAdvice.text}
              </div>
              {!isSent && (
                <div className="flex flex-wrap gap-4">
                    <button 
                        onClick={handleSendNudge}
                        className="bg-[#8CA082] text-white px-8 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.038 3.284l-.569 2.1c-.149.546.455 1.033.947.717l1.848-.924c.764.251 1.623.401 2.512.401 3.182 0 5.768-2.586 5.768-5.766 0-3.181-2.586-5.768-5.776-5.778zm2.357 8.112c-.149.413-.749.774-1.028.801-.278.028-.546.046-1.541-.353-1.246-.5-2.047-1.748-2.109-1.83-.062-.083-.505-.672-.505-1.284s.32-.912.433-1.033c.114-.121.248-.151.33-.151.083 0 .165.001.238.005.072.004.17-.028.266.195.096.224.33.801.359.859.029.058.048.125.01.201-.039.076-.058.125-.116.193s-.125.158-.179.208c-.054.049-.111.103-.048.21.063.107.28.462.602.748.413.368.758.482.865.534.107.053.17.045.233-.028s.269-.313.341-.421c.072-.107.144-.089.243-.053.099.036.626.295.733.349s.179.083.205.128.026.259-.123.672z"/></svg>
                        Send WhatsApp Nudge
                    </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'Deployment' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-in slide-in-from-bottom-4">
           <div className="bg-white dark:bg-[#252826] p-12 rounded-[60px] border-2 border-[#8CA082]/20 space-y-8">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-none">Alpha Readiness</h3>
              <ul className="space-y-6">
                 {[
                   { label: 'Supabase Production', status: 'Live' },
                   { label: 'FX Exchange Handler', status: 'Active' },
                   { label: 'PayShap Webhooks', status: 'Listening' },
                   { label: 'Global Audit Trail', status: 'Active' }
                 ].map((item, idx) => (
                   <li key={idx} className="flex justify-between items-center border-b border-[#F1F0EE] dark:border-[#3A3D3B] pb-4">
                      <span className="text-xs font-bold text-[#6B706C] dark:text-[#9EA39F]">{item.label}</span>
                      <span className="text-[9px] font-black uppercase text-[#8CA082] bg-[#8CA082]/10 px-3 py-1 rounded-full">{item.status}</span>
                   </li>
                 ))}
              </ul>
           </div>
           <div className="bg-[#2D302E] p-12 rounded-[60px] space-y-8 text-white relative overflow-hidden group">
              <div className="relative z-10 space-y-6">
                <h3 className="text-4xl font-black italic uppercase tracking-tighter leading-[0.9]">Release to <br /> Community</h3>
                <p className="text-white/60 text-sm font-medium leading-relaxed">Transition from Alpha to Public Beta. All ledgers will be cryptographically locked.</p>
                <button className="w-full bg-[#8CA082] text-white py-6 rounded-[32px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-[#D4AF37] transition-all">
                  Go Live (V1.0)
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
