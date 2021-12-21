<template>
  <canvas ref="canvas"></canvas>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { debounce } from "lodash";
import {
  sin,
  cos,
  dist,
  Point3d,
  Point2d,
  project,
  getMidpoint,
} from "@/util/math";

// settings shared across functions
const size = 4; // size of dots and links
const gap = 50; // distance between dots
// https://pinetools.com/blend-colors
const baseColor: Color = [25, 143, 154]; // color of elements at rest (10% white, 90% theme-dark)
const pulseColor: Color = [127, 193, 199]; // color of element when pulsing (50% white, 50% theme-dark)
// (other one-off settings in place below)

// 3d axis rotations
let rx = 0;
let ry = 0;

// efficient rgb tuple format
type Color = [number, number, number];

interface Dot {
  // position in 3d space
  point: Point3d;
  // 3d position projected into 2d for canvas rendering
  projected?: Point2d;
  // target and actual color
  color: Color;
  colorTarget: Color;
}

interface Link {
  // dots to link together
  from: Dot;
  to: Dot;
  // target and actual color (in efficient rgb tuple format)
  color: Color;
  colorTarget: Color;
}

// globals
let canvas = null as HTMLCanvasElement | null;
let ctx = null as CanvasRenderingContext2D | null;
let width = 0;
let height = 0;
let dots: Array<Dot> = [];
let links: Array<Link> = [];

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

// generate field of dots and links
const generate = debounce(() => {
  // generate field of dots
  dots = [];
  // start from grid so dots relatively uniformly distributed
  for (let x = -gap; x <= width + gap; x += gap) {
    for (let y = -gap; y <= height + gap; y += gap) {
      // eliminate some to make more "organic" and less "grid"
      if (Math.random() > 0.5) {
        const angle = Math.random() * 360;
        dots.push({
          point: {
            // nudge off grid to make more "organic"
            x: x + sin(angle) * (gap / 4),
            y: y + cos(angle) * (gap / 4),
            // random range to create nice thin-ish 3d layer
            z: -gap + Math.random() * 2 * gap,
          },
          color: [...baseColor],
          colorTarget: [...baseColor],
        });
      }
    }
  }

  // hard limit dots for performance
  while (dots.length > 200)
    dots.splice(Math.floor(dots.length * Math.random()), 1);

  // sort dots by z
  dots.sort((a, b) => a.point.z - b.point.z);

  // go through each pair of dots
  links = [];
  for (let a = 0; a < dots.length; a++) {
    for (let b = 0; b < dots.length; b++) {
      // upper triangular matrix to only count each pair once
      if (a > b) {
        const from = dots[a];
        const to = dots[b];
        // only link if dots close enough together
        if (
          dist(from.point.x, from.point.y, to.point.x, to.point.y) <
          gap * 1.5
        )
          links.push({
            from,
            to,
            color: [...baseColor],
            colorTarget: [...baseColor],
          });
      }
    }
  }

  // eliminate dots with no links
  dots = dots.filter((dot) =>
    links.find(({ from, to }) => dot === from || dot === to)
  );
}, 50);

// move physics simulation one step
const move = () => {
  // move 3d world rotation in smooth pattern
  const t = window.performance.now() / 1000;
  rx = sin(t * 10) * 30;
  ry = cos(t * 5) * 40;

  // for each dot
  for (const dot of dots) {
    // project from 3d into 2d using 3d rotation matrix
    dot.projected = project(dot.point, rx, ry, width / 2, height / 2);
  }

  // for each entity (dot or link)
  // move color toward target color smoothly
  for (const entity of [...dots, ...links])
    for (let c = 0; c < 3; c++)
      entity.color[c] += (entity.colorTarget[c] - entity.color[c]) / 20;
};

// clear canvas for redrawing
const clear = () => {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, width || 0, height || 0);
};

// draw dots and links to canvas
const draw = () => {
  if (!ctx) return;

  // draw links
  for (const { from, to, color } of links) {
    if (!from.projected || !to.projected) continue;
    ctx.strokeStyle = "rgb(" + color.join(",") + ")";
    ctx.lineWidth = size / 3;
    ctx.beginPath();
    ctx.moveTo(from.projected.x, from.projected.y);
    ctx.lineTo(to.projected.x, to.projected.y);
    ctx.stroke();
  }

  // draw dots
  for (const { projected, color } of dots) {
    if (!projected) continue;
    ctx.fillStyle = "rgb(" + color.join(",") + ")";
    ctx.beginPath();
    ctx.arc(projected.x, projected.y, size, 0, 2 * Math.PI);
    ctx.fill();
  }
};

// pulse color of field of dots and links from inward to outward
const pulse = () => {
  for (const entity of [...dots, ...links]) {
    // get center position of entity
    const center =
      "point" in entity
        ? entity.point
        : getMidpoint(entity.from.point, entity.to.point);

    // time delays
    const speed = 2 / 10; // how fast pulse propagates outward
    const start = dist(center.x - width / 2, center.y - height / 2) / speed;
    const reset = start + 100 / speed;
    // set timers
    window.setTimeout(() => (entity.colorTarget = [...pulseColor]), start);
    window.setTimeout(() => (entity.colorTarget = [...baseColor]), reset);
  }
};

// one step/tick/frame
const step = () => {
  move();
  clear();
  draw();
};

// fps
window.setInterval(step, 1000 / 60);
// how frequently field pulses
window.setInterval(pulse, 10000);

// fun background visualization element behind header
export default defineComponent({
  mounted() {
    // setup canvas
    canvas = this.$refs.canvas as HTMLCanvasElement;
    ctx = canvas.getContext("2d");

    // listen for resizes to canvas element
    new ResizeObserver(() => {
      // resize canvas
      resize();
      // regenerate field
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
