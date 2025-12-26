# Langton's Ant

The ant sits on an infinite square grid. Each field on the grid can have the color black or white. At the beginning all fields are white. 
The ant executes iteratively the following algorithm:

1. On a white field the ant rotates 90 degrees to the right, on a black field 90 degrees to the left.
2. The changes the color of the field (white to black or black to white).
3. The ant moves on step forward in the direction of sight.

I build a website to visualize the algorithm. 
Visit http://langtonsant.s3-website.eu-central-1.amazonaws.com to look at the algorithm.

I made this project to solve problem 349 of Project Euler: https://projecteuler.net/problem=349
