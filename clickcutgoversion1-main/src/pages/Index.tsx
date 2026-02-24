import { useState } from "react";
import logoImg from "@/assets/logo.jpg";
import heroBgImg from "@/assets/hero_wedding.jpg";
import { Check, Zap, Clock, Star, Shield, Users, ChevronDown, MessageCircle, ArrowRight, Play, Plus } from "lucide-react";

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
`;

const WA_NUMBER = "917675957990";
const WA_MSG = encodeURIComponent("Hi, I want to book ClickCutGo for my event.");
const waLink = `https://wa.me/${WA_NUMBER}?text=${WA_MSG}`;

/* ─── Logo Component ─────────────────────────────────────────────────── */
const Logo = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const imgSize = size === "lg" ? "110px" : size === "sm" ? "64px" : "90px";
  return (
    /* isolation: isolate keeps mix-blend-mode contained to the logo only */
    <div
      className="logo-icon flex-shrink-0"
      style={{
        width: imgSize,
        height: imgSize,
        isolation: "isolate",
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
          /* screen blend makes the white bg transparent on dark backgrounds */
          mixBlendMode: "screen",
          /* Punch up the red colour to make it vivid */
          filter: "saturate(1.4) brightness(1.2)",
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
  const toggleFaq = (i: number) => setOpenFaq(openFaq === i ? null : i);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true); };

  /* ─── DATA ──────────────────────────────────────────────────────── */

  /**
   * PRICING STRATEGY (Business Strategist Logic):
   * - Spark: Low entry. Hooks the customer. Zero risk.
   * - Rise: Mid-range. Gives more, signals seriousness.
   * - Signature: ANCHOR. Most popular. Priced to feel "just right" (Goldilocks effect).
   * - Creator: Aspirational. Premium without being extreme. User-specified.
   * - Legacy: Prestige tier. Loss-aversion headline. Only for high-stakes events.
   */
  const pricingPlans = [
    {
      tier: "Spark",
      price: "₹1,999",
      hook: "Your first viral moment",
      badge: null,
      isPopular: false,
      features: [
        { text: "1 Reel (30–45 sec)", included: true },
        { text: "1 Hour Shoot", included: true },
        { text: "Basic Edit", included: true },
        { text: "Same-Day Delivery", included: true },
        { text: "Hyderabad Travel Included", included: true },
        { text: "Watermark on Reel", included: false },
        { text: "Raw Footage", included: false },
      ],
      cta: "Start Here",
      ctaNote: "Perfect for first-timers",
    },
    {
      tier: "Rise",
      price: "₹4,999",
      hook: "Events that deserve a story",
      badge: null,
      isPopular: false,
      features: [
        { text: "3 Reels (30–45 sec each)", included: true },
        { text: "3 Hours Shoot", included: true },
        { text: "Custom Edits", included: true },
        { text: "No Watermark", included: true },
        { text: "Same-Day Delivery", included: true },
        { text: "Hyderabad Travel Included", included: true },
        { text: "Raw Footage", included: false },
      ],
      cta: "Book Rise",
      ctaNote: "Great for brand events",
    },
    {
      tier: "Signature",
      price: "₹6,999",
      hook: "The complete event package",
      badge: "Most Chosen",
      isPopular: true,
      features: [
        { text: "6 Reels (30–45 sec each)", included: true },
        { text: "On-Spot Editing", included: true },
        { text: "3–4 Hours Coverage", included: true },
        { text: "No Watermark", included: true },
        { text: "Raw Footage Included", included: true },
        { text: "Hyderabad Travel Included", included: true },
        { text: "Priority Support", included: true },
      ],
      cta: "Book Signature",
      ctaNote: "Loved by 80% of clients",
    },
    {
      tier: "Creator",
      price: "₹9,999",
      hook: "Full professional coverage",
      badge: null,
      isPopular: false,
      features: [
        { text: "6 Reels (Custom Length)", included: true },
        { text: "3–4 Hours Coverage", included: true },
        { text: "Raw Footage Included", included: true },
        { text: "1 Dedicated Onsite Creator", included: true },
        { text: "Complimentary Portraits", included: true },
        { text: "No Watermark", included: true },
        { text: "Priority Delivery", included: true },
      ],
      cta: "Book Creator",
      ctaNote: "Best for weddings & launches",
    },
    {
      tier: "Legacy",
      price: "₹14,999",
      hook: "Your event, immortalized",
      badge: "High-Impact Events",
      isPopular: false,
      features: [
        { text: "15 Reels", included: true },
        { text: "4+ Hours Full Coverage", included: true },
        { text: "Dedicated Creator Team", included: true },
        { text: "Premium Cinematic Edit", included: true },
        { text: "Raw + Edited Files", included: true },
        { text: "Priority Delivery", included: true },
        { text: "Complimentary Portraits", included: true },
      ],
      cta: "Book Legacy",
      ctaNote: "For unforgettable events",
    },
  ];

  const addOns = [
    { icon: "⏱️", text: "1 Hour Extra Shoot" },
    { icon: "🎬", text: "1 Additional Reel" },
    { icon: "💾", text: "Raw Footage Add-On" },
    { icon: "⚡", text: "Express Priority Edit" },
  ];

  const whyUs = [
    { icon: <Zap size={20} />, title: "Delivered Before Event Ends", desc: "Post while the energy is still live — same day, every time." },
    { icon: <Clock size={20} />, title: "Real-Time Editing", desc: "We edit on the spot. No delays. No follow-ups. Done before you leave." },
    { icon: <Star size={20} />, title: "100% Shot on iPhone", desc: "Native 4K vertical video, shot & edited on iPhone. Built exactly for Instagram Reels." },
    { icon: <Users size={20} />, title: "Limited Slots Per Day", desc: "Only 3 bookings/day — so every client gets our full attention." },
    { icon: <Shield size={20} />, title: "50% Refund Guarantee", desc: "Late? You get 50% back. No questions asked." },
  ];

  const testimonials = [
    { quote: "Got my reel before the event ended. Absolutely insane quality.", name: "Ananya R.", role: "Event Organizer, Hyderabad", stars: 5 },
    { quote: "Finally, a creator who actually shows up on time and delivers.", name: "Karthik R.", role: "Event Lead, Hyderabad", stars: 5 },
    { quote: "My wedding reel hit 50K views in 2 days. Couldn't be happier!", name: "Sanjana R.", role: "Wedding Planner", stars: 5 },
    { quote: "Our brand launch reel went viral. ClickCutGo is the real deal.", name: "Arjun V.", role: "Marketing Head", stars: 4 },
  ];

  const steps = [
    { num: "01", title: "Book in 30 Seconds", desc: "Pick your package. Lock your slot instantly via WhatsApp." },
    { num: "02", title: "Creator Arrives On Time", desc: "iPhone ready. Eye sharp. Energy matched to your event." },
    { num: "03", title: "Shot & Edited on iPhone — Live", desc: "Every frame captured and cut on iPhone, right at your event, in real time." },
    { num: "04", title: "Reel Delivered Instantly", desc: "Instagram-ready 9:16 reel handed to you before you leave the venue." },
  ];

  const faqs = [
    { q: "How fast do you deliver the reels?", a: "Your first teaser reel is ready within 10 minutes of a key moment. We edit live at the event — full reels delivered same-day." },
    { q: "What camera do you use?", a: "Everything is shot and edited entirely on iPhone — 4K vertical, native 9:16 format, perfect for Instagram Reels. No heavy gear, no setup time. Just fast, clean content." },
    { q: "What events do you cover?", a: "Weddings, corporate events, college fests, brand launches, influencer meetups, award ceremonies, and more." },
    { q: "How do I book?", a: "Click 'Book Now' or message us on WhatsApp at +91 76759 57990. Same-day bookings close at 6 PM." },
    { q: "How long is each reel?", a: "Reels are 30–45 seconds for most packs, optimised for Instagram Reels and short-form platforms." },
    { q: "What makes ClickCutGo different?", a: "We shoot & edit entirely on iPhone at your venue, in real time. No waiting days for a file. Your reel is ready before the event ends — with a 50% refund guarantee if we're ever late." },
    { q: "Is raw footage included?", a: "Raw footage is included in the Signature, Creator, and Legacy packs. It can also be purchased as an Add-On." },
    { q: "Do you travel outside Hyderabad?", a: "Travel is included within Hyderabad city limits. Outstation coverage is available for premium packages at an additional charge." },
  ];

  /* ─── RENDER ─────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{globalStyles}</style>

      {/* ── NAV ───────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-black/90 backdrop-blur-md border-b border-white/8" style={{ minHeight: "68px", paddingTop: "6px", paddingBottom: "6px", paddingLeft: "24px", paddingRight: "24px" }}>
        <a href="/" className="flex items-center">
          <Logo size="md" />
        </a>
        <div className="hidden md:flex items-center gap-7 text-sm font-semibold text-white/60">
          <a href="#how" className="hover:text-white transition-colors">How It Works</a>
          <a href="#why" className="hover:text-white transition-colors">Why Us</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#reviews" className="hover:text-white transition-colors">Reviews</a>
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
            backgroundPosition: "center top",
          }}
        />
        {/* Layered dark overlays for depth */}
        <div className="absolute inset-0 z-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.85) 100%)" }} />

        {/* Subtle orange vignette */}
        <div className="absolute bottom-0 left-0 right-0 h-40 z-0" style={{ background: "linear-gradient(to top, rgba(249,115,22,0.12), transparent)" }} />

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Launch badge */}
          <div className="fade-up-1 inline-flex items-center gap-2 mb-7 px-5 py-2 rounded-full border border-primary/50 bg-primary/10 text-primary text-xs font-black uppercase tracking-widest backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Now Launching in Hyderabad – Limited Creator Slots
          </div>

          <h1 className="fade-up-2 text-5xl sm:text-6xl md:text-7xl font-black leading-[1.05] mb-5" style={{ textShadow: "0 2px 30px rgba(0,0,0,0.8)" }}>
            Own the Event.<br />
            <span style={{ color: "#f97316", textShadow: "0 0 40px rgba(249,115,22,0.5)" }}>
              Rule the Feed.
            </span>
          </h1>

          <p className="fade-up-3 text-lg md:text-2xl font-semibold mb-10" style={{ color: "rgba(255,255,255,0.88)", textShadow: "0 1px 12px rgba(0,0,0,0.6)" }}>
            Shoot. Edit. Deliver — Before Your Event Ends.
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
            {["⭐ 4.8 Avg Rating", "🔒 50% Refund Guarantee", "⚡ Delivered Live"].map((t, i) => (
              <span key={i} className="text-xs font-bold text-white/70 tracking-wide">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────── */}
      <section id="how" className="py-20 px-6 bg-black/60">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-2">Zero Friction. <span className="text-primary">Maximum Impact.</span></h2>
          <p className="text-muted-foreground mb-12">From booking to your reel going viral — in minutes.</p>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center p-6 bg-card rounded-2xl border border-border hover:border-primary/60 transition-colors">
                <div className="text-4xl font-black text-primary/20 mb-2">{s.num}</div>
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
          {/* Guarantee pill */}
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
      <section id="pricing" className="py-20 px-4 md:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-2">
            Simple. Clear. <span className="text-primary">No Surprises.</span>
          </h2>
          <p className="text-muted-foreground mb-3">Pick what fits your event. All packages include Hyderabad city travel.</p>
          <p className="text-xs text-primary/70 font-semibold mb-12 uppercase tracking-widest">Scroll to see all plans →</p>

          {/* Desktop grid / Mobile horizontal scroll */}
          <div className="pricing-scroll md:grid md:grid-cols-3 lg:grid-cols-5 md:gap-4 md:items-start">
            {pricingPlans.map((plan, i) => (
              <div key={i} className="pricing-card-wrap">
                <div
                  className={`pricing-card relative flex flex-col rounded-2xl border transition-all h-full ${plan.isPopular
                    ? "pricing-popular border-primary bg-gradient-to-b from-primary/20 to-primary/5 ring-2 ring-primary shadow-2xl shadow-primary/25 p-7"
                    : plan.badge === "High-Impact Events"
                      ? "border-amber-500/40 bg-card p-6"
                      : "border-border bg-card p-6"
                    }`}
                >
                  {/* Badges */}
                  {plan.isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[11px] font-black px-4 py-1.5 rounded-full whitespace-nowrap shadow-lg">
                      ⭐ Most Chosen
                    </div>
                  )}
                  {plan.badge && !plan.isPopular && (
                    <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 text-[11px] font-black px-3 py-1.5 rounded-full whitespace-nowrap shadow ${plan.badge === "High-Impact Events" ? "bg-amber-500 text-black" : "bg-card border border-primary text-primary"
                      }`}>
                      🔥 {plan.badge}
                    </div>
                  )}

                  {/* Header */}
                  <div className="mt-3 mb-4 text-left">
                    <h3 className="font-black text-xl mb-0.5">{plan.tier}</h3>
                    <p className="text-muted-foreground text-xs">{plan.hook}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-5 text-left">
                    <span className="text-4xl font-black" style={{ color: "#f97316" }}>{plan.price}</span>
                    <span className="text-muted-foreground text-xs ml-1">/ event</span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2.5 mb-6 flex-1">
                    {plan.features.map((f, j) => (
                      <li key={j} className={`flex items-center gap-2.5 text-sm ${f.included ? "text-foreground" : "text-muted-foreground/40 line-through"}`}>
                        {f.included
                          ? <Check size={14} className="text-primary flex-shrink-0" />
                          : <span className="w-3.5 h-3.5 flex-shrink-0 text-center text-xs">✕</span>
                        }
                        {f.text}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full text-center py-3 rounded-xl font-black text-sm transition-all hover:opacity-90 block mb-2 ${plan.isPopular
                      ? "bg-primary text-white shadow-lg shadow-primary/30"
                      : "border border-primary text-primary hover:bg-primary hover:text-white"
                      }`}
                  >
                    {plan.cta}
                  </a>
                  <p className="text-center text-xs text-muted-foreground">{plan.ctaNote}</p>
                </div>
              </div>
            ))}
          </div>

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

      {/* ── TESTIMONIALS ──────────────────────────────────────────── */}
      <section id="reviews" className="py-20 px-6 bg-card/20">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 bg-primary/10 border border-primary/30 rounded-full">
            <span className="text-primary font-black text-xs">⭐ 4.8 Average Rating · Hyderabad Clients</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-2">
            Real Events. <span className="text-primary">Real Results.</span>
          </h2>
          <p className="text-muted-foreground mb-12">Not actors. Not stock reviews. Real clients who booked ClickCutGo.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {testimonials.map((t, i) => (
              <div key={i} className="flex flex-col bg-card border border-border rounded-2xl p-6 text-left hover:border-primary/40 transition-colors">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} size={13} className={s < t.stars ? "text-primary fill-primary" : "text-muted-foreground/20"} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground italic mb-4 flex-1">"{t.quote}"</p>
                <div>
                  <p className="font-black text-sm">{t.name}</p>
                  <p className="text-xs text-primary font-semibold">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── JOIN AS CREATOR ───────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-3">Got the Eye for Reels?</h2>
          <p className="text-primary font-bold text-lg mb-3">Join India's fastest reel creator network.</p>
          <p className="text-muted-foreground mb-8">Elite creators. Top-tier gigs. Premium pay. We only work with the best.</p>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-primary text-primary px-8 py-4 rounded-xl font-black text-lg hover:bg-primary hover:text-white transition-colors"
          >
            Apply as Creator <ArrowRight size={18} />
          </a>
        </div>
      </section>

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

              <button
                type="submit"
                className="w-full bg-primary text-white py-4 rounded-2xl font-black text-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
              >
                Submit My Review
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

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <footer className="py-12 px-6 border-t border-border bg-card/10">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
            <div className="text-center md:text-left">
              <Logo size="md" />
              <p className="text-muted-foreground text-sm mt-2">Hyderabad, India</p>
              <div className="mt-3 space-y-1.5">
                <p className="text-muted-foreground text-sm">
                  📧 <a href="mailto:hello@clickcutgo.in" className="hover:text-primary transition-colors">hello@clickcutgo.in</a>
                </p>
                <p className="text-muted-foreground text-sm">
                  💬 <a href={waLink} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">+91 76759 57990</a>
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-end gap-3">
              <div className="flex flex-wrap gap-5 text-sm text-muted-foreground justify-center md:justify-end">
                <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-foreground transition-colors">Terms & Conditions</a>
                <a href="#" className="hover:text-foreground transition-colors">Refund Policy</a>
              </div>
              <p className="text-muted-foreground/50 text-xs">© 2026 ClickCutGo. All rights reserved.</p>
            </div>
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
        <MessageCircle size={20} />
        <span className="text-sm font-black hidden md:block">Chat Now</span>
      </a>
    </div>
  );
};

export default Index;