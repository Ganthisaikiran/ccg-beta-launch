import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const RefundPolicy = () => (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="max-w-3xl mx-auto px-6 py-16">
            <Link to="/" className="inline-flex items-center gap-2 text-primary font-bold text-sm mb-8 hover:opacity-80 transition-opacity">
                <ArrowLeft size={16} /> Back to Home
            </Link>

            <h1 className="text-4xl font-black mb-2">Refund Policy</h1>
            <p className="text-muted-foreground text-sm mb-10">Last updated: February 2026</p>

            <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
                <section>
                    <h2 className="text-xl font-black text-foreground mb-3">50% Refund Guarantee</h2>
                    <p>At ClickCutGo, we stand by our promise. If your reel is not delivered during your event as agreed, you are entitled to a <strong className="text-foreground">50% refund</strong> — no questions asked.</p>
                </section>

                <section>
                    <h2 className="text-xl font-black text-foreground mb-3">When You're Eligible for a Refund</h2>
                    <ul className="list-disc list-inside space-y-2">
                        <li>If the creator does not arrive at the scheduled time and location.</li>
                        <li>If the final reel is not delivered within the agreed timeframe.</li>
                        <li>If the service was significantly different from what was described at the time of booking.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-black text-foreground mb-3">When Refunds Do Not Apply</h2>
                    <ul className="list-disc list-inside space-y-2">
                        <li>If the event is cancelled by the client without 24 hours' notice.</li>
                        <li>If the client is unsatisfied with creative/editing style (subjective preferences).</li>
                        <li>If event conditions beyond our control (weather, power outages, venue restrictions) prevent service delivery.</li>
                        <li>For add-on services already delivered.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-black text-foreground mb-3">How to Request a Refund</h2>
                    <p>Contact us within <strong className="text-foreground">48 hours</strong> of your event via:</p>
                    <ul className="list-disc list-inside space-y-2 mt-2">
                        <li>WhatsApp: <a href="https://wa.me/917675957990" className="text-primary hover:underline">+91 76759 57990</a></li>
                        <li>Email: <a href="mailto:hello@clickcutgo.in" className="text-primary hover:underline">hello@clickcutgo.in</a></li>
                    </ul>
                    <p className="mt-2">Refunds are processed within <strong className="text-foreground">7 business days</strong> to the original payment method.</p>
                </section>

                <section>
                    <h2 className="text-xl font-black text-foreground mb-3">Cancellation by ClickCutGo</h2>
                    <p>In the rare event that we need to cancel a booking due to unforeseen circumstances, you will receive a <strong className="text-foreground">full 100% refund</strong> and priority rebooking for a future date.</p>
                </section>
            </div>
        </div>
    </div>
);

export default RefundPolicy;
