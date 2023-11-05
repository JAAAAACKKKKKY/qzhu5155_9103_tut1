// Global variables to store circle patterns, circle diameter, and spacing between circles
let patterns = [];
let circleDiameter;
let spacing = 30; // Define space between circles


// Global variable to store the current state
let operationMode = 'still'; // Initial state: not rotating

// Global variables to store the mouse state
let overCircle = false; // Circle rollover
let locked = false; // Circle locked
let yoffset = 0.0; // Offset for moving circle
let xoffset = 0.0; // Offset for moving circle

let tempPattern = undefined; // Temporary pattern

let easing = 0.05; // Easing value

function setup() {
  // Create a canvas to fit the full window size and set the background color
  createCanvas(windowWidth, windowHeight);
  // background('#194973');
  // noLoop(); // Prevent p5.js from continuously redrawing the canvas

  circleDiameter = 200; // Define a fixed diameter for the circles

  frameRate(50); // Set the frame rate to 20 frames per second

  // Calculate the number of circles that can fit in the canvas width (columns) and height (rows)
  let cols = ceil(width / (circleDiameter + spacing));
  let rows = ceil(height / (circleDiameter + spacing));

  // Loop through the columns and rows to position each circle pattern
  for(let i = 0; i < cols; i++) {
    for(let j = 0; j < rows; j++) {
      // Calculate staggered offset for both x and y positions
      let offsetX = (j % 2) * spacing * 2; // Horizontal staggering
      let offsetY = (i % 2) * spacing * 2; // Vertical staggering

      // Calculate the x and y positions for each circle
      let x = i * (circleDiameter + spacing) + offsetX + circleDiameter / 2;
      let y = j * (circleDiameter + spacing) + offsetY + circleDiameter / 2;
      

      // Generate random colors for the circle and inner shapes
      let color = [random(255), random(255), random(255)];
      let dotColor = [random(255), random(255), random(255)];

      // Store the circle pattern attributes in the patterns array
      patterns.push({
        x: x,
        y: y,
        size: circleDiameter,
        color: color,
        dotColor: dotColor,
        type: int(random(3)), // Randomly select one of three design types
      });
    }
  }
}

// Use Function draw() to draw the animation
function draw(){
  background('#194973'); // Clear the canvas with the same background

  // Switch between the two states
  switch(operationMode){
    case 'still':
      for(let pattern of patterns){
        drawPattern(pattern);
      }
      break;
    
    case 'changeColor':
      for(let pattern of patterns){
        drawColorPattern(pattern);
      }
      break;

    case 'rotate':
      for(let pattern of patterns){
        drawRotatePattern(pattern);
      }
      break;

    case 'easing':
      for(let pattern of patterns){
        drawEasingPattern(pattern);
      }
      break;

    case 'moving':
      for(let pattern of patterns){
        drawMovingPattern(pattern);
      }
      break;
  }
}

