const Vector3 = require('../types/vector3')
const settings = require('../settings')

var playerState = {
    position:new Vector3(0,0,0),
    orientation:null,
    eyepoint:null,
    pixelRatio:null,
    grounded: true,

    runSpeed:0.04,
    maxSpeed:1,
    stepHeight:0.5,

    rayDistances:[],
}

var characters = []
var items


module.exports.load = (data) => {

}

module.exports.getEyePoint = () => {
    return playerState.eyepoint
}

module.exports.setGrounded = (value) => {
    playerState.grounded = value
}

module.exports.isGrounded = () => {
    return playerState.grounded
}

module.exports.setEyePoint = (value) => {
    playerState.eyepoint = value
    calculateRaycast()
}

module.exports.getPosition = (data) => {
    return playerState.position
}

module.exports.setPosition = (x, y, z) => {
    playerState.position.x = x
    playerState.position.y = y
    playerState.position.z = z
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

module.exports.setViewDistance = () => {
    calculateRaycast()
}

module.exports.setResolution = () => {
    calculateRaycast()
}

function calculateRaycast(){
    let distances = []

    let resolution = settings.get('resolution')

    let pixelsToEye = Math.ceil(resolution[1] / 2)
 
    for (let i = 0; i < pixelsToEye; i++) {
        distances.push(i * (this.getEyePoint()/pixelsToEye))
    }

    playerState.rayDistances = distances
}