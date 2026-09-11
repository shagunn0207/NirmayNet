"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../lib/api";
import {
  PatientRecord,
  AshaReferral,
  HospitalReferral,
  MedicineItem,
  DiagnosticTest,
  PatientDiagnosticOrder,
  FollowUpTask,
  SpecialistDoctor,
  PHCPerformanceMetric,
  ReferralStatus,
  INITIAL_PATIENTS,
  INITIAL_ASHA_REFERRALS,
  INITIAL_HOSPITAL_REFERRALS,
  INITIAL_MEDICINES,
  INITIAL_DIAGNOSTICS,
  INITIAL_DIAGNOSTIC_ORDERS,
  INITIAL_FOLLOWUPS,
  INITIAL_SPECIALISTS,
  INITIAL_PHC_METRICS,
} from "../lib/healthcareData";

export interface UserAccount {
  id: string;
  username: string;
  name?: string;
  role: string;
  facility_name?: string;
}

export interface UserOut {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  role: string;
  village?: string;
  facility_name?: string;
}

export interface FacilityStatus {
  icuBedsAvailable: number;
  icuTotal: number;
  maternityBedsAvailable: number;
  maternityTotal: number;
  emergencyBedsAvailable: number;
  emergencyTotal: number;
  generalBedsAvailable: number;
  generalTotal: number;
  oxygenPlantOperational: boolean;
  bloodBankUnitsOpos: number;
  bloodBankUnitsOneg: number;
  ctScanOperational: boolean;
  xrayOperational: boolean;
}

export interface SupplyRequest {
  id: string;
  facility: string;
  medicineName: string;
  quantityRequested: number;
  unit: string;
  requestDate: string;
  status: "Pending Approval" | "Dispatched" | "Delivered";
  priority: "High" | "Routine";
}

export type UserRole = "phc-doctor" | "district-hospital" | "dho";

interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

interface HealthcareContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  isLoggedIn: boolean;
  currentUser: UserAccount | null;
  authToken: string | null;
  login: (userData: any, token: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserOut>) => Promise<void>;

  patients: PatientRecord[];
  selectedPatient: PatientRecord | null;
  setSelectedPatient: (patient: PatientRecord | null) => void;
  updatePatientConsultation: (
    patientId: string,
    consultation: {
      assessment: string;
      prescription: string[];
      notes: string;
      nextFollowUpDate?: string;
    }
  ) => void;

  ashaReferrals: AshaReferral[];
  acceptAshaReferral: (id: string) => void;

  hospitalReferrals: HospitalReferral[];
  createHospitalReferral: (
    newReferral: Omit<HospitalReferral, "id" | "timestamp" | "status">
  ) => HospitalReferral;
  updateHospitalReferralStatus: (
    id: string,
    status: ReferralStatus,
    hospitalNotes?: string,
    assignedDoctor?: string
  ) => void;
  requestMoreReferralInfo: (id: string, note: string) => void;

  medicines: MedicineItem[];
  supplyRequests: SupplyRequest[];
  requestMedicineSupply: (
    medicineId: string,
    quantity: number,
    priority?: "High" | "Routine"
  ) => void;

  diagnostics: DiagnosticTest[];
  diagnosticOrders: PatientDiagnosticOrder[];
  orderDiagnosticTest: (patientId: string, testName: string) => void;
  recordDiagnosticResult: (orderId: string, result: string) => void;

  followups: FollowUpTask[];
  toggleFollowupStatus: (id: string) => void;
  addFollowupTask: (task: Omit<FollowUpTask, "id" | "status">) => void;

  specialists: SpecialistDoctor[];
  updateSpecialistStatus: (
    id: string,
    status: "Available" | "Busy" | "Unavailable"
  ) => void;

  facilityStatus: FacilityStatus;
  updateBedAvailability: (
    type: "icu" | "maternity" | "emergency" | "general",
    delta: number
  ) => void;
  toggleEquipmentStatus: (type: "oxygen" | "ct" | "xray") => void;

  phcMetrics: PHCPerformanceMetric[];

  toasts: ToastMessage[];
  showToast: (
    title: string,
    message: string,
    type?: "success" | "error" | "info" | "warning"
  ) => void;
  dismissToast: (id: string) => void;
}

const HealthcareContext = createContext<HealthcareContextType | undefined>(
  undefined
);

