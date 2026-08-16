# Google Sheets Lead Tracker — one-time setup

Follow these steps once. After that, every form submission auto-appends a row.

## 1. Create the sheet

1. Go to <https://sheets.google.com> and create a new spreadsheet.
2. Rename it: **E-Tech Leads 2026**
3. In row 1, paste these 16 headers across columns A–P:

```
Timestamp | Date | Ref ID | Status | Customer Name | Company | Mobile | Email | Project Name | Location | Building Type | Building Status | Floors | Stops | Enquiry Type | Lift Type
```

4. Select column D (Status) → Data → Data validation → Dropdown → add options:
   `New`, `Contacted`, `Quote Sent`, `Site Visit`, `Deal Closed`, `Lost`.
   Every new row will default to `New` and the team can change it inline.

## 2. Paste the Apps Script

1. In the sheet, open **Extensions → Apps Script**.
2. Delete the boilerplate `myFunction` and paste the code below.
3. Click **Save** (disk icon), give the project a name (`E-Tech Leads Webhook`).

```javascript
const SHEET_NAME = "Sheet1"; // change if your tab is named differently

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

    sheet.appendRow([
      new Date(),                    // A Timestamp
      data.date || "",               // B Date
      data.refId || "",              // C Ref ID
      data.status || "New",          // D Status
      data.customerName || "",       // E Customer Name
      data.company || "",            // F Company
      data.mobile || "",             // G Mobile
      data.email || "",              // H Email
      data.projectName || "",        // I Project Name
      data.location || "",           // J Location
      data.buildingType || "",       // K Building Type
      data.buildingStatus || "",     // L Building Status
      data.floors || "",             // M Floors
      data.stops || "",              // N Stops
      data.enquiryType || "",        // O Enquiry Type
      data.liftType || "",           // P Lift Type
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## 3. Deploy as a Web App

1. In Apps Script, click **Deploy → New deployment**.
2. Gear icon → **Web app**.
3. Description: `E-Tech Leads Webhook v1`
4. Execute as: **Me**
5. Who has access: **Anyone**
6. Click **Deploy**. Authorize with your Google account when prompted.
7. Copy the **Web app URL** — looks like:
   `https://script.google.com/macros/s/AKfycb.../exec`

## 4. Wire the URL into the site

1. Open `.env.local` at the project root.
2. Paste the URL after the `=` sign:

```
NEXT_PUBLIC_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/AKfycb.../exec
```

3. Restart the Next.js dev server (`npm run dev`) so the new env var loads.
4. Submit a test lead through the form. Within a second or two, a new row
   should appear at the bottom of the sheet.

## 5. Updating the script later

If you edit the Apps Script code, you **must redeploy**:
`Deploy → Manage deployments → pencil (edit) → Version: New version → Deploy`.
The existing URL stays the same, so no code change on the site is needed.

## Troubleshooting

- **No row appearing** — check `.env.local` has the correct URL and the dev
  server was restarted. Open the browser DevTools Network tab and submit;
  you should see a POST to `script.google.com` with status `0` (opaque
  response is normal under `no-cors`).
- **Only some fields fill** — the JS keys in `CrmForm.tsx` `pushToSheets`
  call must match the `data.xxx` keys in the Apps Script.
- **Wrong sheet tab** — update `SHEET_NAME` at the top of the script.
