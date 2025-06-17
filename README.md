# Circular Progress Bar

A lightweight, customizable circular progress bar component for web applications. Built with TypeScript and SVG, this component provides smooth animations and extensive customization options.

## Features

- 🎯 **Lightweight**: Pure TypeScript/JavaScript with no external dependencies
- 🎨 **Highly Customizable**: Colors, sizes, animations, and styling options
- 📱 **Responsive**: Automatic resizing and mobile-friendly design
- ⚡ **Smooth Animations**: Configurable animation duration and easing
- 🎭 **Flexible Styling**: Support for CSS classes and inline styles
- 🔧 **TypeScript Support**: Full type definitions included
- 🌐 **Framework Agnostic**: Works with any JavaScript framework or vanilla JS

## Installation

```bash
npm install circular-progress-bar
```

## Quick Start

### Basic Usage

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Circular Progress Bar Demo</title>
  </head>
  <body>
    <div id="progress-container"></div>

    <script type="module">
      import { CircularProgressBar } from "circular-progress-bar";

      const container = document.getElementById("progress-container");
      const progressBar = new CircularProgressBar(container, {
        value: 75,
        maxValue: 100,
        size: 200,
      });
    </script>
  </body>
</html>
```

### With React

```jsx
import React, { useEffect, useRef } from "react";
import { CircularProgressBar } from "circular-progress-bar";

