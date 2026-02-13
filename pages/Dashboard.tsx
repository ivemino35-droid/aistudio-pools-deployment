
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_USER, MOCK_POOLS } from '../constants';
import PoolCard from '../components/PoolCard';
import { requestUbuntuAdvance } from '../services/api';
import { getUbuntuWisdom, AiResponse } from '../services/ai';
import LiveSupport from '../components/LiveSupport';
import { useCurrency } from '../contexts/CurrencyContext';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, Radar as RadarComponent, ResponsiveContainer } from 'recharts';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currency, setCurrency, formatValue } = useCurrency();
  const [showInsights, setShowInsights] = useState(false);
  const [isLiveSupportOpen, setIsLiveSupportOpen] = useState(false);
  const [wisdom, setWisdom] = useState<AiResponse | null>(null);
  const [isWisdomLoading, setIsWisdomLoading] = useState(true);
  
  const [isAdvanceModalOpen, setIsAdvanceModalOpen] = useState(false);
  const [advanceStatus, setAdvanceStatus] = useState<{ loading: boolean; message: string | null; success?: boolean; amount?: number }>({ loading: false, message: null });

  useEffect(() => {
    const loadWisdom = async () => {
      setIsWisdomLoading(true);
      const res = await getUbuntuWisdom(MOCK_USER.trustScore, MOCK_USER.name);
      setWisdom(res);
      setIsWisdomLoading(false);
    };
    loadWisdom();
  }, []);

  const handleRequestAdvance = async () => {
    if (!MOCK_USER.isVerified) {
      setAdvanceStatus({ loading: false, message: "FICA ID Verification Required. Identity protection is the foundation of community trust.", success: false });
      setIsAdvanceModalOpen(true);
      return;
    }
    
    setIsAdvanceModalOpen(true);
    setAdvanceStatus({ loading: true, message: "Analyzing Trust DNA, Payout History & Pool Reserve..." });
    
    const pool = MOCK_POOLS[0];
    const totalPotentialPayout = pool.contributionAmount * pool.totalMembers;

    const result = await requestUbuntuAdvance(
      MOCK_USER.id, 
      pool.id, 
      totalPotentialPayout,
      MOCK_USER.trustScore.score,
      MOCK_USER.managedEnabled
    );
    
    setAdvanceStatus({ 
      loading: false, 
      message: result.message, 
      success: result.success,
      amount: result.eligibleAmount
    });
  };

  const radarData = [
    { subject: 'Velocity', A: MOCK_USER.trustScore.metrics.contributionVelocity, fullMark: 100 },
    { subject: 'Vouching', A: MOCK_USER.trustScore.metrics.communityVouching, fullMark: 100 },
    { subject: 'Governance', A: MOCK_USER.trustScore.metrics.governanceParticipation, fullMark: 100 },
    { subject: 'Altruism', A: MOCK_USER.trustScore.metrics.altruismFactor, fullMark: 100 },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pb-20">
      <LiveSupport isOpen={isLiveSupportOpen} onClose={() => setIsLiveSupportOpen(false)} />

      {/* Community Pulse Ticker */}
      <div className="w-full bg-[#8CA082]/5 border-y border-[#8CA082]/10 py-2 overflow-hidden flex whitespace-nowrap gap-12 group cursor-default -mt-4 mb-4">
        <div className="flex animate-marquee group-hover:pause gap-12 text-[10px] font-black uppercase tracking-widest text-[#8CA082]">
          <span>● Diaspora Link: 12 Active Remittances from London</span>
          <span>● Trust Event: Thabo vouched for Zanele T. (+5 pts)</span>
          <span>● Circle Milestone: Johannesburg Elite reached R 30,000 vault</span>
          <span>● Payout Alert: Sipho K. rotation sequence initialized</span>
          <span>● Global Ubuntu: 1,422 Kinsmen online</span>
        </div>
        <div className="flex animate-marquee group-hover:pause gap-12 text-[10px] font-black uppercase tracking-widest text-[#8CA082]" aria-hidden="true">
          <span>● Diaspora Link: 12 Active Remittances from London</span>
          <span>● Trust Event: Thabo vouched for Zanele T. (+5 pts)</span>
          <span>● Circle Milestone: Johannesburg Elite reached R 30,000 vault</span>
          <span>● Payout Alert: Sipho K. rotation sequence initialized</span>
          <span>● Global Ubuntu: 1,422 Kinsmen online</span>
        </div>
      </div>

      {/* Advance Modal */}
      {isAdvanceModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-[#2D302E]/60 backdrop-blur-md" onClick={() => !advanceStatus.loading && setIsAdvanceModalOpen(false)} />
          <div className="bg-white dark:bg-[#252826] w-full max-w-lg rounded-[60px] p-12 relative z-10 shadow-2xl border-2 border-[#F1F0EE] dark:border-[#3A3D3B] animate-in zoom-in-95 duration-300">
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-4xl font-black text-[#2D302E] dark:text-[#FDFCFB] tracking-tighter uppercase italic leading-none">Ubuntu Advance</h3>
                  <button onClick={() => setIsAdvanceModalOpen(false)} className="text-[#9EA39F] hover:text-[#2D302E]"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/></svg></button>
                </div>
                <p className="text-[10px] font-black uppercase text-[#8CA082] tracking-[0.2em]">Social Capital Draw-Down</p>
              </div>

              <div className={`p-8 rounded-[40px] border-2 flex flex-col items-center gap-6 min-h-[240px] justify-center text-center ${advanceStatus.loading ? 'bg-gray-50' : advanceStatus.success ? 'bg-[#8CA082]/10 border-[#8CA082]' : 'bg-[#B36A5E]/10 border-[#B36A5E]'}`}>
                {advanceStatus.loading ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-[#8CA082] border-t-transparent rounded-full animate-spin" />
                    <p className="text-[11px] font-black uppercase tracking-widest text-[#9EA39F] animate-pulse">Running Eligibility Handshake...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center text-white mx-auto ${advanceStatus.success ? 'bg-[#8CA082]' : 'bg-[#B36A5E]'}`}>
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={advanceStatus.success ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
                      </svg>
                    </div>
                    <div className="space-y-2">
                       <p className="text-sm font-black text-[#2D302E] dark:text-[#FDFCFB] uppercase leading-tight px-4">{advanceStatus.message}</p>
                       {advanceStatus.success && advanceStatus.amount && (
                         <div className="pt-4 space-y-1">
                           <p className="text-[9px] font-black uppercase text-[#9EA39F]">Available early settlement</p>
                           <p className="text-5xl font-black text-[#8CA082] tracking-tighter italic leading-none">{formatValue(advanceStatus.amount)}</p>
                         </div>
                       )}
                    </div>
                  </div>
                )}
              </div>

              {!advanceStatus.loading && (
                <div className="flex gap-4">
                  {!advanceStatus.success && !MOCK_USER.isVerified ? (
                    <button onClick={() => navigate('/verify')} className="w-full bg-[#2D302E] dark:bg-[#FDFCFB] text-white dark:text-[#2D302E] py-6 rounded-[32px] text-[11px] font-black uppercase tracking-widest shadow-xl">Complete FICA</button>
                  ) : (
                    <>
                      <button onClick={() => setIsAdvanceModalOpen(false)} className="flex-1 py-6 rounded-[32px] text-[11px] font-black uppercase tracking-widest text-[#9EA39F] hover:bg-[#F9F9F8] transition-all">Cancel</button>
                      {advanceStatus.success && (
                        <button className="flex-[2] bg-[#2D302E] dark:bg-[#FDFCFB] text-white dark:text-[#2D302E] py-6 rounded-[32px] text-[11px] font-black uppercase tracking-widest shadow-xl hover:bg-[#8CA082] transition-all">Execute Advance</button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header & Currency Toggle */}
      <section className="space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-8xl font-black text-[#2D302E] dark:text-[#FDFCFB] tracking-tighter uppercase leading-[0.8]">
              Sawubona, <br /> <span className="text-[#8CA082]">{MOCK_USER.name}</span>
            </h1>
            <div className="flex flex-col gap-2">
              <p className="text-lg font-black text-[#D4AF37] uppercase tracking-[0.2em] italic">I am because we are.</p>
              
              {/* Wisdom Section with Skeletons & Grounding */}
              <div className="space-y-3 min-h-[80px]">
                {isWisdomLoading ? (
                  <div className="space-y-2 max-w-lg">
                    <div className="h-4 w-full skeleton animate-shimmer rounded-full" />
                    <div className="h-4 w-3/4 skeleton animate-shimmer rounded-full" />
                  </div>
                ) : (
                  <div className="space-y-3 bg-white/50 dark:bg-black/20 p-5 rounded-[32px] border border-white/20 backdrop-blur-sm max-w-xl group">
                    <p className="text-xs italic text-[#6B706C] dark:text-[#9EA39F] leading-relaxed">"{wisdom?.text}"</p>
                    
                    {wisdom?.sources && wisdom.sources.length > 0 && (
                      <div className="pt-2 border-t border-[#8CA082]/10 flex flex-wrap gap-3">
                        <span className="text-[8px] font-black text-[#8CA082] uppercase tracking-widest">Truth Anchors:</span>
                        {wisdom.sources.map((source, i) => (
                          <a 
                            key={i} 
                            href={source.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[8px] font-bold text-[#9EA39F] hover:text-[#8CA082] underline transition-colors"
                          >
                            {source.title}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-6">
             {/* Diaspora Currency Switcher */}
             <div className="flex bg-[#F9F9F8] dark:bg-[#252826] p-1.5 rounded-2xl border border-[#F1F0EE] dark:border-[#3A3D3B] shadow-sm">
                {(['ZAR', 'USD', 'GBP', 'EUR'] as const).map((c) => (
                  <button 
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${currency === c ? 'bg-[#2D302E] dark:bg-[#FDFCFB] text-white dark:text-[#2D302E] shadow-xl scale-105' : 'text-[#9EA39F] hover:text-[#2D302E]'}`}
                  >
                    {c}
                  </button>
                ))}
             </div>

             <div className="flex gap-4">
                <div className="hidden lg:flex bg-[#8CA082]/10 border border-[#8CA082]/20 px-8 py-5 rounded-[40px] items-center gap-5 shadow-sm">
                  <div className="w-10 h-10 bg-[#8CA082] rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase text-[#8CA082] tracking-widest">Shield Secured</p>
                    <p className="text-sm font-black text-[#2D302E] dark:text-[#FDFCFB] tabular-nums">{formatValue(MOCK_USER.rainyDayBalance)}</p>
                  </div>
                </div>

                <button onClick={() => setShowInsights(!showInsights)} className="bg-white dark:bg-[#252826] border border-[#D4AF37]/30 px-10 py-6 rounded-[48px] flex items-center gap-8 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all group">
                    <div className="space-y-1 text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">Ubuntu DNA</p>
                      <p className="text-4xl font-black text-[#2D302E] dark:text-[#FDFCFB] italic tabular-nums">{MOCK_USER.trustScore.score}</p>
                    </div>
                    <div className="w-16 h-16 bg-[#D4AF37] rounded-[24px] flex items-center justify-center text-white font-black text-2xl shadow-xl group-hover:rotate-12 transition-transform relative overflow-hidden">
                       <div className="absolute inset-0 bg-white/20 animate-pulse" />
                       <span className="relative z-10 italic">U</span>
                    </div>
                </button>
             </div>
          </div>
        </div>

        {showInsights && (
          <div className="animate-in slide-in-from-top-4 duration-500 bg-white dark:bg-[#252826] border-2 border-[#D4AF37]/20 p-12 rounded-[60px] shadow-2xl grid grid-cols-1 lg:grid-cols-3 gap-12 relative overflow-hidden">
            <div className="lg:col-span-1 space-y-8">
              <h3 className="text-2xl font-black text-[#2D302E] dark:text-[#FDFCFB] tracking-tighter uppercase italic">Reputation Spectrum</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke={document.documentElement.classList.contains('dark') ? '#3A3D3B' : '#F1F0EE'} />
                    <PolarAngleAxis dataKey="subject" tick={{fill: '#9EA39F', fontSize: 10, fontWeight: 900}} />
                    <RadarComponent name="User" dataKey="A" stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="lg:col-span-2 space-y-10">
              <h3 className="text-2xl font-black text-[#2D302E] dark:text-[#FDFCFB] tracking-tighter uppercase italic">Collective Privileges</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[#F9F9F8] dark:bg-[#1A1C1B] p-10 rounded-[48px] space-y-4 border border-[#F1F0EE] dark:border-[#3A3D3B] hover:border-[#8CA082] transition-colors group">
                  <div className="w-12 h-12 bg-[#8CA082]/10 rounded-2xl flex items-center justify-center text-[#8CA082] group-hover:bg-[#8CA082] group-hover:text-white transition-all">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6" /></svg>
                  </div>
                  <h4 className="text-[10px] font-black text-[#8CA082] uppercase tracking-[0.3em]">Retailer Value</h4>
                  <p className="text-lg font-black text-[#2D302E] dark:text-[#FDFCFB] leading-tight">Lay-by 2.0 Priority Access Eligible</p>
                </div>
                <div className="bg-[#F9F9F8] dark:bg-[#1A1C1B] p-10 rounded-[48px] space-y-4 border border-[#F1F0EE] dark:border-[#3A3D3B] hover:border-[#D4AF37] transition-colors group">
                  <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-white transition-all">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <h4 className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.3em]">Financial Freedom</h4>
                  <p className="text-lg font-black text-[#2D302E] dark:text-[#FDFCFB] leading-tight">Diaspora Unsecured Credit Lines</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#2D302E] text-white p-12 rounded-[56px] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 mb-6">Collective Savings</p>
            <h3 className="text-5xl font-black italic tracking-tighter tabular-nums">{formatValue(MOCK_USER.totalSavings)}</h3>
            <div className="mt-8 flex items-center gap-3 text-[#8CA082]">
              <div className="w-2 h-2 bg-[#8CA082] rounded-full animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest italic opacity-60">Verified On-Chain</span>
            </div>
          </div>
          <div className="bg-white dark:bg-[#252826] border-2 border-[#F1F0EE] dark:border-[#3A3D3B] p-12 rounded-[56px] shadow-sm hover:shadow-xl transition-all group">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#9EA39F] mb-6">Upcoming Payout</p>
            <h3 className="text-5xl font-black text-[#2D302E] dark:text-[#FDFCFB] italic tracking-tighter tabular-nums">{formatValue(15000)}</h3>
            <p className="mt-8 text-[10px] font-black uppercase tracking-widest text-[#9EA39F]">Expected: Oct 25, 2025</p>
          </div>
          <div className="bg-[#8CA082]/10 border-2 border-[#8CA082]/20 p-12 rounded-[56px] shadow-sm relative overflow-hidden">
            <div className="absolute bottom-0 right-0 opacity-10 -mr-8 -mb-8">
               <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8CA082] mb-6">Remittance Corridor</p>
            <h3 className="text-5xl font-black text-[#8CA082] italic tracking-tighter">Active</h3>
            <p className="mt-8 text-[10px] font-black uppercase tracking-widest text-[#8CA082]">ZAR/USD Rate: 18.42</p>
          </div>
        </div>
      </section>

      {/* Pools Section */}
      <section className="space-y-12">
        <div className="flex justify-between items-end border-b-2 border-[#F1F0EE] dark:border-[#3A3D3B] pb-8 px-4">
          <div className="space-y-2">
            <h2 className="text-xs font-black uppercase tracking-[0.5em] text-[#2D302E] dark:text-[#FDFCFB]">My Active Circles</h2>
            <p className="text-[9px] font-bold text-[#9EA39F] uppercase tracking-widest">Collaborative wealth generation units</p>
          </div>
          <button 
            onClick={() => navigate('/create-pool')}
            className="text-[10px] font-black uppercase tracking-[0.3em] bg-[#2D302E] dark:bg-[#FDFCFB] text-white dark:text-[#2D302E] px-8 py-4 rounded-2xl hover:bg-[#8CA082] transition-all"
          >
            Plant New Seed
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {MOCK_POOLS.map(pool => (
            <PoolCard key={pool.id} pool={pool} onClick={(id) => navigate(`/pool/${id}`)} onContribute={(id) => navigate(`/contribute/${id}`)} />
          ))}
        </div>
      </section>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .pause {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
