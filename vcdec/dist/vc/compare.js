
import { commitContent } from "../../dist/utils/fetchContent.js";
import { FetchConfig } from "../utils/fetchConfig.js";
import fs, { readFileSync } from "fs";
import { create } from "ipfs-http-client";

import Path from 'path'
import path from "path";
import { multihashToCID } from "../utils/cid.js";
import { error } from "console";
const cwd=process.cwd()
const client = create({ url: FetchConfig(cwd).ipfs_node_url });
function levenshteinDistance(s1, s2) {
    const len1 = s1.length;
    const len2 = s2.length;
    const matrix = [];

    // Initialize the matrix with 0s
    for (let i = 0; i <= len1; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= len2; j++) {
        matrix[0][j] = j;
    }

    // Fill in the matrix
    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1, // Deletion
                matrix[i][j - 1] + 1, // Insertion
                matrix[i - 1][j - 1] + cost // Substitution
            );
        }
    }

    return matrix[len1][len2];
}

function compareContent( queryData) {
    let baseData= [
        { path: 'c/aa/aaa', content: 'aaaa' },
        { path: 'c/b/b.txt', content: '' },
        { path: 'c/c.txt', content: 'sodfhliskdbfljkkbhdbkjhvksmnbmBHD<Jhcvk' }
    ];
    let totalFiles = baseData.length;
    let differingFiles = 0;

    for (const baseFile of baseData) {
        let found = false;
        for (const queryFile of queryData) {
            if (baseFile.path === queryFile.path) {
                found = true;
                const contentDifference = levenshteinDistance(baseFile.content, queryFile.content);
                differingFiles += contentDifference;
                break;
            }
        }
        if (!found) {
            differingFiles++; // Count as a differing file if not found in queryData
        }
    }

    // Calculate similarity score
    const maxPossibleScore = baseData.length * baseData[0].content.length; // Max possible score based on length of content strings
    const similarityScore = 1 - (differingFiles / maxPossibleScore);

    return similarityScore;
}
async function calculateDirectoryDifference(dir1, dir2) {
try{


    const files1 = new Set(dir1.map(file => file.path));
    const files2 = new Set(dir2.map(file => file.path));

    const intersection = new Set([...files1].filter(x => files2.has(x)));
    const union = new Set([...files1, ...files2]);

    const similarityScore = intersection.size / union.size;

    return     similarityScore
}
catch(err){
    console.log(err)
}
}

export async function Comp(dir) {
    try{

    
const dir1 = [
    {
      path: 'b/b.txt',
      cid: 'CID(QmTXsTQveYb1P33jQzWrH1Q97Az5coRoPA53b3mGqvp9Ge)',
      size: 20
    },
    {
      path: 'b/f/dd.txt',
      cid: 'CID(QmayF6aJhy5WidcZ2GBjEziqP64n5yzjgwPpF5CYKUnqkD)',
      size: 10
    }
  ];
    
  return  calculateDirectoryDifference(dir1,dir)
    }
    catch(err){
        console.log(error)
    }
}

export  async function Comp2(dir){
    try{

    
let datacontent=[]
let data
let flag=false
    for (const obj of dir) {
        const path1 = obj.path;
        // Derive CID from multihash
        const cid = multihashToCID(obj.cid);
        const asyncitr = client.cat(cid);
        const dirname = Path.dirname(cwd + "/" + path1);
        fs.mkdirSync(dirname, { recursive: true });
        let data1;
        for await (const itr of asyncitr) {
            data = Buffer.from(itr).toString();
                fs.writeFileSync(cwd+"/dummy", data);
          
        }
        data1=fs.readFileSync(cwd+"/dummy").toString();
        fs.writeFileSync(cwd+"/dummy", "");

        let obj1={path:path1,content:data1}
        datacontent.push(obj1)

      
    }

return compareContent(datacontent)

}
catch(err){
    console.log(err)
}
}







