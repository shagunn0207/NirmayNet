export type UrgencyLevel = "EMERGENCY" | "URGENT" | "ROUTINE";

export type ReferralStatus =
  | "SENT"
  | "RECEIVED"
  | "IN_TRANSIT"
  | "PATIENT ARRIVED"
  | "CONSULTED"
  | "COMPLETED"
  | "CANCELLED"
  | "Accepted"
  | "Pending";

export type HighRiskCategory =
  | "Maternal Health"
  | "Pediatric"
  | "Cardiovascular"
  | "Diabetes / Metabolic"
  | "Geriatric"
  | "Maternal"
  | "Child"
  | "Diabetes"
  | "Hypertension";

export interface PatientVitals {
  bp: string;
  pulse: string;
  spo2: string;
  temp: string;
  weight?: number;
  hb?: string;
}

export interface PatientConsultation {
  date: string;
  doctor: string;
  facility: string;
  assessment: string;
  prescription: string[];
  notes: string;
  nextFollowUpDate?: string;
}

export interface PatientRecord {
  id: string;
  name: string;
  age: number;
  sex: "Male" | "Female" | "Other";
  gender?: string;
  phone: string;
  village: string;
  abhaId: string;
  allergies?: string;
  triagePriority: UrgencyLevel;
  riskCategory?: HighRiskCategory;
  bloodGroup: string;
  registrationDate: string;
  vitals: PatientVitals;
  medicalHistory: string[];
  consultationHistory: PatientConsultation[];
  ashaNotes?: string;
  visitReason?: string;
  symptoms?: string[];
  token?: string;
  waitTimeMinutes?: number;
  currentStatus?: string;
}

export interface AshaReferral {
  id: string;
  ashaName: string;
  ashaVillage: string;
  patientName: string;
  age: number;
  sex: "Male" | "Female" | "Other";
  symptoms: string[];
  urgency: UrgencyLevel;
  timestamp: string;
  status: "Pending" | "Accepted" | "Pending Review";
  subCentre?: string;
  patientId?: string;
  ashaPhone?: string;
  referralReason?: string;
  reason?: string;
  vitals?: PatientVitals;
  ashaAssessment?: string;
}

export interface HospitalReferral {
  id: string;
  realReferralId?: string;
  patientId: string;
  patientName: string;
  age: number;
  sex: "Male" | "Female" | "Other";
  priority: UrgencyLevel;
  status: ReferralStatus;
  reason: string;
  referringFacility: string;
  referringDoctor: string;
  destinationFacility: string;
  department: string;
  timestamp: string;
  ambulanceRequested?: boolean;
  ambulanceStatus?: string;
  vehicleNumber?: string;
  ambulanceEta?: string;
  driverContact?: string;
  vitals: PatientVitals;
  clinicalSummary: string;
  hospitalNotes?: string;
  assignedDoctor?: string;
}

export interface MedicineItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minThreshold: number;
  unit: string;
  facility?: string;
  status: "In Stock" | "Low Stock" | "Critical" | "Out of Stock";
}

export interface DiagnosticTest {
  id: string;
  name: string;
  category: string;
  availability: "Available" | "Reagent Low" | "Out of Order";
  averageTurnaroundHours: number;
}

export interface PatientDiagnosticOrder {
  id: string;
  patientId: string;
  patientName: string;
  testName: string;
  orderDate: string;
  orderedBy?: string;
  status: "Pending" | "Completed";
  result?: string;
  referenceRange?: string;
}

export interface FollowUpTask {
  id: string;
  patientId: string;
  patientName: string;
  patientAge?: number;
  patientSex?: string;
  category: string;
  urgency?: UrgencyLevel;
  dueDate: string;
  status: "Pending" | "Upcoming" | "Completed" | "Missed";
  phone?: string;
  reason?: string;
  ashaAssigned?: string;
  notes?: string;
}

export interface SpecialistDoctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  status: "Available" | "Busy" | "Unavailable";
  contact: string;
  activePatients?: number;
}

export interface PHCPerformanceMetric {
  id?: string;
  name?: string;
  block?: string;
  phcName: string;
  patientsToday?: number;
  avgWaitMinutes?: number;
  referralsSent: number;
  referralCompletionRate?: number;
  teleconsultationsCompleted: number;
  highRiskTracked: number;
  inventoryHealthScore: number;
  medicineStockPercent?: number;
  diagnosticAvailabilityPercent?: number;
  status?: string;
  alertDetail?: string;
}

export const INITIAL_PATIENTS: PatientRecord[] = [];
export const INITIAL_ASHA_REFERRALS: AshaReferral[] = [];
export const INITIAL_HOSPITAL_REFERRALS: HospitalReferral[] = [];
export const INITIAL_MEDICINES: MedicineItem[] = [];
export const INITIAL_DIAGNOSTICS: DiagnosticTest[] = [];
export const INITIAL_DIAGNOSTIC_ORDERS: PatientDiagnosticOrder[] = [];
export const INITIAL_FOLLOWUPS: FollowUpTask[] = [];
export const INITIAL_SPECIALISTS: SpecialistDoctor[] = [];
export const INITIAL_PHC_METRICS: PHCPerformanceMetric[] = [];
