import express from "express";
import { submitVendorResponse, evaluateAI } from "../controllers/vendorController.js";

const router = express.Router();

router.post("/submit", submitVendorResponse);
router.post("/evaluate", evaluateAI);

export default router;
