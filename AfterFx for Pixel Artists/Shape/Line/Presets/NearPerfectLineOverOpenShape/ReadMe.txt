----
Near Perfect Line Over Open Shape
AfterFx Preset
----
Author: GaragePixel
Date: 2023-11-06
----
Plot: Create a near perfect pixel line over a shape's open path
----

Do you know that you can create a line of pixels above a shape's open path?

After some experimentation, such as testing Offset Path Modifier which could have been an easy and lightweight solution to achieve my goals, I considered two solutions, a script (An improved Bresenham based on cut segments) and then a quick solution to implement but giving good results and it is this last solution which is the subject here.

To achieve this, I used one of my proven techniques with Photoshop.
The result is not absolutely perfect, it is less good than in Photoshop but it allows you to keep a very low memory footprint since this solution only uses an expression, not of external script and only five basic Fx. It comes in the form of an animation preset and replaces the succession of steps necessary to achieve the same result in Photoshop.

Here's how the preset works:

1. Since the anti-aliasing pixels are in the form of a pixel of the same reference color but with variations in opacity, it is necessary to recover the visible luminance values and produce a new future opacity stencil with these pixels which for the moment is visible as an RGB channel on which we will be able to operate.
2. We pull the values into their extremes using a contrast in order to keep only white pixels for represent the path.
3. At this moment, the future stencil is black and white, black is used as the key value for opacity.
4. When the path appears, it is at that moment completely white, it must be retained. We could recover directly the color of the path using an expression, but it is possibly interesting to use several colors for the paths at the time of drafting considering that they will all be the same color in the end. To be able to modify this color using an easily accessible parameter, the Tint effect refers to the last contained Fx
in the preset, and this by means of an expression.
5. This last Fx is a color control which allows you to change the color of all the paths contained in the shape layer.

This preset assumes these points:
- The shape layer is in anti-aliasing mode
- There can be as many Shapes in the shape layer
- The paths must all be open.
- The preset will be applied to the filled part if it exists.
- The shape representing the path must have a Stroke whose thickness is set to 0.5


Install the preset:

1. Open your Documents or My Documents folder.
2. Open the Adobe folder.
3. Open the After Effects CC (version number) folder.
4. Open the User Presets folder.
If you don't see a User Presets folder, you can make one or save a preset in After Effects to create one automatically).
5. Copy/Paste NearPerfectLine.ffx onto your presets folder
6. Under AfterFx, Go to Window > Effect&Presets
7. Unroll the panel's option list and click on Refresh List
