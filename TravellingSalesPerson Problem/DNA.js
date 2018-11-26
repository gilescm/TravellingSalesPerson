// Evolve the DNA of the population

// mutation rate for one pair on an existing order
var muteR = 0.04;

//
function swap(a, i, j) {
  var temp = a[i];
  a[i] = a[j];
  a[j] = temp;
}

// A DNA object is an order through the cities
function DNA(total, order) {
  // Start by assuming it's distance is infinity and fitness is zero

  this.dist = Infinity;
  this.fitness = 0;
  // Is this being made from another DNA object?
  if (order instanceof Array) {
    // Just copy the order
    this.order = order.slice();
    // Mutation
    // muteR % of the time shuffle one spot
    if (random(1) < muteR) {
      this.shuffle();
    }
  } else {
    // Create a random order
    this.order = [];
    for (var i = 0; i < total; i++) {
      this.order[i] = i;
    }
    // Shuffle randomly 100 times
    // Is this good enough for variation?
    for (var n = 0; n < 100; n++) {
      this.shuffle();
    }
  }
}

// Shuffle array one time
DNA.prototype.shuffle = function() {
  var i = floor(random(this.order.length));
  var j = floor(random(this.order.length));
  swap(this.order, i, j);
}

// Calculate Distance of path
DNA.prototype.calcDistance = function() {
  var totalD = 0;
  for (var i = 0; i < this.order.length - 1; i++) {
    var cityAIndex = this.order[i];
    var cityA = cities[cityAIndex];
    var cityBIndex = this.order[i + 1];
    var cityB = cities[cityBIndex];
    var d = dist(cityA.x, cityA.y, cityB.x, cityB.y);
    totalD += d;
  }
  // Add return trip to total distance
  cityA = cities[this.order[0]];
  cityB = cities[this.order[this.order.length-1]];
  totalD += dist(cityA.x, cityA.y, cityB.x, cityB.y);
  this.dist = totalD;
  return this.dist;
}

// Map the fitess to shortest is best, longest is worst
DNA.prototype.mapFitness = function(distMin, distMax) {
  this.fitness = map(this.dist, distMin, distMax, 1, 0);
  return this.fitness;
}

// Normalize against total fitness
DNA.prototype.normFitness = function(total) {
  this.fitness /= total;
}

// Draw the path
DNA.prototype.show = function() {
  stroke(pathColour);
  strokeWeight(1);
  noFill();
  beginShape();
  for (var i = 0; i < this.order.length; i++) {
    var n = this.order[i];
    // Remap to local coordinate system
    var x = map(cities[n].x,cityMinX,cityMaxX, 2*margEdge, canWidth - (2*margEdge));
    var y = map(cities[n].y,cityMinY,cityMaxY,0.5* canHeight - (2 * margEdge), 2*margEdge);
    vertex(x,y);
  }
  endShape(CLOSE);

  // Cities
  for (var i = 0; i < this.order.length; i++) {
    if (i == 0){
      stroke(startColour);
      fill(startColour);
    }else{
      stroke(pathColour);
      fill(pathColour);
    }
    var n = this.order[i];
    // Map to local coordinate system
    var x = map(cities[n].x,cityMinX,cityMaxX,2*margEdge,canWidth - (2*margEdge));
    var y = map(cities[n].y,cityMinY,cityMaxY, 0.5 * canHeight - (2 * margEdge), 2*margEdge );
    ellipse(x, y, 6, 6);
  }
  
}

// Cossover two paths
DNA.prototype.crossover = function(other) {
  // Take two orders
  var order1 = this.order;
  var order2 = other.order;
  // Pick a random start and endpoint
  var start = floor(random(order1.length));
  var end = floor(random(start + 1, order1.length + 1));
  // Take part of the the first order
  var neworder = order1.slice(start, end);
  // Calculate empty places
  var leftover = order1.length - neworder.length;
  // Iterate through order2 to find NEW cities to add to order1
  var count = 0;
  var i = 0;
  while (count < leftover) {
    var city = order2[i];
    if (!neworder.includes(city)) {
      neworder.push(city);
      count += 1;
    }
    i += 1;
  }
  return neworder;
}