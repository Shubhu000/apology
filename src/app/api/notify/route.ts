import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { stepId, message, decision, stepText } = body as {
      stepId: number;
      message: string;
      decision: "accept" | "reject";
      stepText?: string;
    };

    const toEmail = process.env.NOTIFY_EMAIL;
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const fromEmail = process.env.SMTP_FROM || smtpUser;

    if (!toEmail || !smtpHost || !smtpUser || !smtpPass) {
      console.warn("Email not configured — logging response instead:", {
        stepId,
        decision,
        message,
      });
      return NextResponse.json({
        ok: true,
        emailed: false,
        note: "Email not configured. Set env vars in .env.local",
      });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(smtpPort || 587),
      secure: Number(smtpPort) === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });

    const emoji = decision === "accept" ? "💚" : "💔";
    const subject = `${emoji} She ${decision === "accept" ? "ACCEPTED" : "REJECTED"} — Step ${stepId}`;

    await transporter.sendMail({
      from: fromEmail,
      to: toEmail,
      subject,
      html: `
        <h2>Apology website update</h2>
        <p><strong>Step:</strong> ${stepId}</p>
        <p><strong>Her response:</strong> ${decision.toUpperCase()}</p>
        <p><strong>Your message:</strong></p>
        <blockquote>${stepText || message}</blockquote>
        <p><strong>Button label:</strong> ${message}</p>
        <p><em>Sent at ${new Date().toLocaleString()}</em></p>
      `,
    });

    return NextResponse.json({ ok: true, emailed: true });
  } catch (error) {
    console.error("Notify error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to send notification" },
      { status: 500 },
    );
  }
}
