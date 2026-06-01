// Tempel isi file ini ke Google Apps Script sebagai Code.gs.
// Deploy: Deploy > New deployment > Web app > Execute as Me > Who has access Anyone.

const SHEET_NAME = "Nilai Quiz";
const ADMIN_KEY = "admin123";

function doPost(e) {
  const payload = JSON.parse(e.postData.contents || "{}");
  if (payload.action !== "submit") {
    return json({ ok: false, message: "Action tidak dikenal." });
  }

  const result = payload.result || {};
  const sheet = getSheet();
  sheet.appendRow([
    result.id || "",
    result.submittedAt || new Date().toISOString(),
    result.name || "",
    result.className || "",
    Number(result.score || 0),
    Number(result.correct || 0),
    Number(result.wrong || 0)
  ]);

  return json({ ok: true });
}

function doGet(e) {
  if ((e.parameter.key || "") !== ADMIN_KEY) {
    return json({ ok: false, message: "Kode admin salah." }, e.parameter.callback);
  }

  const sheet = getSheet();
  const values = sheet.getDataRange().getValues();
  const rows = values.slice(1).map((row) => ({
    id: row[0],
    submittedAt: row[1],
    name: row[2],
    className: row[3],
    score: row[4],
    correct: row[5],
    wrong: row[6]
  }));

  return json({ ok: true, results: rows }, e.parameter.callback);
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(["ID", "Waktu", "Nama", "Kelas", "Skor", "Benar", "Salah/Kosong"]);
  }
  return sheet;
}

function json(data, callback) {
  const output = callback
    ? `${callback}(${JSON.stringify(data)});`
    : JSON.stringify(data);
  const mimeType = callback
    ? ContentService.MimeType.JAVASCRIPT
    : ContentService.MimeType.JSON;

  return ContentService
    .createTextOutput(output)
    .setMimeType(mimeType);
}
