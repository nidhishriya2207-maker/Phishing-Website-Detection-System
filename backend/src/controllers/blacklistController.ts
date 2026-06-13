import { Request, Response } from 'express';
import { Blacklist } from '../models/Blacklist.js';

export const checkBlacklist = async (req: Request, res: Response): Promise<void> => {
  const urlParam = req.query.url;

  if (!urlParam || typeof urlParam !== 'string') {
    res.status(400).json({ error: 'URL query parameter is required' });
    return;
  }

  try {
    let domain = '';
    try {
      const formattedUrl = /^https?:\/\//i.test(urlParam) ? urlParam : 'https://' + urlParam;
      domain = new URL(formattedUrl).hostname;
    } catch {
      domain = urlParam;
    }

    const blacklisted = await Blacklist.findOne({
      $or: [
        { url: urlParam.toLowerCase() },
        { url: domain.toLowerCase() }
      ]
    });

    if (blacklisted) {
      res.json({
        isBlacklisted: true,
        riskScore: blacklisted.riskScore,
        reason: blacklisted.reason,
        firstDetected: blacklisted.firstDetected,
        lastDetected: blacklisted.lastDetected
      });
    } else {
      res.json({
        isBlacklisted: false
      });
    }
  } catch (error: any) {
    res.status(500).json({ error: 'Error checking blacklist database', details: error.message });
  }
};

export const getBlacklistCount = async (req: Request, res: Response): Promise<void> => {
  try {
    const count = await Blacklist.countDocuments();
    res.json({ count });
  } catch (error: any) {
    res.status(500).json({ error: 'Error counting blacklist documents', details: error.message });
  }
};
