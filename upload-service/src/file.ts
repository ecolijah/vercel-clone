import fs from 'fs';
import path from 'path';

export const getAllFiles = (folderPath: string) => {

    // initialize empty array of type: string.
    let response: string[] = [];

    // use fs to read the directory synchronously.
    const allFilesAndFolders = fs.readdirSync(folderPath);

    /* for each file (or directory), either join the path when a file is discovered
    or call the function recursively to dive into a directory. */
    allFilesAndFolders.forEach(file => {

        // variable to store full filepath if file is found.
        const fullFilePath = path.join(folderPath,file)

        // if we come across adirectory, call the function recursively.
        if (fs.statSync(fullFilePath).isDirectory()) {

            // concatenate the paths to essentialy join them.
            response = response.concat(getAllFiles(fullFilePath))
        } else {

            // if not directory, push the full file path to the response array.
            response.push(fullFilePath)
        }
        
    });

    // return array
    return response;
}