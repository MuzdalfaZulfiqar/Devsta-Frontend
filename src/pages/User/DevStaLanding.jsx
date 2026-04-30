import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const DevStaLanding = () => {
  const containerRef = useRef(null);
  const ecosystemRef = useRef(null); // Reference for the sticky section
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Separate scroll tracking for the horizontal section
  const { scrollYProgress: horizontalScroll } = useScroll({
    target: ecosystemRef,
    offset: ["start start", "end end"]
  });

  // Map the vertical scroll of Section 2 to horizontal movement
  const xMovement = useTransform(horizontalScroll, [0, 1], ["0%", "-60%"]);

  const devURL = window.location.hostname === 'localhost' ? 'http://localhost:5173/signup' : 'https://devsta.vercel.app/signup';
  const recruiterURL = window.location.hostname === 'localhost' ? 'http://localhost:5173/company/register' : 'https://devsta.vercel.app/company/register';

  return (
    <div ref={containerRef} className="bg-white text-slate-900 font-sans selection:bg-primary selection:text-white">
      
      {/* 1. HERO (UI PRESERVED) */}
      <section className="h-screen flex flex-col justify-center items-center px-6 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" 
              style={{ backgroundImage: 'linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
        />
        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative z-10 text-center"
        >
          <h1 className="text-[15vw] font-black tracking-tighter leading-none uppercase italic">
            DEV<span className="text-primary not-italic">STA.</span>
          </h1>
          <p className="text-xl md:text-2xl mt-6 font-medium text-slate-400 uppercase tracking-[0.3em]">
            Hire better. Code faster.
          </p>
        </motion.div>
      </section>

      {/* 2. THE ECOSYSTEM (FIXED: STICKY HORIZONTAL SCROLL) */}
      <section ref={ecosystemRef} className="relative h-[300vh] bg-slate-50">
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
          <div className="px-12 mb-12">
            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic">
              The Ecosystem<span className="text-primary not-italic">.</span>
            </h2>
          </div>

          <motion.div style={{ x: xMovement }} className="flex gap-8 px-12">
            <ModernCard 
              title="Verified Identity"
              desc="Unified profiles that aggregate GitHub DNA and resumes. AI automatically validates your tech stack and assigns a confidence score."
              label="Module 01"
            />
            <ModernCard 
              title="Knowledge Graph"
              desc="A dynamic map of your technical growth. Identify skill gaps using NER and follow curated learning paths from Coursera and Udemy."
              label="Module 03"
            />
            <ModernCard 
              title="Smart Matching"
              desc="BERT-powered ranking for recruiters and AI Interview Assistants for devs. Simulate coding challenges via Judge0 in a real-time sandbox."
              label="Module 04 & 06"
            />
            <ModernCard 
              title="Monetization"
              desc="Turn your repositories into revenue. Get AI-driven licensing suggestions and build a professional portfolio that scales your career."
              label="Module 05 & 07"
            />
          </motion.div>
        </div>
      </section>

      {/* 3. ACCESS PORTALS (UI PRESERVED) */}
      <section className="flex flex-col md:flex-row min-h-screen border-t border-slate-200">
         <div className="flex-1 p-12 md:p-24 bg-slate-50 flex flex-col justify-between items-start border-b md:border-b-0 md:border-r border-slate-200">
            <h2 className="text-7xl font-black uppercase italic leading-none">For <br/>Developers</h2>
            <p className="text-xl text-slate-500 max-w-sm">Build your verified DNA. Access hackathons and earn from your code.</p>
            <a href={devURL} className="px-12 py-6 bg-slate-950 text-white font-bold rounded-full hover:bg-primary transition-colors uppercase tracking-widest">Join as Dev</a>
         </div>

         <div className="flex-1 p-12 md:p-24 bg-white flex flex-col justify-between items-start">
            <h2 className="text-7xl font-black uppercase italic leading-none">For <br/>Recruiters</h2>
            <p className="text-xl text-slate-500 max-w-sm">Eliminate the guesswork. Hire based on verified technical evidence.</p>
            <a href={recruiterURL} className="px-12 py-6 border-4 border-slate-950 font-bold rounded-full hover:bg-slate-50 transition-colors uppercase tracking-widest">Hire Talent</a>
         </div>
      </section>

      {/* 4. LIQUID FOOTER (UI PRESERVED) */}
      <footer className="h-screen bg-slate-950 flex flex-col justify-center items-center relative overflow-hidden">
        <motion.div 
          style={{ scale: useTransform(smoothProgress, [0.8, 1], [0.8, 1.4]) }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <span className="text-[30vw] font-black text-slate-900 leading-none select-none uppercase">DEVSTA</span>
        </motion.div>
        
        <div className="relative z-10 text-center space-y-12">
          <h2 className="text-7xl md:text-9xl font-black tracking-tighter uppercase italic text-white">
            READY TO <span className="text-primary not-italic">START?</span>
          </h2>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <a href={devURL} className="px-16 py-8 bg-white text-slate-950 rounded-full font-black text-xl hover:bg-primary hover:text-white transition-all uppercase">
                Developer Access
            </a>
            <a href={recruiterURL} className="px-16 py-8 border-2 border-white text-white rounded-full font-black text-xl hover:bg-white hover:text-slate-950 transition-all uppercase">
                Recruiter Access
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

/* --- MODERN CARD (Refined for Horizontal Flow) --- */
const ModernCard = ({ title, desc, label }) => (
    <motion.div 
      className="min-w-[350px] md:min-w-[500px] bg-white border border-slate-200 p-10 md:p-14 rounded-[3rem] flex flex-col justify-between transition-all duration-300 group hover:border-primary"
    >
        <div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-4 block">{label}</span>
            <h3 className="text-4xl font-black uppercase mb-6 italic group-hover:text-primary transition-colors">{title}</h3>
            <p className="text-lg text-slate-500 leading-relaxed font-medium">
                {desc}
            </p>
        </div>
        <div className="mt-10 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-300 group-hover:text-primary transition-colors">
            Protocol Active <div className="w-1.5 h-1.5 bg-current rounded-full animate-pulse" />
        </div>
    </motion.div>
);

export default DevStaLanding;