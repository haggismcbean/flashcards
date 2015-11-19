Browser = function() {
  Browser.baseConstructor.call( this );
  this.init();
};

Inheritance_Manager.extend( Browser, Flashcard );

Browser.prototype.browseNext = function() {
	var nextMove = this.moves.browseNext(this.currentFen);
	this.game.move(nextMove);
	this.board.position(this.game.fen());
};

Browser.prototype.browsePrevious = function() {
  this.moves.browsePrevious(this.currentFen);
  this.game.undo();
  this.board.position(this.game.fen());
};

Browser.prototype.handleDrag = function() {
  return false;
};
