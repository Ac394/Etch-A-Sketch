const slider = document.getElementById('slider');
const output = document.getElementById('sizeOutput');
let div;
let size = slider.value;
let docFrag = document.createDocumentFragment();
let color = document.getElementById('colorpicker').value
let mouseState = false;
let HSL = HexToHSL(color);
let rainbowColor = [0,0,0];
let bgColor = [];

document.oncontextmenu = function(e) { e.preventDefault(); e.stopPropagation(); }

// Change grid Column number
function gridSize(size) {
  document.getElementById('container').style.gridTemplateColumns = `repeat(${size}, 1fr)`;
}

// Create divs depending on the grid size
function gridDiv(size) {
    for (let i = 0; i < size*size; i++) {
    div = document.createElement('div');
    div.className = 'gridCell';
    div.style.background = 'rgb(255,255,255)'
    div.addEventListener('mousedown', start);
    div.addEventListener('mouseenter', start);    
    docFrag.appendChild(div);
  }  
  container.appendChild(docFrag);
}

// Update slider grid size text
slider.oninput = function() {
  size = this.value;
  output.innerText = `${this.value} x ${this.value}`;
}

// Clear container and add divs on slider release
slider.onchange = function() {
  document.getElementById('container').innerHTML = '';
  gridSize(size);
  gridDiv(size);
}

// Create the Grid
function createGrid() {
  document.getElementById('container').innerHTML = '';
  gridSize(size);
  gridDiv(size);
}

// Update the color variable from color picker
document.getElementById('colorpicker').oninput = function() {
  color = this.value;
  HSL = HexToHSL(color);
}

// RGB to HEX
function RGBToHSL(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const l = Math.max(r, g, b);
  const s = l - Math.min(r, g, b);
  const h = s
    ? l === r
      ? (g - b) / s
      : l === g
      ? 2 + (b - r) / s
      : 4 + (r - g) / s
    : 0;
  return [
    60 * h < 0 ? 60 * h + 360 : 60 * h,
    100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
    (100 * (2 * l - s)) / 2,
  ];
};

// Convert to HSL
function HexToHSL(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    let r = parseInt(result[1], 16);
    let g = parseInt(result[2], 16);
    let b = parseInt(result[3], 16);

    r /= 255, g /= 255, b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        
        h /= 6;
    }

    s = s*100;
    s = Math.round(s);
    l = l*100;
    l = Math.round(l);
    h = Math.round(360*h);  

    return [h,s,l]
}

// Convert RGB to Array
function getRGB(rgb) {
  return rgb.replace(/[^\d,]/g, '').split(',');
}

// Darken current HSL by 10%
function darken(HSL) {  
  HSL[2] = HSL[2]-10;
  if (HSL[2] <= 0) {
    HSL[2] = 0
  }
  return console.log(HSL)
}

// Lighten current HSL by 10%
function lighten(HSL) {
  HSL[2] = HSL[2]+10;
  if (HSL[2] >= 100) {
    HSL[2] = 100
  }
  return console.log(HSL)
}

// Get a random number from a set range
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// Rainbow color random HSL
function rainbow() {
  rainbowColor[0] = randomNumber(0,360);
  rainbowColor[1] = randomNumber(0,100);
  rainbowColor[2] = randomNumber(0,100);
  console.log(rainbowColor)
}


function start(e) {
  e.preventDefault()
  if(e.buttons == '1' || e.buttons == '2' || e.buttons == '4') {      
        if (document.getElementById('colormode').checked) {
          e.target.style.background = `hsl(${HSL[0]}, ${HSL[1]}%, ${HSL[2]}%)`
        } else if (document.getElementById('rainbow').checked) {
          rainbow()
          e.target.style.background = `hsl(${rainbowColor[0]}, ${rainbowColor[1]}%, ${rainbowColor[2]}%)`
        } else if (document.getElementById('erase').checked) {
          e.target.style.background = `hsl(0, 0%, 100%)`
        } else if (document.getElementById('lighten').checked) {
          bgColor = getRGB(e.target.style.backgroundColor)
          bgColor = RGBToHSL(bgColor[0], bgColor[1], bgColor[2])
          lighten(bgColor)
          e.target.style.background = `hsl(${bgColor[0]}, ${bgColor[1]}%, ${bgColor[2]}%)`
        } else if (document.getElementById('darken').checked) {
          bgColor = getRGB(e.target.style.backgroundColor)
          bgColor = RGBToHSL(bgColor[0], bgColor[1], bgColor[2])
          darken(bgColor)
          e.target.style.background = `hsl(${bgColor[0]}, ${bgColor[1]}%, ${bgColor[2]}%)`
        }
    }
};

document.getElementById("clear").onclick = createGrid;

window.onload = createGrid;