import { Schema, model } from 'mongoose';
const scanHistorySchema = new Schema({
    url: { type: String, required: true },
    riskScore: { type: Number, required: true },
    status: { type: String, enum: ['safe', 'suspicious', 'phishing'], required: true },
    timestamp: { type: Date, default: Date.now },
    scanSource: { type: String, enum: ['website', 'extension'], required: true }
});
export const ScanHistory = model('ScanHistory', scanHistorySchema, 'scan_history');
