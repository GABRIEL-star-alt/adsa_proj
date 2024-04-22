const k = 2;

// A structure to represent node of kd tree
class Node {
    constructor(point) {
        this.point = point;
        this.left = null;
        this.right = null;
    }
}

// A method to create a node of K D tree
function newNode(point) {
    return new Node(point);
}

// Inserts a new node and returns root of modified tree
// The parameter depth is used to decide axis of comparison
function insertRec(root, point, depth) {
    // Tree is empty?
    if (!root) {
        return newNode(point);
    }

    // Calculate current dimension (cd) of comparison
    const cd = depth % k;

    // Compare the new point with root on current dimension 'cd'
    // and decide the left or right subtree
    if (point[cd] < root.point[cd]) {
        root.left = insertRec(root.left, point, depth + 1);
    } else {
        root.right = insertRec(root.right, point, depth + 1);
    }

    return root;
}

// Function to insert a new point with given point in
// KD Tree and return new root. It mainly uses above recursive
// function "insertRec()"
function insert(root, point) {
    return insertRec(root, point, 0);
}

// A utility method to determine if two Points are same
// in K Dimensional space
function arePointsSame(point1, point2) {
    // Compare individual coordinate values
    for (let i = 0; i < k; i++) {
        if (point1[i] !== point2[i]) {
            return false;
        }
    }

    return true;
}

// Searches a Point represented by "point[]" in the K D tree.
// The parameter depth is used to determine current axis.
function searchRec(root, point, depth) {
    // Base cases
    if (!root) {
        return false;
    }

    if (arePointsSame(root.point, point)) {
        return true;
    }

    // Current dimension is computed using current depth and total
    // dimensions (k)
    const cd = depth % k;

    // Compare point with root with respect to cd (Current dimension)
    if (point[cd] < root.point[cd]) {
        return searchRec(root.left, point, depth + 1);
    }

    return searchRec(root.right, point, depth + 1);
}

// Searches a Point in the K D tree. It mainly uses
// searchRec()
function search(root, point) {
    // Pass current depth as 0
    return searchRec(root, point, 0);
}

// Calculate Euclidean distance between two points
function euclideanDistance(point1, point2) {
    let sum = 0;
    for (let i = 0; i < k; i++) {
        sum += Math.pow(point1[i] - point2[i], 2);
    }
    return Math.sqrt(sum);
}

// K Nearest Neighbors using KD-tree
function knnWithKDTree(root, queryPoint, k) {
    let nearestNeighbors = [];

    // Function to recursively search and update nearest neighbors
    function searchNeighbors(node, depth) {
        if (!node) return;

        const cd = depth % k;
        const distance = euclideanDistance(node.point, queryPoint);

        // Insert node into nearest neighbors array
        nearestNeighbors.push({ point: node.point, distance });

        // Sort nearest neighbors array by distance
        nearestNeighbors.sort((a, b) => a.distance - b.distance);

        // If nearest neighbors array size exceeds k, remove the farthest neighbor
        if (nearestNeighbors.length > k) {
            nearestNeighbors.pop();
        }

        // Check if we need to search subtrees
        if (queryPoint[cd] < node.point[cd]) {
            searchNeighbors(node.left, depth + 1);
            // Check if we need to search the other subtree (ball intersecting the splitting plane)
            if (Math.abs(queryPoint[cd] - node.point[cd]) < nearestNeighbors[nearestNeighbors.length - 1].distance) {
                searchNeighbors(node.right, depth + 1);
            }
        } else {
            searchNeighbors(node.right, depth + 1);
            // Check if we need to search the other subtree (ball intersecting the splitting plane)
            if (Math.abs(queryPoint[cd] - node.point[cd]) < nearestNeighbors[nearestNeighbors.length - 1].distance) {
                searchNeighbors(node.left, depth + 1);
            }
        }
    }

    // Start the search
    searchNeighbors(root, 0);

    return nearestNeighbors.map(neighbor => neighbor.point);
}

// Brute-force K Nearest Neighbors
function knnWithoutKDTree(points, queryPoint, k) {
    let nearestNeighbors = [];

    // Calculate distances from query point to all points
    for (let i = 0; i < points.length; i++) {
        const distance = euclideanDistance(points[i], queryPoint);
        nearestNeighbors.push({ point: points[i], distance });
    }

    // Sort nearest neighbors array by distance
    nearestNeighbors.sort((a, b) => a.distance - b.distance);

    // Return the k nearest neighbors
    return nearestNeighbors.slice(0, k).map(neighbor => neighbor.point);
}

// Calculate time taken for KD-tree KNN
function timeKDTreeKNN(root, queryPoint, k) {
    const startTime = performance.now();
    knnWithKDTree(root, queryPoint, k);
    const endTime = performance.now();
    return endTime - startTime;
}

// Calculate time taken for brute-force KNN
function timeBruteForceKNN(points, queryPoint, k) {
    const startTime = performance.now();
    knnWithoutKDTree(points, queryPoint, k);
    const endTime = performance.now();
    return endTime - startTime;
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Driver program to test above functions
let root = null;
const points = [
    [3, 6], [17, 15], [13, 15], [6, 12], [9, 1], [2, 7], [100, 90], [12, 5], [15, 10], [5, 18],
    [8, 4], [14, 13], [20, 7], [1, 11], [18, 9], [4, 3], [16, 14], [11, 16], [7, 2], [19, 8],
    [3, 20], [6, 17], [12, 14], [5, 8], [9, 13], [15, 19], [4, 10], [10, 5], [14, 18], [11, 3],
    [8, 16], [13, 7], [120, 120], [2, 4], [18, 1], [1, 9], [17, 20], [200, 150], [16, 8], [7, 18],
    [3, 14], [6, 8], [12, 17], [5, 4], [9, 18], [15, 3], [4, 11], [10, 16], [14, 7], [11, 19],
    [8, 2], [13, 10], [19, 5], [2, 15], [18, 4], [1, 13], [17, 6], [20, 17], [16, 12], [7, 9]
];
for (let i = 0; i < 100000; i++) {
    // Randomly choose whether to generate a clustered point or not
    const isClustered = Math.random() < 0.2; // Adjust the threshold for clustering as needed

    let x, y;
    if (isClustered) {
        // Generate clustered points
        const centerX = getRandomInt(0, 200); // Adjust the range as needed
        const centerY = getRandomInt(0, 200); // Adjust the range as needed

        // Add some randomness to the clustered points around the center
        x = getRandomInt(centerX - 20, centerX + 20); // Adjust the spread as needed
        y = getRandomInt(centerY - 20, centerY + 20); // Adjust the spread as needed
    } else {
        // Generate non-clustered points
        x = getRandomInt(0, 200); // Adjust the range as needed
        y = getRandomInt(0, 200); // Adjust the range as needed
    }

    // Add the generated point to the points array
    points.push([x, y]);
}
// Construct KD-tree
const n = points.length;
for (let i = 0; i < n; i++) {
    root = insert(root, points[i]);
}

// Query point
console.log(root)
const queryPoint = [130, 115];

// Time taken by KD-tree KNN
const kdTreeTime = timeKDTreeKNN(root, queryPoint, 5);
console.log('Time taken by KD-tree KNN:', kdTreeTime.toFixed(5), 'milliseconds');

// Time taken by brute-force KNN
const bruteForceTime = timeBruteForceKNN(points, queryPoint, 5);
console.log('Time taken by brute-force KNN:', bruteForceTime.toFixed(5), 'milliseconds');
