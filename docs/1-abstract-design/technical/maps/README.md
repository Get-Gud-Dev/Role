# Maps
*return to [Technical Considerations](../README.md)*

Maps define the player's game space. Currently, the design limits players onto a grid. A map needs the following qualities in order to function properly:

## Map Scale
Maps can have any scale, expressed in meters

## Height Maps

Height mapping means defining the ground and ceiling heights at all points in a map. the current design of Role places these height points on a grid like so:

```
5,5,5,5,5,5,
5,0,0,0,0,5,
5,0,0,0,0,5,
5,0,0,0,0,5,
5,5,5,5,5,5,

```
The above heightmap would represent an enclosed box where the walls are 5 units tall.

##### Height Values

Height values are expressed in meters! Rejoice!

Height values are not exactly as simple as listed above.

### Map Scale and Height Maps
