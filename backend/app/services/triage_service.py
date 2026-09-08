from typing import List, Tuple

SYMPTOM_WEIGHTS = {
    "breathing": 3,
    "dyspnea": 3,
    "breathlessness": 3,
    "pregnancy": 2,
    "child": 2,
    "child_under_5": 2,
    "fever": 1,
    "headache": 1,
    "weakness": 1,
    "vomiting": 1,
    "chronic": 1,
}


def evaluate_triage(symptoms: List[str]) -> Tuple[int, str, str]:
    """
    Evaluates clinical symptoms using NirmayNet rule-based scoring logic:
    
    Weights:
    - Dyspnea / Breathing difficulty = 3
    - Pregnancy = 2
    - Child age < 5 = 2
    - Fever = 1
    - Headache = 1
    - Weakness = 1
    - Vomiting = 1
    - Chronic condition = 1

    Classification:
    - EMERGENCY: (Dyspnea + Pregnancy) OR Total Score >= 5
    - URGENT: Total Score >= 2 OR Child Age < 5
    - ROUTINE: Otherwise
    """
    normalized = {s.lower().strip() for s in symptoms}
    
    total_score = 0
    counted_keys = set()

    # Dyspnea / Breathing
    if any(k in normalized for k in ["breathing", "dyspnea", "breathlessness"]):
        total_score += 3
        counted_keys.add("dyspnea")

    # Pregnancy
    if "pregnancy" in normalized:
        total_score += 2
        counted_keys.add("pregnancy")

    # Child < 5
    if any(k in normalized for k in ["child", "child_under_5"]):
        total_score += 2
        counted_keys.add("child_under_5")

    # Other symptoms (weight 1 each)
    for k in ["fever", "headache", "weakness", "vomiting", "chronic"]:
        if k in normalized:
            total_score += 1
            counted_keys.add(k)

    has_dyspnea = "dyspnea" in counted_keys
    has_pregnancy = "pregnancy" in counted_keys
    has_child = "child_under_5" in counted_keys

    # Rule Classification
    if (has_dyspnea and has_pregnancy) or total_score >= 5:
        category = "EMERGENCY"
        if has_dyspnea and has_pregnancy:
            reason = "EMERGENCY: High risk combination of Dyspnea (Breathing Difficulty) and Pregnancy."
        else:
            reason = f"EMERGENCY: Total clinical risk score is {total_score} (>= 5)."
    elif total_score >= 2 or has_child:
        category = "URGENT"
        if has_child:
            reason = "URGENT: Pediatric patient under 5 years old requires urgent medical review."
        else:
            reason = f"URGENT: Total clinical risk score is {total_score} (>= 2)."
    else:
        category = "ROUTINE"
        reason = f"ROUTINE: Normal primary assessment. Total clinical risk score is {total_score} (< 2)."

    return total_score, category, reason
