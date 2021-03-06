const { createCanvas, registerFont, Context2d, Canvas } = require('canvas')

const ASSETS_SRC = './assets'

module.exports = {
    init() {
        Context2d.prototype.printTextBox = function (text, x, y, lH, fit) {
            fit = fit || 0
            var ctx = this


            if (fit <= 0) {
                ctx.fillText(text, x, y)
                return
            }

            let words = text.split(' ')
            let currentLine = 0
            let idx = 1

            while (words.length > 0 && idx <= words.length) {
                let str = words.slice(0, idx).join(' ')
                let w = ctx.measureText(str).width
                if (w > fit) {
                    if (idx === 1) {
                        idx = 2
                    }
                    let { width } = ctx.measureText(words.slice(0, idx - 1).join(' '))

                    ctx.fillText(words.slice(0, idx - 1).join(' '), x + (fit - width) / 2, y + (lH * currentLine))
                    currentLine++
                    words = words.splice(idx - 1)
                    idx = 1
                }
                else idx++
            }
            if (idx > 0) {
                let { width } = ctx.measureText(words.join(' '))
                ctx.fillText(words.join(' '), x + (fit - width) / 2, y + (lH * currentLine))
            }
        }

        Canvas.prototype.blur = function (blur) {
            const ctx = this.getContext('2d')

            const delta = 5
            const alphaLeft = 1 / (2 * Math.PI * delta * delta)
            const step = blur < 3 ? 1 : 2
            let sum = 0
            for (let y = -blur; y <= blur; y += step) {
                for (let x = -blur; x <= blur; x += step) {
                    let weight = alphaLeft * Math.exp(-(x * x + y * y) / (2 * delta * delta))
                    sum += weight
                }
            }
            for (let y = -blur; y <= blur; y += step) {
                for (let x = -blur; x <= blur; x += step) {
                    ctx.globalAlpha = alphaLeft * Math.exp(-(x * x + y * y) / (2 * delta * delta)) / sum * blur
                    ctx.drawImage(this, x, y)
                }
            }
            ctx.globalAlpha = 1
        }

        Context2d.prototype.drawBlurredImage = function (image, blur, imageX, imageY, w = image.width, h = image.height) {
            const canvas = createCanvas(w, h)
            const ctx = canvas.getContext('2d')
            ctx.drawImage(image, 0, 0, w, h)
            canvas.blur(blur)
            this.drawImage(canvas, imageX, imageY, w, h)
        }

        Context2d.prototype.roundImageCanvas = function (img, w = img.width, h = img.height, r = w * 0.5) {
            const canvas = createCanvas(w, h)
            const ctx = canvas.getContext('2d')

            ctx.clearRect(0, 0, canvas.width, canvas.height)

            ctx.globalCompositeOperation = 'source-over'
            ctx.drawImage(img, 0, 0, w, h)

            ctx.fillStyle = '#fff'
            ctx.globalCompositeOperation = 'destination-in'
            ctx.beginPath()
            ctx.arc(w * 0.5, h * 0.5, r, 0, Math.PI * 2, true)
            ctx.closePath()
            ctx.fill()

            return canvas
        }


        Context2d.prototype.roundImage = function (img, x, y, w, h, r) {
            this.drawImage(this.roundImageCanvas(img, w, h, r), x, y, w, h)
            return this
        }

        this.registerFonts()
    },

    registerFonts() {
        registerFont(ASSETS_SRC + "/fonts/RobotoCondensed-Bold.ttf", { family: 'RobotoCondensed', weight: 'bold' })
        registerFont(ASSETS_SRC + "/fonts/RobotoCondensed-BoldItalic.ttf", { family: 'RobotoCondensed', weight: 'bold', style: 'italic' })
        registerFont(ASSETS_SRC + "/fonts/RobotoCondensed-Italic.ttf", { family: 'RobotoCondensed', style: 'italic' })
        registerFont(ASSETS_SRC + "/fonts/RobotoCondensed-Light.ttf", { family: 'RobotoCondensed-Light' })
        registerFont(ASSETS_SRC + "/fonts/RobotoCondensed-LightItalic.ttf", { family: 'RobotoCondensed-Light', style: 'italic' })
        registerFont(ASSETS_SRC + "/fonts/RobotoCondensed-Regular.ttf", { family: 'RobotoCondensed' })
    }
}
