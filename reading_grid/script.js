/* -----------------------------------------------------------
   Helper shortcuts
----------------------------------------------------------------*/
const $ = id => document.getElementById(id);
const rngLabel = (rng,lbl)=>rng.addEventListener('input',()=>$(lbl).textContent=rng.value);
rngLabel($('emojiSize'),'emojiVal');
rngLabel($('labelSize'),'labelVal');
rngLabel($('gridStrokeW'),'gridStrokeVal');
rngLabel($('borderStrokeW'),'borderStrokeVal');
rngLabel($('bgAlpha'),'alphaVal');

const ALL_FONTS=['Roboto','Fredoka','Comic Neue','Baloo 2','Gloria Hallelujah'];
ALL_FONTS.forEach(f=>{ensureFont(f);document.fonts.load(`16px "${f}"`);});

const fontSel=$('fontSel');
function updateFontSelStyle(){fontSel.style.fontFamily=`"${fontSel.value}", sans-serif`;}
fontSel.addEventListener('change',updateFontSelStyle);
updateFontSelStyle();

let dlCounter = 1;

function ensureFont(family){
  const id='gfont-'+family.replace(/\s+/g,'-');
  if(!document.getElementById(id)){
    const link=document.createElement('link');
    link.id=id; link.rel='stylesheet';
    link.href=`https://fonts.googleapis.com/css2?family=${family.replace(/ /g,'+')}&display=swap`;
    document.head.appendChild(link);
  }
}

/* Random pick */
const choice = a => a[Math.random()*a.length|0];
const shuffle = a => {
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
};

/* -----------------------------------------------------------
   Canvas generator
----------------------------------------------------------------*/
const LABEL_COLORS = [
  '#007c8f',
  '#580078',
  '#d67a02',
  '#93a100',
  '#ab0a4d',
  '#008f4a'];

async function makeMatrix(){
  const cols = +$('cols').value;
  const rows = +$('rows').value;

  const emojiPx = +$('emojiSize').value;
  const labelPx = +$('labelSize').value;
  let widthPx  = +$('width').value;
  let heightPx = +$('height').value;
  const minWidth  = cols * emojiPx;
  const minHeight = rows * (emojiPx + labelPx);
  if(widthPx < minWidth)  widthPx = minWidth;
  if(heightPx < minHeight) heightPx = minHeight;
  if(+$('width').value !== widthPx)  $('width').value = widthPx;
  if(+$('height').value !== heightPx) $('height').value = heightPx;
  const padX = (widthPx/cols - emojiPx)/2;
  const padY = (heightPx/rows - emojiPx - labelPx)/3;
  const gridStrokeW  = +$('gridStrokeW').value;
  const gridStrokeC  = $('gridStrokeCol').value;
  const borderStrokeW = +$('borderStrokeW').value;
  const borderStrokeC = $('borderStrokeCol').value;
  const font    = $('fontSel').value;
  const caps    = $('capsSel').value;
  const bgAlpha = +$('bgAlpha').value / 100;
  const bgColor = $('bgColor').value;
  const textOutline = $('textOutline').checked;
  const labelBold = $('labelBold').checked;
  const colorfulText = $('colorfulText').checked;

  ensureFont(font);
  /* wait until the font is actually available before drawing text */
  await document.fonts.load(`${labelPx}px "${font}"`);

  const available = Object.keys(wordMap);
  const needed = cols*rows;
  if(available.length < needed){
    alert('Not enough words to fill matrix without duplicates');
    return;
  }
  const words = shuffle([...available]).slice(0, needed);

  /* Cell dimensions: emoji + label + paddings top/bottom */
  const cellW = emojiPx + padX*2;
  const cellH = emojiPx + labelPx + padY*3;

  /* Large internal canvas size */
  const canvas = $('matrix');
  const scale  = window.devicePixelRatio||1;
  canvas.width  = widthPx*scale;
  canvas.height = heightPx*scale;
  canvas.style.width  = widthPx + 'px';
  canvas.style.height = 'auto';

  const ctx = canvas.getContext('2d');
  ctx.scale(scale,scale);
  ctx.clearRect(0,0,canvas.width/scale,canvas.height/scale);
  if(bgAlpha>0){
    ctx.save();
    ctx.globalAlpha = bgAlpha;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0,0,canvas.width/scale,canvas.height/scale);
    ctx.restore();
  }
  ctx.fillStyle = '#000';

  ctx.textAlign='center';
  ctx.textBaseline='middle';

  /* Draw grid + content */
  let idx=0;
  const startColorIdx = Math.floor(Math.random() * LABEL_COLORS.length);
  for(let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
      const x=c*cellW, y=r*cellH;
      const cx=x+cellW/2, cy=y+padY+emojiPx/2;

      const word=words[idx++];
      const emo =choice(wordMap[word]);
      let label=word;
      if(caps==='upper')      label=word.toUpperCase();
      else if(caps==='lower') label=word.toLowerCase();
      else if(caps==='cap')   label=word.charAt(0).toUpperCase()+word.slice(1).toLowerCase();

      /* emoji */
      ctx.font=`${emojiPx}px sans-serif`;
      ctx.fillText(emo,cx,cy);

      /* label */
      const labelY = y + emojiPx + padY*2 + labelPx/2;
      if(textOutline){
        ctx.font=`bold ${labelPx}px "${font}", sans-serif`;
        ctx.fillStyle='#fff';
        ctx.fillText(label,cx,labelY);
      }
      ctx.font=`${labelBold?'bold ':''}${labelPx}px "${font}", sans-serif`;
      const colourIdx = (startColorIdx + r + c) % LABEL_COLORS.length;
      ctx.fillStyle   = colorfulText ? LABEL_COLORS[colourIdx] : '#000';
      ctx.fillText(label,cx,labelY);
    }
  }

  /* Grid lines */
  if(gridStrokeW>0){
    ctx.lineWidth=gridStrokeW;
    ctx.strokeStyle=gridStrokeC;
    ctx.beginPath();
    for(let c=1;c<cols;c++){
      const x=c*cellW;
      ctx.moveTo(x,0);
      ctx.lineTo(x,rows*cellH);
    }
    for(let r=1;r<rows;r++){
      const y=r*cellH;
      ctx.moveTo(0,y);
      ctx.lineTo(cols*cellW,y);
    }
    ctx.stroke();
  }

  /* Outer border */
  if(borderStrokeW>0){
    ctx.lineWidth=borderStrokeW;
    ctx.strokeStyle=borderStrokeC;
    ctx.strokeRect(0,0,cols*cellW,rows*cellH);
  }

  /* Download button */
  $('download').onclick = () => {
    const link = document.createElement('a');
    link.download = `word_grid_${cols}x${rows}_${String(dlCounter).padStart(4,'0')}.png`;

    /* Flatten high-DPI canvas to the user specified dimensions */
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width  = widthPx;
    exportCanvas.height = heightPx;
    exportCanvas.getContext('2d').drawImage(canvas, 0, 0, widthPx, heightPx);

    link.href = exportCanvas.toDataURL('image/png');
    dlCounter++;
    link.click();
  };
}

/* -----------------------------------------------------------
   UI wiring
----------------------------------------------------------------*/
let drawQueue=Promise.resolve();
function scheduleMatrix(){ drawQueue=drawQueue.then(()=>makeMatrix()); }

$('generate').onclick=scheduleMatrix;
document.querySelectorAll('#controls input, #controls select')
        .forEach(el=>el.addEventListener('change',scheduleMatrix));

scheduleMatrix(); /* initial draw */
