//Variables
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Grabbing URL's for fetch
const url = `https://courses.cs.washington.edu/courses/cse154/webservices/pokedex/pokedex.php?pokemon=`;
const pokeUrl = "http://localhost:3000/pokemon/";
const pokeTeamUrl = "http://localhost:3000/currentTeam";
const pokeAllTeamsUrl = "http://localhost:3000/teams"


//Grabbing forms for submit event listeners
const searchNameForm = document.getElementById("poke-form");
const currentTeamForm = document.getElementById("current-team-form")
const allTeamsForm = document.getElementById("all-teams-form")
const ratingForm = document.getElementById("rating-form");


//Grabbing nodes for DOM manipulation at a later point
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
const widgetsDiv = document.getElementById("widgets")

const allTeamsHolder = document.getElementById("team-holder-rater")


//Grabbing elements required for displaying current selected team
const currentTeamHolder = document.getElementById("current-team-holder");
const currentTeam = document.getElementById("current-team");


//Global Variables
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//This is used to render the main pokemon image and information onto webpage based on what pokemon the user entered in the search
searchNameForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const userInputtedName = e.target[0].value; 
    displayPokeInfo(userInputtedName);
})

//Displays all widgets at the top of the page, fetches information from db json
fetch(pokeUrl)
.then(response => response.json())
.then(pokemons => {
    pokemons.forEach(pokemon => {
        renderPokemonWidget(pokemon)
    })
})


//Displays all teams already created at the bottom of the webpage
fetch(pokeAllTeamsUrl)
.then(response => response.json())
.then(teams => {
    teams.forEach(team => {
        renderingTeamObj(team);
    })
})


/*
Event listener is added to button, checks if global variable holding working team list of pokemons exceed 6 as there
can only be 6 pokemon to a team, if not then more pokemons can still be added and displayed at the top of the page.
Once list is full, will not be able to add or display more up top. 
*/
addToTeam.addEventListener("click", () => {
    if (nameH1.textContent !== "Pokemon Name") {
        if (pokemonObjs.length < 6) {
            updatePokeTeam()  
        } else {
            alert("No more space");
        }
    } else {
        alert("Need pokemon selected");
    }
})

/*
Event listener is added to form for submitting a team name, if conditions for submitting are met global variable current team object
will be initialized values are passed in inclluding a list of the pokemon objects that were selected as the user's team. Then object
is sent to the back end using a fetch post
*/
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


/*
Event listener added to button that toggles version of pokemon on display
toggles between "shiny" version or "standard" version of the pokemon
*/
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
})

ratingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log(selectedTeamObj);
    if (Object.keys(selectedTeamObj).length !== 0) {
        const rating = e.target[0].value
        updateRating(rating);
    } else {
        alert("No team selected");
    }
})


//FUNCTIONS
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/*
This function is used to fetch the two specific pokemon objects we will be extracting data from
this includeds the pokemon object extracted from the API and using the same inputted name the pokemon
object from the db json data we created. Upon fetching, any previously rendered data will be reset to blank.
*/
function displayPokeInfo(pokeName) {
    moveList.innerText = "";
    fetch(`${url}${pokeName}`)
    .then(res => res.json())
    .then(poke => {
        const pokeId = poke.info.id;
        fetch(`${pokeUrl}${pokeId}`)
        .then(res => res.json())
        .then(poke2 => {
        renderPokemon(poke, poke2);
        })
    })
    .catch((e) => {
        alert("invalid entry")
    })
}

/*
This function takes both of the objects and creates a global variable replica to recognize which pokemon is currently 
being displayed in the main part of the page. Data from the objects is now used to fill the main section of the page with
the specific pokemon's information thus the pokemon and its data is rendered.
*/
function renderPokemon(poke, poke2) {
    mainPoke = poke; 
    dbPoke = poke2;
    shinyToggle = false;                            //shiny toggle reset to default state during call to render pokemon
     shinyBtn.style.backgroundColor = "#ff3333";
    evolutionList.innerHTML = "";           //May be able to remove this code? Already reset innert text in function above
    moveList.innerHTML = "";

    nameH1.textContent = poke.name;
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
        evolutionImg.addEventListener("click", () => {      //Allows click on evolution and returns to evolution
            displayPokeInfo(evolution.name);
        })
    })
}


