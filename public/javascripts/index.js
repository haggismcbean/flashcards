//TODO: Retrieve positions from the database
pgn = ['[Event "Casual Game"]',
  '[Site "Berlin GER"]',
  '[Date "1852.??.??"]',
  '[EventDate "?"]',
  '[Round "?"]',
  '[Result "1-0"]',
  '[White "Adolf Anderssen"]',
  '[Black "Jean Dufresne"]',
  '[ECO "C52"]',
  '[WhiteElo "?"]',
  '[BlackElo "?"]',
  '[PlyCount "47"]',
  '[SetUp "1"]',
  '[FEN r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 0 4]',
  '',
  '1.a6 Ba4 2.b5'
];

var pgnString = pgn.join('\n');

var controller = new TrainingPosition();
controller.newPosition(pgnString)

$.ajax({
  type: "GET",
  url: "/api",
  success: function(response) {
    console.log(JSON.stringify(response, 0, 2));
  }
})