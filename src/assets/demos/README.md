Keep recordings less than 10 seconds in length.
Record in 1024 × 768 (4:3 aspect ratio) at 60 fps.

A code snippet to prepare the page for recording:

```javascript
document.body.style.overflow = "overlay"; // ignore scrollbar and center page perfectly
document.querySelector("header, main > section:nth-child(1)").style.display =
  "none"; // hide sections as necessary
```

A code snippet to auto-type something quickly into an input on command:

```javascript
window.addEventListener("keydown", (event) => {
  if (event.key === "d" && event.ctrlKey) {
    const input = document.querySelector("input");
    "renal fanconi syndrome".split("").forEach((char, index) => {
      setTimeout(() => {
        input.value += char;
        input.dispatchEvent(new Event("input"));
      }, index * 20);
    });
  }
});
```
