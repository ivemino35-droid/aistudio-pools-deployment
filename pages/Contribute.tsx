
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_POOLS, COLORS } from '../constants';
import { calculatePenalty, processContribution } from '../services/api';

type PaymentMethod = 'Bank' | 'PayShap' | 'PayJustNow' | 'Cash';

const Contribute: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const pool = MOCK_POOLS.find(p => p.id === id);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Bank');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isVerifyingBNPL, setIsVerifyingBNPL] = useState(false);
  const [penalty, setPenalty] = useState(0);
  const [txnResult, setTxnResult] = useState<any>(null);

  useEffect(() => {
    if (pool) {
      const penaltyAmount = calculatePenalty(pool.nextDueDate, pool.contributionAmount);
      setPenalty(penaltyAmount);
    }
  }, [pool]);

  if (!pool) return <div className="p-24 text-center text-[#2D302E] font-black uppercase tracking-widest">Circle not found</div>;

  const totalDue = pool.contributionAmount + penalty;
  const payJustNowInstallment = totalDue / 3;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true);
    setTimeout(() => setIsUploading(false), 2000);
  };

  const handleBNPLVerify = () => {
    setIsVerifyingBNPL(true);
    setTimeout(() => setIsVerifyingBNPL(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    const result = await processContribution(pool.id, totalDue, 'mock-proof-url', paymentMethod);
    setTxnResult(result);
    // Auto-redirect after viewing results
    setTimeout(() => navigate('/dashboard'), paymentMethod === 'PayJustNow' ? 8000 : 5000);
  };

  if (isSubmitted && txnResult) {
    const isVerified = txnResult.status === 'Verified';

    return (
      <div className="max-w-xl mx-auto py-32 text-center animate-in zoom-in duration-1000">
        <div className={`w-32 h-32 text-white rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-2xl rotate-3 ${isVerified ? 'bg-[#8CA082]' : 'bg-[#D4AF37]'}`}>
          <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={isVerified ? "M5 13l4 4L19 7" : "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"} />
          </svg>
        </div>
        
        <h2 className="text-4xl font-black text-[#2D302E] dark:text-[#FDFCFB] mb-4 uppercase tracking-tighter">
          {isVerified ? 'Settlement Confirmed' : 'Contribution Initiated'}
        </h2>
        
        <div className="space-y-6">
          <p className="text-[#6B706C] dark:text-[#9EA39F] font-medium leading-relaxed max-w-sm mx-auto italic">
            {isVerified 
              ? `Your ${paymentMethod} transaction was verified instantly via platform webhooks. Your Ubuntu Score has increased.` 
              : `Your commitment has been recorded as PENDING. Admin verification will conclude once our treasury confirms the EFT deposit.`}
          </p>

          <div className="bg-[#F9F9F8] dark:bg-[#252826] p-8 rounded-[40px] border border-[#F1F0EE] dark:border-[#3A3D3B] text-left space-y-4">
            <p className="text-[10px] font-black uppercase text-[#9EA39F] tracking-widest text-center">Receipt Metadata</p>
            <div className="flex justify-between items-center text-xs font-bold">
               <span className="text-[#9EA39F]">Reference</span>
               <span className="text-[#2D302E] dark:text-[#FDFCFB] tabular-nums">{txnResult.transactionId}</span>
            </div>
            <div className="flex justify-between items-center text-xs font-bold">
               <span className="text-[#9EA39F]">Status</span>
               <span className={`uppercase tracking-widest ${isVerified ? 'text-[#8CA082]' : 'text-[#D4AF37]'}`}>{txnResult.status}</span>
            </div>
            <div className="flex justify-between items-center text-xs font-bold">
               <span className="text-[#9EA39F]">Method</span>
               <span className="text-[#2D302E] dark:text-[#FDFCFB]">{paymentMethod}</span>
            </div>
          </div>
        </div>

        <div className="mt-12 animate-pulse text-[#8CA082] font-black uppercase tracking-[0.3em] text-[10px]">Updating Collective Ledger...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-24 animate-in fade-in duration-1000 pb-40">
      <div className="space-y-6">
        <button onClick={() => navigate(-1)} className="text-[11px] font-black uppercase tracking-[0.4em] text-[#9EA39F] hover:text-[#2D302E] transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>
        <h1 className="text-6xl lg:text-7xl font-black text-[#2D302E] dark:text-[#FDFCFB] tracking-tighter uppercase leading-[0.85]">
          Circle <br /> <span className="text-[#D6CFC7] dark:text-[#6B706C]">Fulfillment</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-5 space-y-12">
          {penalty > 0 && (
            <div className="bg-[#B36A5E]/10 border border-[#B36A5E]/20 p-8 rounded-[32px] flex gap-6">
              <div className="w-12 h-12 bg-[#B36A5E] text-white rounded-2xl flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" /></svg>
              </div>
              <div className="space-y-1">
                <h3 className="text-[#B36A5E] font-black uppercase tracking-tight">Late Penalty Triggered</h3>
                <p className="text-xs text-[#B36A5E] font-medium opacity-80 leading-relaxed">A 10% fee has been applied for this cycle.</p>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-[#252826] p-12 rounded-[48px] border-2 border-[#F1F0EE] dark:border-[#3A3D3B] shadow-sm space-y-10">
            <div className="space-y-2">
               <p className="text-[10px] font-black text-[#9EA39F] uppercase tracking-[0.3em]">{pool.type} Fulfillment</p>
               <h2 className="text-3xl font-black text-[#2D302E] dark:text-[#FDFCFB] uppercase tracking-tight">{pool.name}</h2>
            </div>

            <div className="space-y-6 pt-10 border-t border-[#F1F0EE] dark:border-[#3A3D3B]">
              <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                <span className="text-[#9EA39F]">Base Commitment</span>
                <span className="text-[#2D302E] dark:text-[#FDFCFB]">R {pool.contributionAmount.toLocaleString()}</span>
              </div>
              {penalty > 0 && (
                <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-[#B36A5E]">
                  <span>Adjustment</span>
                  <span>+ R {penalty.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between items-end pt-10 border-t border-[#F1F0EE] dark:border-[#3A3D3B]">
                <span className="text-lg font-black text-[#2D302E] dark:text-[#FDFCFB] uppercase tracking-tighter">Total Due</span>
                <span className="text-4xl font-black text-[#8CA082] tracking-tighter italic leading-none">R {totalDue.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-16">
          <section className="space-y-8">
            <h3 className="text-[10px] font-black text-[#2D302E] dark:text-[#FDFCFB] uppercase tracking-[0.5em] border-b border-[#F1F0EE] dark:border-[#3A3D3B] pb-4">Method of Transfer</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { id: 'Bank', name: 'Bank EFT', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16' },
                { id: 'PayShap', name: 'PayShap ID', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
                { id: 'PayJustNow', name: 'PayJustNow', icon: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12z' },
                { id: 'Cash', name: 'Retail Cash', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6' }
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id as any)}
                  className={`p-6 h-40 rounded-[32px] border-2 flex flex-col items-center justify-center gap-4 transition-all duration-500 text-center ${
                    paymentMethod === method.id 
                      ? 'border-[#2D302E] dark:border-[#FDFCFB] bg-[#2D302E] dark:bg-[#FDFCFB] text-white dark:text-[#2D302E] shadow-xl -translate-y-1' 
                      : 'border-[#F1F0EE] dark:border-[#3A3D3B] hover:border-[#D6CFC7] text-[#D6CFC7] bg-white dark:bg-transparent'
                  }`}
                >
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d={method.icon} />
                  </svg>
                  <span className="text-[9px] font-black uppercase tracking-widest">{method.name}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-8">
            <h3 className="text-[10px] font-black text-[#2D302E] dark:text-[#FDFCFB] uppercase tracking-[0.5em] border-b border-[#F1F0EE] dark:border-[#3A3D3B] pb-4">
              {paymentMethod === 'PayJustNow' ? 'BNPL Verification' : 'Verification Artifact'}
            </h3>
            
            {paymentMethod === 'PayJustNow' ? (
              <div className="bg-white dark:bg-[#252826] border-2 border-[#F1F0EE] dark:border-[#3A3D3B] rounded-[40px] p-12 space-y-8">
                <button 
                  onClick={handleBNPLVerify}
                  disabled={isVerifyingBNPL}
                  className={`w-full py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all border-2 ${
                    isVerifyingBNPL ? 'bg-[#F9F9F8] border-[#F1F0EE] text-[#D6CFC7]' : 'border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white'
                  }`}
                >
                  {isVerifyingBNPL ? 'Verifying with Gateway...' : 'Run Credit Check'}
                </button>
              </div>
            ) : (
              <div className="group relative border-2 border-dashed border-[#F1F0EE] dark:border-[#3A3D3B] rounded-[40px] p-16 flex flex-col items-center justify-center gap-6 bg-white dark:bg-[#252826] hover:bg-[#F9F9F8] dark:hover:bg-[#1A1C1B] transition-all cursor-pointer">
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={handleFileUpload}
                  accept="image/*,.pdf"
                />
                <div className="text-center">
                  <p className="text-sm font-black text-[#2D302E] dark:text-[#FDFCFB] uppercase tracking-widest">
                    {isUploading ? 'Validating Proof...' : 'Tap to upload POP'}
                  </p>
                </div>
              </div>
            )}
          </section>

          <div className="flex flex-col sm:flex-row gap-6 pt-8">
            <button onClick={() => navigate(-1)} className="flex-1 py-6 rounded-[32px] text-[11px] font-black uppercase tracking-[0.3em] text-[#9EA39F] hover:text-[#2D302E] dark:hover:text-[#FDFCFB] transition-all">
              Cancel
            </button>
            <button 
              onClick={handleSubmit} 
              disabled={isUploading || isVerifyingBNPL}
              className={`flex-[2] py-8 rounded-[40px] font-black text-xl uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center justify-center gap-4 ${
                isUploading || isVerifyingBNPL ? 'bg-[#F9F9F8] dark:bg-[#3A3D3B] text-[#D6CFC7]' : 'bg-[#2D302E] dark:bg-[#FDFCFB] text-white dark:text-[#2D302E] hover:bg-[#8CA082] shadow-[#D6CFC7]/30 dark:shadow-none -translate-y-1'
              }`}
            >
              {isUploading || isVerifyingBNPL ? 'Processing...' : paymentMethod === 'PayShap' ? 'Shap Now' : 'Execute Transfer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contribute;
