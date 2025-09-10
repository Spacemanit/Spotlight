const express = require('express');
const app = express();
exports.app = app;
const { MongoClient } = require('mongodb');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

// ========== MULTER SETUP (for file uploads) ==========
// Multer will save files locally in the "uploads/" folder
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // folder where uploaded files will be stored
    },
    filename: function (req, file, cb) {
        // Generate unique name: timestamp + random number + original name
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// ========== MIDDLEWARE SETUP ==========
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files: frontend + uploads can be accessed directly via URL
app.use(express.static(path.join(__dirname, "../spotlightstorage")));

// ========== DATABASE SETUP ==========
const uri = "mongodb://127.0.0.1:27017";  // local MongoDB connection
const client = new MongoClient(uri);

async function connectToDb() {
    try {
        await client.connect();
        console.log("Connected successfully to MongoDB");
    } catch (e) {
        console.error("Could not connect to MongoDB", e);
    }
}
connectToDb();

// Allowed categories for validation
const allowedCategories = ['Road', 'Electricity', 'Water', 'Waste'];

// ========== DEFAULT ROUTE ==========
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend/index.html"));
});

// ========== USER ROUTES ==========

// Route for submitting an issue (frontend will use GET for now)
app.post('/issue/submit', async (req, res) => {
    const db = client.db('spotlight_db'); 
    const issuesCollection = db.collection('issues');
    console.log('op')
    // Read data from query parameters
    const { title, description, category, location, phone } = req.body;

    // COMMENT: NO NEED FOR THIS AS WE ARE GONNA USE PREDEFINED CATEGORIES FROM DROP DOWN MENU
    // // Validate category
    // if (!allowedCategories.includes(category)) {
    //     return res.json({ message: 'Invalid category. Allowed categories: Road, Electricity, Water, Waste' });
    // }

    // Generate tracking_id (unique random string)
    const tracking_id = Date.now().toString(36) + Math.random().toString(36).substring(2, 8);

    // Force default status = pending
    const initialStatus = 'pending';

    // Timestamp when issue is created
    const createdAt = new Date();

    // Construct the issue object
    const issue = {
        title,
        description,
        category,
        location,
        status: initialStatus,
        phone: phone || null, // null if anonymous
        tracking_id,
        created_at: createdAt,
        // Maintain a history of all status changes
        status_history: [
            { status: initialStatus, changed_at: createdAt } // initial entry
        ]
    };

    // Insert into MongoDB
    const result = await issuesCollection.insertOne(issue);

    if (result.insertedId) {
        res.json({ message: 'Issue submitted successfully', tracking_id });
    } else {
        res.json({ message: 'Failed to submit issue' });
    }
});

// ========== ADMIN ROUTES ==========

// Admin route to fetch issues with filters (status, category, phone, date)
app.post('/admin/issues', async (req, res) => {
    const db = client.db('spotlight_db');
    const issuesCollection = db.collection('issues');

    console.log("Hello from admin issues route");

    const { status, category, phone, from, to } = req.body;

    // Build filter dynamically (only include fields that admin sends)
    const filter = {};

    // Status filter
    if (status) filter.status = status;

    // Category filter
    if (category) filter.category = category;

    // Phone filter
    if (phone) filter.phone = phone;

    // Date range filter
    if (from || to) {
        filter.created_at = {};
        if (from) filter.created_at.$gte = new Date(from); // issues after this date
        if (to) filter.created_at.$lte = new Date(to);     // issues before this date
    }

    try {
        // Fetch matching issues
        const issues = await issuesCollection.find(filter).toArray();
        res.json(issues);
    } catch (err) {
        console.error("Error fetching issues:", err);
        res.status(500).json({ message: "Failed to fetch issues" });
    }
});

// Admin route to update issue status with timestamp
app.post('/admin/issues/update-status', async (req, res) => {
    const db = client.db('spotlight_db');
    const issuesCollection = db.collection('issues');

    const { tracking_id, new_status } = req.body;

    // Validate input
    if (!tracking_id || !new_status) {
        return res.json({ message: 'tracking_id and new_status are required' });
    }

    // Allowed statuses
    const allowedStatuses = ['pending', 'in_progress', 'resolved'];
    if (!allowedStatuses.includes(new_status)) {
        return res.json({ message: `Invalid status. Allowed statuses: ${allowedStatuses.join(', ')}` });
    }

    try {
        // Build status entry with timestamp
        const statusEntry = {
            status: new_status,
            changed_at: new Date()
        };

        // Update the issue: set current status and push to history
        const result = await issuesCollection.updateOne(
            { tracking_id: tracking_id },
            {
                $set: { status: new_status },
                $push: { status_history: statusEntry }
            }
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

// ========== SERVER START ==========
app.listen(3000, "0.0.0.0", () => {
    console.log("Server running on port 3000");
});
