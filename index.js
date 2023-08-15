

const url = `https://courses.cs.washington.edu/courses/cse154/webservices/pokedex/pokedex.php?pokemon=`;
const pokeUrl = "http://localhost:3000/pokemon/";
const pokeTeamUrl = "http://localhost:3000/currentTeam";

const searchNameForm = document.getElementById("poke-form");
const nameH1 = document.getElementById("pokemon-name");
const entryId = document.getElementById("entry-id");
const description = document.getElementById("description");

const mainPokeImage = document.getElementById("main-poke-img");
const typeDisplaySpan = document.getElementById("type-label");
const weaknessDisplaySpan = document.getElementById("weakness-label");
const moveList = document.querySelector("ol");
const heightSpan = document.getElementById("height-label");
const weightSpan = document.getElementById("weight-label");
const speciesSpan = document.getElementById("poke-species");
const evolutionList = document.getElementById("evolutions-list");
const addToTeam = document.getElementById("add-poke");

//Grabbing elements required for displaying current selected team
const currentPoke1Name = document.getElementById("poke-1-name");
const currentPoke1Img = document.getElementById("poke-1-img");
const currentPoke2Name = document.getElementById("poke-2-name");
const currentPoke2Img = document.getElementById("poke-2-img");
const currentPoke3Name = document.getElementById("poke-3-name");
const currentPoke3Img = document.getElementById("poke-3-img");
const currentPoke4Name = document.getElementById("poke-4-name");
const currentPoke4Img = document.getElementById("poke-4-img");
const currentPoke5Name =document.getElementById("poke-5-name");
const currentPoke5Img = document.getElementById("poke-5-img");
const currentPoke6Name = document.getElementById("poke-6-name");
const currentPoke6Img = document.getElementById("poke-6-img");

let mainPoke = {};
let dbPoke = {}

function renderPokemon(poke, poke2) {
    mainPoke = poke; 
    dbPoke = poke2; //added this as test
    nameH1.textContent = poke.info.name;
    entryId.textContent = poke.info.id;
    description.textContent = poke.info.description;
    mainPokeImage.src = poke2[poke.name];
    typeDisplaySpan.textContent = poke.info.type.toUpperCase();
    weaknessDisplaySpan.textContent = poke.info.weakness.toUpperCase(); 
    poke.moves.forEach((moveObj) => {
        const moveLi = document.createElement("li");
        moveLi.textContent = moveObj.type.toUpperCase() + ": " + moveObj.name.toUpperCase();
        moveList.append(moveLi);
    } )
    heightSpan.textContent = poke2.height;
    weightSpan.textContent = poke2.weight; 
    speciesSpan.textContent = poke2.category.toUpperCase(); 
    poke2.evolutions.forEach((evolution) => {
        const evolutionLi = document.createElement("li");
        const evolutionImg = document.createElement("img");
        evolutionLi.textContent = evolution.name;
        evolutionImg.src = evolution.sprite;
        evolutionLi.append(evolutionImg);
        evolutionList.append(evolutionLi);

    })
}

function displayPokeInfo(pokeName) {
    moveList.innerText = "";
    evolutionList.innerHTML = "";
    fetch(`${url}${pokeName}`)
    .then(res => res.json())
    .then(poke => {
        console.log(poke);
        const pokeId = poke.info.id;
        fetch(`http://localhost:3000/pokemon/${pokeId}`)
        .then(res => res.json())
        .then(poke2 => {
           renderPokemon(poke, poke2);
        })
    })
}

searchNameForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const userInputtedName = e.target[0].value; 
    displayPokeInfo(userInputtedName);
})

addToTeam.addEventListener("click", (e) => {
    if (currentPoke1Name.textContent === "") {
        currentPoke1Name.textContent = mainPoke.name; 
        currentPoke1Img.src = dbPoke.sprite; 
    } else if (currentPoke2Name.textContent === "") {
        currentPoke2Name.textContent = mainPoke.name; 
        currentPoke2Img.src = dbPoke.sprite; 
    } else if (currentPoke3Name.textContent === "") {
        currentPoke3Name.textContent = mainPoke.name; 
        currentPoke3Img.src = dbPoke.sprite; 
    } else if (currentPoke4Name.textContent === "") {
        currentPoke4Name.textContent = mainPoke.name; 
        currentPoke4Img.src = dbPoke.sprite; 
    } else if (currentPoke5Name.textContent === "") {
        currentPoke5Name.textContent = mainPoke.name; 
        currentPoke5Img.src = dbPoke.sprite; 
    } else if (currentPoke6Name.textContent === "") {
        currentPoke6Name.textContent = mainPoke.name; 
        currentPoke6Img.src = dbPoke.sprite; 
    }
})

// fetch(pokeTeamUrl)
// .then(res => res.json())
// .then(team => {
//     console.log(team);
// })