// Function to draw a still pattern - Final Group Project Code
function drawPattern(pattern){
  noLoop(); // Prevent p5.js from continuously redrawing the canvas
  
  // Draw the outer "pearl necklace" chain around each circle with the new pattern
  let outerRadius = pattern.size / 2 + 10; // Define the radius for the pearl chain
  let pearls = [1, 1, 1, 0]; // Define the pattern of pearls (1 small, 1 small, 1 small, 0 large, and so on)
  let pearlIndex = 0;

  let numPearls = TWO_PI * outerRadius / 20;
  for (let i = 0; i < numPearls; i++) {
    let angle = i * TWO_PI / numPearls;
    let pearlX = pattern.x + outerRadius * cos(angle);
    let pearlY = pattern.y + outerRadius * sin(angle);

    if (pearls[pearlIndex] === 1) {
      fill(random(255), random(255), random(255)); // Set the fill color for the small pearls
      ellipse(pearlX, pearlY, 10); // Draw a small pearl
    } else {
      fill(255); // Set the fill color for the large pearls
      ellipse(pearlX, pearlY, 20); // Draw a large pearl
    }

    pearlIndex = (pearlIndex + 1) % pearls.length; // Move to the next pattern element
  }
  
  // Draw the circle with the new pattern
  let numCircle = 5; // Number of circles
  let startRadius = 100; // Initial radius
  let radiusStep = 20; // Decreasing radius
  for(let i = 0; i < numCircle; i++){
    let radius = startRadius - radiusStep * i;
    ellipse(pattern.x, pattern.y, radius * 2);
    fill(random(255), random(255), random(255)); // Set the fill color for the circle
  }
  
  // Draw the inner shapes with the new pattern
  let numShapes = 20; // Set the number of shapes in each circle
  for(let i = 0; i < numShapes; i++) {
    for(let j = 0; j < 5; j++){
      let angle = TWO_PI / numShapes * i;
      let shapeX = pattern.x + (pattern.size / 2 - 10 * j) * cos(angle);
      let shapeY = pattern.y + (pattern.size / 2 - 10 * j) * sin(angle);
      fill(pattern.dotColor); // Set the fill color for the inner shapes

      // Depending on the design type
      if (pattern.type === 0) {
        // Draw five small circles of radius 5 inside each circle
        ellipse(shapeX, shapeY, 5);

      } else if(pattern.type === 1) {
        
        // Draw five small circles of radius 5 inside each circle
        for(let j = 0; j < 5; j ++){
          let angle = TWO_PI / numShapes * i;
          let shapeX1 = pattern.x + (pattern.size / 2 * 0.6 - 10 * j) * cos(angle);
          let shapeY1 = pattern.y + (pattern.size / 2 * 0.6 - 10 * j) * sin(angle);
          fill(pattern.dotColor); // Set the fill color for the inner shapes
          ellipse(shapeX1, shapeY1, 5);
        }
        
        // Draw five small circles of radius 5 inside each circle and arrange them neatly
        for(let j = 0; j < 5; j ++){
          let angle = TWO_PI / numShapes * i;
          let shapeX2 = pattern.x + (pattern.size / 2 - 5 * j) * cos(angle);
          let shapeY2 = pattern.y + (pattern.size / 2 - 5 * j) * sin(angle);
          fill(pattern.dotColor); // Set the fill color for the inner shapes
          ellipse(shapeX2, shapeY2, 5);
        }

      } else if(pattern.type === 2) {
        
        // Draw eight circles with linearly increasing radius
        for(let j = 0; j < 8; j ++){
          let radius = 6 * j;
          noFill();
          stroke(random(255), random(255), random(255)); // Set the colour of the internal shape stroke
          ellipse(pattern.x, pattern.y, radius);
        }
        
        stroke(0); // Restore stroke colour
        drawSawtoothRing(pattern.x, pattern.y, pattern.size /3, 20, pattern.size/2*0.35); // Draw a swatooth ring
      }
    }
  }
}

