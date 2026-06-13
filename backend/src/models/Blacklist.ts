import { Schema, model, Document } from 'mongoose';

export interface IBlacklist extends Document {
  url: string;
  riskScore: number;
  reason: string[];
  firstDetected: Date;
  lastDetected: Date;
}

const blacklistSchema = new Schema<IBlacklist>({
  url: { type: String, required: true, unique: true, index: true },
  riskScore: { type: Number, required: true },
  reason: [{ type: String }],
  firstDetected: { type: Date, default: Date.now },
  lastDetected: { type: Date, default: Date.now }
});

export const Blacklist = model<IBlacklist>('Blacklist', blacklistSchema, 'blacklisted_urls');