export const HealthcareProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentRole, setCurrentRole] = useState<UserRole>("phc-doctor");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    try {
      const sess = localStorage.getItem('niramaynet_session');
      if (sess) {
        const parsed = JSON.parse(sess);
        setIsLoggedIn(true);
        setCurrentUser(parsed.user);
        setAuthToken(parsed.token);
        if (parsed.user.role === 'HOSPITAL') setCurrentRole('district-hospital');
        else if (parsed.user.role === 'DHO') setCurrentRole('dho');
        else setCurrentRole('phc-doctor');
      }
    } catch { }
  }, []);

  const login = (userData: any, token: string) => {
    setIsLoggedIn(true);
    setCurrentUser(userData);
    setAuthToken(token);
    localStorage.setItem('niramaynet_session', JSON.stringify({ user: userData, token }));
    if (userData.role === 'HOSPITAL') setCurrentRole('district-hospital');
    else if (userData.role === 'DHO') setCurrentRole('dho');
    else setCurrentRole('phc-doctor');
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setAuthToken(null);
    localStorage.removeItem('niramaynet_session');
    if (typeof window !== 'undefined') window.location.href = '/';
  };

  const updateProfile = async (updates: Partial<UserOut>) => {
    if (!authToken || !currentUser) throw new Error("Not authenticated");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to update profile");
      }

      const updatedUser = await res.json();
      setCurrentUser(updatedUser);
      localStorage.setItem('niramaynet_web_session', JSON.stringify({ user: updatedUser, token: authToken }));
    } catch (error) {
      console.error("Profile update error:", error);
      throw error;
    }
  };

  const [patients, setPatients] = useState<PatientRecord[]>(INITIAL_PATIENTS);
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(
    INITIAL_PATIENTS[0]
  );
  const [ashaReferrals, setAshaReferrals] =
    useState<AshaReferral[]>(INITIAL_ASHA_REFERRALS);
  const [hospitalReferrals, setHospitalReferrals] = useState<
    HospitalReferral[]
  >(INITIAL_HOSPITAL_REFERRALS);
  const [medicines, setMedicines] = useState<MedicineItem[]>(INITIAL_MEDICINES);
  const [supplyRequests, setSupplyRequests] = useState<SupplyRequest[]>([
    {
      id: "REQ-901",
      facility: "PHC Dhadgaon",
      medicineName: "Tab Metformin 500mg",
      quantityRequested: 1000,
      unit: "tablets",
      requestDate: "Today, 08:30 AM",
      status: "Pending Approval",
      priority: "High",
    },
    {
      id: "REQ-902",
      facility: "PHC Khapar",
      medicineName: "Inj Anti-Snake Venom (Polyvalent)",
      quantityRequested: 25,
      unit: "vials",
      requestDate: "Yesterday, 04:15 PM",
      status: "Dispatched",
      priority: "High",
    },
  ]);
  const [diagnostics, setDiagnostics] =
    useState<DiagnosticTest[]>(INITIAL_DIAGNOSTICS);
  const [diagnosticOrders, setDiagnosticOrders] = useState<
    PatientDiagnosticOrder[]
  >(INITIAL_DIAGNOSTIC_ORDERS);
  const [followups, setFollowups] =
    useState<FollowUpTask[]>(INITIAL_FOLLOWUPS);
  const [specialists, setSpecialists] =
    useState<SpecialistDoctor[]>(INITIAL_SPECIALISTS);
  const [facilityStatus, setFacilityStatus] = useState<FacilityStatus>({
    icuBedsAvailable: 4,
    icuTotal: 12,
    maternityBedsAvailable: 6,
    maternityTotal: 24,
    emergencyBedsAvailable: 3,
    emergencyTotal: 10,
    generalBedsAvailable: 28,
    generalTotal: 80,
    oxygenPlantOperational: true,
    bloodBankUnitsOpos: 14,
    bloodBankUnitsOneg: 3,
    ctScanOperational: true,
    xrayOperational: true,
  });
  const [phcMetrics, setPhcMetrics] =
    useState<PHCPerformanceMetric[]>(INITIAL_PHC_METRICS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (
    title: string,
    message: string,
    type: "success" | "error" | "info" | "warning" = "info"
  ) => {
    const id = "toast-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // ── FastAPI Integration: fetch real hospital queue & status actions ─────────
  const fetchHospitalQueue = async () => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

    try {
      let tokenToUse = authToken;
      if (!tokenToUse) {
        const sess = localStorage.getItem('niramaynet_session');
        if (sess) tokenToUse = JSON.parse(sess).token;
      }
      if (!tokenToUse) return;

      // 2. Fetch queue items from GET /api/v1/queue/hospital
      const queueRes = await fetch(`${API_BASE}/queue/hospital`, {
        headers: { Authorization: `Bearer ${tokenToUse}` },
      });

      if (!queueRes.ok) return;
      const queueItems: any[] = await queueRes.json();

      if (!Array.isArray(queueItems) || queueItems.length === 0) return;

      const statusMap: Record<string, ReferralStatus> = {
        PENDING: "SENT",
        DISPATCHED: "IN_TRANSIT",
        CONFIRMED_ARRIVAL: "PATIENT ARRIVED",
        IN_CONSULTATION: "CONSULTED",
        COMPLETED: "COMPLETED",
        CANCELLED: "COMPLETED",
      };

      const mapped: HospitalReferral[] = queueItems.map((q) => {
        const priority =
          q.triage_category === "EMERGENCY"
            ? "EMERGENCY"
            : q.triage_category === "URGENT"
              ? "URGENT"
              : q.referral_reason?.includes("EMERGENCY")
                ? "EMERGENCY"
                : q.referral_reason?.includes("URGENT")
                  ? "URGENT"
                  : "ROUTINE";

        return {
          id: q.referral_code || q.referral_id,
          realReferralId: q.referral_id,
          patientId: q.patient_id,
          patientName: q.patient_name || `Patient (${q.patient_id.slice(0, 8)}…)`,
          age: q.patient_age || 30,
          sex: (q.patient_gender || "Female") as any,
          priority: priority as any,
          status: statusMap[q.referral_status] || "SENT",
          reason: q.referral_reason || "Hospital Queue Referral",
          referringFacility: q.patient_village ? `${q.patient_village} Sub-Center` : "Chinchpada Sub-Center",
          referringDoctor: "ASHA Anandi Patil",
          destinationFacility: q.destination_hospital || "District Hospital Nandurbar",
          department: "General Medicine",
          timestamp: q.referral_created_at
            ? new Date(q.referral_created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
            : "Just now",
          ambulanceRequested: q.has_dispatch || false,
          ambulanceStatus: q.has_dispatch ? "In Transit" : undefined,
          vitals: { bp: "120/80", pulse: "88", spo2: "96%", temp: "98.6°F" },
          clinicalSummary: q.referral_reason || "No clinical summary provided.",
          hospitalNotes: `Referral Code: ${q.referral_code || q.referral_id}`,
          assignedDoctor: undefined,
        };
      });

      setHospitalReferrals((prev) => {
        const realIds = new Set(mapped.map((m) => m.id));
        const uniqueMocks = prev.filter((p) => !realIds.has(p.id));
        return [...mapped, ...uniqueMocks];
      });
    } catch (_err) {
      // Silently fall back
    }
  };

  // ── FastAPI Integration: fetch real patient list from GET /patients/ ────────
  const fetchBackendPatients = async () => {
    try {
      const response = await api.get<any[]>("/patients/");
      if (response.data && Array.isArray(response.data)) {
        const mappedPatients: PatientRecord[] = response.data.map((p) => ({
          id: p.id,
          name: p.name,
          age: p.age,
          sex: (p.gender || p.sex || "Female") as any,
          phone: p.phone || "",
          village: p.village || "",
          abhaId: p.abha_id || p.abhaId || "",
          allergies: p.allergies || "",
          triagePriority: p.triagePriority || "ROUTINE",
          riskCategory: p.riskCategory || undefined,
          bloodGroup: p.bloodGroup || "O+",
          registrationDate: p.created_at ? p.created_at.split("T")[0] : "Today",
          vitals: p.vitals || { bp: "120/80", pulse: "78", spo2: "98%", temp: "98.6°F", weight: 55 },
          medicalHistory: p.medicalHistory || [],
          consultationHistory: p.consultationHistory || [],
        }));

        if (mappedPatients.length > 0) {
          setPatients(mappedPatients);
          setSelectedPatient((prev) => prev ? mappedPatients.find((mp) => mp.id === prev.id) || mappedPatients[0] : mappedPatients[0]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch backend patients:", err);
      // Safely retain existing patient list if API call fails
    }
  };

  useEffect(() => {
    let active = true;

    if (active) {
      fetchBackendPatients();
      fetchHospitalQueue();
    }

    return () => { active = false; };
  }, []);
  // ────────────────────────────────────────────────────────────────────────────
  // ────────────────────────────────────────────────────────────────────────────

  // 1. Accept ASHA Referral
  const acceptAshaReferral = (id: string) => {
    setAshaReferrals((prev) =>
      prev.map((ref) =>
        ref.id === id ? { ...ref, status: "Accepted" } : ref
      )
    );
    const referral = ashaReferrals.find((r) => r.id === id);
    if (referral) {
      setPatients((prev) =>
        prev.map((p) =>
          p.id === referral.patientId
            ? { ...p, currentStatus: "In Consultation" }
            : p
        )
      );
      const targetPatient = patients.find((p) => p.id === referral.patientId);
      if (targetPatient) {
        setSelectedPatient({ ...targetPatient, currentStatus: "In Consultation" });
      }
      showToast(
        "ASHA Referral Accepted",
        `Patient ${referral.patientName} loaded into consultation queue with priority ${referral.urgency}`,
        "success"
      );
    }
  };

  // 2. Save Patient Consultation
  const updatePatientConsultation = (
    patientId: string,
    consultation: {
      assessment: string;
      prescription: string[];
      notes: string;
      nextFollowUpDate?: string;
    }
  ) => {
    const newConsultationEntry = {
      date: new Date().toISOString().split("T")[0],
      doctor: "Dr. Sanjay Mehta",
      facility: "PHC Dhadgaon",
      assessment: consultation.assessment,
      prescription: consultation.prescription,
      notes: consultation.notes,
    };

    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          return {
            ...p,
            currentStatus: "Completed",
            consultationHistory: [newConsultationEntry, ...p.consultationHistory],
          };
        }
        return p;
      })
    );

    if (consultation.nextFollowUpDate) {
      const patient = patients.find((p) => p.id === patientId);
      if (patient) {
        setFollowups((prev) => [
          {
            id: "FU-" + Date.now(),
            patientId: patient.id,
            patientName: patient.name,
            phone: patient.phone,
            category: patient.riskCategory || "Other",
            dueDate: consultation.nextFollowUpDate || "In 7 Days",
            reason: `Post-consultation follow-up: ${consultation.assessment}`,
            status: "Upcoming",
            ashaAssigned: "Savitribai Patil",
          },
          ...prev,
        ]);
      }
    }

    showToast(
      "Consultation Saved",
      "Prescription and clinical assessment logged. Patient marked completed.",
      "success"
    );
  };

  // 3. Create Referral to District Hospital (Connects PHC to District Hospital!)
  const createHospitalReferral = (
    newReferral: Omit<HospitalReferral, "id" | "timestamp" | "status">
  ) => {
    const id = `REF-DH-${Math.floor(1000 + Math.random() * 9000)}`;
    const createdReferral: HospitalReferral = {
      ...newReferral,
      id,
      timestamp: "Just now",
      status: "SENT",
    };

    setHospitalReferrals((prev) => [createdReferral, ...prev]);

    // Update patient status
    setPatients((prev) =>
      prev.map((p) =>
        p.id === newReferral.patientId
          ? { ...p, currentStatus: "Referred to DH" }
          : p
      )
    );

    // Update DHO metrics for referring PHC
    setPhcMetrics((prev) =>
      prev.map((phc) =>
        phc.name === newReferral.referringFacility
          ? { ...phc, referralsSent: phc.referralsSent + 1 }
          : phc
      )
    );

    showToast(
      "Emergency Referral Dispatched",
      `Referral #${id} dispatched to ${newReferral.destinationFacility}. 108 Ambulance alert notified.`,
      newReferral.priority === "EMERGENCY" ? "warning" : "success"
    );

    return createdReferral;
  };

  // 4. Update Hospital Referral Status (District Hospital Workflow Action)
  const updateHospitalReferralStatus = async (
    id: string,
    status: ReferralStatus,
    hospitalNotes?: string,
    assignedDoctor?: string
  ) => {
    // Optimistic UI update
    setHospitalReferrals((prev) =>
      prev.map((ref) => {
        if (ref.id === id || ref.realReferralId === id) {
          return {
            ...ref,
            status,
            hospitalNotes: hospitalNotes !== undefined ? hospitalNotes : ref.hospitalNotes,
            assignedDoctor: assignedDoctor !== undefined ? assignedDoctor : ref.assignedDoctor,
          };
        }
        return ref;
      })
    );

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

    try {
      const targetRef = hospitalReferrals.find((r) => r.id === id || r.realReferralId === id);
      const uuidToUse = targetRef?.realReferralId || id;

      let tokenToUse = authToken;
      if (!tokenToUse) {
        const sess = localStorage.getItem('niramaynet_session');
        if (sess) tokenToUse = JSON.parse(sess).token;
      }
      if (!tokenToUse) {
        showToast("Action Failed", "Authentication failed with backend", "error");
        return;
      }

      let endpointAction = "";
      if (status === "PATIENT ARRIVED") endpointAction = "arrive";
      else if (status === "CONSULTED") endpointAction = "consult";
      else if (status === "COMPLETED") endpointAction = "complete";

      if (endpointAction) {
        const actionRes = await fetch(`${API_BASE}/queue/${uuidToUse}/${endpointAction}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenToUse}`,
          },
        });

        if (!actionRes.ok) {
          const errData = await actionRes.json().catch(() => ({}));
          const errMsg = errData.detail || `Failed to update status to ${status}`;
          showToast("Action Failed", errMsg, "error");
          await fetchHospitalQueue();
          return;
        }
      }

      showToast(
        "Referral Status Updated",
        `Referral #${id} updated to [${status}]. Synchronized across PHC and District records.`,
        "info"
      );

      await fetchHospitalQueue();
    } catch (_err) {
      showToast("Error", "Network or server error updating referral status", "error");
    }
  };

  // 5. Request More Information on Referral
  const requestMoreReferralInfo = (id: string, note: string) => {
    setHospitalReferrals((prev) =>
      prev.map((ref) =>
        ref.id === id
          ? {
            ...ref,
            hospitalNotes: `[INFO REQUESTED by DH]: ${note}\n${ref.hospitalNotes || ""}`,
          }
          : ref
      )
    );
    showToast(
      "Information Request Sent",
      `Clarification request logged for Referral #${id}. Referring Medical Officer notified.`,
      "warning"
    );
  };

  // 6. Request Medicine Supply
  const requestMedicineSupply = (
    medicineId: string,
    quantity: number,
    priority: "High" | "Routine" = "Routine"
  ) => {
    const med = medicines.find((m) => m.id === medicineId);
    if (!med) return;

    const newReq: SupplyRequest = {
      id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
      facility: med.facility || "Dhadgaon PHC",
      medicineName: med.name,
      quantityRequested: quantity,
      unit: med.unit,
      requestDate: "Just now",
      status: "Pending Approval",
      priority,
    };

    setSupplyRequests((prev) => [newReq, ...prev]);

    showToast(
      "Supply Indent Placed",
      `Requisition for ${quantity} ${med.unit} of ${med.name} sent to District Drug Store / DHO.`,
      "success"
    );
  };

  // 7. Order Diagnostic Test
  const orderDiagnosticTest = (patientId: string, testName: string) => {
    const patient = patients.find((p) => p.id === patientId);
    const newOrder: PatientDiagnosticOrder = {
      id: `DXO-${Math.floor(100 + Math.random() * 900)}`,
      patientId,
      patientName: patient ? patient.name : "Patient",
      testName,
      orderedBy: "Dr. Sanjay Mehta",
      orderDate: "Just now",
      status: "Pending",
    };

    setDiagnosticOrders((prev) => [newOrder, ...prev]);

    showToast(
      "Diagnostic Test Ordered",
      `${testName} requisition created for ${newOrder.patientName}. PHC lab alerted.`,
      "info"
    );
  };

  // 8. Record Diagnostic Result
  const recordDiagnosticResult = (orderId: string, result: string) => {
    setDiagnosticOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, status: "Completed", result }
          : order
      )
    );
    showToast("Lab Result Recorded", `Result '${result}' successfully updated.`, "success");
  };

  // 9. Toggle Follow-up Task Status
  const toggleFollowupStatus = (id: string) => {
    setFollowups((prev) =>
      prev.map((fu) =>
        fu.id === id
          ? {
            ...fu,
            status: fu.status === "Completed" ? "Upcoming" : "Completed",
          }
          : fu
      )
    );
  };

  const addFollowupTask = (task: Omit<FollowUpTask, "id" | "status">) => {
    const newTask: FollowUpTask = {
      ...task,
      id: "FU-" + Date.now(),
      status: "Upcoming",
    };
    setFollowups((prev) => [newTask, ...prev]);
    showToast("Follow-up Scheduled", `Task assigned to ${task.ashaAssigned}`, "success");
  };

  // 10. Update Specialist Status
  const updateSpecialistStatus = (
    id: string,
    status: "Available" | "Busy" | "Unavailable"
  ) => {
    setSpecialists((prev) =>
      prev.map((spec) => (spec.id === id ? { ...spec, status } : spec))
    );
    showToast("Specialist Status Changed", `Roster updated to ${status}`, "info");
  };

  // 11. Bed Availability & Equipment
  const updateBedAvailability = (
    type: "icu" | "maternity" | "emergency" | "general",
    delta: number
  ) => {
    setFacilityStatus((prev) => {
      if (type === "icu") {
        const next = Math.max(0, Math.min(prev.icuTotal, prev.icuBedsAvailable + delta));
        return { ...prev, icuBedsAvailable: next };
      }
      if (type === "maternity") {
        const next = Math.max(
          0,
          Math.min(prev.maternityTotal, prev.maternityBedsAvailable + delta)
        );
        return { ...prev, maternityBedsAvailable: next };
      }
      if (type === "emergency") {
        const next = Math.max(
          0,
          Math.min(prev.emergencyTotal, prev.emergencyBedsAvailable + delta)
        );
        return { ...prev, emergencyBedsAvailable: next };
      }
      if (type === "general") {
        const next = Math.max(
          0,
          Math.min(prev.generalTotal, prev.generalBedsAvailable + delta)
        );
        return { ...prev, generalBedsAvailable: next };
      }
      return prev;
    });
  };

  const toggleEquipmentStatus = (type: "oxygen" | "ct" | "xray") => {
    setFacilityStatus((prev) => {
      if (type === "oxygen") return { ...prev, oxygenPlantOperational: !prev.oxygenPlantOperational };
      if (type === "ct") return { ...prev, ctScanOperational: !prev.ctScanOperational };
      if (type === "xray") return { ...prev, xrayOperational: !prev.xrayOperational };
      return prev;
    });
  };

  return (
    <HealthcareContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        isLoggedIn,
        currentUser,
        authToken,
        login,
        logout,
        updateProfile,
        patients,
        selectedPatient,
        setSelectedPatient,
        updatePatientConsultation,
        ashaReferrals,
        acceptAshaReferral,
        hospitalReferrals,
        createHospitalReferral,
        updateHospitalReferralStatus,
        requestMoreReferralInfo,
        medicines,
        supplyRequests,
        requestMedicineSupply,
        diagnostics,
        diagnosticOrders,
        orderDiagnosticTest,
        recordDiagnosticResult,
        followups,
        toggleFollowupStatus,
        addFollowupTask,
        specialists,
        updateSpecialistStatus,
        facilityStatus,
        updateBedAvailability,
        toggleEquipmentStatus,
        phcMetrics,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}

      {/* Global Toast Render */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto shadow-xl rounded-xl border p-4 transition-all duration-300 transform translate-y-0 flex items-start justify-between gap-3 ${toast.type === "success"
                ? "bg-emerald-900/95 text-white border-emerald-700"
                : toast.type === "error"
                  ? "bg-rose-900/95 text-white border-rose-700"
                  : toast.type === "warning"
                    ? "bg-amber-900/95 text-white border-amber-700"
                    : "bg-slate-900/95 text-white border-slate-700"
              }`}
          >
            <div>
              <p className="font-bold text-sm tracking-wide">{toast.title}</p>
              <p className="text-xs text-slate-200 mt-1 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-300 hover:text-white text-xs font-semibold px-1 py-0.5"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </HealthcareContext.Provider>
  );
};

export const useHealthcare = () => {
  const context = useContext(HealthcareContext);
  if (!context) {
    throw new Error("useHealthcare must be used within a HealthcareProvider");
  }
  return context;
};
