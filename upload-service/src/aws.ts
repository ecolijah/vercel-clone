import { S3} from 'aws-sdk';
import fs from  'fs';

// set up s3 bucket
const s3 =  new S3({
    accessKeyId: "",
    secretAccessKey: "",
    endpoint: ""
})

// fileName => output/12312/src/App.jsx
// filePath => /Users/harkiratsingh/vercel/dist/output/12312/src/App.jsx
export const uploadFile = async (fileName: string, localFilePath: string) => {
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body: fileContent,
        Bucket: "vercel-clone",
        Key: fileName,
    }).promise();
    console.log(response);
}