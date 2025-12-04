import express from "express";
import { submitVendorResponse, evaluateRFP } from "../controllers/vendorController.js";

const router = express.Router();

router.post("/submit", submitVendorResponse);
router.post("/evaluate", evaluateRFP);

export default router;
