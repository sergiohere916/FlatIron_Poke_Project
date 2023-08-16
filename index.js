const url = `https://courses.cs.washington.edu/courses/cse154/webservices/pokedex/pokedex.php?pokemon=`;
const pokeUrl = "http://localhost:3000/pokemon/";
const pokeTeamUrl = "http://localhost:3000/currentTeam";
const pokeAllTeamsUrl = "http://localhost:3000/teams"

const searchNameForm = document.getElementById("poke-form");
const currentTeamForm = document.getElementById("current-team-form")
const allTeamsForm = document.getElementById("all-teams-form")


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
const currentTeamHolder = document.getElementById("current-team-holder");


let mainPoke = {};
let dbPoke = {};
let pokemonObjs = [];


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
    })
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

function deletePokeTeam(newDiv, pokeObj) {
    const index = pokemonObjs.indexOf(pokeObj);

    const deletedPokemon = pokemonObjs.splice(index, 1);

    fetch(pokeTeamUrl, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
            pokemons: pokemonObjs
        })
    })
        .then(response => response.json())
        .then(data => {
            newDiv.remove();
            // imgObj[deletedPokemon[0]["id"]].remove();
            // imgObj[deletedPokemon[0]["id"]] = "";
            // imgObj[deletedPokemon["id"]] = "";
        })
}

function updatePokeTeamFront(pokeObj) {
    const newDiv = document.createElement("div");
    const newH5 = document.createElement("h5");
    const newImg = document.createElement("img");
    const newBtn = document.createElement("button");

    newH5.textContent = mainPoke.name;
    newImg.src = dbPoke.sprite;
    newBtn.textContent = "X";

    newDiv.append(newH5);
    newDiv.append(newImg);
    newDiv.append(newBtn);

    currentTeamHolder.append(newDiv);

    newBtn.addEventListener("click", () => {
        deletePokeTeam(newDiv, pokeObj)
    })

}
function updatePokeTeam() {
    let pokeObj = {
        [mainPoke.name]: dbPoke.sprite
    }
    pokemonObjs.push(pokeObj)
    console.log(pokemonObjs)
    console.log(pokemonObjs.length)

    fetch(pokeTeamUrl, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
            pokemons: pokemonObjs
        })
    })
        .then(response => response.json())
        .then(data => {
            updatePokeTeamFront(pokeObj)
        })
}

addToTeam.addEventListener("click", () => {
    if (pokemonObjs.length < 6) {
        updatePokeTeam()
    } else {
        console.log("No more space");
    }
})
currentTeamForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const pokeTeamName = e.target[0].value
    console.log(pokeTeamName)
    fetch(pokeTeamUrl, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
            teamName: pokeTeamName
        })
    })

})