let music;
let isPlaying = false;
let fft;
let circleSize;

// Set the music file
function preload() {
  music = loadSound('sample-visualisation.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  fft = new p5.FFT();
}

function draw() {
  background(0);

  // If the music is playing, draw a circle and lines in the middle of the screen.
  if (isPlaying){
    // The size of the circle will be changed by the music frequency.
    let spectrum = fft.analyze();
    beginShape();
    circleSize = map(spectrum[0], 0, 255, 0, 200);
    strokeWeight(4);
    noFill();
    
    ellipse(width/2, height/2, circleSize, circleSize);
    
    endShape();

    // The waveform of lines will be changed by the music frequency.
    let wave = fft.waveform();
    // Draw the lines.
    beginShape()
    for(let i=0; i<width; i+=0.5) {
        let index = floor(map(i,0,width,0,wave.length))
        let x = i
        let y = wave[index] * 100 + height /2
        vertex(x,y)
    }
    endShape()

    // The color of the circle line will be changed by the music frequency.
    let r = map(spectrum[0], 0, random(255), random(255), random(255));
    let g = map(spectrum[0], 0, random(255), random(255), random(255));
    let b = map(spectrum[0], 0, random(255), random(255), random(255));
    stroke(r, g, b);
  }

  // Give the user a hint on how to interact with the sketch.
  fill(255, 255, 255);
  textAlign(CENTER);
  textSize(20);
  text('Click to play or stop the music', width/2, 30); // Centered text within the canvas.
}


// When click the screen, play or stop the music
function mouseClicked() {
  if (!isPlaying) {
    music.play();
    isPlaying = true;
  } else {
    music.stop();
    isPlaying = false;
  }
}
