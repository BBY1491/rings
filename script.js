// Initialize Firebase
var config = {
  apiKey: "AIzaSyDuHhYBQXTSWXRMD_KCuqjHZz_l1KOZZgs",
  authDomain: "membershiptracker-67056.firebaseapp.com",
  databaseURL: "https://membershiptracker-67056-default-rtdb.firebaseio.com",
  projectId: "membershiptracker-67056",
  storageBucket: "membershiptracker-67056.appspot.com",
  messagingSenderId: "423240971973"
};

firebase.initializeApp(config);

const circleNames = ["brandedPayment", "totalTech", "npsCommit"];
const circles = {};
const controllers = document.querySelectorAll(".controller");

// var ref = firebase.database().ref();

// ref.on("value", function(snapshot) {
//   console.log(snapshot.val());
// }, function(error) {
//   console.log("Error: "+ error.code);
// });

var trackerData = firebase.database().ref("trackerData/");

trackerData.on("child_added", function(data, prevChildKey) {
  var newVar = data.val();
  console.log("brandedPaymentGoal: " + newVar.brandedPaymentGoal)
  console.log("totalTechGoal: " + newVar.totalTechGoal)
  console.log("npsCommitGoal: " + newVar.npsCommitGoal)
  console.log("brandedPaymentValue: " + newVar.brandedPaymentVal)
  console.log("totalTechValue: " + newVar.totalTechVal)
  console.log("npsCommitValue: " + newVar.npsCommitVal)
})

const brandedPaymentGoal = 9;
const totalTechGoal = 9;
const npsCommitGoal = 10;
const brandedPaymentVal = 1;
const totalTechVal = 2;
const npsCommitVal = 3;

function setProgress(circle) {
  const percent = circle.value / circle.limit * 100;
  
  if(percent <= 100) {
    const offset = circle.length - percent / 100 * circle.length;  
    circle.circle.style.strokeDashoffset = offset;
  } else {
    circle.circle.style.strokeDashoffset = 0;
  }
  
  circle.dot.style.transform = `rotate(${percent * 3.6}deg)`;
}

circleNames.forEach(circleName => {
  const circle = document.querySelector(`#${circleName} .progress-ring__circle`);
  const dot = document.querySelector(`#${circleName} .dot`);
  const length = circle.getTotalLength();
  let limit = 0;
  let value = 0;
  
  if(circleName === "brandedPayment") { limit = brandedPaymentGoal; value = brandedPaymentVal; };
  if(circleName === "totalTech") { limit = totalTechGoal; value = totalTechVal; };
  if(circleName === "npsCommit") { limit = npsCommitGoal; value = npsCommitVal; };
  
  circles[circleName] = {
    circle,
    dot,
    length,
    limit,
    value
  }
  
  circle.style.strokeDashoffset = length;
  circle.style.strokeDasharray = `${length} ${length}`;
  
  document.querySelector(`#${circleName}Value`).textContent = circles[circleName].value;
  
  setProgress(circles[circleName]);
})

controllers.forEach(controller => {
  
  const target = controller.dataset.target;
  const iRI = document.querySelector(`.number-input[data-target="${target}"] .increase`);
  const iRV = document.querySelector(`.number-input[data-target="${target}"] .value`);
  const iRD = document.querySelector(`.number-input[data-target="${target}"] .decrease`);
  const incrementer = target === "brandedPayment" ? 1 : 1;
  
  iRI.addEventListener("click", e => {
    const newValue = Math.abs(parseInt(iRV.textContent) + incrementer);
    iRV.textContent = newValue;
    controller.value = newValue;
    controller.dispatchEvent(new Event('change'));
  })
  
  iRD.addEventListener("click", e => {
    const newValue = Math.abs(parseInt(iRV.textContent) - incrementer);
    iRV.textContent = newValue;
    controller.value = newValue;
    controller.dispatchEvent(new Event('change'));
  })
  
  controller.addEventListener("change", e => {
    const value = e.target.value;
    const target = e.target.dataset.target;
    
    circles[target].value = value;
    setProgress(circles[target]);
    document.querySelector(`#${target}Value`).textContent = circles[target].value;
  })
  
})