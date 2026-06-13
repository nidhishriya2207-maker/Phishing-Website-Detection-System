import { Schema, model, Document } from 'mongoose';

export interface IScanHistory extends Document {
  url: string;
  riskScore: number;
  status: 'safe' | 'suspicious' | 'phishing';
  timestamp: Date;
  scanSource: 'website' | 'extension';
}

const scanHistorySchema = new Schema<IScanHistory>({
  url: { type: String, required: true },
  riskScore: { type: Number, required: true },
  status: { type: String, enum: ['safe', 'suspicious', 'phishing'], required: true },
  timestamp: { type: Date, default: Date.now },
  scanSource: { type: String, enum: ['website', 'extension'], required: true }
});

export const ScanHistory = model<IScanHistory>('ScanHistory', scanHistorySchema, 'scan_history');
