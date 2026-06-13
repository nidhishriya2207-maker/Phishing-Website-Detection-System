import { Router } from 'express';
import { scanUrl, getScanHistory, getUrlReport, getDomainDetails, triggerRetrain, getRetrainHistory } from '../controllers/scanController.js';
const router = Router();
// Route for scanning a URL
router.post('/scan', scanUrl);
// Route for fetching scan history
router.get('/history', getScanHistory);
// Route for fetching a detailed URL report
router.get('/report', getUrlReport);
// Route for fetching domain details (DNS/WHOIS/SSL)
router.get('/domain', getDomainDetails);
// Route for triggering model retraining manually
router.post('/retrain', triggerRetrain);
// Route for fetching retraining history log
router.get('/retrain/history', getRetrainHistory);
export default router;
