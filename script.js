const params=new URLSearchParams(window.location.search);

const title=params.get("title") || "Revenue";

const subtitle=params.get("subtitle") || "This Month";

const value=params.get("value") || "€0";

const trend=params.get("trend") || "+0%";

const icon=params.get("icon") || "💰";

const color=params.get("color") || "positive";

document.getElementById("title").textContent=title;

document.getElementById("subtitle").textContent=subtitle;

const rawValue = params.get("value") || "0";

function animateValue(target, endValue, prefix = "", suffix = "") {

    const duration = 900;
    const startTime = performance.now();

    function update(currentTime){

        const progress = Math.min((currentTime - startTime) / duration, 1);

        const current = Math.floor(progress * endValue);

        target.textContent =
            prefix +
            current.toLocaleString() +
            suffix;

        if(progress < 1){

            requestAnimationFrame(update);

        }else{

            target.textContent =
                prefix +
                endValue.toLocaleString() +
                suffix;

        }

    }

    requestAnimationFrame(update);

}

const valueElement = document.getElementById("value");

if(rawValue.includes("€")){

    animateValue(
        valueElement,
        Number(rawValue.replace(/[^\d]/g,"")),
        "€"
    );

}else{

    animateValue(
        valueElement,
        Number(rawValue)
    );

}

document.getElementById("trend").textContent=trend;

document.getElementById("icon").textContent=icon;

document.getElementById("trend").className="trend "+color;
