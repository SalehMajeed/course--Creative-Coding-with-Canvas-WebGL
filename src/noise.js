const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");

let userName = "user";

const settings = {
  dimensions: [2048, 2048],
};

const sketch = () => {
  const currentEvent = window.addEventListener("click", (e) => {
    if (e.target.id.trim() === "submit-name") {
      const name = document.getElementById("user-name").value;
      userName = name;
      performAPICall(name);
      const targetCanvas = document.getElementsByTagName("canvas")[0].remove();
      window.removeEventListener("click", currentEvent);
      canvasSketch(sketch, settings);
    }
  });
  const colorCount = random.rangeFloor(1, 6);
  const palette = random.shuffle(random.pick(palettes)).slice(0, colorCount);

  const createGrid = (count) => {
    const points = [];
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);
        const radius = Math.abs(random.noise2D(u, v)) * 0.1;
        points.push({
          color: random.pick(palette),
          radius,
          position: [u, v],
          rotation: random.noise2D(u, v),
        });
      }
    }
    return points;
  };

  const points = createGrid(30).filter(() => random.value() > 0.5);
  const margin = 100;

  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    points.forEach((data) => {
      const { position, radius, color, rotation } = data;

      const [u, v] = position;
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      // context.beginPath();
      // context.arc(x, y, radius * width, 0, Math.PI * 2, false);
      // context.fillStyle = color;
      // context.fill();

      context.save();
      context.fillStyle = color;
      context.font = `${radius * width}px 'Arial'`;
      context.translate(x, y);
      context.rotate(rotation);
      context.fillText(userName, x, y);
      context.restore();
    });
  };
};
canvasSketch(sketch, settings);

function performAPICall(name) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const randomKey = Math.floor(Math.random() * 1000000 + 1);

  var raw = JSON.stringify({
    [randomKey]: name,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(
    `https://getpantry.cloud/apiv1/pantry/f18041d8-6653-45d5-bef8-62b014f9c404/basket/${randomKey}`,
    requestOptions
  );
}
