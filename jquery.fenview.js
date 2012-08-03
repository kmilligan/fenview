/**
* Simple FEN viewer jQuery plugin.
*
* Usage: $('#somediv').fenview();
*
*@author Kurt Milligan
*/
(function($)
{
	/**
	* Main fn to start up the module
	*/
	$.fenview = function(element, options)
	{
		// get our default options going
		this.options = $.extend({}, $.fenview.defaultOptions, options);
		
		// setup our main object
		var board = Object.create(Board).init(element);
		board.createDisplay();

		// starting FEN
		board.setFEN(this.options.fen);
	
		// attach so they can do stuff from the outside
		element[0].getBoard = function()
		{
			return board;
		}

		// ...and catch resize events
		$(window).resize(function()
		{
			board.autosetHeight();
		});
	}

	/**
	* So we can be chained...
	*/
	$.fn.fenview = function(options)
	{
		return this.each(function()
		{
			// TODO: understand the outer parens here.
			(new $.fenview($(this), options));
		});
	};

	/**
	* Defaults
	*/
	$.fenview.defaultOptions = 
	{
		fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
	}

	/**
	* Map of pieces to unicode characters
	*/
	var Pieces =
	{
		'R': '\u2656',
		'N': '\u2658',
		'B': '\u2657',
		'Q': '\u2655',
		'K': '\u2654',
		'P': '\u2659',
		'r': '\u265c',
		'n': '\u265e',
		'b': '\u265d',
		'q': '\u265b',
		'k': '\u265a',
		'p': '\u265f',
	};
	
	/**
	* Object representing a specific, single square on the board.
	*/
	var Square = 
	{
		fileMap: 
		{
			'1': 'a',
			'2': 'b',
			'3': 'c',
			'4': 'd',
			'5': 'e',
			'6': 'f',
			'7': 'g',
			'8': 'h'
		}
	};

	/**
	* Setup; determine our color, add click handlers
	*/
	Square.init = function(board, file, rank)
	{
		this.board = board;
		this.file = file;
		this.rank = rank;
		this.color = 0;
		this.name = this.fileMap[file] + rank; 

		// figure out our color
		var fileEven = (file % 2 == 0);
		var fileOdd = !fileEven;
		var rankEven = (rank % 2 == 0);
		var rankOdd = !rankEven;
		if((fileOdd && rankEven)
			|| (fileEven && rankOdd))
			this.color = 1;
	
		this.element = $('<div class="fenview-square fenview-squared">&nbsp;</div>');
		this.element.square = this;
		this.element.attr('rel', this.name);
		this.element.addClass(this.color?'fenview-light-square':'fenview-dark-square');

		// setup clickies
		var that = this;
		this.element.click(function()
		{
			that.board.clickSquare(that);
		});

		return this;
	}

	Square.setPiece = function(piece)
	{
		this.element.html(piece);
	}

	Square.getPiece = function()
	{
		return this.element.html();
	}

	Square.hasPiece = function()
	{
		return this.element.html() != '&nbsp;';
	}
	
	Square.removePiece = function()
	{
		var tmp = this.element.html();
		this.setPiece('&nbsp;');
		return tmp;	
	}

	Square.lite = function()
	{
		this.element.addClass('square-lit');
	}
	
	Square.unlite = function()
	{
		this.element.removeClass('square-lit');
	}

	Square.getElement = function()
	{
		return this.element;
	}


	/**
	* Object representing the chess board itself;
	* contains Squares, and various helper fn's to set the state
	*/
	var Board = {};	
	Board.init = function(element)
	{
		this.element = element;

		// need to track our board uniquely
		// for sizing purposes
		this.id = 'board' + Math.floor(Math.random() * 1000000);
		this.element.addClass(this.id);

		// initialize our Squares
		this.squares = [];
		for(var f = 1; f < 9; f++)
		{
			for(var r = 1; r < 9; r++)
			{
				// allocate our array
				if(r == 1)
					this.squares[f] = [];
				this.squares[f][r] = Object.create(Square).init(this, f,r);
			}
		}

		return this;
	}

	/**
	* create the actual display for the board
	*/
	Board.createDisplay = function()
	{
		for(var r = 8; r > 0; r--)
		{
			// container div for each rank
			// to keep things from spilling
			var rank = $('<div class="fenview-rank" rel="' + r + '"></div>');

			for(var f = 1; f < 9; f++)
			{
				rank.append(this.squares[f][r].getElement());
			}
			
			this.element.append(rank);
		}

		// need to set the height of our ranks automagically
		// unless they told us not too.
		this.autosetHeight();
	}

	Board.autosetHeight = function()
	{
		var width = this.squares[1][1].getElement().width();	

		// setup our dynamic css
		if(typeof this.dynCSS == 'undefined')
		{
			this.dynCSS = document.createElement('style');
			document.head.appendChild(this.dynCSS);
		}	

		var rule = '.' + this.id +
					' .fenview-square { font-size: ' 
						+ Math.ceil(width * 0.83) 
						+ 'px; } '; // no space!

		this.dynCSS.innerHTML = rule;
	}

	Board.placePiece = function(piece, file, rank)
	{
		this.squares[file][rank].setPiece(Pieces[piece]);
	}
	
	Board.clearPiece = function(file, rank)
	{
		this.squares[file][rank].removePiece();
	}

	Board.setFEN = function(fen)
	{
		ranks = fen.split('/');
		for(var rank = 8; rank > 0; rank--)
		{
			this.setRankFEN(rank, ranks[8 - rank]);	
		}
	}
	
	Board.setRankFEN = function(rank, fen)
	{
		var sqs = fen.split('');
		file = 1;
		for(var idx in sqs)
		{
			// may have reached the end
			if(file > 8 || sqs[idx] == ' ')
				break;

			if(Pieces[sqs[idx]])
			{
				this.placePiece(sqs[idx], file, rank);
				file++;
			}
			else
			{
				// numeric. spaces.
				while(sqs[idx] > 0)
				{
					this.clearPiece(file, rank);
					sqs[idx]--;
					file++;
				}
			}
		}
	}

	Board.clickSquare = function(square)
	{
		if(this.lastClicked)
			this.lastClicked.unlite();
		
		if(this.lastClicked
			&& this.lastClicked.hasPiece())
		{
			var movingPiece = this.lastClicked.removePiece();
			square.setPiece(movingPiece);		
			this.lastClicked = null;
		}	
		else
		{
			square.lite();
			this.lastClicked = square;
		}
	}
})(jQuery);
