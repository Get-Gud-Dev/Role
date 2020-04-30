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