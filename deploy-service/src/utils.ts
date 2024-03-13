import { exec, spawn } from "child_process";
import path from "path";

export function buildProject(id: string) {
    return new Promise((resolve) => {
        //execute nodejs process to build project
        const child = exec(`cd ${path.join(__dirname, `output/${id}`)} && npm install && npm run build`)

        //logs
        child.stdout?.on('data', function(data) {
            console.log('stdout: ' + data);
        });
        child.stderr?.on('data', function(data) {
            console.log('stderr: ' + data);
        });

        //whenever proccess exits, we resolve promise
        child.on('close', function(code) {
           resolve("")
        });

    })

}