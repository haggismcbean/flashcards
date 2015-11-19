var chessPositions;

$.ajax({
  type: "GET",
  url: "/api",
  success: function(response) {
    chessPositions = response;
    populateDecksList(chessPositions);
  }
})

$(".position-entry").hide();
$(".edit-position").hide();
$(".browse-position").hide();
$("#board").hide();
$(".new").click(handleNew);

function populateDecksList(chessPositions) {
	for (var i=0; i < chessPositions.length; i++) {
		$(".decks-list").append("<li class='deck' id='" + chessPositions[i]["_id"] + "'><a href=''> " + chessPositions[i]["name"] + "</a></li>");
		var $deck = $("#" + chessPositions[i]["_id"]);
		$deck.click(function(e) {
			e.preventDefault();
			var id = $(this).attr("id");
			setDeck(id);
			console.log(JSON.stringify(deck, 0, 2));
		})
	}
}

function setDeck(id) {
	for (var i=0; i < chessPositions.length; i++) {
		if (chessPositions[i]["_id"] === id) {
			if (deck) {
				deck.id = id;
				deck.init();
			} else{
				deck = chessPositions[i];
			}
		}
	}
	$("#board").show();
	populatePositionList(deck);
}

function populatePositionList(deck) {
	var positions = [];
	for (var i=1; i < 7; i++) {
		getPositions(deck["pile" + i + "[]"]);
	}
}

function getPositions(pile) {
// 	console.log("pile: " + JSON.stringify(pile, 0, 2));
	for (var i=0; i < pile.length; i++) {
		$(".positions-list").append("<li class='position' id='position-" + i + "'><span>" + i + "</span></li>")
		var $position = $("#position-" + i);
		$position.click(function(e) {
			e.preventDefault();
			var id = $(this).attr("id").replace("position-", "");
			var pgn = pile[id];
			controller.newPosition(pgn);
			showBrowser();
		})
	}
}

var isSetClickHandlers = false;

function showBrowser() {
	$(".position-entry").hide();
	$(".edit-position").hide();
	$(".browse-position").show();
	if (!isSetClickHandlers) {
		$(".next").click(handleNext);
		$(".previous").click(handlePrevious);
		isSetClickHandlers = true;
	}
}

function handleNext(e) {
	e.preventDefault();
	controller.browseNext();
}

function handlePrevious(e) {
	e.preventDefault();
	controller.browsePrevious();
	console.log("preivou clicked")
}

function handleNew(e) {
	e.preventDefault();
	$(".position-entry").show();
	$(".edit-position").hide();
	$(".browse-position").hide();
	var pgn = "[FEN rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1]"
	controller.newPosition(pgn);
}