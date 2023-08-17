const url = `https://courses.cs.washington.edu/courses/cse154/webservices/pokedex/pokedex.php?pokemon=`;
const pokeUrl = "http://localhost:3000/pokemon/";
const pokeTeamUrl = "http://localhost:3000/currentTeam";
const pokeAllTeamsUrl = "http://localhost:3000/teams"

const searchNameForm = document.getElementById("poke-form");
const currentTeamForm = document.getElementById("current-team-form")
const allTeamsForm = document.getElementById("all-teams-form")
const ratingForm = document.getElementById("rating-form");

const nameH1 = document.getElementById("pokemon-name");
const entryId = document.getElementById("entry-id");
const description = document.getElementById("description");

const shinyBtn = document.getElementById("shiny-btn");

const mainPokeImage = document.getElementById("main-poke-img");
const typeDisplaySpan = document.getElementById("type-label");
const weaknessDisplaySpan = document.getElementById("weakness-label");
const moveList = document.querySelector("ol");
const heightSpan = document.getElementById("height-label");
const weightSpan = document.getElementById("weight-label");
const speciesSpan = document.getElementById("poke-species");
const evolutionList = document.getElementById("evolutions-list");
const addToTeam = document.getElementById("add-poke");

const allTeamsHolder = document.getElementById("team-holder-rater")

//Grabbing elements required for displaying current selected team
const currentTeamHolder = document.getElementById("current-team-holder");
const currentTeam = document.getElementById("current-team");

let mainPoke = {};
let dbPoke = {};
let pokemonObjs = [];
let selectedTeamObj = {};
let shinyToggle = false;

let currentTeamObj = {
    teamName: "",
    pokemons: [],
    ratings: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    },
    averageRating: 0
};


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

//This is used to render the main pokemon image and information onto webpage based on what pokemon the user entered in the search
searchNameForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const userInputtedName = e.target[0].value; 
    displayPokeInfo(userInputtedName);
})



function deletePokeTeam (newDiv, pokeObj) {
    const index = pokemonObjs.indexOf(pokeObj);
    const deletedPokemon = pokemonObjs.splice(index, 1);
    currentTeamObj.pokemons = pokemonObjs;
    newDiv.remove();
}

function updatePokeTeamFront (pokeObj) {
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

    currentTeam.append(newDiv);

    newBtn.addEventListener("click", () => { 
        deletePokeTeam(newDiv, pokeObj)
    })

}

function updatePokeTeam () {
    let pokeObj = {
        name: mainPoke.name,
        sprite: dbPoke.sprite
    }
    pokemonObjs.push(pokeObj) //Pushes currently displayed pokemon to user's team array labeled pokemonObjs
    updatePokeTeamFront(pokeObj) //Uses function to create div, fills div with img, name, and button. Small card div is then appended to larger div
}


addToTeam.addEventListener("click", () => {
    if (pokemonObjs.length < 6) {
        updatePokeTeam()  
    } else {
        console.log("No more space");
    }
})

function renderingTeamObj(team) {
    currentTeam.innerHTML = "";
    
    const mainDiv = document.createElement("div");
    mainDiv.addEventListener("mouseover", (e) => {
        mainDiv.style.boxShadow = "10px 10px 10px 10px black"                                                                                                                                                                                                                                                                                                                                                                                                                        
    })
    mainDiv.addEventListener("mouseleave", (e) => {
        mainDiv.style.boxShadow = ""
    })

    const infoDiv = document.createElement("div");
    const pokeDiv = document.createElement("div");

    mainDiv.className = "team-div";

    const pokeTeamName = document.createElement("h5");
    const pokeTeamRating = document.createElement("h5");
    
    team.pokemons.forEach(pokemon => {
        const newImg = document.createElement("img");
        newImg.src = pokemon["sprite"];
        newImg.classList = "poke-div";
        pokeDiv.append(newImg); //Grabs pokemons from team in the backend and appends their image to bottom div holder
    })
    
    pokeTeamName.textContent = `Team Name: ${team.teamName}`;
    pokeTeamRating.textContent = `Avg Rating: ${team.averageRating}`;

    infoDiv.append(pokeTeamName);
    infoDiv.append(pokeTeamRating);
    mainDiv.append(infoDiv, pokeDiv);
    allTeamsHolder.append(mainDiv);

    pokemonObjs = []; //Resets the team array since user's team has now been sent to the backend

    mainDiv.addEventListener("click", () => {
        selectedTeamObj = {...team, header: pokeTeamRating};
        console.log(selectedTeamObj);
    })
}