/*
Function used to render all pokemon widgets from db json, adds click event on rendered images
serving the same use as searching a pokemon by name in the search bar.
*/
function renderPokemonWidget(pokeWidget) {
    const newDiv = document.createElement("div");
    const newImg = document.createElement("img");
    newImg.src = pokeWidget.sprite2;
    newDiv.append(newImg);
    widgetsDiv.append(newDiv);
    
    newImg.addEventListener("mouseover", () => {
        newImg.src = pokeWidget.gif;
    })

    newImg.addEventListener("mouseleave", () => {
        newImg.src = pokeWidget.sprite2;
    })
    
    const pokeName = Object.keys(pokeWidget)[1];
    // console.log(pokeName)

    newImg.addEventListener("click", () => {
        fetch(`${url}${pokeName}`)
        .then(response => response.json())
        .then(data => {
            renderPokemon(data, pokeWidget);
        })
    })
    
}


/*
Function uses two values from global variables and places them in another object that will be pushed to
array that will act as working team list of pokemons, length of array will be used to check if more pokemons
can still be added. Values in pushed in object will be used to populate small display of pokemon and the user's
currently selected team. Pokemon on display will also be added a feature via click event to delete from current team and
the working list array. 
*/
function updatePokeTeam () {
    let pokeObj = {
        name: mainPoke.name,
        sprite: dbPoke.sprite
    }
    pokemonObjs.push(pokeObj) 
    updatePokeTeamFront(pokeObj) 
}

function updatePokeTeamFront (pokeObj) {
    const newDiv = document.createElement("div");
    const newH5 = document.createElement("h5");
    const newImg = document.createElement("img");
    const newBtn = document.createElement("button");

    newH5.textContent = mainPoke.name;
    newImg.src = dbPoke.sprite;
    newBtn.textContent = "X";
    newImg.style.display = "inline-block";121

    newDiv.append(newH5);
    newDiv.append(newImg);
    newDiv.append(newBtn);
    currentTeam.append(newDiv);

    newBtn.addEventListener("click", () => { 
        deletePokeTeam(newDiv, pokeObj)
    })

}

/*
Function used to delete div with pokemon information that was being used
to display the pokemon on user's current team. Pokemon obj is also removed
from array of working team list of pokemons. 
*/
function deletePokeTeam (newDiv, pokeObj) {
    const index = pokemonObjs.indexOf(pokeObj);
    const deletedPokemon = pokemonObjs.splice(index, 1); //MARKED FOR REMOVAL
    currentTeamObj.pokemons = pokemonObjs;
    newDiv.remove();
}


/*
Function fills global variable current team object with relevant values, name and
the users team via the array holding the pokemon objects and sends it to the backend
*/
function creatingTeamObj(pokeTeamName) {
    currentTeamObj.teamName = pokeTeamName;
    currentTeamObj.pokemons = pokemonObjs;

    fetch(pokeAllTeamsUrl, {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify(currentTeamObj)
    })
    .then(response => response.json())
    .then(team => {
        renderingTeamObj(team);
    })
}


/*
Function erases display, resets array with working team, once user's team has been sent to the backend thus preparing the page
for another team to be created. Function will also render the team (and all teams) that now exist on the json at the bottom of the webpage. Div is created
and other elements are appended that will display current rating, team name, and images of pokemons on team. Hovering over the team will display a shadow on the 
div holding the team. Click event at the bottom of the function fills a global variable selected team which will be used to update ratings later.  
*/
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
        pokeDiv.append(newImg); 
    })
    
    pokeTeamName.textContent = `Team Name: ${team.teamName}`;
    pokeTeamRating.textContent = `Avg Rating: ${team.averageRating}`;

    infoDiv.append(pokeTeamName);
    infoDiv.append(pokeTeamRating);
    mainDiv.append(infoDiv, pokeDiv);
    allTeamsHolder.append(mainDiv);

    pokemonObjs = []; 

    mainDiv.addEventListener("click", () => {
        selectedTeamObj = {...team, header: pokeTeamRating};
        console.log(selectedTeamObj);
    })
}



//Function grabs global variable and uses it to complete a fetch patch updating the selected teams rating
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


//Function used to calculate the average rating from all ratings the selected team has received
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