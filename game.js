// Possible knight moves relative to the grid (row, col)
const knightMoves = [
    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
    [1, -2], [1, 2], [2, -1], [2, 1]
];

// Possible starting positions (index corresponds to table cells 1 through 9, but only edge or corners)
const startingPositions = [0, 1, 2, 3, 5, 6, 7, 8]; // Only edge and corner positions

let board = Array(9).fill(null); // Initialize empty board
let path = []; // Track the sequence of positions the knight visits
let currentWord = ''; // Store the current word for the game
let attempts = 0; // Track the number of attempts the player has made
let words = [];


function loadWords() {
    const language = document.getElementById("languageSelector").value;
    let fileToFetch = "";

    if (language === "english") {
        fileToFetch = "8letterwords.txt";  // Update the path as needed
    } else if (language === "dutch") {
        fileToFetch = "eight_letter_nouns_UPPERCASE.txt";  // Update the path as needed
    }

    // Fetch the word file
    fetch(fileToFetch)
        .then(response => response.text())
        .then(data => {
            words = data.split('\n').filter(word => word);
            console.log("Words loaded: ", words);
            populateBoard(); // Start the game after words are loaded
        })
        .catch(error => console.error("Error fetching words: ", error));
}


// Event listener for language selection change
document.getElementById("languageSelector").addEventListener("change", () => {
    resetBoard();  // Reset the board when language changes
    loadWords();   // Load new words based on selected language
});


// Function to randomly choose a word and populate the board using knight's moves
function populateBoard() {
    currentWord = getRandomWord();
    let currentIndex = getRandomStartPosition();
    board[currentIndex] = currentWord[0];  // Place the first letter
    path = [currentIndex]; // Start tracking the path

    let wordIndex = 1; // Track the next letter to place
    
    // Fill the board letter by letter following knight's moves
    while (wordIndex < currentWord.length) {
        let nextMove = getNextKnightMove(currentIndex);

        if (nextMove !== -1) { // Valid move
            currentIndex = nextMove; // Move to new position
            board[currentIndex] = currentWord[wordIndex];  // Place the next letter
            path.push(currentIndex); // Add this position to the path
            wordIndex++;
        } else {
            // If there are no valid moves left, we can't place all letters; break the loop.
            break;
        }
    }

    // Display the board
    updateBoardUI();
}

// Get a random word from the word list
function getRandomWord() {
    return words[Math.floor(Math.random() * words.length)];
}

// Get a random start position (from corners or edges)
function getRandomStartPosition() {
    return startingPositions[Math.floor(Math.random() * startingPositions.length)];
}

// Get the next valid knight move for the current position
function getNextKnightMove(currentIndex) {
    let validMoves = [];
    let row = Math.floor(currentIndex / 3); // Convert index to row (0 to 2)
    let col = currentIndex % 3; // Convert index to column (0 to 2)

    // Loop through all possible knight moves
    for (let move of knightMoves) {
        let newRow = row + move[0];
        let newCol = col + move[1];

        // Ensure the move stays within the 3x3 grid
        if (newRow >= 0 && newRow < 3 && newCol >= 0 && newCol < 3) {
            let newIndex = newRow * 3 + newCol; // Calculate new index from row and col
            if (!board[newIndex]) { // Only move to empty cells
                validMoves.push(newIndex);
            }
        }
    }

    // Return a random valid move if any are available, otherwise return -1
    return validMoves.length > 0 ? validMoves[Math.floor(Math.random() * validMoves.length)] : -1;
}

// Update the board UI by filling the table with letters
function updateBoardUI() {
    let cells = document.querySelectorAll('td');
    board.forEach((letter, index) => {
        if (letter) {
            cells[index].textContent = letter;
        } else if (!cells[index].classList.contains('empty')) {
            cells[index].textContent = '';
        }
    });
}

// Handle the submission of a guess
function submitGuess() {
    let guessInput = document.getElementById('guess-input').value.toUpperCase();
    let statusMessage = document.getElementById('game-status-message');

    // Reconstruct the word from the knight's path
    let boardWord = path.map(index => board[index]).join('');

    attempts++; // Increment the attempts count

    // Check if the guessed word matches the word formed by the knight's path
    if (guessInput === boardWord) {
        statusMessage.textContent = "Correct! Well done!";
        statusMessage.style.color = "green";
    } else {
        statusMessage.textContent = `Incorrect! Try again! Attempts: ${attempts}`;
        statusMessage.style.color = "red";
    }
}

// Function to reveal the correct word when the player gives up
function revealWord() {
    let statusMessage = document.getElementById('game-status-message');
    statusMessage.textContent = `The correct word was: ${currentWord}`;
    statusMessage.style.color = "blue";
}

// Reset the board and input fields
function resetBoard() {
    board = Array(9).fill(null); // Reset the board
    path = []; // Reset the knight's path
    attempts = 0; // Reset the attempts count
    currentWord = '';   
    document.getElementById('guess-input').value = '';
    document.getElementById('game-status-message').textContent = '';
    populateBoard(); // Start a new game
}

// Add an event listener to the guess input to listen for the Enter key
document.getElementById('guess-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        submitGuess();  // Call the submitGuess function when Enter is pressed
    }
});

// Function to handle the submission of a guess
function submitGuess() {
    let guessInput = document.getElementById('guess-input').value.toUpperCase();
    let statusMessage = document.getElementById('game-status-message');

    // Reconstruct the word from the knight's path (assuming path is already defined)
    let boardWord = path.map(index => board[index]).join('');

    attempts++; // Increment the attempts count

    // Check if the guessed word matches the word formed by the knight's path
    if (guessInput === currentWord) {
        statusMessage.textContent = "Correct! Well done!";
        statusMessage.style.color = "green";

        // Clear the input field after correct guess
        document.getElementById('guess-input').value = '';

        // Delay before showing the new word (optional delay for better user experience)
        setTimeout(() => {
            resetBoard();  // Reset the board and load a new word
        }, 1000);  // 1-second delay before resetting the board
    } else {
        statusMessage.textContent = `Incorrect! Try again! Attempts: ${attempts}`;
        statusMessage.style.color = "red";

        // Clear the input field after incorrect guess
        document.getElementById('guess-input').value = '';
    }
}


// Initialize the board when the page loads
window.onload = function() {
    populateBoard();
}

