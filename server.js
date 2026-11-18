const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

const allowedHosts = ["example.com"];

app.post("/proxy", async (req, res) => {
  try {
    const target = new URL(req.body.url);

    if (
      !["http:", "https:"].includes(target.protocol) ||
      !allowedHosts.includes(target.hostname) ||
      target.port ||
      target.username ||
      target.password
    ) {
      return res.status(403).json({
        error: "This website is not allowed."
      });
    }

    const response = await fetch(target, {
      redirect: "manual",
      signal: AbortSignal.timeout(8000)
    });

    if (!response.ok) {
      return res.status(502).json({
        error: "The destination returned an error."
      });
    }

    const contentType = response.headers.get("content-type") || "";

    if (!contentType.includes("text/plain")) {
      return res.status(415).json({
        error: "For this demo, only plain text is supported."
      });
    }

    const text = await response.text();

    if (text.length > 100000) {
      return res.status(413).json({
        error: "Response is too large."
      });
    }

    res.type("text/plain").send(text);

  } catch (error) {
    res.status(400).json({
      error: "Could not retrieve that page."
    });
  }
});

const HOST = "0.0.0.0";
const PORT = process.env.PORT || 3000;

app.listen(PORT, HOST, () => {
  console.log(`Server running on port ${PORT}`);
});