# Game Engine

# Renderer
    The renderer is responsible for creating a screen of pixels and colouring the pixels to make a scene.

# Mapping
    Load in a map and begin casting for hits.

    **loadMap** takes an object like the following:
    ```JSON
        {
            header:{
                name:"",
                blockSize: 3, //In meters squared
                blockHeight: 2.5, // in Meters
            },
            data:{
                [[]]
            }
        }
    ```

    **cast** is used to raycast for things and walls.
# Network

# Settings

# State
