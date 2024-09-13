class TreeNode {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.left = null;
        this.right = null;
    }
}
  
class BinarySearchTree {
    constructor() {
        this.root = null;
    }

    insert(key, value) {
        const newNode = new TreeNode(key, value);
        if (this.root === null) {
            this.root = newNode;
            return;
        }

        let current = this.root;
        while (true) {
            if (key < current.key) {
                if (current.left === null) {
                current.left = newNode;
                return;
                }
                current = current.left;
            } else {
                if (current.right === null) {
                current.right = newNode;
                return;
                }
                current = current.right;
            }
        }
    }

    insertMultiple(entries) {
        for (const [key, value] of Object.entries(entries)) {
            this.insert(key, value);
        }
    }

    search(key) {
        let current = this.root;
        while (current !== null) {
            if (key === current.key) {
                return current.value;
            }
            if (key < current.key) {
                current = current.left;
            } else {
                current = current.right;
            }
        }
        return null; // Key not found
    }
}

module.exports = BinarySearchTree;