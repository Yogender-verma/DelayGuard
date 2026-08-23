import os
import json
import datetime
import pandas as pd
from typing import Dict, List, Any

# Paths
DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data')
RAW_DIR = os.path.join(DATA_DIR, 'raw')
PROCESSED_DIR = os.path.join(DATA_DIR, 'processed')
FRONTEND_DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'frontend', 'src', 'data')

os.makedirs(RAW_DIR, exist_ok=True)
os.makedirs(PROCESSED_DIR, exist_ok=True)
os.makedirs(FRONTEND_DATA_DIR, exist_ok=True)

# Default prototype SLA configurations (in days)
DEFAULT_SLAS = {
    "pension delay": 15,
    "refund pending": 10,
    "road damage": 20,
    "broadband issues": 5,
    "epf withdrawal": 7,
    "service delay": 14,
    "harassment": 3,
    "corruption": 5,
    "general grievance": 15
}

class ModularRiskEngine:
    """
    A modular risk scoring engine. Filters and computes individual risk factors,
    combining them into a normalized 0-100 risk score.
    """
    def __init__(self, sla_days: int):
        self.sla_days = sla_days
        self.factors = []

    def add_factor(self, weight: float, scorer_fn):
        self.factors.append((weight, scorer_fn))

    def compute_score(self, context: dict) -> tuple[int, List[str]]:
        total_score = 0.0
        explanations = []
        
        for weight, scorer_fn in self.factors:
            score, explanation = scorer_fn(context, self.sla_days)
            total_score += score * weight
            if explanation:
                explanations.append(explanation)
                
        # Normalize and clamp to 0-100
        final_score = min(100, max(0, int(total_score)))
        return final_score, explanations

# Define individual modular scorers
def score_sla_consumed(context: dict, sla_days: int) -> tuple[float, str]:
    elapsed = context.get('elapsed_days', 0)
    consumed_pct = (elapsed / sla_days) * 100 if sla_days > 0 else 0
    
    if consumed_pct >= 90:
        return 100.0, f"Critical SLA consumption: {consumed_pct:.1f}% of configured deadline elapsed."
    elif consumed_pct >= 70:
        return 75.0, f"High SLA consumption: {consumed_pct:.1f}% of configured deadline elapsed."
    elif consumed_pct >= 50:
        return 40.0, f"Moderate SLA consumption: {consumed_pct:.1f}% of deadline elapsed."
    return 10.0, ""

def score_stage_delay(context: dict, sla_days: int) -> tuple[float, str]:
    duration = context.get('current_stage_duration_days', 0)
    hist_avg = context.get('historical_avg_days', 1.0)
    
    if duration > hist_avg * 2.0:
        return 100.0, f"Severe bottleneck: current stage duration ({duration:.1f} days) is over 2x historical average ({hist_avg:.1f} days)."
    elif duration > hist_avg * 1.3:
        return 60.0, f"Moderate bottleneck: stage duration ({duration:.1f} days) exceeds historical average ({hist_avg:.1f} days)."
    return 10.0, ""

def score_backlog(context: dict, sla_days: int) -> tuple[float, str]:
    backlog = context.get('backlog_size', 0)
    
    if backlog >= 40:
        return 100.0, f"Team backlog overload: {backlog} pending cases in current department queue."
    elif backlog >= 20:
        return 50.0, f"High department backlog: {backlog} cases currently queueing."
    return 10.0, ""

def score_previous_delays(context: dict, sla_days: int) -> tuple[float, str]:
    delay_rate = context.get('historical_delay_rate', 0)
    
    if delay_rate >= 60:
        return 100.0, f"High risk area: current department stage has a {delay_rate}% historical SLA breach rate."
    elif delay_rate >= 30:
        return 50.0, f"Moderate risk area: department stage historical breach rate is {delay_rate}%."
    return 10.0, ""


