import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const TermsAndConditions = () => (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="max-w-3xl mx-auto px-6 py-16">
            <Link to="/" className="inline-flex items-center gap-2 text-primary font-bold text-sm mb-8 hover:opacity-80 transition-opacity">
                <ArrowLeft size={16} /> Back to Home
            </Link>

            <h1 className="text-4xl font-black mb-2">Terms & Conditions</h1>
            <p className="text-muted-foreground text-sm mb-10">Last updated: February 2026</p>

            <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
                <section>
                    <h2 className="text-xl font-black text-foreground mb-3">1. Services</h2>
                    <p>ClickCutGo provides on-location reel creation services for events including weddings, corporate events, brand launches, college fests, and more. All content is shot and edited on iPhone, delivered in 9:16 vertical format optimized for Instagram Reels.</p>
                </section>

                <section>
                    <h2 className="text-xl font-black text-foreground mb-3">2. Booking & Payment</h2>
                    <ul className="list-disc list-inside space-y-2">
                        <li>Bookings are confirmed via WhatsApp after package selection and slot availability.</li>
                        <li>A booking confirmation message will be sent within 1 hour of enquiry confirmation.</li>
                        <li>Payment terms will be communicated at the time of booking confirmation.</li>
                        <li>Same-day bookings are subject to creator availability and close at 6:00 PM IST.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-black text-foreground mb-3">3. Service Delivery</h2>
                    <ul className="list-disc list-inside space-y-2">
                        <li>Our creator will arrive at the agreed venue and time with all necessary equipment.</li>
                        <li>Reels are shot and edited live at the event venue.</li>
                        <li>Delivery timelines depend on the package selected (same-day or priority delivery).</li>
                        <li>All reels include ClickCutGo Signature Branding unless otherwise agreed.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-black text-foreground mb-3">4. Content Rights</h2>
                    <ul className="list-disc list-inside space-y-2">
                        <li>The client receives full usage rights for all delivered content.</li>
                        <li>ClickCutGo reserves the right to use delivered content for portfolio and promotional purposes unless the client requests otherwise in writing before the event.</li>
                        <li>Raw footage is provided only in packages that explicitly include it.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-black text-foreground mb-3">5. Cancellation</h2>
                    <ul className="list-disc list-inside space-y-2">
                        <li>Cancellations made 24+ hours before the event: Full refund or free rebooking.</li>
                        <li>Cancellations made within 24 hours: No refund applicable.</li>
                        <li>In case of no-show by the client without prior notice, no refund will be issued.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-black text-foreground mb-3">6. Limitation of Liability</h2>
                    <p>ClickCutGo's total liability shall not exceed the amount paid by the client for the specific booking. We are not responsible for any indirect or consequential damages arising from the use of our services.</p>
                </section>

                <section>
                    <h2 className="text-xl font-black text-foreground mb-3">7. Travel</h2>
                    <p>Travel within Hyderabad city limits is included in all packages. Outstation travel for premium packages is available at an additional charge, communicated at the time of booking.</p>
                </section>

                <section>
                    <h2 className="text-xl font-black text-foreground mb-3">8. Contact</h2>
                    <p>For any questions regarding these terms, contact us at:</p>
                    <ul className="list-disc list-inside space-y-2 mt-2">
                        <li>WhatsApp: <a href="https://wa.me/917675957990" className="text-primary hover:underline">+91 76759 57990</a></li>
                        <li>Email: <a href="mailto:hello@clickcutgo.in" className="text-primary hover:underline">hello@clickcutgo.in</a></li>
                    </ul>
                </section>
            </div>
        </div>
    </div>
);

export default TermsAndConditions;
