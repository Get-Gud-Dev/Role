const Mapping = require('../mapping')

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
        let pointHit = {beginDistance:distance, endDistance:distance}

        let rayX = position.x + (distance * v.x)
        let rayY = position.z + (distance * v.y)

        let charHit = Mapping.checkForCharacterHit(rayX, rayY)
        let blockHit = Mapping.checkForHit(rayX, rayY)
        distance += 0.3

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
            //Check if we need to cull
            if(blockHit.ceil != null)
                //This would be the case where the wall
                //meets the ceiling.
                if(blockHit.height == blockHit.ceil)
                    culled = true
            //Here there's no ceiling, the only thing we
            //need to know is if the object is so tall as to
            //obstruct view 
            else
            {
                let thresholdHeight = util.calculateApparentSize(state.getEyePoint() * 2)
                if(blockHit.height > thresholdHeight)
                    culled = true
                
            }

            if(lastBlockHit != null)
                if(blockHit.height == lastBlockHit.height &&
                    blockHit.ceil == lastBlockHit.ceil)
                    
                else
                    pointHit.block = blockHit
        }
        lastCharHit = charHit
        lastBlockHit = blockHit
    }
    return castStack
}