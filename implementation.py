import numpy as np
import heapq
import math
from collections import Counter

class Node:
    def __init__(self, location):
        self.location = location        
        self.left = None
        self.right = None
        self.axis = None           

def knn_kdtree_build(P, depth, dim):
    if len(P) == 0:
        return None
    
    axis = depth % dim
    P = sorted(P, key=lambda x: x[axis])
    median_index = len(P) // 2
    median_point = P[median_index]

    root = Node(median_point)
    root.axis = axis

    root.left = knn_kdtree_build(P[:median_index], depth + 1, dim)
    root.right = knn_kdtree_build(P[median_index + 1:], depth + 1, dim)
    return root

def distance_squared(point1, point2):
    return sum((a - b) ** 2 for a, b in zip(point1, point2))

def search_kd_tree_knn(root, query_point, k):
    def search_recursive(node, current_best):
        if node is None:
            return current_best

        current_distance = distance_squared(node.location, query_point)

        if len(current_best) < k:
            heapq.heappush(current_best, (current_distance, node.location))
        else:
            heapq.heappushpop(current_best, (current_distance, node.location))

        split_dimension = node.axis

        if query_point[split_dimension] < node.location[split_dimension]:
            current_best = search_recursive(node.left, current_best)
            if current_best[0][0] < (node.location[split_dimension] - query_point[split_dimension]) ** 2:  # Fixed comparison
                current_best = search_recursive(node.right, current_best)
        else:
            current_best = search_recursive(node.right, current_best)
            if current_best[0][0] < (query_point[split_dimension] - node.location[split_dimension]) ** 2:  # Fixed comparison
                current_best = search_recursive(node.left, current_best)

        return current_best

    nearest_neighbors = []
    search_recursive(root, nearest_neighbors)
    return [(-distance, location) for distance, location in sorted(nearest_neighbors, reverse=True)]


def find_label(nearest_neighbors, k):
    nearest_points = [i[1] for i in nearest_neighbors]
    nearest_points=np.array(nearest_points)
    print(k, " nearest_neighbors of the query point are: ")
    print(nearest_points)
    print("\n")

    lables = list()
    for row in nearest_points:
        matching_rows = np.where((dataframe[:, :2] == row).all(axis=1))[0]
        if matching_rows.size == 1: #For duplicates (But improper data cleaning might cause it)
            lables.append(dataframe[matching_rows[0], 2])
    print(lables)
    print("\n")

    counter = Counter(lables)
    max_count = max(counter.values())
    most_common_elements = [element for element, count in counter.items() if count == max_count]

    if(len(most_common_elements) == 1):
        return(most_common_elements[0])
    else:
        print("Change K value")
        exit


dataframe = np.array([(2, 3, 0), (5, 4, 1), (9, 6, 2), (4, 7, 0), (8, 1, 3), (7, 2 , 1)])

data = dataframe[:, [0, 1]]
dim = len(data[0])
root = knn_kdtree_build(data, 0, dim)

query_point = (6, 5)
k = 3
nearest_neighbors = search_kd_tree_knn(root, query_point, k)


label = find_label(nearest_neighbors, k)
print("The query point is classified under the label: ", label)

