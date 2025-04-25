import inquirer from "inquirer";
import fs from "fs";
import { error } from "console";
// import { stat } from "fs";

console.log("---POKEMON DOWNLOADER---");

// getting the pokemon name from user
inquirer
  .prompt([
    {
      type: "input",
      name: "pokemon name",
      message: "What is Pokemon name?",
    },
  ])
  .then((pokemon) => {
    //giving multiple options to user
    inquirer
      .prompt([
        {
          type: "checkbox",
          message: "select options",
          name: "options",
          choices: [
            {
              name: "Stats",
            },
            {
              name: "Sprites",
            },
            {
              name: "Artwork",
            },
          ],
        },
      ])
      .then((selectedOptions) => {
        const data = fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemon["pokemon name"]}`
        )
          .then((response) => response.json())
          .then((data) => {
            if(selectedOptions.options.includes("Sprites") && selectedOptions.options.includes("Stats") && selectedOptions.options.includes("Artwork")) {
              loadStats(pokemon, data);
              loadSprites(pokemon,data);
              loadArtwork(pokemon,data);
            } 
            else if (selectedOptions.options.includes("Stats") && selectedOptions.options.includes("Sprites")) {
              loadStats(pokemon,data)
              loadSprites(pokemon, data);
            }
             else if (selectedOptions.options.includes("Stats") && selectedOptions.options.includes("Artwork")) {
              loadStats(pokemon,data)
              loadArtwork(pokemon, data);
            }
            else if(selectedOptions.options.includes("Sprites") && selectedOptions.options.includes("Artwork")){
              loadSprites(pokemon,data)
              loadArtwork(pokemon,data)
            }
            else if(selectedOptions.options.includes("Sprites")){
             loadSprites(pokemon,data);
            }
            
          });
      });
  });

function loadStats(pokemon, data) {
  const statsObject = data.stats;
  const allStats = {};
  statsObject.forEach((statData) => {
    if (statData.stat.name && statData.base_stat) {
      const key = statData.stat.name;
      allStats[key] = statData.base_stat;
    }
  });
  fs.mkdir(`${pokemon["pokemon name"]}`,function(e){
    if(e){
      console.log(e.message)
    }
  }); // makes the folder with the selected pokemon name
  fs.writeFile(
    //makes the stats.txt file
    `${pokemon["pokemon name"]}/Stats.txt`,
    JSON.stringify(allStats, null, 2),
    function (err) {
      if (err) throw error();
      // console.log("file saved");
    }
  );
}


function loadSprites(pokemon, data) {
  const path = pokemon["pokemon name"];
  const images = data.sprites;

  const imagesObject = {
    back_default : images.back_default,
    back_shiny : images.back_shiny,
    front_default : images.front_default, 
    front_shiny : images.front_shiny
  }

  fs.mkdir(`${path}`,function(e){
    if(e){
      console.log(e.message);
    }
  });
  
  for(let entry in imagesObject){
    fetch(imagesObject[entry])
    .then((response) => response.arrayBuffer())
    .then((bufferData) => {
      const buffer = Buffer.from(bufferData);
      fs.createWriteStream(`${path}/${entry}.png`).write(buffer)
    })
  }
}

function loadArtwork(pokemon, data) {
  const path = pokemon["pokemon name"];
  const artwork = data.sprites.other["official-artwork"].front_default;
  // console.log(artwork)
  fetch(artwork)
    .then((response) => { 
      return response.arrayBuffer()
    })
    .then((bufferData) => {
      const buffer = Buffer.from(bufferData);
      fs.mkdir(`${path}`,function(e){
        if(e){
          console.log(e.message)
        }
      });
      fs.createWriteStream(`${path}/original_artwork.png`).write(buffer);
    });
}
