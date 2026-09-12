from typing import List, Tuple


# Rule-based symptom weights.
# These IDs match the symptoms used by the ASHA registration screen.
SYMPTOM_WEIGHTS = {
    # Emergency
    "breathing": 3,
    "chest_pain": 3,
    "unconscious": 5,
    "convulsions": 5,
    "severe_bleeding": 5,
    "severe_allergic_reaction": 5,
    "snake_bite": 5,
    "serious_injury": 5,
    "stroke_signs": 5,
    "severe_burns": 5,
    "severe_pregnancy_complication": 5,

    # Existing / high-risk
    "dyspnea": 3,
    "breathlessness": 3,
    "pregnancy": 2,
    "child": 2,
    "child_under_5": 2,

    # Urgent
    "high_fever": 2,
    "repeated_vomiting": 2,
    "diarrhea": 2,
    "dehydration": 2,
    "abdominal_pain": 2,
    "persistent_cough": 2,
    "ear_pain": 2,
    "urinary_symptoms": 2,
    "dizziness": 2,
    "severe_weakness": 2,
    "swollen_feet": 2,

    # Routine
    "fever": 1,
    "cold": 1,
    "cough": 1,
    "headache": 1,
    "body_ache": 1,
    "sore_throat": 1,
    "weakness": 1,
    "mild_stomach_discomfort": 1,
    "skin_problem": 1,
    "routine_checkup": 1,
    "vomiting": 1,
    "chronic": 1,
}


def evaluate_triage(symptoms: List[str]) -> Tuple[int, str, str]:
    """
    Evaluates the selected symptoms using rule-based clinical triage.

    EMERGENCY:
    - Any emergency symptom
    - OR breathing difficulty + pregnancy
    - OR total score >= 5

    URGENT:
    - Total score >= 2
    - OR child under 5

    ROUTINE:
    - Otherwise
    """

    normalized = {s.lower().strip() for s in symptoms if s}

    total_score = 0
    counted_keys = set()

    # ---------------------------------------------------------
    # Emergency symptoms
    # ---------------------------------------------------------
    emergency_symptoms = {
        "unconscious",
        "convulsions",
        "severe_bleeding",
        "severe_allergic_reaction",
        "snake_bite",
        "serious_injury",
        "stroke_signs",
        "severe_burns",
        "severe_pregnancy_complication",
        "chest_pain",
    }

    # Breathing difficulty is also high-risk.
    breathing_keys = {
        "breathing",
        "dyspnea",
        "breathlessness",
        "shortness_of_breath",
    }

    has_emergency_symptom = bool(normalized & emergency_symptoms)
    has_breathing = bool(normalized & breathing_keys)

    if has_emergency_symptom:
        total_score += 5
        counted_keys.update(normalized & emergency_symptoms)

    elif has_breathing:
        total_score += 3
        counted_keys.add("dyspnea")

    # ---------------------------------------------------------
    # Pregnancy
    # ---------------------------------------------------------
    pregnancy_keys = {
        "pregnancy",
        "maternal",
        "pregnant",
    }

    has_pregnancy = bool(normalized & pregnancy_keys)

    if has_pregnancy:
        total_score += 2
        counted_keys.add("pregnancy")

    # ---------------------------------------------------------
    # Child under 5
    # ---------------------------------------------------------
    child_keys = {
        "child",
        "child_under_5",
        "paediatric",
        "pediatric",
    }

    has_child = bool(normalized & child_keys)

    if has_child:
        total_score += 2
        counted_keys.add("child_under_5")

    # ---------------------------------------------------------
    # All remaining symptoms
    # ---------------------------------------------------------
    for symptom, weight in SYMPTOM_WEIGHTS.items():
        if symptom in normalized and symptom not in counted_keys:
            total_score += weight
            counted_keys.add(symptom)

    # ---------------------------------------------------------
    # Classification
    # ---------------------------------------------------------
    if (
        has_emergency_symptom
        or (has_breathing and has_pregnancy)
        or total_score >= 5
    ):
        category = "EMERGENCY"

        if has_emergency_symptom:
            reason = "EMERGENCY: A critical symptom requires immediate medical attention."
        elif has_breathing and has_pregnancy:
            reason = (
                "EMERGENCY: High risk combination of "
                "Breathing Difficulty and Pregnancy."
            )
        else:
            reason = (
                f"EMERGENCY: Total clinical risk score is "
                f"{total_score} (>= 5)."
            )

    elif total_score >= 2 or has_child:
        category = "URGENT"

        if has_child:
            reason = (
                "URGENT: Pediatric patient under 5 years old "
                "requires urgent medical review."
            )
        else:
            reason = (
                f"URGENT: Total clinical risk score is "
                f"{total_score} (>= 2)."
            )

    else:
        category = "ROUTINE"
        reason = (
            f"ROUTINE: Normal primary assessment. "
            f"Total clinical risk score is {total_score} (< 2)."
        )

    return total_score, category, reason