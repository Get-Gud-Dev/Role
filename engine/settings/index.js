const Utility = require('../util')
const state = require('../state')
var settings = {}
var game = document.getElementById('game')
module.exports.load = () => {

}

module.exports.set = (key, value) =>{
    switch(key){
        case 'view distance':
            settings[key] = value
        case 'resolution':
            settings[key] = value
        break;
        case 'font size':
            game.style.fontSize = value
            game.style.width = 
            document.documentElement.style.setProperty('--pixel-height', value +'px')
            document.documentElement.style.setProperty('--pixel-width', value * state.getPixelRatio() + 'px')
            document.documentElement.style.setProperty('--window-width',settings['resolution'][0] * value * state.getPixelRatio() + 'px')
        break;
        case "fov":
            settings[key] = Utility.degreesToRadians(value)
        break;
        default:
            settings[key] = value
        break;
    }
}

module.exports.get = (key) => {
    return settings[key]
}