import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

SAMPLES_DIR = Path(__file__).resolve().parent / "sample_data"
SAMPLES_DIR.mkdir(parents=True, exist_ok=True)


def create_label(filename, bg_color, title, subtitle, fields, border_color="#334155"):
    width, height = 700, 950
    img = Image.new("RGB", (width, height), color=bg_color)
    draw = ImageDraw.Draw(img)

    # Outer border & header banner
    draw.rectangle([(20, 20), (width - 20, height - 20)], outline=border_color, width=3)
    draw.rectangle([(25, 25), (width - 25, 120)], fill="#0f172a")

    # Title & subtitle
    # Use default font or fallback
    draw.text((width // 2, 55), title, fill="#ffffff", anchor="mm")
    draw.text((width // 2, 90), subtitle, fill="#94a3b8", anchor="mm")

    # Veg / Non-veg dot
    draw.rectangle([(width - 70, 45), (width - 40, 75)], outline="#22c55e", width=2)
    draw.ellipse([(width - 62, 53), (width - 48, 67)], fill="#22c55e")

    # Draw fields
    y = 145
    for label, val, is_alert in fields:
        # Field box
        box_bg = "#fee2e2" if is_alert else "#ffffff"
        box_border = "#ef4444" if is_alert else "#cbd5e1"
        draw.rectangle([(40, y), (width - 40, y + 55)], fill=box_bg, outline=box_border, width=2 if is_alert else 1)
        
        lbl_color = "#991b1b" if is_alert else "#475569"
        val_color = "#b91c1c" if is_alert else "#0f172a"
        
        draw.text((55, y + 16), label.upper(), fill=lbl_color)
        draw.text((55, y + 34), val, fill=val_color)
        y += 65

    # Bottom footer declaration
    draw.line([(40, height - 60), (width - 40, height - 60)], fill="#cbd5e1", width=1)
    draw.text((width // 2, height - 40), "PACKAGED COMMODITY - STATUTORY DECLARATION PANEL", fill="#64748b", anchor="mm")

    save_path = SAMPLES_DIR / filename
    img.save(save_path, "PNG")
    print(f"Created sample image: {save_path}")


def main():
    # 1. Fully Compliant
    create_label(
        "sample1_compliant_kurkure.png",
        "#f8fafc",
        "KURKURE - MASALA MUNCH",
        "Generic Name: Extruded Snack | Category: Food",
        [
            ("1. Net Quantity", "Net Qty: 85 g (Standard Metric Units)", False),
            ("2. Maximum Retail Price", "MRP Rs. 20.00 (incl. of all taxes)", False),
            ("3. Unit Sale Price (USP)", "Unit Sale Price: Rs. 0.24 / g (Verified: 20 / 85 = 0.24)", False),
            ("4. Date of Packing", "Pkd On: 07/2024 | Best Before: 4 Months from Pkg", False),
            ("5. Manufacturer & Factory Address", "PepsiCo India Holdings Pvt. Ltd., Village Channo, Sangrur - 148026, Punjab", False),
            ("6. Consumer Care Grievance Redressal", "Tel: 1800-22-4020 | Email: consumer.feedback@pepsico.com | Addr: Gurugram", False),
            ("7. Country of Origin & Allied", "Country of Origin: India | FSSAI Lic No: 10014064000435 | Veg Indicator", False),
            ("8. Display Panel & Font Size", "PDP Font Height: 2.8mm (> 2.0mm Min Standard for 85g)", False),
        ],
        border_color="#0284c7"
    )

    # 2. Missing Tax Clause in MRP
    create_label(
        "sample2_missing_tax_lays.png",
        "#fff7ed",
        "LAY'S - MAGIC MASALA",
        "Generic Name: Potato Chips | Category: Food",
        [
            ("1. Net Quantity", "Net Wt: 50 g", False),
            ("2. Maximum Retail Price (VIOLATION)", "MRP Rs. 20.00  [MISSING: '(incl. of all taxes)']", True),
            ("3. Unit Sale Price (USP)", "USP: Rs 0.40 / g", False),
            ("4. Date of Packing", "Pkd On: 08/2024 | Best Before: 4 Months", False),
            ("5. Manufacturer & Factory Address", "PepsiCo India Holdings Pvt. Ltd., Hajipur, Vaishali - 844101, Bihar", False),
            ("6. Consumer Care Contact", "Tel: 1800-22-4020 | Email: consumer.feedback@pepsico.com", False),
            ("7. Country of Origin & FSSAI", "Country of Origin: India | FSSAI Lic No: 10014011000214", False),
            ("8. Legal Metrology Clause Check", "Rule 6(1)(e) Violation Triggered - Non-compliant pricing declaration", True),
        ],
        border_color="#ea580c"
    )

    # 3. Wrong USP Calculation (Math Discrepancy)
    create_label(
        "sample3_wrong_usp_parleg.png",
        "#fefce8",
        "PARLE-G - ORIGINAL GLUCO",
        "Generic Name: Glucose Biscuits | Category: Food",
        [
            ("1. Net Quantity", "Net Weight: 130 g", False),
            ("2. Maximum Retail Price", "MRP Rs. 10.00 (incl. of all taxes)", False),
            ("3. Unit Sale Price (MATH VIOLATION)", "Declared USP: Rs. 0.15 / g  [ACTUAL: 10 / 130 = Rs. 0.08 / g]", True),
            ("4. Date of Packing", "Pkd On: 09/2024", False),
            ("5. Manufacturer Details", "Parle Products Pvt. Ltd., Vile Parle East, Mumbai - 400057, Maharashtra", False),
            ("6. Consumer Care (INCOMPLETE)", "Tel: 1800-22-7777 [MISSING: Mandatory Email ID]", True),
            ("7. Country of Origin & FSSAI", "Country of Origin: India | FSSAI Lic No: 10012022000109", False),
            ("8. Statutory Evaluation", "Rule 6(11) Math Discrepancy & Rule 6(1)(n) Missing Email", True),
        ],
        border_color="#ca8a04"
    )

    # 4. Missing Manufacturer Address & Consumer Care
    create_label(
        "sample4_missing_address_maggi.png",
        "#fef2f2",
        "MAGGI - 2-MINUTE NOODLES",
        "Generic Name: Instant Noodles | Category: Food",
        [
            ("1. Net Quantity", "Net Weight: 70 g", False),
            ("2. Maximum Retail Price", "MRP Rs. 14.00 (incl. of all taxes)", False),
            ("3. Unit Sale Price (USP)", "Unit Sale Price: Rs. 0.20 / g", False),
            ("4. Date of Packing", "Pkd: 09/2024 | Use By: 05/2025", False),
            ("5. Manufacturer Details (VIOLATION)", "Manufactured by Nestlé India Limited [MISSING: Factory Address & PIN]", True),
            ("6. Consumer Grievance (CRITICAL VIOLATION)", "[MISSING: No Consumer Care Cell / Phone / Email Declared]", True),
            ("7. Country of Origin & FSSAI", "Country of Origin: India | FSSAI Lic No: 10012011000168", False),
            ("8. Statutory Evaluation", "Rule 6(1)(a) Incomplete Address & Rule 6(1)(n) Missing Care Redressal", True),
        ],
        border_color="#dc2626"
    )

if __name__ == "__main__":
    main()
