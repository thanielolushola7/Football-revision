// Subjects & Topics
const subjects = [
    {name: "Mathematics", topics:["Algebra","Trigonometry","Calculus","Statistics"]},
    {name: "Physics", topics:["Electricity","Forces","Energy","Waves"]},
    {name: "Chemistry", topics:["Bonding","Genetics","Organic","Reactions"]},
    {name: "Biology", topics:["Cells","Genetics","Ecology","Human Body"]},
];

// Example team
let team = [
    {name:"Algebra Ace", subject:"Mathematics", rating:85},
    {name:"Physics Pro", subject:"Physics", rating:82},
    {name:"Chemistry Champ", subject:"Chemistry", rating:78}
];

// Show / Hide Sections
function showSection(section) {
    ["menu","subjects","packs","team"].forEach(s => {
        document.getElementById(s).classList.add("hidden");
    });

    document.getElementById(section).classList.remove("hidden");

    if(section === "subjects") loadSubjects();
    if(section === "team") loadTeam();
}

// Load subjects dynamically
function loadSubjects(){
    const container = document.getElementById("subjects-container");
    container.innerHTML = "";

    subjects.forEach((s,i)=>{
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `
            <h3>${s.name}</h3>
            <p>${s.topics.length} topics</p>
            <button onclick="selectSubject(${i})">Play</button>
        `;
        container.appendChild(div);
    });
}

// Select subject placeholder
function selectSubject(index){
    alert(`You selected ${subjects[index].name}. Topics will be loaded next!`);
}

// Load team dynamically
function loadTeam(){
    const container = document.getElementById("team-container");
    container.innerHTML = "";
    team.forEach(player=>{
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `
            <h3>${player.name}</h3>
            <p>${player.subject}</p>
            <p>Rating: ${player.rating}</p>
        `;
        container.appendChild(div);
    });
}

// --- DAILY LOGIN ---
const lastClaim = localStorage.getItem("dailyLogin");
const today = new Date().toDateString();

if(lastClaim !== today){
    document.getElementById("daily-login-popup").classList.remove("hidden");
    localStorage.setItem("dailyLogin", today);
}

function closeDailyLogin(){
    document.getElementById("daily-login-popup").classList.add("hidden");
}
