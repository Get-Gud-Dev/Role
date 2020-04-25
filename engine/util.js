module.exports.degreesToRadians = (deg) => {

    return (deg * Math.PI)/180
}

module.exports.north = this.degreesToRadians(90)

module.exports.west = this.degreesToRadians(180)

module.exports.south = this.degreesToRadians(270)

module.exports.east = this.degreesToRadians(0)

module.exports.calculateApparentSize = (normalSize, distance) => {
    return normalSize / distance
}

module.exports.getNormal = (direction) => {
    let v = {}
    v.x = Math.cos(direction)
    v.y = Math.sin(direction)
    return v
}

module.exports.changeColor = (col, amt) => {
  
    var usePound = false;
  
    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }
 
    var num = parseInt(col,16);
 
    var r = (num >> 16) + amt;
 
    if (r > 255) r = 255;
    else if  (r < 0) r = 0;
 
    var b = ((num >> 8) & 0x00FF) + amt;
 
    if (b > 255) b = 255;
    else if  (b < 0) b = 0;
 
    var g = (num & 0x0000FF) + amt;
 
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
 
    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
  
}