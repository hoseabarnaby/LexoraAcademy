import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;
const MODEL = process.env.OPENROUTER_MODEL || 'openrouter/free';
const APP_NAME = process.env.OPENROUTER_APP_NAME || 'Lexora Academy';
const SITE_URL = process.env.OPENROUTER_SITE_URL || '';

app.use(express.json({ limit: '1mb' }));
app.use(express.static(__dirname));

function systemPrompt(mode) {
  if (mode === 'mandarin') {
    return 'Kamu adalah tutor HSK Mandarin untuk pelajar Indonesia. Jawab singkat, jelas, ramah, dan terstruktur dalam bahasa Indonesia. Fokus pada hanzi, pinyin, grammar, nada Mandarin 1-4, contoh benar, kesalahan utama, dan latihan berikutnya.';
  }
  if (mode === 'japanese') {
    return 'Kamu adalah tutor JLPT bahasa Jepang untuk pelajar Indonesia. Jawab singkat, jelas, ramah, dan terstruktur dalam bahasa Indonesia. Fokus pada kanji, kana, romaji, partikel, grammar JLPT, natural expression, kesalahan utama, dan latihan berikutnya.';
  }
  return 'Kamu adalah tutor IELTS English untuk pelajar Indonesia. Jawab singkat, jelas, ramah, dan terstruktur dalam bahasa Indonesia. Fokus pada grammar, vocabulary upgrade, coherence, pronunciation tips, kesalahan utama, dan contoh jawaban yang lebih baik.';
}

function extractText(data) {
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content.map(part => typeof part === 'string' ? part : (part?.text || part?.content || '')).filter(Boolean).join('\n');
  }
  return '';
}

function friendlyError(status, data) {
  const raw = String(data?.error?.message || data?.error || data?.message || '').toLowerCase();
  if (status === 401 || raw.includes('invalid api key') || raw.includes('authentication')) return 'OpenRouter API key salah atau sudah tidak aktif.';
  if (status === 402 || raw.includes('insufficient credit') || raw.includes('credits')) return 'Saldo model berbayar tidak cukup. Gunakan openrouter/free atau isi saldo.';
  if (status === 403) return 'OpenRouter menolak akses. Periksa key atau limit akun.';
  if (status === 404) return 'Model OpenRouter tidak tersedia.';
  if (status === 429 || raw.includes('rate limit')) return 'Model gratis sedang ramai atau terkena rate limit. Coba lagi nanti.';
  if (status >= 500) return 'Server model AI sedang bermasalah.';
  return data?.error?.message || 'AI Feedback gagal.';
}

function modelCandidates() {
  return [...new Set([MODEL, 'openrouter/free'].filter(Boolean))];
}

async function callOpenRouter(apiKey, model, prompt, mode) {
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'X-OpenRouter-Title': APP_NAME
  };
  if (/^https?:\/\//i.test(SITE_URL)) headers['HTTP-Referer'] = SITE_URL;

  const aiRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt(mode) },
        { role: 'user', content: prompt }
      ],
      temperature: 0.35,
      max_tokens: 1200
    })
  });

  const data = await aiRes.json().catch(() => ({}));
  if (!aiRes.ok) throw { status: aiRes.status, data };
  const output = extractText(data).trim();
  if (!output) throw { status: 502, data: { error: 'Model tidak mengirim jawaban.' } };
  return output;
}

app.post('/api/ai-check', async (req, res) => {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'AI feedback belum aktif. Isi OPENROUTER_API_KEY di environment server.' });

    const { mode, prompt } = req.body || {};
    if (!prompt || typeof prompt !== 'string') return res.status(400).json({ error: 'Prompt kosong.' });

    let lastError = null;
    for (const model of modelCandidates()) {
      try {
        const output = await callOpenRouter(apiKey, model, prompt, mode);
        return res.json({ output, model });
      } catch (error) {
        lastError = error;
      }
    }

    return res.status(lastError?.status || 500).json({ error: friendlyError(lastError?.status || 500, lastError?.data || {}) });
  } catch (_error) {
    return res.status(500).json({ error: 'Server error.' });
  }
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Lexora OpenRouter running on http://localhost:${PORT}`);
});
