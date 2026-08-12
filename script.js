const params = new URLSearchParams(window.location.search);

const title = params.get("title") || "Revenue";
const subtitle = params.get("subtitle") || "This Month";
const category = params.get("category") || "finance";
const emoji = params.get("emoji") || "💰";
const color = params.get("color") || "positive";

document.getElementById("title").textContent = title;
document.getElementById("subtitle").textContent = subtitle;

const iconBox = document.getElementById("iconBox");
iconBox.classList.add(category);
iconBox.textContent = emoji;

const trendElement = document.getElementById("trend");
trendElement.className = "trend " + color;

const valueElement = document.getElementById("value");

function animateValue(end) {
  const duration = 900;
  const startTime = performance.now();

  function frame(now) {
    const progress = Math.min(
      (now - startTime) / duration,
      1
    );

    const current = Math.floor(progress * end);

    valueElement.textContent =
      "€" + current.toLocaleString("en-US");

    if (progress < 1) {
      requestAnimationFrame(frame);
    }
  }

  requestAnimationFrame(frame);
}

async function loadKPI() {
  try {
    valueElement.textContent = "€0";
    trendElement.textContent = "↑ 0%";

    const response = await fetch("/api/notion");

    if (!response.ok) {
      throw new Error("Failed to load Notion data");
    }

    const data = await response.json();
    const transactions = data.results || [];

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let total = 0;

    transactions.forEach((transaction) => {
      const properties = transaction.properties || {};

      const direction =
        properties["Direction"]?.formula?.string;

      const amount =
        properties["Amount"]?.number;

      const date =
        properties["Date"]?.date?.start;

      if (
        typeof amount !== "number" ||
        !date
      ) {
        return;
      }

      const transactionDate = new Date(date);

      if (
        transactionDate.getMonth() !== currentMonth ||
        transactionDate.getFullYear() !== currentYear
      ) {
        return;
      }

      // REVENUE
      if (
        title.toLowerCase() === "revenue" &&
        direction === "Income"
      ) {
        total += amount;
      }

      // EXPENSES
      if (
        title.toLowerCase() === "expenses" &&
        direction === "Expense"
      ) {
        total += amount;
      }
    });

    animateValue(total);

  } catch (error) {
    console.error("KPI error:", error);

    valueElement.textContent = "€0";
    trendElement.textContent = "—";
  }
}

loadKPI();
