import inquirer from "inquirer";
import fs from "fs";
import { error } from "console";

console.log("---POKEMON DOWNLOADER---");

// get required data input from user

const start = () => {
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
          fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon["pokemon name"]}`)
            .then((response) => response.json())
            .then((data) => {
              if (
                selectedOptions.options.includes("Sprites") &&
                selectedOptions.options.includes("Stats") &&
                selectedOptions.options.includes("Artwork")
              ) {
                loadStats(pokemon, data);
                loadSprites(pokemon, data);
                loadArtwork(pokemon, data);
              } else if (
                selectedOptions.options.includes("Stats") &&
                selectedOptions.options.includes("Sprites")
              ) {
                loadStats(pokemon, data);
                loadSprites(pokemon, data);
              } else if (
                selectedOptions.options.includes("Stats") &&
                selectedOptions.options.includes("Artwork")
              ) {
                loadStats(pokemon, data);
                loadArtwork(pokemon, data);
              } else if (
                selectedOptions.options.includes("Sprites") &&
                selectedOptions.options.includes("Artwork")
              ) {
                loadSprites(pokemon, data);
                loadArtwork(pokemon, data);
              } else if (selectedOptions.options.includes("Sprites")) {
                loadSprites(pokemon, data);
              } else if (selectedOptions.options.includes("Stats")) {
                loadStats(pokemon, data);
              } else if (selectedOptions.options.includes("Artwork")) {
                loadArtwork(pokemon, data);
              }
              setTimeout(() => {
                askToContinue();
              }, 2000);
            });
        });
    });
};

const askToContinue = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "again",
        message: "would you like to search for another pokemon?",
        choices: ["yes", "no"],
      },
    ])
    .then((answer) => {
      if (answer.again === "yes") {
        start();
      }
    });
};

function loadStats(pokemon, data) {
  const path = pokemon["pokemon name"];
  const statsObject = data.stats;
  const allStats = {};
  statsObject.forEach((statData) => {
    if (statData.stat.name && statData.base_stat) {
      const key = statData.stat.name;
      allStats[key] = statData.base_stat;
    }
  });

  fs.access(`${path}`, function (error) {
    if (error) {
      createFolder(path);
      createStatsFile(path, allStats);
    } else {
      createStatsFile(path, allStats);
    }
  });
}

function loadSprites(pokemon, data) {
  const path = pokemon["pokemon name"];
  const images = data.sprites;

  const imagesObject = {
    back_default: images.back_default,
    back_shiny: images.back_shiny,
    front_default: images.front_default,
    front_shiny: images.front_shiny,
  };

  fs.access(`${path}`, function (error) {
    if (error) {
      createFolder(path);
      createSpritesFiles(path, imagesObject);
    } else {
      createSpritesFiles(path, imagesObject);
    }
  });
}

function loadArtwork(pokemon, data) {
  const path = pokemon["pokemon name"];
  const artwork = data.sprites.other["official-artwork"].front_default;

  fs.access(`${path}`, function (error) {
    if (error) {
      createFolder(path);
      createOfficialArtWork(path, artwork);
    } else {
      createOfficialArtWork(path, artwork);
    }
  });
}

const createFolder = (path) => {
  // makes the folder with the selected pokemon name
  fs.mkdir(`${path}`, function (e) {
    if (e) {
      return;
    }
  });
};

const createStatsFile = (path, allStats) => {
  fs.writeFile(
    `${path}/Stats.txt`, //creates the Stats.txt file
    JSON.stringify(allStats, null, 2),
    function (err) {
      if (err) throw error();
      // console.log("file saved");
    }
  );
  console.log(`Saved: ${path}/Stats.txt`);
};

const createSpritesFiles = (path, imagesObject) => {
  for (let entry in imagesObject) {
    fetch(imagesObject[entry])
      .then((response) => response.arrayBuffer())
      .then((bufferData) => {
        const buffer = Buffer.from(bufferData);
        fs.createWriteStream(`${path}/${entry}.png`).write(buffer);
        console.log(`Saved: ${path}/${entry}.png`);
      });
  }
};
const createOfficialArtWork = (path, artwork) => {
  fetch(artwork)
    .then((response) => {
      return response.arrayBuffer();
    })
    .then((bufferData) => {
      const buffer = Buffer.from(bufferData);
      fs.createWriteStream(`${path}/original_artwork.png`).write(buffer);
      console.log(`Saved: ${path}/original_artwork.png`);
    });
};


start();
