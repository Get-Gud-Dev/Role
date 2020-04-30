
let util = require('../util')
let settings = require('../settings')
let state = require('../state')

module.exports = (dataSet, angle) => {
    let v = util.getNormal(angle)
    let rayJump = settings.get('ray jump')
    v.y = v.y * rayJump
    v.x = v.x * rayJump

    //Looking down the x acis in intervals
    for( dataID in dataSet )
    {
        let data = dataSet[dataID]
        let yPoint = state.getPosition().y + state.getEyePoint + dataID*v.y
        
        // If the data at this point is an array
        // We could be dealing with a ceiling floor or multiple
        // floors.
        if(Array.isArray(data))
        {
            
            for(dataPointID in data)
            {
                let dataPoint = data[dataPointID]
                // If the first datapoint in the set is an array
                // We know we are dealing with multiple floors
                if(dataPointID == 0 && Array.isArray(dataPoint))
                {
                    //Looking through the multiFloor data
                    for(multiFloorDataID in data)
                    {
                        let multiFloorData = data[multiFloorDataID]
                        //Beneath the floor
                        if(yPoint < multiFloorData[0])
                        {
                            //Hit a floor
                            if(yPoint < multiFloorData[0] - rayJump)
                            {
                                return {hit: 0, distance: (dataID * v.y)**2 + (dataID * v.x)**2 }   
                            }
                            //Hit a wall
                            else
                            {
                                return {hit: 1, distance: (dataID * v.y)**2 + (dataID * v.x)**2 }   
                            }
                        }
                        //Above the ceiling
                        if(yPoint > multiFloorData[1])
                        {
                            let nextPoint = data[multiFloorDataID + 1]

                            if(Array.isArray(nextPoint))
                            {
                                let floorHeight = (multiFloorData[0] + nextPoint[0])
                                
                                if(yPoint > floorHeight)
                                {
                                    
                                }
                                else
                                {
                                    if(yPoint < floorHeight - rayJump)
                                    {
                                        return {hit: 1, distance: (dataID * v.y)**2 + (dataID * v.x)**2}
                                    }
                                    else if(yPoint < floorHeight)
                                    {
                                        return {hit: 0, distance: (dataID * v.y)**2 + (dataID * v.x)**2}
                                    }
                                }
                            }
                            else
                            {
                                if(yPoint > nextPoint)
                                {

                                }
                                else{
                                    if(yPoint < nextPoint - rayJump)
                                        return {hit:1, distance: (dataID * v.y)**2 + (dataID * v.x)**2}
                                    else if(yPoint < nextPoint)
                                        return {hit:0, distance:(dataID * v.y)**2 + (dataID * v.x)**2}
                                }
                            }

                        }
                    }
                }
            }
        }
        // if it isn't an array, we only draw a floor
        else
        {
            if( yPoint < data - rayJump)
                return {hit: 1, distance:(dataID * v.y)**2 + (dataID * v.x)**2}
            else if( yPoint < data)
                return {hit: 0, distance: (dataID * v.y)**2 + (dataID * v.x)**2}
        }
    }
}