// Function to draw color change pattern
function drawColorPattern(pattern){

  frameRate(7); // Set the frame rate to 7 frames per second

  // Draw the outer "pearl necklace" chain around each circle with the new pattern
  let outerRadius = pattern.size / 2 + 10; // Define the radius for the pearl chain
  let pearls = [1, 1, 1, 0]; // Define the pattern of pearls (1 small, 1 small, 1 small, 0 large, and so on)
  let pearlIndex = 0;

  let numPearls = TWO_PI * outerRadius / 20;

  for (let i = 0; i < numPearls; i++) {
    let angle = i * TWO_PI / numPearls;
    let pearlX = pattern.x + outerRadius * cos(angle);
    let pearlY = pattern.y + outerRadius * sin(angle);

    if (pearls[pearlIndex] === 1) {
      fill(random(255), random(255), random(255)); // Set the fill color for the small pearls
      ellipse(pearlX, pearlY, 10); // Draw a small pearl
    } else {
      fill(255); // Set the fill color for the large pearls
      ellipse(pearlX, pearlY, 20); // Draw a large pearl
    }

    pearlIndex = (pearlIndex + 1) % pearls.length; // Move to the next pattern element
  }

  // Draw the circle with the new pattern
  let numCircle = 5; // Number of circles
  let startRadius = 100; // Initial radius
  let radiusStep = 20; // Decreasing radius
  for(let i = 0; i < numCircle; i++){
    let radius = startRadius - radiusStep * i;
    ellipse(pattern.x, pattern.y, radius * 2);
    fill(random(255), random(255), random(255)); // Set the fill color for the circle
  }
  
  // Draw the inner shapes with the new pattern
  let numShapes = 20; // Set the number of shapes in each circle
  for(let i = 0; i < numShapes; i++) {
    for(let j = 0; j < 5; j++){
      let angle = TWO_PI / numShapes * i;
      let shapeX = pattern.x + (pattern.size / 2 - 10 * j) * cos(angle);
      let shapeY = pattern.y + (pattern.size / 2 - 10 * j) * sin(angle);
      fill(pattern.dotColor); // Set the fill color for the inner shapes

      // Depending on the design type
      if (pattern.type === 0) {
        // Draw five small circles of radius 5 inside each circle
        ellipse(shapeX, shapeY, 5);

      } else if(pattern.type === 1) {
        
        // Draw five small circles of radius 5 inside each circle
        for(let j = 0; j < 5; j ++){
          let angle = TWO_PI / numShapes * i;
          let shapeX1 = pattern.x + (pattern.size / 2 * 0.6 - 10 * j) * cos(angle);
          let shapeY1 = pattern.y + (pattern.size / 2 * 0.6 - 10 * j) * sin(angle);
          fill(pattern.dotColor); // Set the fill color for the inner shapes
          ellipse(shapeX1, shapeY1, 5);
        }
        
        // Draw five small circles of radius 5 inside each circle and arrange them neatly
        for(let j = 0; j < 5; j ++){
          let angle = TWO_PI / numShapes * i;
          let shapeX2 = pattern.x + (pattern.size / 2 - 5 * j) * cos(angle);
          let shapeY2 = pattern.y + (pattern.size / 2 - 5 * j) * sin(angle);
          fill(pattern.dotColor); // Set the fill color for the inner shapes
          ellipse(shapeX2, shapeY2, 5);
        }

      } else if(pattern.type === 2) {
        
        // Draw eight circles with linearly increasing radius
        for(let j = 0; j < 8; j ++){
          let radius = 6 * j;
          noFill();
          stroke(random(255), random(255), random(255)); // Set the colour of the internal shape stroke
          ellipse(pattern.x, pattern.y, radius);
        }
        
        stroke(0); // Restore stroke colour
        drawSawtoothRing(pattern.x, pattern.y, pattern.size /3, 20, pattern.size/2*0.35); // Draw a swatooth ring
      }
    }
  }
}

// Function to draw a rotating pattern
function drawRotatePattern(pattern){

  frameRate(10);
  // Draw the outer "pearl necklace" chain around each circle with the new pattern
  let outerRadius = pattern.size / 2 + 10; // Define the radius for the pearl chain
  let pearls = [1, 1, 1, 0]; // Define the pattern of pearls (1 small, 1 small, 1 small, 0 large, and so on)
  let pearlIndex = 0;

  let numPearls = TWO_PI * outerRadius / 20;

  // Rotate the pearls around the circle
  push();
  translate(pattern.x, pattern.y);
  rotate(frameCount / 50.0);
  for (let i = 0; i < numPearls; i++) {
    let angle = i * TWO_PI / numPearls;
    let pearlX =  outerRadius * cos(angle);
    let pearlY =  outerRadius * sin(angle);

    if (pearls[pearlIndex] === 1) {
      fill(random(255), random(255), random(255)); // Set the fill color for the small pearls
      ellipse(pearlX, pearlY, 10); // Draw a small pearl
    } else {
      fill(255); // Set the fill color for the large pearls
      ellipse(pearlX, pearlY, 20); // Draw a large pearl
    }

    pearlIndex = (pearlIndex + 1) % pearls.length; // Move to the next pattern element
  }

  pop();
  
  // Draw the circle with the new pattern
  let numCircle = 5; // Number of circles
  let startRadius = 100; // Initial radius
  let radiusStep = 20; // Decreasing radius
  for(let i = 0; i < numCircle; i++){
    let radius = startRadius - radiusStep * i;
    ellipse(pattern.x, pattern.y, radius * 2);
    fill(pattern.color); // Set the fill color for the circle
  }
  
  // Draw the inner shapes with the new pattern
  let numShapes = 20; // Set the number of shapes in each circle

  // Rotate the inner shapes around the circle
  push();
  translate(pattern.x, pattern.y);
  rotate( - frameCount / 50.0);
  for(let i = 0; i < numShapes; i++) {
    for(let j = 0; j < 5; j++){
      let angle = TWO_PI / numShapes * i;
      let shapeX =  (pattern.size / 2 - 10 * j) * cos(angle);
      let shapeY =  (pattern.size / 2 - 10 * j) * sin(angle);
      fill(pattern.dotColor); // Set the fill color for the inner shapes

      // Depending on the design type
      if (pattern.type === 0) {
        // Draw five small circles of radius 5 inside each circle
        ellipse(shapeX, shapeY, 5);

      } else if(pattern.type === 1) {
        
        // Draw five small circles of radius 5 inside each circle
        for(let j = 0; j < 5; j ++){
          let angle = TWO_PI / numShapes * i;
          let shapeX1 =  (pattern.size / 2 * 0.6 - 10 * j) * cos(angle);
          let shapeY1 =  (pattern.size / 2 * 0.6 - 10 * j) * sin(angle);
          fill(pattern.dotColor); // Set the fill color for the inner shapes
          ellipse(shapeX1, shapeY1, 5);
        }
        
        // Draw five small circles of radius 5 inside each circle and arrange them neatly
        for(let j = 0; j < 5; j ++){
          let angle = TWO_PI / numShapes * i;
          let shapeX2 =  (pattern.size / 2 - 5 * j) * cos(angle);
          let shapeY2 =  (pattern.size / 2 - 5 * j) * sin(angle);
          fill(pattern.dotColor); // Set the fill color for the inner shapes
          ellipse(shapeX2, shapeY2, 5);
        }

      } else if(pattern.type === 2) {
        
        // Draw eight circles with linearly increasing radius
        for(let j = 0; j < 8; j ++){
          let radius = 6 * j;
          noFill();
          stroke(random(255), random(255), random(255)); // Set the colour of the internal shape stroke
          ellipse(0, 0, radius);
        }
        
        stroke(0); // Restore stroke colour
        drawSawtoothRing(0, 0, pattern.size /3, 20, pattern.size/2*0.35); // Draw a swatooth ring
      }
    }
  }
  pop();
  
}

