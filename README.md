<h1 align="center">
Fari
</h1>

<p align="center">
<a href="LICENSE"><img src="https://img.shields.io/badge/license-Apache%202-blue"/></a>
<a href="https://www.npmjs.com/package/fari"><img src="https://img.shields.io/npm/v/fari.svg"/></a>
</p>


<p align="center">A lightweight JavaScript library for creating virtual tours </p>

## Features
With Fari, you can easily integrate [virtual tours](https://en.wikipedia.org/wiki/Virtual_tour) into your own website.

## Installation
You can install Fari from the npm with the following command:
```
npm install fari
```

## Usage 

Read the [documentation](docs/docs.md) to learn how to use this library.

### Code example:

```js
import { VirtualTour } from 'fari';

const tour = new VirtualTour("scenes.json", "tour-div", "pano-images");
tour.start();
```

## Contributing
Contributions to this project are welcome!

If you encounter any problems, find a bug or have feature requests, please open an [issue](https://github.com/maxmmueller/fari/issues/new).
