import { S3} from 'aws-sdk';
import fs from  'fs';
require('dotenv').config();


// set up s3 bucket
const s3 =  new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
})

// fileName => output/12312/src/App.jsx
// filePath => /Users/elijah/vercel/dist/output/12312/src/App.jsx
export const uploadFile = async (fileName: string, localFilePath: string) => {
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body: fileContent,
        Bucket: "my-vercel-clone-bucket",
        Key: fileName,
    }).promise();
    console.log(response);
}