import { create } from "ipfs-http-client";
import { Isvcdec } from "../utils/checkvcdec.js";
import fs from 'fs';
import { commitContent } from "../utils/fetchContent.js";
import { FetchConfig } from "../utils/fetchConfig.js";
import { Comp2 } from "./compare.js";
import {Comp } from "./compare.js"
import {  neww } from "./knn.js";
import { printnn } from "./knn.js";

let root =null
export async function check(cwd,CID){
    const client = create({ url: FetchConfig(cwd).ipfs_node_url });

    const branch = fs.readFileSync(cwd + "/.vcdec/HEAD").toString();
    let prevContent=[]
    const prevSnapsho = fs.readFileSync(cwd + "/.vcdec/kddata").toString();
    if(prevSnapsho.length){
    
    
    let asyncitr = client.cat(prevSnapsho);
    let content=await commitContent(CID,client)
    // console.log(content)
    let querypoint=content
      let num1=await Comp(querypoint);
      // let num1=15
      let num2 =await Comp2(querypoint)
      // let num2=17
      let dataaa=[num1,num2,branch]
    // printnn(dataaa)
    for await (const itr of asyncitr) {
        const data = Buffer.from(itr).toString();
        prevContent = JSON.parse(data);
    }
    neww(root,prevContent,dataaa)
}


}