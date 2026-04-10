let team = JSON.parse(localStorage.getItem("team")) || [];

const subjects = [
  "Maths","English","Physics","Chemistry","Biology",
  "History","Geography","Computer Science",
  "French","RE","Drama"
];

const subjectTopics = {
  Maths:["Algebra","Geometry","Probability","Trigonometry"],
  English:["Poetry","Language","Literature"],
  Physics:["Energy","Forces","Electricity"],
  Chemistry:["Bonding","Rates","Organic"],
  Biology:["Cells","Genetics","Ecology"],
  History:["WW1","Cold War","Medicine"],
  Geography:["Rivers","Climate","Urban"],
  "Computer Science":["Algorithms","Programming","Data"],
  French:["Vocabulary","Grammar","Speaking"],
  RE:["Ethics","Philosophy","Religion"],
  Drama:["Performance","Script","Evaluation"]
};

/* NAVIGATION */
function showSection(section){
  document.querySelectorAll(".section").forEach(s=>s.style.display="none");
  document.getElementById(section).style.display="block";

  if(section==="subjects") loadSubjects();
  if(section==="team") loadTeam();
}

/* LOAD SUBJECTS (FOLDERS) */
function loadSubjects(){
  const container = document.getElementById("subjects-container");
  container.innerHTML="";

  subjects.forEach(sub=>{
    let player = team.find(p=>p.name===sub);

    let topicsHTML="";
    subjectTopics[sub].forEach(t=>{
      let rating = player ? player.topics[t] || 0 : 0;
      topicsHTML += `<div class="card-stat">${t}: ${rating}</div>`;
    });

    const div = document.createElement("div");
    div.className="card";
    div.innerHTML = `
      <div class="card-subject">${sub}</div>
      <div class="card-rating">${player ? player.rating : 0}</div>
      <div class="card-stats">${topicsHTML}</div>
      <button onclick="openSubject('${sub}')">Train</button>
    `;

    container.appendChild(div);
  });
}

/* OPEN SUBJECT */
function openSubject(sub){
  showSection("topics");
  document.getElementById("topic-subject-name").innerText = sub;

  const container = document.getElementById("topics-container");
  container.innerHTML="";

  subjectTopics[sub].forEach(t=>{
    let player = team.find(p=>p.name===sub);
    let rating = player ? player.topics[t] || 0 : 0;

    const div = document.createElement("div");
    div.className="card";

    div.innerHTML = `
      <div class="card-subject">${t}</div>
      <div class="card-rating">${rating}</div>
      <button onclick="train('${sub}','${t}')">Answer Question</button>
    `;

    container.appendChild(div);
  });
}

/* TRAIN SYSTEM */
function train(sub, topic){
  let answer = prompt(`Answer a ${topic} question:`);

  if(answer){ // simulate correct
    let player = team.find(p=>p.name===sub);

    if(!player){
      player = {name:sub, rating:0, topics:{}};
      team.push(player);
    }

    player.topics[topic] = (player.topics[topic] || 0) + 5;

    // calculate overall rating
    let total = 0;
    let count = 0;
    for(let t in player.topics){
      total += player.topics[t];
      count++;
    }

    player.rating = Math.min(Math.floor(total/count),99);

    saveGame();
    openSubject(sub);
  }
}

/* TEAM VIEW */
function loadTeam(){
  const container = document.getElementById("team-container");
  container.innerHTML="";

  team.forEach(p=>{
    const div = document.createElement("div");
    div.className="card";

    div.innerHTML = `
      <div class="card-subject">${p.name}</div>
      <div class="card-rating">${p.rating}</div>
    `;

    container.appendChild(div);
  });
}

/* SAVE */
function saveGame(){
  localStorage.setItem("team", JSON.stringify(team));
}

/* RESET */
function resetGame(){
  if(confirm("Reset everything?")){
    localStorage.clear();
    team=[];
    location.reload();
  }
}

/* START */
showSection("subjects");
