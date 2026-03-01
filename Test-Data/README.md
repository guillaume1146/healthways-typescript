# Test Data — OCR Verification Documents

This folder contains test personas and a script to generate PDF documents used for OCR verification testing during the signup flow.

## Purpose

The Healthwyz platform verifies uploaded documents (national IDs, proof of residence, professional licenses) by extracting text via OCR and matching it against the user's registration details. These test documents provide known-good PDFs for validating that pipeline.

## How to Generate

```bash
node Test-Data/generate-test-docs.js
```

This creates 9 PDFs in `Test-Data/generated/`:
- 3 National ID cards (A5 landscape)
- 3 Proof of Residence / electricity bills (A4 portrait)
- 3 Professional Licenses (A4 portrait)

## How to Use

1. Register with a persona's name (e.g., first name "Rajesh Kumar", last name "Doorgakant").
2. Upload the corresponding PDF as the verification document.
3. The OCR system extracts text from the PDF and matches it against the user's name and details.

## Available Personas

| Full Name                 | Profession  | License Number   |
|---------------------------|-------------|------------------|
| Rajesh Kumar Doorgakant   | Doctor      | MED-2012-5678    |
| Priya Devi Ramsewak       | Nurse       | NUR-2015-3456    |
| Jean-Pierre Lafleur       | Pharmacist  | PHA-2005-9012    |
