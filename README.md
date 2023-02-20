# hexcabulary

A game hiding vocabulary words in a hexagonal matrix using classic and novel strategies. 
The basic rule is that letters must be in adjacent cells, but not necessarily in a line. 
Hide strategies might be simple/classic linear (using any of the six sides of the hexagon). 
More complicated approaches might be snake (non-linear winding of letters provided they are adjacent)
and words can cross the edge of the board, and continue from the other side of the board.

This is a puzzle concept I've been wanting to prototype for sometime now. Between 2021 to 2023, I've been making some steady progress. The game is now basically playable (the example site is at https://hexcabulary.netlify.com). It features some interesting visual quirks and animations to hopefully make it appealing/entertaining; a basic edit mode that can be used to start creating static puzzles. 

It is still a work in progress, so it's possible breaking changes may still be needed. 

TODO:
- [X] Matrix
- [X] Rudimentary example list
- [X] UI/IO
- [X] Win/Lose system
- [ ] Hide algorithms
- [X] Edit/Play mode toggle
- [X] Export game board data (to use in your own custom game instance)
- [ ] ...what else?

2023 - algorithms for hiding words during game play, so a game type of "single-random" 
    can choose a word from a puzzle list and hide it using a schema appropriate to the 
    difficulty level for the puzzle author or player.

2022 - revisited sorting out various todos (see github commit log as needed)
    Sorted out static puzzles and created a few examples illustrating strategies 
    for hiding words such as linear, snake, and crossing board boundaries.

2/21/21 - 
    broke out single hex shape as svg
    broke out board, style css, and javascript to generate matrix
    added play button

8/22/21 - 
    convert legacy JS approach to ES class approach
    support passing instance, container, and game board data to constructor
    add play bar buttons
    edit mode to allow user to modify the letters in the grid visually
    export game board data feature


Steps to build the project. 

0) IDE/dev tools
1) Git project init
2) File structure
3) Base assets (index, library, graphics, colors)
4) Build the board matrix
5) Populate the board with data
6) Decouple data from the board
    -needed to preserve puzzles we want to reuse or offer for others to play
    -needed to help determine win/lose
7) Play mechanics
    -mobile-web friendly
    -browser friendly
8) ???
    -scoring?
    -time out?
    -levels?
    -packaging for distribution?
    -hosting and seo?
    -monetization?
    -sequel?

Discussing false-starts:
    One problem I ran into is that I was using absolute positioned DIVs for the hex cells, but the size of the DIV didn't fully line up with the hexagon. 
    This meant the user clicks would only select the cell for part of the cell... and outside of that boundary, would select an adjacent cell instead. 
    I haven't solved this yet, but anticipate changing the DIV to a canvas so I can get better granularity on the hexagon shape as the hot zone for clicks.