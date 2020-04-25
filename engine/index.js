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
    {label: 'floor', height: 0, ceil:2.5, top:'#000000', bottom:'#AAAAAA' },
    {label: 'wall', height: 2.5, ceil:2.5, wall:'#DDDDDD', top:'#222222', bottom:'#AAAAAA'},
    {label: 'southWall', height: 2.5, ceil:2.5, wall:'#c75648', top:'#222222', bottom:'#AAAAAA'},
    {label: 'stepLow', height: 0.5, ceil:2.5, wall:'#555555', top:'#222222', bottom:'#AAAAAA'}
]

let temporaryMap = {header: temporaryMapHeader, data: temporaryMapData, block: temporaryMapBlocks}

Mapping.loadMap(temporaryMap)

input.init()
Settings.set('font size',16)

Renderer.generateScreen()


gameLoop()