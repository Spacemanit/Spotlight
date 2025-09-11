// ========== IMPORTS ==========
const express = require('express');
const app = express();
exports.app = app;
const { MongoClient } = require('mongodb');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const geoip = require('geoip-lite'); // For IP geolocation check

// ========== MULTER SETUP (for file uploads) ==========
// Multer saves uploaded files to "uploads/" folder
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// ========== MIDDLEWARE ==========
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend + uploads
app.use(express.static(path.join(__dirname, "../spotlightstorage")));

// ========== DATABASE SETUP ==========
const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);
const TWOFACTOR_API_KEY = '43346a78-8e36-11f0-a562-0200cd936042';

async function connectToDb() {
    try {
        await client.connect();
        console.log("✅ Connected successfully to MongoDB");
    } catch (e) {
        console.error("❌ Could not connect to MongoDB", e);
    }
}
connectToDb();

const KEY = 'This is just a basic secret key which is used to unlock the Json Web Token huihuihui'

// ========== DEFAULT ROUTE ==========
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend/index.html"));
});

// ========== LOGIN PAGE ===========
app.post('/send-otp', async (req, res) => {
    const { phone_number } = req.body;

    if (!phone_number) {
        return res.status(400).json({ error: 'Phone number is required.' });
    }

    const apiUrl = `https://2factor.in/API/V1/${TWOFACTOR_API_KEY}/SMS/+91${phone_number}/AUTOGEN/`;
    console.log(apiUrl)
    try {
        const response = await axios.get(apiUrl);
        // The response from 2Factor.in
        const apiResponse = response.data;
        console.log(response.data)
        // Check for success from the 2Factor.in API
        if (apiResponse.Status === 'Success') {
            res.json({
                message: 'OTP sent successfully.',
                details: apiResponse.Details // This is the session ID
            });
        } else {
            res.status(400).json({ error: apiResponse.Details });
        }
    } catch (err) {
        console.error('Error sending OTP:', err.message);
        res.status(500).json({ error: 'Failed to send OTP.' });
    }
});

app.post('/verify-otp', async (req, res) => {
    const { details, otp } = req.body;

    if (!details || !otp) {
        return res.status(400).json({ error: 'Session details and OTP are required.' });
    }

    const apiUrl = `https://2factor.in/API/V1/${TWOFACTOR_API_KEY}/SMS/VERIFY/${details}/${otp}`;

    try {
        const response = await axios.get(apiUrl);
        const apiResponse = response.data;

        // Check for success from the 2Factor.in API
        if (apiResponse.Status === 'Success') {
            res.json({ message: 'OTP verified successfully.', valid: true });
        } else {
            res.status(400).json({ message: 'Invalid OTP.', valid: false });
        }
    } catch (err) {
        console.error('Error verifying OTP:', err.message);
        res.status(500).json({ error: 'Failed to verify OTP.' });
    }
});

app.post('/login', async (req, res) => {
    const { phoneNumber } = req.body;
    const token = jwt.sign({ phoneNumber: phoneNumber}, KEY, { expiresIn: "2w" });
    console.log(token)
    res.json({ token });
});

// ========== VERIFICATION LOGIC ==========
// Rule-based checks to validate reports
function verifyIssue(issue, metadata) {
    let reasons = [];
    let status = "verified";

    // 1. Phone number validation (Indian format)
    if (issue.phone && !/^[6-9]\d{9}$/.test(issue.phone)) {
        reasons.push("Invalid phone number");
        status = "suspicious";
    }

    // 2. Image validation (type + size)
    if (metadata.fileInfo) {
        const { mimetype, size } = metadata.fileInfo;
        if (!['image/jpeg', 'image/png', 'image/jpg'].includes(mimetype)) {
            reasons.push("Invalid image type");
            status = "suspicious";
        }
        if (size < 10000) { // less than 10KB
            reasons.push("Image too small");
            status = "suspicious";
        }
    }

    // 3. Location check vs IP geolocation
    const geo = geoip.lookup(metadata.ip);
    if (geo && issue.location) {
        if (!issue.location.toLowerCase().includes(geo.country.toLowerCase())) {
            reasons.push(`Location mismatch: user said ${issue.location}, IP shows ${geo.country}`);
            status = "suspicious";
        }
    }

    // 4. Escalate if too many failures
    if (reasons.length >= 3) {
        status = "rejected";
    }

    return { status, reasons };
}

