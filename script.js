let team = JSON.parse(localStorage.getItem("team")) || [];
let coins = JSON.parse(localStorage.getItem("coins")) || 100;

/* SUBJECTS */
const subjects = ["Maths","English","Physics"];

const subjectTopics = {
  Maths:["Algebra","Geometry"],
  English:["Language","Literature"],
  Physics:["Energy","Forces"]
};

/* QUESTIONS */
const questions = {
  Algebra: [
    {
      q: "Solve: 2x + 3 = 7",
      options: ["x=1","x=2","x=3"],
      answer: 1
    }
  ],
  Geometry: [
    {
      q: "Angles in triangle sum?",
      options: ["90","180","360"],
      answer: 1
    }
  ],
  Energy: [
    {
      q: "Unit of energy?",
      options: ["Joule","Watt","Volt"],
      answer: 0
    }
  ]
};

/* NAV */
function showSection(section){
  document.querySelectorAll(".section").forEach(s=>s.style.display="none");
  document.getElementById(section).style.display="block";
  updateCoins();

  if(section==="subjects") loadSubjects();
  if(section==="team") loadTeam();
}

/* UPDATE COINS */
function updateCoins(){
  document.getElementById("coins").innerText = coins;
}

/* SUBJECT VIEW */
function loadSubjects(){
  const container = document.getElementById("subjects-container");
  container.innerHTML="";

  subjects.forEach(sub=>{
    let player = team.find(p=>p.name===sub);

    let div = document.createElement("div");
    div.className="card";

    div.innerHTML = `
      <div class="card-subject">${sub}</div>
      <div class="card-rating">${player ? player.rating : 0}</div>
      <button onclick="openSubject('${sub}')">Train</button>
    `;

    container.appendChild(div);
  });
}

/* TOPICS */
function openSubject(sub){
  showSection("topics");
  document.getElementById("topic-subject-name").innerText = sub;

  const container = document.getElementById("topics-container");
  container.innerHTML="";

  subjectTopics[sub].forEach(t=>{
    let div = document.createElement("div");
    div.className="card";

    div.innerHTML = `
      <div class="card-subject">${t}</div>
      <button onclick="startQuiz('${sub}','${t}')">Play</button>
    `;

    container.appendChild(div);
  });
}

/* QUIZ */
function startQuiz(sub, topic){
  const q = questions[topic][0];

  let answer = prompt(`${q.q}\n0:${q.options[0]}\n1:${q.options[1]}\n2:${q.options[2]}`);

  if(parseInt(answer) === q.answer){
    alert("✅ Correct!");
    reward(sub, topic);
  } else {
    alert("❌ Wrong!");
  }
}

/* REWARD */
function reward(sub, topic){
  coins += 10;

  let player = team.find(p=>p.name===sub);
  if(!player){
    player = {name:sub, rating:0, topics:{}};
    team.push(player);
  }

  player.topics[topic] = (player.topics[topic] || 0) + 10;

  let total=0, count=0;
  for(let t in player.topics){
    total += player.topics[t];
    count++;
  }

  player.rating = Math.min(Math.floor(total/count),99);

  saveGame();
}

/* PACK SYSTEM */
function openPack(type){
  let cost = type==="basic" ? 50 : 100;

  if(coins < cost){
    alert("Not enough coins!");
    return;
  }

  coins -= cost;

  const reward = Math.floor(Math.random()*20)+5;

  document.getElementById("pack-result").innerText =
    `🎉 You gained +${reward} rating boost!`;

  // apply to random subject
  let sub = subjects[Math.floor(Math.random()*subjects.length)];

  let player = team.find(p=>p.name===sub);
  if(player){
    player.rating = Math.min(player.rating + reward,99);
  }

  saveGame();
  updateCoins();
}

/* TEAM */
function loadTeam(){
  const container = document.getElementById("team-container");
  container.innerHTML="";

  team.forEach(p=>{
    let div = document.createElement("div");
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
  localStorage.setItem("coins", JSON.stringify(coins));
}

/* RESET */
function resetGame(){
  localStorage.clear();
  location.reload();
}

/* START */
showSection("subjects");
