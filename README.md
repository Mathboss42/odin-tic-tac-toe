Project: Tic-Tac-Toe

Objective: Recreat Tic-Tac-Toe game in JS.



## Version 1: Two players are going to play against one another.

Pseudo-code: 

Press play button to start game;
{Player 1 clicks on board cell;
Game saves gameboard status (with marker location);
Game checks for potential win;
Game updates board display;
Player 2 clicks on board cell;
Game saves gameboard status (with marker location);
Game checks for potential win;
Game updates board};
=> repeat until check for win returns true or if no more available space on board (=tie);
display final result (player who won, or tie) and display quit to main menu and restart buttons;






check for win:
check array indexes of same value, eg: check if all y=2 have the same marker,

[ , x=1, ]
[ , x=1, ]
[ y=2, x=1 y=2, y=2]

and then add special cases for diagonals