def process_goi_dataset():
    print("Ingesting Kaggle GOI Grievance Report Dataset...")
    
    grievance_file = os.path.join(RAW_DIR, 'no_pii_grievance.json')
    action_file = os.path.join(RAW_DIR, 'no_pii_action_history.json')
    mapping_file = os.path.join(RAW_DIR, 'CategoryCode_Mapping.xlsx')
    
    if not os.path.exists(grievance_file) or not os.path.exists(action_file):
        print("\n[WARNING] Raw Kaggle dataset files not found in data/raw/")
        print("Please place the following files manually in: data/raw/")
        print("  - no_pii_grievance.json")
        print("  - no_pii_action_history.json")
        print("  - CategoryCode_Mapping.xlsx (Optional mapping xlsx)\n")
        print("Generating a sample preview processed file to make the app demo-ready...")
        generate_mock_processed_data()
        return

    # Ingest JSON files
    try:
        with open(grievance_file, 'r', encoding='utf-8') as f:
            grievances = json.load(f)
        with open(action_file, 'r', encoding='utf-8') as f:
            actions = json.load(f)
    except Exception as e:
        print(f"Error reading JSON files: {e}")
        return

    # Load mapping if exists
    category_mapping = {}
    if os.path.exists(mapping_file):
        try:
            df = pd.read_excel(mapping_file)
            for _, row in df.iterrows():
                category_mapping[str(row['CategoryCode'])] = row['CategoryName']
        except Exception as e:
            print(f"Excel mapping read error: {e}")

    # Build maps of actions
    action_map = {}
    for act in actions:
        reg_no = act.get('registration_no')
        if reg_no not in action_map:
            action_map[reg_no] = []
        action_map[reg_no].append(act)

    # Sort actions by date
    for reg_no in action_map:
        action_map[reg_no].sort(key=lambda x: x.get('action_date', ''))

    # Process records
    processed_records = []
    
    # Calculate queue sizes per department
    dept_backlogs = {}
    for g in grievances:
        if g.get('current_status') == 'Pending':
            dept = g.get('org_code', 'General')
            dept_backlogs[dept] = dept_backlogs.get(dept, 0) + 1

    for g in grievances:
        reg_no = g.get('registration_no')
        category_code = str(g.get('category_code', ''))
        service_type = category_mapping.get(category_code, g.get('subject_content_text', 'General Grievance')[:40])
        
        # Clean service type name
        service_type_lower = service_type.lower()
        sla_days = DEFAULT_SLAS.get(service_type_lower, 15)
        for key, value in DEFAULT_SLAS.items():
            if key in service_type_lower:
                sla_days = value
                break
                
        # Parse Dates
        receipt_date_str = g.get('date_of_receipt', '')
        if not receipt_date_str:
            continue
        try:
            receipt_date = datetime.datetime.strptime(receipt_date_str[:10], '%Y-%m-%d')
        except ValueError:
            continue

        status = g.get('current_status', 'Pending')
        
        # Extract Timeline / Stages
        g_actions = action_map.get(reg_no, [])
        stages = []
        
        # Add initial Submitted stage
        stages.append({
            "name": "Submitted",
            "duration": "1 day",
            "isCurrent": len(g_actions) == 0,
            "status": "Completed" if len(g_actions) > 0 else "Current"
        })

        for i, act in enumerate(g_actions):
            stage_name = act.get('action_name', 'Processing')
            is_last = (i == len(g_actions) - 1)
            stages.append({
                "name": stage_name,
                "duration": "1.2 days" if not is_last else "Pending",
                "isCurrent": is_last and status == 'Pending',
                "status": "Completed" if not is_last or status == 'Closed' else "Current"
            })

        # Calculate time elapsed
        current_date = datetime.datetime(2026, 8, 23)  # Fixed demo time context
        elapsed_days = (current_date - receipt_date).days
        elapsed_days = max(1, elapsed_days)

        # Separate original vs derived SLA features
        original_fields = {
            "registration_no": reg_no,
            "date_of_receipt": receipt_date_str,
            "org_code": g.get('org_code', 'General'),
            "current_status": status,
            "subject_content_text": g.get('subject_content_text', ''),
            "category_code": category_code
        }

        # Derived SLA config / prototype features
        remaining_days = max(0, sla_days - elapsed_days)
        consumed_percentage = min(100, int((elapsed_days / sla_days) * 100))
        
        dept = g.get('org_code', 'General')
        backlog_size = dept_backlogs.get(dept, 0)
        
        # Mocking some historical properties for prediction engine input
        context = {
            "elapsed_days": elapsed_days,
            "current_stage_duration_days": elapsed_days * 0.6,
            "historical_avg_days": 2.0,
            "backlog_size": backlog_size,
            "historical_delay_rate": 45 if backlog_size > 20 else 15
        }

        # Modular Risk Engine
        engine = ModularRiskEngine(sla_days)
        engine.add_factor(0.4, score_sla_consumed)
        engine.add_factor(0.3, score_stage_delay)
        engine.add_factor(0.2, score_backlog)
        engine.add_factor(0.1, score_previous_delays)
        
        risk_score, explanations = engine.compute_score(context)
        
        if risk_score >= 80:
            risk_level = 'Critical'
            recommended_action = 'Reassign'
        elif risk_score >= 60:
            risk_level = 'High'
            recommended_action = 'Escalate'
        elif risk_score >= 40:
            risk_level = 'Medium'
            recommended_action = 'Prioritize'
        else:
            risk_level = 'Low'
            recommended_action = 'Monitor'

        derived_sla_features = {
            "service_type": service_type,
            "sla_limit_days": sla_days,
            "elapsed_days": elapsed_days,
            "remaining_days": remaining_days,
            "consumed_percentage": consumed_percentage,
            "risk_score": risk_score,
            "risk_level": risk_level,
            "recommended_action": recommended_action,
            "backlog": backlog_size,
            "current_stage": stages[-1]["name"] if stages else "Submitted",
            "historical_evidence": explanations,
            "stages": stages
        }

        processed_records.append({
            "original": original_fields,
            "derived": derived_sla_features
        })

    # Write processed file
    output_path = os.path.join(PROCESSED_DIR, 'processed_data.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(processed_records, f, indent=2)

    # Copy to frontend folder
    frontend_path = os.path.join(FRONTEND_DATA_DIR, 'processed_data.json')
    with open(frontend_path, 'w', encoding='utf-8') as f:
        json.dump(processed_records, f, indent=2)

    print(f"Dataset processed successfully! Output written to {output_path}")

def generate_mock_processed_data():
    """Generates preview-ready processed data for demo-ing immediately"""
    departments = ['Ministry of Railways', 'Department of Posts', 'Ministry of Finance', 'Department of Telecommunications']
    services = ['Pension Delay Grievance', 'Broadband Issues Request', 'Refund Pending Request', 'Road Damage Alert', 'EPF Withdrawal Clearance']
    
    mock_records = []
    for i in range(200):
        reg_no = f"GOI-{204230 + i}"
        status = 'Pending' if i < 40 else 'Closed'
        dept = departments[i % len(departments)]
        service = services[i % len(services)]
        
        receipt_date = datetime.datetime(2026, 8, 23) - datetime.timedelta(days=(3 + (i % 15)))
        receipt_date_str = receipt_date.strftime('%Y-%m-%d')
        
        sla_days = DEFAULT_SLAS.get(service.lower().split()[0], 10)
        elapsed_days = (datetime.datetime(2026, 8, 23) - receipt_date).days
        remaining_days = max(0, sla_days - elapsed_days)
        consumed_percentage = min(100, int((elapsed_days / sla_days) * 100))
        
        # Risk factors
        backlog_size = 45 if i % 4 == 0 else 12
        stage_delay = i % 5 == 0
        
        # Risk scoring
        risk_score = 15
        explanations = []
        
        if status == 'Pending':
            if consumed_percentage >= 90:
                risk_score += 40
                explanations.append(f"Critical SLA consumption: {consumed_percentage}% of configured deadline elapsed.")
            elif consumed_percentage >= 70:
                risk_score += 25
                explanations.append(f"High SLA consumption: {consumed_percentage}% of configured deadline elapsed.")
                
            if backlog_size >= 40:
                risk_score += 30
                explanations.append(f"Team backlog overload: {backlog_size} pending cases in current department queue.")
                
            if stage_delay:
                risk_score += 25
                explanations.append("Severe bottleneck: current stage duration is over 2x historical average.")
                
        risk_score = min(100, risk_score)
        
        if risk_score >= 80:
            risk_level = 'Critical'
            recommended_action = 'Reassign'
        elif risk_score >= 60:
            risk_level = 'High'
            recommended_action = 'Escalate'
        elif risk_score >= 40:
            risk_level = 'Medium'
            recommended_action = 'Prioritize'
        else:
            risk_level = 'Low'
            recommended_action = 'Monitor'

        original_fields = {
            "registration_no": reg_no,
            "date_of_receipt": receipt_date_str,
            "org_code": dept,
            "current_status": status,
            "subject_content_text": f"Grievance regarding {service.lower()} details.",
            "category_code": f"CAT-00{i%5}"
        }

        derived_sla_features = {
            "service_type": service,
            "sla_limit_days": sla_days,
            "elapsed_days": elapsed_days,
            "remaining_days": remaining_days,
            "consumed_percentage": consumed_percentage,
            "risk_score": risk_score if status == 'Pending' else 0,
            "risk_level": risk_level if status == 'Pending' else 'Low',
            "recommended_action": recommended_action if status == 'Pending' else 'Monitor',
            "backlog": backlog_size,
            "current_stage": "Approval" if i % 3 == 0 else "Verification",
            "historical_evidence": explanations,
            "stages": [
                { "name": "Submitted", "duration": "1 day", "isCurrent": False, "status": "Completed" },
                { "name": "Verification", "duration": "2 days", "isCurrent": i % 3 != 0, "status": "Completed" if i % 3 == 0 else "Current" },
                { "name": "Approval", "duration": "Pending", "isCurrent": i % 3 == 0, "status": "Current" if i % 3 == 0 else "Pending" }
            ]
        }

        mock_records.append({
            "original": original_fields,
            "derived": derived_sla_features
        })

    # Write processed mock
    output_path = os.path.join(FRONTEND_DATA_DIR, 'processed_data.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(mock_records, f, indent=2)
    print(f"Generated mock processed preview data at {output_path}")

if __name__ == "__main__":
    process_goi_dataset()
