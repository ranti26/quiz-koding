(function () {
  const STORAGE_KEY = "quiz_koding_results";
  const config = window.QUIZ_CONFIG || {};
  const body = document.getElementById("resultsBody");
  const empty = document.getElementById("emptyState");
  const statusText = document.getElementById("statusText");
  const searchInput = document.getElementById("searchInput");
  const adminKeyInput = document.getElementById("adminKeyInput");
  let results = [];

  adminKeyInput.value = config.adminKey || "";

  function readLocalResults() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch (error) {
      return [];
    }
  }

  function readRemoteResults() {
    if (!config.endpointUrl) return null;
    const key = encodeURIComponent(adminKeyInput.value.trim());
    const callbackName = `quizAdminCallback_${Date.now()}`;

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      const cleanup = () => {
        delete window[callbackName];
        script.remove();
      };

      window[callbackName] = (data) => {
        cleanup();
        if (!data.ok) {
          reject(new Error(data.message || "Kode admin salah atau data tidak tersedia."));
          return;
        }
        resolve(data.results || []);
      };

      script.onerror = () => {
        cleanup();
        reject(new Error("Gagal membaca data online."));
      };

      script.src = `${config.endpointUrl}?action=list&key=${key}&callback=${callbackName}`;
      document.body.appendChild(script);
    });
  }

  async function readJsonDbResults() {
    if (!config.dbJsonUrl) return null;
    const response = await fetch(`${config.dbJsonUrl}?v=${Date.now()}`);
    if (!response.ok) return null;
    const data = await response.json();
    if (Array.isArray(data)) return data;
    return data.results || [];
  }

  function normalize(item) {
    return {
      id: item.id || "",
      name: item.name || item.nama || "-",
      className: item.className || item.kelas || "-",
      score: Number(item.score || item.skor || 0),
      correct: Number(item.correct || item.benar || 0),
      wrong: Number(item.wrong || item.salah || 0),
      submittedAt: item.submittedAt || item.waktu || ""
    };
  }

  function render() {
    const keyword = searchInput.value.trim().toLowerCase();
    const filtered = results.map(normalize).filter((item) => {
      return `${item.name} ${item.className}`.toLowerCase().includes(keyword);
    }).sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
    });

    body.innerHTML = filtered.map((item, index) => `
      <tr>
        <td><strong>#${index + 1}</strong></td>
        <td>${escapeHtml(item.name)}</td>
        <td>${escapeHtml(item.className)}</td>
        <td><strong>${item.score}</strong></td>
        <td>${item.correct}</td>
        <td>${item.wrong}</td>
        <td>${formatDate(item.submittedAt)}</td>
        <td><button class="danger small delete-btn" data-id="${escapeHtml(item.id)}" data-name="${escapeHtml(item.name)}">Delete</button></td>
      </tr>
    `).join("");

    empty.style.display = filtered.length ? "none" : "block";
    updateStats(filtered);
  }

  function updateStats(data) {
    const total = data.length;
    const average = total ? Math.round(data.reduce((sum, item) => sum + item.score, 0) / total) : 0;
    const highest = total ? Math.max(...data.map((item) => item.score)) : 0;
    document.getElementById("totalStudents").textContent = total;
    document.getElementById("averageScore").textContent = average;
    document.getElementById("highestScore").textContent = highest;
  }

  function formatDate(value) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;"
    }[char]));
  }

  async function loadResults() {
    statusText.textContent = "Memuat data...";
    try {
      const remote = await readRemoteResults();
      if (remote) {
        results = remote;
        document.getElementById("remoteStatus").textContent = "Online";
        statusText.textContent = "Data online berhasil dimuat.";
      } else {
        const jsonDb = await readJsonDbResults();
        if (jsonDb && jsonDb.length) {
          results = jsonDb;
          document.getElementById("remoteStatus").textContent = "db.json";
          statusText.textContent = "Data dibaca dari db.json. Untuk menambah data, export JSON lalu upload ulang db.json.";
        } else {
          results = readLocalResults();
          document.getElementById("remoteStatus").textContent = "Lokal";
          statusText.textContent = "db.json masih kosong, menampilkan data lokal dari browser ini.";
        }
      }
    } catch (error) {
      results = readLocalResults();
      document.getElementById("remoteStatus").textContent = "Lokal";
      statusText.textContent = `${error.message} Menampilkan data lokal sebagai cadangan.`;
    }
    render();
  }

  async function sendAdminAction(action, payload = {}) {
    if (!config.endpointUrl) return false;
    await fetch(config.endpointUrl, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        action,
        key: adminKeyInput.value.trim(),
        ...payload
      })
    });
    return true;
  }

  async function deleteResult(id, name) {
    if (!confirm(`Hapus data nilai ${name || "siswa ini"}?`)) return;

    results = results.filter((item) => normalize(item).id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
    render();
    statusText.textContent = "Data dihapus dari tampilan. Mengirim perintah delete ke Google Sheets...";

    try {
      await sendAdminAction("delete", { id });
      statusText.textContent = "Perintah delete terkirim. Klik Muat Data untuk menyegarkan daftar.";
    } catch (error) {
      statusText.textContent = "Gagal mengirim perintah delete ke Google Sheets. Data lokal sudah dihapus.";
    }
  }

  async function resetResults() {
    if (!confirm("Reset semua data nilai? Tindakan ini akan menghapus seluruh rekap di dashboard dan Google Sheets.")) return;

    results = [];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
    render();
    statusText.textContent = "Data lokal direset. Mengirim perintah reset ke Google Sheets...";

    try {
      await sendAdminAction("reset");
      statusText.textContent = "Perintah reset terkirim. Klik Muat Data untuk memastikan data sudah kosong.";
    } catch (error) {
      statusText.textContent = "Gagal mengirim perintah reset ke Google Sheets. Data lokal sudah direset.";
    }
  }

  function exportCsv() {
    const rows = [["Nama", "Kelas", "Skor", "Benar", "Salah/Kosong", "Waktu"]];
    results.map(normalize).forEach((item) => rows.push([
      item.name, item.className, item.score, item.correct, item.wrong, formatDate(item.submittedAt)
    ]));
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, "\"\"")}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "nilai-quiz-koding.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function exportJson() {
    const payload = {
      updatedAt: new Date().toISOString(),
      results: results.map(normalize)
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "db.json";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function importJson(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        const incoming = Array.isArray(data)
          ? data
          : (data.results || (data.name || data.nama ? [data] : []));
        const existing = readLocalResults();
        const merged = [...existing, ...incoming].filter((item, index, array) => {
          const key = item.id || `${item.name || item.nama}-${item.className || item.kelas}-${item.submittedAt || item.waktu}-${item.score || item.skor}`;
          return array.findIndex((candidate) => {
            const candidateKey = candidate.id || `${candidate.name || candidate.nama}-${candidate.className || candidate.kelas}-${candidate.submittedAt || candidate.waktu}-${candidate.score || candidate.skor}`;
            return candidateKey === key;
          }) === index;
        });
        results = merged;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
        document.getElementById("remoteStatus").textContent = "Import";
        statusText.textContent = "JSON berhasil diimport, digabungkan, dan disimpan di browser ini.";
        render();
      } catch (error) {
        statusText.textContent = "File JSON tidak valid.";
      }
    };
    reader.readAsText(file);
  }

  document.getElementById("refreshBtn").addEventListener("click", loadResults);
  document.getElementById("exportBtn").addEventListener("click", exportCsv);
  document.getElementById("exportJsonBtn").addEventListener("click", exportJson);
  document.getElementById("importJsonBtn").addEventListener("click", () => document.getElementById("importJsonInput").click());
  document.getElementById("importJsonInput").addEventListener("change", (event) => importJson(event.target.files[0]));
  document.getElementById("resetBtn").addEventListener("click", resetResults);
  document.getElementById("toggleKeyBtn").addEventListener("click", () => {
    const isPassword = adminKeyInput.type === "password";
    adminKeyInput.type = isPassword ? "text" : "password";
    document.getElementById("toggleKeyBtn").textContent = isPassword ? "Sembunyi" : "Lihat";
  });
  body.addEventListener("click", (event) => {
    const button = event.target.closest(".delete-btn");
    if (!button) return;
    deleteResult(button.dataset.id, button.dataset.name);
  });
  searchInput.addEventListener("input", render);
  loadResults();
})();
