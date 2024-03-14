
import { createClient, commandOptions } from "redis";
import { copyFinalDist, downloadS3Folder } from "./aws";
import { buildProject } from "./utils";

//create a redis client to pop the next build jobs id from the queue.
const subscriber = createClient();
subscriber.connect();

const publisher = createClient();
publisher.connect();

async function main() {
    while(1) {
        const res = await subscriber.brPop(
            commandOptions({ isolated: true }),
            'build-queue',
            0 //wait forever
          );
        // @ts-ignore; //redis thinks its returning a string but its actually an object?
        const id = res.element
        console.log(res) //testting redis connectivity
        await downloadS3Folder(`output/${id}`) //uploaded from windows so its in backslahes ugh
        console.log("folder downloaded.")
        await buildProject(id); //build project
        //copy the final build folder back into s3
        copyFinalDist(id);
        // publisher.hSet("status", id, "deployed")
    }
}
main();