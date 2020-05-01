const Vector3 = require('../types/vector3')
const settings = require('../settings')
const mapping = require('../mapping')

var playerState = {
    position:new Vector3(0,0,0),
    orientation:null,
    eyepoint:0,
    pixelRatio:null,
    grounded: true,

    runSpeed:0.2,
    maxSpeed:4,
    stepHeight:0.6,

    rayDistances:[],

    eyeCoordinate:0,

    blockScale:[0,0]
}

var characters = []
var items


module.exports.load = (data) => {

}

module.exports.getEyePoint = () => {
    return playerState.eyepoint
}

module.exports.getEyeCoordinate = () => {
    return playerState.eyeCoordinate
}

module.exports.setGrounded = (value) => {
    playerState.grounded = value
}

module.exports.isGrounded = () => {
    return playerState.grounded
}

module.exports.setEyePoint = (value) => {
    playerState.eyepoint = value
    setEyeCoordinate()
}

module.exports.getPosition = () => {
    return playerState.position
}

module.exports.setPosition = (x, y, z) => {
    playerState.position.x = x
    playerState.position.y = y
    playerState.position.z = z
    setEyeCoordinate()
    updateGroundPoint()
}

function updateGroundPoint(){
    playerState.groundLevel = mapping.getGroundLevel(playerState.position)
    
}

module.exports.getGroundLevel = () => {
    return playerState.groundLevel
}

function setEyeCoordinate(){
    if(playerState.position != null && playerState.eyepoint != null){

        playerState.eyeCoordinate = playerState.eyepoint + playerState.position.y
    }

}

module.exports.setBlockScales = () => {
    let res = settings.get('resolution')
    if(res == null)
        return

    
    let calibrationDistance = playerState.eyepoint

    let yScale = calibrationDistance / (res[1]/2)
    
    playerState.blockScale = yScale
}

module.exports.getBlockScale = () => {
    return playerState.blockScale
}

module.exports.addCharacter = ( character ) => {
    characters.push( character )
}

module.exports.getCharacters = ( ) => {
    return characters
}

module.exports.setDirection = (orientation) => {
    playerState.orientation = orientation
}

module.exports.getDirection = () => {
    return playerState.orientation
}

module.exports.setPixelRatio = (data) => {
    playerState.pixelRatio = data
    module.exports.setBlockScales()
}

module.exports.getPixelRatio = () => {
    return playerState.pixelRatio
}

module.exports.getRunSpeed = () => {
    return playerState.runSpeed
}

module.exports.getMaxSpeed = () => {
    return playerState.maxSpeed
}

module.exports.getStepHeight = () => {
    return playerState.stepHeight
}

module.exports.setStepHeight = (data) => {
    playerState.stepHeight = data
}

