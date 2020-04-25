(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const input = require('../input')
const state = require('../state')
const util = require('../util')
const mapping = require('../mapping')

const Vector3 = require('../types/vector3')

var velocity = new Vector3(0,0,0)

module.exports.applyMotion = (delta) => {
    let inputState = input.getState()
    
    //let normal = util.getNormal(state.getDirection())


    // 2d normal of the player's direction
    let normal2d = util.getNormal(state.getDirection())
    let rightNormal2d = util.getNormal(state.getDirection() + (Math.PI/2) )
    //The player's position
    let position = state.getPosition()

    if(state.isGrounded())
    {
        let inputVectorX
        let inputVectorZ
        
        if(inputState.horizontal != 0 && inputState.vertical != 0)
        {
            inputVectorX = 0.70710678119 * Math.sign(inputState.horizontal)
            inputVectorZ = 0.70710678119 * Math.sign(inputState.vertical)
        }
        else if(inputState.horizontal == 0 && inputState.vertical == 0){
            velocity.x = 0
            velocity.z = 0
            inputVectorZ = 0
            inputVectorX = 0
        }
        else
        {
            inputVectorX = inputState.horizontal
            inputVectorZ = inputState.vertical
        }
        let projectedHXV = (rightNormal2d.x * inputVectorX * state.getRunSpeed() * delta/1000)
        let projectedHZV = (rightNormal2d.y * inputVectorX * state.getRunSpeed() * delta/1000)
        let projectedVXV = (normal2d.x * inputVectorZ * state.getRunSpeed() * delta/1000)
        let projectedVZV = (normal2d.y * inputVectorZ * state.getRunSpeed() * delta/1000)


        let squareMag = ( (velocity.x + projectedHXV + projectedVXV) ** 2 ) + ((velocity.z + projectedHZV + projectedVZV ) ** 2)
        if(  (squareMag) <= state.getMaxSpeed() * 0.0001){
            velocity.x += projectedHXV + projectedVXV
            velocity.z += projectedHZV + projectedVZV
        }

        // 

        
    }


    
    let targetX = position.x + velocity.x
    let targetY = position.y
    let targetZ = position.z + velocity.z

    if(!mapping.collisionCheck(targetX, targetZ))
        state.setPosition(targetX, targetY, targetZ )
    state.setDirection(state.getDirection() + (0.01 * inputState.delta_mouse_x))
}
},{"../input":3,"../mapping":5,"../state":9,"../types/vector3":11,"../util":12}],2:[function(require,module,exports){
const gameLoop = require('./loop')
const Mapping = require('./mapping')
const GameState = require('./state')
const Settings = require('./settings')
const Renderer = require('./rendering')
const util = require('./util')
const input = require('./input')

const Vector3 = require('./types/vector3')

// Configure a player
GameState.setPosition(4,0,7)
GameState.setDirection(util.north)
GameState.setPixelRatio(0.5)
GameState.setEyePoint(1.85)

// Load the map
Settings.set('resolution', [160, 25])
Settings.set('fov', 70)
Settings.set('view distance', 50)

let temporaryMapHeader = {name:"Test map", blockSize:3, blockHeight:2.5}

let temporaryMapData = [ 
    [1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,3,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,2,2,2,2,2,2,2,2,1]
]

let temporaryMapBlocks = [
    {label: 'floor', height: 0, top:'#000000', bottom:'#AAAAAA' },
    {label: 'wall', height: 2.5, wall:'#DDDDDD', top:'#222222', bottom:'#AAAAAA'},
    {label: 'southWall', height: 2.5, wall:'#c75648', top:'#222222', bottom:'#AAAAAA'},
    {label: 'stepLow', height: 0.5, wall:'#555555', top:'#222222', bottom:'#AAAAAA'}
]

let temporaryMap = {header: temporaryMapHeader, data: temporaryMapData, block: temporaryMapBlocks}

Mapping.loadMap(temporaryMap)

input.init()
Settings.set('font size',16)

Renderer.generateScreen()


gameLoop()
},{"./input":3,"./loop":4,"./mapping":5,"./rendering":6,"./settings":8,"./state":9,"./types/vector3":11,"./util":12}],3:[function(require,module,exports){
const state = require('../state')
const util = require('../util')

var inputState = {
    vertical:0,
    horizontal:0,
    mouse_x:0,
    mouse_y:0,
    last_mouse_x:0,
    last_mouse_y:0,
    delta_mouse_x:0,
    delta_mouse_y:0,
}

var timer

module.exports.getState = () => {
    return inputState
}

module.exports.init = () => {

document.addEventListener('keydown', keyDown)

function keyDown(e) {
    if(e.code == 'KeyW'){
        inputState.vertical = 1
    }
    if(e.code == 'KeyS'){
        inputState.vertical = -1
    }
    if(e.code == 'KeyA'){
        inputState.horizontal = -1
    }
    if(e.code == 'KeyD'){
        inputState.horizontal = 1
    }
}

document.addEventListener('keyup', keyUp)
    function keyUp(e) {
        if(e.code == 'KeyW'){
                inputState.vertical = 0
        }
        if(e.code == 'KeyS'){
                inputState.vertical = 0
        }
        if(e.code == 'KeyA'){
                inputState.horizontal = 0
        }
        if(e.code == 'KeyD'){
                inputState.horizontal = 0
        }
    }

    document.addEventListener("mousemove", function(ev){
        inputState.last_mouse_x = inputState.mouse_x
        inputState.last_mouse_y = inputState.mouse_y

        inputState.mouse_x = ev.screenX
        inputState.mouse_y = ev.screenY

        inputState.delta_mouse_x = inputState.mouse_x - inputState.last_mouse_x
        inputState.delta_mouse_y = inputState.mouse_y - inputState.last_mouse_y

        clearTimeout(timer)
        timer=setTimeout(mouseStopped,30)

    }, false);

    function mouseStopped(){
        inputState.last_mouse_x = inputState.mouse_x
        inputState.last_mouse_y = inputState.mouse_y

        inputState.delta_mouse_x = inputState.mouse_x - inputState.last_mouse_x
        inputState.delta_mouse_y = inputState.mouse_y - inputState.last_mouse_y        
    }
}

},{"../state":9,"../util":12}],4:[function(require,module,exports){
var request
const state = require('./state')
const mapping =  require('./mapping')
const rendering = require('./rendering')
const settings = require ('./settings')
const inputs = require('./input')
const control = require('./control')

var framer = 0

var lastFrame

module.exports = () => {

    const performAnimation = (timestamp) => {
        let delta = timestamp - lastFrame

        request = requestAnimationFrame(performAnimation)
        if(framer == 0){
            framer++ 
        }else{
            control.applyMotion(delta)

            //Get player position from local state
            let position = state.getPosition()
            let orientation = state.getDirection()
            //Get the number of rays to cast from the settings
            //Get the field of view to determine what our range of angles are
            let columns = settings.get('resolution')[0]
            let fov = settings.get('fov')
            let viewDist = settings.get('view distance')
    
            //One half of the FOV in radians - used to add and subtract from player orientation
            let halfFov = fov/2
    
            //Lower and upper angles that we scan between
            let lowerAngle = orientation - halfFov
            let upperAngle = orientation + halfFov
    
            //Retrieve the angle that is going to be scanned
            function getAngle(i){
                return (((upperAngle - lowerAngle) / columns) * i ) + lowerAngle
            }
    
            let hits = []
    
            for(var i = 0; i < columns; i++){
                hits.push(mapping.cast(position, getAngle(i), viewDist))
            }
            
            // update the screen
            rendering.drawWorld(hits)
            framer++
            if(framer > 1000)
                framer = 0
            lastFrame = timestamp
        }
    }
    
    requestAnimationFrame(performAnimation)
}
},{"./control":1,"./input":3,"./mapping":5,"./rendering":6,"./settings":8,"./state":9}],5:[function(require,module,exports){
const Raycast = require('../types/raycast')
const util = require('../util')
const State = require('../state')

var mapLoaded = false

var mapData
var mapHeader
var blockData

/**Loads a map into memory for the game engine to calculate against
 * 
 */
module.exports.loadMap = (data) => {
    mapHeader = data.header
    mapData = data.data
    blockData = data.block
    mapLoaded = true
}

module.exports.cast = ( position, direction, length ) => {
    let isHit = false
    let distance = 1

    let v = util.getNormal(direction)

    let characters = []
    let hits = []

    while(distance <= length)
    {
        let rayX = position.x + (distance * v.x)
        let rayY = position.z + (distance * v.y)

        //let charHit = checkForCharacterHit(rayX, rayY)
        let blockHit = this.checkForHit(rayX, rayY)
        distance += 0.3
        if(hits != null){
            hits.push({hit:blockData[blockHit], distance:distance})
            
        }
    }
    return hits
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
},{"../state":9,"../types/raycast":10,"../util":12}],6:[function(require,module,exports){
const settings = require('../settings')
const state = require('../state')
const tags = require('./tags')
const util = require('../util')

var ScreenData

/** Generate a pixel array to draw on
 * 
 */
module.exports.generateScreen = () => {
    let gameDiv = document.getElementById('game')

    gameDiv.innerHTML = ""

    let screen = {
        columnCount: 0,
        rowCount: 0,

        columnPixels: [],
        rowPixels: [],
        rows: [],

        matrix: [[]]
    }


    let columnPixels = settings.get('resolution')[0]
    let rowPixels = settings.get('resolution')[1]


    screen.columnCount = columnPixels
    screen.rowCount = rowPixels

    screen.columns = columnPixels

    for (let i = 0; i < columnPixels * rowPixels; i++) {
        let column = i % columnPixels
        let row = Math.floor(i / columnPixels)

        if (row == 0)
            screen.columnPixels[column] = []
        screen.matrix.push([])
        if (column == 0) {
            screen.rowPixels[row] = []
            let newRow = tags.row()
            screen.rows.push(newRow)

            gameDiv.appendChild(newRow)
        }

        let pixelContainer =  tags.pixel()
        let pixel = pixelContainer.childNodes[0]
        pixel.innerHTML = '█'

        screen.columnPixels[column].push(pixelContainer)
        screen.rowPixels[row].push(pixelContainer)

        screen.matrix[column][row] = pixelContainer

        screen.rows[row].appendChild(pixelContainer)
        screen.matrix[column][row] = pixelContainer

        let newSubPixel = tags.subPixel()
        pixelContainer.appendChild(newSubPixel)

    }
    ScreenData = screen

}

/** 
 * 
 */
module.exports.drawWorld = (hits) => {
    let entities = []


    //First look at all hits
    for (var hitIndex in hits) {
        let hit = hits[hitIndex]
        //Each ray can hit multiple objects so cycle through them
        for (var rayHitID in hit) {
            let rayHit = hit[rayHitID]
            for (var hitThingID in rayHit.hit) {
                let hitThing = rayHit.hit[hitThingID]
                //    entities.push(rayHit)
                if (hitThing != null) {
                    let bounds = calculateWallBounds(rayHit.distance, rayHit.hit)
                    renderColumn(hitIndex, rayHit.distance, bounds, rayHit.data)
                }
            }
        }


    }
}


//Given a block and its distance, calculate the bounds of the wall
function calculateWallBounds(distance, wallData) {
    //Observer height of the camera
    let eyeHeight = state.getEyePoint()
    let eyePixels = ScreenData.rowCount / 2

    //Fonts may have different character ratios
    let pixelRatio = state.getPixelRatio()

    //How much apparent height in unit does each pixel represent
    let heightPerPixel = (eyeHeight / eyePixels) * pixelRatio

    //Calculate the ceiling point and floor points in pixels
    let screenHeight = heightPerPixel * ScreenData.rowCount

    //How tall is the screen at the distance
    let dScreenHeight = util.calculateApparentSize(screenHeight, distance)

    //How many pixels high is the screen at this distance
    let dPixels = dScreenHeight / heightPerPixel

    //How many pixels smaller is the screen at distance
    let deltaDPixels = ScreenData.rowCount - dPixels
    
    //Split the pixels up to the top and bottom
    let dPixelSplit = deltaDPixels / 2
    
    //Get an even number of pixels to divide between the top and bottom
    //Giving us the distance from the floor and ceiling to this point.
    let dPixelEven =  2 * Math.round(dPixelSplit / 2)


    //Get the offset between the player and the wall height
    let wallOffset = state.getPosition()

    //Length of the wall above and below the wall if it was 1m away
    let h1Prime = hPrimePixels - eyePixels

    //Length of wall above and below the eye respectively.
    let h1 = h1Prime/hPrimePixels * hPixels
    let h2 = hPixels - h1

    // This is the row number where the wall joins the roof
    let vMax = Math.round(eyePixels + h1)
    // This is the row number where the wall joins the floor
    let vMin = Math.round(eyePixels - h2)

    return { max: vMax, min: vMin }
}

function renderWall() {

}

function renderColumn(number, distance, bounds, data) {

    // Lower pixelID makes for a higher up pixel
    for (var pixelID in ScreenData.columnPixels[number]) {
        // Pixel number raises as you go up, so flip the
        // iterator
        let truePixel = ScreenData.rowCount - 1 - pixelID
        // Get the pixel span to be written
        let pixel = ScreenData.columnPixels[number][pixelID].firstChild

        // If the pixel is above roof level
        // Draw the TOP
        if (truePixel > bounds.max) {
            pixel.style.color = data.top
        }
        //If the pixel is between the roof and floor
        //Draw the WALL
        else if (truePixel <= bounds.max && truePixel >= bounds.min) {
            //pixel.innerHTML = bounds.max - bounds.min
            pixel.style.color = util.changeColor(data.wall, -14*distance)
        }
        //Else, draw the BOTTOM
        else {
            //pixel.innerHTML = bounds.min
            pixel.style.color = data.bottom
        }
        pixel.innerHTML = truePixel
    }
}
},{"../settings":8,"../state":9,"../util":12,"./tags":7}],7:[function(require,module,exports){
module.exports.row = () => {
    let newRow = document.createElement('span')
    newRow.classList.add('row')

    return newRow
}

module.exports.pixel = () => {
    let newPixelContainer = document.createElement('span')
    newPixelContainer.classList.add('pixel-container')

    let newPixel = document.createElement('span')
    newPixel.classList.add('pixel')

    newPixelContainer.appendChild(newPixel)

    return newPixelContainer
}

module.exports.subPixel = () => {
    let newSubPixelContainer = document.createElement('span')
    newSubPixelContainer.classList.add('subpixel-container')

    

    let subPixel0 = document.createElement('span')
    let subPixel1 = document.createElement('span')
    let subPixel2 = document.createElement('span')
    let subPixel3 = document.createElement('span')

    subPixel0.classList.add('subpixel')
    subPixel1.classList.add('subpixel')
    subPixel2.classList.add('subpixel')
    subPixel3.classList.add('subpixel')

    subPixel0.classList.add('subpixel0')
    subPixel1.classList.add('subpixel1')
    subPixel2.classList.add('subpixel2')
    subPixel3.classList.add('subpixel3')


    newSubPixelContainer.appendChild(subPixel0)
    newSubPixelContainer.appendChild(subPixel1)
    newSubPixelContainer.appendChild(subPixel2)
    newSubPixelContainer.appendChild(subPixel3)

    return newSubPixelContainer
}
},{}],8:[function(require,module,exports){
const Utility = require('../util')
const state = require('../state')
var settings = {}
var game = document.getElementById('game')
module.exports.load = () => {

}

module.exports.set = (key, value) =>{
    if(key == 'font size'){
        game.style.fontSize = value
        game.style.width = 
        document.documentElement.style.setProperty('--pixel-height', value +'px')
        document.documentElement.style.setProperty('--pixel-width', value * state.getPixelRatio() + 'px')
        document.documentElement.style.setProperty('--window-width',settings['resolution'][0] * value * state.getPixelRatio() + 'px')
    }
    if(key == "fov")
        settings[key] = Utility.degreesToRadians(value)
    else
        settings[key] = value
}

module.exports.get = (key) => {
    return settings[key]
}
},{"../state":9,"../util":12}],9:[function(require,module,exports){
const Vector3 = require('../types/vector3')

var playerState = {
    position:new Vector3(0,0,0),
    orientation:null,
    eyepoint:null,
    pixelRatio:null,
    grounded: true,

    runSpeed:0.04,
    maxSpeed:1,
    stepHeight:0.5
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
},{"../types/vector3":11}],10:[function(require,module,exports){
const Mapping = require('../mapping')

module.exports = (position, direction, length) => {
    let culled = false
    let distance = 1

    let v = util.getNormal(direction)

    /** What is the cast stack? 
     * 
     * A cast stack is a list of objects that a ray hits, sorted
     * furthest to closestw
     * 
     */
    let castStack = []

    while(distance <= length || !culled)
    {
        let rayX = position.x + (distance * v.x)
        let rayY = position.z + (distance * v.y)

        let charHit = checkForCharacterHit(rayX, rayY)
        let blockHit = checkForHit(rayX, rayY)
        distance += 0.3
        if(hits != null){
            hits.push({hit:hit, distance:distance})
            for(var hitID in hit){
                let hitData = hit[hitID]
                

            }
        }
    }
    return hits
}
},{"../mapping":5}],11:[function(require,module,exports){
module.exports = function(x, y, z) {
    this.x = x
    this.y = y
    this.z = z
    
    this.length = () => {
        return Math.sqrt(this.x**2 + this.y**2 + this.z**2) 
    }

    this.multiply = (val) => {
        this.x = this.x*val
        this.y = this.y*val
        this.z = this.z*val
        return this
    }

    this.normalized = () => {
        let length = this.length()
        this.x = this.x / length
        this.y = this.y / length
        this.z = this.z / length
        return this
    }
    
}
},{}],12:[function(require,module,exports){
module.exports.degreesToRadians = (deg) => {

    return (deg * Math.PI)/180
}

module.exports.north = this.degreesToRadians(90)

module.exports.west = this.degreesToRadians(180)

module.exports.south = this.degreesToRadians(270)

module.exports.east = this.degreesToRadians(0)

module.exports.calculateApparentSize = (normalSize, distance) => {
    return normalSize / distance
}

module.exports.getNormal = (direction) => {
    let v = {}
    v.x = Math.cos(direction)
    v.y = Math.sin(direction)
    return v
}

module.exports.changeColor = (col, amt) => {
  
    var usePound = false;
  
    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }
 
    var num = parseInt(col,16);
 
    var r = (num >> 16) + amt;
 
    if (r > 255) r = 255;
    else if  (r < 0) r = 0;
 
    var b = ((num >> 8) & 0x00FF) + amt;
 
    if (b > 255) b = 255;
    else if  (b < 0) b = 0;
 
    var g = (num & 0x0000FF) + amt;
 
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
 
    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
  
}
},{}]},{},[2]);
