
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-[#F1F0EE] dark:border-[#3A3D3B] py-8">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left group"
      >
        <span className={`text-xl font-black uppercase tracking-tighter transition-all duration-500 ${isOpen ? 'text-[#8CA082] italic translate-x-2' : 'text-[#2D302E] dark:text-[#FDFCFB]'}`}>
          {question}
        </span>
        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${isOpen ? 'rotate-180 border-[#8CA082] bg-[#8CA082] text-white' : 'border-[#F1F0EE] dark:border-[#3A3D3B] text-[#9EA39F]'}`}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-700 ease-in-out ${isOpen ? 'max-h-96 opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
        <p className="text-sm font-medium text-[#6B706C] dark:text-[#9EA39F] leading-relaxed max-w-2xl italic">
          {answer}
        </p>
      </div>
    </div>
  );
};

const FAQ: React.FC = () => {
  const navigate = useNavigate();

  const categories = [
    {
      title: "Philosophy & Trust",
      items: [
        {
          question: "What is the Ubuntu Score?",
          answer: "It is a bias-free reputation matrix. Unlike traditional credit scores that look at your debt, the Ubuntu Score measures your contribution velocity, community vouching, and altruism within the circle."
        },
        {
          question: "How does vouching work?",
          answer: "High-score members can 'vouch' for newcomers. This puts a portion of the voucher's social capital at stake, allowing the newcomer to bypass initial trust thresholds for stock advances or loans."
        }
      ]
    },
    {
      title: "Payments & Liquidity",
      items: [
        {
          question: "How does PayJustNow (BNPL) work for contributions?",
          answer: "If you're facing a temporary cash gap, you can choose PayJustNow. It pays your full pool commitment immediately, but you pay them back in 3 interest-free installments. This ensures you never miss a pool cycle and protect your Ubuntu Score."
        },
        {
          question: "What is PayShap?",
          answer: "PayShap is South Africa's rapid payment service. It allows you to make instant payments using just a cell phone number (ShapID). These payments clear within seconds, removing the need for 48-hour wait times for bank verification."
        }
      ]
    },
    {
      title: "Security & Legal",
      items: [
        {
          question: "Is Ubuntu Pools a bank?",
          answer: "No. We are a Digital Aggregator and non-custodial ledger. We do not hold your funds; we facilitate the governance and agreement logic between members, while funds move through registered FICA-compliant institutions."
        },
        {
          question: "Why is FICA required?",
          answer: "To protect the collective from illicit flows and comply with the South African Financial Intelligence Centre Act. It ensures every kinsman in your circle is verified and legitimate."
        }
      ]
    },
    {
      title: "Prosperity Tiers",
      items: [
        {
          question: "What is the Family Wealth Reserve?",
          answer: "A specialized pool tier that includes Succession Rules. It allows a parent to pass their Trust DNA and pool position to a child, ensuring generational wealth is not lost."
        },
        {
          question: "How do SME Bulk-Buying circles work?",
          answer: "Multiple small businesses (like Spaza shops) pool their buying power. Our AI-driven Proposal Architect then helps you negotiate directly with giants like Makro for wholesale discounts."
        }
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-24 animate-in fade-in duration-1000 pb-40">
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-4">
            <h1 className="text-7xl lg:text-8xl font-black text-[#2D302E] dark:text-[#FDFCFB] tracking-tighter uppercase leading-[0.8]">
              Common <br /> <span className="text-[#D6CFC7] dark:text-[#6B706C]">Accord</span>
            </h1>
            <p className="text-xl font-medium text-[#6B706C] dark:text-[#9EA39F] max-w-sm tracking-tight leading-relaxed">
              Knowledge is the shared fire of the community. Find clarity on our ecosystem.
            </p>
          </div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-[#2D302E] dark:bg-[#FDFCFB] text-white dark:text-[#2D302E] px-12 py-6 rounded-[32px] font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-[#8CA082] transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
        <aside className="lg:col-span-4 space-y-12">
          <div className="bg-[#E6D5C3]/20 dark:bg-[#3A3D3B]/20 p-10 rounded-[48px] border border-[#F1F0EE] dark:border-[#3A3D3B] sticky top-32">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-[#D4AF37] mb-8">Quick Resources</h3>
            <ul className="space-y-6">
              <li>
                <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-sm font-black uppercase tracking-widest hover:text-[#8CA082] transition-colors block">Billing Docs</a>
              </li>
              <li>
                <button onClick={() => navigate('/verify')} className="text-sm font-black uppercase tracking-widest hover:text-[#8CA082] transition-colors block">FICA Status</button>
              </li>
              <li>
                <button className="text-sm font-black uppercase tracking-widest hover:text-[#8CA082] transition-colors block">Platform Audit</button>
              </li>
            </ul>
          </div>
        </aside>

        <div className="lg:col-span-8 space-y-20">
          {categories.map((cat, idx) => (
            <div key={idx} className="space-y-8">
              <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-[#9EA39F] border-b border-[#F1F0EE] dark:border-[#3A3D3B] pb-4">
                {cat.title}
              </h2>
              <div className="space-y-2">
                {cat.items.map((item, i) => (
                  <FAQItem key={i} question={item.question} answer={item.answer} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <section className="bg-[#2D302E] rounded-[60px] p-16 text-center space-y-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover" alt="" />
        </div>
        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">Still have questions?</h2>
          <p className="text-white/60 max-w-md mx-auto font-medium">Lindiwe is available for a live voice conversation to guide you through any complexities.</p>
          <button 
            className="bg-[#FDFCFB] text-[#2D302E] px-12 py-6 rounded-[32px] font-black uppercase tracking-widest text-xs hover:bg-[#8CA082] hover:text-white transition-all shadow-2xl"
          >
            Talk to Lindiwe
          </button>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
