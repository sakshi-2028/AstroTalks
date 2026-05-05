// File: server/routes/sessions.js

import express from 'express';
import Session from '../models/Session.js';
import User from '../models/User.js';
import SYSTEM_PROMPT from '../systemPrompt.js';
import { Agent } from 'undici';

const router = express.Router();

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-4o-mini';

// ------------------------
// CREATE SESSION
// ------------------------
router.post('/', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required.' });
    }

    const session = await Session.create({
      userId,
      messages: [],
    });

    res.status(201).json(session);
  } catch (err) {
    console.error("🔥 CREATE SESSION ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ------------------------
// GET USER SESSIONS
// ------------------------
router.get('/user/:userId', async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.params.userId }).sort({
      createdAt: -1,
    });

    const result = sessions.map((s) => {
      const firstUserMsg = s.messages.find((m) => m.role === 'user');

      return {
        _id: s._id,
        createdAt: s.createdAt,
        messageCount: s.messages.length,
        preview: firstUserMsg
          ? firstUserMsg.content.slice(0, 60)
          : 'New conversation',
      };
    });

    res.json(result);
  } catch (err) {
    console.error("🔥 GET USER SESSIONS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ------------------------
// GET SINGLE SESSION
// ------------------------
router.get('/:id', async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).populate('userId');

    if (!session) {
      return res.status(404).json({ error: 'Session not found.' });
    }

    res.json(session);
  } catch (err) {
    console.error("🔥 GET SESSION ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ------------------------
// SEND MESSAGE (MAIN AI LOGIC)
// ------------------------
router.post('/:id/message', async (req, res) => {
  try {
    const { content, userId } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Message content is required.' });
    }

    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ error: 'Session not found.' });
    }

    const user = await User.findById(userId || session.userId);

    const userContext = user
      ? `\n\nUSER PROFILE:
Name: ${user.name}
DOB: ${user.dob}
Sun Sign: ${user.sunSign}
Nakshatra: ${user.nakshatra}

IMPORTANT: Always personalize astrology answers.`
      : '';

    const apiMessages = [
      {
        role: 'system',
        content: SYSTEM_PROMPT + userContext,
      },
      ...session.messages.map(({ role, content }) => ({
        role,
        content,
      })),
      {
        role: 'user',
        content,
      },
    ];

    // ------------------------
    // FIX: IPv4 + timeout safe fetch
    // ------------------------
    const agent = new Agent({
      connect: {
        family: 4,
      },
    });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    const openAIRes = await fetch(OPENAI_API_URL, {
      method: 'POST',
      dispatcher: agent,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    clearTimeout(timeout);

    const raw = await openAIRes.text();

    if (!openAIRes.ok) {
      console.error("🔥 OPENAI ERROR:", raw);

      return res.status(502).json({
        error: 'OpenAI API failed',
        detail: raw,
      });
    }

    const data = JSON.parse(raw);

    const replyContent = data?.choices?.[0]?.message?.content;

    if (!replyContent) {
      return res.status(502).json({
        error: 'Empty AI response',
      });
    }

    // ------------------------
    // SAVE CHAT
    // ------------------------
    session.messages.push({ role: 'user', content });
    session.messages.push({ role: 'assistant', content: replyContent });

    await session.save();

    res.json({ reply: replyContent });

  } catch (err) {
    console.error("🔥 MESSAGE ROUTE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ------------------------
// DELETE SESSION
// ------------------------
router.delete('/:id', async (req, res) => {
  try {
    const session = await Session.findByIdAndDelete(req.params.id);

    if (!session) {
      return res.status(404).json({ error: 'Session not found.' });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("🔥 DELETE SESSION ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;