Keep recordings less than 10 seconds in length.
Record in 1024 × 768 (4:3 aspect ratio) at 60 fps.

Use the following code snippets in the dev console, then close it before recording:

```javascript
document.body.style.overflow = "overlay"; // to ignore scrollbar and center page perfectly
document.querySelector("main > section:nth-child(2)").scrollIntoView(true); // scroll section of interest to exact top of screen
document.querySelector("header").style.display = "none"; // hide header
document.querySelector("main > section:nth-child(1)").style.display = "none"; // hide any other sections
```

Here is another script to auto-type something quickly into an input on command:

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
