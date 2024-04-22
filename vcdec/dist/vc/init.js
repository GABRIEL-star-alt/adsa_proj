import fs from "fs";
export async function Init(cwd, ipfs_node_url) {
    try {
        let reinitialize = false;
        if (fs.existsSync(cwd + "/.vcdec")) {
            reinitialize = true;
            fs.rmdirSync(cwd + "/.vcdec", { recursive: true });
        }
        fs.mkdirSync(cwd + "/.vcdec/heads", { recursive: true });
        fs.writeFileSync(cwd + "/.vcdec/heads/main", "");
        fs.writeFileSync(cwd + "/.vcdec/HEAD", "main");
        fs.writeFileSync(cwd + "/.vcdec/SNAPSHOT", "");
        fs.writeFileSync(cwd + "/.vcdec/kddata", "");
        fs.writeFileSync(cwd + "/.vcdec/CONFIG", JSON.stringify({
            ipfs_node_url: ipfs_node_url
        }));
        if (reinitialize) {
            console.error("Reinitialized vcdec repository in " + cwd + "/.vcdec");
        }
        else {
            console.log("Initialized vcdec repository in " + cwd + "/.vcdec");
        }
        process.exit(0);
    }
    catch (e) {
        console.error(e);
        process.exit(1);
    }
}
//# sourceMappingURL=init.js.map