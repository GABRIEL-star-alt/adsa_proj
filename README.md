## KNN Classification Algorithm Based on KD-tree
    - 106122050   -106122044
    
# Comparitive Analysis
Comparisons are made among "KNN using KD Trees" , Traditional KNN and "KNN using Ball Trees"


# Why vcdec?
Traditional version control tools, such as Git repositories, operate under the assumption of a single, centralized blob storage. In the world of IPFS, data is partitioned into chunks and distributed across a network of peers, resulting in an inherently decentralized and immutable data structure. vcdec fills the void by enabling version control in this decentralized paradigm, making it a robust alternative to centralized repository hosting services like GitHub.

# Features
vcdec is built as a Command Line Interface (CLI) tool using javascript, ensuring easy accessibility via the Node Package Manager (npm). Key functionalities have already been implemented, including repository initialization, staging changes, committing, and browsing commit history. We're actively working on adding essential features like branching, merging, commit authorship, and more. Moreover, we plan to utilize DNSLink to establish mutable pointers to commit Content Identifiers (CIDs), potentially turning vcdec into an attractive alternative for static file hosting, like GitHub Pages.

# Performance Consideration
Given vcdec's continuous interaction with IPFS nodes, command execution speed may vary. We're actively optimizing performance to provide the best possible experience.

# knn-using -kdtree integration
In our latest implementation, we've integrated K-nearest neighbors (KNN) using a KD tree for a particularly unique scenario. Imagine a project directory with numerous divergent branches, each cluttered with numerous changes. Now, suppose we have a specific snapshot of the project. Our goal is to determine the branch where this snapshot's content is most likely located, thereby facilitating easier navigation.

To achieve this, we've devised a two-step process. Firstly, we've developed a function that encodes both the directory structure and the file contents into numerical data, enabling us to represent them effectively for KD tree processing. Secondly, with each commit made in the project, we update the KD tree by inserting these numeric data points alongside the branch name, effectively constructing a KD tree at every commit.

When the 'check' function is invoked, it takes the query data point and traverses the KD tree to identify the most closely matching segment. Importantly, it considers intersections with other segments created in the 2D space by the KD tree. Additionally, to ensure scalability and accessibility, all points are stored in the InterPlanetary File System (IPFS), allowing us to retrieve previous sets of points and seamlessly incorporate new data points.
