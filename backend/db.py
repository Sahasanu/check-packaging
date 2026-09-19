import os
import sys
import json
import sqlite3
from typing import List, Optional, Dict, Any
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from models import ComplianceReport, ScanHistoryItem
import config

DB_PATH = config.DATA_DIR / "lmpc_scans.db"


def init_db():
    conn = sqlite3.connect(str(DB_PATH))
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS scans (
            scan_id TEXT PRIMARY KEY,
            timestamp TEXT,
            product_name TEXT,
            brand_name TEXT,
            overall_status TEXT,
            compliance_score INTEGER,
            failed_count INTEGER,
            warning_count INTEGER,
            image_filename TEXT,
            image_url TEXT,
            report_json TEXT
        )
    """)
    conn.commit()
    conn.close()


def save_scan_report(report: ComplianceReport):
    init_db()
    conn = sqlite3.connect(str(DB_PATH))
    cursor = conn.cursor()
    cursor.execute("""
        INSERT OR REPLACE INTO scans 
        (scan_id, timestamp, product_name, brand_name, overall_status, compliance_score, failed_count, warning_count, image_filename, image_url, report_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        report.scan_id,
        report.timestamp,
        report.product_name,
        report.brand_name,
        report.overall_status,
        report.compliance_score,
        report.failed_count,
        report.warning_count,
        report.image_filename,
        report.image_url,
        report.model_dump_json()
    ))
    conn.commit()
    conn.close()


def get_scan_report(scan_id: str) -> Optional[ComplianceReport]:
    init_db()
    conn = sqlite3.connect(str(DB_PATH))
    cursor = conn.cursor()
    cursor.execute("SELECT report_json FROM scans WHERE scan_id = ?", (scan_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        data = json.loads(row[0])
        return ComplianceReport(**data)
    return None


def get_scan_history(limit: int = 50) -> List[ScanHistoryItem]:
    init_db()
    conn = sqlite3.connect(str(DB_PATH))
    cursor = conn.cursor()
    cursor.execute("""
        SELECT scan_id, timestamp, product_name, brand_name, overall_status, compliance_score, failed_count, image_url
        FROM scans
        ORDER BY timestamp DESC
        LIMIT ?
    """, (limit,))
    rows = cursor.fetchall()
    conn.close()
    
    return [
        ScanHistoryItem(
            scan_id=r[0],
            timestamp=r[1],
            product_name=r[2],
            brand_name=r[3],
            overall_status=r[4],
            compliance_score=r[5],
            failed_count=r[6],
            image_url=r[7]
        )
        for r in rows
    ]


def get_analytics_summary() -> Dict[str, Any]:
    init_db()
    conn = sqlite3.connect(str(DB_PATH))
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*), AVG(compliance_score) FROM scans")
    total_scans, avg_score = cursor.fetchone()
    total_scans = total_scans or 0
    avg_score = round(avg_score, 1) if avg_score else 0
    
    cursor.execute("SELECT overall_status, COUNT(*) FROM scans GROUP BY overall_status")
    status_counts = dict(cursor.fetchall())
    
    # Violation breakdown by loading reports
    cursor.execute("SELECT report_json FROM scans ORDER BY timestamp DESC LIMIT 100")
    rows = cursor.fetchall()
    conn.close()
    
    violation_stats = {}
    for r in rows:
        try:
            report_dict = json.loads(r[0])
            for check in report_dict.get("rule_results", []):
                if check.get("status") == "FAIL":
                    r_name = check.get("rule_name", "Unknown Rule")
                    violation_stats[r_name] = violation_stats.get(r_name, 0) + 1
        except Exception:
            pass

    return {
        "total_inspections": total_scans,
        "average_compliance_score": avg_score,
        "status_distribution": {
            "compliant": status_counts.get("COMPLIANT", 0),
            "non_compliant": status_counts.get("NON_COMPLIANT", 0),
            "flagged": status_counts.get("FLAGGED_FOR_REVIEW", 0)
        },
        "top_violations": sorted(
            [{"rule": k, "count": v} for k, v in violation_stats.items()],
            key=lambda x: x["count"],
            reverse=True
        )[:5]
    }
