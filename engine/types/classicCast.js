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