function ProgressComponent() {
  const containerRef = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && !progressBarRef.current) {
      progressBarRef.current = new CircularProgressBar(containerRef.current, {
        value: 75,
        maxValue: 100,
        size: 200,
        gaugeColor: "#2196f3",
        trailColor: "#e0e0e0",
      });
    }
  }, []);

  return <div ref={containerRef} />;
}
```

## Configuration Options

### Basic Options

| Option       | Type      | Default        | Description            |
| ------------ | --------- | -------------- | ---------------------- |
| `value`      | `number`  | **required**   | Current progress value |
| `maxValue`   | `number`  | **required**   | Maximum value (100%)   |
| `size`       | `number`  | Container size | SVG size in pixels     |
| `responsive` | `boolean` | `false`        | Enable responsive mode |

### Appearance Options

| Option       | Type                 | Default     | Description                |
| ------------ | -------------------- | ----------- | -------------------------- |
| `gaugeWidth` | `number`             | `12`        | Progress bar thickness     |
| `gaugeColor` | `string \| function` | `"#2196f3"` | Progress bar color         |
| `gaugeType`  | `"round" \| "flat"`  | `"round"`   | Progress bar end style     |
| `trailWidth` | `number`             | `12`        | Background trail thickness |
| `trailColor` | `string \| function` | `"#e0e0e0"` | Background trail color     |

### Text Options

| Option      | Type     | Default         | Description            |
| ----------- | -------- | --------------- | ---------------------- |
| `text`      | `string` | Auto percentage | Custom text to display |
| `textColor` | `string` | `"#333"`        | Text color             |
| `textSize`  | `number` | `24`            | Text font size         |
| `textFont`  | `string` | `"Arial"`       | Text font family       |

### Animation Options

| Option     | Type      | Default | Description             |
| ---------- | --------- | ------- | ----------------------- |
| `animate`  | `boolean` | `true`  | Enable animations       |
| `duration` | `number`  | `800`   | Animation duration (ms) |

### Styling Options

| Option                | Type      | Default | Description                    |
| --------------------- | --------- | ------- | ------------------------------ |
| `className`           | `string`  | -       | CSS class for SVG element      |
| `gaugeClassName`      | `string`  | -       | CSS class for progress bar     |
| `trailClassName`      | `string`  | -       | CSS class for background trail |
| `textClassName`       | `string`  | -       | CSS class for text element     |
| `disableInlineStyles` | `boolean` | `false` | Disable inline styles          |

---

### ⚠️ Notes When Using with Tailwind CSS

When using Tailwind CSS, the following options are applied as **inline styles** and will be ignored if you set `disableInlineStyles: true`. In this case, you must specify styles using Tailwind classes (such as `gaugeClassName`, `trailClassName`, `textClassName`, etc.).

| Option                | Can be replaced with Tailwind? | Notes                                                       |
| --------------------- | :----------------------------: | ----------------------------------------------------------- |
| `gaugeColor`          |         ❌ (use class)         | Set color via `gaugeClassName`                              |
| `trailColor`          |         ❌ (use class)         | Set color via `trailClassName`                              |
| `textColor`           |         ❌ (use class)         | Set color via `textClassName`                               |
| `textSize`            |         ❌ (use class)         | Set font size via `textClassName`                           |
| `textFont`            |         ❌ (use class)         | Set font family via `textClassName`                         |
| `gaugeWidth`          |         ❌ (use class)         | Set thickness via `gaugeClassName`                          |
| `trailWidth`          |         ❌ (use class)         | Set thickness via `trailClassName`                          |
| `gaugeType`           |               ⭕               | `gaugeType: "round"` affects stroke-linecap, use custom CSS |
| `disableInlineStyles` |               ⭕               | Must be set to `true` when using Tailwind                   |

> **Note:**
>
> - Dynamic color (`gaugeColor: progress => ...`) uses inline styles and cannot be used with Tailwind.
> - `stroke-linecap` is not directly supported by Tailwind; use a custom CSS class if needed.

#### Example

```js
const progressBar = new CircularProgressBar(container, {
  value: 60,
  maxValue: 100,
  className: "w-32 h-32",
  gaugeClassName: "stroke-blue-500 stroke-[8] stroke-linecap-round",
  trailClassName: "stroke-gray-200 stroke-[8]",
  textClassName: "fill-gray-800 text-lg font-bold",
  disableInlineStyles: true, // Required!
});
```

## Advanced Examples

### Dynamic Color Based on Progress

```javascript
const progressBar = new CircularProgressBar(container, {
  value: 75,
  maxValue: 100,
  gaugeColor: progress => {
    if (progress < 0.3) return "#ff4444"; // Red
    if (progress < 0.7) return "#ffaa00"; // Orange
    return "#44ff44"; // Green
  },
});
```

### Responsive Mode

```javascript
const progressBar = new CircularProgressBar(container, {
  value: 75,
  maxValue: 100,
  responsive: true, // Automatically resizes with container
  size: 200, // Initial size
});
```

### Custom Styling with CSS Classes

```javascript
const progressBar = new CircularProgressBar(container, {
  value: 75,
  maxValue: 100,
  className: "my-progress-svg",
  gaugeClassName: "my-progress-gauge",
  trailClassName: "my-progress-trail",
  textClassName: "my-progress-text",
  disableInlineStyles: true, // Use only CSS classes
});
```

```css
.my-progress-gauge {
  stroke: linear-gradient(90deg, #ff6b6b, #4ecdc4);
  stroke-linecap: round;
}

.my-progress-text {
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}
```

## API Methods

### Instance Methods

| Method                 | Parameters           | Description                         |
| ---------------------- | -------------------- | ----------------------------------- |
| `setValue(value)`      | `number`             | Update progress value               |
| `getValue()`           | -                    | Get current progress value          |
| `setGaugeColor(color)` | `string \| function` | Update progress bar color           |
| `setTrailColor(color)` | `string \| function` | Update background color             |
| `destroy()`            | -                    | Clean up and remove event listeners |

### Element Access

| Method              | Returns          | Description                      |
| ------------------- | ---------------- | -------------------------------- |
| `getSVGElement()`   | `SVGElement`     | Get the main SVG element         |
| `getGaugeElement()` | `SVGPathElement` | Get the progress bar element     |
| `getTrailElement()` | `SVGPathElement` | Get the background trail element |
| `getTextElement()`  | `SVGTextElement` | Get the text element             |

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Development

### Setup

```bash
git clone https://github.com/Eugeeun/circular-progress-bar.git
cd circular-progress-bar
npm install
```

### Build

```bash
npm run build
```

### Development Server

```bash
npm run dev
```

### Release

```bash
# Patch release (0.0.1 -> 0.0.2)
npm run release:patch

# Minor release (0.0.1 -> 0.1.0)
npm run release:minor

# Major release (0.0.1 -> 1.0.0)
npm run release:major
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and version history.
