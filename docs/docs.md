# Class: VirtualTour

## new VirtualTour(containerElement, sceneData, imageDirectory)

### Parameters:

| Name       | Type   | Description                            |
|------------|--------|----------------------------------------|
| `containerElement`| String | ID of the HTML element that should contain the tour |
| `sceneData` | String | Path of a json file that contains the structure of the tour |
| `imageDirectory`| String | Path of the directory that contains the 360-degree images |

Source: [VirtualTour.js, line 12](../source/VirtualTour.js#L12)

Learn how to structure the .json tourFile [here](tourDocs.md).


## Methods

### start()

Starts the animation of the virtual tour

Source: [VirtualTour.js, line 221](../source/VirtualTour.js#L221)

---
### stop()

Stops the animation of the virtual tour

Source: [VirtualTour.js, line 227](../source/VirtualTour.js#L227)

---
### setContainer(elementId)

Changes the HTML element containing the virtual tour

#### Parameters:

| Name       | Type   | Description     |
|------------|--------|-----------------|
| `elementId`| String | HTML element ID |

Source: [VirtualTour.js, line 231](../source/VirtualTour.js#L231)