// POST /api/prescriptions/scan
// Upload and process prescription
interface ScanPrescriptionRequest {
    image: File;
}

interface ScanPrescriptionResponse {
    prescriptionId: string;
    extractedData: {
        medications: Array<{
            name: string;
            dosage: string;
            confidence: number;
        }>;
        patientInfo: {
            name: string;
            confidence: number;
        };
    };
    originalImageUrl: string;
}

// POST /api/prescriptions/verify
// Verify extracted data against medication database
interface VerifyPrescriptionRequest {
    prescriptionId: string;
    medications: Array<{
        extractedName: string;
        matchedMedicationId: string;
        dosage: string;
    }>;
}

// GET /api/medications/search
// Search medications by name
interface SearchMedicationsRequest {
    query: string;
    limit?: number;
    offset?: number;
}