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
			deck = chessPositions[i];
		}
	}
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
			controller.isBrowseMode = true;
			showBrowser();
		})
	}
}

function showBrowser() {
	$(".position-entry").hide();
	$(".edit-position").hide();
	$(".browse-position").show();
	$(".next").click(handleNext);
	$(".previous").click(handlePrevious);
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