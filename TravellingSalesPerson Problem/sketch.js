// Travelling Salesman using Genetic Algorithm

// Define global variables

// Colours used in GUI
var backColour;
var textColour;
var pathColour;
var startColour;
var histColour1;
var histColour2;

// Formating Variables
var yoText = 12;    // x offsetting
var xoText = 10;    // y offsetting
var margText = 10;  // stats offsetting
var margEdge = 24;  // margin from screen edge
var textB1;
var canWidth;
var canHeight;

// Stats in GUI
var bestOverallP  = 0; // best last percent change
var bestOverallT  = 0; // time of best last change
var LastP         = 0; // last percent change
var LastT         = 0; // time of last change

// Title constants
var NumbCitiesText  = "Number of Cities: ";
var PopText         = "Population Pool Size: ";
var DNACrossText    = "Enable DNA Crossover: ";
var LimitText       = "Limit Total Poolsize To: ";

// Boolean Variables
var popChange   = false;
var doCrossover = true;

// City Variables
var cities      = [];
var totalCities = 15;
var cityMinX;
var cityMinY;
var cityMaxX;
var cityMaxY;

// Path Variables
var recordDistance  = Infinity;
var bestOverall;
var bestCurrent;
var bestHist        = [];

// Genetic Algorithm Variables
var population  = [];
var popTotal    = 1000;
var memTotal    = 0;
var memMax      = 100000;
var evoHist     = [];
var evoCurve    = [];

function setup() {
  // Build workspace
    textColour = color(100, 255, 255);
    backColour = color(0, 0, 0);
    pathColour = color(255, 255, 255);
    startColour = color(255, 0, 0);
    histColour1 = color(255, 100, 0, 80);
    histColour2 = color(255, 100, 0);
    setCanSizes();
    canvas = createCanvas(canWidth, canHeight);
    canvas.parent('canvascontainer');
  
    // Initialise data
    newCitySet();
    newRandDatDNA();
    
    // Run Model
    DOMinator();
}

function windowResized() {
  setCanSizes();
  resizeCanvas(windowWidth*.96, windowHeight*.75);
  DOMinatorPos();
}

function setCanSizes(){
  canWidth = windowWidth*.96;
  canHeight = windowHeight*.75;
}

function draw() {
  background(backColour);
  
  // Define and Initialise best and worst of each generation
  var distMin = Infinity;
  var distMax = 0; 
  var tempD;
    
  // Check each generation for the best current and best overall distance
  if (memTotal <= memMax) {
    for (var i = 0; i < population.length; i++) {
      if (memTotal >= memMax) {
        break;  // Member limit reached
      }
      
      memTotal += 1;
      tempD = population[i].calcDistance();
      
      // Perform check against previous best overall
      if (tempD < recordDistance) {
        recordDistance = tempD;
        bestHist.push(bestOverall);
        bestOverall = population[i];
        var tempV = createVector( memTotal, recordDistance);
        evoHist.push(tempV);
      }
      // Perform check against current best
      if (tempD < distMin) {
        distMin = tempD;
        bestCurrent = population[i];
      }
    
      // Perform check against worst
      if (tempD > distMax) {
        distMax = tempD;
      }
    }
  } // EoChecks

  
  // Display History of Paths
  dispHist();
    if (bestHist != undefined){
        bestHist[scrubHist()].show();
        statsBestHist();
  }

  // Split the screen
  translate(0, canHeight / 2);
  stroke(textColour/2);
  line(0, 0, canWidth, 0);
  
  // Best Overall Stats
  bestOverall.show();
  statsBestOverall();
  
  // Implement real time changing
  if (popChange){
    var cLen = population.length;
    // Splice the population down to size
    if (popTotal <= cLen) {
      population.splice(popTotal,cLen - popTotal);
    }
    // Create new members of pop to fill empty spaces in set
    else {
      for (var i = 0; i < (popTotal - cLen); i++){
        var n = new DNA(totalCities);
        population.push(n);
      }
    }
    popChange = false;
  }
  
  // Reproduce the next generation
  calcNormFitness(distMin, distMax);
  
  // Initialise a new population
  var newPop = [];
  
  // Create new members from the selected parents
  for (var i = 0; i < population.length; i++) {
    var tempA = pickOne(population);
    var tempB = pickOne(population);
    var order;
    
    if (doCrossover){
      order = tempA.crossover(tempB);
    }
    else{
      order = tempB;
    }
    
    newPop[i] = new DNA(totalCities, order);
  }
  population = newPop;
    
} // EoDraw

  function calcNormFitness(distMin,distMax){
    var total = 0;
    // Map all the fitness between 0 and 1
    for (var i = 0; i < population.length; i++) {
      total += population[i].mapFitness(distMin,distMax);
    }
    // Normalise to probabilities
    for (var i = 0; i < population.length; i++) {
        population[i].normFitness(total);
    }
    // Sort them based on these probabilities
    population.sort(function(tempA,tempB) {
      return tempA.fitness - tempB.fitness;
    })
  }
  
  function pickOne() {
    var index = -1;
    var r = random(1);
    while (r > 0) {
      index += 1;
      r -= population[index].fitness;
  }
  return population[index];
  }

