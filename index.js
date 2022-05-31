const { combineImages } = require("./modules/generate")
const { upload_IPFS } = require("./modules/ipfs")
const fs = require('fs');

const initDatas = {
    dirs: ["datas/foot", "datas/body", "datas/head", "datas/back", "datas/wing", "datas/horn", "datas/eye"],
    // dirs: ["emoji/body", "emoji/eye1", "emoji/eye2"],
    resImgPath: "export-images",
    resDataPath: "exports/hashes.json",
    combineDatas: [],
    index: 0
}

const generate_images = async () => {
    var totalCount = 0;
    const generate = async ({ dirs, combineDatas, resImgPath, index }) => {
        if (dirs[index] == null) {

            console.log("generate");
            await combineImages({ imageDatas: combineDatas, resPath: `${resImgPath}/res_${totalCount}.png` });
            totalCount++;
            return;
        }

        const length = fs.readdirSync(dirs[index]).length;
        for (var i = 1; i <= length; i++) {
            await generate({ dirs, combineDatas: combineDatas.concat([`${dirs[index]}/c (${i}).png`]), index: index + 1, resImgPath })
        }
    }
    await generate(initDatas);
}

const uploadImages = async () => {
    const upload = async ({ resImgPath, resDataPath }) => {
        const length = fs.readdirSync(resImgPath).length;
        var imageDatas = [];
        for (var i = 0; i < length; i++) {
            imageDatas.push(`${resImgPath}/res_${i}.png`);
        }
        await upload_IPFS({ imageDatas, resPath: resDataPath });
    }

    await upload(initDatas);
}

// generate_images().then((res) => {
//     console.log("complete")
// }).catch((err) => {
//     console.log(err.message);
// });

uploadImages();