import express from 'express';
import { rateLimit } from 'express-rate-limit';
import { protect,authorize } from '../middlewares/auth.middleware.js';
import { ingestLogs,listLogs,logSummary,findLogAccounts,accountStatistics } from '../controllers/adminLog.controller.js';

const router=express.Router();
router.use(rateLimit({windowMs:60000,limit:600,standardHeaders:true,legacyHeaders:false}));
router.use(protect);
// Account-based limits avoid sharing the normal auth/profile request budget.
const limit=rateLimit({windowMs:60000,limit:120,keyGenerator:req=>String(req.user._id),standardHeaders:true,legacyHeaders:false});
router.use(limit);
router.post('/batch',ingestLogs); // Every authenticated user may submit, none can choose their actor/role.
router.use(authorize('admin'));
router.get('/accounts',findLogAccounts);
router.get('/accounts/:actor/statistics',accountStatistics);
router.get('/summary',logSummary);
router.get('/',listLogs);
export default router;
