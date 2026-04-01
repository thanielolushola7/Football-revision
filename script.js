// Subjects & topics
const allSubjects=["Mathematics","English","Physics","Chemistry","Biology","History","Geography","French","Latin","Divinity","Computer Science","Drama","Art","Music","Economics","RS"];
const subjectTopics={
  "Mathematics":["Algebra","Trigonometry","Calculus","Statistics"],
  "English":["Reading","Writing","Literature"],
  "Physics":["Electricity","Forces","Energy","Waves"],
  "Chemistry":["Bonding","Organic","Reactions","Periodic Table"],
  "Biology":["Cells","Genetics","Ecology","Human Body"],
  "History":["Medieval","WW1","WW2","Modern"],
  "Geography":["Rivers","Coasts","Climate","Population"],
  "French":["Grammar","Vocabulary","Listening","Speaking"],
  "Latin":["Grammar","Translation","Culture"],
  "Divinity":["Christianity","Islam","Judaism"],
  "Computer Science":["Programming","Algorithms","Databases"],
  "Drama":["Performance","Theory"],
  "Art":["Painting","Sculpture"],
  "Music":["Theory","Performance"],
  "Economics":["Micro","Macro","Markets"],
  "RS":["Ethics","Philosophy"]
};

// Starter screen
let selectedSubjects=[];
const selectionContainer=document.getElementById("subjects-selection");

// Load previous progress if exists
let savedData=JSON.parse(localStorage.getItem("revisionTeam"));
if(savedData){
  selectedSubjects=savedData.selectedSubjects;
  team=savedData.team;
  showSection("menu");
}

// Populate subject cards
allSubjects.forEach(sub=>{
  const div=document.createElement("div");
  div.className="subject-card"; div.innerText=sub;
  if(selectedSubjects.includes(sub)) div.classList.add("selected");
  div.onclick=()=>{
    if(selectedSubjects.includes(sub)){
      selectedSubjects=selectedSubjects.filter(s=>s!==sub); div.classList.remove("selected");
    }else{
      if(selectedSubjects.length<11){ selectedSubjects.push(sub); div.classList.add("selected"); }
      else alert("You can only pick 11 subjects!");
    }
  };
  selectionContainer.appendChild(div);
});

// Start game button
document.getElementById("start-game-btn").onclick=()=>{
  if(selectedSubjects.length!==11){ alert("Pick exactly 11 subjects!"); return; }
  if(!team) team=selectedSubjects.map(s=>({name:s,rating:70}));
  saveProgress();
  showSection("menu");
};

// Navigation
function showSection(sec){
  ["starter-screen","menu","subjects","topics","packs","team"].forEach(s=>document.getElementById(s).classList.add("hidden"));
  document.getElementById(sec).classList.remove("hidden");
  if(sec==="subjects") loadSubjects();
  if(sec==="team") loadTeam();
}

// Load subjects
function loadSubjects(){
  const container=document.getElementById("subjects-container"); container.innerHTML="";
  selectedSubjects.forEach(sub=>{
    const div=document.createElement("div"); div.className="card";
    div.innerHTML=`<h3>${sub}</h3><button onclick="selectSubject('${sub}')">View Topics</button>`;
    container.appendChild(div);
  });
}

// Load topics
function selectSubject(sub){
  showSection("topics");
  document.getElementById("topic-subject-name").innerText=sub;
  const container=document.getElementById("topics-container"); container.innerHTML="";
  subjectTopics[sub].forEach(t=>{
    const div=document.createElement("div"); div.className="card";
    div.innerHTML=`<h4>${t}</h4><button onclick="train('${sub}','${t}')">Train</button>`;
    container.appendChild(div);
  });
}

// Training
function train(subject, topic){
  alert(`Training on ${topic}...`);
  const player=team.find(p=>p.name===subject);
  if(player){ player.rating=Math.min(player.rating+3,99); saveProgress(); loadTeam(); }
}

// Team
let team=team||[];
function loadTeam(){
  const container=document.getElementById("team-container"); container.innerHTML="";
  team.forEach(p=>{
    const div=document.createElement("div"); div.className="card";
    div.innerHTML=`<h3>${p.name}</h3><p>Rating: ${p.rating}</p>`;
    container.appendChild(div);
  });
}

// Packs
function openPack(){
  const subjectsLeft=allSubjects.filter(s=>!team.find(p=>p.name===s));
  let reward="No new player!";
  if(subjectsLeft.length>0){
    const newSub=subjectsLeft[Math.floor(Math.random()*subjectsLeft.length)];
    reward=`New Player: ${newSub}! +5 Rating`;
    team.push({name:newSub,rating:75});
  }
  const packResult=document.getElementById("pack-result");
  packResult.innerText=reward; packResult.classList.remove("hidden");
  saveProgress();
  loadTeam();
}

// Save progress
function saveProgress(){
  localStorage.setItem("revisionTeam", JSON.stringify({selectedSubjects, team}));
}

// Reset progress
function resetProgress(){
  if(confirm("Are you sure you want to reset your progress?")){
    localStorage.removeItem("revisionTeam");
    location.reload();
  }
}

// Daily Login
const lastClaim=localStorage.getItem("dailyLogin"); const today=new Date().toDateString();
if(lastClaim!==today){ document.getElementById("daily-login-popup").classList.remove("hidden"); localStorage.setItem("dailyLogin",today); }
function closeDailyLogin(){ document.getElementById("daily-login-popup").classList.add("hidden"); }
