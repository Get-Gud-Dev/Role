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
    state.setDirection(state.getDirection() + (0.01 * inputState.delta_mouse_x))

    // 2d normal of the player's direction
    let normal2d = util.getNormal(state.getDirection())
    let rightNormal2d = util.getNormal(state.getDirection() - (Math.PI/2) )
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
        if(  squareMag <= state.getMaxSpeed() * 0.001){
            velocity.x += projectedHXV + projectedVXV
            velocity.z += projectedHZV + projectedVZV
        }

        // 

        
    }


    
    let targetX = position.x + velocity.x
    let targetY = position.y
    let targetZ = position.z + velocity.z

    if(!mapping.collisionCheck(targetX, targetZ, position)){
        state.setPosition(targetX, targetY, targetZ )
        if(state.getPosition().y < state.getGroundLevel()){
            console.log('boop')
            state.setPosition(state.getPosition().x, state.getGroundLevel() ,state.getPosition().z)

        }
    }

}
},{"../input":3,"../mapping":5,"../state":8,"../types/vector3":11,"../util":12}],2:[function(require,module,exports){
const gameLoop = require('./loop')
const Mapping = require('./mapping')
const GameState = require('./state')
const Settings = require('./settings')
const Renderer = require('./rendering/render-classic')
const util = require('./util')
const input = require('./input')

const Vector3 = require('./types/vector3')

// Configure a player
GameState.setPosition(5,0,7)
GameState.setDirection(util.north)
GameState.setPixelRatio(0.5)
GameState.setEyePoint(1.85)

// Load the map
Settings.set('resolution', [100, 20])
Settings.set('fov', 70)
Settings.set('view distance', 50)
Settings.set('ray jump', 0.3)
Settings.set('debug', document.getElementById('debug'))
let temporaryMapHeader = {name:"Test map", blockSize:3, blockHeight:2.5}

let temporaryMapData = [ 
    [[5,0],[5,0],[5,0],[5,0],[5,0],[5,0],[5,0],[5,0],[5,0],[5,0]],
    [[5,0],[0,5],[0,5],[0,5],[0,5],[0,5],[0,5],[0,5],[0,5],[5,0]],
    [[5,0],[0,5],[0,5],[0,5],[0,5],[0,5],[0,5],[0,5],[0,5],[5,0]],
    [[5,0],[0,5],[0,5],[0,5],[0,5],[0,5],[0,5],[0,5],[0,5],[5,0]],
    [[5,0],[0,5],[0.5,4.5],[1,4],[2,3],[0,5],[0,5],[0,5],[0,5],[5,0]],
    [[5,0],[0,5],[0,5],[0,5],[0,5],[0,5],[0,5],[0,5],[0,5],[5,0]],
    [[5,0],[0,5],[0,5],[0,5],[0,5],[0,5],[0,5],[0,5],[0,5],[5,0]],
    [[5,0],[5,0],[5,0],[5,0],[5,0],[5,0],[5,0],[5,0],[5,0],[5,0]]
]

let temporaryMapColours = [
    
]

let temporaryMapBlocks = [
    {label: 'floor', height: 0, ceil:2.5, top:'#000000', bottom:'#AAAAAA' },
    {label: 'wall', height: 2.5, ceil:2.5, wall:'#DDDDDD', top:'#222222', bottom:'#AAAAAA'},
    {label: 'southWall', height: 2.5, ceil:2.5, wall:'#c75648', top:'#222222', bottom:'#AAAAAA'},
    {label: 'stepLow', height: 0.5, ceil:2.5, wall:'#555555', top:'#222222', bottom:'#AAAAAA'}
]

let temporaryMap = {header: temporaryMapHeader, data: temporaryMapData, block: temporaryMapBlocks}

Mapping.loadMap(temporaryMap)

input.init()
Settings.set('font size',26)

Renderer.init()


gameLoop()
},{"./input":3,"./loop":4,"./mapping":5,"./rendering/render-classic":6,"./settings":7,"./state":8,"./types/vector3":11,"./util":12}],3:[function(require,module,exports){
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
        inputState.horizontal = 1
    }
    if(e.code == 'KeyD'){
        inputState.horizontal = -1
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

},{"../state":8,"../util":12}],4:[function(require,module,exports){
var request
const state = require('./state')
const mapping =  require('./mapping')
const rendering = require('./rendering/render-classic')
const settings = require ('./settings')
const inputs = require('./input')
const control = require('./control')
const util = require('./util')

const ClassicCast = require('./types/classicCast')


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
            let reso = settings.get('resolution')
            let fov = settings.get('fov')
            let viewDist = settings.get('view distance')
    
            //One half of the FOV in radians - used to add and subtract from player orientation
            let halfFov = fov/2
    
            //Lower and upper angles that we scan between
            let lowerAngle = orientation - halfFov
            let upperAngle = orientation + halfFov

  
            //Retrieve the angle that is going to be scanned
            function getAngle(i){
                return (((upperAngle - lowerAngle) / reso[0]) * i ) + lowerAngle
            }
    
            let hits = []
    
            for(var i = 0; i < reso[0]; i++){
                colData = ClassicCast(position, getAngle(i), viewDist)
                
                rendering.RenderColumn(i, colData)
            }
            
            framer++
            if(framer > 1000)
                framer = 0
            lastFrame = timestamp
        }
    }
    
    requestAnimationFrame(performAnimation)
}
},{"./control":1,"./input":3,"./mapping":5,"./rendering/render-classic":6,"./settings":7,"./state":8,"./types/classicCast":9,"./util":12}],5:[function(require,module,exports){
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
},{"../settings":7,"../state":8,"../types/columnCast":10,"../util":12}],6:[function(require,module,exports){
const state = require('../state')
const util = require('../util')
const settings = require('../settings')
const Renderer = require('retro-render')

var gameRenderer

module.exports.init = () => {
    let resolution = settings.get('resolution')

    gameRenderer = Renderer.new('game')
    gameRenderer.generateScreen(resolution[0], resolution[1])

}

module.exports.RenderColumn = (column, columnData) => {
    let distance = settings.get('ray jump')

    let resolution = settings.get('resolution')

    let blockScale = state.getBlockScale()

    let eyeLine = Math.floor(resolution[1] / 2)
  
    let renderedHeight = resolution[1]

    for (var wallID in columnData[0]) {

        //Wall height data
        let wall = columnData[0][wallID]

        //The depth of the segment being viewed.
        let sectionDepth = columnData[1][wallID]

        // The height of the floor line for this chunk
        let floorLine = wall[0]

        // The height of the ceiling line for this chunk
        let ceilingLine = wall[0] + wall[1]

        // distance from the eye to the floor line
        let floorOffset = state.getEyeCoordinate() - floorLine


        let floorOffsetPixels = Math.round((util.calculateApparentSize(floorOffset, distance)/blockScale))
        
  
        let ceilingOffset = state.getEyeCoordinate() - ceilingLine
        let ceilingOffsetPixels = Math.round((util.calculateApparentSize(ceilingOffset, distance)/ blockScale))

        // Everything on and below this pixel is wall
        let floorOffsetScreenPosition =  eyeLine + floorOffsetPixels 
        let ceilingOffsetScreenPosition = eyeLine + ceilingOffsetPixels

        let farFloorOffsetPixels = Math.round((util.calculateApparentSize(floorOffset, distance + sectionDepth)/ blockScale))
        let farCeilingOffestPixels = Math.round((util.calculateApparentSize(ceilingOffset , distance + sectionDepth)/ blockScale))
        
        floorOffsetScreenPosition =  Math.min( Math.max( floorOffsetScreenPosition, 0 ), resolution[1] - 1 ) 
 
        ceilingOffsetScreenPosition = Math.min( Math.max( ceilingOffsetScreenPosition , 0 ), resolution[1] - 1 ) 


        //Everything on and below this pixel floor until you hit the wall
        let farFloorOffsetScreenPosition = Math.min( Math.max( eyeLine + farFloorOffsetPixels , 0 ), resolution[1] - 1 ) 
        let farCeilingOffsetScreenPosition = Math.min( Math.max( eyeLine + farCeilingOffestPixels , 0 ), resolution[1] - 1 ) 



        let lowestRender = renderedHeight;
        let pixelDistance = distance
        for (let i = farFloorOffsetScreenPosition; i <= floorOffsetScreenPosition; i++) {
            let color = "#FFFFFF"
            pixelDistance = distance
            if(i <= renderedHeight)
            {
                if(i < lowestRender)
                    lowestRender = i
                gameRenderer.screen.columnPixels[column][i].firstChild.style.color = util.changeColor(color,0)
            }
        }

        for(let i = floorOffsetScreenPosition; i < renderedHeight; i++){
            let color = '#444444'
            pixelDistance = distance
            if(i < renderedHeight)
            {
                if(i<lowestRender)
                    lowestRender = i
                gameRenderer.screen.columnPixels[column][i].firstChild.style.color = util.changeColor(color, -(distance ** 2))
            }   
        }

        for (let i = ceilingOffsetScreenPosition; i <= farCeilingOffsetScreenPosition; i++) {
            color = '#FFFFFF'
            if(i< renderedHeight){
                gameRenderer.screen.columnPixels[column][i].firstChild.style.color = util.changeColor(color,0)

            }

            
        }

        renderedHeight = lowestRender
        if(column == 0)
        {
            if(wallID == 0)
                settings.get('debug').innerHTML = ("There are x Items: " + columnData[0].length + "." + renderedHeight + " floor: " + floorOffsetScreenPosition +" " + farFloorOffsetScreenPosition + " ceil:" + ceilingOffsetScreenPosition + " " + farCeilingOffsetScreenPosition + " floor offset: " + floorOffsetPixels)
            else
                settings.get('debug').innerHTML += "<br>col2: " + (renderedHeight + " floor: " + floorOffsetScreenPosition +" " + farFloorOffsetScreenPosition + " ceil:" + ceilingOffsetScreenPosition + " " + farCeilingOffsetScreenPosition + " floor offset: " + floorOffsetPixels)
        }
        distance += sectionDepth
    }

}
},{"../settings":7,"../state":8,"../util":12,"retro-render":13}],7:[function(require,module,exports){
const Utility = require('../util')
const state = require('../state')
var settings = {}
var game = document.getElementById('game')
module.exports.load = () => {

}

module.exports.set = (key, value) =>{
    switch(key){
        case 'view distance':
            settings[key] = value
        case 'resolution':
            settings[key] = value
            state.setBlockScales()
        break;
        case 'font size':
            game.style.fontSize = value
            game.style.width = 
            document.documentElement.style.setProperty('--pixel-height', value +'px')
            document.documentElement.style.setProperty('--pixel-width', value * state.getPixelRatio() + 'px')
            document.documentElement.style.setProperty('--window-width',settings['resolution'][0] * value * state.getPixelRatio() + 'px')
        break;
        case "fov":
            settings[key] = Utility.degreesToRadians(value)
            state.setBlockScales()
        break;
        default:
            settings[key] = value
        break;
    }
}

module.exports.get = (key) => {
    return settings[key]
}
},{"../state":8,"../util":12}],8:[function(require,module,exports){
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


},{"../mapping":5,"../settings":7,"../types/vector3":11}],9:[function(require,module,exports){
const Mapping = require('../mapping')
const Settings = require('../settings')


module.exports = (position, direction, length) => {
    let culled = false
    let distance = 0.001

    let v = util.getNormal(direction)

    let hitList = []
    let hitDistances = []

    while(distance <= length || !culled)
    {
        let rayX = position.x + (distance * v.x)
        let rayY = position.z + (distance * v.y)
        
        let blockHit = Mapping.checkForHit(rayX, rayY)
        

        if(blockHit == null)
            culled = true
        else
        {

            let lastHit = hitList[hitList.length - 1]

            if(lastHit != null){
                if(blockHit[0] == lastHit[0] && blockHit[1] == lastHit[1]) {
                    hitDistances[hitList.length - 1] += Settings.get('ray jump')
                }
                else{
                    hitDistances.push(0)
                    hitList.push(blockHit)
                }
            }
            else
            {
                hitList.push(blockHit)
                hitDistances.push(0)
            }
        }
        distance += Settings.get('ray jump')
    }

    return [hitList, hitDistances]
}
},{"../mapping":5,"../settings":7}],10:[function(require,module,exports){
const Mapping = require('../mapping')
const Settings = require('../settings')
const state = require('../state')
 util = require('../util')

module.exports = (position, direction, length) => {
    let culled = false
    let distance = 1

    let v = util.getNormal(direction)

    /** What is the cast stack? 
     * 
     * A cast stack is a list of objects that a ray hits, sorted
     * front to back.
     * 
     * The ray casts out until it hits a space the player can't see into
     * or until it reaches the end of its allowable distance. It then reports
     * returns an array of elements it passed through.
     */
    let blockStack = []
    let characterStack = []

    let lastBlockHit
    let lastCharHit

    while(distance <= length || !culled)
    {
        let rayX = position.x + (distance * v.x)
        let rayY = position.z + (distance * v.y)

        let charHit = null // Mapping.checkForCharacterHit(rayX, rayY)
        let blockHit = Mapping.heightMapPoint(rayX, rayY)
        distance += Settings.get('ray jump')

        if(charHit != null)
        {
            if(charHit.id != lastCharHit.id)
                characterStack.unshift({hit:charHit, distance:distance})
        }

        if(blockHit == null)
        {
            culled = true
        }
        else
        {
            blockStack.push(blockHit)
        }
        lastCharHit = charHit
        lastBlockHit = blockHit
    }
    return blockStack
}
},{"../mapping":5,"../settings":7,"../state":8,"../util":12}],11:[function(require,module,exports){
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
},{}],13:[function(require,module,exports){
const tags = require('./tags')

module.exports.new = function(tagName) {
    this.viewport = document.getElementById(tagName)

    this.screen = {
        columnCount: 0,
        rowCount: 0,

        columnPixels: [],
        rowPixels: [],
        rows: [],

        matrix: [[]]
    }

    /** Generate a pixel array to draw on
     * 
     */
    this.generateScreen = (resolutionX, resolutionY, options) => {

        this.viewport.innerHTML = ""

        this.screen.columnCount = resolutionX
        this.screen.rowCount = resolutionY

        let totalScreenPixels = resolutionY * resolutionX

        for (let i = 0; i < totalScreenPixels; i++) {

            let column = i % resolutionX
            let row = Math.floor(i / resolutionX)
            
            //While establishing the first row of pixels
            //create a new array for each column both in
            //the columns and the matrix
            if (row == 0){
                this.screen.columnPixels[column] = []
                this.screen.matrix.push([])
            }

            //While establishing the first column on every row
            if (column == 0) {
                //Create a new list for that row's pixels
                this.screen.rowPixels[row] = []

                //Generate the row tag and add it to the rows
                //set
                let newRow = tags.row()
                this.screen.rows.push(newRow)

                //Add the new row to viewport
                this.viewport.appendChild(newRow)
            }

            //Create a new Pixel, initialize it with a block
            let pixelContainer =  tags.pixel()
            let pixel = pixelContainer.childNodes[0]
            
            pixel.innerHTML = '█'

            //Screen Housekeeping
            this.screen.columnPixels[column].push(pixelContainer)
            this.screen.rowPixels[row].push(pixelContainer)
            this.screen.matrix[column][row] = pixelContainer

            //Add the pixel to the screen
            this.screen.rows[row].appendChild(pixelContainer)

            if(options == null || options.useSubPixels == true){
                let newSubPixel = tags.subPixel()
                pixelContainer.appendChild(newSubPixel)
            }

        }

    }



    return this
}
},{"./tags":14}],14:[function(require,module,exports){
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
},{}]},{},[2]);
