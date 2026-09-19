import os
import sys
import json
import base64
import logging
from io import BytesIO
from pathlib import Path
from typing import Optional
from PIL import Image

BACKEND_DIR = Path(__file__).resolve().parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from models import ExtractedLabelData
import config

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are an expert Legal Metrology & Food Safety Compliance Inspector under the Department of Consumer Affairs (DoCA), Government of India.
Analyze the provided packaged commodity / food packet label image thoroughly and extract all mandatory declarations required under the Legal Metrology (Packaged Commodities) Rules, 2011 (PCR 2011) and FSSAI packaging guidelines.

Extract the following declarations with maximum accuracy:
1. Brand Name & Generic/Common Commodity Name (Rule 6(1)(b)).
2. Name and physical address of Manufacturer / Packer / Importer (Rule 6(1)(a)).
3. Net Quantity with numeric value and standard unit (g, kg, ml, l, N) (Rule 6(1)(c)).
4. Maximum Retail Price (MRP), raw text, amount, and whether "incl. of all taxes" / "inclusive of all taxes" is present (Rule 6(1)(e)).
5. Unit Sale Price (USP) e.g., Rs. 0.40/g or Rs. 25.00/100g if declared (Rule 6(11)).
6. Month and Year of Manufacture / Pre-packing / Import (Rule 6(1)(d)).
7. Consumer Care Details: contact person/designation, phone/toll-free, email ID, and postal address (Rule 6(1)(n)).
8. Country of Origin (Rule 6(1)(10)).
9. FSSAI License Number (14-digit) and Veg/Non-Veg indicator (Green/Brown dot).
10. Legibility, contrast, and font size adequacy (Rule 7 & Schedule II).
11. Detected languages on the package (Rule 9).
12. Full raw text transcript of the label.

