const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // 提供 HTML 靜態檔案

// 🧠 對話 API：永遠使用繁體中文回應
app.post("/api/ask", async (req, res) => {
  const question = req.body.question;
  const lang = req.body.lang || "zh-TW";

  const systemPrompt = `
你是一位知識豐富、親切且誠懇的男店員，擅長回答顧客關於食材選擇、料理技巧、口味搭配、火候控制等問題。
請用繁體中文，不要用簡體中文和英文，語氣自然、回答清楚、口吻友善、不要使用浮誇語氣，也不需加入角色扮演。請盡量實事求是地提供幫助。
`;

  try {
    const ollamaRes = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3:8b",                       // ✅ 小模型（快速）
        prompt: `${systemPrompt}\n\n使用者問：${question}`,
        stream: false,
        num_predict: 200                          // ✅ 限制回應長度，加速
      })
    });

    const data = await ollamaRes.json();
    res.json({ answer: data.response });

  } catch (err) {
    console.error("❗ Ollama 錯誤：", err);
    res.status(500).json({ answer: "⚠️ 無法連接本地模型。" });
  }
});

app.listen(3000, () => {
  console.log("✅ 本地伺服器已啟動：http://localhost:3000");
});
