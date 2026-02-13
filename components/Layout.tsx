
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { COLORS } from '../constants';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      try {
        const storage = window.localStorage;
        if (storage) {
          const saved = storage.getItem('theme');
          if (saved === 'light' || saved === 'dark') return saved;
        }
      } catch (e) {}
      
      try {
        if (typeof window.matchMedia === 'function') {
          if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
          }
        }
      } catch (e) {}
    }
    return 'light';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    try {
      if (window.localStorage) {
        window.localStorage.setItem('theme', theme);
      }
    } catch (e) {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Admin', path: '/admin' },
    { name: 'FAQ', path: '/faq' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFB] dark:bg-[#1A1C1B] flex flex-col text-[#2D302E] dark:text-[#FDFCFB] selection:bg-[#D6CFC7] transition-colors duration-500">
      
      {/* Humanistic Top Ribbon */}
      <div className="h-3 w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#8CA082] via-[#D4AF37] to-[#C07B5B] opacity-90 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=40&w=1200" 
          className="absolute inset-0 w-full h-full object-cover grayscale brightness-150"
          alt=""
        />
      </div>
      
      <header className="bg-white/80 dark:bg-[#252826]/80 backdrop-blur-2xl sticky top-0 z-50 border-b border-[#F1F0EE] dark:border-[#3A3D3B] transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center h-20">
            <Link to="/dashboard" className="flex items-center gap-4 group">
              <div className="w-12 h-12 bg-[#2D302E] dark:bg-[#FDFCFB] flex items-center justify-center font-bold text-white dark:text-[#2D302E] transition-all group-hover:rotate-6 rounded-2xl overflow-hidden relative shadow-lg shadow-[#2D302E]/10">
                <img 
                  src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=100" 
                  className="absolute inset-0 w-full h-full object-cover opacity-30" 
                  alt=""
                />
                <span className="relative z-10 text-xl font-black">U</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tighter uppercase dark:text-[#FDFCFB] leading-none">Ubuntu Pools</span>
                <span className="text-[9px] font-black text-[#8CA082] uppercase tracking-[0.3em] mt-1">Collective Prosperity</span>
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-12">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`text-xs font-black uppercase tracking-widest transition-all hover:opacity-100 ${
                    location.pathname === item.path 
                      ? 'opacity-100 text-[#2D302E] dark:text-[#FDFCFB] border-b-2 border-[#D4AF37] pb-1' 
                      : 'opacity-40 text-[#6B706C] dark:text-[#9EA39F]'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="h-6 w-px bg-[#F1F0EE] dark:bg-[#3A3D3B]" />
              
              <button 
                onClick={toggleTheme}
                className="p-3 rounded-2xl hover:bg-[#F9F9F8] dark:hover:bg-[#3A3D3B] transition-all group border border-transparent hover:border-[#F1F0EE] dark:hover:border-[#3A3D3B]"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <svg className="w-5 h-5 text-[#6B706C] group-hover:text-[#2D302E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-[#9EA39F] group-hover:text-[#FDFCFB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.95 17.95l.707.707M7.05 7.05l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                  </svg>
                )}
              </button>

              <div className="flex flex-col items-end bg-[#F9F9F8] dark:bg-[#1A1C1B] px-6 py-2 rounded-2xl border border-[#F1F0EE] dark:border-[#3A3D3B]">
                <p className="text-[9px] font-black uppercase tracking-widest text-[#9EA39F] dark:text-[#6B706C]">Vault Balance</p>
                <p className="text-sm font-black text-[#2D302E] dark:text-[#FDFCFB] tabular-nums">R 2,300.00</p>
              </div>
            </nav>

            <div className="flex items-center gap-4 md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-3 text-[#2D302E] dark:text-[#FDFCFB] bg-[#F9F9F8] dark:bg-[#252826] rounded-2xl"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-[#252826] border-b border-[#F1F0EE] dark:border-[#3A3D3B] px-6 py-10 space-y-8 animate-in slide-in-from-top-4 transition-colors duration-500">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className="block text-2xl font-black uppercase tracking-tighter text-[#2D302E] dark:text-[#FDFCFB]"
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </header>
      
      {/* Dynamic Header spacing logic based on route could go here if needed */}
      <div className="w-full h-40 md:h-64 overflow-hidden relative border-b border-[#F1F0EE] dark:border-[#3A3D3B]">
        <img 
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1600" 
          className="w-full h-full object-cover grayscale opacity-20 dark:opacity-10 scale-110"
          alt="Ubuntu Banner"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#FDFCFB] dark:to-[#1A1C1B] opacity-60" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-[11px] font-black uppercase tracking-[1em] text-[#9EA39F] opacity-40">I am because we are</p>
        </div>
      </div>

      <main className="flex-grow max-w-7xl mx-auto px-6 lg:px-12 py-12 w-full">
        {children}
      </main>

      <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-auto lg:h-[500px]">
          <div className="rounded-[60px] overflow-hidden relative shadow-2xl group border border-white h-80 lg:h-full">
            <img 
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1200" 
              className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110"
              alt="Community Purity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2D302E]/80 via-[#2D302E]/10 to-transparent flex flex-col justify-end p-12 lg:p-16">
              <h2 className="text-white text-4xl lg:text-6xl font-black uppercase tracking-tighter italic mb-6 leading-none">
                Umuntu <br /> ngumuntu <br /> ngabantu
              </h2>
              <p className="text-[#D4AF37] text-xs font-black uppercase tracking-[0.4em]">
                A person is a person through other people
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-[40px] overflow-hidden relative shadow-lg group border border-[#F1F0EE] dark:border-[#3A3D3B]">
              <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Collaboration" />
            </div>
            <div className="rounded-[40px] overflow-hidden relative shadow-lg group border border-[#F1F0EE] dark:border-[#3A3D3B]">
              <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Support" />
            </div>
            <div className="col-span-2 rounded-[40px] overflow-hidden relative shadow-lg group border border-[#F1F0EE] dark:border-[#3A3D3B] h-48 lg:h-auto">
              <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" alt="Togetherness" />
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white dark:bg-[#252826] border-t border-[#F1F0EE] dark:border-[#3A3D3B] py-20 transition-colors duration-500 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-12 relative z-10">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 grayscale dark:grayscale-0">
              <div className="w-10 h-10 bg-[#2D302E] dark:bg-[#FDFCFB] flex items-center justify-center font-bold text-white dark:text-[#2D302E] text-sm rounded-xl shadow-xl">U</div>
              <span className="text-lg font-black tracking-tighter uppercase dark:text-[#FDFCFB]">Ubuntu Pools</span>
            </div>
            <div className="flex gap-4">
              {['Facebook', 'X', 'LinkedIn', 'WhatsApp'].map(social => (
                <button key={social} className="text-[9px] font-black uppercase tracking-widest text-[#9EA39F] hover:text-[#2D302E] dark:hover:text-white transition-colors">{social}</button>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col md:items-end gap-4 text-center md:text-right">
            <p className="text-[11px] font-black text-[#2D302E] dark:text-[#FDFCFB] tracking-widest uppercase">
              Community Savings Redefined.
            </p>
            <p className="text-[10px] font-bold text-[#9EA39F] dark:text-[#6B706C] tracking-wide uppercase">
              &copy; 2025 Ubuntu Pools (Pty) Ltd. Built on collective trust.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
