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
    const cd = depth % 2; // Assuming 2D space

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

// Calculate Euclidean distance between two points
function euclideanDistance(point1, point2) {
    return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
}

// K Nearest Neighbors using KD-tree
function knn(root, queryPoint, k) {
    let nearestNeighbors = [];

    // Function to recursively search and update nearest neighbors
    function searchNeighbors(node, depth) {
        if (!node) return;

        const cd = depth % 2; // Assuming 2D space
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

    // Include the string part in the result
    return nearestNeighbors.map(neighbor => ({ point: neighbor.point, branch: neighbor.point.branch }));
}

// Driver program to test above functions
let root = null;

// Sample data points
let dataPoints = [
    { x: 2, y: 3, branch: "A" },
    { x: 5, y: 4, branch: "B" },
    { x: 10, y: 100, branch: "C" },
    { x: 4, y: 7, branch: "D" },
    { x: 8, y: 1, branch: "E" },
    { x: 7, y: 2, branch: "F" }
];

// Building KD tree
for (let i = 0; i < dataPoints.length; i++) {
    root = insert(root, dataPoints[i]);
}

// Query point
let queryPoint = { x: 19, y: 100 };

// Find k nearest neighbors
let kNearestNeighbors = knn(root, queryPoint, 3);

// Print k nearest neighbors
console.log("K Nearest neighbors to query point:", kNearestNeighbors);
