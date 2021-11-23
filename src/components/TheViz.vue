<template>
  <canvas ref="canvas"></canvas>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { debounce } from "lodash";
import { sin, cos, dist } from "@/util/math";

const color = "#ffffff"; // color of dots and links
const size = 4; // size of dots and links
const gap = 50; // distance between dots
const limit = 100; // max number of dots
const fps = 30; // steps of physics and draw to do per second

interface Dot {
  // rendered position
  x: number;
  y: number;
  // center/original position
  cx: number;
  cy: number;
  // angle and spin
  a: number;
  da: number;
}

interface Link {
  a: Dot;
  b: Dot;
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
  ctx.clearRect(0, 0, canvas.width || 0, canvas.height || 0);
};

// draw dots and links to canvas
const draw = () => {
  if (!ctx) return;

  // draw links
  for (const { a, b } of links) {
    // closer the dots, the stronger the link
    ctx.globalAlpha = Math.pow(1.01, -dist(a.x, a.y, b.x, b.y));
    ctx.strokeStyle = color;
    ctx.lineWidth = size / 3;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  // draw dots
  for (const { x, y } of dots) {
    ctx.globalAlpha = 1;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.fill();
  }
};

// move physics simulation one step
const move = () => {
  for (const dot of dots) {
    dot.a += dot.da;
    dot.x = dot.cx + (sin(dot.a) * gap) / 4;
    dot.y = dot.cy + (cos(dot.a) * gap) / 4;
  }
};

// generate field of dots and links
const generate = debounce(() => {
  // generate field of dots
  dots = [];
  for (let x = 0; x <= width; x += gap) {
    for (let y = 0; y <= height; y += gap) {
      // eliminate some to make more "organic" and less "grid"
      if (Math.random() > 0.5)
        dots.push({
          x,
          y,
          cx: x,
          cy: y,
          // set random starting angle and spin
          a: Math.random() * 360,
          da: -1 + Math.random() * 2,
        });
    }
  }

  // hard limit dots for performance
  while (dots.length > limit)
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
          links.push({ a: dots[a], b: dots[b] });
      }
    }
  }

  // eliminate dots with no links
  dots = dots.filter((dot) => links.find(({ a, b }) => dot === a || dot === b));
}, 50);

// step physics simulation
window.setInterval(step, 1000 / fps);

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
  opacity: 0.25;
  overflow: hidden;
  z-index: -1;
}
</style>