// Function to draw a easing pattern in the circle when mouse hover
function drawEasingPattern(pattern){

  // Draw the outer "pearl necklace" chain around each circle with the new pattern
  let outerRadius = pattern.size / 2 + 10; // Define the radius for the pearl chain
  let pearls = [1, 1, 1, 0]; // Define the pattern of pearls (1 small, 1 small, 1 small, 0 large, and so on)
  let pearlIndex = 0;

  let numPearls = TWO_PI * outerRadius / 20;
  push();
  translate(pattern.x, pattern.y);
  rotate(frameCount / 50.0);
  for (let i = 0; i < numPearls; i++) {
    let angle = i * TWO_PI / numPearls;
    let pearlX =  outerRadius * cos(angle);
    let pearlY =  outerRadius * sin(angle);

    if (pearls[pearlIndex] === 1) {
      fill(random(255), random(255), random(255)); // Set the fill color for the small pearls
      ellipse(pearlX, pearlY, 10); // Draw a small pearl
    } else {
      fill(255); // Set the fill color for the large pearls
      ellipse(pearlX, pearlY, 20); // Draw a large pearl
    }

    pearlIndex = (pearlIndex + 1) % pearls.length; // Move to the next pattern element
  }

  pop();
  
  // Draw the circle with the new pattern
  let numCircle = 5; // Number of circles
  let startRadius = 100; // Initial radius
  let radiusStep = 20; // Decreasing radius

  // Create a variable to store the circle size
  let circleSize = random(pattern.size / 2); // Set the initial size of the circle
  let circleSizeTarget = random(pattern.size / 2); // Set the target size of the circle
  let nextChange = 0; // Set the time of the next change
  let changeInterval = 1000; // 1 second

  nextChange = millis() + changeInterval;

  for(let i = 0; i < numCircle; i++){
    ellipse(pattern.x, pattern.y, circleSize * 2);
    fill(pattern.color);
  }
  
  // Change the circle size every second
  if(millis() > nextChange){
    nextChange += changeInterval;
    circleSizeTarget = random(pattern.size / e);
  }

  // Ease the circle size towards the target size
  circleSize = lerp(circleSize, circleSizeTarget, 0.1);

  // Draw the inner shapes with the new pattern
  let numShapes = 20; // Set the number of shapes in each circle
  push();
  translate(pattern.x, pattern.y);
  rotate( - frameCount / 50.0);
  for(let i = 0; i < numShapes; i++) {
    for(let j = 0; j < 5; j++){
      let angle = TWO_PI / numShapes * i;
      let shapeX =  (pattern.size / 2 - 10 * j) * cos(angle);
      let shapeY =  (pattern.size / 2 - 10 * j) * sin(angle);
      fill(pattern.dotColor); // Set the fill color for the inner shapes

      // Depending on the design type
      if (pattern.type === 0) {
        // Draw five small circles of radius 5 inside each circle
        ellipse(shapeX, shapeY, 5);

      } else if(pattern.type === 1) {
        
        // Draw five small circles of radius 5 inside each circle
        for(let j = 0; j < 5; j ++){
          let angle = TWO_PI / numShapes * i;
          let shapeX1 =  (pattern.size / 2 * 0.6 - 10 * j) * cos(angle);
          let shapeY1 =  (pattern.size / 2 * 0.6 - 10 * j) * sin(angle);
          fill(pattern.dotColor); // Set the fill color for the inner shapes
          ellipse(shapeX1, shapeY1, 5);
        }
        
        // Draw five small circles of radius 5 inside each circle and arrange them neatly
        for(let j = 0; j < 5; j ++){
          let angle = TWO_PI / numShapes * i;
          let shapeX2 =  (pattern.size / 2 - 5 * j) * cos(angle);
          let shapeY2 =  (pattern.size / 2 - 5 * j) * sin(angle);
          fill(pattern.dotColor); // Set the fill color for the inner shapes
          ellipse(shapeX2, shapeY2, 5);
        }

      } else if(pattern.type === 2) {

        // Draw eight circles with linearly increasing radius
        for(let j = 0; j < 8; j ++){
          let radius = 6 * j;
          noFill();
          stroke(random(255), random(255), random(255)); // Set the colour of the internal shape stroke
          ellipse(0, 0, radius);
        }

        stroke(0); // Restore stroke colour
        drawSawtoothRing(0, 0, pattern.size /3, 20, pattern.size/2*0.35); // Draw a swatooth ring
      }
    }
  }
  pop();
  
}

