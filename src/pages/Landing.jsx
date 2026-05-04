import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function Landing() {
  const fadeIn = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
  const stagger = { visible: { transition: { staggerChildren: 0.2 } } };

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--text-1)', overflowX: 'hidden' }}>
      
      {/* ── HERO SECTION ── */}
      <section style={{
        position: 'relative', minHeight: '90vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 5%', overflow: 'hidden'
      }}>
        {/* Background Image & Overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url("/hero.png")',
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'brightness(0.5) contrast(1.2)'
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(13,17,23,0.95) 0%, rgba(13,17,23,0.7) 50%, rgba(13,17,23,0.4) 100%)'
        }} />

        <motion.div
          initial="hidden" animate="visible" variants={stagger}
          style={{ position: 'relative', zIndex: 10, maxWidth: 1200, width: '100%' }}
        >
          <motion.div variants={fadeIn} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <span style={{ padding: '6px 14px', background: 'rgba(219,39,119,0.2)', border: '1px solid rgba(219,39,119,0.4)', borderRadius: 99, color: 'var(--pink)', fontSize: 13, fontWeight: 800, letterSpacing: '0.1em' }}>
              ODISHA 5T INITIATIVE
            </span>
            <span style={{ padding: '6px 14px', background: 'rgba(96,165,250,0.2)', border: '1px solid rgba(96,165,250,0.4)', borderRadius: 99, color: 'var(--blue)', fontSize: 13, fontWeight: 800, letterSpacing: '0.1em' }}>
              SAMAGRA SHIKSHA
            </span>
          </motion.div>

          <motion.h1 variants={fadeIn} style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', fontWeight: 900, lineHeight: 1.1, margin: '0 0 24px 0', textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            Vision Beyond Sight.<br />
            <span className="text-gradient-pink">Education Beyond Barriers.</span>
          </motion.h1>

          <motion.p variants={fadeIn} style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: 'var(--text-2)', maxWidth: 650, lineHeight: 1.6, marginBottom: 40, fontWeight: 400 }}>
            Replacing ₹1,00,000 commercial Braille hardware with a ₹5,000 AI-augmented IoT edge node. Designed exclusively for government school ICT labs to democratize special education.
          </motion.p>

          <motion.div variants={fadeIn} style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <a href="#5t" style={{ textDecoration: 'none' }}>
              <button className="btn-primary" style={{ padding: '16px 32px', fontSize: 16 }}>
                Explore the 5T Transformation ↓
              </button>
            </a>
            <Link to="/teacher" style={{ textDecoration: 'none' }}>
              <button className="btn-ghost" style={{ padding: '16px 32px', fontSize: 16 }}>
                View Educator Dashboard →
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </section>


      {/* ── THE PROBLEM SECTION ── */}
      <section style={{ padding: '100px 5%', background: 'var(--bg-deep)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={stagger}>
            <motion.h2 variants={fadeIn} style={{ fontSize: '3rem', fontWeight: 900, marginBottom: 24 }}>The ₹1,00,000 Barrier.</motion.h2>
            <motion.p variants={fadeIn} style={{ fontSize: 18, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 30 }}>
              Currently, modern electronic Braille displays are elitist. Costing upwards of ₹1 Lakh, they are completely out of reach for the vast majority of visually impaired students in rural India.
            </motion.p>
            <motion.p variants={fadeIn} style={{ fontSize: 18, color: 'var(--text-2)', lineHeight: 1.7 }}>
              This leaves government schools relying on outdated wooden slates, requiring intense 1-on-1 teacher-to-student ratios. <strong style={{ color: 'var(--text-1)' }}>Divya-Drishti breaks this barrier by piggybacking on the computers already present in your ICT labs.</strong>
            </motion.p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="glass" style={{ padding: 40, background: 'rgba(239,68,68,0.05)', borderColor: 'rgba(239,68,68,0.2)' }}>
            <h3 style={{ color: 'var(--red)', fontSize: 24, marginBottom: 20 }}>The Current Reality</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 10 }}>
                <span style={{ color: 'var(--text-2)' }}>Commercial Braille Display</span>
                <span style={{ color: '#fff', fontWeight: 800 }}>₹1,20,000</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 10 }}>
                <span style={{ color: 'var(--text-2)' }}>Teacher/Student Ratio</span>
                <span style={{ color: '#fff', fontWeight: 800 }}>1 : 1</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10 }}>
                <span style={{ color: 'var(--text-2)' }}>Analytics & Telemetry</span>
                <span style={{ color: 'var(--red)', fontWeight: 800 }}>None</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>


      {/* ── THE 5T FRAMEWORK SECTION ── */}
      <section id="5t" style={{ padding: '100px 5%', background: 'var(--bg-void)', position: 'relative' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 80 }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: 16 }}>The 5T Solution</h2>
            <p style={{ fontSize: 18, color: 'var(--text-2)' }}>Aligning perfectly with the Odisha Government's core principles for transformation.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 30 }}>
            {[
              { t: 'Teamwork', color: '#3b82f6', desc: 'A single special educator can now seamlessly monitor 15+ students simultaneously via the Live Omni-Telemetry Dashboard.' },
              { t: 'Technology', color: '#10b981', desc: 'Custom ₹5,000 edge IoT nodes powered by Groq Llama Vision and Voice AI, converting standard PCs into smart braille hubs.' },
              { t: 'Transparency', color: '#f59e0b', desc: 'Real-time Firebase cloud syncing ensures administrators can track the precise learning progress of every single student.' },
              { t: 'Time', color: '#8b5cf6', desc: 'Instant deployment. No new infrastructure needed. The system leverages existing ICT labs with zero-latency AI responses.' },
              { t: 'Transformation', color: '#ec4899', desc: 'Democratized learning that fosters complete independence, bridging the digital divide for the visually impaired.' }
            ].map((item, i) => (
              <motion.div
                key={item.t}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="glass-card" style={{ padding: 30, borderTop: `4px solid ${item.color}` }}
              >
                <div style={{ fontSize: 40, fontWeight: 900, color: item.color, opacity: 0.8, marginBottom: 16 }}>0{i+1}</div>
                <h3 style={{ fontSize: 24, marginBottom: 12 }}>{item.t}</h3>
                <p style={{ color: 'var(--text-2)', lineHeight: 1.6 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ── EDUCATOR COMMAND CENTER ── */}
      <section style={{ padding: '100px 5%', background: 'var(--bg-surface)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 60 }}>
          
          <div style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: 20 }}>The Educator's Command Center</h2>
            <p style={{ fontSize: 18, color: 'var(--text-2)', lineHeight: 1.7 }}>
              Transition from intensive 1-on-1 care to scalable 1-to-Many oversight. The educator dashboard provides live analytics, hardware actuation controls, and curriculum deployment for the entire classroom.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-2)', boxShadow: '0 20px 60px rgba(0,0,0,0.8)', position: 'relative' }}
          >
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url("/teacher.png")', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.6)' }} />
            <div style={{ position: 'relative', zIndex: 1, padding: '100px 40px', background: 'linear-gradient(180deg, transparent 0%, var(--bg-deep) 100%)', display: 'flex', alignItems: 'flex-end', minHeight: 600 }}>
              <div className="glass" style={{ padding: 30, maxWidth: 450 }}>
                <h3 style={{ fontSize: 24, marginBottom: 10, color: 'var(--blue)' }}>Live Omni-Telemetry</h3>
                <p style={{ color: 'var(--text-2)', marginBottom: 20 }}>Monitor keystrokes, accuracy, and AI interactions in real-time across your entire lab network.</p>
                <Link to="/teacher" style={{ textDecoration: 'none' }}><button className="btn-blue" style={{ width: '100%' }}>Launch Live Demo</button></Link>
              </div>
            </div>
          </motion.div>
          
        </div>
      </section>

      {/* ── CALL TO ACTION ── */}
      <section style={{ padding: '120px 5%', background: 'linear-gradient(135deg, var(--bg-void), var(--bg-deep))', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: 24 }}>Partner for Samagra Shiksha</h2>
          <p style={{ fontSize: 18, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 40 }}>
            Join us in deploying the Divya-Drishti ecosystem across rural ICT labs. Together, we can deliver world-class, AI-augmented accessibility hardware at a fraction of the traditional cost.
          </p>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
            <button className="btn-primary" style={{ padding: '16px 40px', fontSize: 18 }}>Request Pilot Deployment</button>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '40px 5%', background: '#010409', borderTop: '1px solid var(--border-1)', textAlign: 'center', color: 'var(--text-3)', fontSize: 14 }}>
        <p>© 2026 Divya-Drishti Initiative. Empowered by Groq AI & ESP32. Designed for Odisha 5T.</p>
      </footer>

    </div>
  );
}

export default Landing;
