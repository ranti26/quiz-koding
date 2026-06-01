// Tempel isi file ini ke Google Apps Script sebagai Code.gs.
// Deploy: Deploy > New deployment > Web app > Execute as Me > Who has access Anyone.

const SHEET_NAME = "Nilai Quiz";
const ADMIN_KEY = "admin123";

function doPost(e) {
  const payload = JSON.parse(e.postData.contents || "{}");

  if (payload.action === "submit") {
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

  if ((payload.key || "") !== ADMIN_KEY) {
    return json({ ok: false, message: "Kode admin salah." });
  }

  if (payload.action === "delete") {
    deleteResultById(payload.id || "");
    return json({ ok: true });
  }

  if (payload.action === "reset") {
    resetSheet();
    return json({ ok: true });
  }

  return json({ ok: false, message: "Action tidak dikenal." });
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

function deleteResultById(id) {
  if (!id) return;
  const sheet = getSheet();
  const values = sheet.getDataRange().getValues();
  for (let i = values.length - 1; i >= 1; i--) {
    if (String(values[i][0]) === String(id)) {
      sheet.deleteRow(i + 1);
      return;
    }
  }
}

function resetSheet() {
  const sheet = getSheet();
  sheet.clearContents();
  sheet.appendRow(["ID", "Waktu", "Nama", "Kelas", "Skor", "Benar", "Salah/Kosong"]);
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
