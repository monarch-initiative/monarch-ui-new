<template>
  <canvas ref="canvas"></canvas>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { debounce } from "lodash";
import { mix } from "tinycolor2";
import {
  sin,
  cos,
  dist,
  Point3d,
  Point2d,
  translate,
  project,
  getMidpoint,
} from "@/util/math";

// settings shared across functions
const size = 4; // size of dots and links
const gap = 50; // distance between dots
const baseColor = "#" + mix("#ffffff", "#00838f", 95).toHex(); // color of elements at rest
const pulseColor = "#" + mix("#ffffff", "#00838f", 50).toHex(); // color of element when pulsing
// (other one-off settings in place below)

// 3d axis rotations
let rx = 0;
let ry = 0;

interface Dot {
  // position in 3d space
  point: Point3d;
  // 3d position projected into 2d for canvas rendering
  projected?: Point2d;
  // target and actual color
  color: string;
  colorTarget: string;
  // angle and spin
  angle: number;
  spin: number;
}

interface Link {
  // dots to link together
  from: Dot;
  to: Dot;
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
    const center =
      "point" in entity
        ? entity.point
        : getMidpoint(entity.from.point, entity.to.point);

    // time delays
    const speed = 2 / 10; // how fast pulse propagates outward
    const start = dist(center.x - width / 2, center.y - height / 2) / speed;
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
  for (const { from, to, color } of links) {
    if (!from.projected || !to.projected) continue;
    ctx.strokeStyle = color;
    ctx.lineWidth = size / 3;
    ctx.beginPath();
    ctx.moveTo(from.projected.x, from.projected.y);
    ctx.lineTo(to.projected.x, to.projected.y);
    ctx.stroke();
  }

  // draw dots
  for (const { projected, color } of dots) {
    if (!projected) continue;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(projected.x, projected.y, size, 0, 2 * Math.PI);
    ctx.fill();
  }
};

// rotate 3d world
const rotate = (event: MouseEvent | TouchEvent) => {
  const x = "clientY" in event ? event.clientY : event.touches[0].clientY;
  const y = "clientX" in event ? event.clientX : event.touches[0].clientX;
  rx = (0.5 - x / window.innerHeight) * 135;
  ry = -(0.5 - y / window.innerWidth) * 90;
};

// move physics simulation one step
const move = () => {
  // for each dot
  for (const dot of dots) {
    // giving dots actual velocity makes them wander off and become less uniformly distributed
    // instead, move in circles around center point to give illusion of random movement
    dot.angle += dot.spin;
    const wander = {
      x: (cos(dot.angle) * gap) / 4,
      y: (sin(dot.angle) * gap) / 4,
      z: 0,
    };

    // project from 3d into 2d using 3d rotation matrix
    dot.projected = project(
      translate(dot.point, wander),
      rx,
      ry,
      width / 2,
      height / 2
    );
  }

  // for each entity (dot or link)
  const speed = 10;
  // move color toward target color smoothly
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
          point: {
            x,
            y,
            z: -gap + Math.random() * 2 * gap,
          },
          // set colors
          color: baseColor,
          colorTarget: baseColor,
          // set random starting angle and spin
          angle: Math.random() * 360,
          spin: -0.5 + Math.random() * 1,
        });
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
      // upper triangular
      if (a > b) {
        const from = dots[a];
        const to = dots[b];
        // only link if within a certain distance
        if (dist(from.point.x, from.point.y, to.point.x, to.point.y) < gap * 2)
          links.push({
            // set linked dots
            from,
            to,
            // set colors
            color: baseColor,
            colorTarget: baseColor,
          });
      }
    }
  }

  // eliminate dots with no links
  dots = dots.filter((dot) =>
    links.find(({ from, to }) => dot === from || dot === to)
  );
}, 50);

// fps
window.setInterval(step, 1000 / 60);
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

    // listen for mouse move
    window.addEventListener("mousemove", rotate);
    window.addEventListener("touchmove", rotate);
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
