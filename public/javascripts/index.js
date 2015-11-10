$.ajax({
  type: "GET",
  url: "/api",
  success: function(response) {
    decks = response;
    setUpPosition(decks);
  }
})

var deck;
var pgn;
var controller;

function setUpPosition(decks) {
  deck = new Deck("55ca3159f6394e5ab97e833d", decks);

  pgn = deck.findNext();

  controller = new TrainingPosition();
  controller.newPosition(pgn);
}

function Deck(id, decks) {
  var self = this;
  self.id = id;
  self.decks = decks;
  self.count = 0;
  
  //PUBLIC FUNCITONS

  self.init = function() {
    var deck = findDeck();
    self.name = deck.name;
    self.pile1 = deck["pile1[]"];
    self.pile2 = deck["pile2[]"];
    self.pile3 = deck["pile3[]"];
    self.pile4 = deck["pile4[]"];
    self.pile5 = deck["pile5[]"];
    self.pile6 = deck["pile6[]"];
  }

  self.findNext = function() {
    self.count++;
    return self.pile1[self.count - 1];
  }

  self.init();

  //PRIVATE FUNCTIONS

  function findDeck() {
    for (var i=0; i < self.decks.length; i++) {
      if (decks[i]["_id"] === self.id) {
        return decks[i];
      }
    }
  }
}

$(".next").click(function(e) {
  e.preventDefault();
  console.log("HERE" + JSON.stringify(deck, 0, 2));
  pgn = deck.findNext();
  controller.newPosition(pgn);
  $(".feedback").text(" ");
});
