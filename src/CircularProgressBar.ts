interface CircularProgressBarOptions {
  value: number;
  maxValue: number;
  size: number;
  gaugeWidth?: number;
  gaugeColor?: string;
  trailWidth?: number;
  trailColor?: string;
  textColor?: string;
  text?: string;
  textSize?: number;
  textFont?: string;
  duration?: number;
}

export class CircularProgressBar {
  private container: HTMLElement;
  private options: CircularProgressBarOptions;
  private svg!: SVGElement;
  private gauge!: SVGPathElement;
  private trail!: SVGPathElement;
  private text!: SVGTextElement;

  constructor(container: HTMLElement, options: CircularProgressBarOptions) {
    this.container = container;
    this.options = {
      gaugeWidth: 12,
      gaugeColor: "#2196f3",
      trailWidth: 12,
      trailColor: "#e0e0e0",
      textColor: "#333",
      textSize: 24,
      textFont: "Arial",
      duration: 800,
      ...options,
    };

    this.initialize();
    this.render();
  }

  private initialize() {
    // Create SVG element
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg.setAttribute("width", this.options.size.toString());
    this.svg.setAttribute("height", this.options.size.toString());
    this.svg.setAttribute("viewBox", `0 0 ${this.options.size} ${this.options.size}`);
    this.svg.style.transform = "rotate(-90deg)"; // Rotate to start from top

    // Create trail (background circle)
    this.trail = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    this.trail.setAttribute("cx", (this.options.size / 2).toString());
    this.trail.setAttribute("cy", (this.options.size / 2).toString());
    this.trail.setAttribute(
      "r",
      (
        (this.options.size - Math.max(this.options.gaugeWidth!, this.options.trailWidth!)) /
        2
      ).toString()
    );
    this.trail.setAttribute("fill", "none");
    this.trail.setAttribute("stroke", this.options.trailColor!);
    this.trail.setAttribute("stroke-width", this.options.trailWidth!.toString());

    // Create gauge (progress circle)
    this.gauge = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    this.gauge.setAttribute("cx", (this.options.size / 2).toString());
    this.gauge.setAttribute("cy", (this.options.size / 2).toString());
    this.gauge.setAttribute(
      "r",
      (
        (this.options.size - Math.max(this.options.gaugeWidth!, this.options.trailWidth!)) /
        2
      ).toString()
    );
    this.gauge.setAttribute("fill", "none");
    this.gauge.setAttribute("stroke", this.options.gaugeColor!);
    this.gauge.setAttribute("stroke-width", this.options.gaugeWidth!.toString());
    this.gauge.setAttribute("stroke-linecap", "round");
    this.gauge.style.strokeDasharray = "0 1000"; // Initialize with no progress

    // Create text container group
    const textGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    textGroup.setAttribute(
      "transform",
      `translate(${this.options.size / 2}, ${this.options.size / 2}) rotate(90)`
    );

    // Create text element
    this.text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    this.text.setAttribute("fill", this.options.textColor!);
    this.text.setAttribute("font-size", this.options.textSize!.toString());
    this.text.setAttribute("font-family", this.options.textFont!);
    this.text.setAttribute("text-anchor", "middle");
    this.text.setAttribute("dominant-baseline", "middle");
    this.text.setAttribute("x", "0");
    this.text.setAttribute("y", "0");

    // Add text to group
    textGroup.appendChild(this.text);

    // Append elements to SVG
    this.svg.appendChild(this.trail);
    this.svg.appendChild(this.gauge);
    this.svg.appendChild(textGroup);

    // Clear container and append SVG
    this.container.innerHTML = "";
    this.container.appendChild(this.svg);
  }

  private render() {
    const radius =
      (this.options.size - Math.max(this.options.gaugeWidth!, this.options.trailWidth!)) / 2;
    const circumference = 2 * Math.PI * radius;

    // Calculate progress
    const progress = Math.min(Math.max(this.options.value / this.options.maxValue, 0), 1);
    const dashLength = circumference * progress;

    // Update gauge
    this.gauge.style.strokeDasharray = `${dashLength} ${circumference}`;
    this.gauge.style.transition = `stroke-dasharray ${this.options.duration}ms ease-in-out`;

    // Set text content
    const displayText = this.options.text ?? `${Math.round(progress * 100)}%`;
    this.text.textContent = displayText;
  }

  public setValue(value: number) {
    this.options.value = Math.min(Math.max(value, 0), this.options.maxValue);
    this.render();
  }

  public getValue(): number {
    return this.options.value;
  }
}
