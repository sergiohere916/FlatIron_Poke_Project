

const url = `https://courses.cs.washington.edu/courses/cse154/webservices/pokedex/pokedex.php?pokemon=`;
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

function renderPokemon(poke, poke2) {
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
}

function displayPokeInfo(pokeName) {
    moveList.innerText = "";
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

