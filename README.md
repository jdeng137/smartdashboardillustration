# Smart Dashboard: North Pacific Storms 2022

## AI Disclosure
I used AI as a debugging assistant during the development of this project. Specifically, AI helped me troubleshoot why the C3.js bar chart was not rendering on the dashboard (the issue turned out to be missing js files), and suggested several CSS styling changes for the sidebar and legend design. All code decisions like the choice of dataset, map type, color palette, and visualization approach, was made and reviewed by me, and I am able to explain the relevant implementation details.

## Map
[https://jdeng137.github.io/smartdashboardillustration](https://jdeng137.github.io/smartdashboardillustration)

## Map Type
This dashboard uses a **proportional symbol map**. Circle size is scaled by atmospheric pressure — lower pressure indicates a more intense storm, so larger circles represent stronger storms. This map type was chosen because pressure is a continuous numeric variable best represented by scaled symbols, allowing viewers to immediately compare storm intensity across locations at a glance.

## Data Source
- [North Pacific Storm tracking data (2022)](https://ocean.weather.gov/climo/download.php), including typhoon and high-force storm system positions, pressure readings, and categories.

## Visualization Components
1. **Proportional symbol map:** circles scaled by atmospheric pressure
2. **Bar chart:** shows count of storm points by category (TY, HF, DHF, S), updates dynamically as you pan the map
3. **Dynamic storm count:** the live number showing how many storm points are in the current map view

## Features
- Click any storm point to see category, pressure, storm ID, and date
- Click a bar in the chart to filter the map by storm category
- Use the reset button to return to the default view