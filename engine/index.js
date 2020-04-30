const gameLoop = require('./loop')
const Mapping = require('./mapping')
const GameState = require('./state')
const Settings = require('./settings')
const Renderer = require('./rendering/render-classic')
const util = require('./util')
const input = require('./input')

const Vector3 = require('./types/vector3')

// Configure a player
GameState.setPosition(4,0,7)
GameState.setDirection(util.north)
GameState.setPixelRatio(0.5)
GameState.setEyePoint(1.85)

// Load the map
Settings.set('resolution', [75, 22])
Settings.set('fov', 90)
Settings.set('view distance', 50)
Settings.set('ray jump', 0.3)
Settings.set('debug', document.getElementById('debug'))
let temporaryMapHeader = {name:"Test map", blockSize:3, blockHeight:2.5}

let temporaryMapData = [ 
    [[4,0],[4,0],[4,0],[4,0],[4,0],[4,0],[4,0],[4,0],[4,0],[4,0]],
    [[4,0],[0,4],[0,4],[0,4],[0,4],[0,4],[0,4],[0,4],[0,4],[4,0]],
    [[4,0],[0,4],[0,4],[0,4],[0,4],[0,4],[0,4],[0,4],[0,4],[4,0]],
    [[4,0],[0,4],[0,4],[0,4],[0,4],[0,4],[0,4],[0,4],[0,4],[4,0]],
    [[4,0],[0,4],[0,4],[0,4],[0,4],[0,4],[0,4],[0,4],[0,4],[4,0]],
    [[4,0],[0,4],[0,4],[0,4],[0,4],[0,4],[0,4],[0,4],[0,4],[4,0]],
    [[4,0],[0,4],[0,4],[0,4],[0,4],[0,4],[0,4],[0,4],[0,4],[4,0]],
    [[4,0],[4,0],[4,0],[4,0],[4,0],[4,0],[4,0],[4,0],[4,0],[4,0]]
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