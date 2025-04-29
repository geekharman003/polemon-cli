This is a cli application which helps in downloading information about your favorite pokemon like its stats,sprites images and official artwork.

in this project i used three node modules :

1. fs module (for file handling)
    
    this module is mainly used to handle file or folders.we can do a lot of different things like creating a file ,reading a file, creating a directory, reading from the directory etc.
    
    i used the fs.access(), fs.mkdir() , fs.writeFile(), fs.createWriteStream().write();
    
    fs.access → this method is mainly used to check if my file have certain permissions or not but we can use it check if the specified folder exists or not.
    
    (i) fs.access(path,callback_function(error))
    
    it takes the path of the folder and runs the callback_function.
    
    if the specified folder exists then the error will not be thrown but if the folder does not exists then error will be thrown;
    
    (ii) fs.mkdir() → as the name suggests, it is used to make directory.again it takes two arguments.
    
    fs.mkdir(dir_name,callback_function(err))
    
    if the specified directory already exists, then it throws the error.otherwise creates the directory with specified name.
    
    (iii) fs.writeFile → it is used to write content in a file.
    
    fs.writeFile(file_path,callback_function(err))
    
    if the file exists on the specified path, it writes the data in it.if not, the callback_function will throw an error.
    
    (iv) fs.createWriteStream(path).write(buffer) → is is maily used to handle buffer data. buffer data examples are images,songs,videos etc.these all stores the data in the form of buffer.
    
    it takes the path where we want to write our buffer data and then we call the write function which takes the buffer data which we want to write in our file.
    
     
    
2. inquirer module ( for cli interaction)
    
    inquirer module is used to make the cli interactive.we can do a hell lot of things using this [module.in](http://module.in) this project i used the prompt method of inquirer which helps us to write prompts on the cli.
    
    the prompt function takes an array of objects .each object have several keys like type, name,message etc. 
    
    type decides in which form user can anser the question i.e input,checkbox,list etc.
    
    name is unique to each question so that we can identify it.
    
    message is which showed to the user at the cli as the form of question.
    
     when user sumbit the answer to all the questions then prompt method return a promise.
    
    we can use that promise values to fetch data dynamically.
    
3. fetch (for getting the data over the internet)
    
     it is by default comes with node when we installed it.
    
    it is used to fetch data all over the internet.
    

Flow of project:

1. first the users runs the main file in which the prompts functions are written.

  2.  then a question will be shown on the user screen which asks for the pokemon name to be searched.

  3. when user clicked enter then again a select prompt shows to the users which asks which data related to pokemon should be loaded i.e stats ,sprites or artwork.user can select any number of choices.

1. user clicks on enter a fetch request will be made which loads all the data related to pokemon.
    
    if the users select stats then loadStats() function will be run which extracts the stats data from the fetched pokemon data object.then it calls the createFolder function which makes a folder with pokemon name.then we call the createStatsFile() function which is responsible for writing all the stats data in the file.
    
    if the user selects sprites ,then loadSprites() function will be called in which we extract the sprites data from the pokemon object.then this function calls the createFolder() function if its not build.then it calls the createSprites() function which again takes the extracted data from loadSprites() and then fetch the image files and write its data in seperate files.
    
    if the user selects artwork ,then loadArtWork() function will be called in which we extract the artwork data from the pokemon object.then this function calls the createFolder() function if its not build.then it calls the createArtwork() function which again takes the extracted data from loadArtwork() and then fetch the image file and write its data in a file.
    
2. again user is promted to either continue with next search or leave here.
    
     if the user selects yes then again all steps from 2-4 will be repeated but with different   pokemon name.
    
    otherwise program stops.
