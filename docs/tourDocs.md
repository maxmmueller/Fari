# Structure Guide for the `sceneData` file

To create a virtual tour, you will need to provide a JSON file that follows the structure described below.

### Note: All of the images have to be equirectangular .jpg files.

## 1. Image directory

The `imageDirectory` key defines the path to the folder that contains all the 360-degree images used in the tour.

Example:

```json
"imageDirectory": "pano_images"
```

Alternatively the image directory can also be passed as a third argument when creating a new virtualTour object.

```JavaScript
const tour = new VirtualTour('tour-div', 'tour_structure.json', 'pano_images');
```

## 2. Start Location

The `startLocation` key indicates where the tour will begin. It should correspond to the filename of the initial panorama-node (without the file extension).

Example:

```json
"startLocation": "pano_1"
```

## 3. Panorama-Nodes

Panorama-nodes represent the unique points in the virtual tour.
Each node consists of an image, a name (which does not have to be unique) as well as unlimited amount of arrows that link between the differnet nodes.

In the JSON object this is represented by a key-value pair. The key is the filename of the panoramic image (without the file extension) and the value is an array. The first item in the array is the name of the panorama-node (which does not have to be unique), followed by objects that represent the arrow buttons linking to other nodes.

Example:

```json
  "pano_1": [      // 1. filename
    "Living room", // 2. name of the node

    // arrow 1
    {
      "position": [15, 0, 0],
      "ref": "pano_2"
    },

    // arrow 2
    {
      "position": [0, 20, 1],
      "ref": "pano_4"
    }
  ],
```

## 4. Arrow Buttons

Each button is defined by a position within the 3D scene and a reference to an other node.

- `position`: An array representing the x, y, and z coordinates of the arrow button's position.
- `ref`: The filename (without the file extension) of the panorama to which the arrow button leads.

Example:

```json
{
  "position": [15, 0, 0],
  "ref": "pano_2"
}
```

## 5. Creating Connections

Ensure that each panorama has arrow buttons that lead to other panoramas to create a connected tour experience. Circular references are allowed (e.g., pano_1 can lead to pano_2, and pano_2 can lead back to pano_1).

### Example `tour.json` Structure

```json
{
  "imageDirectory": "pano_images",
  "startLocation": "pano_1",

  "pano_1": [
    "Living room",
    {
      "position": [30, -10, -8],
      "ref": "pano_2"
    },
    {
      "position": [-10, 0, -25],
      "ref": "pano_4"
    }
  ],

  "pano_2": [
    "Kitchen",
    {
      "position": [-10, 2, -25],
      "ref": "pano_1"
    }
  ],

  "pano_3": [
    "Bathroom",
    {
      "position": [-10, 0, -25],
      "ref": "pano_1"
    }
  ],

  "pano_4": [
    "Bedroom 1",
    {
      "position": [-10, 2, -25],
      "ref": "pano_5"
    }
  ],

  "pano_5": [
    "Bedroom 2",
    {
      "position": [40, 2, 1],
      "ref": "pano_1"
    }
  ]
}
```
