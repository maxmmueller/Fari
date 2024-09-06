# Structure Guide for the `sceneData` file

To create a virtual tour, you will need to provide a JSON file that follows the structure described below.

### Note: All of the images have to be equirectangular .jpg files.

## 1. Start Location

The `startLocation` key indicates where the tour will begin. It should correspond to the filename of the initial panorama-node (without the file extension).

Example:

```json
"startLocation": "pano_1"
```

### 2. Panorama-Nodes

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

### 3. Arrow Buttons

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

### 4. Creating Connections

Ensure that each panorama has arrow buttons that lead to other panoramas to create a connected tour experience. Circular references are allowed (e.g., pano_1 can lead to pano_2, and pano_2 can lead back to pano_1).

### Example `tour.json` Structure

```json
{
  "startLocation": "pano_1",

  "pano_1": [
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
    {
      "position": [-10, 2, -25],
      "ref": "pano_1"
    }
  ],

  "pano_3": [
    {
      "position": [-10, 0, -25],
      "ref": "pano_1"
    }
  ],

  "pano_4": [
    {
      "position": [-10, 2, -25],
      "ref": "pano_5"
    }
  ],

  "pano_5": [
    {
      "position": [40, 2, 1],
      "ref": "pano_1"
    }
  ]
}
```

### Notes:

- Ensure all referenced panorama filenames match the keys in the JSON object.
- Verify that the positions provided for arrow buttons are appropriate for your specific panoramic images and 3D scene.
