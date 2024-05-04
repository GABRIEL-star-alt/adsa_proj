
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
    const baseFiles = baseData.map(entry => entry.path);
    const queryFiles = queryData.map(entry => entry.path);

    // Check added and removed files
    const addedFiles = queryFiles.filter(file => !baseFiles.includes(file));
    const removedFiles = baseFiles.filter(file => !queryFiles.includes(file));

    let differenceScore = addedFiles.length + removedFiles.length;

    // Compare content of files that exist in both structures
    const commonFiles = baseFiles.filter(file => queryFiles.includes(file));
    for (const file of commonFiles) {
        const baseContent = baseData.find(entry => entry.path === file).content;
        const queryContent = queryData.find(entry => entry.path === file).content;

        // Calculate Levenshtein distance
        const codeDifference = get(baseContent, queryContent);

        // Add Levenshtein distance to the total difference score
        differenceScore += codeDifference;
    }

    return differenceScore;
}
async function calculateDirectoryDifference(baseData,queryData) {
    try {
        const baseFiles = baseData.map(entry => entry.path);
        const queryFiles = queryData.map(entry => entry.path);
    
        // Check added and removed files
        const addedFiles = queryFiles.filter(file => !baseFiles.includes(file));
        const removedFiles = baseFiles.filter(file => !queryFiles.includes(file));
    
        // Penalize based on the number of added or removed files
        const differenceScore = addedFiles.length + removedFiles.length;
    
        return differenceScore;
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
        let towrite=""
        for await (const itr of asyncitr) {
            data = Buffer.from(itr).toString();
towrite+=data

}
// console.log(towrite)
fs.writeFileSync(cwd+"/dummy",towrite);
        data1=fs.readFileSync(cwd+"/dummy").toString();
        // fs.writeFileSync(cwd+"/dummy", "");

        let obj1={path:path1,content:towrite}
        datacontent.push(obj1)

      
    }

return compareContent(datacontent)

}
catch(err){
    console.log(err)
}
}







