const guessedSongs = [];
const guessInput = document.getElementById('guess');
const submitBtn = document.getElementById('submit');
const skipBtn = document.getElementById('skip');

remainingGuesses = 6;
let currentTime = 1;
const endTimes = [1, 2, 4, 8, 16, 30];
let timeIndex = 0;
let seekBarInterval;


const sound = new Howl({
    src: ['bttf.mp3'],
    onend: function () {
        clearInterval(seekBarInterval);
    }
});

submitBtn.addEventListener('click', function () {
    const userGuess = guessInput.value;

    if (userGuess === "Back to the Future") {
        guessedSongs.push(userGuess);
        // console.log(guessedSongs);
        // console.log(userGuess);

        guessInput.value = '';
      //  document.getElementById(`answer${guessedSongs.length + 1}`).style.color = '#1dbf32';
        render();
        // Correct guess, redirect to another page
        var score = 7 - remainingGuesses;
        console.log('Setting score in localStorage:', score);
        localStorage.setItem('scoreKey', score);
        // console.log('Setting score in localStorage:', score);

        window.location.href = 'Reveal.html'; // Replace with the actual page URL

    } else if (userGuess === "") {
        // console.log("you cant submit an empty score");
    } else {

        var selectedSong = songsData.find(song => song[0] === userGuess);

        console.log(selectedSong);
        if (selectedSong) {
            // Get the decade of the selected song
            var songDecade = selectedSong[1];

            // Check if the decade matches the correct decade (assuming a variable 'correctDecade' is set)
            if (songDecade === 1980) {
                // Correct decade, set text color to yellow
                document.getElementById(`answer${guessedSongs.length + 1}`).style.color = '#d4cd06';
            } else {
                // Incorrect decade, set text color to red
                document.getElementById(`answer${guessedSongs.length + 1}`).style.color = '#c90f0c';
            }
        }


        guessedSongs.push(userGuess);

        guessInput.value = '';

        render();
        remainingGuesses--;
        timeIndex++;

        if (timeIndex <= 3) {
            endTime.textContent = '0:0' + endTimes[timeIndex];
        } else if (timeIndex > 5) { }
        else {
            endTime.textContent = '0:' + endTimes[timeIndex];
        }

        if (remainingGuesses <= 0) {
            var score = 6 - remainingGuesses;
            localStorage.setItem('score', score);
            window.location.href = 'Reveal.html';

        }
    }
});

skipBtn.addEventListener('click', function () {
    if (remainingGuesses <= 1) {
        window.location.href = 'Reveal.html';
        localStorage.setItem('scoreKey', 7);
    }
    guessedSongs.push("SKIPPED");
    remainingGuesses--;
    render();
    timeIndex++;
    if (timeIndex <= 3) {
        endTime.textContent = '0:0' + endTimes[timeIndex];
    } else if (timeIndex > 5) { }
    else {
        endTime.textContent = '0:' + endTimes[timeIndex];
    }
});

function render() {
    for (let i = 0; i < guessedSongs.length; i++) {
        const answerElement = document.getElementById(`answer${i + 1}`);
        answerElement.textContent = guessedSongs[i];
    }
}

const playPauseButton = document.getElementById('play-pause');
const startTime = document.getElementById('startTime');
const endTime = document.getElementById('endTime');
const seekBar = document.getElementById('seek-bar');

let incrementLoop; // Declare incrementLoop outside settime

function settime() {
    sound.currentTime = 0;
    startTime.textContent = "0:00";
    sound.play();

    const incrementInterval = 1000;

    incrementLoop = setInterval(() => {
        sound.currentTime += 1;

        if (sound.currentTime < 10) {
            startTime.textContent = '0:0' + sound.currentTime;
            console.log("sound.current time = " + sound.currentTime);

        } else if (sound.currentTime <= 30) {
            startTime.textContent = '0:' + sound.currentTime;
            console.log("sound.current time = " + sound.currentTime);
        }

        if (sound.currentTime >= endTimes[timeIndex]) {
            sound.stop();
            sound.seek(0);
            startTime.textContent = "0:00";
            playPauseButton.innerHTML = "<img src='play.png' alt='Play' style='width: 35px; height: 15px;' />";
            clearInterval(incrementLoop);
            clearInterval(seekBarInterval);
            console.log('END Seekbar value' + seekBar.value);

            seekBar.value = 0;
        }
    }, incrementInterval);
    sound.currentTime = 0;
    currentTime = 0;
}

//Play and Pause actions

playPauseButton.addEventListener('click', () => {
    if (sound.playing()) {
        sound.pause();
        playPauseButton.innerHTML = "<img src='play.png' alt='Play' style='width: 35px; height: 15px;' />";
        clearInterval(incrementLoop);
    } else {
        sound.currentTime = 0;
        settime();
        // sound.play();
        playPauseButton.innerHTML = "<img src='pause.png' alt='Pause' style='width: 35px; height: 15px;' />";
    }
    //settime();
});

sound.on('end', () => {
    console.log("HELLOOO");
    playPauseButton.innerHTML = "<img src='play.png' alt='Play' style='width: 35px; height: 15px;' />";
    clearInterval(seekBarInterval);
    seekBar.value = 0;
    console.log('END Seekbar value' + seekBar.value);
    // playPauseButton.textContent = 'Play';
});

// Seek control
// const seekBar = document.getElementById('seek-bar');
// let seekBarInterval;

