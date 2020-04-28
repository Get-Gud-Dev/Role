# Raycasting

The raycasting engine for Role uses one ray per pixel to determine what the player is seeing at that point.

Raycasts are done in 3d space by analyzing each dimension separately.

## Column Rays

Column rays shoot from the player across their horizontal field of view. Column ray angles are determined by looking at the X resolution of the game and the player's field of view.

The column ray looks out by probing X and Y coordinates for heightmap data. Using the distance property of the raycast should give an idea of how far up and down the raycaster needs to probe.

## Row Rays

Row rays are calculated after the column ray has captured a Column Ray. Column ray angles are determined by looking at the Y resolution of the game and by calculating a Y field of view using the aspect ratio of the screen and the player's X field of view.

Row rays perform the exact same probing as column rays, only now the X,Y data is sampled from the maps and is technically a 'side view' taken from the top down column ray.