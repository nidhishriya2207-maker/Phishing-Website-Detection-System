import { Router } from 'express';
import { checkBlacklist, getBlacklistCount } from '../controllers/blacklistController.js';

const router = Router();

// Route for checking if a URL is blacklisted
router.get('/check', checkBlacklist);

// Route for fetching the total number of blacklisted sites
router.get('/count', getBlacklistCount);

export default router;
