const params = new URLSearchParams(window.location.search);

const title = params.get("title") || "Revenue";
const subtitle = params.get("subtitle") || "This Month";
const rawValue = params.get("value") || "€0";
const trend = params.get("trend") || "+0%";
const icon = params.get("icon") || "💰";
const color = params.get("color") || "positive";

document.getElementById("title").textContent = title;
document.getElementById("subtitle").textContent = subtitle;
document.getElementById("trend").textContent = trend;
const iconElement = document.getElementById("icon");

iconElement.setAttribute("data-lucide", icon);

if(window.lucide){

    lucide.createIcons();

}
document.getElementById("trend").className = "trend " + color;

function animateValue(element, value) {

    const isCurrency = value.includes("€");
    const isPercent = value.includes("%");

    let endValue = Number(value.replace(/[^\d.-]/g, ""));

    if (isNaN(endValue)) {
        element.textContent = value;
        return;
    }

    const duration = 900;
    const start = performance.now();

    function frame(now) {

        const progress = Math.min((now - start) / duration, 1);

        const current = Math.floor(endValue * progress);

        if (isCurrency) {

            element.textContent = "€" + current.toLocaleString();

        } else if (isPercent) {

            element.textContent = current + "%";

        } else {

            element.textContent = current.toLocaleString();

        }

        if (progress < 1) {

            requestAnimationFrame(frame);

        }

    }

    requestAnimationFrame(frame);

}

animateValue(
    document.getElementById("value"),
    rawValue
);