function updateRating(rating) {
    selectedTeamObj.ratings[rating] += 1
    const avgRating = getAvgRating();

    const selectedTeamObjId = selectedTeamObj.id;

    fetch(`${pokeAllTeamsUrl}/${selectedTeamObjId}`, {
        method: "PATCH",
        headers: {"content-type": "application/json"},
        body: JSON.stringify({
            ratings: selectedTeamObj.ratings,
            averageRating: avgRating
        })
    })
    .then(response => response.json())
    .then(team => {
        selectedTeamObj["header"].textContent = `Avg Rating: ${team.averageRating}`;
    })
}

function creatingTeamObj(pokeTeamName) {
    currentTeamObj.teamName = pokeTeamName;
    currentTeamObj.pokemons = pokemonObjs;

    console.log("This is about to be pushed to the backend:")
    console.log(currentTeamObj);

    fetch(pokeAllTeamsUrl, {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify(currentTeamObj)
    })
    .then(response => response.json())
    .then(team => {
        console.log(team);
        renderingTeamObj(team);
    })
}

function getAvgRating() {
    let sum = 0;
    let numSum = 0;
    const numbers = Object.values(selectedTeamObj.ratings);

    for (let i = 0; i < numbers.length; i++) {
        numSum += numbers[i];
    }
    for (rate in selectedTeamObj.ratings) {
        sum += rate * selectedTeamObj.ratings[rate];
    }
    return (sum / numSum).toFixed(2);
}

currentTeamForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const pokeTeamName = e.target[0].value;
    console.log(pokeTeamName)
    if ((pokemonObjs.length !== 0) && (pokeTeamName !== "")) {
        creatingTeamObj(pokeTeamName)
    } else {
        alert("Need 1 or more pokemon on team or team name")
    }
})

shinyBtn.addEventListener("click", (e) => {
    if (shinyToggle) {
        e.target.style.backgroundColor = "#ff3333";
        mainPokeImage.src = dbPoke[mainPoke.name];
        shinyToggle = false;
    } else {
        e.target.style.backgroundColor = "orange"
        mainPokeImage.src = dbPoke["shiny"];
        shinyToggle = true;
    }
    console.log(shinyToggle);
})

ratingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (selectedTeamObj.length > 0) {
        const rating = e.target[0].value
        updateRating(rating);
    } else {
        alert("No team selected");
    }
})


fetch(pokeAllTeamsUrl)
.then(response => response.json())
.then(teams => {
    teams.forEach(team => {
        renderingTeamObj(team);
    })
})



//CODE FOR DELETIONS HERE: 


//This first fetch is needed to reset currentTeam in the backend
// fetch(pokeTeamUrl, {
//     method: "PATCH",
//     headers: {"content-type": "application/json"},
//     body: JSON.stringify({
//         teamName: "",
//         pokemons: pokemonObjs
//     })
// })
// .then(response => response.json())
// .then(data => {
//     currentTeam.innerHTML = "";
// })


// fetch(pokeTeamUrl, {
//     method: "PATCH",
//     headers: {"content-type":"application/json"},
//     body: JSON.stringify({
//         teamName: pokeTeamName
//     })
// })
// .then(response => response.json())
// .then(unusedData => {
//     fetch(pokeTeamUrl)
//     .then(response => response.json())
//     .then(data => {
//         currentTeamObj = data;


//     })
// })  

// function deletePokeTeam (newDiv, pokeObj) {
//     const index = pokemonObjs.indexOf(pokeObj);
    
//     const deletedPokemon = pokemonObjs.splice(index, 1);
    
//     fetch(pokeTeamUrl, {
//         method: "PATCH",
//         headers: {"content-type": "application/json"},
//         body: JSON.stringify({
//             pokemons: pokemonObjs
//         })
//     })
//     .then(response => response.json())
//     .then(data => {
//         newDiv.remove();
//     })
// }