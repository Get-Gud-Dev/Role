const state = require('../state')
const util = require('../util')

var inputState = {
    vertical:0,
    horizontal:0,
    mouse_x:0,
    mouse_y:0,
    last_mouse_x:0,
    last_mouse_y:0,
    delta_mouse_x:0,
    delta_mouse_y:0,
}

var timer

module.exports.getState = () => {
    return inputState
}

module.exports.init = () => {

document.addEventListener('keydown', keyDown)

function keyDown(e) {
    if(e.code == 'KeyW'){
        inputState.vertical = 1
    }
    if(e.code == 'KeyS'){
        inputState.vertical = -1
    }
    if(e.code == 'KeyA'){
        inputState.horizontal = 1
    }
    if(e.code == 'KeyD'){
        inputState.horizontal = -1
    }
}

document.addEventListener('keyup', keyUp)
    function keyUp(e) {
        if(e.code == 'KeyW'){
                inputState.vertical = 0
        }
        if(e.code == 'KeyS'){
                inputState.vertical = 0
        }
        if(e.code == 'KeyA'){
                inputState.horizontal = 0
        }
        if(e.code == 'KeyD'){
                inputState.horizontal = 0
        }
    }

    document.addEventListener("mousemove", function(ev){
        inputState.last_mouse_x = inputState.mouse_x
        inputState.last_mouse_y = inputState.mouse_y

        inputState.mouse_x = ev.screenX
        inputState.mouse_y = ev.screenY

        inputState.delta_mouse_x = inputState.mouse_x - inputState.last_mouse_x
        inputState.delta_mouse_y = inputState.mouse_y - inputState.last_mouse_y

        clearTimeout(timer)
        timer=setTimeout(mouseStopped,30)

    }, false);

    function mouseStopped(){
        inputState.last_mouse_x = inputState.mouse_x
        inputState.last_mouse_y = inputState.mouse_y

        inputState.delta_mouse_x = inputState.mouse_x - inputState.last_mouse_x
        inputState.delta_mouse_y = inputState.mouse_y - inputState.last_mouse_y        
    }
}
