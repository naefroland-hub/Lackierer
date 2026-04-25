// netlify/functions/gemini.js
// Proxy für die Google Gemini API.
// Der API-Key wird NICHT im Frontend gespeichert, sondern als
// Umgebungsvariable "GEMINI_API_KEY" in Netlify hinterlegt:
//   Netlify Dashboard → Site → Configuration → Environment Variables

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: {
          message:
            "GEMINI_API_KEY fehlt. Bitte unter Netlify → Site Configuration → Environment Variables setzen.",
        },
      }),
    };
  }

  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const body = JSON.parse(event.body);
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return {
      statusCode: response.ok ? 200 : response.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: { message: error.message } }),
    };
  }
};
