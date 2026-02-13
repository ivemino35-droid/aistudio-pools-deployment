
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality, Blob } from '@google/genai';

interface LiveSupportProps {
  isOpen: boolean;
  onClose: () => void;
}

const LiveSupport: React.FC<LiveSupportProps> = ({ isOpen, onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const streamRef = useRef<MediaStream | null>(null);

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const createBlob = (data: Float32Array): Blob => {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  };

  const stopAllAudio = () => {
    sourcesRef.current.forEach(s => {
      try { s.stop(); } catch(e) {}
    });
    sourcesRef.current.clear();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
    }
  };

  const startSession = async () => {
    setIsConnecting(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      inputAudioContextRef.current = inputCtx;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsConnecting(false);

            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message) => {
            const audioBase64 = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioBase64 && audioContextRef.current) {
              const ctx = audioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const audioBuffer = await decodeAudioData(decode(audioBase64), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => {
                try { s.stop(); } catch(e) {}
              });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => {
            setIsActive(false);
            stopAllAudio();
          },
          onerror: (e) => {
            console.error("Live support error:", e);
            setIsConnecting(false);
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } }
          },
          systemInstruction: 'You are Lindiwe, a warm and professional Ubuntu Pools advisor. Help the user with savings tips, stokvel rules, and community prosperity advice. Speak in a friendly South African accent/tone. Keep responses concise and human. Context: You are talking to a member of a savings collective in 2025.'
        }
      });
    } catch (err) {
      console.error("Failed to start session:", err);
      setIsConnecting(false);
    }
  };

  const handleClose = () => {
    stopAllAudio();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-10 animate-in fade-in duration-700">
      <div className="absolute inset-0 bg-[#1A1C1B]/95 backdrop-blur-3xl" onClick={handleClose} />
      
      <button onClick={handleClose} className="absolute top-10 right-10 z-10 text-white/40 hover:text-white transition-all hover:rotate-90">
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>

      <div className="relative z-10 space-y-16 text-center max-w-2xl w-full">
        {/* Animated Portal */}
        <div className="relative flex justify-center items-center h-80">
          <div className={`absolute w-72 h-72 rounded-full border border-white/5 transition-all duration-1000 ${isActive ? 'scale-150 opacity-0' : 'scale-100 opacity-20'}`} />
          <div className={`absolute w-64 h-64 rounded-full border border-[#8CA082]/20 transition-all duration-1000 ${isActive ? 'scale-125 opacity-0' : 'scale-100 opacity-40'}`} />
          
          <div className={`w-48 h-48 bg-gradient-to-br from-[#8CA082] via-[#D4AF37] to-[#C07B5B] rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(140,160,130,0.3)] relative group transition-all duration-500 ${isActive ? 'scale-110 shadow-[0_0_100px_rgba(212,175,55,0.4)]' : 'hover:scale-105'}`}>
            <div className="absolute inset-2 bg-[#1A1C1B] rounded-full flex items-center justify-center overflow-hidden">
                {isActive ? (
                   <div className="flex items-center gap-1.5 h-20 w-32 justify-center">
                     {[1,2,3,4,5,6,7,8].map(i => (
                       <div key={i} className="w-1.5 bg-gradient-to-t from-[#8CA082] to-[#D4AF37] rounded-full animate-wave" style={{ animationDelay: `${i*0.15}s` }} />
                     ))}
                   </div>
                ) : (
                  <span className="text-7xl font-black text-white/20 italic select-none">L</span>
                )}
                {isConnecting && (
                  <div className="absolute inset-0 border-4 border-[#8CA082] border-t-transparent rounded-full animate-spin" />
                )}
            </div>
            {isActive && (
              <div className="absolute -inset-8 border border-[#8CA082]/30 rounded-full animate-pulse-slow" />
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-5xl font-black text-white uppercase tracking-tighter italic leading-none">
              {isConnecting ? 'Bridging Protocols...' : isActive ? 'Lindiwe is Active' : 'Speak with Lindiwe'}
            </h2>
            <p className="text-[#8CA082] text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">
              {isActive ? 'Encrypted Voice Corridor Established' : 'Voice-First Ubuntu Support'}
            </p>
          </div>
          <p className="text-white/40 font-medium leading-relaxed text-sm max-w-md mx-auto italic">
            {isActive 
              ? 'Our community advisor is ready. Ask about your Ubuntu Score, pool rotations, or the current ZAR climate.' 
              : 'Lindiwe uses collective wisdom to guide your financial journey. Enter the conversation to align with your circle.'}
          </p>
        </div>

        <div className="flex flex-col items-center gap-8">
          {!isActive && !isConnecting && (
            <button 
              onClick={startSession}
              className="group relative overflow-hidden bg-white text-[#1A1C1B] px-16 py-8 rounded-full font-black text-xl uppercase tracking-widest shadow-2xl transition-all hover:bg-[#8CA082] hover:text-white active:scale-95"
            >
              <span className="relative z-10">Start Session</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
          )}

          {isActive && (
            <div className="flex gap-4">
              <button 
                onClick={handleClose}
                className="bg-white/5 border border-white/10 text-white px-10 py-5 rounded-3xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3"
              >
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                Terminate Link
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes wave {
          0%, 100% { height: 10%; }
          50% { height: 80%; }
        }
        .animate-wave {
          animation: wave 1.2s ease-in-out infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.1; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LiveSupport;
