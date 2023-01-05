#! /usr/bin/env node
import chalk from 'chalk'
import { createRequire } from "module";
import { createCanvas, loadImage } from 'canvas'
const require = createRequire(import.meta.url);
const { exec } = require('child_process');
const fs = require('fs')

/*
[command list]
node index.js --convert-data default ${path}
node index.js --convert ${size} ${path}

[command initiator]
--convert => converts and shows the result
--convert-save => converts, saves the output, and opens the image

[size] :: Matrix size
default => 8 by 8
`${num}x${num}` => number by number
*/

const USER_INPUT = {
  BASIC_CONVERSION: '--convert-data',
  SAVE_CONVERSION: '--convert-save',
  PREVIEW_CONVERSION: '--convert-preview',
  DEFAULT_SIZE: 'default'
}

const imagePixelified = (arr, matrixSize) => {
  const { width, height } = matrixSize
  const outputCanvas = createCanvas(width * 100, height * 100)
  const outputCtx = outputCanvas.getContext('2d')
  
  for (let i=0; i < arr.length; i++) {
  
    const y = (i / width | 0) * 100
    const x = (i % width) * 100
    outputCtx.fillStyle = arr[i]
    outputCtx.fillRect(x, y, 100, 100)
  }
  
  return outputCanvas
}

const pathValidator = async (path) => {
  try {
    fs.statSync(path)
  } catch (err) {
    try {
      const image = await loadImage(path)
    } catch (err) {
      if (err.code === 'ENOENT' || err.code === 'ENOTFOUND') {
        const targetImage = path.split('/').slice(-1)
        console.log()
        console.error(`ERROR :: Image "${targetImage}" Does Not Exist..!`)
        console.error('Please Check Image Path')
        console.log()
      }
    }
  }
}

const colorGetter = (ctx, isTrue) => {
  const imageData = ctx.getImageData(0, 0, 1, 1).data
  const r = imageData[0].toString(16).length < 2 ? "0" + imageData[0].toString(16) : imageData[0].toString(16)
  const g = imageData[1].toString(16).length < 2 ? "0" + imageData[1].toString(16) : imageData[1].toString(16)
  const b = imageData[2].toString(16).length < 2 ? "0" + imageData[2].toString(16) : imageData[2].toString(16)
  const a = imageData[3]
  const hexColor = `#${r}${g}${b}`
  
  return {
    colorCode: (hexColor === '#000000' || a === 0) ? '#00000000' : hexColor, intensity: a
  }
}

export const pixelify = async (imagePath, matrixSize) => {
  const { width, height } = matrixSize
  const inputImage = await loadImage(imagePath)
  const imageCanvas = createCanvas(width * 100, height * 100)
  const pixelCanvas = createCanvas(1, 1)
  const imageCtx = imageCanvas.getContext('2d')
  const pixelCtx = pixelCanvas.getContext('2d')
  
  const imagePixelContainer = []
  
  imageCtx.drawImage(inputImage, 0, 0, imageCanvas.width, imageCanvas.height)
  
  for (let i=0; i < width * height; i++) {
    const y = (i / width | 0) * 100
    const x = (i % width) * 100
  
    pixelCtx.clearRect(0, 0, 1, 1)
    pixelCtx.drawImage(imageCanvas, x, y, 100, 100, 0, 0, 1, 1)
    
    const pixelData = colorGetter(pixelCtx)
  
    imagePixelContainer.push(pixelData)
  }
  
  return { imagePixelContainer }
}

(async () => {
  if (process.argv.length > 2) {
    const inputCommand = process.argv.slice(2, 3)[0]
    const sizeOption = process.argv.slice(3, 4)[0]
    const userInput = process.argv.slice(4)
    const matrixSize = {
      width: sizeOption === USER_INPUT.DEFAULT_SIZE ? 8 : Number(
        sizeOption.split('x')[0]),
      height: sizeOption === USER_INPUT.DEFAULT_SIZE ? 8 : Number(
        sizeOption.split('x')[1])
    }
    const result = {}
  
    if (![
      USER_INPUT.BASIC_CONVERSION,
      USER_INPUT.SAVE_CONVERSION,
      USER_INPUT.PREVIEW_CONVERSION].includes(inputCommand)) {
      console.log()
      console.log('Invalid Command..!')
      console.log()
      return
    }
  
    // loop by the number of images used
    for (let image = 0; image < userInput.length; image++) {
    
      // path validation
      const imagePath = userInput[image]
      const fileExists = pathValidator(imagePath)
    
      if (fileExists) {
        const imageName = imagePath.split('/').slice(-1)[0].split('.')[0]
        const { imagePixelContainer } = await pixelify(imagePath, matrixSize)
      
        result[imageName] = imagePixelContainer
      
        if (inputCommand === USER_INPUT.SAVE_CONVERSION) {
          const savePath = imagePath.split('.').join('_pixelified.')
          const stream = imagePixelified(
            result[imageName].map(c => c.colorCode), matrixSize)
          .createPNGStream()
          const output = fs.createWriteStream(savePath)
          stream.pipe(output)
        
          exec(`open ${savePath}`, (err, stdout) => {
            if (err) console.error(err)
            return stdout
          })
        }
      }
    }
  
    if (USER_INPUT.PREVIEW_CONVERSION === inputCommand) {
      for (let elem in result) {
        console.log(chalk.blue('Pixel Data Preview'));
        console.log([elem])
        for (let i = 0; i < result[elem].length; i+=matrixSize.width) {
          let horizontal = ' '
          for (let j = i; j < i + matrixSize.width; j++) {
            horizontal += chalk.hex(result[elem][j].colorCode).bold('◻ ')
          }
          console.log(horizontal)
        }
        console.log()
      }
    } else {
      console.log(result)
    }
  }
})()