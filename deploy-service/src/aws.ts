import { S3 } from "aws-sdk";
import fs from "fs";
import path from "path";
require("dotenv").config()

const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
})

export async function downloadS3Folder(prefix: string) {
    //array of strings that are all filepaths
    const allFiles = await s3.listObjectsV2({
        Bucket: "my-vercel-clone-bucket",
        Prefix: prefix
    }).promise();

    console.log("all files array:")
    console.log(allFiles)
    //
    const allPromises = allFiles.Contents?.map(async ({Key}) => {
        return new Promise(async (resolve) => {
            if (!Key) {
                resolve("");
                return;
            }
            const finalOutputPath = path.join(__dirname, Key); //dist/output/432123
            
            const outputFile = fs.createWriteStream(finalOutputPath);
            const dirName = path.dirname(finalOutputPath); 
            //if directory does  not exist then it creates before copying file
            if (!fs.existsSync(dirName)){
                fs.mkdirSync(dirName, { recursive: true });
            }
            s3.getObject({
                Bucket: "my-vercel-clone-bucket",
                Key
            }).createReadStream().pipe(outputFile).on("finish", () => {
                resolve("");
            })
            console.log("output path:")
            console.log(finalOutputPath)
        })
    }) || []
    console.log("awaiting");
    

    //await all promises to be copied before returning because this is async code.
    await Promise.all(allPromises?.filter(x => x !== undefined));

    console.log("all promises finished.")
}

export function copyFinalDist(id: string) {
    const folderPath = path.join(__dirname, `output/${id}/dist`);
    const allFiles = getAllFiles(folderPath);
    console.log("all files to be uploaded to dist s3 folder: ")
    // console.log(allFiles)
    allFiles.forEach(file => {
        var tmp = path.normalize(file)
        var newPath = tmp.replace(/\\/g, '/');
        console.log(newPath)
        uploadFile(`dist/${id}/` + newPath.slice(folderPath.length + 1), newPath);
    })
}

const getAllFiles = (folderPath: string) => {
    let response: string[] = [];

    const allFilesAndFolders = fs.readdirSync(folderPath);allFilesAndFolders.forEach(file => {
        const fullFilePath = path.join(folderPath, file);
        if (fs.statSync(fullFilePath).isDirectory()) {
            response = response.concat(getAllFiles(fullFilePath))
        } else {
            response.push(fullFilePath);
        }
    });
    return response;
}

const uploadFile = async (fileName: string, localFilePath: string) => {
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body: fileContent,
        Bucket: "my-vercel-clone-bucket",
        Key: fileName,
    }).promise();
    console.log(response);
}