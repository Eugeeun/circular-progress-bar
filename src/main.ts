import { CircularProgressBar } from "./CircularProgressBar";

const container = document.getElementById("container")!;

const progressBar = new CircularProgressBar(container, {
  value: 0,
  maxValue: 100,
  size: 300,
  text: "",
  gaugeWidth: 24,
});

console.log(progressBar);

setInterval(() => {
  progressBar.setValue(progressBar.getValue() + 10);
}, 1000);
