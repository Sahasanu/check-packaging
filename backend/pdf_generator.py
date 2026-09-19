import os
import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT

from models import ComplianceReport
import config


class InspectionNoticePDFGenerator:
    """
    Generates official Department of Consumer Affairs Legal Metrology
    Inspection & Compliance Notice in PDF format.
    """

    @classmethod
    def generate_pdf(cls, report: ComplianceReport) -> str:
        pdf_filename = f"Inspection_Notice_{report.scan_id}.pdf"
        output_path = config.REPORTS_DIR / pdf_filename

        doc = SimpleDocTemplate(
            str(output_path),
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36
        )

        styles = getSampleStyleSheet()

        # Custom styles
        title_style = ParagraphStyle(
            'GovTitle',
            parent=styles['Heading1'],
            fontName='Helvetica-Bold',
            fontSize=14,
            leading=16,
            alignment=TA_CENTER,
            textColor=colors.HexColor('#1e293b')
        )
        
        subtitle_style = ParagraphStyle(
            'GovSubtitle',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=9,
            leading=12,
            alignment=TA_CENTER,
            textColor=colors.HexColor('#475569')
        )

        section_heading = ParagraphStyle(
            'SectionHead',
            parent=styles['Heading2'],
            fontName='Helvetica-Bold',
            fontSize=11,
            leading=14,
            textColor=colors.HexColor('#0f172a'),
            spaceBefore=8,
            spaceAfter=4
        )

        body_style = ParagraphStyle(
            'GovBody',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=8.5,
            leading=11,
            textColor=colors.HexColor('#334155')
        )

        body_bold = ParagraphStyle(
            'GovBodyBold',
            parent=body_style,
            fontName='Helvetica-Bold'
        )

        elements = []

        # 1. Header Banner
        elements.append(Paragraph("GOVERNMENT OF INDIA", subtitle_style))
        elements.append(Paragraph("MINISTRY OF CONSUMER AFFAIRS, FOOD & PUBLIC DISTRIBUTION", subtitle_style))
        elements.append(Paragraph("DEPARTMENT OF CONSUMER AFFAIRS - LEGAL METROLOGY DIVISION", title_style))
        elements.append(Paragraph("STATUTORY COMPLIANCE INSPECTION AUDIT CERTIFICATE", ParagraphStyle('NoticeTag', parent=subtitle_style, fontName='Helvetica-Bold', fontSize=10, textColor=colors.HexColor('#0369a1'))))
        elements.append(Spacer(1, 8))
        elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#0284c7'), spaceAfter=10))

        # 2. Meta Info Box
        status_color = "#16a34a" if report.overall_status == "COMPLIANT" else ("#dc2626" if report.overall_status == "NON_COMPLIANT" else "#d97706")
        status_text = f"<b>STATUS:</b> <font color='{status_color}'>{report.overall_status.replace('_', ' ')} ({report.compliance_score}%)</font>"

        info_data = [
            [Paragraph("<b>Inspection ID:</b>", body_style), Paragraph(f"LMPC-INSP-{report.scan_id[:8].upper()}", body_style),
             Paragraph("<b>Date / Time:</b>", body_style), Paragraph(report.timestamp, body_style)],
            [Paragraph("<b>Brand / Product:</b>", body_style), Paragraph(report.product_name or report.brand_name, body_style),
             Paragraph("<b>Audit Score:</b>", body_style), Paragraph(f"<b>{report.compliance_score} / 100</b>", body_style)],
            [Paragraph("<b>Commodity Category:</b>", body_style), Paragraph(report.extracted_data.commodity_category, body_style),
             Paragraph("<b>Statutory Result:</b>", body_style), Paragraph(status_text, body_style)],
        ]

        t_info = Table(info_data, colWidths=[110, 160, 100, 170])
        t_info.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
            ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ]))
        elements.append(t_info)
        elements.append(Spacer(1, 10))

        # 3. Product Declarations Summary
        elements.append(Paragraph("1. Extracted Package Declarations (Mandatory under Rule 6)", section_heading))
        
        ext = report.extracted_data
        mrp_str = f"Rs. {ext.mrp_amount}" if ext.mrp_amount else ext.mrp_raw
        if ext.mrp_has_inclusive_phrase:
            mrp_str += " (incl. of all taxes)"

        decl_data = [
            [Paragraph("<b>Declaration Field</b>", body_bold), Paragraph("<b>Extracted Packaging Value</b>", body_bold), Paragraph("<b>Statutory Rule Reference</b>", body_bold)],
            [Paragraph("Generic Name", body_style), Paragraph(ext.generic_name or "Not Specified", body_style), Paragraph("Rule 6(1)(b)", body_style)],
            [Paragraph("Net Quantity", body_style), Paragraph(ext.net_quantity_raw or f"{ext.net_quantity_value}{ext.net_quantity_unit}", body_style), Paragraph("Rule 6(1)(c) & Rule 12", body_style)],
            [Paragraph("MRP & Taxes", body_style), Paragraph(mrp_str or "Missing", body_style), Paragraph("Rule 6(1)(e)", body_style)],
            [Paragraph("Unit Sale Price (USP)", body_style), Paragraph(ext.unit_sale_price_raw or (f"Rs. {ext.unit_sale_price_value}/{ext.unit_sale_price_unit}" if ext.unit_sale_price_value else "Not Declared"), body_style), Paragraph("Rule 6(11) (2022 Amend)", body_style)],
            [Paragraph("Manufacturer / Packer", body_style), Paragraph(f"{ext.manufacturer_name}<br/>{ext.manufacturer_address}", body_style), Paragraph("Rule 6(1)(a)", body_style)],
            [Paragraph("Month & Year of Mfg/Pkg", body_style), Paragraph(ext.mfg_date_raw or "Missing", body_style), Paragraph("Rule 6(1)(d)", body_style)],
            [Paragraph("Consumer Care Contact", body_style), Paragraph(f"Phone: {ext.consumer_care_phone or 'N/A'}<br/>Email: {ext.consumer_care_email or 'N/A'}", body_style), Paragraph("Rule 6(1)(n)", body_style)],
            [Paragraph("Country of Origin", body_style), Paragraph(ext.country_of_origin or "India", body_style), Paragraph("Rule 6(1)(10)", body_style)],
        ]

        t_decl = Table(decl_data, colWidths=[130, 280, 130])
        t_decl.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#e2e8f0')),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
            ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('TOPPADDING', (0,0), (-1,-1), 3),
            ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ]))
        elements.append(t_decl)
        elements.append(Spacer(1, 10))

        # 4. Detailed Legal Metrology Audit Results
        elements.append(Paragraph("2. Clause-by-Clause Statutory Evaluation", section_heading))

        audit_headers = [Paragraph("<b>Statutory Rule & Check</b>", body_bold), Paragraph("<b>Status</b>", body_bold), Paragraph("<b>Findings & Remediation</b>", body_bold)]
        audit_rows = [audit_headers]

        for check in report.rule_results:
            if check.status == "PASS":
                s_tag = "<font color='#16a34a'><b>PASS</b></font>"
            elif check.status == "FAIL":
                s_tag = "<font color='#dc2626'><b>VIOLATION</b></font>"
            elif check.status == "WARNING":
                s_tag = "<font color='#d97706'><b>WARNING</b></font>"
            else:
                s_tag = "<font color='#64748b'><b>INFO</b></font>"

            rule_text = f"<b>{check.rule_name}</b><br/><font color='#64748b'>{check.legal_reference}</font>"
            desc_text = f"{check.description}<br/><b>Standard:</b> {check.expected_standard}"
            if check.status in ["FAIL", "WARNING"]:
                desc_text += f"<br/><font color='#b91c1c'><b>Action Required:</b> {check.remediation_guidance}</font>"

            audit_rows.append([
                Paragraph(rule_text, body_style),
                Paragraph(s_tag, body_style),
                Paragraph(desc_text, body_style)
            ])

        t_audit = Table(audit_rows, colWidths=[160, 65, 315])
        t_audit.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#e2e8f0')),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
            ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('TOPPADDING', (0,0), (-1,-1), 3.5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ]))
        elements.append(t_audit)
        elements.append(Spacer(1, 12))

        # 5. Enforcement Authority Seal & Signatory Box
        sign_data = [
            [
                Paragraph("<b>Enforcement Notice:</b><br/>This report is digitally generated pursuant to inspections under the Legal Metrology Act, 2009 and Packaged Commodities Rules, 2011. Non-compliances are subject to compounded proceedings / notices under Sec 36/38.", body_style),
                Paragraph("<b>Inspecting Authority:</b><br/><br/>___________________________<br/>Legal Metrology Officer (LMO)<br/>Seal & Signature", ParagraphStyle('Sign', parent=body_style, alignment=TA_CENTER))
            ]
        ]
        t_sign = Table(sign_data, colWidths=[360, 180])
        t_sign.setStyle(TableStyle([
            ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#94a3b8')),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ]))
        elements.append(t_sign)

        # Build Document
        doc.build(elements)
        return str(output_path)
