<template>
  <canvas ref="canvas"></canvas>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { debounce } from "lodash";
import { mix } from "tinycolor2";
import { sin, cos, dist } from "@/util/math";

// settings shared across functions
const size = 4; // size of dots and links
const gap = 50; // distance between dots
const baseColor = "#" + mix("#ffffff", "#00838f", 92).toHex(); // color of elements at rest
const pulseColor = "#" + mix("#ffffff", "#00838f", 50).toHex(); // color of element when pulsing
// (other one-off settings in place below)

interface Dot {
  // rendered position
  x: number;
  y: number;
  // center/original position
  cx: number;
  cy: number;
  // angle and spin
  angle: number;
  spin: number;
  // target and actual color
  color: string;
  colorTarget: string;
}

interface Link {
  // dots to link together
  a: Dot;
  b: Dot;
  // target and actual color
  color: string;
  colorTarget: string;
}

// globals
let canvas = null as HTMLCanvasElement | null;
let ctx = null as CanvasRenderingContext2D | null;
let width = 0;
let height = 0;
let dots: Array<Dot> = [];
let links: Array<Link> = [];

// one step/tick/frame
const step = () => {
  move();
  clear();
  draw();
};

// pulse color of field of dots and links from inward to outward
const pulse = () => {
  for (const entity of [...dots, ...links]) {
    // get center position of entity
    const x = "x" in entity ? entity.x : (entity.a.x + entity.b.x) / 2;
    const y = "y" in entity ? entity.y : (entity.a.y + entity.b.y) / 2;
    // time delays
    const speed = 2 / 10; // how fast pulse propagates outward
    const start = dist(x - width / 2, y - height / 2) / speed;
    const reset = start + 100 / speed;
    // set timers
    window.setTimeout(() => (entity.colorTarget = pulseColor), start);
    window.setTimeout(() => (entity.colorTarget = baseColor), reset);
  }
};

// resize canvas
const resize = () => {
  if (!canvas || !ctx) return;
  const scale = window.devicePixelRatio;
  width = canvas.clientWidth;
  height = canvas.clientHeight;
  canvas.width = width * scale;
  canvas.height = height * scale;
  ctx.scale(scale, scale);
};

// clear canvas
const clear = () => {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, width || 0, height || 0);
};

// draw dots and links to canvas
const draw = () => {
  if (!ctx) return;

  // draw links
  for (const { a, b, color } of links) {
    ctx.strokeStyle = color;
    ctx.lineWidth = size / 3;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  // draw dots
  for (const { x, y, color } of dots) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.fill();
  }
};

// move physics simulation one step
const move = () => {
  for (const dot of dots) {
    // giving dots actual velocity makes them wander off and become less uniformly distributed
    // instead, move in circles around center point to give illusion of random movement
    dot.angle += dot.spin;
    dot.x = dot.cx + (sin(dot.angle) * gap) / 4;
    dot.y = dot.cy + (cos(dot.angle) * gap) / 4;
  }

  // move color toward target color smoothly
  const speed = 10;
  for (const entity of [...dots, ...links])
    entity.color = "#" + mix(entity.color, entity.colorTarget, speed).toHex();
};

// generate field of dots and links
const generate = debounce(() => {
  // generate field of dots
  dots = [];
  for (let x = -gap; x <= width + gap; x += gap) {
    for (let y = -gap; y <= height + gap; y += gap) {
      // eliminate some to make more "organic" and less "grid"
      if (Math.random() > 0.5)
        dots.push({
          // set positions
          x,
          y,
          cx: x,
          cy: y,
          // set random starting angle and spin
          angle: Math.random() * 360,
          spin: -1 + Math.random() * 2,
          // set colors
          color: baseColor,
          colorTarget: baseColor,
        });
    }
  }

  // hard limit dots for performance
  while (dots.length > 200)
    dots.splice(Math.floor(dots.length * Math.random()), 1);

  // go through each pair of dots
  links = [];
  for (let a = 0; a < dots.length; a++) {
    for (let b = 0; b < dots.length; b++) {
      // upper triangular
      if (a > b) {
        const { cx: x1, cy: y1 } = dots[a];
        const { cx: x2, cy: y2 } = dots[b];
        // only link if within a certain distance
        if (dist(x1, y1, x2, y2) < gap * 2)
          links.push({
            // set linked dots
            a: dots[a],
            b: dots[b],
            // set colors
            color: baseColor,
            colorTarget: baseColor,
          });
      }
    }
  }

  // eliminate dots with no links
  dots = dots.filter((dot) => links.find(({ a, b }) => dot === a || dot === b));
}, 50);

// fps
window.setInterval(step, 1000 / 30);
// how frequently field pulses
window.setInterval(pulse, 5000);

// fun background visualization element behind header
export default defineComponent({
  mounted() {
    // setup canvas
    canvas = this.$refs.canvas as HTMLCanvasElement;
    ctx = canvas.getContext("2d");

    // listen for resizes to container element
    new ResizeObserver(() => {
      // resize canvas
      resize();
      // regenerate field when container size changes
      generate();
    }).observe(canvas);
  },
});
</script>

<style lang="scss" scoped>
canvas {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;
}
</style>