// Make new set of cities
function newCitySet() {
  cityMinX = Infinity;
  cityMinY = Infinity;
  cityMaxX = 0;
  cityMaxY = 0;
  
  // Generate some random cities
  for (var i = 0; i < totalCities; i++) {
    var x = random(margEdge, width - margEdge);
    var y = random(margEdge, height/2 - margEdge);
    var v = createVector(x, y);
    cities[i] = v;
    // Set new limits
    if (x < cityMinX) {cityMinX = x};
    if (y < cityMinY) {cityMinY = y};
    if (x > cityMaxX) {cityMaxX = x};
    if (y > cityMaxY) {cityMaxY = y};
  }
}

// Make new random DNA
function newRandDatDNA() {
  for (var i = 0; i < popTotal; i++) {
    population[i] = new DNA(totalCities);
  }
}

// Adjust popTotal in real time
function adjPopTotal() {
  getPopInput();
  popChange = true;
}

// Set crossover flag
function setCrossoverFlag(){
  doCrossover = chkboxDC.elt.checked;
}

// PopulationInput
function getPopInput() {
  if (popInput.value() >= 1){
    popTotal = popInput.value();
  } else {
    popTotal = 1000;
    popInput.value(1000);
  }
}

function adjMemMax(){
  if (limInput.value() >= 0){
    memMax = limInput.value();
  } else {
    memMax = Infinity;
    limInput.elt.value = Infinity;
  }
}

// Restart Initialisations
function doRestart() {
  if (ncInput.value() >= 4){
    totalCities = ncInput.value();
  } else {
    totalCities = 4;
    ncInput.value(4);
  }
  getPopInput();
  population.splice(0,population.length);
  newCitySet();
  newRandDatDNA();
  recordDistance = Infinity;
  memTotal = 0;
  bestHist.splice(0,bestHist.length);
  evoHist.splice(0,evoHist.length);
  evoCurve.splice(0,evoCurve.length);
}

// Reset Initialisation with same cities
function doReset() {
  getPopInput();
  population.splice(0,population.length);
  newRandDatDNA();
  recordDistance = Infinity;
  memTotal = 0;
  bestHist.splice(0,bestHist.length);
  evoHist.splice(0,evoHist.length);
  evoCurve.splice(0,evoCurve.length);
}



// Create model elements
function DOMinator() {
    
  // Restart button
  var Line01 = createP("");
  butRestart = createButton('Restart (New Cities)');
  butRestart.mousePressed(doRestart);
  
  // Reset with same cities button
  var Line02 = createP("");
  butReset = createButton('Reset (Same Cities)');
  butReset.mousePressed(doReset);
  
  // Number of Cities Display
  inpnctext = createP(NumbCitiesText);
  inpnctext.position(butRestart.position().x +  butRestart.width + 10 ,butReset.position().y - butReset.height*.5);
  ncInput   = createInput(totalCities);
  ncInput.changed(ncInpChanged);
  ncInput.size(36);
  ncInput.position(inpnctext.position().x + textWidth(NumbCitiesText) + 26, butReset.position().y - butReset.height*.2);
  
  // Pool Population Size Display
  ppoptext = createP(PopText);
  ppoptext.position(ncInput.position().x + ncInput.width + 10, butReset.position().y - butReset.height*.5);
  popInput = createInput(popTotal);
  popInput.changed(popInpChanged);
  popInput.changed(adjPopTotal);
  popInput.size(48);
  popInput.position(ppoptext.position().x + textWidth(PopText) + 26, butReset.position().y - butReset.height*.2);
  
  // Crossover Display
  pdctext  = createP(DNACrossText);
  chkboxDC = createInput();
  chkboxDC.size(14,14);
  chkboxDC.attribute("type","checkbox");
  chkboxDC.position(pdctext.position().x + textWidth(DNACrossText) + 20,3 + pdctext.position().y - pdctext.height*.1);
  chkboxDC.changed(setCrossoverFlag);
    
  // Population Limit Display
  plimtext = createP(LimitText);
  plimtext.position(pdctext.position().x, pdctext.position().y + pdctext.height);
  limInput = createInput(memMax);
  limInput.changed(adjMemMax); 
  limInput.size(150);
  limInput.position(plimtext.position().x + textWidth(LimitText) + 20,3 + plimtext.position().y - plimtext.height*.2);
  
}

// Model Positions
function DOMinatorPos(){
    inpnctext.position(butRestart.position().x + butRestart.width + 10, butReset.position().y - butReset.height*.5);
    ncInput.position(inpnctext.position().x + textWidth(NumbCitiesText) + 26, butReset.position().y - butReset.height*.2);
    ppoptext.position(ncInput.position().x + ncInput.width + 10, butReset.position().y - butReset.height*.5);
    popInput.position(ppoptext.position().x + textWidth(PopText) + 26, butReset.position().y - butReset.height*.2);
    chkboxDC.position(140,3 + pdctext.position().y - pdctext.height*.1);
    plimtext.position(inpnctext.position().x + 10, pdctext.position().y - pdctext.height*.9);
    limInput.position(plimtext.position().x + textWidth(LimitText) + 36, pdctext.position().y - limInput.height*.2);
}

function  ncInpChanged(){
  var nc = parseInt(ncInput.value());
  if (Number.isInteger(nc)){
    if (nc < 4) {
      ncInput.value(4);
      return;
    }
    if (nc > 100){
      ncInput.value(100);
    }
  } else {
    ncInput.value(totalCities);
  }
}

function  popInpChanged(){
  var p = parseInt(popInput.value());
  if (!Number.isInteger(p)){
    popInput.value(popTotal);
  }
  if (p > 8000){
    popTotal = 8000;
    popInput.value(popTotal);
  }
}
