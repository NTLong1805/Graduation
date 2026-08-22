// api/send-email.js
//
// Minimal Vercel Serverless Function.
// Receives the RSVP form payload and emails it to the site owner.
// No database — nothing is persisted, the message is just relayed by email.
//
// Setup:
// 1. Deploy this project to Vercel.
// 2. In the Vercel dashboard, add environment variables:
//      RESEND_API_KEY   – API key from https://resend.com (or swap for any email provider)
//      OWNER_EMAIL       – the email address that should receive RSVPs
//      FROM_EMAIL        – a verified "from" address for your email provider
// 3. That's it — POST requests to /api/send-email will now deliver email.
//
// You can swap the `sendEmail()` implementation below for any provider
// (SendGrid, Postmark, Nodemailer + SMTP, etc.) without touching the
// frontend — it only expects a 2xx/4xx/5xx JSON response.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, attendance, message } = req.body || {};

  // ---- Basic server-side validation (mirrors the frontend rules) ----
  if (!name || typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "Thiếu họ và tên." });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Email không hợp lệ." });
  }
  if (!attendance || !["yes", "no"].includes(attendance)) {
    return res.status(400).json({ error: "Thiếu xác nhận tham dự." });
  }

  const safeMessage = typeof message === "string" ? message.trim() : "";

  try {
    await sendEmail({ name: name.trim(), email: email.trim(), attendance, message: safeMessage });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("send-email error:", err);
    return res.status(500).json({ error: "Không thể gửi email." });
  }
}

async function sendEmail({ name, email, attendance, message }) {
  const OWNER_EMAIL = process.env.OWNER_EMAIL;
  const FROM_EMAIL = process.env.FROM_EMAIL || "invitation@resend.dev";
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!OWNER_EMAIL || !RESEND_API_KEY) {
    // No provider configured yet — fail loudly in dev instead of silently
    // pretending an email was sent.
    throw new Error("Missing RESEND_API_KEY or OWNER_EMAIL environment variables.");
  }

  const attendanceLabel = attendance === "yes" ? "Sẽ tham dự 🎉" : "Không thể tham dự";

  const html = `
    <div style="font-family: sans-serif; line-height:1.6; color:#1B263B;">
      <h2 style="color:#0D1B2A;">RSVP mới cho lễ tốt nghiệp</h2>
      <p><strong>Họ và tên:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Xác nhận tham dự:</strong> ${attendanceLabel}</p>
      <p><strong>Lời nhắn:</strong><br>${escapeHtml(message) || "(không có)"}</p>
    </div>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: OWNER_EMAIL,
      reply_to: email,
      subject: `[RSVP] ${name} — ${attendanceLabel}`,
      html
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Email provider error: ${response.status} ${text}`);
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
