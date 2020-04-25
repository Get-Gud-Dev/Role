module.exports = function(x, y, z) {
    this.x = x
    this.y = y
    this.z = z
    
    this.length = () => {
        return Math.sqrt(this.x**2 + this.y**2 + this.z**2) 
    }

    this.multiply = (val) => {
        this.x = this.x*val
        this.y = this.y*val
        this.z = this.z*val
        return this
    }

    this.normalized = () => {
        let length = this.length()
        this.x = this.x / length
        this.y = this.y / length
        this.z = this.z / length
        return this
    }
    
}