const params = new URLSearchParams(window.location.search);

const title =
params.get("title") || "Revenue";

const value =
params.get("value") || "0";

const trend =
params.get("trend") || "↑ 0%";

const subtitle =
params.get("subtitle") || "This Month";
const category =
params.get("category") || "finance";

const emoji =
params.get("emoji") || "💰";

const color =
params.get("color") || "positive";

document.getElementById("title").textContent = title;
document.getElementById("subtitle").textContent = subtitle;
const iconBox =
document.getElementById("iconBox");

iconBox.classList.add(category);

iconBox.textContent = emoji;

const trendElement =
document.getElementById("trend");

trendElement.textContent = trend;
trendElement.className = "trend " + color;

const valueElement =
document.getElementById("value");

function animate(){

let start=0;

const end=parseInt(value.replace(/\D/g,'')) || 0;

const duration=900;

const startTime=performance.now();

function frame(now){

const progress=Math.min((now-startTime)/duration,1);

const current=Math.floor(progress*end);

if(value.includes("€")){

valueElement.textContent="€"+current.toLocaleString();

}else{

valueElement.textContent=current.toLocaleString();

}

if(progress<1){

requestAnimationFrame(frame);

}

}

requestAnimationFrame(frame);

}

animate();
