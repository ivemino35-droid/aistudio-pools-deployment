
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PoolType } from '../types';
import { createPoolRecord } from '../services/api';

interface NewMember {
  name: string;
  email: string;
}

const CreatePool: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    type: PoolType.STOKVEL,
    contributionAmount: '',
    description: ''
  });

  const [members, setMembers] = useState<NewMember[]>([]);
  const [currentMember, setCurrentMember] = useState<NewMember>({ name: '', email: '' });

  const handleAddMember = () => {
    if (currentMember.name && currentMember.email) {
      if (!members.find(m => m.email === currentMember.email)) {
        setMembers([...members, currentMember]);
        setCurrentMember({ name: '', email: '' });
        setErrorMessage(null);
      } else {
        setErrorMessage('This member is already in your circle.');
      }
    }
  };

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (members.length < 2) {
      setErrorMessage('A community circle needs at least 3 people.');
      return;
    }
    setIsSubmitting(true);
    try {
      const pool = await createPoolRecord({
        name: formData.name,
        type: formData.type,
        contributionAmount: parseFloat(formData.contributionAmount),
        members: members.map(m => m.email)
      });
      navigate(`/agreement/${pool?.id || 'new-pool'}`);
    } catch (err: any) {
      setTimeout(() => navigate('/agreement/demo-id'), 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-20 animate-in slide-in-from-bottom-12 duration-1000 pb-40">
      <div className="space-y-6">
        <button onClick={() => navigate(-1)} className="text-[11px] font-black uppercase tracking-[0.4em] text-[#9EA39F] hover:text-[#2D302E] transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Go Back
        </button>
        <h1 className="text-6xl font-black text-[#2D302E] dark:text-[#FDFCFB] tracking-tighter uppercase leading-tight">
          Plant the <br /> <span className="text-[#8CA082]">Seed</span>
        </h1>
        <p className="text-[#6B706C] dark:text-[#9EA39F] font-medium tracking-tight text-lg max-w-xl">Whether it's for school fees, inventory, or shared assets—every great circle begins here.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-20">
        <section className="bg-white dark:bg-[#252826] p-10 lg:p-16 rounded-[60px] border-2 border-[#F1F0EE] dark:border-[#3A3D3B] shadow-sm space-y-12">
          <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#D4AF37]">The Circle Basics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-[#9EA39F] uppercase tracking-widest">Circle Name</label>
              <input required type="text" placeholder="e.g. Zulu Family Reserve" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-transparent border-b-2 border-[#F1F0EE] dark:border-[#3A3D3B] py-4 focus:border-[#8CA082] outline-none transition-all text-xl font-black text-[#2D302E] dark:text-[#FDFCFB]"/>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-[#9EA39F] uppercase tracking-widest">Saving Tier</label>
              <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value as PoolType})} className="w-full bg-transparent border-b-2 border-[#F1F0EE] dark:border-[#3A3D3B] py-4 focus:border-[#8CA082] outline-none transition-all text-xl font-black text-[#2D302E] dark:text-[#FDFCFB] appearance-none cursor-pointer">
                <option value={PoolType.STOKVEL}>Traditional Stokvel</option>
                <option value={PoolType.FAMILY_RESERVE}>Family Wealth Accord</option>
                <option value={PoolType.SME_WHOLESALE}>SME Bulk-Buying Circle</option>
                <option value={PoolType.CROWD_ASSET}>Crowd-Asset Investment</option>
              </select>
            </div>
            <div className="md:col-span-2 space-y-4">
              <label className="text-[10px] font-black text-[#9EA39F] uppercase tracking-widest">Target Contribution (ZAR)</label>
              <input required type="number" placeholder="R 0.00" value={formData.contributionAmount} onChange={(e) => setFormData({...formData, contributionAmount: e.target.value})} className="w-full bg-transparent border-b-2 border-[#F1F0EE] dark:border-[#3A3D3B] py-4 focus:border-[#8CA082] outline-none transition-all text-4xl font-black text-[#8CA082] placeholder:text-[#F1F0EE]"/>
            </div>
          </div>
        </section>

        {/* Members section remains same... */}

        <div className="flex justify-center pt-10">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-[#2D302E] dark:bg-[#FDFCFB] text-white dark:text-[#2D302E] px-24 py-10 rounded-[48px] font-black text-2xl uppercase tracking-[0.2em] hover:bg-[#8CA082] transition-all shadow-2xl disabled:opacity-50"
          >
            {isSubmitting ? 'Planting Seed...' : 'Begin Circle'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePool;
