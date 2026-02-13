
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_USER } from '../constants';

const KycVerification: React.FC = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState(1); // 1: Intro, 2: ID Front, 3: ID Back, 4: Selfie, 5: Success
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState('');

  useEffect(() => {
    if (step >= 2 && step <= 4) {
      startCamera();
    }
  }, [step]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  const handleScan = () => {
    setIsScanning(true);
    const statuses = [
      "Adjusting biometric focal point...",
      "Extracting cryptographic OCR artifacts...",
      "Cross-referencing DHA infrastructure...",
      "Validating anti-spoofing vectors..."
    ];
    
    let currentStatusIdx = 0;
    const interval = setInterval(() => {
      setProgress(p => {
        if (p % 25 === 0 && currentStatusIdx < statuses.length) {
          setScanStatus(statuses[currentStatusIdx]);
          currentStatusIdx++;
        }
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsScanning(false);
            setProgress(0);
            setStep(prev => prev + 1);
          }, 1000);
          return 100;
        }
        return p + 2;
      });
    }, 40);
  };

  const completeKyc = () => {
    MOCK_USER.isVerified = true;
    navigate('/dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto py-12 animate-in fade-in duration-1000">
      {step === 1 && (
        <div className="text-center space-y-16 py-12">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-[#8CA082] blur-3xl opacity-20 scale-150 rounded-full" />
            <div className="w-32 h-32 bg-white dark:bg-[#252826] border-2 border-[#8CA082] rounded-[48px] flex items-center justify-center mx-auto text-[#8CA082] shadow-2xl relative z-10 rotate-3">
               <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
          </div>
          <div className="space-y-6">
            <h1 className="text-7xl font-black text-[#2D302E] dark:text-[#FDFCFB] tracking-tighter uppercase italic leading-none">FICA Protocol</h1>
            <p className="text-lg text-[#6B706C] dark:text-[#9EA39F] max-w-sm mx-auto font-medium leading-relaxed italic">Verification is an act of communal safety. We secure the collective by knowing our kinsmen.</p>
          </div>
          <button 
            onClick={() => setStep(2)} 
            className="group relative bg-[#2D302E] dark:bg-[#FDFCFB] text-white dark:text-[#2D302E] px-20 py-10 rounded-[48px] font-black text-2xl uppercase tracking-widest shadow-2xl transition-all hover:bg-[#8CA082] hover:text-white"
          >
            Initiate Trust Scan
          </button>
        </div>
      )}

      {(step >= 2 && step <= 4) && (
        <div className="space-y-12 text-center relative">
          <div className="relative w-full aspect-[4/3] bg-[#1A1C1B] rounded-[80px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.3)] max-w-2xl mx-auto border-4 border-white/5">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover opacity-60" />
            
            {/* Holographic Overlay */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-[#8CA082] rounded-tl-[60px] m-12 opacity-50" />
                <div className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-[#8CA082] rounded-tr-[60px] m-12 opacity-50" />
                <div className="absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 border-[#8CA082] rounded-bl-[60px] m-12 opacity-50" />
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-[#8CA082] rounded-br-[60px] m-12 opacity-50" />
                
                <div className="absolute inset-[150px] border border-white/10 rounded-[60px] flex items-center justify-center">
                    <div className={`w-full h-0.5 bg-gradient-to-r from-transparent via-[#8CA082] to-transparent shadow-[0_0_15px_#8CA082] absolute ${isScanning ? 'animate-scan-vertical' : 'hidden'}`} />
                </div>
            </div>

            {isScanning && (
               <div className="absolute inset-0 bg-[#1A1C1B]/80 backdrop-blur-md flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500">
                 <div className="text-white font-black text-3xl italic uppercase tracking-tighter text-center max-w-xs leading-none">
                    {scanStatus}
                 </div>
                 <div className="w-80 h-1.5 bg-white/10 rounded-full overflow-hidden p-0.5">
                    <div className="h-full bg-gradient-to-r from-[#8CA082] to-[#D4AF37] rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                 </div>
                 <div className="text-[10px] font-black uppercase text-[#8CA082] tracking-[0.4em]">{progress}% Complete</div>
               </div>
            )}
          </div>

          <div className="space-y-8">
            <div className="flex justify-center gap-6">
               {[2, 3, 4].map(s => (
                 <div key={s} className={`w-4 h-4 rounded-full border-2 transition-all duration-500 ${step === s ? 'bg-[#8CA082] border-[#8CA082] scale-150' : step > s ? 'bg-[#2D302E] border-[#2D302E]' : 'border-[#D6CFC7]'}`} />
               ))}
            </div>
            <div className="space-y-2">
                <p className="text-[11px] font-black uppercase tracking-[0.5em] text-[#8CA082]">
                    {step === 2 ? 'Position ID Front-Face' : step === 3 ? 'Position ID Reverse-Side' : 'Center Biometric Selfie'}
                </p>
                <p className="text-xs font-bold text-[#9EA39F] uppercase tracking-widest">Ensure clear lighting for algorithmic accuracy</p>
            </div>
            <button 
              onClick={handleScan}
              disabled={isScanning}
              className="bg-[#D4AF37] text-white px-20 py-8 rounded-[40px] font-black uppercase tracking-widest shadow-2xl hover:bg-[#8CA082] hover:scale-105 transition-all disabled:opacity-50"
            >
              Capture {step === 4 ? 'Biometrics' : 'Artifact'}
            </button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="text-center space-y-20 py-20 animate-in zoom-in duration-1000">
           <div className="relative inline-block">
             <div className="absolute inset-0 bg-[#8CA082] blur-[80px] opacity-30 animate-pulse" />
             <div className="w-48 h-48 bg-[#8CA082] text-white rounded-[64px] flex items-center justify-center mx-auto shadow-[0_30px_60px_-15px_rgba(140,160,130,0.6)] rotate-6 relative z-10">
                <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
             </div>
           </div>
           <div className="space-y-6">
             <h2 className="text-7xl font-black text-[#2D302E] dark:text-[#FDFCFB] tracking-tighter uppercase italic leading-none">Kinsman Verified</h2>
             <p className="text-xl text-[#6B706C] dark:text-[#9EA39F] font-medium italic max-w-md mx-auto">Neural match confirmed. Your identity is now cryptographically linked to the collective ledger.</p>
           </div>
           <button onClick={completeKyc} className="bg-[#2D302E] dark:bg-[#FDFCFB] text-white dark:text-[#2D302E] px-24 py-10 rounded-[56px] font-black text-2xl uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform">Enter Vault</button>
        </div>
      )}

      <style>{`
        @keyframes scan-vertical {
          0%, 100% { top: 0%; opacity: 0.2; }
          50% { top: 100%; opacity: 1; }
        }
        .animate-scan-vertical {
          animation: scan-vertical 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default KycVerification;
