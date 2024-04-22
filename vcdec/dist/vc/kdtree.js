// Number of dimensions
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
export async function newNode(point) {
    return new Node(point);
}

// Inserts a new node and returns root of modified tree
// The parameter depth is used to decide axis of comparison
export async function insertRec(root, point, depth) {
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

// export async function to insert a new point with given point in
// KD Tree and return new root. It mainly uses above recursive
// export async function "insertRec()"
export async function insert(root, point) {
    return insertRec(root, point, 0);
}

// A utility method to determine if two Points are same
// in K Dimensional space
export async function arePointsSame(point1, point2) {

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
export async function searchRec(root, point, depth) {

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
export async function search(root, point) {

    // Pass current depth as 0
    return searchRec(root, point, 0);
}

// Calculate Euclidean distance between two points
export async function euclideanDistance(point1, point2) {
    let sum = 0;
    for (let i = 0; i < k; i++) {
        sum += Math.pow(point1[i] - point2[i], 2);
    }
    return Math.sqrt(sum);
}
