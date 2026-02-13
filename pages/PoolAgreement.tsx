
import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SOUTH_AFRICAN_STOKVEL_TEMPLATE } from '../constitutionTemplate';
import { saveSignedConstitution } from '../services/api';
import { PoolType, ConstitutionCustomization, ConstitutionClause } from '../types';
import UbuntuShieldToggle from '../components/UbuntuShieldToggle';
import ManagedAccountToggle from '../components/ManagedAccountToggle';

const RichTextEditor: React.FC<{ initialValue: string; onChange: (html: string) => void }> = ({ initialValue, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const handleCommand = (command: string) => { document.execCommand(command, false); if (editorRef.current) onChange(editorRef.current.innerHTML); };
  return (
    <div className="border border-[#F1F0EE] dark:border-[#3A3D3B] rounded-2xl overflow-hidden bg-white dark:bg-[#1A1C1B]">
      <div className="flex gap-1 p-2 bg-[#F9F9F8] dark:bg-[#252826] border-b border-[#F1F0EE] dark:border-[#3A3D3B]">
        <button type="button" onClick={() => handleCommand('bold')} className="p-2 font-bold">B</button>
        <button type="button" onClick={() => handleCommand('italic')} className="p-2 italic">I</button>
      </div>
      <div ref={editorRef} contentEditable onInput={(e) => onChange(e.currentTarget.innerHTML)} className="p-4 min-h-[100px] outline-none text-sm dark:text-white" dangerouslySetInnerHTML={{ __html: initialValue }} />
    </div>
  );
};

const PoolAgreement: React.FC = () => {
  const { poolId } = useParams<{ poolId: string }>();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [legalName, setLegalName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [customization, setCustomization] = useState<ConstitutionCustomization>({
    poolName: '', purpose: '', poolType: PoolType.STOKVEL, contributionAmount: '500', contributionSchedule: 'Monthly',
    latePaymentPolicy: 'Grace period of 3 days.', disputeResolution: 'Majority vote.', votingThreshold: 'Simple Majority',
    governanceEvents: 'Cryptographically timestamped.', outcomeExecution: 'Auto-executed.', remittanceTerms: 'Institutional providers.',
    popiaConsent: false, authorizedSignatories: '', clauses: SOUTH_AFRICAN_STOKVEL_TEMPLATE.clauses.map(c => ({ ...c })),
    shieldEnabled: false, managedEnabled: false
  });

  const handleSignAndActivate = async () => {
    setIsProcessing(true);
    await saveSignedConstitution({ poolId: poolId || 'new-pool', legalName: legalName.toUpperCase(), constitutionText: JSON.stringify(customization) });
    setIsProcessing(false);
    setStep(6);
  };

  const ProgressBar = () => (
    <div className="flex items-center justify-between mb-16 max-w-4xl mx-auto px-4 relative">
      {['Intro', 'Remittance', 'Constitution', 'Services', 'Sign', 'Success'].map((label, i) => {
        const active = step >= i + 1;
        return (
          <div key={label} className="flex flex-col items-center gap-3 relative z-10">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs transition-all duration-500 border-2 ${
              step === i + 1 ? 'bg-[#2D302E] dark:bg-[#FDFCFB] text-white dark:text-[#2D302E] border-[#2D302E] scale-110 shadow-xl' : 
              active ? 'bg-[#8CA082] text-white border-[#8CA082]' : 'bg-white dark:bg-[#252826] text-[#D6CFC7] border-[#F1F0EE] dark:border-[#3A3D3B]'
            }`}>
              {i + 1}
            </div>
            <span className="hidden sm:block text-[9px] font-black uppercase tracking-widest text-[#2D302E] dark:text-[#FDFCFB] opacity-60">{label}</span>
          </div>
        );
      })}
      <div className="absolute top-5 left-0 w-full h-0.5 bg-[#F1F0EE] dark:bg-[#3A3D3B] -z-0">
        <div className="h-full bg-[#8CA082] transition-all duration-700" style={{ width: `${((step - 1) / 5) * 100}%` }} />
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto pb-40 px-4">
      <ProgressBar />
      {step === 1 && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
            <h1 className="text-7xl font-black text-[#2D302E] dark:text-[#FDFCFB] tracking-tighter uppercase leading-[0.85]">Ubuntu <br /> <span className="text-[#D6CFC7]">Accord</span></h1>
            <p className="text-xl font-medium text-[#6B706C] dark:text-[#9EA39F]">Honoring the philosophy that "I am because we are." Ubuntu Pools bridges local savings and diaspora remittances through a secure framework.</p>
            <button onClick={() => setStep(2)} className="bg-[#2D302E] dark:bg-[#FDFCFB] text-white dark:text-[#2D302E] px-16 py-8 rounded-[40px] font-black text-xl uppercase tracking-[0.2em] shadow-2xl">Start The Accord</button>
          </div>
          <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200" className="rounded-[60px] shadow-2xl grayscale-[10%]" alt="Community" />
        </div>
      )}
      {step === 2 && (
        <div className="animate-in slide-in-from-right-12 duration-700 max-w-4xl mx-auto space-y-12">
          <h2 className="text-4xl font-black text-[#2D302E] dark:text-[#FDFCFB] uppercase tracking-tighter italic">Remittance Protocol</h2>
          <div className="bg-[#2D302E] p-10 rounded-[48px] text-white space-y-6">
            <p className="text-sm leading-relaxed">Ubuntu Pools ensures flows are governed by SARB Reporting mandates. Capital is non-custodial and exchange rates are recorded in real-time.</p>
          </div>
          <button onClick={() => setStep(3)} className="w-full bg-[#2D302E] dark:bg-[#FDFCFB] text-white dark:text-[#2D302E] py-8 rounded-[40px] font-black text-xl uppercase tracking-[0.2em] shadow-xl">Accept Logic</button>
        </div>
      )}
      {step === 3 && (
        <div className="animate-in slide-in-from-right-12 duration-700 space-y-20">
          <h2 className="text-5xl font-black text-[#2D302E] dark:text-[#FDFCFB] uppercase tracking-tighter text-center">Constitution Editor</h2>
          <div className="bg-white dark:bg-[#252826] p-10 rounded-[60px] border border-[#F1F0EE] dark:border-[#3A3D3B] space-y-8">
            <input type="text" value={customization.poolName} onChange={e => setCustomization({...customization, poolName: e.target.value})} placeholder="Circle Name" className="w-full border-b-2 border-[#F1F0EE] py-4 text-xl font-black outline-none dark:bg-transparent dark:text-white"/>
            <button onClick={() => setStep(4)} className="w-full bg-[#2D302E] dark:bg-[#FDFCFB] text-white dark:text-[#2D302E] py-8 rounded-[40px] font-black uppercase">Confirm Constitution</button>
          </div>
        </div>
      )}
      {step === 4 && (
        <div className="animate-in slide-in-from-right-12 duration-700 max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-5xl font-black text-[#2D302E] dark:text-[#FDFCFB] uppercase tracking-tighter italic">Protection & Services</h2>
            <p className="text-sm font-medium text-[#9EA39F] uppercase tracking-widest">Enhance your membership with collective safety</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <UbuntuShieldToggle 
              contributionAmount={parseFloat(customization.contributionAmount)}
              isEnabled={customization.shieldEnabled}
              onToggle={(enabled) => setCustomization({...customization, shieldEnabled: enabled})}
            />
            <ManagedAccountToggle 
              isEnabled={customization.managedEnabled}
              onToggle={(enabled) => setCustomization({...customization, managedEnabled: enabled})}
            />
          </div>

          <button onClick={() => setStep(5)} className="w-full bg-[#2D302E] dark:bg-[#FDFCFB] text-white dark:text-[#2D302E] py-8 rounded-[40px] font-black text-xl uppercase tracking-widest shadow-xl">Confirm Selection</button>
        </div>
      )}
      {step === 5 && (
        <div className="animate-in slide-in-from-right-12 duration-700 max-w-4xl mx-auto space-y-12">
          <div className="bg-white dark:bg-[#252826] p-12 rounded-[60px] border border-[#F1F0EE] shadow-sm space-y-10">
            <h2 className="text-4xl font-black text-[#2D302E] dark:text-[#FDFCFB] uppercase tracking-tighter">Sign the Accord</h2>
            <input type="text" value={legalName} onChange={e => setLegalName(e.target.value)} placeholder="ENTER FULL LEGAL NAME" className="w-full border-b-2 border-[#F1F0EE] py-4 text-2xl font-black uppercase outline-none dark:bg-transparent dark:text-white"/>
            <button onClick={handleSignAndActivate} disabled={!legalName.trim()} className="w-full bg-[#D4AF37] text-white py-10 rounded-[40px] font-black text-xl uppercase tracking-[0.2em] shadow-2xl">Sign & Join Circle</button>
          </div>
        </div>
      )}
      {step === 6 && (
        <div className="animate-in zoom-in duration-1000 text-center space-y-16">
          <h2 className="text-7xl font-black text-[#2D302E] dark:text-[#FDFCFB] uppercase tracking-tighter">Circle Active</h2>
          <button onClick={() => navigate('/dashboard')} className="px-24 py-8 bg-[#2D302E] dark:bg-[#FDFCFB] text-white dark:text-[#2D302E] rounded-[40px] font-black text-xl uppercase tracking-[0.2em] shadow-xl">Enter Dashboard</button>
        </div>
      )}
    </div>
  );
};

export default PoolAgreement;
