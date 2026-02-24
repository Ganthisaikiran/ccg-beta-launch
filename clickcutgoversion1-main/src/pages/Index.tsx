import { useState, useEffect } from "react";
import logoImg from "@/assets/logo.jpg";
import heroBgImg from "@/assets/hero_wedding.jpg";
import { Check, Zap, Clock, Star, Shield, Users, ChevronDown, MessageCircle, ArrowRight, Play, Plus, Mail, Phone } from "lucide-react";

/* ─── Injected styles ─────────────────────────────────────────────────── */
const globalStyles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(32px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(249,115,22,0); }
  50%       { box-shadow: 0 0 24px 6px rgba(249,115,22,0.35); }
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-6px); }
}
.fade-up-1 { animation: fadeInUp 0.8s ease both 0.1s; }
.fade-up-2 { animation: fadeInUp 0.8s ease both 0.25s; }
.fade-up-3 { animation: fadeInUp 0.8s ease both 0.4s; }
.fade-up-4 { animation: fadeInUp 0.8s ease both 0.55s; }
.cta-pulse  { animation: pulse-glow 2.5s ease-in-out infinite; }
.logo-icon  { animation: float 3.5s ease-in-out infinite; }

/* Logo mark */
.logo-mark {
  width: 38px; height: 38px;
  background: linear-gradient(135deg, #1a1a1a 0%, #111 100%);
  border: 1.5px solid rgba(249,115,22,0.6);
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  position: relative;
  box-shadow: 0 0 14px rgba(249,115,22,0.25), inset 0 0 8px rgba(249,115,22,0.08);
}
.logo-mark svg { color: #f97316; }

/* Pricing card hover lift */
.pricing-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
.pricing-card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
.pricing-popular { transform: scale(1.05); }
.pricing-popular:hover { transform: scale(1.05) translateY(-6px); }

/* Star rating */
.star-btn { transition: transform 0.15s ease; cursor: pointer; background: none; border: none; padding: 2px; }
.star-btn:hover { transform: scale(1.25); }

/* Scroll-snap pricing */
@media (max-width: 768px) {
  .pricing-scroll { display: flex; gap: 16px; overflow-x: auto; scroll-snap-type: x mandatory; padding-bottom: 12px; }
  .pricing-scroll::-webkit-scrollbar { height: 4px; }
  .pricing-scroll::-webkit-scrollbar-thumb { background: #f97316; border-radius: 4px; }
  .pricing-card-wrap { min-width: 80vw; scroll-snap-align: start; flex-shrink: 0; }
}
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.animate-marquee {
  display: flex;
  white-space: nowrap;
  animation: marquee 30s linear infinite;
}
.animate-marquee:hover {
  animation-play-state: paused;
}
`;

const WA_NUMBER = "917675957990";
const WA_MSG = encodeURIComponent("Hi, I want to book ClickCutGo for my event.");
const waLink = `https://wa.me/${WA_NUMBER}?text=${WA_MSG}`;

/* ─── Logo Component ─────────────────────────────────────────────────── */
const Logo = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const imgSize = size === "lg" ? "200px" : size === "sm" ? "90px" : "160px";
  return (
    <div
      className="flex-shrink-0"
      style={{
        width: imgSize,
        height: imgSize,
        position: "relative",
      }}
    >
      <img
        src={logoImg}
        alt="ClickCutGo Logo"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          display: "block",
          mixBlendMode: "screen",
          filter: "saturate(1.8) brightness(1.4) contrast(1.15)",
        }}
      />
    </div>
  );
};

/* ─── Star Rating Component ──────────────────────────────────────────── */
const StarRating = ({ value, onChange, label }: { value: number; onChange: (n: number) => void; label: string }) => (
  <div className="mb-1">
    <label className="block text-sm font-bold mb-2 text-foreground">{label}</label>
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className="star-btn"
          onClick={() => onChange(n)}
          aria-label={`${n} star`}
        >
          <Star
            size={26}
            className={n <= value ? "text-primary fill-primary" : "text-muted-foreground/40"}
          />
        </button>
      ))}
    </div>
  </div>
);

