# Smart Dashboard: North Pacific Storms 2022

## Map
[https://jdeng137.github.io/smartdashboardillustration](https://jdeng137.github.io/smartdashboardillustration)

## Map Type
This dashboard uses a **proportional symbol map**. Circle size is scaled by atmospheric pressure — lower pressure indicates a more intense storm, so larger circles represent stronger storms. This map type was chosen because pressure is a continuous numeric variable best represented by scaled symbols, allowing viewers to immediately compare storm intensity across locations at a glance.

## Data Source
- North Pacific Storm tracking data (2022), including typhoon and high-force storm system positions, pressure readings, and categories.

## Visualization Components
1. **Proportional symbol map:** circles scaled by atmospheric pressure
2. **Bar chart:** shows count of storm points by category (TY, HF, DHF, S), updates dynamically as you pan the map
3. **Dynamic storm count:** the live number showing how many storm points are in the current map view

## Features
- Click any storm point to see category, pressure, storm ID, and date
- Click a bar in the chart to filter the map by storm category
- Use the reset button to return to the default view