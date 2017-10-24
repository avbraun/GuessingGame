function generateWinningNumber(){
    return Math.floor(Math.random() * 100 + 1);
}

function shuffle(arr){
    for(var i = arr.length-1; i >= 0; i--){
        var randomIndex = Math.ceil(Math.random() * arr.length-1);
        var temp = arr[randomIndex];
        if(i === 0){
            return arr;
        }
        arr[randomIndex] = arr[i];
        arr[i] = temp;
    }
}

function Game(){
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function(){
    return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function(){
    return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function(guess){
    if(typeof guess !== 'number' || !guess || guess < 1 || guess > 100){
        $('h3').text("That won't work. Try again!");
    } else {
        this.playersGuess = guess;
        return this.checkGuess();
    }
}

Game.prototype.checkGuess = function(){
    if(this.pastGuesses.includes(this.playersGuess)){
        $('h3').text("Already guessed that one. Try again!");
    } else {
        this.pastGuesses.push(this.playersGuess);
        $('#guesses li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);
        if(this.playersGuess === this.winningNumber){   
            $('#submit, #hint').prop('disabled', true);
            $('h1').text("You Win!");
            $('h3').text("Try your luck again by clicking the reset button!");
        } else if(this.pastGuesses.length === 5){
            $('#submit, #hint').prop('disabled', true);
            $('h1').text("You Lose.");
            $('h3').text("Too bad. Click the reset button to play again!");
        } else if(this.difference() < 10){
            $('h3').text("You're burning up!");
        } else if(this.difference() < 25){
            $('h3').text("You're lukewarm.");
        } else if(this.difference() < 50){
            $('h3').text("You're a bit chilly.");
        } else if(this.difference() < 100){
            $('h3').text("Yikes. Not even close.");
        }
    };
}

function newGame(){
    return new Game();
}

Game.prototype.provideHint = function(){
    var hint = shuffle([generateWinningNumber(), generateWinningNumber(), this.winningNumber]);
    $('h3').text('Hmm... it could be ' + hint[0] + ', ' + hint[1] + ', or ' + hint[2] + '...');
}

function makeAGuess(game){
    var guess = +$('#input').val();
    $('#input').val('');
    var output = game.playersGuessSubmission(guess);
}

$(document).ready(function() {
    var newGame = new Game();
    $('#submit').click(function(){
        makeAGuess(newGame);
    });
    $('#input').keypress(function(event){
        if(event.which == 13){
            makeAGuess(newGame);
        }
    });
    $('#reset').click(function(){
        newGame = new Game();
        $('h1').text('Guessing Game');
        $('h3').text('Pick a number between 1 and 100');
        $('.guess').text('?');
        $('#submit, #hint').prop('disabled', false);
    });
    $('#hint').click(function(){
        newGame.provideHint();
    });
})

