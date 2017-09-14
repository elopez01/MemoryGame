//Arrays to store card images	
var imgArray = [
	{
		name: "php",
		img: "Images/php-logo.png"
	},
	{
		name: "css3",
		img: "Images/css3-logo.png"
	},
	{
		name: "html5",
		img: "Images/html5-logo.png"
	},
	{
		name: "jquery",
		img: "Images/jquery-logo.png"
	}, 
	{
		name: "javascript",
		img: "Images/js-logo.png"
	},
	{
		name: "node",
		img: "Images/nodejs-logo.png"
	},
	{
		name: "photoshop",
		img: "Images/photoshop-logo.png"
	},
	{
		name: "python",
		img: "Images/python-logo.png"
	},
];

//Taking initial array of card and doubling
var allCards = $.merge(imgArray, imgArray);

//Setting up the array for the pictures and score
var memory_values = [];
var memory_card_ids = [];
	
//Resetting game
function reset(){
	document.getElementById('main_board').innerHTML = "";
	memory_values = [];
	memory_card_ids = [];
	memory_score = 0;
	count = 0;
	stopTimer();	
	newGame();
}

//Rating system
function rating(attempts){
	$(document).ready(function(){
		if(attempts <= 20){
			$("#star1,#star2,#star3").addClass( "starred" );
		}else if (attempts > 20 && attempts <= 30){
			$("#star1,#star2").addClass( "starred" );										
		}else if (attempts > 30){
			$("#star1").addClass( "starred" );						
		}
	});
}

let timer;		
function gameTimer(){
	var startTime = new Date().getTime();

	// Update the timer every second
	timer = setInterval(function() {

		let now = new Date().getTime();
		// Find the time elapsed between now and start
		let elapsed = now - startTime;

		// Calculate minutes and seconds
		let minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
		let seconds = Math.floor((elapsed % (1000 * 60)) / 1000);

		// Add starting 0 if seconds < 10
		if (seconds < 10) {
			seconds = "0" + seconds;
		}
		let currentTime = minutes + ':' + seconds;

		// Update clock on game screen and modal
		$(document).ready(function(){
			$(".clock").text(currentTime);
		});
	}, 0);
}


function stopTimer(){
	clearInterval(timer);
	$(document).ready(function(){
		$(".clock").text("0:00");
	});
}

//Adding shuffle function to Array 
Array.prototype.card_shuffle = function(){
	let i = this.length, j, temp;
	while(--i > 0){
		j = Math.floor(Math.random() * (i+1));
		temp = this[j];
		this[j] = this[i];
		this[i] = temp;
	}
};

//Modal Logic to display or not display...
function showModal(){		
	let overlay = $(".modal-overlay");
	let modal = $(".modal");
	overlay.show();
	modal.fadeIn("slow");
}
function hideModal(){	
	let overlay = $(".modal-overlay");
	let modal = $(".modal");
	overlay.hide();
	modal.hide();
}
		
//Keeping track of scores
let memory_score = 0;
function attempts(){
	memory_score += 1;
	let starRating = '<div><ul id="ratecv"><li id="star1" class="star"></li><li id="star2" class="star"></li><li id="star3" class="star"></li></li></ul></div>';			
	let general_timer = '<div>Time: <span class="clock">0:00</span></div>';
	let game_attempts = '<div id="attempts">Number of attempts: '+'<span class="score">0</span>'+general_timer+starRating+'<div class="btn btn-default btn-sm btn btn-info btn-lg" onclick="reset()" style="margin-left: 20px;"> Reset </div></div>';
	let win_attempts = '<div id="attempts">Number of attempts: '+memory_score+general_timer+starRating+'</div>';
	$(document).ready(function(){
		$(".score").text(memory_score);
		rating(memory_score);
	});
	document.getElementById('counter').innerHTML = game_attempts;
	document.getElementById('number_of_tries').innerHTML = win_attempts;
}

//Generating a new board and looping through to dynamically add the inner divs and setting/resetting score
function newGame(){
	let memory_score = 0;
	let cards_flipped = 0;
	let count = 0;
	let card_output = '';
	let starRating = '<div><ul id="ratecv"><li id="star1" class="star"></li><li id="star2" class="star"></li><li id="star3" class="star"></li></li></ul></div>';			
	let general_timer = '<div>Time: <span class="clock">0:00</span></div>';
	let header = '<div id="header_title"><h1>Memory Game</h1></div>';
	let num_attempts = '<div id="attempts">Number of attempts: '+'<span class="score">0</span>'+general_timer+starRating+'<div class="btn btn-default btn-sm btn btn-info btn-lg" onclick="reset()" style="margin-left: 20px;"> Reset </div></div>';
	rating(memory_score);
	allCards.card_shuffle();
	hideModal();
	//Inputting html into divs - Splitting to create rows for Bootstap fluid
	for(var i = 0; i < allCards.length; i++){
		if(i%4==0){
			card_output += '</div><div class="row"><div id="card_'+i+'" onclick="memoryFlipCard(this,\''+allCards[i].img+'\')" class="col-xs-3"></div>';
		}else{
			card_output += '<div id="card_'+i+'" onclick="memoryFlipCard(this,\''+allCards[i].img+'\')" class="col-xs-3"></div>';
		}
	}
	document.getElementById('header').innerHTML = header;
	document.getElementById('counter').innerHTML = num_attempts;			
	document.getElementById('main_board').innerHTML = card_output;
}

//Logic to flip the card
let count = 0;
let cards_flipped = 0;
function memoryFlipCard(card,val){
	count += 1;
	if(count <= 1){
		gameTimer();
	}
	if(card.innerHTML == "" && memory_values.length < 2){
		card.style.background = '#FFF';
		card.innerHTML = '<img src='+val+'\>';
		if(memory_values.length == 0){
			memory_values.push(val);
			memory_card_ids.push(card.id);
		} else if(memory_values.length == 1){
			memory_values.push(val);
			memory_card_ids.push(card.id);
			if(memory_values[0] == memory_values[1]){
				cards_flipped += 2;
				memory_values = [];
				memory_card_ids = [];
				attempts();
				// Winning the game
				if(cards_flipped == allCards.length){
					clearInterval(timer);
					showModal();
				}
			} else {
				//If an incorrect flip happens flip cards back 
				function flipCard(){
					var card_1 = document.getElementById(memory_card_ids[0]);
					var card_2 = document.getElementById(memory_card_ids[1]);
					card_1.style.background = 'url(images/codepen-logo.png) no-repeat';
					card_1.style.backgroundSize = '71px 71px';
					card_1.innerHTML = "";
					card_2.style.background = 'url(images/codepen-logo.png) no-repeat';
					card_2.style.backgroundSize = '71px 71px';							
					card_2.innerHTML = "";
					// Clear both arrays
					memory_values = [];
					memory_card_ids = [];
					attempts();							
				}
				setTimeout(flipCard, 500);
			}
		}
	}
}