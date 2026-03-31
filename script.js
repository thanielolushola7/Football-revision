// ---------------- SAVE SYSTEM ----------------
let data = JSON.parse(localStorage.getItem("data")) || {
    maths: { xp: 0, rating: 60 },
    science: { xp: 0, rating: 50 },
    geo: { xp: 0, rating: 55 }
};

let season = JSON.parse(localStorage.getItem("season")) || {
    xp: 0,
    level: 1
};

function saveAll() {
    localStorage.setItem("data", JSON.stringify(data));
    localStorage.setItem("season", JSON.stringify(season));
}

// ---------------- TRAINING ----------------
function train(subject) {
    data[subject].xp += 10;

    if (data[subject].xp % 50 === 0) {
        data[subject].rating++;
    }

    updateUI();
    saveAll();
}

// ---------------- UI ----------------
function updateUI() {
    for (let s in data) {
        document.getElementById(s + "-xp").innerText = data[s].xp;
        document.getElementById(s + "-rating").innerText = data[s].rating;
    }

    document.getElementById("level").innerText = season.level;
    document.getElementById("season-xp").innerText = season.xp;

    let percent = (season.xp / 100) * 100;
    document.getElementById("progress").style.width = percent + "%";
}

// ---------------- MATCH SYSTEM ----------------
let questions = [
    { q: "2 + 2?", a: ["3","4","5","6"], correct: 1 },
    { q: "10 ÷ 2?", a: ["2","5","10","3"], correct: 1 },
    { q: "5 x 3?", a: ["15","10","8","20"], correct: 0 }
];

let current = 0;
let playerScore = 0;
let aiScore = 0;

function startMatch() {
    current = 0;
    playerScore = 0;
    aiScore = 0;
    nextQuestion();
}

function nextQuestion() {
    if (current >= questions.length) {
        endMatch();
        return;
    }

    let q = questions[current];
    document.getElementById("question").innerText = q.q;

    for (let i = 0; i < 4; i++) {
        document.getElementById("a"+i).innerText = q.a[i];
    }
}

function answer(index) {
    let q = questions[current];

    if (index === q.correct) {
        playerScore++;
        season.xp += 20; // reward XP
    }

    if (Math.random() < 0.6) {
        aiScore++;
    }

    current++;
    updateScore();
    saveAll();

    setTimeout(nextQuestion, 1000);
}

function updateScore() {
    document.getElementById("score").innerText =
        "You " + playerScore + " - " + aiScore + " Opponent";
}

function endMatch() {
    if (playerScore > aiScore) {
        document.getElementById("question").innerText = "🏆 You Win!";
    } else {
        document.getElementById("question").innerText = "😢 You Lose!";
    }
}

// ---------------- SEASON PASS ----------------
function gainXP() {
    season.xp += 20;

    if (season.xp >= 100) {
        season.level++;
        season.xp = 0;
        document.getElementById("reward").innerText = "🎁 Level Up Reward!";
    }

    updateUI();
    saveAll();
}

// ---------------- RESET ----------------
function resetAll() {
    localStorage.clear();
    location.reload();
}

// LOAD
updateUI();
