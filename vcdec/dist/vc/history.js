import { create } from "ipfs-http-client";
import { Isvcdec } from "../utils/checkvcdec.js";
import fs from 'fs';
import { FetchConfig } from "../utils/fetchConfig.js";
export async function Log(cwd) {
    try {
        Isvcdec(cwd);
        const client = create({ url: FetchConfig(cwd).ipfs_node_url });
        const branch = fs.readFileSync(cwd + "/.vcdec/HEAD").toString();
        let head = fs.readFileSync(cwd + "/.vcdec/heads/" + branch).toString();
        let asyncitr = client.cat(head);
        console.log("Commit history: ");
        while (head.length) {
            for await (const itr of asyncitr) {
                const data = Buffer.from(itr).toString();
                console.log("<" + head + ">" + " " + JSON.parse(data).message);
                head = JSON.parse(data).prevCommit;
                asyncitr = client.cat(head);
            }
        }
        process.exit(0);
    }
    catch (e) {
        console.error(e);
        process.exit(1);
    }
}
//# sourceMappingURL=history.js.map