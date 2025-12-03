import express from "express";
import { createRFP, getAllRFPs } from "../controllers/rfpController.js";

const router = express.Router();

router.post("/create", createRFP);
router.get("/", getAllRFPs);

export default router;
