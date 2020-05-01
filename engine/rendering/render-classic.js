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
                settings.get('debug').innerHTML = (renderedHeight + " floor: " + floorOffsetScreenPosition +" " + farFloorOffsetScreenPosition + " ceil:" + ceilingOffsetScreenPosition + " " + farCeilingOffsetScreenPosition + " floor offset: " + floorOffsetPixels)
            else
                settings.get('debug').innerHTML += "<br>col2: " + (renderedHeight + " floor: " + floorOffsetScreenPosition +" " + farFloorOffsetScreenPosition + " ceil:" + ceilingOffsetScreenPosition + " " + farCeilingOffsetScreenPosition + " floor offset: " + floorOffsetPixels)
        }
        distance += sectionDepth
    }

}