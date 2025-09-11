const express = require('express');
const app = express();
exports.app = app;
const { MongoClient } = require('mongodb');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const geoip = require('geoip-lite'); // For IP geolocation check
const jwt = require('jsonwebtoken');
const axios = require('axios');
const fs = require('fs');
const exifParser = require('exif-parser'); //  reading image metadata


const uploadDir = path.join(__dirname, 'spotlight/storage');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`✅ Created storage directory at: ${uploadDir}`);
}

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/storage', express.static(uploadDir));
app.use(express.static(path.join(__dirname, "../spotlightstorage")));

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

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend/index.html"));
});




//------------------------------------------------------------------------------------


// validating inputs
function verifyIssue(issue, metadata) {
    let reasons = [];
    let status = "verified";

    // phone validation 
    if (issue.phone && !/^[6-9]\d{9}$/.test(issue.phone)) {
        reasons.push("Invalid phone number");
        status = "suspicious";
    }

    // image type , size
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

    // Location check vs IP geolocation
    const geo = geoip.lookup(metadata.ip);
    if (geo && issue.location) {
        if (!issue.location.toLowerCase().includes(geo.country.toLowerCase())) {
            reasons.push(`Location mismatch: user said ${issue.location}, IP shows ${geo.country}`);
            status = "suspicious";
        }
    }

    // 4. edge case
    if (reasons.length >= 3) {
        status = "rejected";
    }

    return { status, reasons };
}

// ========== LOGIN ROUTES (Unchanged) ========== - FRONTEND DEV
app.post('/send-otp', async (req, res) => {
    const { phone_number } = req.body;
    if (!phone_number) {
        return res.status(400).json({ error: 'Phone number is required.' });
    }
    const apiUrl = `https://2factor.in/API/V1/${TWOFACTOR_API_KEY}/SMS/+91${phone_number}/AUTOGEN/`;
    try {
        const response = await axios.get(apiUrl);
        const apiResponse = response.data;
        if (apiResponse.Status === 'Success') {
            res.json({
                message: 'OTP sent successfully.',
                details: apiResponse.Details
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
    const token = jwt.sign({ phoneNumber: phoneNumber }, KEY, { expiresIn: "2w" });
    res.json({ token });
});

// VERIFICATION LOGIC NEW 
function verifyIssue(issue, fileBuffer) {
    let reasons = [];
    let status = "verified";

    // 1. Phone number validation (Indian format)
    if (issue.phone && !/^[6-9]\d{9}$/.test(issue.phone)) {
        reasons.push("Invalid phone number format");
        status = "suspicious";
    }

    if (fileBuffer) {
        try {
            const parser = exifParser.create(fileBuffer);
            const result = parser.parse();
            const tags = result.tags;

            // GPS Location Check from EXIF data
            if (tags && tags.GPSLatitude && tags.GPSLongitude) {
                const velloreLat = 12.9165;
                const velloreLon = 79.1325;
                const lat = tags.GPSLatitude;
                const lon = tags.GPSLongitude;
                
                const distanceThreshold = 0.5;
                if (Math.abs(lat - velloreLat) > distanceThreshold || Math.abs(lon - velloreLon) > distanceThreshold) {
                    reasons.push(`Photo location (${lat.toFixed(4)}, ${lon.toFixed(4)}) is too far from Vellore.`);
                    status = "suspicious";
                }
            } else {
                reasons.push("Image is missing GPS location data (EXIF). Submission cannot be verified.");
                status = "suspicious";
            }

            // Timestamp Check from EXIF data
            const photoTimestamp = tags.DateTimeOriginal || tags.CreateDate; // Unix timestamp
            if (photoTimestamp) {
                const photoDate = new Date(photoTimestamp * 1000);
                const twentyFourHoursAgo = new Date(Date.now() - (24 * 60 * 60 * 1000));
                if (photoDate < twentyFourHoursAgo) {
                    reasons.push(`Photo is old, taken on ${photoDate.toLocaleString()}`);
                    status = "suspicious";
                }
            } else {
                reasons.push("Image is missing timestamp data (EXIF). Submission cannot be verified.");
                status = "suspicious";
            }

        } catch (err) {
            reasons.push("Could not read image EXIF data. It may be stripped or from a screenshot.");
            status = "suspicious";
        }
    }

    // 3. Escalate if too many failures
    if (reasons.length >= 3) {
        status = "rejected";
    }

    return { status, reasons };
}

// Submit new issue
app.post('/issue/submit', upload.single('image'), async (req, res) => {
    const db = client.db('spotlight_db');
    const issuesCollection = db.collection('issues');
    const suspiciousCollection = db.collection('suspicious_issues');

    const { title, description, category, location, token } = req.body;
    const phone = jwt.decode(token, KEY).phoneNumber;

// EXIF PARSING
    let imageUrl = null;
    let uniqueFilename = null;
    let fileMetadata = null;

    if (req.file) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        uniqueFilename = uniqueSuffix + '-' + req.file.originalname;
        const filePath = path.join(uploadDir, uniqueFilename);

        // Save the file to disk
        fs.writeFileSync(filePath, req.file.buffer);
        console.log(`✅ File saved to: ${filePath}`);

        imageUrl = `/storage/${uniqueFilename}`;
        fileMetadata = {
            filename: uniqueFilename,
            mimetype: req.file.mimetype,
            size: req.file.size,
            path: filePath // Store the server path for internal use
        };
    }

    const tracking_id = Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
    const initialStatus = 'pending';
    const createdAt = new Date();

    const issue = {
        title,
        description,
        category,
        location,
        imageUrl,
        status: initialStatus,
        phone: phone || null,
        tracking_id,
        created_at: createdAt,
        status_history: [{ status: initialStatus, changed_at: createdAt }],
        metadata: {
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            uploadTime: createdAt,
            fileInfo: fileMetadata // Use the manually created file metadata
        }
    };

    // Pass the image buffer to the verification function
    const { status: verificationStatus, reasons } = verifyIssue(issue, req.file ? req.file.buffer : null);
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

// ADMIN ROUTES 

app.get("/admin/issues", async (req, res) => {
    try {
        const issues = await Issue.find();
        res.json(issues);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.put("/admin/issues/:id", async (req, res) => {
    try {
        const { status } = req.body;
        const updatedIssue = await Issue.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json(updatedIssue);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.get("/admin/issues/stats", async (req, res) => {
    try {
        const stats = await Issue.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);
        const formattedStats = {};
        stats.forEach(item => {
            formattedStats[item._id] = item.count;
        });
        res.json(formattedStats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//TRACKING ROUTES
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

// SERVER START 
app.listen(3000, "0.0.0.0", () => {
    console.log("🚀 Server running on port 3000");
});


