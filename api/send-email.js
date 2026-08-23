export default async function handler(req, res) {

    // Allow GitHub Pages to call this API
    res.setHeader(
        "Access-Control-Allow-Origin",
        "*"
    );

    res.setHeader(
        "Access-Control-Allow-Methods",
        "POST, OPTIONS"
    );

    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );


    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return res.status(204).end();
    }


    if (req.method !== "POST") {

        return res.status(405).json({
            error: "Method not allowed"
        });

    }


    const {
        name,
        email,
        attendance,
        message
    } = req.body || {};


    // =========================
    // VALIDATION
    // =========================

    if (
        !name ||
        typeof name !== "string" ||
        !name.trim()
    ) {

        return res.status(400).json({
            error: "Thiếu họ và tên."
        });

    }


    if (
        !email ||
        typeof email !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            email.trim()
        )
    ) {

        return res.status(400).json({
            error: "Email không hợp lệ."
        });

    }


    if (
        !attendance ||
        !["yes", "no"].includes(attendance)
    ) {

        return res.status(400).json({
            error: "Thiếu xác nhận tham dự."
        });

    }


    const safeMessage =
        typeof message === "string"
            ? message.trim()
            : "";


    try {

        await sendEmail({
            name: name.trim(),
            email: email.trim(),
            attendance,
            message: safeMessage
        });


        return res.status(200).json({
            ok: true
        });


    } catch (error) {

        console.error(
            "send-email error:",
            error
        );


        return res.status(500).json({
            error: "Không thể gửi email."
        });

    }

}


async function sendEmail({
    name,
    email,
    attendance,
    message
}) {

    const API_KEY =
        process.env.RESEND_API_KEY;

    const OWNER_EMAIL =
        process.env.OWNER_EMAIL;

    const FROM_EMAIL =
        process.env.FROM_EMAIL;


    if (
        !API_KEY ||
        !OWNER_EMAIL ||
        !FROM_EMAIL
    ) {

        throw new Error(
            "Missing email environment variables."
        );

    }


    const attendanceText =
        attendance === "yes"
            ? "Sẽ tham dự 🎉"
            : "Không thể tham dự";


    const html = `

        <div style="
            font-family: Arial, sans-serif;
            max-width: 650px;
            margin: auto;
            color: #1B263B;
        ">

            <div style="
                background: #0D1B2A;
                padding: 24px;
                border-radius: 12px 12px 0 0;
                color: #F7F3E9;
            ">

                <h2 style="
                    margin: 0;
                    color: #E7C766;
                ">
                    🎓 RSVP — Lễ Tốt Nghiệp 2026
                </h2>

            </div>


            <div style="
                padding: 24px;
                border: 1px solid #ddd;
                border-top: 0;
                border-radius: 0 0 12px 12px;
            ">

                <p>
                    <strong>Họ và tên:</strong>
                    ${escapeHtml(name)}
                </p>


                <p>
                    <strong>Email:</strong>
                    ${escapeHtml(email)}
                </p>


                <p>
                    <strong>Xác nhận tham dự:</strong>
                    ${attendanceText}
                </p>


                <p>
                    <strong>Lời chúc:</strong>
                </p>


                <div style="
                    padding: 16px;
                    background: #F7F3E9;
                    border-left: 4px solid #D4AF37;
                    white-space: pre-wrap;
                ">

                    ${
                        escapeHtml(message)
                        || "(Không có lời chúc)"
                    }

                </div>

            </div>

        </div>

    `;


    const response = await fetch(
        "https://api.resend.com/emails",
        {

            method: "POST",

            headers: {

                "Content-Type":
                    "application/json",

                Authorization:
                    `Bearer ${API_KEY}`

            },

            body: JSON.stringify({

                from: FROM_EMAIL,

                to: [OWNER_EMAIL],

                reply_to: email,

                subject:
                    `[RSVP] ${name} — ${attendanceText}`,

                html

            })

        }
    );


    if (!response.ok) {

        const errorText =
            await response.text();

        throw new Error(
            `Resend error:
            ${response.status}
            ${errorText}`
        );

    }

}


function escapeHtml(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}