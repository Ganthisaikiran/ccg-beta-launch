import { useState, useEffect } from "react";
import { Users, MessageSquare, Download, RefreshCw, ChevronLeft } from "lucide-react";

interface Feedback {
    id: number;
    name: string;
    phone: string;
    event_type: string;
    event_date: string;
    overall_rating: number;
    delivery_rating: number;
    experience: string;
    would_recommend: string;
    created_at: string;
}

interface Creator {
    id: number;
    name: string;
    phone: string;
    portfolio_url: string;
    instagram_handle: string;
    experience_level: string;
    about: string;
    created_at: string;
}

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState<"feedback" | "creators">("feedback");
    const [feedback, setFeedback] = useState<Feedback[]>([]);
    const [creators, setCreators] = useState<Creator[]>([]);
    const [loading, setLoading] = useState(false);

    const [password, setPassword] = useState(localStorage.getItem("admin_password") || "");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginError, setLoginError] = useState("");

    const fetchData = async (pwd = password) => {
        setLoading(true);
        try {
            const headers = { "x-admin-password": pwd };
            const [feedbackRes, creatorsRes] = await Promise.all([
                fetch("/api/feedback", { headers }),
                fetch("/api/creators", { headers })
            ]);

            if (feedbackRes.status === 401 || creatorsRes.status === 401) {
                setIsLoggedIn(false);
                setLoginError("Invalid password.");
                return;
            }

            const feedbackData = await feedbackRes.json();
            const creatorsData = await creatorsRes.json();
            setFeedback(feedbackData.feedback || []);
            setCreators(creatorsData.creators || []);
            setIsLoggedIn(true);
            localStorage.setItem("admin_password", pwd);
        } catch (error) {
            console.error("Error fetching admin data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (password) {
            fetchData();
        }
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        fetchData();
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-6">
                <div className="bg-card border border-border p-10 rounded-3xl max-w-md w-full shadow-2xl">
                    <h1 className="text-3xl font-black mb-2">Admin <span className="text-primary">Login</span></h1>
                    <p className="text-muted-foreground text-sm mb-8">Enter the master password to access dashboard.</p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors"
                            autoFocus
                        />
                        {loginError && <p className="text-red-400 text-xs font-bold">{loginError}</p>}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-4 rounded-xl font-black text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {loading ? "Verifying..." : "Access Dashboard"}
                        </button>
                    </form>
                    <a href="/" className="block text-center mt-6 text-xs text-muted-foreground hover:text-white">Back to website</a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground font-sans p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <a href="/" className="inline-flex items-center gap-2 text-primary text-sm font-bold mb-4 hover:opacity-80 transition-opacity">
                            <ChevronLeft size={16} /> Back to Website
                        </a>
                        <h1 className="text-4xl md:text-5xl font-black">Admin <span className="text-primary">Dashboard</span></h1>
                        <p className="text-muted-foreground mt-2">Manage your feedback and creator applications.</p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => fetchData()}
                            className="flex items-center gap-2 bg-card border border-border px-5 py-2.5 rounded-xl font-bold text-sm hover:border-primary transition-all"
                        >
                            <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
                        </button>
                        <a
                            href={activeTab === "feedback" ? `/api/export-csv?password=${password}` : `/api/export-creators-csv?password=${password}`}
                            className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-black text-sm hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
                            download
                        >
                            <Download size={16} /> Download CSV
                        </a>
                    </div>
                </header>

                {/* Tabs */}
                <div className="flex gap-2 mb-8 bg-card/50 border border-border p-1.5 rounded-2xl w-fit">
                    <button
                        onClick={() => setActiveTab("feedback")}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === "feedback" ? "bg-primary text-white shadow-md shadow-primary/20" : "text-muted-foreground hover:text-white"}`}
                    >
                        <MessageSquare size={16} /> Feedback ({feedback.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("creators")}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === "creators" ? "bg-primary text-white shadow-md shadow-primary/20" : "text-muted-foreground hover:text-white"}`}
                    >
                        <Users size={16} /> Creators ({creators.length})
                    </button>
                </div>

                {/* Content */}
                <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl">
                    {loading ? (
                        <div className="p-20 text-center text-muted-foreground font-bold animate-pulse">
                            Loading data...
                        </div>
                    ) : activeTab === "feedback" ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-muted/30 border-b border-border">
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Name</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Event</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Rating</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Experience</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {feedback.length > 0 ? feedback.map((item) => (
                                        <tr key={item.id} className="hover:bg-muted/10 transition-colors">
                                            <td className="px-6 py-5">
                                                <p className="font-bold text-sm">{item.name}</p>
                                                <p className="text-xs text-muted-foreground">{item.phone}</p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="text-sm font-semibold">{item.event_type}</p>
                                                <p className="text-xs text-muted-foreground">{item.event_date}</p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-1 text-primary">
                                                    <span className="text-sm font-black">{item.overall_rating}</span>
                                                    <span className="text-[10px]">★</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 max-w-xs">
                                                <p className="text-xs text-muted-foreground italic truncate">{item.experience || "No comment"}</p>
                                            </td>
                                            <td className="px-6 py-5 text-xs text-muted-foreground font-mono">
                                                {item.created_at}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-20 text-center text-muted-foreground">No feedback yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-muted/30 border-b border-border">
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Creator</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Social/Portfolio</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Level</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Applied On</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {creators.length > 0 ? creators.map((item) => (
                                        <tr key={item.id} className="hover:bg-muted/10 transition-colors">
                                            <td className="px-6 py-5">
                                                <p className="font-bold text-sm">{item.name}</p>
                                                <p className="text-xs text-muted-foreground">{item.phone}</p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <a href={item.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary font-bold hover:underline block mb-1">Portfolio Link</a>
                                                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-tighter">{item.instagram_handle}</p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="inline-flex px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black text-primary uppercase">
                                                    {item.experience_level || "Unknown"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-xs text-muted-foreground font-mono">
                                                {item.created_at}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-20 text-center text-muted-foreground">No applications yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
