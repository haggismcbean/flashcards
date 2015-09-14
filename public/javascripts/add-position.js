var controller = new TrainingPosition();
var pgn;
var chessPositions;
var deck;


$(".pgn").bind("input", function(){
  pgn = $(this).val();
  controller.newPosition(pgn);
})

$(".submit").click(function(e) {
	console.log("TODO - save data");
	deck["pile1"].push(pgn);

	console.log(JSON.stringify(deck, 0, 2));

	var id = deck["_id"];
	delete deck["_id"];

	$.ajax({
	  type: "PUT",
	  url: "/api/" + id,
	  data: deck,
	  success: function(response) {
	    console.log(JSON.stringify(response, 0, 2));
	  }
	})
})

$.ajax({
  type: "GET",
  url: "/api",
  success: function(response) {
    chessPositions = response;
    populateDecksList(chessPositions);
  }
})

function populateDecksList(chessPositions) {
	for (var i=0; i < chessPositions.length; i++) {
		$(".decks-list").append("<li class='deck' id='" + chessPositions[i]["_id"] + "'> " + chessPositions[i]["name"] + "</li>");
		var $deck = $("#" + chessPositions[i]["_id"]);
		$deck.click(function(e) {
			var id = $(this).attr("id");
			setDeck(id);
		})
	}
}

function setDeck(id) {
	for (var i=0; i < chessPositions.length; i++) {
		if (chessPositions[i]["_id"] === id) {
			deck = chessPositions[i];
			console.log(JSON.stringify(deck, 0, 2));
		}
	}

}