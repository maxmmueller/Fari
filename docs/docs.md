# Class: VirtualTour

## new VirtualTour(containerElement, sceneData, imageDirectory)

### Parameters:

| Name       | Type   | Description                            |
|------------|--------|----------------------------------------|
| `containerElement`| String | ID of the HTML element that should contain the tour |
| `sceneData` | String | Path of a json file that contains the structure of the tour |
| `imageDirectory`| String | Path of the directory that contains the 360-degree images (optional)|

Source: [VirtualTour.js, line 12](../source/VirtualTour.js#L12)

Learn how to structure the .json tourFile [here](tourDocs.md).


## Methods

### start()

Starts the animation of the virtual tour

Source: [VirtualTour.js, line 243](../source/VirtualTour.js#L243)

---
### stop()

Stops the animation of the virtual tour

Source: [VirtualTour.js, line 249](../source/VirtualTour.js#L249)

---
### setContainer(elementId)

Changes the HTML element containing the virtual tour

#### Parameters:

| Name       | Type   | Description     |
|------------|--------|-----------------|
| `elementId`| String | HTML element ID |

Source: [VirtualTour.js, line 253](../source/VirtualTour.js#L253)