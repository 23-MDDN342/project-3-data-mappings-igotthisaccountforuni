/*
 * FaceMap class - holds all informaiton about one mapped
 * face and is able to draw itself.
 */  

// remove this or set to false to enable full program (load will be slower)
var DEBUG_MODE = true;

// this can be used to set the number of sliders to show
var NUM_SLIDERS = 3;

// other variables can be in here too
// here's some examples for colors used


const stroke_color = [95, 52, 8];

// example of a global function
// given a segment, this returns the average point [x, y]
function segment_average(segment) {
  let sum_x = 0;
  let sum_y = 0;
  let s_len = segment.length;
  for (let i=0; i<s_len; i++) {
    sum_x = sum_x + segment[i][0];
    sum_y = sum_y + segment[i][1];
  }
  return [sum_x / s_len , sum_y / s_len ];
}

// This where you define your own face object
function Face() {
  // these are state variables for a face
  // (your variables should be different!)


  /*
   * Draw the face with position lists that include:
   *    chin, right_eye, left_eye, right_eyebrow, left_eyebrow
   *    bottom_lip, top_lip, nose_tip, nose_bridge, 
   */  
  this.draw = function(positions) {
    this.draw_back(positions.chin);
    this.draw_mask(positions.chin);
    this.draw_segment(positions.chin);
    this.draw_segment(positions.right_eye);
    this.draw_segment(positions.left_eye);
    this.draw_segment(positions.bottom_lip);


    // this.draw_segment(positions.right_eyebrow);
    // this.draw_segment(positions.left_eyebrow);

  }

  // example of a function *inside* the face object.
  // this draws a segment, and do_loop will connect the ends if true
  this.draw_segment = function(segment) {
    for(let i=0; i<segment.length; i++) {
        let px = segment[i][0];
        let py = segment[i][1];
        push();
        translate(px, py);
        scale(0.01);
        rotate(random(0, 360));

        stroke(255);
        strokeWeight(3);
        fill(255, 255, 255, 100);

        ellipse(0, 0, 50, 50);
        ellipse(-8, -6, 10, 10);
        ellipse(8, -6, 10, 10);
        ellipse(0, 12, 20, 15);
        pop();
    }
  }
  this.draw_mask = function(segment) {    
    for(let i = 0; i < segment.length/2; i++){
      let firstX = segment[i][0];
      let firstY = segment[i][1];

      let indexLast = (segment.length-1) - i;
      let lastX = segment[indexLast][0];
      let gapX = lastX - firstX;

      
      for(let placeX = firstX ; placeX < lastX ; placeX = placeX + gapX/10){
        push();
        translate(placeX + random(-0.05, 0.05), firstY + random(-0.05, 0.05));
        scale(0.01);
        rotate(random(0, 360));
        noStroke();
          let rColour = int(random(1,5));
          let rTransparency = random(60, 220);
          let highlights = [
          [255, 154, 0, rTransparency],
          [0, 255, 4, rTransparency],
          [0, 197, 255, rTransparency],
          [255, 0, 167, rTransparency]
          ];

          if(rColour == 1){
            fill(highlights[0]);
          }
          if(rColour == 2){
            fill(highlights[1]);
          }
          if(rColour == 3){
            fill(highlights[2]);
          }
          if(rColour == 4){
            fill(highlights[3]);
          }

          ellipse(0, 0, 50, 50);
          ellipse(-8, -6, 10, 10);
          ellipse(8, -6, 10, 10);
          ellipse(0, 12, 20, 15);
        pop();
      }
    }
  }
  this.draw_back = function(segment) {
    let maskSize = 5;
    let firstX = segment[0][0];
    let lastX = segment[segment.length-1][0];

    let gap = lastX - firstX
    let backPos = gap/2;
    fill(0);
    stroke(255);
    ellipse(firstX + backPos, segment[1][1], maskSize/1.3, maskSize);
  }

  /* set internal properties based on list numbers 0-100 */
  this.setProperties = function(settings) {
    this.num_eyes = int(map(settings[0], 0, 100, 1, 2));
    this.eye_shift = map(settings[1], 0, 100, -2, 2);
    this.mouth_size = map(settings[2], 0, 100, 0.5, 8);
  }

  /* get internal properties as list of numbers 0-100 */
  this.getProperties = function() {
    let settings = new Array(3);
    settings[0] = map(this.num_eyes, 1, 2, 0, 100);
    settings[1] = map(this.eye_shift, -2, 2, 0, 100);
    settings[2] = map(this.mouth_size, 0.5, 8, 0, 100);
    return settings;
  }
}