// Function to draw a moving pattern when mouse pressed
function drawMovingPattern(pattern){

  frameRate(10); // Set the frame rate to 20 frames per second

  // Draw the outer "pearl necklace" chain around each circle with the new pattern
  let outerRadius = pattern.size / 2 + 10; // Define the radius for the pearl chain
  let pearls = [1, 1, 1, 0]; // Define the pattern of pearls (1 small, 1 small, 1 small, 0 large, and so on)
  let pearlIndex = 0;
  
  let d = dist(mouseX, mouseY, pattern.x, pattern.y);
  
  let numPearls = TWO_PI * outerRadius / 20;
  
  // Rotate the pearls around the circle
  push();
  translate(pattern.x, pattern.y);
  rotate(frameCount / 50.0);
  for (let i = 0; i < numPearls; i++) {
    let angle = i * TWO_PI / numPearls;
    let pearlX =  outerRadius * cos(angle);
    let pearlY =  outerRadius * sin(angle);

    if (pearls[pearlIndex] === 1) {
      fill(random(255), random(255), random(255)); // Set the fill color for the small pearls
      ellipse(pearlX, pearlY, 10); // Draw a small pearl
    } else {
      fill(255); // Set the fill color for the large pearls
      ellipse(pearlX, pearlY, 20); // Draw a large pearl
    }

    pearlIndex = (pearlIndex + 1) % pearls.length; // Move to the next pattern element
  }

  pop();

  // Check the mouse position in the range of the circle
  if(d < pattern.size / 2){
    overCircle = true;
    tempPattern = pattern;
    if(locked = false){
      stroke(0);
    }else if(locked = true){
      stroke(255);
    }
  }else if(d > pattern.size / 2){
    overCircle = false;
    stroke(0);
  }
  
  // Draw the circle with the new pattern
  let numCircle = 5; // Number of circles
  let startRadius = 100; // Initial radius
  let radiusStep = 20; // Decreasing radius
  for(let i = 0; i < numCircle; i++){
    let radius = startRadius - radiusStep * i;
    ellipse(pattern.x, pattern.y, radius * 2);
    fill(pattern.color); // Set the fill color for the circle
  }
  
  // Draw the inner shapes with the new pattern
  let numShapes = 20; // Set the number of shapes in each circle

  // Rotate the inner shapes around the circle
  push();
  translate(pattern.x, pattern.y);
  rotate( - frameCount / 50.0);
  for(let i = 0; i < numShapes; i++) {
    for(let j = 0; j < 5; j++){
      let angle = TWO_PI / numShapes * i;
      let shapeX =  (pattern.size / 2 - 10 * j) * cos(angle);
      let shapeY =  (pattern.size / 2 - 10 * j) * sin(angle);
      fill(pattern.dotColor); // Set the fill color for the inner shapes

      // Depending on the design type
      if (pattern.type === 0) {
        // Draw five small circles of radius 5 inside each circle
        ellipse(shapeX, shapeY, 5);

      } else if(pattern.type === 1) {
        
        // Draw five small circles of radius 5 inside each circle
        for(let j = 0; j < 5; j ++){
          let angle = TWO_PI / numShapes * i;
          let shapeX1 =  (pattern.size / 2 * 0.6 - 10 * j) * cos(angle);
          let shapeY1 =  (pattern.size / 2 * 0.6 - 10 * j) * sin(angle);
          fill(pattern.dotColor); // Set the fill color for the inner shapes
          ellipse(shapeX1, shapeY1, 5);
        }
        
        // Draw five small circles of radius 5 inside each circle and arrange them neatly
        for(let j = 0; j < 5; j ++){
          let angle = TWO_PI / numShapes * i;
          let shapeX2 =  (pattern.size / 2 - 5 * j) * cos(angle);
          let shapeY2 =  (pattern.size / 2 - 5 * j) * sin(angle);
          fill(pattern.dotColor); // Set the fill color for the inner shapes
          ellipse(shapeX2, shapeY2, 5);
        }

      } else if(pattern.type === 2) {
        
        // Draw eight circles with linearly increasing radius
        for(let j = 0; j < 8; j ++){
          let radius = 6 * j;
          noFill();
          stroke(random(255), random(255), random(255)); // Set the colour of the internal shape stroke
          ellipse(0, 0, radius);
        }
        
        stroke(0); // Restore stroke colour
        drawSawtoothRing(0, 0, pattern.size /3, 20, pattern.size/2*0.35); // Draw a swatooth ring
      }
    }
  }
  pop();
}

