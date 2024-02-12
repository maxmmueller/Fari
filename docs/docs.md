# Class: VirtualTour

## new VirtualTour(tourFile, elementId, imageDirectory)

### Parameters:

| Name       | Type   | Description                            |
|------------|--------|----------------------------------------|
| `tourFile` | String | Path to a .json file containing the tour data |
| `elementId`| String | ID of an HTML element to contain the virtual tour |
| `imageDirectory`| String | Directory containing the panoramic images |

Learn how to structure the .json tourFile [here](tourDocs.md).

Source: [main.js, line 10](../source/main.js#L10)

## Methods

### setContainer(elementId)

Changes the HTML element containing the virtual tour

#### Parameters:

| Name       | Type   | Description          |
|------------|--------|----------------------|
| `elementId`| String | HTML element ID      |

Source: [main.js, line 168](../source/main.js#L168)

### start()

Starts the animation of the virtual tour

Source: [main.js, line 150](../source/main.js#L150)

### stop()

Stops the animation of the virtual tour

Source: [main.js, line 160](../source/main.js#L160)
