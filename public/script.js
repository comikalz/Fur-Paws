const form = document.getElementById("proxyForm");
const input = document.getElementById("urlInput");
const result = document.getElementById("result");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  result.textContent = "Loading...";

  try {
    const response = await fetch("/proxy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url: input.value
      })
    });

    const data = await response.text();

    if (!response.ok) {
      throw new Error(data);
    }

    result.textContent = data;

  } catch (error) {
    result.textContent = "Error: " + error.message;
  }
});