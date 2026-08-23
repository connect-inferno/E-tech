/**
 * E-Tech Elevators — CRM lead webhook.
 *
 * Receives lead JSON POSTed from src/components/CrmForm.tsx (pushToSheets)
 * and appends one row per lead to the "Leads" sheet tab.
 *
 * Setup: paste into a Google Sheet's Extensions > Apps Script editor,
 * then deploy as a Web App (see README steps). Do not rename the
 * function names doPost / getSheet_ / ensureHeader_ without also
 * updating the deployment.
 */

const SHEET_NAME = "Leads";

const COLUMNS = [
  "date",
  "refId",
  "customerName",
  "company",
  "mobile",
  "email",
  "projectName",
  "location",
  "buildingType",
  "buildingStatus",
  "floors",
  "stops",
  "enquiryType",
  "liftType",
  "status",
];

const HEADER_ROW = [
  "Date",
  "Ref ID",
  "Customer Name",
  "Company",
  "Mobile",
  "Email",
  "Project Name",
  "Location",
  "Building Type",
  "Building Status",
  "Floors",
  "Stops",
  "Enquiry Type",
  "Lift Type",
  "Status",
  "Received At",
];

// Sheets auto-parses any cell starting with "+" as a formula (mobile numbers
// are stored as "+91 98765..."), which yields #ERROR! instead of the number.
// Force that column to plain text so it's stored verbatim.
const MOBILE_COLUMN_INDEX = COLUMNS.indexOf("mobile") + 1;

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const sheet = getSheet_();
    ensureHeader_(sheet);

    const row = COLUMNS.map((key) => payload[key] || "");
    row.push(new Date());

    const newRowIndex = sheet.getLastRow() + 1;
    sheet.getRange(newRowIndex, MOBILE_COLUMN_INDEX).setNumberFormat("@");
    sheet.getRange(newRowIndex, 1, 1, row.length).setValues([row]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  return sheet;
}

function ensureHeader_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADER_ROW);
    sheet.setFrozenRows(1);
  }
}
