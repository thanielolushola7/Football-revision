// ---------- DATA ----------
let subjects = JSON.parse(localStorage.getItem("subjects")) || [
    {name:"Algebra",subject:"Maths",rating:60,xp:0,unlocked:true,rarity:"gold"},
    {name:"Trigonometry",subject:"Maths",rating:50,xp:0,unlocked:false,rarity:"silver"},
    {name:"Geometry",subject:"Maths",rating:55,xp:0,unlocked:false,rarity:"bronze"},

    {name:"Electricity",subject:"Physics",rating:50,xp:0,unlocked:false,rarity:"silver"},
    {name:"Forces",subject:"Physics",rating:52,xp:0,unlocked:false,rarity:"bronze"},

    {name:"Bonding",subject:"Chemistry",rating:50,xp:0,unlocked:false,rarity:"silver"},
    {name:"Organic",subject:"Chemistry",rating:55,xp:0,unlocked:false,rarity:"gold"},

    {name:"Cells",subject:"Biology",rating:50,xp:0,unlocked:false,rarity:"bronze"},
    {name:"Genetics",subject:"Biology",rating:55,xp:0,unlocked:false,rarity:"gold"}
];

let squad = JSON.parse(localStorage.getItem("squad")) || [];

let loginData = JSON.parse(localStorage.getItem("loginData")) || {
    lastLogin: null,
    streak: 0
};

let xp = JSON.parse(localStorage.getItem("xp")) || 0;

// ---------- SAVE ----------
function save(){
    localStorage.setItem("subjects", JSON.stringify(subjects));
    localStorage.setItem("squad", JSON.stringify(squad));
    localStorage.setItem("loginData", JSON.stringify(loginData));
    localStorage.setItem("xp", xp);
}

// ---------- DAILY ----------
function checkDaily(){
    let today = new Date().toDateString();

    if(loginData.lastLogin !== today){
        let yesterday = new Date();
        yesterday.setDate(yesterday.getDate()-1);

        if(loginData.lastLogin === yesterday.toDateString()){
            loginData.streak++;
        } else {
            loginData.streak = 1;
        }

        loginData.lastLogin = today;

        let reward = 20 + loginData.streak * 5;
        xp += reward;

        alert("🎁 Daily Reward +" + reward + " XP\n🔥 Streak: " + loginData.streak);

        save();
        updateXP(); // FIX
    }
}

// ---------- UI ----------
function showSection(name){
    document.querySelectorAll(".section").forEach(s => s.style.display="none");
    document.getElementById(name+"-section").style.display="block";
}

// ---------- LOAD CARDS ----------
function loadSubjects(){
    let container = document.getElementById("subjects");
    container.innerHTML = "";

    subjects.forEach((c,i)=>{
        if(c.unlocked){
            let div = document.createElement("div");
            div.className = "card " + c.rarity;

            div.innerHTML = `
                <div class="rating">${c.rating}</div>
                <h3>${c.name}</h3>
                <p>${c.subject}</p>
                <button onclick="addToSquad(${i})">Add</button>
            `;

            container.appendChild(div);
        }
    });
}

// ---------- SQUAD ----------
function addToSquad(index){
    if(squad.length >= 5){
        alert("Squad full!");
        return;
    }
    if(!squad.includes(index)){
        squad.push(index);
        alert("Added to squad!");
        save();
        loadSquad();
    }
}

function removeFromSquad(index){
    squad = squad.filter(i => i !== index);
    save();
    loadSquad();
}

function loadSquad(){
    let container = document.getElementById("squad");
    container.innerHTML = "";

    squad.forEach(i=>{
        let c = subjects[i];

        let div = document.createElement("div");
        div.className = "card " + c.rarity;

        div.innerHTML = `
            <div class="rating">${c.rating}</div>
            <h3>${c.name}</h3>
            <button onclick="removeFromSquad(${i})">Remove</button>
        `;

        container.appendChild(div);
    });
}

// ---------- PACK ----------
function openPack(){

    if(xp < 50){
        alert("Not enough XP!");
        return;
    }

    xp -= 50;
    updateXP(); // FIX

    let locked = subjects.filter(c => !c.unlocked);

    if(locked.length === 0){
        alert("All cards unlocked!");
        return;
    }

    let rand = Math.random();
    let rarity;

    if(rand < 0.6) rarity = "bronze";
    else if(rand < 0.9) rarity = "silver";
    else rarity = "gold";

    let possible = locked.filter(c => c.rarity === rarity);
    if(possible.length === 0) possible = locked;

    let card = possible[Math.floor(Math.random()*possible.length)];
    card.unlocked = true;

    save();
    loadSubjects();

    showPackAnimation(card);
}

// ---------- ANIMATION ----------
function showPackAnimation(card){
    let anim = document.getElementById("pack-animation");

    anim.innerHTML = `
        <div class="card reveal ${card.rarity}">
            <div class="rating">${card.rating}</div>
            <h3>${card.name}</h3>
            <p>${card.subject}</p>
        </div>
    `;

    if(card.rarity === "gold"){
        anim.innerHTML += "<h2>🌟 WALKOUT! 🌟</h2>";
    }
}

// ---------- INIT ----------
function updateXP(){
    document.getElementById("xp").innerText = xp;
}

checkDaily();
loadSubjects();
loadSquad();
updateXP();
showSection("team");
