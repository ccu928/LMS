async function ask() {
  const input = document.getElementById("question");
  const q = input.value.trim();
  const chatBox = document.getElementById("chatBox");
  const lang = navigator.language || "zh-TW";
  if (!q) return;

  // 🔥 清除歡迎詞
  chatBox.innerHTML = "";

  // 顯示客人提問
  
  chatBox.innerHTML += `<p><em id="thinking">⏳ 店員思考中...</em></p>`;
  chatBox.scrollTop = chatBox.scrollHeight;

 
  input.blur();

  try {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: q, lang })
    });

    const data = await res.json();
    document.getElementById("thinking").outerHTML =
      `<p><strong>店員：</strong>${data.answer || "⚠️ 店員暫時沒回應"}</p>`;

  } catch (err) {
    document.getElementById("thinking").outerHTML =
      `<p><strong>店員：</strong>⚠️ 系統錯誤，請稍後再試</p>`;
    console.error(err);
  }
}
document.getElementById("question").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();  // ✅ 避免預設換行（特別是某些瀏覽器）
    ask();
  }
});

