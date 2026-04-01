// ---------- DATA ----------
let subjects = JSON.parse(localStorage.getItem("subjects")) || [
{
    name:"Maths",
    topics:[
        {name:"Algebra",rating:60,xp:0,unlocked:true,rarity:"gold"},
        {name:"Geometry",rating:50,xp:0,unlocked:false,rarity:"bronze"},
        {name:"Trigonometry",rating:50,xp:0,unlocked:false,rarity:"silver"}
    ]
},
{
    name:"Physics",
    topics:[
        {name:"Energy",rating:50,xp:0,unlocked:false,rarity:"bronze"},
        {name:"Electricity",rating:50,xp:0,unlocked:false,rarity:"silver"}
    ]
}
];

let xp = JSON.parse(localStorage.getItem("xp")) || 0;

let loginData = JSON.parse(localStorage.getItem("loginData")) || {
    lastLogin:null,
    streak:0
};

let selectedSubject=null;

// ---------- DAILY LOGIN ----------
function checkDaily(){
    let today=new Date().toDateString();

    if(loginData.lastLogin!==today){
        let yesterday=new Date();
        yesterday.setDate(yesterday.getDate()-1);

        if(loginData.lastLogin===yesterday.toDateString()){
            loginData.streak++;
        } else {
            loginData.streak=1;
        }

        loginData.lastLogin=today;

        let reward=20+loginData.streak*5;
        xp+=reward;

        alert("Daily Reward +" + reward + " XP | Streak: " + loginData.streak);

        save();
    }
}

// ---------- QUESTIONS ----------
let questions={
"Algebra":[{q:"2x+6=14",a:["4","6","3","5"],correct:0}],
"Geometry":[{q:"Triangle sum?",a:["180","360","90","270"],correct:0}],
"Trigonometry":[{q:"sin30?",a:["0.5","1","0","-1"],correct:0}],
"Energy":[{q:"Unit of energy?",a:["Joule","Volt","Newton","Watt"],correct:0}],
"Electricity":[{q:"V=?",a:["IR","ma","E/t","none"],correct:0}]
};

// ---------- SAVE ----------
function save(){
    localStorage.setItem("subjects",JSON.stringify(subjects));
    localStorage.setItem("xp",xp);
    localStorage.setItem("loginData",JSON.stringify(loginData));
}

// ---------- UI ----------
function showSection(name){
    document.querySelectorAll(".section").forEach(s=>s.style.display="none");
    document.getElementById(name+"-section").style.display="block";
}

// ---------- LOAD SUBJECTS ----------
function loadSubjects(){
    let c=document.getElementById("subjects");
    c.innerHTML="";

    subjects.forEach((s,i)=>{
        let div=document.createElement("div");
        div.className="card";

        div.innerHTML=`
        <h3>${s.name}</h3>
        <button onclick="selectSubject(${i})">Play</button>
        `;

        c.appendChild(div);
    });
}

function selectSubject(i){
    selectedSubject=subjects[i];
    showSection("game");
}

// ---------- GAME ----------
let player=0, ai=0, currentTopic, currentQ;

function startMatch(){
    player=0; ai=0;
    nextQuestion();
    updateScore();
}

function randomTopic(){
    let unlocked=selectedSubject.topics.filter(t=>t.unlocked);
    return unlocked[Math.floor(Math.random()*unlocked.length)];
}

function nextQuestion(){
    currentTopic=randomTopic();
    let list=questions[currentTopic.name];
    currentQ=list[Math.floor(Math.random()*list.length)];

    document.getElementById("question").innerText=currentQ.q;

    for(let i=0;i<4;i++){
        document.getElementById("a"+i).innerText=currentQ.a[i];
    }
}

function answer(i){
    if(i===currentQ.correct){
        player++;
    } else if(Math.random()<0.6){
        ai++;
    }

    updateScore();

    if(player===3||ai===3){
        endMatch();
    } else nextQuestion();
}

function updateScore(){
    document.getElementById("score").innerText=player+" - "+ai;
}

function endMatch(){
    if(player>ai){
        xp+=30;
        alert("Win +30 XP");
    } else {
        xp+=10;
        alert("Loss +10 XP");
    }

    save();
    updateXP();
    showSection("subjects");
}

// ---------- PACKS ----------
function openPack(type){

    let cost = type==="bronze"?30:type==="silver"?50:80;

    if(xp<cost){
        alert("Not enough XP");
        return;
    }

    xp-=cost;
    updateXP();

    let locked=[];

    subjects.forEach(s=>{
        s.topics.forEach(t=>{
            if(!t.unlocked) locked.push(t);
        });
    });

    let pool = locked.filter(t=>t.rarity===type);
    if(pool.length===0) pool=locked;

    let card=pool[Math.floor(Math.random()*pool.length)];
    card.unlocked=true;

    save();
    loadSubjects();

    document.getElementById("pack-animation").innerHTML=
        `<div class="card">${card.name}</div>`;
}

// ---------- INIT ----------
function updateXP(){
    document.getElementById("xp").innerText=xp;
}

checkDaily();
loadSubjects();
updateXP();
