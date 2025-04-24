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
            if (selectedOptions.options.includes("Stats")) {
              loadStats(pokemon, data);
            } else if (selectedOptions.options.includes("Sprites")) {
              loadSprites(pokemon, data);
            } else if (selectedOptions.options.includes("Artwork")) {
              loadArtwork(pokemon, data);
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
  fs.mkdir(`${pokemon["pokemon name"]}`); // makes the folder with the selected pokemon name
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
  // const bufferData = {
  //   back_default : "",
  //   back_shiny : "",
  //   front_default : "",
  //   front_shiny : "",
  // };
  console.log(images)
  const { back_default, back_shiny, front_default, front_shiny } = images;
  // console.log(back_default, back_shiny, front_default, front_shiny);
  fs.mkdirSync(`${path}`);
  Promise.all([back_default, back_shiny, front_default, front_shiny]).then(
    (response) => {
      response.forEach((res) => {
        const buffer = Buffer.from(res);
        fs.createWriteStream(`${path}/back_default.png`).write(buffer);
      });
    }
  );
}

function loadArtwork(pokemon, data) {
  const path = pokemon["pokemon name"];
  const artwork = data.sprites.other["official-artwork"].front_default;
  // console.log(artwork)
  fetch(artwork)
    .then((response) => response.arrayBuffer())
    .then((bufferData) => {
      const buffer = Buffer.from(bufferData);
      fs.mkdirSync(`${path}`);
      fs.createWriteStream(`${path}/original_artwork.png`).write(buffer);
    });
}
