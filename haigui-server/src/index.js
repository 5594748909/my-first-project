const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')

// 使用绝对路径加载环境变量，避免从仓库根目录启动时读取错误
const envPath = path.resolve(__dirname, '../.env')
const envLocalPath = path.resolve(__dirname, '../.env.local')
dotenv.config({ path: envPath })
dotenv.config({ path: envLocalPath, override: true })

const app = express()
const PORT = Number(process.env.PORT) || 3000
const HOST = process.env.HOST || '0.0.0.0'

const DEEPSEEK_API_URL = process.env.DEEPSEEK_API_URL
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL ?? 'deepseek-chat'

console.log('[config] DEEPSEEK_API_URL loaded:', Boolean(DEEPSEEK_API_URL))
console.log('[config] DEEPSEEK_MODEL:', DEEPSEEK_MODEL)
console.log('[config] env loaded from:', envLocalPath)

// 允许前端访问（自动兼容开发环境端口：5173/5174/...）
const corsOrigin = (origin, callback) => {
  // Non-browser requests (no origin header)
  if (!origin) return callback(null, true)

  const allowed = process.env.CORS_ORIGIN
  if (!allowed) return callback(null, true)
  if (allowed.trim() === '*') return callback(null, true)

  const list = allowed
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  if (list.includes(origin)) return callback(null, true)

  // Dev fallback: allow localhost/127.0.0.1 on any port
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return callback(null, true)

  return callback(null, false)
}

app.use(
  cors({
    origin: corsOrigin,
    credentials: false,
  }),
)
app.use(express.json())

app.get('/api/test', (req, res) => {
  res.json({
    code: 200,
    msg: 'success',
    data: {
      ok: true,
      service: 'haigui-server',
    },
  })
})

function normalizeReply(raw) {
  const allowed = new Set(['是', '否', '无关'])
  const cleaned = String(raw ?? '').trim().replace(/[。！!,.，\s]/g, '')
  if (cleaned === '无关紧要') return '无关'
  if (allowed.has(cleaned)) return cleaned
  return null
}

function buildUserPrompt(question, story) {
  return [
    `题目ID: ${story?.id ?? ''}`,
    `汤面: ${story?.surface ?? ''}`,
    `汤底: ${story?.bottom ?? ''}`,
    `玩家问题: ${question}`,
    '请仅返回一个词：是 / 否 / 无关',
  ].join('\n')
}

async function callDeepSeek(question, story) {
  if (!DEEPSEEK_API_URL) throw new Error('Missing env: DEEPSEEK_API_URL')
  if (!DEEPSEEK_API_KEY) throw new Error('Missing env: DEEPSEEK_API_KEY')

  const SYSTEM_PROMPT = [
    '你是海龟汤游戏的AI判题助手。',
    '严格遵循规则：只能回答“是”“否”“无关”其中之一。',
    '禁止输出任何额外内容、解释、标点或提示语。',
    '不得泄露汤底信息。',
    '如果问题无法判定，统一回答“无关”。',
    '请仅输出一个词，不要输出任何其它文本。',
  ].join('\n')

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: DEEPSEEK_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        // few-shot示例，帮助模型稳定输出指定格式
        { role: 'user', content: '题目ID: story-demo\n汤面: 深夜敲门\n汤底: 无\n玩家问题: 死者是自杀吗？\n请仅返回一个词：是 / 否 / 无关' },
        { role: 'assistant', content: '否' },
        { role: 'user', content: '题目ID: story-demo\n汤面: 雨夜敲门\n汤底: 无\n玩家问题: 这件事和天气有关吗？\n请仅返回一个词：是 / 否 / 无关' },
        { role: 'assistant', content: '无关' },
        { role: 'user', content: '题目ID: story-demo\n汤面: 证人沉默\n汤底: 无\n玩家问题: 凶手认识死者吗？\n请仅返回一个词：是 / 否 / 无关' },
        { role: 'assistant', content: '是' },
        { role: 'user', content: buildUserPrompt(question, story) },
      ],
      temperature: 0,
    }),
  })

  if (!response.ok) {
    let deepseekMsg = ''
    try {
      const failPayload = await response.json()
      deepseekMsg = failPayload?.error?.message || failPayload?.msg || ''
    } catch {
      deepseekMsg = ''
    }
    throw new Error(
      `DeepSeek request failed: ${response.status}${deepseekMsg ? ` - ${deepseekMsg}` : ''}`,
    )
  }

  const payload = await response.json()
  const rawReply = payload?.data?.result ?? payload?.choices?.[0]?.message?.content
  const normalized = normalizeReply(rawReply)
  if (!normalized) {
    throw new Error('AI回答不符合规范，请重新提问')
  }
  return normalized
}

app.post('/api/chat', async (req, res) => {
  try {
    const { question, story } = req.body ?? {}

    if (!question || typeof question !== 'string') {
      return res.status(400).json({
        code: 400,
        msg: 'Invalid parameter: question',
        data: { error: true },
      })
    }

    if (!story || typeof story !== 'object') {
      return res.status(400).json({
        code: 400,
        msg: 'Invalid parameter: story',
        data: { error: true },
      })
    }

    const result = await callDeepSeek(question.trim(), story)

    return res.json({
      code: 200,
      msg: 'success',
      data: {
        result,
        error: false,
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[POST /api/chat] error:', message)

    const status = message.includes('不符合规范')
      ? 422
      : message.includes('Missing env')
        ? 500
        : message.includes('DeepSeek request failed: 401') || message.includes('DeepSeek request failed: 403')
          ? 502
          : message.includes('DeepSeek request failed')
            ? 502
            : 500
    return res.status(status).json({
      code: status,
      msg: message,
      data: {
        error: true,
      },
    })
  }
})

app.get('/', (req, res) => {
  res.type('text').send('haigui-server is running')
})

app.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`)
})

