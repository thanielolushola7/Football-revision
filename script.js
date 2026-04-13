let team = JSON.parse(localStorage.getItem("team")) || {};
let coins = JSON.parse(localStorage.getItem("coins")) || 100;

const subjects = Object.keys(gcseData);

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
    let rating = getSubjectRating(sub);

    let div=document.createElement("div");
    div.className="card "+getClass(rating);

    div.innerHTML=`
      <h3>${sub}</h3>
      <p>${rating}</p>
      <button onclick="openSubject('${sub}')">Open</button>
    `;
    c.appendChild(div);
  });
}

/* OPEN SUBJECT */
function openSubject(sub){
  showSection("topics");
  document.getElementById("subject-title").innerText=sub;

  let c=document.getElementById("topics-container");
  c.innerHTML="";

  for(let cat in gcseData[sub]){
    let topics=gcseData[sub][cat];

    let div=document.createElement("div");
    div.className="card";

    div.innerHTML=`
      <h4>${cat}</h4>
      ${topics.map(t=>`
        <button onclick="startQuiz('${sub}','${t}')">${t} (${getTopicRating(sub,t)})</button>
      `).join("")}
    `;

    c.appendChild(div);
  }
}

/* QUIZ */
function startQuiz(sub,topic){
  showSection("quiz");

  let q={
    q:`Quick question on ${topic}`,
    options:["A","B","C"],
    answer:0
  };

  document.getElementById("question").innerText=q.q;

  let ans=document.getElementById("answers");
  ans.innerHTML="";

  q.options.forEach((opt,i)=>{
    let btn=document.createElement("button");
    btn.innerText=opt;

    btn.onclick=()=>{
      if(i===q.answer){
        improve(sub,topic);
        coins+=10;
        alert("Correct!");
      } else alert("Wrong");

      showSection("subjects");
    };

    ans.appendChild(btn);
  });
}

/* IMPROVE */
function improve(sub,topic){
  if(!team[sub]) team[sub]={};

  team[sub][topic]=(team[sub][topic]||0)+10;

  save();
}

/* RATINGS */
function getTopicRating(sub,topic){
  return team[sub]?.[topic]||0;
}

function getSubjectRating(sub){
  let topics=team[sub];
  if(!topics) return 0;

  let total=0,count=0;
  for(let t in topics){
    total+=topics[t]; count++;
  }
  return Math.floor(total/count);
}

function getClass(r){
  if(r<40) return "low";
  if(r<70) return "medium";
  return "high";
}

/* TEAM */
function loadTeam(){
  let c=document.getElementById("team-container");
  c.innerHTML="";

  subjects.forEach(sub=>{
    let r=getSubjectRating(sub);

    let div=document.createElement("div");
    div.className="card";
    div.innerHTML=`${sub}: ${r}`;
    c.appendChild(div);
  });
}

/* SAVE */
function save(){
  localStorage.setItem("team",JSON.stringify(team));
  localStorage.setItem("coins",JSON.stringify(coins));
}

function updateCoins(){
  document.getElementById("coins").innerText=coins;
}

/* RESET */
function resetGame(){
  localStorage.clear();
  location.reload();
}

showSection("subjects");
