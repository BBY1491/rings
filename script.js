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

let form = document.querySelector('form');

form.addEventListener('submit', handleSubmit);

function writeAllData( bpA, ttA, npsA) {
  firebase
    .database()
    .ref("/trackerData/0")
    .update({
      brandedPaymentVal: bpA,
      totalTechVal: ttA,
      npsCommitVal: npsA
    });
}

function writeAllGoals (bpG, ttG, npsG){
  firebase
    .database()
    .ref("/trackerData/0")
    .update({
      brandedPaymentGoal: bpG,
      totalTechGoal: ttG,
      npsCommitGoal: npsG
    });
}

function FetchAllData() {
  firebase
    .database()
    .ref("trackerData/")
    .on("child_added", function(snapshot) {
      var test =  snapshot.val();
      console.log(test);
        let bpG = test.brandedPaymentGoal;
        let bpA = test.brandedPaymentVal;
        let ttG = test.totalTechGoal;
        let ttA = test.totalTechVal;
        let npsG = test.npsCommitGoal;
        let npsA = test.npsCommitVal;
        ringTracking(bpG, bpA, ttG, ttA, npsG, npsA);
      })
}

function ringTracking(bpG, bpA, ttG, ttA, npsG, npsA) {
  const brandedPaymentGoal = bpG;
  const totalTechGoal = ttG;
  const npsCommitGoal = npsG;
  const brandedPaymentVal = bpA;
  const totalTechVal = ttA;
  const npsCommitVal = npsA;

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
      
      // if(circles[target].value != 0) {
        circles[target].value = value;
      // }
      
      setProgress(circles[target]);
      document.querySelector(`#${target}Value`).textContent = circles[target].value;    
    })

    const element = document.getElementById("submit");

    element.addEventListener("click", e => {
      
      var newbpA = document.getElementById("value1").innerHTML;
      var newttA = document.getElementById("value2").innerHTML;
      var newnpsA = document.getElementById("value3").innerHTML;
      console.log(newbpA);
      writeAllData(newbpA, newttA, newnpsA);
      location.reload(true);
    })
  })
}

function handleSubmit(event) {
  var form = document.querySelector("form");
  console.log( "====== Form Submission ======" );
  var bpG = form.elements.brandedPayment.value;
  var ttG = form.elements.totalTech.value;
  var npsG = form.elements.npsCommit.value;

  if(form.elements.brandedPayment.value == 0) {
    bpG = 1;
  }
  if(form.elements.totalTech.value == 0) {
    ttG = 1;
  }
  if(form.elements.npsCommit.value == 0) {
    npsG = 1;
  }
  

  writeAllGoals(bpG, ttG, npsG);
  // event.preventDefault();
}