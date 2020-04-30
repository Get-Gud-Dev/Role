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