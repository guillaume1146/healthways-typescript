# Test Data — OCR Verification Documents

This folder contains test personas and a script to generate PDF documents used for OCR verification testing during the signup flow.

## Purpose

The Oh My Dok platform verifies uploaded documents by extracting text via pdfjs-dist (for PDFs) or Tesseract OCR (for images) and matching it against the user's full name. These test documents provide known-good PDFs for validating that pipeline across all 11 user types.

## How to Generate

```bash
node Test-Data/generate-test-docs.js
```

This creates **57 PDFs** in `Test-Data/generated/` — one per document type per persona.

## How to Use

1. Go to `/signup` and select a user type.
2. Enter the corresponding persona's full name (e.g., `Rajesh Kumar Doorgakant`).
3. Upload the matching PDFs to each document slot (file names match the document IDs in the UI).
4. The OCR system extracts text and verifies the name appears in each document.

**File naming convention:** `{document-id}-{slugified-name}.pdf`

## Available Personas (11)

| # | Full Name | User Type | Documents |
|---|-----------|-----------|-----------|
| 1 | Rajesh Kumar Doorgakant | Doctor | 5 PDFs |
| 2 | Priya Devi Ramsewak | Nurse | 5 PDFs |
| 3 | Jean-Pierre Lafleur | Pharmacist | 5 PDFs |
| 4 | Aisha Fatima Doobur | Patient | 4 PDFs |
| 5 | Marie-Claire Montagne | Nanny | 4 PDFs |
| 6 | David Sooben Ahkee | Lab Technician | 5 PDFs |
| 7 | Jean-Marc Lavoix | Emergency Worker | 5 PDFs |
| 8 | Vikram Kumar Doorgakant | Insurance Rep | 5 PDFs |
| 9 | Anil Kumar Doobur | Corporate Admin | 6 PDFs |
| 10 | Sophie Anne Leclerc | Referral Partner | 6 PDFs |
| 11 | Hassan Fareed Doorgakant | Regional Admin | 7 PDFs |
