const Raycast = require('../types/columnCast')
const util = require('../util')
const State = require('../state')
const settings = require('../settings')

var mapLoaded = false

var mapHeader
var blockData
var heightMap
var mapCharacters
var mapEntities

/**Loads a map into memory for the game engine to calculate against
 * 
 */
module.exports.loadMap = (data) => {
    mapHeader = data.header
    heightMap = data.data
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
    //first see if we hit any objects
    let roundedCoordinates = [Math.floor(x), Math.floor(y)]

    if(heightMap[roundedCoordinates[0]] != null){
        let blockValue = heightMap[roundedCoordinates[0]][roundedCoordinates[1]]
        
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
        let blockValue = heightMap[roundedCoordinates[0]][roundedCoordinates[1]]
        if(blockValue[0] <= (position.y + State.getStepHeight())){
            return false
        }
        else
            return true
    }

    
}

module.exports.getGroundLevel = (position) => {
    if(heightMap == null)
        return
    let roundedCoordinates = [Math.floor(position.x), Math.floor(position.z)]
    let groundlevel = heightMap[roundedCoordinates[0]][roundedCoordinates[1]][0]
    //settings.get('debug').innerHTML = (groundlevel)
    return groundlevel
}

function pointInCircle(cX, cY, radius, x, y) {
    let squareDistance = (cX - x) ** 2 + (cY - y) ** 2
    return squareDistance <= radius ** 2
}