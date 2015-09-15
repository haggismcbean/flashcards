
TrainingPosition = function() {
  var self = this;

  self.init = function() {
    self.game = new Chess();
    self.moves = new Moves();
    self.config = new BoardConfig(self);
  }

  self.newPosition = function(pgn) {
    self.pgn = pgn;
    self.isFinished = false;
    self.startingFen = findStartingFen();
    self.currentFen = self.startingFen;

    self.game.load_pgn(self.pgn);

    self.moves.newPosition(self.game.history(), self.currentFen);

    self.game.load(self.currentFen);

    self.orientation = toMove();
    
    self.config.newPosition(self.currentFen, self.orientation);
    self.board = ChessBoard('board', self.config);
  }

  function findStartingFen() {
    var sections = self.pgn.split("[");

    for (var i=0; i < sections.length; i++) {
      if (sections[i].indexOf("FEN") > -1) {
        var end = sections[i].indexOf("]") - 4;
        var start = sections[i].indexOf(" ") + 1;

        var fen = sections[i].substr(start, 65);
        return fen;
      }
    }
    return false;
  }

  function toMove() {
    if (self.game.turn() === 'b') {
      return 'black';
    }
    return 'white';
  }

  self.handleDrag = function(source, piece, position, orientation) {
    if (self.game.game_over() === true ||
      (self.game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (self.game.turn() === 'b' && piece.search(/^w/) !== -1) ||
      (self.isFinished)) {
      return false;
    }
    return true
  }

  self.handleDrop = function(source, target) {
    if (!self.makeMove(source, target)){
      return 'snapback';
    }

    var history = self.game.history();
    var index = history.length - 1;
    var currentMove = history[index];

    if (self.moves.isCorrectMove(currentMove)) {
      self.handleCorrectMove()
    } else {
      self.handleWrongMove();
    }
  }

  self.makeMove = function(source, target) {
    var playersGuess = {
      from: source,
      to: target,
      promotion: 'q' // TODO: offer and then handle underpromotion
    }

    var move = self.game.move(playersGuess);
    self.currentFen = self.game.fen();

    if (move === null) {
      return false;
    }

    return true;
  }

  self.handleCorrectMove = function(history, game, numberMoves, correctMove) {
    if (self.moves.isEnd()) {
      self.isFinished = true;
    } else {
      self.makeNextMove();
    }
  }

  self.makeNextMove = function() {
    var nextMove = self.moves.computerReply(self.currentFen);
    self.game.move(nextMove);
    self.moves.saveComputerMoveFen(self.game.fen());
  }

  self.handleWrongMove = function() {
    self.isFinished = true;
  }

  self.onSnapEnd = function() {
    self.board.position(self.game.fen());
  }

  self.init();
}

Moves = function() {
  var self = this;

  self.init = function() {
  }

  self.newPosition = function(history, startingFen) {
    self.moves = [];
    self.history = history;
    self.startingFen = startingFen;
    populateMoves();
  }

  self.currentMove = function() {
    for (var i=0; i < self.moves.length; i++) {
      if (self.moves[i].toGuess) {
        return self.moves[i];
      }
    }
    return false;
  }

  self.isCorrectMove = function(move) {
    var currentMove = self.currentMove();

    if (move === currentMove.action) {
      return true;
    }

    return false;
  }

  self.saveComputerMoveFen = function(fen) {
    for (var i=0; i < self.moves.length; i++) {
      if (self.moves[i].toGuess) {
        self.moves[i-1].fen = fen;
      }
    }
  }

  self.computerReply = function(fen) {
    for (var i=0; i < self.moves.length; i++) {
      if (self.moves[i].toGuess == true) {
        self.moves[i].toGuess = false;
        self.moves[i].fen = fen;

        if (self.moves[i+2]) {
          self.moves[i+2].toGuess = true;
        }

        return self.moves[i+1].action;
      }
    }
    return false;
  }

  self.isEnd = function() {
    var currentMove = self.currentMove();
    var index = self.moves.length - 1;

    if (currentMove === self.moves[index]) {
      return true;
    }

    return false;
  }

  function populateMoves() {
    for (var i=0; i < self.history.length; i++) {

      var move = {
        action: self.history[i],
        toGuess: false,
      }
      self.moves.push(move);
    }

    self.moves[0].toGuess = true;
  }

  self.init();
}

BoardConfig = function(parent) {
  var self = this;

  self.parent = parent;
  self.draggable = true;

  self.newPosition = function(position, orientation) {
    self.position = position;
    self.orientation = orientation;
  }

  self.onDragStart = function(source, piece, position, orientation) {
    return self.parent.handleDrag(source, piece, position, orientation);
  };

  self.onDrop = function(source, target) {
    self.parent.handleDrop(source, target);
  };

  self.onSnapEnd = function() {
    self.parent.onSnapEnd();
  }
}