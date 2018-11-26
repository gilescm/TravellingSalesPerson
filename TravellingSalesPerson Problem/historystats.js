// Displays best Overall stats
function statsBestOverall() {
  calcBestOverall();
  // Display Text
  var text = ["Distance: " + nfc(bestOverall.calcDistance(),2,1), "Generation: " + evoHist.length, "Pool: " + nfc(memTotal)];
 textB1 = yoText + 4;
 msgLine(text, xoText,textB1,"   ");
    
  text = ["Best So Far, " + totalCities + " Cities"];
  msgLine(text, canWidth - xoText - textWidth(text),textB1,"");

  text = ["Pool Size: " + popTotal, "Crossover: " + doCrossover, "Will Stop At: " + nfc(memMax)];
  msgLine(text, xoText,height/2 - 8,"  ");
}

// Displays previous best stats
function statsBestHist(){
  calcHist();
  var rt = scrubHist();
  var text = ["Distance: " + nfc(bestHist[rt].calcDistance(),2,1), "Generation: " + rt];
  textB1 = yoText + 4;
  msgLine(text,xoText,textB1,"   ");
  text = ["History, " + totalCities + " Cities"];
  textB1 = yoText + 4;
  msgLine(text, canWidth - xoText - textWidth(text),textB1,"");
}

// Draw the graph showing history of generations
function dispHist(){
  // scrubHistory becomes evoHist.length-1 when mouse is
  // not in the history panel
  var hindx = scrubHist();
  if (hindx < 1){ return;}
  var eHMinX = evoHist[0].x;
  var eHMaxY = evoHist[0].y;
  var eHMaxX = evoHist[hindx].x;
  var eHMinY = evoHist[hindx].y;
  stroke(histColour1);
  strokeWeight(2);
  noFill();
  // history curve up to the scrubHist only
  beginShape();
  for (var i = 0; i <= hindx; i++ ){
    var x = map(evoHist[i].x,eHMinX,eHMaxX,margEdge,canWidth - margEdge);
    var y = map(evoHist[i].y,eHMinY,eHMaxY,canHeight/2 - margEdge/2, margEdge + margEdge/2);
    vertex(x, y);
    ellipse(x,y, 2, 2);
  }
  endShape();
  
  // Full history curve
  stroke(histColour2);
  eHMaxX = evoHist[evoHist.length-1].x;
  eHMinY = evoHist[evoHist.length-1].y;
  beginShape();
  for (var i = 0; i <= evoHist.length-1; i++ ){
    var x = map(evoHist[i].x,eHMinX,eHMaxX,margEdge,canWidth - margEdge);
    var y = map(evoHist[i].y,eHMinY,eHMaxY,canHeight/2 - margEdge/2, margEdge + margEdge/2);
    vertex(x, y);
    ellipse(x,y, 2, 2);
    if (i > (evoCurve.length-1)){
      var v = createVector(x,y);
      evoCurve.push(v);
    }
  }
  endShape();
  
  // Point corresponding to scrub hindx
  strokeWeight(3);
  stroke(255,110,0);
  eHMaxX = evoHist[evoHist.length-1].x;
  eHMinY = evoHist[evoHist.length-1].y;
  var x = map(evoHist[hindx-1].x,eHMinX,eHMaxX,margEdge,canWidth - margEdge);
  var y = map(evoHist[hindx-1].y,eHMinY,eHMaxY,canHeight/2 - margEdge/2, margEdge + margEdge/2);
  ellipse(x,y, 4, 4);
}

function calcHist(){
  var hindx = scrubHist();
  LastP = 0;
  LastT = 0;
  if (hindx >= 2){
    var lc = evoHist[hindx-2].y - evoHist[hindx-1].y;
    LastP = 100 * lc / evoHist[hindx-1].y;
    LastT = evoHist[hindx-1].x;
  }
}

function calcBestOverall(){
  var lindx = evoHist.length-1;
  bestOverallP = 0;
  bestOverallT = 0;
  if (lindx >= 1){
    var lc = evoHist[lindx-1].y - evoHist[lindx].y;
    bestOverallP = 100 * lc / evoHist[lindx].y;
    bestOverallT = evoHist[lindx].x;
  }
}

function msgLine(textItems,xoText,yoText,spc){
  textSize(12);
  stroke(textColour/2);
  fill(textColour);
  var statLine = "";
  textItems.forEach(function(textitem){statLine += textitem + spc});
  text(statLine, xoText, yoText);
}

function scrubHist(){
  var x = evoHist.length-1; // default value
  if (mouseY < canHeight/2){
    var rSide = canWidth - margEdge;
    if(mouseX >= margEdge && mouseX <= rSide){
      x = floor(map(mouseX,margEdge,rSide,1,evoHist.length-1));
    }
  }
  return x;
}









