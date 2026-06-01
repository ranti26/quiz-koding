(function () {
  const STORAGE_KEY = "quiz_koding_results";

  function readLocalResults() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch (error) {
      return [];
    }
  }

  function saveLocalResult(result) {
    const data = readLocalResults();
    data.push(result);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  async function sendRemoteResult(result) {
    const config = window.QUIZ_CONFIG || {};
    if (!config.endpointUrl) return false;

    await fetch(config.endpointUrl, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "submit", result })
    });

    return true;
  }

  window.saveQuizResult = async function saveQuizResult(result) {
    const finalResult = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      submittedAt: new Date().toISOString(),
      ...result
    };

    saveLocalResult(finalResult);

    try {
      await sendRemoteResult(finalResult);
    } catch (error) {
      console.warn("Hasil tersimpan lokal, tetapi belum terkirim online.", error);
    }
  };
})();
