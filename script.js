const circleNames = ["brandedPayment", "totalTech", "npsCommit"];
const circles = {};
const controllers = document.querySelectorAll(".controller");


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
  
  if(circleName === "brandedPayment") { limit = 8; value = 0; };
  if(circleName === "totalTech") { limit = 8; value = 0; };
  if(circleName === "npsCommit") { limit = 12; value = 0; };
  
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
    // const newValue = Math.abs(parseInt(iRV.textContent));
    iRV.textContent = newValue;
    controller.value = newValue;
    controller.dispatchEvent(new Event('change'));
  })
  
  iRD.addEventListener("click", e => {
    const newValue = Math.abs(parseInt(iRV.textContent) - incrementer);
    // const newValue = Math.abs(parseInt(iRV.textContent));
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