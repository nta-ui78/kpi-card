const params=new URLSearchParams(window.location.search);

const title=params.get("title") || "Revenue";

const subtitle=params.get("subtitle") || "This Month";

const value=params.get("value") || "€0";

const trend=params.get("trend") || "+0%";

const icon=params.get("icon") || "💰";

const color=params.get("color") || "positive";

document.getElementById("title").textContent=title;

document.getElementById("subtitle").textContent=subtitle;

document.getElementById("value").textContent=value;

document.getElementById("trend").textContent=trend;

document.getElementById("icon").textContent=icon;

document.getElementById("trend").className="trend "+color;