/* ─── Main Component ─────────────────────────────────────────────────── */
const Index = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [feedback, setFeedback] = useState({
    name: "", phone: "", eventType: "", eventDate: "",
    overallRating: 0, deliveryRating: 0,
    experience: "", wouldRecommend: "", permission: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [showCreatorForm, setShowCreatorForm] = useState(false);
  const [creatorData, setCreatorData] = useState({
    name: "", phone: "", portfolioUrl: "", instagramHandle: "",
    experienceLevel: "", about: ""
  });
  const [creatorSubmitted, setCreatorSubmitted] = useState(false);
  const [creatorSubmitting, setCreatorSubmitting] = useState(false);
  const [creatorError, setCreatorError] = useState("");



  const toggleFaq = (i: number) => setOpenFaq(openFaq === i ? null : i);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedback),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setSubmitted(true);
    } catch (err: any) {
      setSubmitError(err.message || "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreatorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatorSubmitting(true);
    setCreatorError("");

    try {
      const res = await fetch("/api/creators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(creatorData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setCreatorSubmitted(true);
    } catch (err: any) {
      setCreatorError(err.message || "Failed to submit application.");
    } finally {
      setCreatorSubmitting(false);
    }
  };

  /* ─── DATA ──────────────────────────────────────────────────────── */

  /* Event Plans (non-wedding) */
  const eventPlans = [
    {
      tier: "Express Reel",
      price: "₹1,999",
      features: [
        "1 Hour Shoot",
        "1 Edited Reel",
        "Shot on Latest iPhone",
        "ClickCutGo Signature Branding",
      ],
    },
    {
      tier: "Creator Pro",
      price: "₹4,999",
      isPopular: true,
      features: [
        "Up to 3 Hours Shoot",
        "3 Edited Reels",
        "ClickCutGo Signature Branding",
      ],
    },
  ];

  /* Wedding Plans */
  const weddingPlans = [
    {
      tier: "Signature Wedding",
      price: "₹14,999",
      features: [
        "1 Event Coverage",
        "3 Reels",
        "Portraits",
        "Raw Data",
      ],
    },
    {
      tier: "Grand Wedding",
      price: "₹24,999",
      features: [
        "2 Events Coverage",
        "6 Reels",
        "Portraits",
        "Raw Data",
      ],
    },
    {
      tier: "Royal Wedding Experience",
      price: "₹39,999",
      features: [
        "3 Events Coverage",
        "10 Reels",
        "Portraits",
        "Onsite Creator",
        "Raw Data",
      ],
    },
  ];

  const addOns = [
    { icon: "⏱️", text: "1 Hour Extra Shoot" },
    { icon: "🎬", text: "1 Additional Reel" },
    { icon: "💾", text: "Raw Footage Add-On" },
    { icon: "⚡", text: "Express Priority Edit" },
  ];

  const whyUs = [
    { icon: <Zap size={20} />, title: "Delivered Before Event Ends", desc: "Post while the energy is still live. Same day, every time." },
    { icon: <Clock size={20} />, title: "Real-Time Editing", desc: "We edit on the spot. No delays. No follow-ups. Done before you leave." },
    { icon: <Star size={20} />, title: "100% Shot on iPhone", desc: "Native 4K vertical video, shot & edited on iPhone. Built exactly for Instagram Reels." },
    { icon: <Users size={20} />, title: "Limited Slots Per Day", desc: "Only 3 bookings/day so every client gets our full attention." },
    { icon: <Shield size={20} />, title: "50% Refund Guarantee", desc: "Late? You get 50% back. No questions asked." },
  ];



  const steps = [
    { num: "01", title: "Book in 30 Seconds", desc: "Pick your package. Lock your slot instantly via WhatsApp." },
    { num: "02", title: "Creator Arrives On Time", desc: "iPhone ready. Eye sharp. Energy matched to your event." },
    { num: "03", title: "Shot & Edited on iPhone, Live", desc: "Every frame captured and cut on iPhone, right at your event, in real time." },
    { num: "04", title: "Reel Delivered Instantly", desc: "Instagram-ready 9:16 reel handed to you before you leave the venue." },
  ];

  const faqs = [
    { q: "How fast do you deliver the reels?", a: "Your first teaser reel is ready within 10 minutes of a key moment. We edit live at the event and full reels are delivered same-day." },
    { q: "What camera do you use?", a: "Everything is shot and edited entirely on iPhone. 4K vertical, native 9:16 format, perfect for Instagram Reels. No heavy gear, no setup time. Just fast, clean content." },
    { q: "What events do you cover?", a: "Weddings, corporate events, college fests, brand launches, influencer meetups, award ceremonies, and more." },
    { q: "How do I book?", a: "Click 'Book Now' or message us on WhatsApp at +91 76759 57990. Same-day bookings close at 6 PM." },
    { q: "How long is each reel?", a: "Reels are 30–45 seconds for most packs, optimised for Instagram Reels and short-form platforms." },
    { q: "What makes ClickCutGo different?", a: "We shoot & edit entirely on iPhone at your venue, in real time. No waiting days for a file. Your reel is ready before the event ends, with a 50% refund guarantee if we're ever late." },
    { q: "Is raw footage included?", a: "Raw footage is included in the Signature Wedding, Grand Wedding, and Royal Wedding Experience packs. It can also be purchased as an Add-On." },
    { q: "Do you travel outside Hyderabad?", a: "Travel is included within Hyderabad city limits. Outstation coverage is available for premium packages at an additional charge." },
  ];

  /* ─── RENDER ─────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{globalStyles}</style>

      {/* ── NAV ───────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-black/90 backdrop-blur-md border-b border-white/8" style={{ minHeight: "90px", paddingTop: "6px", paddingBottom: "6px", paddingLeft: "24px", paddingRight: "24px" }}>
        <a href="/" className="flex items-center">
          <Logo size="md" />
        </a>
        <div className="hidden md:flex items-center gap-7 text-sm font-semibold text-white/60">
          <a href="/" className="hover:text-white transition-colors">Home</a>
          <a href="#how" className="hover:text-white transition-colors">How It Works</a>
          <a href="#why" className="hover:text-white transition-colors">Why ClickCutGo</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#pricing" className="hover:text-white transition-colors">Events</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </div>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="cta-pulse bg-primary text-white px-5 py-2.5 rounded-xl font-black text-sm hover:opacity-90 transition-opacity"
        >
          Book Now
        </a>
      </nav>

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-5 pt-20 pb-16 overflow-hidden">
        {/* Wedding background image */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroBgImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center 25%",
          }}
        />
        {/* Layered dark overlays for depth */}
        <div className="absolute inset-0 z-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.75) 100%)" }} />

        {/* Subtle orange vignette */}
        <div className="absolute bottom-0 left-0 right-0 h-40 z-0" style={{ background: "linear-gradient(to top, rgba(249,115,22,0.12), transparent)" }} />

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Launch badge */}
          <div className="fade-up-1 inline-flex items-center gap-2 mb-7 px-5 py-2 rounded-full border border-primary/50 bg-primary/10 text-primary text-xs font-black uppercase tracking-widest backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Now Launching in Hyderabad – Limited Creator Slots
          </div>

          <h1 className="fade-up-2 text-5xl sm:text-6xl md:text-7xl font-black leading-[1.05] mb-5" style={{ textShadow: "0 2px 30px rgba(0,0,0,0.8)" }}>
            Instant Reel Creation<br />
            <span style={{ color: "#f97316", textShadow: "0 0 40px rgba(249,115,22,0.5)" }}>
              for Events in Hyderabad
            </span>
          </h1>

          <p className="fade-up-3 text-lg md:text-2xl font-semibold mb-10" style={{ color: "rgba(255,255,255,0.88)", textShadow: "0 1px 12px rgba(0,0,0,0.6)" }}>
            Shoot. Edit. Deliver. Before Your Event Ends.
          </p>

          <div className="fade-up-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-pulse flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-black text-lg hover:opacity-95 transition-opacity shadow-2xl shadow-orange-500/30 w-full sm:w-auto justify-center"
            >
              Book Creator Now <ArrowRight size={20} />
            </a>
            <a
              href="#how"
              className="flex items-center gap-2 border border-white/30 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-colors backdrop-blur-sm w-full sm:w-auto justify-center"
            >
              <Play size={16} /> See How It Works
            </a>
          </div>

          {/* Trust signals row */}
          <div className="fade-up-4 flex flex-wrap items-center justify-center gap-5 mt-10">
            {["🚀 Now Launching in Hyderabad", "⚡ Delivered Live"].map((t, i) => (
              <span key={i} className="text-xs font-bold text-white/70 tracking-wide">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST MARQUEE ─────────────────────────────────────────── */}
      <div className="py-6 bg-white/5 border-y border-white/5 overflow-hidden">
        <div className="animate-marquee flex gap-12 items-center">
          {[
            "Weddings", "Brand Launches", "Influencer Meetups", "Corporate Gigs",
            "College Fests", "Concert Tours", "Nightlife Events", "Award Nights",
            "Store Openings", "Fashion Shows", "Private Gigs"
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 min-w-max">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-white font-black text-sm uppercase tracking-[0.2em]">{item}</span>
            </div>
          ))}
          {[
            "Weddings", "Brand Launches", "Influencer Meetups", "Corporate Gigs",
            "College Fests", "Concert Tours", "Nightlife Events", "Award Nights",
            "Store Openings", "Fashion Shows", "Private Gigs"
          ].map((item, i) => (
            <div key={`dup-${i}`} className="flex items-center gap-4 min-w-max">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-white font-black text-sm uppercase tracking-[0.2em]">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ──────────────────────────────────────────── */}
      <section id="how" className="py-20 px-6 bg-black/60">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-2">Zero Friction. <span className="text-primary">Maximum Impact.</span></h2>
          <p className="text-muted-foreground mb-12">From booking to your reel going viral. In minutes.</p>



          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center p-6 bg-card rounded-2xl border border-border hover:border-primary/60 transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary text-white font-black text-sm flex items-center justify-center mb-4">
                  {i + 1}
                </div>
                <h3 className="font-black text-base mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US + GUARANTEE MERGED ─────────────────────────────── */}
      <section id="why" className="py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-2">
            Why Hyderabad Chooses <span className="text-primary">ClickCutGo</span>
          </h2>
          <p className="text-muted-foreground mb-12">Premium. Dependable. Built to dominate the feed.</p>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-5">
            {whyUs.map((w, i) => (
              <div key={i} className="flex flex-col items-start p-6 bg-card border border-border rounded-2xl hover:border-primary/50 transition-colors text-left group">
                <div className="text-primary mb-3 p-2.5 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">{w.icon}</div>
                <h3 className="font-black text-sm mb-1 leading-snug">{w.title}</h3>
                <p className="text-muted-foreground text-xs">{w.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 inline-flex items-center gap-4 px-7 py-5 bg-primary/10 border border-primary/30 rounded-2xl max-w-xl mx-auto">
            <span className="text-3xl">🛡️</span>
            <p className="text-foreground font-bold text-sm text-left">
              <span className="text-primary font-black">50% Refund Guarantee</span><br />
              <span className="text-muted-foreground text-xs">If your reel isn't delivered during your event, you get 50% back. No questions asked.</span>
            </p>
          </div>
        </div>
      </section>



      {/* ── EVENTS WE COVER ───────────────────────────────────────── */}
      <section className="py-16 px-6 bg-card/20">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-2">Built for Events <span className="text-primary">That Matter.</span></h2>
          <p className="text-muted-foreground mb-10">From college fests to weddings — we deliver every time.</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {["College Fests", "Brand Launches", "Influencer Meetups", "Weddings", "Corporate Events"].map((name, i) => (
              <div key={i} className="p-5 bg-card border border-border rounded-2xl hover:border-primary transition-colors cursor-default">
                <p className="font-black text-sm">{name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── URGENCY BANNER ────────────────────────────────────────── */}
      <section className="py-14 px-6 bg-primary/10 border-y border-primary/20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 bg-primary/20 rounded-full">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <span className="text-primary text-xs font-black uppercase tracking-widest">Live · Slots Filling Now</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-3">Don't Let Your Event<br /><span className="text-primary">Go Unnoticed.</span></h2>
          <p className="text-muted-foreground mb-2">Limited creators available. Same-day bookings close at 6 PM.</p>
          <p className="text-sm text-primary font-bold mb-8">Every event without reels is a moment lost forever.</p>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-black text-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary/30"
          >
            Secure Your Slot <ArrowRight size={20} />
          </a>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────────── */}
      < section id="pricing" className="py-20 px-4 md:px-6" >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-2">
            Simple. Clear. <span className="text-primary">No Surprises.</span>
          </h2>
          <p className="text-muted-foreground mb-12">Pick what fits your event. All packages include Hyderabad city travel.</p>

          {/* ── EVENT PLANS ─────────────────────────────────────── */}
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
            {eventPlans.map((plan, i) => (
              <div
                key={i}
                className={`pricing-card relative flex flex-col rounded-2xl border transition-all p-7 ${plan.isPopular
                  ? "pricing-popular border-primary bg-gradient-to-b from-primary/20 to-primary/5 ring-2 ring-primary shadow-2xl shadow-primary/25"
                  : "border-border bg-card"
                  }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[11px] font-black px-4 py-1.5 rounded-full whitespace-nowrap shadow-lg">
                    🔥 Most Popular
                  </div>
                )}

                <h3 className="font-black text-2xl mb-1 mt-2">{plan.tier}</h3>
                <div className="mb-6">
                  <span className="text-5xl font-black" style={{ color: "#f97316" }}>{plan.price}</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1 text-left">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-foreground">
                      <Check size={16} className="text-primary flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full text-center py-3.5 rounded-xl font-black text-sm transition-all hover:opacity-90 block ${plan.isPopular
                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                    : "border border-primary text-primary hover:bg-primary hover:text-white"
                    }`}
                >
                  👉 Book Now
                </a>
              </div>
            ))}
          </div>

          {/* ── WEDDING DIVIDER ─────────────────────────────────── */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 mb-4 px-5 py-2 rounded-full border border-primary/40 bg-primary/10">
              <span className="text-lg">💍</span>
              <span className="text-primary text-xs font-black uppercase tracking-widest">For Your Special Day</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-black mb-2">
              Wedding <span className="text-primary">Experiences</span>
            </h3>
            <p className="text-muted-foreground">Starting from <span className="text-primary font-black text-lg">₹14,999</span></p>
          </div>

          {/* ── WEDDING PLANS ──────────────────────────────────── */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
            {weddingPlans.map((plan, i) => (
              <div
                key={i}
                className={`pricing-card relative flex flex-col rounded-2xl border transition-all p-7 ${i === 2
                  ? "border-amber-500/50 bg-gradient-to-b from-amber-500/10 to-amber-500/5 ring-1 ring-amber-500/30"
                  : i === 1
                    ? "border-primary/40 bg-gradient-to-b from-primary/10 to-primary/5"
                    : "border-border bg-card"
                  }`}
              >
                {i === 2 && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[11px] font-black px-4 py-1.5 rounded-full whitespace-nowrap shadow-lg">
                    👑 Premium
                  </div>
                )}

                <h3 className="font-black text-xl mb-1 mt-2">{plan.tier}</h3>
                <div className="mb-5">
                  <span className="text-4xl font-black" style={{ color: "#f97316" }}>{plan.price}</span>
                </div>

                <ul className="space-y-3 mb-5 flex-1 text-left">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-foreground">
                      <Check size={16} className="text-primary flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Complimentary Pen Drive callout */}
                <div className="flex items-center gap-2 mb-4 px-3 py-2.5 bg-primary/10 border border-primary/20 rounded-xl">
                  <span className="text-base">🎁</span>
                  <span className="text-xs font-bold text-primary">Complimentary Pen Drive</span>
                </div>

                {/* Signature Branding */}
                <div className="flex items-center gap-2 mb-5 text-xs text-muted-foreground font-semibold">
                  <Check size={14} className="text-primary flex-shrink-0" />
                  ClickCutGo Signature Branding
                </div>
              </div>
            ))}
          </div>

          {/* Secure Your Date CTA */}
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-pulse inline-flex items-center gap-2 bg-primary text-white px-10 py-4 rounded-2xl font-black text-lg hover:opacity-90 transition-opacity shadow-2xl shadow-primary/30"
          >
            👉 Secure Your Date <ArrowRight size={20} />
          </a>

          {/* Add-Ons */}
          <div className="mt-14 max-w-2xl mx-auto">
            <div className="bg-card border border-border rounded-2xl p-8">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Plus size={18} className="text-primary" />
                <h3 className="font-black text-lg">Power Add-Ons</h3>
              </div>
              <p className="text-primary font-black text-2xl mb-5">₹1,250 Each</p>
              <div className="grid grid-cols-2 gap-4">
                {addOns.map((a, i) => (
                  <div key={i} className="flex items-center gap-3 bg-background border border-border rounded-xl px-4 py-3">
                    <span className="text-xl">{a.icon}</span>
                    <span className="text-sm font-semibold">{a.text}</span>
                  </div>
                ))}
              </div>
              <p className="text-muted-foreground text-xs mt-5 italic">Add-ons can be selected during booking on WhatsApp.</p>
            </div>
          </div>

          {/* WA quick chat */}
          <div className="mt-8 p-6 bg-card border border-border rounded-2xl max-w-xs mx-auto">
            <p className="text-sm text-muted-foreground mb-3">Not sure which plan? Talk to us — we'll pick for you.</p>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
            >
              <MessageCircle size={16} /> Ask on WhatsApp
            </a>
          </div>
        </div>
      </section>



      {/* ── JOIN AS CREATOR ───────────────────────────────────────── */}
      < section className="py-20 px-6" >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-3">Got the Eye for Reels?</h2>
          <p className="text-primary font-bold text-lg mb-3">Join India's fastest reel creator network.</p>
          <p className="text-muted-foreground mb-8">Elite creators. Top-tier gigs. Premium pay. We only work with the best.</p>
          <button
            onClick={() => setShowCreatorForm(true)}
            className="inline-flex items-center gap-2 border border-primary text-primary px-8 py-4 rounded-xl font-black text-lg hover:bg-primary hover:text-white transition-colors"
          >
            Apply as Creator <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* ── CREATOR FORM MODAL ─────────────────────────────────────── */}
      {
        showCreatorForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-card border border-border rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl">
              <button
                onClick={() => setShowCreatorForm(false)}
                className="absolute top-6 right-6 text-muted-foreground hover:text-white transition-colors"
              >
                ✕
              </button>

              {creatorSubmitted ? (
                <div className="text-center py-10">
                  <div className="text-5xl mb-4">✨</div>
                  <h3 className="font-black text-2xl mb-2">Application Received!</h3>
                  <p className="text-muted-foreground">We'll review your portfolio and get in touch via WhatsApp/Phone soon.</p>
                  <button
                    onClick={() => setShowCreatorForm(false)}
                    className="mt-8 bg-primary text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <div>
                  <h2 className="text-3xl font-black mb-2">Join the <span className="text-primary">Crew</span></h2>
                  <p className="text-muted-foreground mb-8 text-sm">Fill out this quick form and our team will get in touch.</p>

                  <form onSubmit={handleCreatorSubmit} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-black mb-2">Your Name *</label>
                        <input
                          required
                          type="text"
                          placeholder="Ananya Sharma"
                          value={creatorData.name}
                          onChange={(e) => setCreatorData({ ...creatorData, name: e.target.value })}
                          className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-black mb-2">WhatsApp / Phone *</label>
                        <input
                          required
                          type="tel"
                          placeholder="9876543210"
                          value={creatorData.phone}
                          onChange={(e) => setCreatorData({ ...creatorData, phone: e.target.value })}
                          className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-black mb-2">Portfolio / Reel Link *</label>
                        <input
                          required
                          type="url"
                          placeholder="Link to your best work"
                          value={creatorData.portfolioUrl}
                          onChange={(e) => setCreatorData({ ...creatorData, portfolioUrl: e.target.value })}
                          className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-black mb-2">Instagram Handle</label>
                        <input
                          type="text"
                          placeholder="@yourhandle"
                          value={creatorData.instagramHandle}
                          onChange={(e) => setCreatorData({ ...creatorData, instagramHandle: e.target.value })}
                          className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-black mb-2">Experience Level</label>
                      <select
                        value={creatorData.experienceLevel}
                        onChange={(e) => setCreatorData({ ...creatorData, experienceLevel: e.target.value })}
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors"
                      >
                        <option value="">Select experience</option>
                        <option>Fresh Talent (0-1 year)</option>
                        <option>Experienced (1-3 years)</option>
                        <option>Pro Creator (3+ years)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-black mb-2">Tell us about yourself (optional)</label>
                      <textarea
                        rows={3}
                        placeholder="Why do you want to join ClickCutGo?"
                        value={creatorData.about}
                        onChange={(e) => setCreatorData({ ...creatorData, about: e.target.value })}
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors resize-none"
                      />
                    </div>

                    {creatorError && (
                      <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs">
                        {creatorError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={creatorSubmitting}
                      className="w-full bg-primary text-white py-4 rounded-2xl font-black text-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 disabled:opacity-50"
                    >
                      {creatorSubmitting ? "Submitting..." : "Submit Application"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )
      }

      {/* ── FEEDBACK FORM (Redesigned) ─────────────────────────────── */}
      <section id="contact" className="py-20 px-6 bg-card/20">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-2">
            Loved Your Experience? <span className="text-primary">Tell Us.</span>
          </h2>
          <p className="text-muted-foreground mb-10">Your 60-second review helps us get better and helps others book confidently.</p>

          {submitted ? (
            <div className="p-10 bg-card border border-primary/30 rounded-3xl">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="font-black text-2xl mb-2">Thank you!</h3>
              <p className="text-muted-foreground">We read every word. Your feedback means the world to us.</p>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity">
                <MessageCircle size={16} /> Book Your Next Event
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-3xl p-8 text-left space-y-6">

              {/* Name + Phone */}
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-black mb-2">Your Name <span className="text-primary">*</span></label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Ananya Sharma"
                    value={feedback.name}
                    onChange={(e) => setFeedback({ ...feedback, name: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black mb-2">WhatsApp / Phone</label>
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={feedback.phone}
                    onChange={(e) => setFeedback({ ...feedback, phone: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {/* Event Type + Date */}
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-black mb-2">Event Type</label>
                  <select
                    value={feedback.eventType}
                    onChange={(e) => setFeedback({ ...feedback, eventType: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="">Select event type</option>
                    <option>Wedding</option>
                    <option>Corporate Event</option>
                    <option>College Fest</option>
                    <option>Brand Launch</option>
                    <option>Influencer Meetup</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-black mb-2">Event Date</label>
                  <input
                    type="date"
                    value={feedback.eventDate}
                    onChange={(e) => setFeedback({ ...feedback, eventDate: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {/* Star ratings */}
              <div className="grid md:grid-cols-2 gap-6 p-5 bg-background border border-border rounded-2xl">
                <StarRating
                  label="Overall Experience"
                  value={feedback.overallRating}
                  onChange={(n) => setFeedback({ ...feedback, overallRating: n })}
                />
                <StarRating
                  label="Delivery Speed"
                  value={feedback.deliveryRating}
                  onChange={(n) => setFeedback({ ...feedback, deliveryRating: n })}
                />
              </div>

              {/* Would recommend */}
              <div>
                <label className="block text-sm font-black mb-3">Would you recommend ClickCutGo to a friend?</label>
                <div className="flex gap-3 flex-wrap">
                  {["Absolutely! 🔥", "Yes, definitely", "Maybe", "Not sure"].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFeedback({ ...feedback, wouldRecommend: opt })}
                      className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${feedback.wouldRecommend === opt
                        ? "bg-primary text-white border-primary"
                        : "border-border text-muted-foreground hover:border-primary/50"
                        }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Open text */}
              <div>
                <label className="block text-sm font-black mb-2">Share your experience (optional)</label>
                <textarea
                  rows={4}
                  placeholder="What did you love? What can we improve? Your words help future clients decide..."
                  value={feedback.experience}
                  onChange={(e) => setFeedback({ ...feedback, experience: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              {/* Permission checkbox */}
              <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                <input
                  type="checkbox"
                  id="permission"
                  checked={feedback.permission}
                  onChange={(e) => setFeedback({ ...feedback, permission: e.target.checked })}
                  className="w-4 h-4 accent-primary"
                />
                <label htmlFor="permission" className="text-sm text-muted-foreground cursor-pointer">
                  ✅ I give ClickCutGo permission to share my review on their page.
                </label>
              </div>

              {submitError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-white py-4 rounded-2xl font-black text-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit My Review"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      <section id="faq" className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-12">
            Got Questions? <span className="text-primary">We've Got Answers.</span>
          </h2>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden">
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left font-bold hover:bg-muted/30 transition-colors"
                >
                  <span className="pr-4">{f.q}</span>
                  <ChevronDown size={18} className={`text-primary flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-muted-foreground text-sm leading-relaxed">
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────── */}
      <section className="py-24 px-6 text-center bg-gradient-to-b from-background via-primary/8 to-primary/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
            Your Event Happens<br />
            <span className="text-primary">Once.</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-2">Make it unforgettable. Make it go viral.</p>
          <p className="text-primary font-black text-xl mb-10">Book Now. Go Live. Rule the Feed.</p>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-pulse inline-flex items-center gap-3 bg-primary text-white px-12 py-6 rounded-2xl font-black text-xl hover:opacity-90 transition-opacity shadow-2xl shadow-primary/35"
          >
            Book Creator Now <ArrowRight size={24} />
          </a>
          <p className="text-xs text-muted-foreground mt-5">Instant confirmation via WhatsApp · No advance payment required to enquire</p>
        </div>
      </section>

      {/* ── SEO CONTENT SECTION ────────────────────────────────────── */}
      <section className="py-20 px-6 bg-card/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-10">
            Hyderabad's Go-To for <span className="text-primary">Instant Event Reels</span>
          </h2>

          <div className="space-y-8 text-muted-foreground leading-relaxed text-[15px]">
            <p>
              ClickCutGo brings real-time reel creation to events across Hyderabad. From college fests to weddings and brand launches, we shoot and edit your Instagram-ready reel live, before the energy fades.
            </p>

            <div className="border-l-2 border-primary pl-5">
              <p className="text-foreground font-bold text-lg">
                This isn't traditional videography.<br />This is instant content.
              </p>
            </div>

            <p>
              Our creators capture your best moments in vertical 9:16, edit on-site, and deliver your reel before you leave the venue. No waiting for days. No chasing edits. No back-and-forth.
            </p>

            <div className="border-l-2 border-primary pl-5">
              <p className="text-foreground font-bold text-lg">
                Events move fast. Trends move faster.
              </p>
            </div>

            <p>
              Posting during the event boosts engagement while the vibe is still alive. That's why instant reel delivery matters. When your audience sees it live, it hits differently.
            </p>

            <p>
              Whether it's a wedding highlight, influencer meetup, corporate event, or college fest performance, we turn moments into scroll-stopping reels in real time.
            </p>

            <div className="bg-card border border-border rounded-2xl p-8 my-10">
              <h3 className="text-xl font-black text-foreground mb-5">Why Hyderabad chooses ClickCutGo</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  "Live shooting + live editing",
                  "Limited slots for focused attention",
                  "Vertical 4K iPhone production",
                  "Built for Instagram from the start",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-background rounded-xl px-4 py-3 border border-border">
                    <Check size={16} className="text-primary flex-shrink-0" />
                    <span className="text-sm font-semibold text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <p>
              If you're looking for instant event reels in Hyderabad that feel premium, fast, and built to perform, this is it.
            </p>

            <div className="text-center py-6">
              <p className="text-foreground font-black text-2xl">Your event happens once.</p>
              <p className="text-primary font-black text-2xl mt-1">Your reel should be ready instantly.</p>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-6 text-primary font-bold hover:underline"
              >
                Secure your slot before today's bookings close <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <footer className="py-14 px-6 border-t border-border bg-card/10">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-10 mb-10">
            {/* Column 1: Brand */}
            <div>
              <Logo size="sm" />
              <p className="text-muted-foreground text-sm mt-3">Instant reel creation for events.</p>
              <p className="text-muted-foreground text-xs mt-1">📍 Hyderabad, India</p>
              <div className="mt-4 space-y-2">
                <p className="text-muted-foreground text-sm flex items-center gap-2">
                  <Mail size={14} className="text-primary flex-shrink-0" />
                  <a href="mailto:hello@clickcutgo.in" className="hover:text-primary transition-colors">hello@clickcutgo.in</a>
                </p>
                <p className="text-muted-foreground text-sm flex items-center gap-2">
                  <Phone size={14} className="text-primary flex-shrink-0" />
                  <a href={waLink} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">+91 76759 57990</a>
                </p>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="font-black text-sm mb-4 text-foreground">Quick Links</h4>
              <div className="flex flex-col gap-2.5 text-sm text-muted-foreground">
                <a href="#how" className="hover:text-primary transition-colors">How It Works</a>
                <a href="#why" className="hover:text-primary transition-colors">Why Us</a>
                <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
                <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
              </div>
            </div>

            {/* Column 3: Legal + Social */}
            <div>
              <h4 className="font-black text-sm mb-4 text-foreground">Legal</h4>
              <div className="flex flex-col gap-2.5 text-sm text-muted-foreground">
                <a href="/refund-policy" className="hover:text-primary transition-colors">Refund Policy</a>
                <a href="/terms-and-conditions" className="hover:text-primary transition-colors">Terms & Conditions</a>
              </div>
              <h4 className="font-black text-sm mt-6 mb-3 text-foreground">Follow Us</h4>
              <a
                href="https://instagram.com/clickcutgo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                @clickcutgo
              </a>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-6 border-t border-border/50 flex items-center justify-center">
            <p className="text-muted-foreground/50 text-xs">© 2026 ClickCutGo. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* ── Floating WhatsApp ──────────────────────────────────────── */}
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-[#25D366] text-white rounded-full shadow-xl hover:scale-105 transition-transform px-4 py-3 md:px-5 md:py-3.5"
        aria-label="Chat on WhatsApp"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
        <span className="text-sm font-black hidden md:block">Chat Now</span>
      </a>
    </div>
  );
};

export default Index;