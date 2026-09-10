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

// Column layout — keep this in sync with the payload built by
// pushToSheets(...) in CrmForm.tsx's handleSubmit. Row values are built
// explicitly in doPost() below, not derived from this list — this is just
// the human-readable header.
const HEADER_ROW = [
  "Date",
  "Ref ID",
  "Customer Name",
  "Company",
  "Mobile",
  "Email",
  "Project Name",
  "Location",
  "Map Link",
  "Building Type",
  "Building Status",
  "Floors",
  "Stops",
  "Enquiry Type",
  "Notes",
  "Status",
  "Received At",
];

// "Mobile" is column E (1-based). Sheets auto-parses any cell starting with
// "+" as a formula (mobile numbers are stored as "+91 98765..."), which
// yields #ERROR! instead of the number — force that column to plain text.
const MOBILE_COLUMN_INDEX = 5;

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const sheet = getSheet_();
    ensureHeader_(sheet);

    const lat = payload.latitude;
    const lng = payload.longitude;
    const mapLink = lat && lng ? `=HYPERLINK("https://www.google.com/maps?q=${lat},${lng}","Open in Maps")` : "";

    const row = [
      payload.date || "",
      payload.refId || "",
      payload.customerName || "",
      payload.company || "",
      payload.mobile || "",
      payload.email || "",
      payload.projectName || "",
      payload.location || "",
      mapLink,
      payload.buildingType || "",
      payload.buildingStatus || "",
      payload.floors || "",
      payload.stops || "",
      payload.enquiryType || "",
      payload.notes || "",
      payload.status || "",
      new Date(),
    ];

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
