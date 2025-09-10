

// Switch to your database (will create it if it doesn't exist)
use spotlight_db;

// Create the 'issues' collection (will create automatically when inserting, but can be done explicitly)
db.createCollection("issues");

// Optional: Add an index on tracking_id so it’s unique
db.issues.createIndex({ tracking_id: 1 }, { unique: true });

// Optional: Add an index on phone if you plan to query by phone often
db.issues.createIndex({ phone: 1 });
