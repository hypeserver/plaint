export default class UI {
  constructor(options) {
    this.engine = options.engine;
  }

  render() {
    const timeDisplay = document.createElement("div");
    timeDisplay.innerHTML = "count: " + this.engine.get("$time");
    this.engine.on(
      "@change_$time",
      value => (timeDisplay.innerHTML = "time: " + value)
    );

    const decreasingCounter = document.createElement("div");
    decreasingCounter.innerHTML =
      "auto decreasing value: " + this.engine.get("$decreasing_value");
    this.engine.on(
      "@change_$decreasing_value",
      value => (decreasingCounter.innerHTML = "auto decreasing value: " + value)
    );

    const counterDisplay = document.createElement("div");
    counterDisplay.innerHTML = "count: " + this.engine.get("$counter");
    this.engine.on(
      "@change_$counter",
      value => (counterDisplay.innerHTML = "count: " + value)
    );

    const counterButton = document.createElement("button");
    counterButton.innerText = "+";
    counterButton.onclick = () => this.engine.runCommand(":click");

    document.body.appendChild(timeDisplay);
    document.body.appendChild(decreasingCounter);
    document.body.appendChild(counterDisplay);
    document.body.appendChild(counterButton);

    this.engine.start();
  }
}
