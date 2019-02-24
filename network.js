let fs = require("fs");

// Everytime writing the file from start is not efficent, change it later
function writer(data) {
  // convert data to json
  data = JSON.stringify(data);
  return new Promise((fulfill, reject) => {
    fs.writeFile("./data.json", data, (err, returnedData) => {
      if(err) return reject(err);
      fulfill(returnedData);
    });
  });
}

// read from file
function reader() {
  // promise for preventing callback hell
  return new Promise((fulfill, reject) => {
    fs.readFile("./data.json", "utf-8", (err ,data) => {
      if(err) return reject(err);
      // if no error convert string to JS object
      fulfill(JSON.parse(data));
    });
  });
}

function whichColor(random, cb) {
  // get all the data
  reader().then(data => {
    let dots = data.data;
    // if there is not data to compare, return
    if(!dots.head) return cb("unknown");
    // set the prototype of dots to linked list inorder to use the functions
    Object.setPrototypeOf(dots, LinkedList.prototype);
    let current = dots.head,
        closestDot,
        closestDotDistance = Infinity;
    while(current) {
      let x = Math.abs(current.value.x - random.x);
      let y = Math.abs(current.value.y - random.y);
      let z = Math.abs(current.value.z - random.z);
      let distance = Math.sqrt((x**2) + (y**2) + (z**2));
      // check for distance
      if(distance < closestDotDistance) {
        closestDot = current;
        closestDotDistance = distance
      }
      // move to the next node
      current = current.next;
    }
    // return the color
    cb(closestDot.value.color);
  });
}

function addNewDot(dot) {
  reader().then(data => {
    let dots = data.data;
    // set the prototype of dots to linked list inorder to use the functions
    Object.setPrototypeOf(dots, LinkedList.prototype);
    // first check if its duplicate
    // if not duplicated add as new
    if(!dots.updateNode(dot)) {
        dots.addNode(dot);
    }
    // after editing dots save the file
    writer(data);
  });
}

function randomColor() {
  return {
    x: Math.floor(Math.random() * 200 + 1),
    y: Math.floor(Math.random() * 200 + 1),
    z: Math.floor(Math.random() * 200 + 1)
  };
}

class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }
  // define get and update method
  getNode({ x, y, z }) {
    // check the first case
    let current = this.head;
    // if the current is null return
    if(!current) return;
    while(current) {
      if(current.x === x || current.y === y || current.z === z) {
        return current;
      } else {
        current = current.next;
      }
    }
  }
  updateNode({ x, y, z }, updateValue) {
    let targetNode = this.getNode({x, y, z});
    // if target node is not empty
    if(!targetNode && targetNode !== undefined) {
      targetNode.color = updateValue;
      return true;
    }
  }
  addNode(dot) {
    // if its the first value in the list
    if(!this.head) {
      this.head = new Node(dot);
      return;
    }
    // if its not the first
    // loop through to find the last element
    let current = this.head;
    while(current.next) {
      current = current.next;
    }
    current.next = new Node(dot);
  }
}

// create a linked List Class if its not already created
reader().then(data => {
  // if data is null create a new linked list class
    if(!data.data) {
        data.data = new LinkedList();
        // write after updating
        writer(data);
    }
});

module.exports = {
  randomColor,
  whichColor,
  addNewDot
};
