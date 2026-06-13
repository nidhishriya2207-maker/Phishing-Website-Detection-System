import { Schema, model } from 'mongoose';
const blacklistSchema = new Schema({
    url: { type: String, required: true, unique: true, index: true },
    riskScore: { type: Number, required: true },
    reason: [{ type: String }],
    firstDetected: { type: Date, default: Date.now },
    lastDetected: { type: Date, default: Date.now }
});
export const Blacklist = model('Blacklist', blacklistSchema, 'blacklisted_urls');
