let team = JSON.parse(localStorage.getItem("team")) || [];
let coins = JSON.parse(localStorage.getItem("coins")) || 100;

const subjects = [
  "Maths","English","Physics","Chemistry","Biology",
  "History","Geography","Computer Science",
  "French","Latin","RE","Drama"
];

const subjectTopics = {
  Maths:["Algebra","Geometry"],
  English:["Language","Literature"],
  Physics:["Energy","Forces"],
  Chemistry:["Bonding","Rates"],
  Biology:["Cells","Genetics"],
  History:["WW1","Cold War"],
  Geography:["Rivers","Climate"],
  "Computer Science":["Programming","Algorithms"],
  French:["Vocabulary","Grammar"],
  Latin:["Translation"],
  RE:["Ethics"],
  Drama:["Performance"]
};

const questions = {
  Algebra:[
    {q:"Solve 2x+3=7", options:["1","2","3"], answer:1}
  ],
  Geometry:[
    {q:"Triangle angles sum?", options:["90","180","360"], answer:1}
  ],
  Energy:[
    {q:"Unit of energy?", options:["Joule","Volt","Amp"], answer:0}
  ]
};

/* NAV */
function showSection(id){
  document.querySelectorAll(".section").forEach(s=>s.style.display="none");
  document.getElementById(id).style.display="block";
  updateCoins();
  if(id==="subjects") loadSubjects();
  if(id==="team") loadTeam();
}

/* SUBJECTS */
function loadSubjects(){
  let c = document.getElementById("subjects-container");
  c.innerHTML="";

  subjects.forEach(sub=>{
    let p = team.find(x=>x.name===sub);

    let div = document.createElement("div");
    div.className="card";
    div.innerHTML=`
      <div class="card-subject">${sub}</div>
      <div class="card-rating">${p?p.rating:0}</div>
      <button onclick="openSubject('${sub}')">Play</button>
    `;
    c.appendChild(div);
  });
}

/* TOPICS */
function openSubject(sub){
  showSection("topics");
  document.getElementById("topic-title").innerText=sub;

  let c = document.getElementById("topics-container");
  c.innerHTML="";

  subjectTopics[sub].forEach(t=>{
    let div=document.createElement("div");
    div.className="card";
    div.innerHTML=`
      <div>${t}</div>
      <button onclick="startQuiz('${sub}','${t}')">Start</button>
    `;
    c.appendChild(div);
  });
}

/* QUIZ UI */
function startQuiz(sub, topic){
  if(!questions[topic]){
    alert("No questions yet!");
    return;
  }

  showSection("quiz");

  let q = questions[topic][0];
  document.getElementById("question").innerText = q.q;

  let ansDiv = document.getElementById("answers");
  ansDiv.innerHTML="";

  q.options.forEach((opt,i)=>{
    let btn = document.createElement("button");
    btn.innerText = opt;

    btn.onclick = ()=>{
      if(i === q.answer){
        coins+=10;
        improve(sub,topic);
        alert("Correct!");
      } else {
        alert("Wrong!");
      }
      showSection("subjects");
    };

    ansDiv.appendChild(btn);
  });
}

/* IMPROVE */
function improve(sub,topic){
  let p = team.find(x=>x.name===sub);
  if(!p){
    p={name:sub,rating:0,topics:{}};
    team.push(p);
  }

  p.topics[topic]=(p.topics[topic]||0)+10;

  let total=0,count=0;
  for(let t in p.topics){
    total+=p.topics[t]; count++;
  }

  p.rating=Math.min(Math.floor(total/count),99);

  save();
}

/* PACKS */
function openPack(type){
  let cost = type==="basic"?50:100;
  if(coins<cost){ alert("Not enough coins"); return;}

  coins-=cost;

  let boost = Math.floor(Math.random()*20)+5;
  let sub = subjects[Math.floor(Math.random()*subjects.length)];

  let p = team.find(x=>x.name===sub);
  if(p){
    p.rating=Math.min(p.rating+boost,99);
  }

  document.getElementById("pack-result").innerText=
    `You boosted ${sub} by +${boost}`;

  save();
}

/* TEAM */
function loadTeam(){
  let c=document.getElementById("team-container");
  c.innerHTML="";

  team.forEach(p=>{
    let div=document.createElement("div");
    div.className="card";
    div.innerHTML=`
      <div>${p.name}</div>
      <div>${p.rating}</div>
    `;
    c.appendChild(div);
  });
}

function updateCoins(){
  document.getElementById("coins").innerText=coins;
}

function save(){
  localStorage.setItem("team",JSON.stringify(team));
  localStorage.setItem("coins",JSON.stringify(coins));
}

function resetGame(){
  localStorage.clear();
  location.reload();
}

showSection("subjects");
