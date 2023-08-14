

const url = `https://courses.cs.washington.edu/courses/cse154/webservices/pokedex/pokedex.php?pokemon=`;
const searchNameForm = document.getElementById("poke-form");
const mainPokeImage = document.getElementById("main-poke-img");
const typeDisplaySpan = document.getElementById("type-label");
const weaknessDisplaySpan = document.getElementById("weakness-label");
const moveList = document.querySelector("ol");

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
            mainPokeImage.src = poke2[pokeName];
            typeDisplaySpan.textContent = poke.info.type.toUpperCase();
            weaknessDisplaySpan.textContent = poke.info.weakness.toUpperCase(); 
            poke.moves.forEach((moveObj) => {
                const moveLi = document.createElement("li");
                moveLi.textContent = moveObj.type + ": " + moveObj.name;
                moveList.append(moveLi);
            } )
        })
    })
}

searchNameForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const userInputtedName = e.target[0].value; 
    displayPokeInfo(userInputtedName);
})

