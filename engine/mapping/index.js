const Raycast = require('../types/raycast')
const util = require('../util')
const State = require('../state')

var mapLoaded = false

var mapData
var mapHeader
var blockData
var mapCharacters
var mapEntities

/**Loads a map into memory for the game engine to calculate against
 * 
 */
module.exports.loadMap = (data) => {
    mapHeader = data.header
    mapData = data.data
    blockData = data.block
    mapLoaded = true
}


module.exports.checkForCharacterHit = (x, y) => {
    for(var characterIndex in chars)
    {
        let char = chars[characterIndex]
        if(pointInCircle( char.position[0], char.position[1], 0.75, x, y ))
        {
            return char
        }
    }
}

module.exports.checkForHit = (x, y) =>{
    let hits = []
    //first see if we hit any objects


    let roundedCoordinates = [Math.floor(x), Math.floor(y)]

    if(mapData[roundedCoordinates[0]] != null){
        let blockValue = mapData[roundedCoordinates[0]][roundedCoordinates[1]]
        
        return blockValue

    }
    else return null
}

module.exports.collisionCheck = (x, y) => {
    let position = State.getPosition()
    
    let oldBlock = [Math.floor(position.x), Math.floor(position.z)]

    let roundedCoordinates = [Math.floor(x), Math.floor(y)]

    if(oldBlock[0] == roundedCoordinates[0] && oldBlock[1] == roundedCoordinates[1])
        return false
    else{
        let blockValue = mapData[roundedCoordinates[0]][roundedCoordinates[1]]
        if(blockData[blockValue].height <= (position.y + State.getStepHeight())){
            return false
        }
        else
            return true
    }

    
}

function pointInCircle(cX, cY, radius, x, y) {
    let squareDistance = (cX - x) ** 2 + (cY - y) ** 2
    return squareDistance <= radius ** 2
}