seekBar.addEventListener('input', () => {
    const seekPosition = (seekBar.value / 100) * endTimes[timeIndex];
    sound.seek(seekPosition);
    const seekTemp = Math.floor(seekPosition);
    if (seekTemp < 10) {
        startTime.textContent = '0:0' + seekTemp;
    } else {
        startTime.textContent = '0:' + seekTemp;
    }
    sound.currentTime = seekTemp;
});

//Update seek bar
sound.on('play', () => {
    console.log("IN PLAY hi");
    console.log('Seekbar value' + seekBar.value);
    clearInterval(seekBarInterval);

    seekBarInterval = setInterval(() => {
        const currentTime = sound.seek();
        seekBar.value = (currentTime / endTimes[timeIndex]) * 100;

        const currentTimeFloor = Math.floor(currentTime);
        if (currentTimeFloor < 10) {
            startTime.textContent = '0:0' + currentTimeFloor;
        } else {
            startTime.textContent = '0:' + currentTimeFloor;
        }
    }, 100);
});

function autocomplete(inp, arr) {
    /* The autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values: */
    var currentFocus;
    /* Execute a function when someone writes in the text field: */
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        /* Close any already open lists of autocompleted values */
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        /* Create a DIV element that will contain the items (values): */
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /* Append the DIV element as a child of the autocomplete container: */
        this.parentNode.appendChild(a);
        /* For each item in the array... */
        for (i = 0; i < arr.length; i++) {
            /* Check if the item starts with the same letters as the text field value: */
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /* Create a DIV element for each matching element: */
                b = document.createElement("DIV");
                /* Make the matching letters bold: */
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                /* Insert an input field that will hold the current array item's value: */
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /* Execute a function when someone clicks on the item value (DIV element): */
                b.addEventListener("click", function (e) {
                    /* Insert the value for the autocomplete text field: */
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /* Close the list of autocompleted values,
                    (or any other open lists of autocompleted values: */
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    /* Execute a function presses a key on the keyboard: */
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /* If the arrow DOWN key is pressed,
            increase the currentFocus variable: */
            currentFocus++;
            /* And make the current item more visible: */
            addActive(x);
        } else if (e.keyCode == 38) { // up
            /* If the arrow UP key is pressed,
            decrease the currentFocus variable: */
            currentFocus--;
            /* And make the current item more visible: */
            addActive(x);
        } else if (e.keyCode == 13) {
            /* If the ENTER key is pressed, prevent the form from being submitted: */
            e.preventDefault();
            if (currentFocus > -1) {
                /* Simulate a click on the "active" item: */
                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        /* A function to classify an item as "active": */
        if (!x) return false;
        /* Start by removing the "active" class on all items: */
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /* Add class "autocomplete-active": */
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        /* A function to remove the "active" class from all autocomplete items: */
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        /* Close all autocomplete lists in the document,
        except the one passed as an argument: */
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /* Execute a function when someone clicks in the document: */
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

/* An array containing all the song names: */
var songs = ["How to Train Your Dragon", "Harry Potter", "Star Wars", "Jurassic Park", "Indiana Jones",
    "Back to the Future", "Interstellar", "The GodFather", "Mission Impossible", "Avengers", "Terminator",
    "Forrest Gump", "The Matrix", "The Lion King", "Gladiator", "Braveheart", "Gone With the Wind",
    "Bladerunner", "Inception", "Titanic", "Avatar", "The Sound of Music"
];

var songsData = [["How to Train Your Dragon", 2010], ["Harry Potter", 2000], ["Star Wars", 1980],["Jurassic Park", 1990], ["Indiana Jones", 1980],
["Back to the Future,", 1984], ["Interstellar", 2010], ["The GodFather", 1970],
["Mission Impossible", 1990], ["Avengers", 2010], ["The Shawshank Redemption", 1990],
["The Godfather", 1970],
["The Dark Knight", 2000],
["Pulp Fiction", 1990],
["The Lord of the Rings", 2000],
["Schindler's List", 1990],
["Fight Club", 1990],
["Forrest Gump", 1990],
["Inception", 2010],
["The Matrix", 1990],
["The Silence of the Lambs", 1990],
["The Usual Suspects", 1990],
["Se7en", 1990],
["The Lion King", 1990],
["Gladiator", 2000],
["The Departed", 2000],
["The Prestige", 2000],
["The Green Mile", 1990],
["Braveheart", 1990],
["A Beautiful Mind", 2000],
["The Social Network", 2010],
["Goodfellas", 1990],
["Casablanca", 1940],
["Citizen Kane", 1940],
["Gone with the Wind", 1930],
["The Wizard of Oz", 1930],
["Inglourious Basterds", 2000],
["Django Unchained", 2010],
["The Big Lebowski", 1990],
["Blade Runner", 1980],
["The Shining", 1980],
["Eternal Sunshine of the Spotless Mind", 2000],
["The Grand Budapest Hotel", 2010],
["The Graduate", 1960],
["The Great Gatsby", 2010],
["Groundhog Day", 1990],
["The Sixth Sense", 1990],
["The Godfather: Part III", 1990],
["The Wolf of Wall Street", 2010],
["La La Land", 2010],
["The Breakfast Club", 1980],
["The Princess Bride", 1980],
["Titanic", 1990],
["The Matrix Reloaded", 2000],
["The Dark Knight Rises", 2010],
["Jurassic Park", 1990],
["Interstellar", 2010],
["Mission Impossible", 1990],
["Avengers", 2010],
["Titanic", 1990],
["Avengers", 2010],
["Terminator", 1980],
["The Social Network", 2010],
["The Sound of Music", 1960]];


/* Initiate the autocomplete function on the "guessInput" element, and pass along the songs array as possible autocomplete values: */
autocomplete(guessInput, songs);