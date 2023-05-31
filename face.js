/*
 * FaceMap class - holds all informaiton about one mapped
 * face and is able to draw itself.
 */  

// remove this or set to false to enable full program (load will be slower)
var DEBUG_MODE = true;

// this can be used to set the number of sliders to show
var NUM_SLIDERS = 4;

// other variables can be in here too
// here's some examples for colors used


const faceSize = 35;

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

/* Draw the face with position lists that include:
 *    chin, right_eye, left_eye, right_eyebrow, left_eyebrow
 *    bottom_lip, top_lip, nose_tip, nose_bridge */
   
function Face() {
  this.trait = 0;
  this.skinColor = 0;
  this.decor = 0;
  this.ageing = 0;

  this.draw = function(positions) {
    let var1 = segment_average(positions.right_eyebrow);
    let var2 = segment_average(positions.left_eyebrow);
    this.draw_back(positions.chin, var1, var2);

    this.draw_mask(positions.chin);
    this.draw_segment2(positions.chin);
    this.draw_segment(positions.right_eye);
    this.draw_segment(positions.left_eye);
    this.draw_segment(positions.bottom_lip);
    if(this.trait < 50){
      this.draw_segment(positions.right_eyebrow);
    } 
    else {
      this.draw_segment(positions.left_eyebrow);
    }

  }

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
        fill(255, 255, 255, 120);

        this.faceDraw();
        pop();
    }
  }

  this.draw_segment2 = function(segment) {
    for(let i=0; i<segment.length; i++) {
        let px = segment[i][0];
        let py = segment[i][1];

        push();
        translate(px, py);
        scale(0.01);
        rotate(random(0, 360));

        stroke(255);
        strokeWeight(3);
        fill(255, 255, 255, 120);

        this.faceDraw();

        pop();

        if( i < segment.length - 1){
          let nx = segment[i + 1][0];
          let ny = segment[i + 1][1];
          
          let gx;
          let gy;

          if(nx > px){
            gx = nx - px;
          } else { gx = nx - px; }

          if(ny > py){
            gy = ny - py;
          } else { gy = ny - py; }

          push();
          translate(px + gx/2 , py + gy/2 );
          scale(0.01);
          rotate(random(0, 360));

          stroke(255);
          strokeWeight(3);
          fill(255, 255, 255, 130);

          this.faceDraw();
          pop();
        }
    }
  }

  this.draw_mask = function(segment) {    
    for(let i = 0; i < segment.length/2; i++){
      let firstX = segment[i][0] + 0.1;
      let firstY = segment[i][1];

      let indexLast = (segment.length-1) - i;
      let lastX = segment[indexLast][0];
      let gapX = lastX - firstX;

      
      for(let placeX = firstX ; placeX < lastX ; placeX = placeX + gapX/this.decor){
        push();
        translate(placeX + random(-0.05, 0.05), firstY + random(-0.05, 0.05));
        scale(0.01);
        rotate(random(0, 360));
        noStroke();
          let rColour = int(random(1,5));
          let highlights = [
          [255, 154, 0, this.ageing],
          [0, 255, 4, this.ageing],
          [0, 197, 255, this.ageing],
          [255, 0, 167, this.ageing]
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

          ellipse(0, 0, faceSize *1.4, faceSize *1.4 );
          ellipse(-6, -4, faceSize *1.4/5, faceSize *1.4/5);
          ellipse(6, -4, faceSize *1.4/5, faceSize *1.4/5);
          ellipse(0, 9, faceSize *1.4 * 0.4, faceSize * 1.4 * 0.33);
        pop();
      }
    }
  }
  this.draw_back = function(segment1, segment2, segment3) {
    let from = color(237, 196, 179);
    let to = color(119, 73, 54);

    let faceColour = lerpColor(from, to, this.skinColor);

    fill(faceColour);
    noStroke();
    
    beginShape();
    for(i = 0 ; i < segment1.length ; i++){
      vertex(segment1[i][0], segment1[i][1]);
    }
    curveVertex(segment2[0], segment2[1]);
    curveVertex(segment3[0], segment3[1]);
      
    endShape(CLOSE);
  }

  this.faceDraw = function() {
    ellipse(0, 0, faceSize, faceSize);
    noFill();
    ellipse(-6, -4, faceSize/5, faceSize/5);
    ellipse(6, -4, faceSize/5, faceSize/5);
    ellipse(0, 9, faceSize * 0.4, faceSize * 0.33);
  }

  /* set internal properties based on list numbers 0-100 */
  this.setProperties = function(settings) {
    this.skinColor = map(settings[0], 0, 100, 0, 1);
    this.trait = map(settings[1], 0, 100, 0, 100);
    this.decor = map(settings[2], 0, 100, 0, 15);
    this.ageing = map(settings[3], 0, 70, 190, 100);
  }

  /* get internal properties as list of numbers 0-100 */
  this.getProperties = function() {
    let settings = new Array(2);
    settings[0] = map(this.skinColor, 0, 100, 0, 100);
    settings[1] = map(this.trait, 0, 100, 0, 100);
    settings[2] = map(this.decor, 0, 15, 0, 100);
    settings[3] = map(this.ageing, 190, 70, 0, 100);
    return settings;
  }
}