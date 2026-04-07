/* eslint-env node */
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hope_db')
  .then(() => console.log('[MongoDB] Connected successfully'))
  .catch((err) => console.error('[MongoDB] Connection error:', err));

// Define Critical Alert Schema
const alertSchema = new mongoose.Schema({
  timestamp: { type: Date, required: true },
  type: { type: String, required: true },
  status: { type: String, default: 'Triggered' },
  createdAt: { type: Date, default: Date.now }
});

const CriticalAlert = mongoose.model('CriticalAlert', alertSchema);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Basic static serving if needed
// app.use(express.static(path.join(__dirname, 'dist')));

// Configure Nodemailer transporter (Gmail App Password)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s/g, '') : ''
  }
});

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error('[SMTP] Connection verification failed:', error);
  } else {
    console.log('[SMTP] Server is ready to take our messages');
  }
});

// Mock database of registered authorities
const registeredAuthorities = [
  'vedavignanreddykomma@gmail.com',
  process.env.EMAIL_USER // Include the sender as requested
];

app.post('/api/alert', async (req, res) => {
  const { timestamp, type, emails } = req.body;

  const toAddresses = emails && Array.isArray(emails) && emails.length > 0
    ? [...new Set([...registeredAuthorities, ...emails])].join(', ')
    : registeredAuthorities.join(', ');

  console.log(`[ALERT] Received critical alert at ${timestamp}`);
  console.log(`[DEBUG] Attempting to send email from: ${process.env.EMAIL_USER} to: ${toAddresses}`);

  // Save to MongoDB
  try {
    const newAlert = new CriticalAlert({
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      type: type || 'AI Detection'
    });
    await newAlert.save();
    console.log('[MongoDB] Alert saved to database.');
  } catch (dbError) {
    console.error('[MongoDB] Failed to save alert:', dbError);
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toAddresses,
    subject: 'URGENT: HOPE Project Security Alert Detected',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 25px; color: #1a1a1a; background-color: #fef2f2; border: 2px solid #ef4444; border-radius: 12px;">
        <h1 style="color: #ef4444; margin-top: 0;">CRITICAL ALERT</h1>
        <p style="font-size: 1.2rem; font-weight: bold;">A suspicious hanging activity detected. Please check the location immediately.</p>
        
        <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #fee2e2;">
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="margin-bottom: 8px;"><strong>📅 Time:</strong> ${timestamp}</li>
            <li style="margin-bottom: 8px;"><strong>🔍 Detection Type:</strong> ${type || 'AI Visual Matching'}</li>
            <li style="margin-bottom: 8px;"><strong>📍 Source:</strong> HOPE Camera 01</li>
          </ul>
        </div>

        <div style="padding: 15px; background: #ef4444; color: white; border-radius: 8px; font-weight: bold; text-align: center;">
          IMMEDIATE INTERVENTION REQUIRED
        </div>

        <p style="margin-top: 30px; font-style: italic; color: #6366f1;">"If HOPE can give even one life a second chance, then this project has already succeeded"</p>
        <hr style="border: 0; border-top: 1px solid #fecaca; margin: 20px 0;" />
        <p style="font-size: 0.8rem; color: #666;">This is an automated priority alert from the HOPE Safety Platform.</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('[ALERT] Email dispatched to authorities.');
    console.log('[DEBUG] Envelope:', info.envelope);
    console.log('[DEBUG] MessageId:', info.messageId);
    console.log('[DEBUG] Accepted:', info.accepted);
    res.status(200).json({ success: true, message: 'Alert dispatched successfully.' });
  } catch (error) {
    console.error('[ALERT] Failed to send email:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/database', async (req, res) => {
  try {
    const alerts = await CriticalAlert.find().sort({ timestamp: -1 });
    let html = `
      <html>
        <head>
          <title>HOPE Database View</title>
          <style>
            body { font-family: Arial, sans-serif; background-color: #0f1115; color: white; padding: 40px; margin: 0; }
            .container { max-width: 1000px; margin: 0 auto; }
            h1 { color: #ef4444; border-bottom: 2px solid #333; padding-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; background: #1a1d24; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.3); }
            th, td { border-bottom: 1px solid #2d313a; padding: 15px; text-align: left; }
            th { background-color: #111; color: #a1a1aa; font-weight: 600; text-transform: uppercase; font-size: 0.85rem; }
            tr:hover { background-color: #242830; }
            .status-badge { background: rgba(34, 197, 94, 0.2); color: #4ade80; padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>HOPE Core Database</h1>
            <p style="color: #a1a1aa;">Live feed of all securely logged critical interventions.</p>
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Detection Type</th>
                  <th>Network Status</th>
                  <th>Mongo DB ID</th>
                </tr>
              </thead>
              <tbody>
                ${alerts.map(a => `
                  <tr>
                    <td>${new Date(a.timestamp).toLocaleString()}</td>
                    <td style="font-weight: bold; color: #fff;">${a.type}</td>
                    <td><span class="status-badge">${a.status}</span></td>
                    <td style="color: #6366f1; font-family: monospace; font-size: 0.9rem;">${a._id}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            ${alerts.length === 0 ? '<p style="text-align: center; color: #666; padding: 40px; background: #1a1d24; border-radius: 8px; margin-top: 20px;">No alerts recorded in database yet.</p>' : ''}
          </div>
        </body>
      </html>
    `;
    res.send(html);
  } catch (err) {
    res.status(500).send('<h2 style="color:red; font-family:sans-serif;">Error connecting to the database. Is MongoDB running?</h2>');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`HOPE Server running on port ${PORT}`);
});
