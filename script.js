// Subjects & Topics (Example)
const subjects = [
    {name: "Mathematics", topics:["Algebra","Trigonometry","Calculus","Statistics"]},
    {name: "Physics", topics:["Electricity","Forces","Energy","Waves"]},
    {name: "Chemistry", topics:["Bonding","Genetics","Organic","Reactions"]},
    {name: "Biology", topics:["Cells","Genetics","Ecology","Human Body"]},
];

// Show / Hide Sections
function showSection(section) {
    document.getElementById("subjects").classList.add("hidden");
    document.getElementById("packs").classList.add("hidden");

    document.getElementById(section).classList.remove("hidden");

    if(section === "subjects") loadSubjects();
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

// Select subject (placeholder)
function selectSubject(index){
    alert(`You selected ${subjects[index].name}. Topics will be loaded next!`);
}
