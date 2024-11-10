<div align="center">
<h1>Fari</h1>
<a href="https://www.npmjs.com/package/fari"><img src="https://img.shields.io/npm/dm/fari"/></a>
<a href="LICENSE"><img src="https://img.shields.io/badge/license-Apache%202-blue"/></a>

<p>A lightweight JavaScript library for creating virtual tours</p>

<a href="https://maxmmueller.github.io/faridemo/source/index.html" target="_blank">
  <div style="display: inline-block; padding: 8px 16px; font-size: 16px; font-weight: 500; color: white; background-color: #38b73d; border-radius: 5px;">
    View Demo 🚀
  </div>
</a>
</div>


## Features

With Fari, you can easily integrate [virtual tours](https://en.wikipedia.org/wiki/Virtual_tour) into your own websites or Node.js projects.

## Installation

**Method 1:** You can install Fari from the node package manager:

```
$ npm install fari
```

<br>

**Method 2:** Alternatively you can bundle the code yourself. To do so, simply download the [latest release](https://github.com/maxmmueller/Fari/releases/latest), navigate to the `fari` directory in your terminal and run:

```
$ npm install
$ npm run build
```

This will create the `dist` directory containing the bundled code from which you can import.

## Usage

Read the [documentation](docs/docs.md) to learn how to use this library.

### Code example:

```js
import { VirtualTour } from "fari";

const tour = new VirtualTour("tour-div", "tour_structure.json");
tour.start();
```

## Contributing

Contributions to this project are welcome!

If you encounter any problems, find a bug or have feature requests, please open an [issue](https://github.com/maxmmueller/fari/issues/new).

## Support

If you find this project helpful, consider supporting its development by making a donation:

<a href="https://www.buymeacoffee.com/maxmmueller" target="_blank">
  <img src="https://raw.githubusercontent.com/maxmmueller/WaveWhisper/main/images/bmac.png" alt="Buy Me A Coffee" style="width: 140px;">
</a>
