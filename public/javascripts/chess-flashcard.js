Inheritance_Manager = {};

Inheritance_Manager.extend = function (subClass, baseClass) {
	function inheritance() { }
	inheritance.prototype = baseClass.prototype;
	subClass.prototype = new inheritance();
	subClass.prototype.constructor = subClass;
	subClass.baseConstructor = baseClass;
	subClass.superClass = baseClass.prototype;
};


Flashcard = function () {};

Flashcard.prototype = {
	init: function () {
		this.game = new Chess();
		this.moves = new Moves();
    this.config = new BoardConfig(this);
	},

	newPosition: function(pgn) {
		this.init();

		this.pgn = pgn;
    this.isFinished = false;
    this.startingFen = this.findStartingFen();
    this.currentFen = this.startingFen;

    this.game.load_pgn(this.pgn);

    this.moves.newPosition(this.game.history(), this.currentFen);

    this.game.load(this.currentFen);

    this.orientation = this.toMove();
    
    this.config.newPosition(this.currentFen, this.orientation);
    this.board = ChessBoard('board', this.config);
	},

	findStartingFen: function() {
		var sections = this.pgn.split("]");

    for (var i=0; i < sections.length; i++) {
      if (sections[i].indexOf("FEN") > -1) {
        var start = sections[i].indexOf(" ") + 1;

        var fen = sections[i].substr(start);
        return fen;
      }
    }
    return false;
	},

	toMove: function() {
    if (this.game.turn() === 'b') {
      return 'black';
    }
    return 'white';
  },

  handleDrag: function(source, piece, position, orientation) {
    if (this.game.game_over() === true ||
      (this.game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (this.game.turn() === 'b' && piece.search(/^w/) !== -1) ||
      (this.isFinished)) {
      return false;
    }
    return true
  },

  handleDrop: function(source, target) {
    if (!this.makeMove(source, target)){
      return 'snapback';
    }

    var history = this.game.history();
    var index = history.length - 1;
    var currentMove = history[index];

    if (this.moves.isCorrectMove(currentMove)) {
      this.handleCorrectMove()
    } else {
      this.handleWrongMove();
    }
  },

  makeMove: function(source, target) {
    var playersGuess = {
      from: source,
      to: target,
      promotion: 'q' // TODO: offer and then handle underpromotion
    }

    var move = this.game.move(playersGuess);
    this.currentFen = this.game.fen();

    if (move === null) {
      return false;
    }

    return true;
  },

  handleCorrectMove: function(history, game, numberMoves, correctMove) {
    if (this.moves.isEnd()) {
      this.isFinished = true;
      $(".feedback").text("Correct");
    } else {
      this.makeNextMove();
    }
  },

  makeNextMove: function() {
    var nextMove = this.moves.computerReply(this.currentFen);

    this.game.move(nextMove);
    this.moves.saveComputerMoveFen(this.game.fen());
  },

  handleWrongMove: function() {
    this.isFinished = true;
    $(".feedback").text("Wrong");
  },

  onSnapEnd: function() {
    this.board.position(this.game.fen());
  }
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

  self.browseNext = function(fen) {
    for (var i=0; i < self.moves.length; i++) {
      if (self.moves[i].toGuess == true) {
        if (self.moves[i+1]) {
          self.moves[i].toGuess = false;
          self.moves[i].fen = fen;
          self.moves[i+1].toGuess = true;
        }
        return self.moves[i].action;
      }
    }
    return false;  
  }

  self.browsePrevious = function(fen) {
    for (var i=0; i < self.moves.length; i++) {
      if (self.moves[i].toGuess == true) {
        if (self.moves[i-1]) {
          self.moves[i].toGuess = false;
          self.moves[i].fen = fen;
          self.moves[i-1].toGuess = true;
        }
        return true;
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

    if (self.moves[0]) {
      self.moves[0].toGuess = true;
    }
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
