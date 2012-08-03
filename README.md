fenview
=======

Simple FEN-viewer (chess position notation) jQuery plugin 

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