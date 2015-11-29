fenview
=======

Simple FEN-viewer (chess position notation) jQuery plugin 

DEPRECATED
----------

This project has been superseded by [chessn00b](https://github.com/kmilligan/chessn00b) -- you should look at that instead.

WTF is FEN?
-----------

[FEN](http://en.wikipedia.org/wiki/FEN) is a method of describing a given chess position.
For example:

    rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1

describes the starting position for classical chess.

Usage
-----

This plugin allows you to add one or more chess boards to a web page, and set their position using FEN.

Simple usage, assuming you 
*  have jQuery already included someplace else
*  an empty div on your page someplace with class="board"

is to add the following to your html head:

    <script src="jquery.fenview.js" type="text/javascript"></script>    
    <link rel="stylesheet" type="text/css" href="jquery.fenview.css" />
    <script type='text/javascript'>
        $(document).ready(function()
        {
            $('.board').fenview();
        });
    </script>
    
If you want to set the FEN to something other than the typical starting position, you can do this instead:

	$('.board').fenview({ fen: "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2" });

And if you want to set the FEN on a given board after it's already been set up:

	$('.board').data('fenview').setFEN("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1");

Notes
-----

*   fenview's board will fill the witdth of the container it is attached to, and automatically set the height of the board accordingly. If the container is resized, the board will attempt to resize.
*   You can move pieces on the fenview board by clicking on the piece, then clicking on the destination square. fenview does *not* check for move legality at this point.