Return strictly valid JSON conforming to the requested schema. If a field is not found, set it as null or empty string."""


class LabelExtractor:
    """
    Extracts structured Legal Metrology declarations from packaging label images
    using Gemini Multimodal Vision API. No mock/dummy data is returned on live uploads.
    """

    @classmethod
    def extract_from_image(cls, image_path: Path, custom_api_key: Optional[str] = None, sample_id: Optional[str] = None) -> ExtractedLabelData:
        # If user explicitly selected a pre-configured demo test case
        if sample_id:
            return cls._get_sample_fixture(sample_id)

        # For actual uploaded/photographed packaging images:
        api_key_str = ""
        if isinstance(custom_api_key, str) and custom_api_key.strip():
            api_key_str = custom_api_key.strip()
        elif isinstance(config.GEMINI_API_KEY, str) and config.GEMINI_API_KEY.strip():
            api_key_str = config.GEMINI_API_KEY.strip()
        elif isinstance(os.environ.get("GEMINI_API_KEY"), str) and os.environ.get("GEMINI_API_KEY", "").strip():
            api_key_str = os.environ.get("GEMINI_API_KEY", "").strip()

        if not api_key_str or len(api_key_str) < 10:
            raise ValueError(
                "Gemini API Key is missing or invalid. Please configure a valid Google Gemini API key in '.env' or click 'Configure API Key' in the top navigation bar to scan real images."
            )

        # Perform live Vision AI extraction
        return cls._extract_with_gemini(image_path, api_key_str)

    @classmethod
    def _extract_with_gemini(cls, image_path: Path, api_key: str) -> ExtractedLabelData:
        try:
            from google import genai
            from google.genai import types

            client = genai.Client(api_key=api_key)
            
            with open(image_path, "rb") as f:
                image_bytes = f.read()

            mime_type = "image/jpeg"
            if str(image_path).lower().endswith(".png"):
                mime_type = "image/png"
            elif str(image_path).lower().endswith(".webp"):
                mime_type = "image/webp"

            prompt_text = (
                f"{SYSTEM_PROMPT}\n\n"
                "Return a single JSON object matching this schema:\n"
                "{\n"
                '  "brand_name": "string",\n'
                '  "generic_name": "string",\n'
                '  "commodity_category": "string",\n'
                '  "manufacturer_name": "string",\n'
                '  "manufacturer_address": "string",\n'
                '  "packer_name": "string or null",\n'
                '  "packer_address": "string or null",\n'
                '  "importer_name": "string or null",\n'
                '  "importer_address": "string or null",\n'
                '  "country_of_origin": "string",\n'
                '  "net_quantity_raw": "string",\n'
                '  "net_quantity_value": float or null,\n'
                '  "net_quantity_unit": "string or null",\n'
                '  "mrp_raw": "string",\n'
                '  "mrp_amount": float or null,\n'
                '  "mrp_has_inclusive_phrase": boolean,\n'
                '  "unit_sale_price_raw": "string or null",\n'
                '  "unit_sale_price_value": float or null,\n'
                '  "unit_sale_price_unit": "string or null",\n'
                '  "mfg_date_raw": "string or null",\n'
                '  "exp_date_raw": "string or null",\n'
                '  "batch_or_lot_no": "string or null",\n'
                '  "consumer_care_name_desig": "string or null",\n'
                '  "consumer_care_phone": "string or null",\n'
                '  "consumer_care_email": "string or null",\n'
                '  "consumer_care_address": "string or null",\n'
                '  "fssai_lic_no": "string or null",\n'
                '  "veg_nonveg_status": "Veg" | "Non-Veg" | "None",\n'
                '  "font_size_adequate": boolean,\n'
                '  "principal_display_panel_notes": "string",\n'
                '  "detected_languages": ["English", "Hindi"],\n'
                '  "raw_ocr_text": "string"\n'
                "}"
            )

            models_to_try = [
                'gemini-3.5-flash',
                'gemini-3.1-flash-lite',
                'gemini-flash-latest',
                'gemini-2.5-pro',
                'gemini-pro-latest',
                'gemini-3.6-flash',
                'gemini-3.7-flash'
            ]
            response = None
            last_err = None

            for model_name in models_to_try:
                try:
                    print(f"[*] [Gemini Vision AI] Sending package image to model: {model_name}...")
                    response = client.models.generate_content(
                        model=model_name,
                        contents=[
                            types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
                            prompt_text
                        ],
                        config=types.GenerateContentConfig(
                            response_mime_type="application/json",
                            temperature=0.1
                        )
                    )
                    if response and response.text:
                        print(f"[+] [Gemini Vision AI] Successfully received structured declarations using {model_name}")
                        break
                except Exception as ex:
                    print(f"[-] [Gemini Vision AI] Model {model_name} failed: {ex}. Trying next available model...")
                    last_err = ex
                    continue

            if not response or not response.text:
                error_detail = str(last_err) if last_err else "No response text received from Gemini API"
                raise RuntimeError(f"Gemini API Error: {error_detail}")

            raw_json_str = response.text.strip()
            if raw_json_str.startswith("```"):
                lines = raw_json_str.split("\n")
                if lines[0].startswith("```"):
                    lines = lines[1:]
                if lines and lines[-1].startswith("```"):
                    lines = lines[:-1]
                raw_json_str = "\n".join(lines).strip()

            data_dict = json.loads(raw_json_str)
            return ExtractedLabelData(**data_dict)

        except Exception as e:
            logger.error(f"Gemini Vision Extraction Error: {e}")
            raise RuntimeError(f"AI Extraction Failed: {str(e)}")

    @classmethod
    def _get_sample_fixture(cls, sample_id: str) -> ExtractedLabelData:
        """Returns verified statutory test data only when user clicks a preset sample button."""
        if sample_id == "sample1":
            return ExtractedLabelData(
                brand_name="Kurkure",
                generic_name="Extruded Snack - Masala Munch",
                commodity_category="Food / Snacks",
                manufacturer_name="PepsiCo India Holdings Pvt. Ltd.",
                manufacturer_address="Village Channo, Patiala-Sangrur Road, P.O. Bhawanigarh, Distt. Sangrur - 148026, Punjab",
                country_of_origin="India",
                net_quantity_raw="Net Quantity: 85 g",
                net_quantity_value=85.0,
                net_quantity_unit="g",
                mrp_raw="MRP Rs. 20.00 (incl. of all taxes)",
                mrp_amount=20.0,
                mrp_has_inclusive_phrase=True,
                unit_sale_price_raw="Unit Sale Price: Rs. 0.24 / g",
                unit_sale_price_value=0.24,
                unit_sale_price_unit="g",
                mfg_date_raw="07/2024",
                exp_date_raw="4 Months from Packaging",
                batch_or_lot_no="PB24B0912",
                consumer_care_name_desig="Consumer Care Manager",
                consumer_care_phone="1800-22-4020",
                consumer_care_email="consumer.feedback@pepsico.com",
                consumer_care_address="PepsiCo India Holdings Pvt. Ltd., Level 3-5, Pioneer Square, Sector 62, Golf Course Extn Road, Gurugram - 122101, Haryana",
                fssai_lic_no="10014064000435",
                veg_nonveg_status="Veg",
                font_size_adequate=True,
                principal_display_panel_notes="Prominent display with high contrast and standard numeral height above 2.0mm.",
                detected_languages=["English", "Hindi"],
                raw_ocr_text="Kurkure Masala Munch. Net Qty: 85g. MRP Rs. 20.00 (incl. of all taxes). USP: Rs 0.24/g. Pkd: 07/2024. FSSAI Lic No. 10014064000435. Green Dot Veg Symbol."
            )
            
        elif sample_id == "sample2":
            return ExtractedLabelData(
                brand_name="Lay's",
                generic_name="Potato Chips - India's Magic Masala",
                commodity_category="Food / Snacks",
                manufacturer_name="PepsiCo India Holdings Pvt. Ltd.",
                manufacturer_address="Plot No. 27-28, Industrial Area, Hajipur, Vaishali - 844101, Bihar",
                country_of_origin="India",
                net_quantity_raw="Net Wt: 50g",
                net_quantity_value=50.0,
                net_quantity_unit="g",
                mrp_raw="MRP Rs. 20.00",
                mrp_amount=20.0,
                mrp_has_inclusive_phrase=False,
                unit_sale_price_raw="USP: Rs 0.40/g",
                unit_sale_price_value=0.40,
                unit_sale_price_unit="g",
                mfg_date_raw="08/2024",
                exp_date_raw="4 Months from Packaging",
                batch_or_lot_no="L2408B1",
                consumer_care_name_desig="Consumer Feedback Desk",
                consumer_care_phone="1800-22-4020",
                consumer_care_email="consumer.feedback@pepsico.com",
                consumer_care_address="PepsiCo India, Gurugram",
                fssai_lic_no="10014011000214",
                veg_nonveg_status="Veg",
                font_size_adequate=True,
                principal_display_panel_notes="MRP is printed clearly but omits '(incl. of all taxes)' declaration.",
                detected_languages=["English"],
                raw_ocr_text="Lay's Magic Masala Potato Chips. Net Wt: 50g. MRP Rs. 20.00. USP: Rs 0.40/g. Pkd: 08/2024. FSSAI Lic No. 10014011000214."
            )
            
        elif sample_id == "sample3":
            return ExtractedLabelData(
                brand_name="Parle-G",
                generic_name="Glucose Biscuits",
                commodity_category="Food / Biscuits",
                manufacturer_name="Parle Products Pvt. Ltd.",
                manufacturer_address="North Level Crossing, Vile Parle East, Mumbai - 400057, Maharashtra",
                country_of_origin="India",
                net_quantity_raw="Net Weight: 130 g",
                net_quantity_value=130.0,
                net_quantity_unit="g",
                mrp_raw="MRP Rs. 10.00 (incl. of all taxes)",
                mrp_amount=10.0,
                mrp_has_inclusive_phrase=True,
                unit_sale_price_raw="Unit Sale Price: Rs. 0.15 / g",
                unit_sale_price_value=0.15,
                unit_sale_price_unit="g",
                mfg_date_raw="09/2024",
                exp_date_raw="6 Months from Pkg",
                batch_or_lot_no="PG-0941",
                consumer_care_name_desig="Consumer Care Cell",
                consumer_care_phone="1800-22-7777",
                consumer_care_email=None,
                consumer_care_address="Vile Parle East, Mumbai",
                fssai_lic_no="10012022000109",
                veg_nonveg_status="Veg",
                font_size_adequate=True,
                principal_display_panel_notes="Unit sale price shows significant mathematical discrepancy compared to Net Weight & MRP.",
                detected_languages=["English", "Hindi"],
                raw_ocr_text="Parle-G Original Gluco Biscuits. Net Qty: 130g. MRP Rs. 10.00 (incl. of all taxes). Unit Sale Price Rs 0.15/g. Pkd: 09/2024. Tel: 1800-22-7777."
            )
            
        else: # sample4
            return ExtractedLabelData(
                brand_name="Maggi",
                generic_name="2-Minute Instant Noodles - Masala",
                commodity_category="Food / Instant Foods",
                manufacturer_name="Nestlé India Limited",
                manufacturer_address="",
                country_of_origin="India",
                net_quantity_raw="Net Weight: 70 g",
                net_quantity_value=70.0,
                net_quantity_unit="g",
                mrp_raw="MRP Rs. 14.00 (incl. of all taxes)",
                mrp_amount=14.0,
                mrp_has_inclusive_phrase=True,
                unit_sale_price_raw="Rs. 0.20 / g",
                unit_sale_price_value=0.20,
                unit_sale_price_unit="g",
                mfg_date_raw="09/2024",
                exp_date_raw="05/2025",
                batch_or_lot_no="LOT-9210-B",
                consumer_care_name_desig=None,
                consumer_care_phone=None,
                consumer_care_email=None,
                consumer_care_address=None,
                fssai_lic_no="10012011000168",
                veg_nonveg_status="Veg",
                font_size_adequate=True,
                principal_display_panel_notes="Missing manufacturer physical premises address and consumer grievance contact details.",
                detected_languages=["English"],
                raw_ocr_text="Maggi 2-Minute Noodles Masala. Net Weight 70g. MRP Rs 14.00 (incl. of all taxes). USP Rs 0.20/g. Manufactured by Nestlé India Ltd."
            )
