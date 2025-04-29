            else if(selectedOptions.options.includes("Stats")) {
              loadStats(pokemon,data);
            }
            else if(selectedOptions.options.includes("Artwork")) {
              loadArtwork(pokemon,data);
            }
          })
      });
  });
}


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

  fs.access(`${path}`, function (bool) {
    if(bool){
        createFolder(path);
        createStatsFile(path,allStats)
    }
    else {
      createStatsFile(path,allStats);
    }
  })
}


function loadSprites(pokemon, data) {
  const path = pokemon["pokemon name"];
  const images = data.sprites;
