// FULL SUBJECT LIST
const allSubjects = [
    "Mathematics","English","Physics","Chemistry","Biology",
    "History","Geography","French","Latin","Divinity",
    "Computer Science","Drama","Art","Music","Economics","RS"
];

// Example topics for each subject
const subjectTopics = {
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

// STARTER SCREEN
let selectedSubjects = [];
const selectionContainer = document.getElementById("subjects-selection");

allSubjects.forEach((sub,i)=>{
    const div = document.createElement("div");
    div.className = "subject-card";
    div.innerText = sub;
    div.onclick = ()=>{
        if(selectedSubjects.includes(sub)){
            selectedSubjects = selectedSubjects.filter(s=>s!==sub);
            div.classList.remove("selected");
        }else{
            if(selectedSubjects.length<11){
                selectedSubjects.push(sub);
                div.classList.add("selected");
            }else{
                alert("You can only pick 11 subjects!");
            }
        }
    };
    selectionContainer.appendChild(div);
});

document.getElementById("start-game-btn").onclick = ()=>{
    if(selectedSubjects.length!==11){ alert("Pick exactly 11 subjects to start!"); return; }
    showSection("menu");
};

// NAVIGATION
function showSection(section){
    ["starter-screen","menu","subjects","topics","packs","team"].forEach(s=>{
        document.getElementById(s).classList.add("hidden");
    });
    document.getElementById(section).classList.remove("hidden");
    if(section==="subjects") loadSubjects();
    if(section==="team") loadTeam();
}

// LOAD SUBJECTS
function loadSubjects(){
    const container = document.getElementById("subjects-container");
    container.innerHTML="";
    selectedSubjects.forEach(sub=>{
        const div = document.createElement("div");
        div.className="card";
        div.innerHTML=`<h3>${sub}</h3><button onclick="selectSubject('${sub}')">View Topics</button>`;
        container.appendChild(div);
    });
}

// LOAD TOPICS
function selectSubject(sub){
    showSection("topics");
    document.getElementById("topic-subject-name").innerText=sub;
    const container=document.getElementById("topics-container");
    container.innerHTML="";
    subjectTopics[sub].forEach(topic=>{
        const div=document.createElement("div");
        div.className="card";
        div.innerHTML=`<h4>${topic}</h4><button onclick="alert('Training on ${topic} placeholder')">Train</button>`;
        container.appendChild(div);
    });
}

// TEAM
let team = selectedSubjects.map(s=>({name:s, rating:70}));
function loadTeam(){
    const container = document.getElementById("team-container");
    container.innerHTML="";
    team.forEach(p=>{
        const div = document.createElement("div");
        div.className="card";
        div.innerHTML=`<h3>${p.name}</h3><p>Rating: ${p.rating}</p>`;
        container.appendChild(div);
    });
}

// DAILY LOGIN
const lastClaim = localStorage.getItem("dailyLogin");
const today = new Date().toDateString();
if(lastClaim!==today){
    document.getElementById("daily-login-popup").classList.remove("hidden");
    localStorage.setItem("dailyLogin", today);
}
function closeDailyLogin(){
    document.getElementById("daily-login-popup").classList.add("hidden");
}
