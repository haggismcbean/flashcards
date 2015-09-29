$.ajax({
  type: "GET",
  url: "/api",
  success: function(response) {
    decks = response;
    setUpPosition(decks);
  }
})

function setUpPosition(decks) {
  //TODO: Retrieve positions from the database
  // pgn = ['[Event "Casual Game"]',
  //   '[Site "Berlin GER"]',
  //   '[Date "1852.??.??"]',
  //   '[EventDate "?"]',
  //   '[Round "?"]',
  //   '[Result "1-0"]',
  //   '[White "Adolf Anderssen"]',
  //   '[Black "Jean Dufresne"]',
  //   '[ECO "C52"]',
  //   '[WhiteElo "?"]',
  //   '[BlackElo "?"]',
  //   '[PlyCount "47"]',
  //   '[SetUp "1"]',
  //   '[FEN r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 0 4]',
  //   '',
  //   '1.a6 Ba4 2.b5'
  // ];

  // var deck = findDeck("55ca3159f6394e5ab97e833d", decks);
  // var pgn = findPgn()
  
  var deck = new Deck("55ca3159f6394e5ab97e833d", decks);

  var pgn = deck.findNext();

  var controller = new TrainingPosition();
  controller.newPosition(pgn)
}

function Deck(id, decks) {
  var self = this;
  self.id = id;
  self.decks = decks;
  
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
    console.log(JSON.stringify(self, 0, 2));
    return self.pile1[0];
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