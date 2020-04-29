module.exports = function( width, height ) {
    this.map = []
    this.height = height
    this.width = width
    this.layers = []
    this.layerCalibration = []

    function calibrate(width, height) {
        this.layerCalibration = []

        for(var layerNum in layers){
            this.layerCalibration.push(
                [ width / this.layers[layerNum][0], height / this.layers[layerNum][1]])
        }
        

    }

    this.getHeight = (x, y) => {
        let height = 0
        for(var layerNum in this.layers){

        }
    }

    this.pushLayer = (x, y) => {
        this.map.push([])
        this.layers.push([x, y])
        for(let i = 0; i < x; i++){
            map[0].push()
            for (let j = 0; j < y; j++) {
                map[0][i].push(0)
            }
    
        }

    }

    return this
}