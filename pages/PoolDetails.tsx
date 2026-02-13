
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_POOLS, MOCK_MEMBERS, MOCK_CONTRIBUTIONS } from '../constants';
import { PoolStatus, PoolType } from '../types';
import { FAMILY_WEALTH_TEMPLATE, SME_BULK_BUYING_TEMPLATE } from '../constitutionTemplate';
import { useCurrency } from '../contexts/CurrencyContext';

const MetricBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-[#9EA39F]">
      <span>{label}</span>
      <span className="text-[#2D302E] dark:text-[#FDFCFB]">{value}%</span>
    </div>
    <div className="h-1.5 w-full bg-[#F1F0EE] dark:bg-[#3A3D3B] rounded-full overflow-hidden">
      <div 
        className="h-full transition-all duration-1000 ease-out" 
        style={{ width: `${value}%`, backgroundColor: color }} 
      />
    </div>
  </div>
);

const getStatusVisuals = (status: PoolStatus) => {
  switch (status) {
    case PoolStatus.HEALTHY:
      return {
        gradient: 'from-[#5C7A67] to-[#7C9082]',
        text: 'text-[#5C7A67]',
        lightBg: 'bg-[#5C7A67]/10',
        label: 'Healthy & Vibrant',
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )
      };
    case PoolStatus.WARNING:
      return {
        gradient: 'from-[#D4AF37] to-[#C2A878]',
        text: 'text-[#D4AF37]',
        lightBg: 'bg-[#D4AF37]/10',
        label: 'Attention Required',
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        )
      };
    case PoolStatus.CRITICAL:
      return {
        gradient: 'from-[#B36A5E] to-[#C07B5B]',
        text: 'text-[#B36A5E]',
        lightBg: 'bg-[#B36A5E]/10',
        label: 'Critical Intervention',
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      };
    default:
      return { gradient: 'from-gray-500 to-gray-400', text: 'text-gray-500', lightBg: 'bg-gray-100', label: 'Unknown', icon: null };
  }
};

const PoolDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { formatValue } = useCurrency();
  const pool = MOCK_POOLS.find(p => p.id === id) || MOCK_POOLS[0];
  const [activeTab, setActiveTab] = useState<'Ledger' | 'Members' | 'Rules' | 'Goal'>('Ledger');
  const [expandedMemberId, setExpandedMemberId] = useState<string | null>(null);
  
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteData, setInviteData] = useState({ name: '', email: '' });
  const [isInviting, setIsInviting] = useState(false);
  const [localMembers, setLocalMembers] = useState(MOCK_MEMBERS);

  const statusVisuals = getStatusVisuals(pool.status);
  const filteredContributions = MOCK_CONTRIBUTIONS; 

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteData.name || !inviteData.email) return;
    setIsInviting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const newMember = {
      id: `new-${Date.now()}`,
      name: inviteData.name,
      email: inviteData.email,
      tier: 'Bronze' as any,
      status: 'Pending' as any,
      penalties: 0,
      total: 0,
      ubuntuScore: 0,
      trustMetrics: { contributionVelocity: 0, communityVouching: 0, governanceParticipation: 0, altruismFactor: 0 }
    };
    setLocalMembers([newMember, ...localMembers]);
    setIsInviting(false);
    setIsInviteModalOpen(false);
    setInviteData({ name: '', email: '' });
  };

  const renderRules = () => {
    let clauses = [
      { id: '1', title: 'Rule 1: Contribution Integrity', content: 'All members must satisfy their monthly commitment within 3 days of the due date.' },
      { id: '4', title: 'Rule 4: Default Penalties', content: 'Late payments attract a mandatory 10% administration fee.' }
    ];

    if (pool.type === PoolType.FAMILY_RESERVE) {
      clauses = [...clauses, ...FAMILY_WEALTH_TEMPLATE.clauses];
    } else if (pool.type === PoolType.SME_WHOLESALE) {
      clauses = [...clauses, ...SME_BULK_BUYING_TEMPLATE.clauses];
    }

    return (
      <div className="max-w-3xl space-y-12 animate-in slide-in-from-bottom-4">
        <div className="bg-[#E6D5C3]/20 dark:bg-[#3A3D3B]/20 p-12 rounded-[60px] space-y-8">
          <h3 className="text-2xl font-black text-[#2D302E] dark:text-[#FDFCFB] uppercase tracking-tighter italic">Accord Terms</h3>
          <div className="space-y-8 text-sm font-medium text-[#6B706C] dark:text-[#9EA39F] leading-relaxed">
            {clauses.map(clause => (
              <div key={clause.id} className="space-y-2">
                <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">{clause.title}</p>
                <p>{clause.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-1000 pb-40 relative">
      {/* Invitation Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-[#2D302E]/60 backdrop-blur-md" onClick={() => !isInviting && setIsInviteModalOpen(false)} />
          <div className="bg-white dark:bg-[#252826] w-full max-w-lg rounded-[60px] p-12 relative z-10 shadow-2xl border-2 border-[#F1F0EE] dark:border-[#3A3D3B] animate-in zoom-in-95 duration-300">
            <div className="space-y-8">
              <div className="space-y-2">
                <h3 className="text-4xl font-black text-[#2D302E] dark:text-[#FDFCFB] tracking-tighter uppercase italic">Invite a Kinsman</h3>
                <p className="text-sm font-medium text-[#6B706C] dark:text-[#9EA39F]">Grow your community circle. Trust is the only currency here.</p>
              </div>
              <form onSubmit={handleSendInvite} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#9EA39F] uppercase tracking-widest">Full Name</label>
                    <input required type="text" value={inviteData.name} onChange={e => setInviteData({...inviteData, name: e.target.value})} placeholder="e.g. Sipho Zulu" className="w-full bg-[#F9F9F8] dark:bg-[#1A1C1B] border-none p-6 rounded-[24px] outline-none focus:ring-2 focus:ring-[#8CA082] transition-all font-bold dark:text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#9EA39F] uppercase tracking-widest">Email Address</label>
                    <input required type="email" value={inviteData.email} onChange={e => setInviteData({...inviteData, email: e.target.value})} placeholder="sipho@example.com" className="w-full bg-[#F9F9F8] dark:bg-[#1A1C1B] border-none p-6 rounded-[24px] outline-none focus:ring-2 focus:ring-[#8CA082] transition-all font-bold dark:text-white" />
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setIsInviteModalOpen(false)} disabled={isInviting} className="flex-1 py-6 rounded-[32px] text-[11px] font-black uppercase tracking-widest text-[#9EA39F] hover:bg-[#F9F9F8] transition-all">Cancel</button>
                  <button type="submit" disabled={isInviting} className="flex-[2] bg-[#2D302E] dark:bg-[#FDFCFB] text-white dark:text-[#2D302E] py-6 rounded-[32px] text-[11px] font-black uppercase tracking-widest shadow-xl hover:bg-[#8CA082] transition-all disabled:opacity-50"> {isInviting ? 'Sending Accord...' : 'Send Invitation'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="p-3 bg-white dark:bg-[#252826] border border-[#F1F0EE] rounded-2xl group"><svg className="w-5 h-5 text-[#6B706C] group-hover:text-[#2D302E]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
            <div className={`flex items-center gap-3 pl-2 pr-5 py-2 rounded-2xl border ${statusVisuals.lightBg} border-white/20 shadow-sm`}>
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${statusVisuals.gradient} flex items-center justify-center text-white shadow-lg`}>{statusVisuals.icon}</div>
              <div className="flex flex-col"><span className={`text-[10px] font-black uppercase tracking-widest ${statusVisuals.text} leading-none mb-0.5`}>Circle Health</span><span className="text-[12px] font-black text-[#2D302E] dark:text-[#FDFCFB] uppercase italic">{statusVisuals.label}</span></div>
            </div>
          </div>
          <h1 className="text-6xl font-black text-[#2D302E] dark:text-[#FDFCFB] tracking-tighter uppercase leading-[0.85]">{pool.name}</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#8CA082] italic">Tier: {pool.type}</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setIsInviteModalOpen(true)} className="bg-white dark:bg-transparent border-2 border-[#F1F0EE] dark:border-[#3A3D3B] text-[#2D302E] dark:text-[#FDFCFB] px-8 py-6 rounded-[32px] text-xs font-black uppercase tracking-widest hover:border-[#8CA082] transition-all flex items-center gap-3"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>Invite Member</button>
          <button onClick={() => navigate(`/contribute/${pool.id}`)} className="bg-[#2D302E] dark:bg-[#FDFCFB] text-white dark:text-[#2D302E] px-10 py-6 rounded-[32px] text-xs font-black uppercase tracking-widest hover:bg-[#8CA082] transition-all shadow-xl">Contribute Now</button>
        </div>
      </section>

      {/* Goal Progress Banner */}
      {pool.type === PoolType.CROWD_ASSET && pool.targetAsset && (
        <section className="bg-white dark:bg-[#252826] rounded-[60px] border-2 border-[#8CA082] overflow-hidden shadow-2xl animate-in slide-in-from-top-8 duration-700">
          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/3 h-64 lg:h-auto overflow-hidden">
              <img src={pool.targetAsset.imageUrl} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" alt="Asset" />
            </div>
            <div className="flex-1 p-12 space-y-8">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-[#8CA082] uppercase tracking-[0.4em]">Asset Goal</p>
                  <h3 className="text-4xl font-black text-[#2D302E] dark:text-[#FDFCFB] tracking-tighter uppercase">{pool.targetAsset.name}</h3>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-[#9EA39F] uppercase tracking-widest">Total Cost</p>
                  <p className="text-3xl font-black text-[#2D302E] dark:text-[#FDFCFB]">{formatValue(pool.targetAsset.targetPrice)}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                   <p className="text-xs font-black text-[#2D302E] dark:text-[#FDFCFB] uppercase">Collection Progress</p>
                   <p className="text-lg font-black text-[#8CA082]">{Math.round((pool.targetAsset.currentProgress / pool.targetAsset.targetPrice) * 100)}%</p>
                </div>
                <div className="h-4 w-full bg-[#F1F0EE] dark:bg-[#3A3D3B] rounded-full overflow-hidden">
                   <div className="h-full bg-[#8CA082] transition-all duration-[2000ms]" style={{ width: `${(pool.targetAsset.currentProgress / pool.targetAsset.targetPrice) * 100}%` }} />
                </div>
                <p className="text-[10px] font-bold text-[#9EA39F] uppercase tracking-widest">{formatValue(pool.targetAsset.currentProgress)} collected of {formatValue(pool.targetAsset.targetPrice)}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tabs Navigation */}
      <div className="flex gap-12 border-b border-[#F1F0EE] dark:border-[#3A3D3B] transition-colors duration-500">
        {['Ledger', 'Members', 'Rules'].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab as any)} className={`pb-6 text-[11px] font-black uppercase tracking-[0.3em] transition-all border-b-2 ${activeTab === tab ? 'border-[#8CA082] text-[#2D302E] dark:text-[#FDFCFB]' : 'border-transparent text-[#9EA39F]'}`}>{tab}</button>
        ))}
      </div>

      {activeTab === 'Ledger' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4">
          <div className="bg-white dark:bg-[#252826] rounded-[48px] border border-[#F1F0EE] dark:border-[#3A3D3B] shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-[#FDFCFB] dark:bg-[#1A1C1B] border-b border-[#F1F0EE] dark:border-[#3A3D3B]">
                <tr>
                  <th className="px-10 py-6 text-[10px] font-black text-[#9EA39F] uppercase tracking-[0.3em]">Member</th>
                  <th className="px-10 py-6 text-[10px] font-black text-[#9EA39F] uppercase tracking-[0.3em]">Date</th>
                  <th className="px-10 py-6 text-[10px] font-black text-[#9EA39F] uppercase tracking-[0.3em]">Amount</th>
                  <th className="px-10 py-6 text-[10px] font-black text-[#9EA39F] uppercase tracking-[0.3em]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F0EE] dark:divide-[#3A3D3B]">
                {filteredContributions.map((contribution) => (
                  <tr key={contribution.id} className="hover:bg-[#F9F9F8] dark:hover:bg-[#1A1C1B] transition-colors">
                    <td className="px-10 py-8 font-black text-[#2D302E] dark:text-[#FDFCFB] uppercase tracking-tight text-sm">{contribution.memberName}</td>
                    <td className="px-10 py-8 text-xs font-bold text-[#6B706C] dark:text-[#9EA39F]">{contribution.date}</td>
                    <td className="px-10 py-8 font-black text-[#2D302E] dark:text-[#FDFCFB] italic">{formatValue(contribution.amount)}</td>
                    <td className="px-10 py-8">
                      <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        contribution.status === 'On Time' ? 'bg-[#7C9082]/10 text-[#7C9082]' : 'bg-[#B36A5E]/10 text-[#B36A5E]'
                      }`}>
                        {contribution.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'Members' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4">
          <div 
            onClick={() => setIsInviteModalOpen(true)}
            className="bg-[#F9F9F8] dark:bg-[#1A1C1B] p-10 rounded-[48px] border-2 border-dashed border-[#D6CFC7] flex flex-col items-center justify-center text-center space-y-4 group hover:border-[#8CA082] transition-all cursor-pointer"
          >
            <div className="w-16 h-16 bg-white dark:bg-[#252826] rounded-full flex items-center justify-center text-[#D6CFC7] group-hover:bg-[#8CA082] group-hover:text-white transition-all shadow-sm">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </div>
            <p className="text-xs font-black text-[#2D302E] dark:text-[#FDFCFB] uppercase tracking-widest">Invite Member</p>
          </div>

          {localMembers.map((member: any) => {
            const isExpanded = expandedMemberId === member.id;
            return (
              <div 
                key={member.id} 
                onClick={() => setExpandedMemberId(isExpanded ? null : member.id)}
                className={`bg-white dark:bg-[#252826] p-10 rounded-[48px] border-2 transition-all duration-500 cursor-pointer group flex flex-col items-center text-center space-y-6 ${
                  isExpanded ? 'border-[#8CA082] shadow-2xl scale-[1.02]' : 'border-[#F1F0EE] dark:border-[#3A3D3B] shadow-sm hover:border-[#D6CFC7]'
                }`}
              >
                <div className={`w-20 h-20 transition-all duration-500 rounded-[32px] flex items-center justify-center font-black text-2xl shadow-xl ${
                  isExpanded ? 'bg-[#8CA082] text-white rotate-6' : 'bg-[#2D302E] dark:bg-[#FDFCFB] text-white dark:text-[#2D302E]'
                }`}>
                  {member.name.charAt(0)}
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-[#2D302E] dark:text-[#FDFCFB] uppercase tracking-tighter">{member.name}</h3>
                  <p className="text-[10px] font-bold text-[#9EA39F] uppercase tracking-widest">{member.email}</p>
                </div>

                <div className="w-full h-px bg-[#F1F0EE] dark:bg-[#3A3D3B]" />

                <div className="flex justify-between w-full">
                  <div className="text-left">
                    <p className="text-[9px] font-black text-[#9EA39F] uppercase tracking-widest">Ubuntu Score</p>
                    <p className="text-lg font-black text-[#8CA082]">{member.ubuntuScore || '--'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-[#9EA39F] uppercase tracking-widest">Standing</p>
                    <p className={`text-lg font-black uppercase italic ${member.status === 'Paid' ? 'text-[#5C7A67]' : 'text-[#D4AF37]'}`}>{member.status}</p>
                  </div>
                </div>

                {isExpanded && (
                  <div className="w-full pt-6 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="pt-6 border-t border-[#F1F0EE] dark:border-[#3A3D3B] w-full text-left space-y-5">
                      <p className="text-[10px] font-black text-[#8CA082] uppercase tracking-[0.3em] mb-2">Trust Metrics</p>
                      <MetricBar label="Contribution Velocity" value={member.trustMetrics?.contributionVelocity || 0} color="#8CA082" />
                      <MetricBar label="Community Vouching" value={member.trustMetrics?.communityVouching || 0} color="#D4AF37" />
                      
                      {member.successionDesignee && (
                        <div className="bg-[#E6D5C3]/30 p-4 rounded-2xl space-y-2 mt-4">
                           <p className="text-[8px] font-black text-[#C07B5B] uppercase tracking-widest">Inheritance Designee</p>
                           <p className="text-[10px] font-bold text-[#2D302E] dark:text-[#FDFCFB]">{member.successionDesignee}</p>
                        </div>
                      )}

                      <div className="flex gap-2 pt-4">
                        <button className="flex-1 bg-[#2D302E] text-white py-4 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#8CA082] transition-colors">Vouch</button>
                        <button className="flex-1 border-2 border-[#F1F0EE] py-4 rounded-xl text-[9px] font-black uppercase tracking-widest hover:border-[#8CA082] transition-colors">Audit</button>
                      </div>
                    </div>
                  </div>
                )}
                
                {!isExpanded && (
                  <p className="text-[8px] font-black text-[#D6CFC7] uppercase tracking-widest mt-2 group-hover:text-[#8CA082] transition-colors">View Details</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'Rules' && renderRules()}
    </div>
  );
};

export default PoolDetails;
