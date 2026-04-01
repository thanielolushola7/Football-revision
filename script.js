// ---------- DATA ----------
let subjects = JSON.parse(localStorage.getItem("subjects")) || [
{
    name: "Maths",
    topics: [
        {name:"Algebra", rating:60, xp:0, unlocked:true, rarity:"gold"},
        {name:"Trigonometry", rating:50, xp:0, unlocked:false, rarity:"silver"},
        {name:"Geometry", rating:55, xp:0, unlocked:false, rarity:"bronze"}
    ]
},
{
    name: "Physics",
    topics: [
        {name:"Electricity", rating:50, xp:0, unlocked:false, rarity:"silver"},
        {name:"Forces", rating:52, xp:0, unlocked:false, rarity:"bronze"}
    ]
},
{
    name: "Chemistry",
    topics: [
        {name:"Bonding", rating:50, xp:0, unlocked:false, rarity:"silver"},
        {name:"Organic", rating:55, xp:0, unlocked:false, rarity:"gold"}
    ]
}
];

let xp = JSON.parse(localStorage.getItem("xp")) || 0;
let selectedSubject = null;

// ---------- QUESTIONS ----------
let questions = {
    "Algebra":[
        {q:"Solve: 2x+6=14",a:["4","6","3","5"],correct:0}
    ],
    "Trigonometry":[
        {q:"sin(30°)?",a:["0.5","1","0","-1"],correct:0}
    ],
    "Geometry":[
        {q:"Angles in triangle?",a:["180","360","90","270"],correct:0}
    ],
    "Electricity":[
        {q:"Formula for voltage?",a:["V=IR","F=ma","E=mc2","P=IV"],correct:0}
    ],
    "Forces":[
        {q:"Force formula?",a:["F=ma","V=IR","E=mc2","None"],correct:0}
    ],
    "Bonding":[
        {q:"Ionic bonding involves?",a:["Electron transfer","Sharing","None","Protons"],correct:0}
    ],
    "Organic":[
        {q:"Methane formula?",a:["CH4","C2H6","CO2","H2O"],correct:0}
    ]
};

// ---------- SAVE ----------
function save(){
    localStorage.setItem("subjects", JSON.stringify(subjects));
    localStorage.setItem("xp", xp);
}

// ---------- SUBJECT RATING ----------
function getSubjectRating(subject){
    let total = 0;
    subject.topics.forEach(t => total += t.rating);
    return Math.round(total / subject.topics.length);
}

// ---------- UI ----------
function showSection(name){
    document.querySelectorAll(".section").forEach(s => s.style.display="none");
    document.getElementById(name+"-section").style.display="block";
}

// ---------- LOAD SUBJECTS ----------
function loadSubjects(){
    let container = document.getElementById("subjects");
    container.innerHTML = "";

    subjects.forEach((s,i)=>{
        let div = document.createElement("div");
        div.className = "card gold";

        div.innerHTML = `
            <h3>${s.name}</h3>
            <p>Rating: ${getSubjectRating(s)}</p>
            <button onclick="selectSubject(${i})">Play</button>
        `;

        container.appendChild(div);
    });
}

// ---------- SELECT SUBJECT ----------
function selectSubject(i){
    selectedSubject = subjects[i];
    document.getElementById("game-subject").innerText = selectedSubject.name;
    showSection("game");
}

// ---------- GAME ----------
let currentTopic;
let currentQ;
let playerGoals = 0;
let aiGoals = 0;

function startMatch(){
    if(!selectedSubject){
        alert("Select a subject first!");
        return;
    }

    playerGoals = 0;
    aiGoals = 0;

    nextQuestion();
    updateScore();
}

function randomTopic(){
    let unlocked = selectedSubject.topics.filter(t=>t.unlocked);
    return unlocked[Math.floor(Math.random()*unlocked.length)];
}

function nextQuestion(){
    currentTopic = randomTopic();
    let qList = questions[currentTopic.name];
    currentQ = qList[Math.floor(Math.random()*qList.length)];

    document.getElementById("question").innerText = currentQ.q;

    for(let i=0;i<4;i++){
        document.getElementById("a"+i).innerText = currentQ.a[i];
    }
}

function answer(i){
    if(i === currentQ.correct){
        playerGoals++;

        // Improve topic
        currentTopic.xp += 20;
        if(currentTopic.xp >= 50){
            currentTopic.rating = Math.min(99, currentTopic.rating + 1);
            currentTopic.xp = 0;
        }
    } else {
        if(Math.random()<0.6) aiGoals++;
    }

    updateScore();

    if(playerGoals === 3 || aiGoals === 3){
        endMatch();
    } else {
        nextQuestion();
    }
}

function updateScore(){
    document.getElementById("score").innerText = playerGoals + " - " + aiGoals;
}

function endMatch(){
    if(playerGoals > aiGoals){
        alert("🏆 You Win! +30 XP");
        xp += 30;
    } else {
        alert("😔 Lost! +10 XP");
        xp += 10;
    }

    save();
    updateXP();
    showSection("subjects");
}

// ---------- PACK ----------
function openPack(){
    if(xp < 50){
        alert("Not enough XP!");
        return;
    }

    xp -= 50;
    updateXP();

    let locked = [];

    subjects.forEach(s=>{
        s.topics.forEach(t=>{
            if(!t.unlocked) locked.push(t);
        });
    });

    if(locked.length === 0){
        alert("All unlocked!");
        return;
    }

    let card = locked[Math.floor(Math.random()*locked.length)];
    card.unlocked = true;

    save();
    loadSubjects();

    document.getElementById("pack-animation").innerHTML =
        `<div class="card ${card.rarity}">
            <h3>${card.name}</h3>
        </div>`;
}

// ---------- INIT ----------
function updateXP(){
    document.getElementById("xp").innerText = xp;
}

loadSubjects();
updateXP();
showSection("subjects");
