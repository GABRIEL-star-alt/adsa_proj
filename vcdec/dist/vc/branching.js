import { create } from "ipfs-http-client";
import { Isvcdec } from "../utils/checkvcdec.js";
import fs from 'fs';
import { FetchConfig } from "../utils/fetchConfig.js";
import path from "path";
import Path from 'path';
import { multihashToCID } from "../utils/cid.js";
import { isOverriding } from "../utils/changes.js";
import { commitContent } from "../utils/fetchContent.js";
import { readAllFiles } from "../utils/dirwalk.js";
function deleteFolderRecursive(folderPath) {
    if (fs.existsSync(folderPath)) {
        fs.readdirSync(folderPath).forEach((file) => {
            const curPath = path.join(folderPath, file);
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            }
            else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(folderPath);
    }
}
function deleteFoldersAndFilesExceptvcdecAndPaths(cwd, pathsToKeep) {
    const vcdecPath = path.join(cwd, '.vcdec');
    if (!fs.existsSync(vcdecPath)) {
        return;
    }
    const filesAndFolders = fs.readdirSync(cwd);
    for (const fileOrFolder of filesAndFolders) {
        const filePath = path.join(cwd, fileOrFolder);
        if (fileOrFolder === '.vcdec' || pathsToKeep.includes(filePath)) {
            continue;
        }
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            deleteFolderRecursive(filePath);
        }
        else {
            fs.unlinkSync(filePath);
        }
    }
}

export async function List(cwd) {
    try {
        Isvcdec(cwd);
        // List all files
        const currentBranch = fs.readFileSync(cwd + "/.vcdec/HEAD").toString();
        const files = fs.readdirSync(cwd + "/.vcdec/heads");
        for (const file of files) {
            if (file === currentBranch) {
                console.log("-> " + file + " <-");
            }
            else {
                console.log(file);
            }
        }
    }
    catch (err) {
        console.error(err);
    }
}
export async function Jump(cwd, branch) {
    try {
        Isvcdec(cwd);
        const currentBranch = fs.readFileSync(cwd + "/.vcdec/HEAD").toString();
        if (branch === currentBranch) {
            console.log("Already on branch " + branch);
            return;
        }
        const currentHead = fs.readFileSync(cwd + "/.vcdec/heads/" + currentBranch).toString();
        // Check for staged changes
        if (fs.readFileSync(cwd + "/.vcdec/SNAPSHOT").toString().length) {
            console.log("There are staged changes. You cannot switch branch without commiting it");
            return;
        }
        if (!fs.existsSync(cwd + "/.vcdec/heads/" + branch)) {
            console.log("Branching out to " + branch + "...");
            fs.writeFileSync(cwd + "/.vcdec/heads/" + branch, currentHead);
            fs.writeFileSync(cwd + "/.vcdec/HEAD", branch);
        }
        else {
            const commitId = fs.readFileSync(cwd + "/.vcdec/heads/" + branch).toString();
            const client = create({ url: FetchConfig(cwd).ipfs_node_url });
            console.log("Switching to branch " + branch + "\n" + "Head commit <" + commitId + ">");
            const currentFiles = [...readAllFiles(cwd)];
            // Check for unstaged changes
            const oldBranchContent = await commitContent(currentHead, client);
            const { overrides: hasUnstagedChanges, newFiles: addedFiles, updated: unstagedChanges, deletedFiles } = await isOverriding(cwd, client, oldBranchContent, currentFiles);
            // Handle the case where not unstaged but overriding
            // Solution: Prevent only if added files and deleted files are overriding
            // Check for overriding changes
            const newBranchContent = await commitContent(commitId, client);
            const { newFiles, updated } = await isOverriding(cwd, client, newBranchContent, addedFiles);
            if (updated.length > 0) {
                console.log("Overriding changes:");
                for (const file of updated) {
                    console.log(file);
                }
                console.log("There are overriding changes. You cannot switch branch without commiting it");
                console.log("Abort");
                process.exit(1);
            }
            // Find the basepath and recursively delete all files
            let basepathCount = Infinity;
            let index = 0;
            if (newBranchContent.length > 0) {
                basepathCount = newBranchContent[0].path.split("/").length;
            }
            for (let i = 1; i < newBranchContent.length; i++) {
                if (newBranchContent[i].path.split("/").length < basepathCount) {
                    basepathCount = newBranchContent[i].path.split("/").length;
                    index = i;
                }
            }
            // Conditionally delete files. Exempt new files under basepath
            const basepath = Path.dirname(newBranchContent[index].path);
            let basepathnew;
            let dir;
            basepathnew = newBranchContent[0].path.split("/");
            let isfile;
            if (newBranchContent[0].path.split("/").length == 1) {
                dir = basepathnew[0];
                isfile = "1";
            }
            else {
                dir = basepathnew[0] + "/";
                isfile = "0";
            }
            const directoryPath = cwd + "/" + dir;
            let newBranchaddedpaths = [];
            newBranchContent.forEach((e) => {
                newBranchaddedpaths.push(e.path);
            });
            deleteFoldersAndFilesExceptvcdecAndPaths(cwd, newBranchaddedpaths);
            let data;
            let flag = false;
            for (const obj of newBranchContent) {
                const path1 = obj.path;
                // Derive CID from multihash
                const cid = multihashToCID(obj.cid);
                const asyncitr = client.cat(cid);
                const dirname = Path.dirname(cwd + "/" + path1);
                fs.mkdirSync(dirname, { recursive: true });
                for await (const itr of asyncitr) {
                    data = Buffer.from(itr).toString();
                    if (data) {
                        fs.writeFileSync(path1, data);
                    }
                    else {
                    }
                    flag = true;
                }
                if (!flag) {
                    try {
                        const directoryPath = path.join(cwd, path.dirname(path1));
                        const fileName = path.basename(path1);
                        // Create the directory
                        fs.mkdirSync(directoryPath, { recursive: true });
                        // Create the empty file
                        fs.writeFileSync(path.join(directoryPath, fileName), '');
                    }
                    catch (err) {
                        console.error(`Error creating empty file: ${err}`);
                    }
                }
                flag = false;
            }
            fs.writeFileSync(cwd + "/.vcdec/HEAD", branch);
            return;
        }
    }
    catch (err) {
        console.error(err);
    }
}
//# sourceMappingURL=branching.js.map