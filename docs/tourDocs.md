# `tourFile` Structure Guide

To create a virtual tour, you will need to provide a JSON file that follows the structure described below.

### Note: All of your images must be equirectangular .jpg files.

## 1. Start Location

The `startLocation` key indicates where the tour will begin. It should correspond to the filename of the initial panoramic image (without the file extension).

Example:
```json
"startLocation": "pano_1"
```

### 2. Panoramas

Each panorama in your tour is represented by a key-value pair in the JSON object. The key is the filename of the panoramic image (without the file extension), and the value is an array of objects representing the arrow buttons that link to other panoramas.

Example:
```json
"pano_1": [
    {
      "position": [30, -10, -8],
      "ref": "pano_2"
    },
    {
      "position": [-10, 0, -25],
      "ref": "pano_4"
    }
]
```

### 3. Arrow Buttons

Each arrow button is represented by an object within the array associated with a panorama key. It defines the position of the arrow button within the 3D scene and the reference to the next panorama.

- `position`: An array representing the x, y, and z coordinates of the arrow button's position.
- `ref`: The filename (without the file extension) of the panorama to which the arrow button leads.

Example:
```json
{
  "position": [30, -10, -8],
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

