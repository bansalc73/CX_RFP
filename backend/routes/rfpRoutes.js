import express from "express";
import { createRFP, createRFPFromNLP, listRFPs, getRFP } from "../controllers/rfpController.js";

const router = express.Router();

router.post("/create", createRFP);           // create from form JSON
router.post("/nlp-create", createRFPFromNLP); // create from NL text using LLM
router.get("/", listRFPs);
router.get("/:id", getRFP);

export default router;

