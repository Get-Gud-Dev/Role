# Technical Considerations
*return to [Abstract Design](../README.md)*

Game Mechanics are all fun and games, the devil is in the details and technicalities. These pages seek to explore the limitations of what a text based 3d engine can do.

### Entity Model
*Article: [Entity Model](entity-model/README.md)*

The entity model is akin to the base-class which all objects in the world derive from. The entity model specifies the unbreakable, unchangeable rules of the Role world.

Entities are given function and form using components, which can be combined to create any type of thing the game world would need.

## Mapping
*Article [Maps](maps/README.md)*

The question of how to best organize the map data, and how to get the most out of 3d in a 120x25 environment.

### Raycasting
*Article [Raycasting](maps/raycast.md)*

Raycasting is all about shooting out invisible beams and seeing what they hit. Turns out in video games you do see out your eyes after all. I seek to create a method of raycast that is cheap and limited but gets the job done.