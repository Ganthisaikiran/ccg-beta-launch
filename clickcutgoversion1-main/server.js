import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());

// --- CONFIGURATION ---
const ADMIN_PASSWORD = "adminccg"; // Change this for production!

// Supabase Configuration - REPLACE WITH YOUR PROJECT DETAILS
// You can get these from your Supabase Project Settings > API
const SUPABASE_URL = "https://fvccmbvvucksbkibgfdo.supabase.co";
const SUPABASE_KEY = "sb_publishable_0zhrpVnd6O6EpD5hanXk3w_MzKOz4D4";
// ---------------------

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function notifyOwner(type, data) {
    console.log(`\n🔔 NOTIFICATION: New ${type} received!`);
    console.log(`   From: ${data.name}`);
    console.log(`   Time: ${new Date().toLocaleString()}`);
    // Future: Integrate with WhatsApp/Email API here
    console.log(`   (Details saved to Supabase and dashboard updated)\n`);
}

function isAdmin(req) {
    const password = req.headers["x-admin-password"] || req.query.password;
    return password === ADMIN_PASSWORD;
}

/* ─── Routes ──────────────────────────────────────────────────── */

// POST feedback
app.post("/api/feedback", async (req, res) => {
    try {
        const { name, phone, eventType, eventDate, overallRating, deliveryRating, experience, wouldRecommend, permission } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ error: "Name is required" });
        }

        const { error } = await supabase
            .from("feedback")
            .insert([{
                name,
                phone: phone || "",
                event_type: eventType || "",
                event_date: eventDate || "",
                overall_rating: overallRating || 0,
                delivery_rating: deliveryRating || 0,
                experience: experience || "",
                would_recommend: wouldRecommend || "",
                permission: permission ? 1 : 0
            }]);

        if (error) throw error;

        console.log(`📝 New feedback from: ${name}`);
        notifyOwner("Feedback", { name });
        res.json({ success: true, message: "Feedback saved successfully!" });
    } catch (err) {
        console.error("Error saving feedback:", err);
        res.status(500).json({ error: "Failed to save feedback" });
    }
});

// GET all feedback
app.get("/api/feedback", async (req, res) => {
    if (!isAdmin(req)) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    try {
        const { data, error } = await supabase
            .from("feedback")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;

        res.json({ feedback: data, count: data.length });
    } catch (err) {
        console.error("Error fetching feedback:", err);
        res.status(500).json({ error: "Failed to fetch feedback" });
    }
});

// EXPORT feedback to CSV
app.get("/api/export-csv", async (req, res) => {
    if (!isAdmin(req)) {
        return res.status(401).send("Unauthorized");
    }
    try {
        const { data, error } = await supabase
            .from("feedback")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        if (!data || data.length === 0) {
            return res.status(404).send("No feedback found to export.");
        }

        const columns = Object.keys(data[0]);

        // Create CSV content
        let csvContent = columns.join(",") + "\n";
        data.forEach((row) => {
            const escapedRow = columns.map((col) => {
                const val = row[col];
                if (typeof val === "string") {
                    return `"${val.replace(/"/g, '""')}"`;
                }
                return val;
            });
            csvContent += escapedRow.join(",") + "\n";
        });

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=feedback_export.csv");
        res.status(200).send(csvContent);

        console.log("📊 Feedback exported to CSV");
    } catch (err) {
        console.error("Error exporting feedback:", err);
        res.status(500).json({ error: "Failed to export feedback" });
    }
});

// POST creator application
app.post("/api/creators", async (req, res) => {
    try {
        const { name, phone, portfolioUrl, instagramHandle, experienceLevel, about } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ error: "Name is required" });
        }

        const { error } = await supabase
            .from("creators")
            .insert([{
                name,
                phone: phone || "",
                portfolio_url: portfolioUrl || "",
                instagram_handle: instagramHandle || "",
                experience_level: experienceLevel || "",
                about: about || ""
            }]);

        if (error) throw error;

        console.log(`✨ New creator application from: ${name}`);
        notifyOwner("Creator Application", { name });
        res.json({ success: true, message: "Application submitted successfully!" });
    } catch (err) {
        console.error("Error saving creator application:", err);
        res.status(500).json({ error: "Failed to save application" });
    }
});

// EXPORT creators to CSV
app.get("/api/export-creators-csv", async (req, res) => {
    if (!isAdmin(req)) {
        return res.status(401).send("Unauthorized");
    }
    try {
        const { data, error } = await supabase
            .from("creators")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        if (!data || data.length === 0) {
            return res.status(404).send("No creator applications found to export.");
        }

        const columns = Object.keys(data[0]);

        // Create CSV content
        let csvContent = columns.join(",") + "\n";
        data.forEach((row) => {
            const escapedRow = columns.map((col) => {
                const val = row[col];
                if (typeof val === "string") {
                    return `"${val.replace(/"/g, '""')}"`;
                }
                return val;
            });
            csvContent += escapedRow.join(",") + "\n";
        });

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=creators_export.csv");
        res.status(200).send(csvContent);

        console.log("📊 Creator applications exported to CSV");
    } catch (err) {
        console.error("Error exporting creators:", err);
        res.status(500).json({ error: "Failed to export creators" });
    }
});

// GET all creators
app.get("/api/creators", async (req, res) => {
    if (!isAdmin(req)) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    try {
        const { data, error } = await supabase
            .from("creators")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;

        res.json({ creators: data, count: data.length });
    } catch (err) {
        console.error("Error fetching creators:", err);
        res.status(500).json({ error: "Failed to fetch creators" });
    }
});
app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

/* ─── Start Server ────────────────────────────────────────────── */
const PORT = 3001;

app.listen(PORT, () => {
    console.log(`\n🚀 ClickCutGo Supabase API running on http://localhost:${PORT}`);
    console.log(`   POST /api/feedback  — Submit feedback`);
    console.log(`   GET  /api/feedback  — View all feedback`);
});
