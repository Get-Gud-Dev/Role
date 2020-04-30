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

    let eyeLine = Math.floor(resolution[1] / 2) - 1

    // The upper and lower screen bounds are the
    // highest and lowest rows that can still be
    // drawn on.
    let topPixelsDrawn = 0
    let bottomPixelsDrawn = 0

    let renderData = []

    renderData.length = resolution[1]
    //Walls are detected closeset to furthest in chunks
    let sectionData = []
    for (var wallID in columnData) {

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
        let floorOffsetScreenPosition =  Math.min( Math.max( eyeLine + floorOffsetPixels , 0 ), resolution[1] - 1 ) 
 
        let ceilingOffsetScreenPosition = Math.min( Math.max( eyeLine + ceilingOffsetPixels , 0 ), resolution[1] - 1 ) 

        let farFloorOffsetPixels = Math.round((util.calculateApparentSize(floorOffset, distance + sectionDepth)/ blockScale))
        let farCeilingOffestPixels = Math.round((util.calculateApparentSize(ceilingOffset , distance + sectionDepth)/ blockScale))


        //Everything on and below this pixel floor until you hit the wall
        let farFloorOffsetScreenPosition = Math.min( Math.max( eyeLine + farFloorOffsetPixels , 0 ), resolution[1] - 1 ) 
        let farCeilingOffsetScreenPosition = Math.min( Math.max( eyeLine + farCeilingOffestPixels , 0 ), resolution[1] - 1 ) 


        let topPixelsTemp = 0
        let bottomPixelsTemp = 0

        for (let i = farFloorOffsetScreenPosition; i < resolution[1] - 1 - bottomPixelsDrawn; i++) {
            let color = "#FFFFFF"
            if (i >= floorOffsetScreenPosition) {
                color = '#444444'
            }
            if (i < resolution[1] - 1 && i >= 0) {
                gameRenderer.screen.columnPixels[column][i].firstChild.style.color = util.changeColor(color, 0) //(pixelDistance))
                bottomPixelsTemp++
            }
        }

        for (let i = topPixelsDrawn; i < farCeilingOffsetScreenPosition; i++) {
            let color = "#444444"
            let pixelDistance = distance
            if (i >= ceilingOffsetScreenPosition) {
                color = '#FFFFFF'
            }
            if (i < resolution[1] - 1 && i >= 0) {
                gameRenderer.screen.columnPixels[column][i].firstChild.style.color = util.changeColor(color, 0)//(pixelDistance))
                topPixelsTemp++
            }
        }

        topPixelsDrawn += topPixelsTemp
        bottomPixelsDrawn += bottomPixelsTemp
        distance += sectionDepth
    }

}