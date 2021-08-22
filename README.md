# hexcabulary

## Vocabulary words in a hexagonal matrix. 

I've been wanting to create a word search game using a hexagonal matrix for years--this is a stab at progressing that intent to the next waypoint in its journey.

TODO:
- [X] Matrix
- [ ] Rudimentary example list
- [ ] UI/IO
- [ ] Win/Lose system
- [ ] Hide algorithms
- [X] Edit/Play mode toggle
- [X] Export game board data (to use in your own custom game instance)
- [ ] ...what else?



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