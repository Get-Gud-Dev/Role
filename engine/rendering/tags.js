module.exports.row = () => {
    let newRow = document.createElement('span')
    newRow.classList.add('row')

    return newRow
}

module.exports.pixel = () => {
    let newPixelContainer = document.createElement('span')
    newPixelContainer.classList.add('pixel-container')

    let newPixel = document.createElement('span')
    newPixel.classList.add('pixel')

    newPixelContainer.appendChild(newPixel)

    return newPixelContainer
}

module.exports.subPixel = () => {
    let newSubPixelContainer = document.createElement('span')
    newSubPixelContainer.classList.add('subpixel-container')

    

    let subPixel0 = document.createElement('span')
    let subPixel1 = document.createElement('span')
    let subPixel2 = document.createElement('span')
    let subPixel3 = document.createElement('span')

    subPixel0.classList.add('subpixel')
    subPixel1.classList.add('subpixel')
    subPixel2.classList.add('subpixel')
    subPixel3.classList.add('subpixel')

    subPixel0.classList.add('subpixel0')
    subPixel1.classList.add('subpixel1')
    subPixel2.classList.add('subpixel2')
    subPixel3.classList.add('subpixel3')


    newSubPixelContainer.appendChild(subPixel0)
    newSubPixelContainer.appendChild(subPixel1)
    newSubPixelContainer.appendChild(subPixel2)
    newSubPixelContainer.appendChild(subPixel3)

    return newSubPixelContainer
}