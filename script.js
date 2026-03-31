// -------------------- DATA --------------------
let subjects = JSON.parse(localStorage.getItem("subjects")) || [
    { name: "Algebra", subject: "Maths", rating: 60, xp: 0, unlocked: true },
    { name: "Bonding", subject: "Chemistry", rating: 50, xp: 0, unlocked: false },
    { name: "Electricity", subject: "Physics", rating: 55, xp: 0, unlocked: false },
    { name: "Genetics", subject: "Biology", rating: 55, xp: 0, unlocked: false },
    { name: "Trigonometry", subject: "Maths", rating: 50, xp: 0, unlocked: false }
];

let squad = []; // selected cards for match
let season = JSON.parse(localStorage.getItem("season")) || { xp: 0, level: 1 };

let questions = [
    { q: "Solve for x: 3x^2 - 5x + 2 = 0", a: ["x=1 or x=2/3","x=2","x=0","x=-1"], correct: 0, subject:"Maths"},
    { q: "A car accelerates from rest at 2 m/s². Distance in 5s?", a: ["25m","5m","10m","50m"], correct:0, subject:"Physics"},
    { q: "Balance: C2H6 + O2 → CO2 + H2O", a: ["2,7,4","1,2,3","3,5,2","2,5,3"], correct:3, subject:"Chemistry"},
    { q: "Alveoli structure maximises gas exchange because?", a: ["Thin walls & large SA","Small SA","No capillaries","Thick walls"], correct:0, subject:"Biology"}
];

// -------------------- SAVE --------------------
function saveAll() {
    localStorage.setItem("subjects", JSON.stringify(subjects));
    localStorage.setItem("season", JSON.stringify(season));
}

// -------------------- UI --------------------
function showSection(name) {
    document.querySelectorAll(".section").forEach(s => s.style.display = "none");
    document.getElementById(name + "-section").style.display = "block";
}

// Load subjects
function loadSubjects() {
    let container = document.getElementById("subjects");
    container.innerHTML = "";
    subjects.forEach((c, i) => {
        if(c.unlocked){
            let div = document.createElement("div");
            div.className = "card";
            div.innerHTML = `<h3>${c.name}</h3>
                             <p>${c.subject}</p>
                             <p>Rating: ${c.rating}</p>
                             <p>XP: ${c.xp}</p>
                             <button onclick="train(${i})">Train with Quiz</button>`;
            container.appendChild(div);
        }
    });
}

// -------------------- TRAIN --------------------
function train(index){
    startQuiz(index);
}

// -------------------- QUIZ --------------------
let currentQ = 0;
let currentSubjectIndex = 0;
let playerScore = 0;

function startQuiz(subjectIndex){
    currentQ = 0;
    playerScore = 0;
    currentSubjectIndex = subjectIndex;
    showSection("rivals");
    loadQuestion();
}

function loadQuestion(){
    let q = questions.find(q => q.subject === subjects[currentSubjectIndex].subject);
    if(!q){
        endQuiz();
        return;
    }
    document.getElementById("question").innerText = q.q;
    for(let i=0;i<4;i++){
        document.getElementById("a"+i).innerText = q.a[i];
    }
}

function answer(i){
    let q = questions.find(q => q.subject === subjects[currentSubjectIndex].subject);

    if(i === q.correct){
        // Per-topic XP
        subjects[currentSubjectIndex].xp += 20;

        // Rating increase capped at 99
        if(subjects[currentSubjectIndex].xp >= 50){
            subjects[currentSubjectIndex].rating = Math.min(99, subjects[currentSubjectIndex].rating + 1);
            subjects[currentSubjectIndex].xp = 0;
        }

        // Global season XP
        season.xp += 10;
        if(season.xp >= 100){
            season.level += 1;
            season.xp = 0;
            document.getElementById("reward").innerText = "🎁 Level Up Reward!";
        }
    }

    saveAll();
    endQuiz();
}

function endQuiz(){
    showSection("subjects");
    loadSubjects();
    updateSeasonUI();
}

// -------------------- SEASON --------------------
function updateSeasonUI(){
    document.getElementById("level").innerText = season.level;
    document.getElementById("season-xp").innerText = season.xp;
    document.getElementById("progress").style.width = (season.xp/100*100)+"%";
}

// -------------------- PACKS --------------------
function openPack(cost){
    if(season.xp < cost){
        alert("Not enough XP!");
        return;
    }
    season.xp -= cost;

    let locked = subjects.filter(c => !c.unlocked);
    if(locked.length === 0){
        alert("All cards unlocked!");
        return;
    }

    let count = Math.min(locked.length, Math.floor(Math.random()*3)+1);
    let cardsToUnlock = [];
    for(let i=0;i<count;i++){
        let index = Math.floor(Math.random()*locked.length);
        let card = locked.splice(index,1)[0];
        card.unlocked = true;
        cardsToUnlock.push(card);
    }

    saveAll();
    loadSubjects();
    alert("You unlocked: " + cardsToUnlock.map(c=>c.name).join(", "));
}

// -------------------- RESET --------------------
function resetAll(){
    localStorage.clear();
    location.reload();
}

// INITIAL LOAD
loadSubjects();
updateSeasonUI();
showSection("team");
