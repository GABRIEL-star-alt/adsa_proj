import { create } from "ipfs-http-client";
import { Isvcdec } from "../utils/checkvcdec.js";
import fs from 'fs';
import { commitContent } from "../utils/fetchContent.js";
import { FetchConfig } from "../utils/fetchConfig.js";
import { Comp2 } from "./compare.js";
import {Comp } from "./compare.js"
export async function Commit(cwd, message) {
    try {
        Isvcdec(cwd);
        const snapshot = fs.readFileSync(cwd + "/.vcdec/SNAPSHOT").toString();
        if (!snapshot.length) {
            console.error("No changes to commit");
            process.exit(1);
        }
        const client = create({ url: FetchConfig(cwd).ipfs_node_url });
        const branch = fs.readFileSync(cwd + "/.vcdec/HEAD").toString();
        const prevCommit = fs.readFileSync(cwd + "/.vcdec/heads/" + branch).toString();

        const prevSnapsho = fs.readFileSync(cwd + "/.vcdec/kddata").toString();
let points=[]
        const commit = {
            prevCommit: prevCommit,
            snapshot: snapshot,
            message: message,
            timestamp: Date.now()
        };
        


        const result = await client.add(JSON.stringify(commit));
        fs.writeFileSync(cwd + "/.vcdec/heads/" + branch, result.path);
        fs.writeFileSync(cwd + "/.vcdec/SNAPSHOT", "");
        console.log("Committed to IPFS with hash: " + result.path);
        const BranchContent = await commitContent(result.path, client);
        let num1=await Comp(BranchContent);
        let num2 =await Comp2(BranchContent)
//
console.log(num1,num2,"sdfdsfsdfsd")
let pointss1 =[]
if(prevSnapsho.length){
let data
    let asyncitr = client.cat(prevSnapsho);
                for await (const itr of asyncitr) {
                     data = Buffer.from(itr).toString();
                    pointss1 = JSON.parse(data);
                }
                console.log(data)
            }

let x={x:num1,y:num2,branch:branch}
   pointss1.push(x)
   console.log(pointss1,"@@@@")
    // for(let i=0;i<n;i++){
    //     root = insert(root,pointss[i])
    // }
    const resultt = await client.add(JSON.stringify(pointss1));
    fs.writeFileSync(cwd + "/.vcdec/kddata", resultt.path);
    console.log("pontss staged to IPFS with cid: " + resultt.path);
//


       let root= null
       let vectordata=[num1,num2,branch]
        console.log(num1,num2,"xxx")
        process.exit(0);
    }
    catch (e) {
        console.error(e);
        process.exit(1);
    }
}
//# sourceMappingURL=commit.js.map