// ========== USER ROUTES ==========
// Submit new issue
app.post('/issue/submit', upload.single('image'), async (req, res) => {
    const db = client.db('spotlight_db');
    const issuesCollection = db.collection('issues');
    const suspiciousCollection = db.collection('suspicious_issues');

    const { title, description, category, location, phone } = req.body;

    const tracking_id = Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
    const initialStatus = 'pending';
    const createdAt = new Date();

    // Collect metadata
    const metadata = {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        uploadTime: createdAt,
        fileInfo: req.file
            ? {
                  filename: req.file.filename,
                  mimetype: req.file.mimetype,
                  size: req.file.size,
                  path: req.file.path
              }
            : null
    };

    // Construct issue object
    const issue = {
        title,
        description,
        category,
        location,
        status: initialStatus,
        phone: phone || null,
        tracking_id,
        created_at: createdAt,
        status_history: [{ status: initialStatus, changed_at: createdAt }],
        metadata
    };

    // Run verification
    const { status: verificationStatus, reasons } = verifyIssue(issue, metadata);
    issue.verification_status = verificationStatus;
    issue.verification_reasons = reasons;

    try {
        if (verificationStatus === "rejected") {
            await suspiciousCollection.insertOne(issue);
            return res.json({ message: "Issue rejected due to verification failure", reasons });
        } else {
            await issuesCollection.insertOne(issue);
            return res.json({
                message: `Issue submitted (${verificationStatus})`,
                tracking_id,
                reasons
            });
        }
    } catch (err) {
        console.error("Error inserting issue:", err);
        res.status(500).json({ message: 'Error submitting issue' });
    }
});

// ========== ADMIN ROUTES ==========
// Fetch issues (with filters)
app.post('/admin/issues', async (req, res) => {
    const db = client.db('spotlight_db');
    const issuesCollection = db.collection('issues');

    const { status, category, phone, from, to, verification_status } = req.body || {};
    const filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (phone) filter.phone = phone;
    if (verification_status) filter.verification_status = verification_status;

    if (from || to) {
        filter.created_at = {};
        if (from) filter.created_at.$gte = new Date(from);
        if (to) filter.created_at.$lte = new Date(to);
    }

    try {
        const issues = await issuesCollection.find(filter).toArray();
        res.json(issues);
    } catch (err) {
        console.error("Error fetching issues:", err);
        res.status(500).json({ message: "Failed to fetch issues" });
    }
});

// Update issue status
app.post('/admin/issues/update-status', async (req, res) => {
    const db = client.db('spotlight_db');
    const issuesCollection = db.collection('issues');

    const { tracking_id, new_status } = req.body || {};
    if (!tracking_id || !new_status) {
        return res.json({ message: 'tracking_id and new_status are required' });
    }

    const allowedStatuses = ['pending', 'in_progress', 'resolved'];
    if (!allowedStatuses.includes(new_status)) {
        return res.json({ message: `Invalid status. Allowed: ${allowedStatuses.join(', ')}` });
    }

    try {
        const statusEntry = { status: new_status, changed_at: new Date() };
        const result = await issuesCollection.updateOne(
            { tracking_id: tracking_id },
            { $set: { status: new_status }, $push: { status_history: statusEntry } }
        );

        if (result.matchedCount === 0) {
            return res.json({ message: 'No issue found with this tracking_id' });
        }

        res.json({
            message: 'Status updated successfully',
            tracking_id,
            new_status,
            changed_at: statusEntry.changed_at
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating issue status' });
    }
});

// ========== TRACKING ROUTES ==========
// Track issue by tracking_id
app.get('/issue/track/:tracking_id', async (req, res) => {
    const db = client.db('spotlight_db');
    const issuesCollection = db.collection('issues');

    try {
        const issue = await issuesCollection.findOne({ tracking_id: req.params.tracking_id });
        if (!issue) {
            return res.status(404).json({ message: "No issue found with this tracking ID" });
        }
        res.json(issue);
    } catch (err) {
        console.error("Error tracking issue:", err);
        res.status(500).json({ message: "Error fetching issue" });
    }
});

// Get all issues by phone number
app.get('/issue/phone/:phone', async (req, res) => {
    const db = client.db('spotlight_db');
    const issuesCollection = db.collection('issues');

    try {
        const issues = await issuesCollection.find({ phone: req.params.phone }).toArray();
        if (issues.length === 0) {
            return res.status(404).json({ message: "No issues found for this phone number" });
        }
        res.json(issues);
    } catch (err) {
        console.error("Error fetching issues by phone:", err);
        res.status(500).json({ message: "Error fetching issues" });
    }
});

// ========== SERVER START ==========
app.listen(3000, "0.0.0.0", () => {
    console.log("🚀 Server running on port 3000");
});
