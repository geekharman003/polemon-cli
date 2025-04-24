import inquirer from "inquirer";
import fs from "fs/promises";
import { error } from "console";
import { stat } from "fs";

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
        console.log(selectedOptions)
        const data = fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemon["pokemon name"]}`
        )
          .then((response) => response.json())
          .then((data) => {
            const statsObject = data.stats
           const allStats = {};
            statsObject.forEach((statData)=>{
              if(statData.stat.name && statData.base_stat){
              const key = statData.stat.name
              allStats[key] = statData.base_stat
              }
            })
            if (selectedOptions.options.includes("Stats")) {
              loadStats(pokemon);
            }
          });
      });
  });


  function loadStats(pokemon){
    fs.mkdir(`${pokemon["pokemon name"]}`); // makes the folder with the selected pokemon name
    fs.writeFile(
      //makes the stats.txt file
      `${pokemon["pokemon name"]}/Stats.txt`,
      JSON.stringify(allStats, null, 2),
      function (err) {
        if (err) throw error();
        console.log("file saved");
      }
    );
  }


  function loadSprites(pokemon) {}

  function loadArtwork(pokemon) {}
