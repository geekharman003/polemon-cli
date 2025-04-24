import inquirer from "inquirer";
import fs from "fs/promises";
import { error } from "console";

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
            console.log(data)
            if (selectedOptions.options.includes("Stats")) {
              fs.mkdir(`${pokemon["pokemon name"]}`); //makes the folder with the selected pokemon name
              fs.writeFile(
                //makes the stats.txt file
                `${pokemon["pokemon name"]}/Stats.txt`,
                `hello`,
                function (err) {
                  if (err) throw error();
                  console.log("file saved");
                }
              );
            }
          });
      });

    // fetch(`https://pokeapi.co/api/v2/pokemon/${answers["pokemon name"]}`)
    //   .then((response) => response.json())
    //   .then((pokemonData) => console.log(pokemonData.stats));
  });
