## Height Maps

Height mapping means defining the ground and ceiling heights at all points in a map. the current design of Role places these height points on a grid like so:

```
5,5,5,5,5,5,
5,0,0,0,0,5,
5,0,0,0,0,5,
5,0,0,0,0,5,
5,5,5,5,5,5,
```
The above heightmap would represent an enclosed box where the walls are 5 units tall with no ceiling.

To draw a ceiling, provide an array and specify the height above the floor to draw the ceiling.

```
5,5    ,5    ,5    ,5    ,5
5,[0,5],[0,5],[0,5],[0,5],5
5,[0,5],[0,5],[0,5],[0,5],5
5,[0,5],[0,5],[0,5],[0,5],5
5,[0,5],[0,5],[0,5],[0,5],5
5,[0,5],[0,5],[0,5],[0,5],5
5,5    ,5    ,5    ,5    ,5
```

### Height Map Scale vs Map Scale

Height maps map onto the map by scaling the heightmap to fit the map.

That is to say no matter what dimensions you make your heightmap it will fill the map edge to edge, the more height values you insert, the higher the resolution of the map.

#### How to map a Height Map to the Map

Let's look at the relevant information:
```
HeightMap:
    resolutionX
    resolutionY

Map:
    width
    height

```

From this we can derive:
```

HeightMap:
    blockWidth = width / resolutionX
    blockHeight = height / resolutionY

```

**Converting a world coordinate to a height map coordinate**

Once we know how big the grid of the height map is we can figure out what the height map coordinate that relates to the map coordinate.

```
    hMapXCoord = Floor(x/blockWidth)
    hMapYCoord = Floor(y/blockHeight)
```

### Overlapping Height Maps
Height maps can be overlapped. This can be used in two ways:

The first way is as a global offset, in the case where the heightmap value in a particular coordinate is a single number, it will be added to the height values of all height information at that point.

The second way is by stacking blocks, by putting an array of two values in a coordinate point of the heightmap it will place a floor on top of the ceiling by the first number's units and a ceiling above it by the second numbers.

Essentially the format is the same for adding a floor and ceiling, they just stack on top of each other.

When global offsets are added to a map, all floor and ceiling values are offset by that value as well.

This could be used to create a map on the side of a hill for example, local terrain can be cut out from the hill, and adjustments to the hill itself will follow through into any modeling you add under or on top.

## Working with Height maps

Height maps don't really make sense and so some methods designed to work with 
them would probably be beneficial.

### Dealing with ranges of values

Something that should be taken into account is that heightmaps work with ranges of values and ranges of coordinates.

#### Getting the Heights at a Particular point




### Precompile VS Compile

Overlapping height maps is a process that will take some computation and so after a map is modified and saved it should be compiled before storage for distribution. When someone goes to modify the map, they will get the precompiled data but for regular viewing, may as well compile and send the data alone.

.. Maybe

