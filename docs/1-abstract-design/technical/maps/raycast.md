# Raycasting
*return to [Maps](README.md)*

The raycasting engine for Role uses one ray per pixel to determine what the player is seeing at that point.

Raycasts are done in 3d space by analyzing each dimension separately.

## Column Rays

Column rays shoot from the player across their horizontal field of view. Column ray angles are determined by looking at the X resolution of the game and the player's field of view.

The column ray looks out by probing X and Y coordinates for heightmap data. Using the distance property of the raycast should give an idea of how far up and down the raycaster needs to probe.
