var chessPositions;

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
}