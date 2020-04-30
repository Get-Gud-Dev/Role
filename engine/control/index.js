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
        if(  (Math.sqrt(squareMag)) <= state.getMaxSpeed()){
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