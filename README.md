# OCR Micro NEA Project Countdown - Numbers game

## Analysis

### Description

Number game is a mode in countdown where 6 influenced but random numbers are picked aswell as a target to form out of these numbers and the 4 basic operators. The contestants then have 30s to figure out how to get to the target before the gm will ask each contestant what their answer and calculation was. People who get the target gets points, close numbers get awarded less points.

#### Pool of numbers
The pool of numbers in countdown is made of 2 sets: big and small.  
The big set contains `25, 50, 75, 100`  
The small set contains `1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10`  
Once the set is exhausted (only applicable for big numbers), no more can be added

#### Target
The target is generated with all available numbers and at no point can be negative, or a fraction. This doesn't apply to the users as they can do anything with the basic operations as long as they get to the target

#### Scoring
At the end of the round each player will show their answer. Here are the scores
| Difference | Points awarded |
| --- | --- |
| 0 | 10 |
| 1-5 | 7 |
| 6-10 | 5 |
| 11+ | 0 |

### Abstractions

Single player
* This game is single player, and except for the potential inclusion of a leaderboard, there is no interaction between players
* This also means that only one set of inputs and outputs must be made

No music
* For the most part there will be no music or sound effects as that would break copyright

### Decomposition

1. Let the user pick an array of 6 big or small numbers
2. Pick / Calculate a target
3. Wait 30 seconds
4. Get solution
5. Evaluate solution
6. Award points
7. Set / Show leaderboard
8. Restart

#### Diagram

Countdown
> Clock
> > 30 Timer
> 
> Numbers
> > Buttons
> > > Add big number
> > > Add small number
> > > Add rest of numbers with randoms
> > > 
> > Number pool (big/small)
> > 
> Target
> > Target picking
> > Target checking
> > Point awarding
> > 
> Player
> > Score
> > Leaderboard
> > > Name
> > > 
> > Input
> > > Input sanitization
> > > Input evaluation
> > > 

### Succsess Critera
| ID | Name | Description |
| --- | --- | --- |
| 0 | Numbers are picked succsessfully | It is important to stick correctly to the rules of the game to be faithfull to the original |

## Design

### Classes

#### Game
Stores the current game data
##### Attributes
| Name | Actuall Name | Default | Description |
| --- | --- | --- | --- |
| Big Numbers | `numsbig` | `[ 25, 50, 75, 100 ]` | The set of unused big numbers |
| Small Numbers | `numssmall` | `[ 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10 ]` | The set of unused small numbers |
| Number | `num` | undefined | The current guess by the player |
| Numbers | `nums` | `[]` | The current set of numbers |
| Target | `target` | `undefined` | The current target |
| Elements | `els` | `undefined` | The (optional) set of elements to use to display / animate information for this object |
| Running | `running` | `false` | Whether the clock and by proxy game is running |
| Points | `pts` | `0` | Points the player has |
##### Methods
| Name | Definition | Description |
| --- | --- | --- |
| Constructor | `constructor(*els: Array<Element>) => Game()` | Create the class and optionally define Elements update UI |
| Reset | `reset() => undefined` | N/A | Reset the class (used in constructor) and UI (if Elements is defined) |
| Add number | `numsadd(type: BIG || SMALL) => Number` | Add either a `BIG` or `SMALL` number and add to UI (if Elements is defined) |
| Add random numbers | `numsrand() => undefined` | Fill the rest of the available numbers and add to UI (if Elements is defined) |
| New target | `targetnew() => Number` | Finds a new target and adds to UI (if Elements is defined) |
| Start | `async start() => Promise(undefined)` | Starts a 30s clock and updates UI (if Elements is defined), called by New Target |
| Stop | `async start() => Promise(undefined)` | Ends the current game and adds points, and updates UI (if Elements is defined), called by Start |
| Add Points | `async ptsadd(pts: Number) => Promise(undefined)` | Adds point and updates UI (if Elements is defined), called by Stop |
### UI

### Coloring / Styling
The colors where picked by looking at screenshots of the game show and can be changed in the `index.css`
| Name | Variable Name | Value | Description |
| --- | --- | --- | --- |
| Paper Size | `--paper-size` | `50px` | Size of each line on paper |
| Paper Margin | `--paper-margin` | `100px` | The margin on the left side of the paper |
| Paper Padding | `--paper-padding` | `10px` | The padding around the usable size of the paper |
| Paper Highlight | `--paper-hl` | `red` | Color of vertical margin line |
| Paper Foreground | `--paper-fg` | `#444` | Color of text on paper |
| Paper Midground | `--paper-mg` | `#cde7ec` | Color of horizontal lines on paper |
| Paper Background | `--paper-bg` | `#fef8f1` | Background color of paper |
| Game Highlight | `--game-hl` | `#fa0` | Color of highlighted numbers |
| Game Foreground | `--game-fg` | `white` | Main color of game |
| Game Midground | `--game-mg` | `#43ec1` | Subdominant background color |
| Game Background | `--game-bg` | `#377c1` | Main background color |
| Clock Highlight | `--clock-hl` | `rgba(240, 255, 80,0.5)` | Color of highlighted background behind the hand |
| Clock Background | `--clock-bg` | `#fffbf` | Clock background color |
| Clock Midground | `--clock-mg` | `#a50` | Color of clock border |
| Clock Foreground | `--clock-fg` | `black` | Color of clock notches |
| Clock Hand | `--clock-hand` | `#45f` | Color of clock hand |
### Overview
The UI is nonscalable using flexbox to roughly position the main elements into a 3 teired system  
#### Top
Clock centered in middle  
Points in top left
#### Middle
The info bar popped out from the background using background and box shadow  
Contains The numbers and target
#### Bottom
Made of two sections which slide in and out  
The paper, and the add numbers buttons

### Components
#### Clock
The clock can be made of 2 sections  
##### Background
A circle using layered gradients to create a clock face
##### Hand
A vertical centered rectangle split in half to allow it to rotate around the center "axel"
##### Highlighting
When the game starts the clock needs to be highlighted as the hand moves  
This is done by animating a variable named `--clock-angle` from 0 to 1 which controls a `radial-gradient` in the background and the `rotation` transform in the hand
#### Paper
The background is made with 2 overlapping linear gradients which is repeated vertically down as needed  
The vertical size of each line is also the `line-height` allowing each line to occupy only a single line on the background  
Also rotated by a few pixels to give an authentic look  
Transformed in and out using `translateY` transform with an eased animation  
A dotted line shows the otherwise invisible input  
