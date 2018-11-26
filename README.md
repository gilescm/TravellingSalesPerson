# TravellingSalesPerson

This script attempts to solve the Travelling Salesperson Problem using the genetic algorithm.

To see the program open index.html in Google Chrome

## The Travelling Salesperson Problem:
A saleman travels from city to city trying to sell his wares. He has N cities to travel to 
and would like to figure out a way to cut down his travel time by as much as possible. He can
start in whichever city he likes, but must return to his starting city once he has visited all
the rest.
This program recreates the problem by generating N cities randomly in the workspace and assumes
the salesperson has to travel to all of them. It maps out his path by simple lines running between
each city. The starting city is highlighted in red.

## The Genetic Algorithm:
This process is named such as it is derived from the theory of evolution. 

Step 1   - Randomly chose a base pool of potential solutions (population)
Step 2   - Rank those solutions based of their fitness to the end target, assigning
	   % to each solution.
Step 3   - Select two (or more/less) 'parents' from this pool using this % fitness for a new 
	   pool of solutions the same size.
Step 4   - Create a new 'generation' of potential solutions with these parents by crossing over
	   sections of their 'DNA' to form a new potential solution.
Step 4.5 - To ensure no stagnation in solutions, each new solution has a % chance to 'mutate'
	   a section of themselves to a completely random configuration not inherited from their
	   parents.  
Step 5   - Repeat Steps 2 through 4 until the target solution is found.

Genetic Algorithm applied to the Travelling Salesperson Problem:
The population pool of potential solutions are randomly created by randomly pathing a route around 
every city. 
The fitness is based on the shortest total distance of the each path.
The mutation rate is set to 0.01

More information on (and a better explaination of) the genetic algorithm can be found here:
https://www.doc.ic.ac.uk/~nd/surprise_96/journal/vol1/hmw/article1.html#introduction

## UI
Graph #1
Displays a history of the best path per generation.
Displays a curve of each generation's best paths total distance 
to show the improvement per generation.
Top Left: Distance of current path and Number of Generation
Top Right: Title and Number of Cities

Graph #2
Displays the current best path the sales person should take.
Top Left: Distance of current path, Number of Generation and Total Population pool size.
Top Right: Title and Number of Cities.
Bottom Left: Current pool size, inication of DNA crossover or not and cap of generations.

Buttons:
Restart (All New Cities): Restart the program with the new number of cities
Reset (Same Cities): Restart the program with same cities and new Population Pool Size/Without DNA Crossover/Limit on Generations

Number of Cities: Change the number of cities.
Population Pool Size: Change the size of the population pool.
Stop DNA Crossover: Turn off/on DNA crossover for the next generation.
Limit Total Generations To: Cap the size of the number of generations reproduced.
