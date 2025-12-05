                   ┌────────────────────────────────────┐
                   │     FMCG COMPANY (Procurement)     │
                   └────────────────────────────────────┘
                                   │
                                   │ Initiates Procurement
                                   ▼
                ┌────────────────────────────────────────────┐
                │   RFP Creation Module (Two Input Modes)    │
                └────────────────────────────────────────────┘
                      │                             │
   Natural Language Input (NLP Mode)      Manual Form-Based RFP Input
                      │                             │
                      ▼                             ▼
            ┌───────────────────┐        ┌────────────────────────┐
            │  NLP Processor    │        │   Form Input Parser    │
            │ (LLM Extraction)  │        └────────────────────────┘
            └───────────────────┘                     │
                      │                               │
                      └───────────────┬───────────────┘
                                      ▼
                       ┌─────────────────────────────┐
                       │   Structured RFP Generator  │
                       └─────────────────────────────┘
                                      │
                            Stores RFP in Database
                                      ▼
                       ┌─────────────────────────────┐
                       │         MongoDB             │
                       │      (RFP Collection)       │
                       └─────────────────────────────┘
                                      │
                           RFP ID Returned to User
                                      │
                                      ▼
                    ┌────────────────────────────────────┐
                    │     Vendor Selection & Email        │
                    └────────────────────────────────────┘
                                      │
                     Sends RFP via Email to 5–6 Vendors
                                      ▼
                   ┌────────────────────────────────────────┐
                   │ Vendors Review RFP & Submit Responses  │
                   └────────────────────────────────────────┘
                                      │
                 Response PDF / Email Received by System
                                      ▼
                    ┌─────────────────────────────────────┐
                    │   Vendor Response AI Interpreter    │
                    │  NLP + Table/PDF Extraction (OCR)   │
                    └─────────────────────────────────────┘
                                      │
                          Extracts: Quality, Quantity,
                             Lead Time, Price, Terms
                                      ▼
                       ┌──────────────────────────────┐
                       │   MongoDB (VendorResponses)   │
                       └──────────────────────────────┘
                                      │
                                      ▼
             ┌───────────────────────────────────────────────────┐
             │   AI Comparison & Recommendation Engine           │
             └───────────────────────────────────────────────────┘
                                      │
                 Ranks vendors → Quality → Quantity → Lead Time → Price
                                      │
                                      ▼
                      ┌─────────────────────────────────┐
                      │ Best Vendor(s) Suggested to User│
                      └─────────────────────────────────┘
