var controller = new TrainingPosition();
var pgn;
var chessPositions;
var deck;


$(".pgn").bind("input", function(){
  pgn = $(this).val();
  controller.newPosition(pgn);
})


function isArray(testSubject) {
	if (testSubject.constructor.toString().indexOf('Array') == -1) {
		return false;
	} else {
		return true;
	}
}

$(".submit").click(function(e) {
	if (typeof deck["pile1[]"] === "object") {
		console.log("object");
		deck["pile1[]"].push(pgn);
	} else if (typeof deck["pile1[]"] === "string" && deck["pile1[]"].length > 0) {
		console.log("string");
		deck["pile1[]"] = [deck["pile1[]"], pgn]
	} else {
		console.log("empty");
		deck["pile1[]"] = pgn
	}

	var id = deck["_id"];
	delete deck["_id"];


	$.ajax({
	  type: "PUT",
	  url: "/api/" + id,
	  data: deck,
	  success: function(response) {
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
		}
	}
}