// Function to handle key presses
// Press 's' to stop the animation
// Press 'r' to rotate the animation
// Press 'c' to change the color of the animation
// Press 'e' to ease the circle size
// Press 'm' to move the pattern in the rotation
function keyPressed(){
  if(key === 's'){
    operationMode = 'still';
  }else if(key === 'r'){
    operationMode = 'rotate';
  }else if(key === 'c'){
    operationMode = 'changeColor';
  }else if(key === 'e'){
    operationMode = 'easing';
  }else if(key === 'm'){
    operationMode = 'moving';
  }
}

// Function to handle mouse clicks
// Click to start the animation - noLoop() is disabled
function mouseClicked() {
  if (operationMode === 'still') {
    operationMode = 'changeColor';
    loop(); // start the animation loop
  }
}
// Function to handle mouse presses
function mousePressed(){
  if(overCircle){
    locked = true;
  }else{
    locked = false;
  }

  // Calculate the offset between the mouse position and the circle position
  if(tempPattern){
    xoffset = mouseX - tempPattern.x;
    yoffset = mouseY - tempPattern.y;
  }
  
}

// Function to handle mouse drags
function mouseDragged(){
  // Move the circle to the mouse position
  if(locked && tempPattern){
    tempPattern.x = mouseX - xoffset;
    tempPattern.y = mouseY - yoffset;
  }
}

// Function to handle mouse releases
function mouseReleased(){
  locked = false;
}

// Function to handle window resizing
function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // Resize the canvas to fit the new window size
  background('#194973'); // Clear the canvas with the same background
  setup(); // Recalculate columns and rows
  patterns = []; // Reset Pattern Array
}

// Function to draw a swatooth ring
function drawSawtoothRing(cx, cy, radius, teeth, toothHeight){
  let angleIncrement = TWO_PI/teeth; // Calculate the angle increment between each tooth

  beginShape();
  for (let i = 0; i < teeth; i++) {
    let angle = i * angleIncrement;
    
    // Inner vertex
    let innerX = cx + (radius - toothHeight) * cos(angle);
    let innerY = cy + (radius - toothHeight) * sin(angle);
    vertex(innerX, innerY);
    
    // Outer vertex
    let outerX = cx + (radius + toothHeight) * cos(angle + angleIncrement / 2);
    let outerY = cy + (radius + toothHeight) * sin(angle + angleIncrement / 2);
    vertex(outerX, outerY);

    noFill(); // Set SawtoothRing to no fill
  }

  endShape(CLOSE);
  fill(random(255), random(255), random(255)); // Restore fill properties of other shapes
}