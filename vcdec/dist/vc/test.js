const levenshtein = require('fast-levenshtein');

function compareDirectoryStructures(baseData, queryData) {
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
        const codeDifference = levenshtein.get(baseContent, queryContent);

        // Add Levenshtein distance to the total difference score
        differenceScore += codeDifference;
    }

    return differenceScore;
}

// Example usage:
const baseData = [
    { path: 'c/aa/aaa.js', content: 'function add(a, b) { return a + b; }' },
    { path: 'c/b/b.cpp', content: '#include <iostream>\nint main() { std::cout << "Hello,i am the world!"; }' },
];

const queryData = [
    { path: 'c/aa/aaa.js', content: 'function add(a, b) { return a - b; }' }, // Example of modified content
    { path: 'c/b/b.cpp', content: '#include <iostream>\nint main() { std::cout << "Hello,i am GPT!"; }' }, // Example of modified content
    { path: 'c/d/d.js', content: 'console.log("New file");' }, // Example of added file
];

const differenceScore = compareDirectoryStructures(baseData, queryData);
console.log(`Difference score: ${differenceScore}`);
