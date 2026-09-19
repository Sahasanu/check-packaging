from typing import List, Optional, Any
from pydantic import BaseModel, Field, model_validator


class ExtractedLabelData(BaseModel):
    brand_name: Optional[str] = Field(default="Unknown Brand", description="Brand or trade name")
    generic_name: Optional[str] = Field(default="", description="Common or generic name of commodity (Rule 6(1)(b))")
    commodity_category: Optional[str] = Field(default="Food / FMCG", description="Category of commodity")
    
    # Manufacturer / Packer / Importer (Rule 6(1)(a))
    manufacturer_name: Optional[str] = Field(default="", description="Name of manufacturer")
    manufacturer_address: Optional[str] = Field(default="", description="Complete factory or registered address")
    packer_name: Optional[str] = Field(default=None, description="Name of packer if separate from manufacturer")
    packer_address: Optional[str] = Field(default=None, description="Address of packer")
    importer_name: Optional[str] = Field(default=None, description="Name of importer if imported")
    importer_address: Optional[str] = Field(default=None, description="Address of importer")
    country_of_origin: Optional[str] = Field(default="India", description="Country of manufacture or assembly")
    
    # Net Quantity (Rule 6(1)(c))
    net_quantity_raw: Optional[str] = Field(default="", description="Raw net quantity text as printed on package")
    net_quantity_value: Optional[float] = Field(default=None, description="Parsed numeric net quantity value")
    net_quantity_unit: Optional[str] = Field(default=None, description="Parsed net quantity unit (g, kg, ml, l, N, U)")
    
    # Maximum Retail Price (Rule 6(1)(e))
    mrp_raw: Optional[str] = Field(default="", description="Raw MRP text as printed on label")
    mrp_amount: Optional[float] = Field(default=None, description="Numeric MRP value in INR")
    mrp_has_inclusive_phrase: Optional[bool] = Field(default=False, description="True if 'incl. of all taxes' or 'inclusive of all taxes' is present")
    
    # Unit Sale Price (Rule 6(11))
    unit_sale_price_raw: Optional[str] = Field(default=None, description="Raw declared unit sale price e.g. Rs 0.40/g")
    unit_sale_price_value: Optional[float] = Field(default=None, description="Parsed unit sale price numeric value")
    unit_sale_price_unit: Optional[str] = Field(default=None, description="Unit for USP e.g. g, 100g, kg, ml, 100ml, l, N")
    
    # Dates (Rule 6(1)(d))
    mfg_date_raw: Optional[str] = Field(default=None, description="Month & Year of manufacture or packing")
    exp_date_raw: Optional[str] = Field(default=None, description="Best before or expiry date if printed")
    batch_or_lot_no: Optional[str] = Field(default=None, description="Batch / Lot / Code Number")
    
    # Consumer Care Details (Rule 6(1)(n))
    consumer_care_name_desig: Optional[str] = Field(default=None, description="Name or designation of contact person")
    consumer_care_phone: Optional[str] = Field(default=None, description="Consumer care phone or toll-free number")
    consumer_care_email: Optional[str] = Field(default=None, description="Consumer care email address")
    consumer_care_address: Optional[str] = Field(default=None, description="Consumer care postal address")
    
    # Allied & Regulatory
    fssai_lic_no: Optional[str] = Field(default=None, description="14-digit FSSAI license number if applicable")
    veg_nonveg_status: Optional[str] = Field(default=None, description="'Veg' (Green dot), 'Non-Veg' (Brown dot), or 'None'")
    
    # Display & Readability
    font_size_adequate: Optional[bool] = Field(default=True, description="Whether declarations meet minimum font height guidelines")
    principal_display_panel_notes: Optional[str] = Field(default="", description="Observations on display panel placement and contrast")
    detected_languages: Optional[List[str]] = Field(default_factory=lambda: ["English"], description="Languages detected on the label")
    raw_ocr_text: Optional[str] = Field(default="", description="Full extracted text from label")

    @model_validator(mode="before")
    @classmethod
    def sanitize_null_values(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if values.get("brand_name") is None:
                values["brand_name"] = "Unknown Brand"
            if values.get("generic_name") is None:
                values["generic_name"] = ""
            if values.get("commodity_category") is None:
                values["commodity_category"] = "Food / FMCG"
            if values.get("manufacturer_name") is None:
                values["manufacturer_name"] = ""
            if values.get("manufacturer_address") is None:
                values["manufacturer_address"] = ""
            if values.get("country_of_origin") is None:
                values["country_of_origin"] = "India"
            if values.get("net_quantity_raw") is None:
                values["net_quantity_raw"] = ""
            if values.get("mrp_raw") is None:
                values["mrp_raw"] = ""
            if values.get("mrp_has_inclusive_phrase") is None:
                values["mrp_has_inclusive_phrase"] = False
            if values.get("font_size_adequate") is None:
                values["font_size_adequate"] = True
            if values.get("principal_display_panel_notes") is None:
                values["principal_display_panel_notes"] = ""
            if values.get("detected_languages") is None:
                values["detected_languages"] = ["English"]
            if values.get("raw_ocr_text") is None:
                values["raw_ocr_text"] = ""
        return values


class RuleCheckResult(BaseModel):
    rule_id: str
    rule_name: str
    legal_reference: str
    status: str = Field(description="'PASS', 'FAIL', 'WARNING', or 'INFO'")
    severity: str = Field(description="'CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'")
    declared_value: str
    expected_standard: str
    description: str
    remediation_guidance: str


class USPMathCheck(BaseModel):
    declared_usp: Optional[str] = None
    calculated_usp: Optional[float] = None
    standard_unit: str = ""
    is_match: bool = True
    discrepancy_percentage: float = 0.0
    formula_used: str = ""
    commentary: str = ""


class ComplianceReport(BaseModel):
    scan_id: str
    timestamp: str
    image_filename: str
    image_url: Optional[str] = None
    product_name: str
    brand_name: str
    overall_status: str = Field(description="'COMPLIANT', 'NON_COMPLIANT', 'FLAGGED_FOR_REVIEW'")
    compliance_score: int = Field(description="Score between 0 and 100")
    summary: str
    total_checks: int
    passed_count: int
    failed_count: int
    warning_count: int
    rule_results: List[RuleCheckResult]
    usp_check: Optional[USPMathCheck] = None
    extracted_data: ExtractedLabelData
    pdf_report_path: Optional[str] = None


class ScanHistoryItem(BaseModel):
    scan_id: str
    timestamp: str
    product_name: str
    brand_name: str
    overall_status: str
    compliance_score: int
    failed_count: int
    image_url: Optional[str] = None
