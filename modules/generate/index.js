const mergeImages = require('merge-images');
const { Canvas, Image } = require('canvas');
const fs = require("fs");
const sharp = require('sharp');

const combineImages = async ({ imageDatas, resPath }) => {

    var bs64 = await mergeImages(imageDatas, {
        Canvas: Canvas,
        Image: Image
    });
    // bs64 = await resizeImg(bs64, 800, 800);
    console.log("generated");
    bs64 = bs64.replace(/^data:image\/png;base64,/, "");
    fs.writeFileSync(resPath, bs64, 'base64', (err) => {
        console.log("save error", err);
    })
}

const resizeImg = async (base64Image, minH, minW) => {
    let parts = base64Image.split(';');
    let mimType = parts[0].split(':')[1];
    let imageData = parts[1].split(',')[1];

    var img = Buffer.from(imageData, 'base64');
    var resizedImageBuffer = await sharp(img)
        .resize(minH, minW)
        .toBuffer();
    let resizedImageData = resizedImageBuffer.toString('base64');
    let resizedBase64 = `data:${mimType};base64,${resizedImageData}`;
    return resizedBase64;
}

module.exports = { combineImages };
