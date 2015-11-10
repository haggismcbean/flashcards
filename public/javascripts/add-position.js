var controller = new TrainingPosition();
var pgn;
var deck;

var pgn = "[FEN rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1]"
controller.newPosition(pgn);

$(".pgn").bind("input", function(){
  pgn = $(this).val();
  controller.newPosition(pgn);
})

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
