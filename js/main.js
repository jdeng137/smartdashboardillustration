    // assign the access token
    mapboxgl.accessToken =
        'pk.eyJ1IjoiamRlbmcxMzciLCJhIjoiY21oY3BwdGxtMW93bDJsb282bnl6bWl0NSJ9.t19u2LlOUGTPHQ7N82CpkA';

    // declare the map object
    let map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v10',
        zoom: 3,
        minZoom: 2,
        center: [170, 45]
    });

    // declare the coordinated chart as well as other variables.
    let stormChart = null,
        pressure = {},
        numStorms = 0;

    // category labels and colors
    const categoryLabels = {
        'TY': 'Typhoon',
        'HF': 'High Force',
        'DHF': 'Developing High Force',
        'S': 'Storm'
    };

    const categoryColors = {
        'TY': 'rgb(101, 47, 47)',      // dark oxblood - most intense
        'HF': 'rgb(180, 90, 60)',      // burnt sienna
        'DHF': 'rgb(194, 154, 96)',    // warm tan
        'S': 'rgb(140, 160, 140)'      // muted sage green - least intense
    };

    // create the legend
    const legend = document.getElementById('legend');
    let labels = ['<strong>Storm Category</strong>'], vbreak;

    for (const [key, label] of Object.entries(categoryLabels)) {
        labels.push(
            '<p class="break"><i class="dot" style="background:' + categoryColors[key] + '; width:16px; height:16px;"></i>' +
            ' <span class="dot-label">' + label + ' (' + key + ')</span></p>'
        );
    }
    labels.push('<p style="margin-top:8px; font-size:11px; color:#888;"><strong>Circle size = Intensity</strong><br>Larger = Lower Pressure</p>');
    const source = '<p style="text-align: right; font-size:10pt">Source: <a href="https://ocean.weather.gov/climo/download.php">North Pacific Storm Data 2022</p>';
    legend.innerHTML = labels.join('') + source;

    // define the asynchronous function to load geojson data.
    async function geojsonFetch() {

        let response, storms;
        response = await fetch('assets/northpacificstorms.geojson');
        storms = await response.json();

        map.on('load', () => {

            map.addSource('storms', {
                type: 'geojson',
                data: storms
            });

            map.addLayer({
                'id': 'storms-point',
                'type': 'circle',
                'source': 'storms',
                'minzoom': 2,
                'paint': {
                    'circle-radius': [
                        'interpolate', ['linear'], ['get', 'pressure'],
                        937, 22,
                        960, 14,
                        980, 8,
                        1002, 4
                    ],
                    'circle-color': [
                        'match', ['get', 'category'],
                        'TY',  categoryColors['TY'],
                        'HF',  categoryColors['HF'],
                        'DHF', categoryColors['DHF'],
                        'S',   categoryColors['S'],
                        '#ccc'
                    ],
                    'circle-stroke-color': 'white',
                    'circle-stroke-width': 1,
                    'circle-opacity': 0.7
                }
            }, 'waterway-label');

            // popup on click
            map.on('click', 'storms-point', (event) => {
                const props = event.features[0].properties;
                new mapboxgl.Popup()
                    .setLngLat(event.features[0].geometry.coordinates)
                    .setHTML(
                        '<strong>Category:</strong> ' + (categoryLabels[props.category] || props.category) + '<br>' +
                        '<strong>Pressure:</strong> ' + props.pressure + ' hPa<br>' +
                        '<strong>Storm ID:</strong> ' + props.id + '<br>' +
                        '<strong>Date:</strong> ' + props.date
                    )
                    .addTo(map);
            });

            // count storms by category in current view
            let counts = calStorms(storms, map.getBounds());
            numStorms = counts['TY'] + counts['HF'] + counts['DHF'] + counts['S'];
            document.getElementById("storm-count").innerHTML = numStorms;

            let x = Object.keys(counts);
            x.unshift("category");
            let y = Object.values(counts);
            y.unshift("#");

            stormChart = c3.generate({
                size: { height: 350, width: 460 },
                data: {
                    x: 'category',
                    columns: [x, y],
                    type: 'bar',
                    colors: {
                        '#': (d) => {
                            const cats = ['TY', 'HF', 'DHF', 'S'];
                            return categoryColors[cats[d["x"]]] || '#ccc';
                        }
                    },
                    onclick: function (d) {
                        const cats = ['TY', 'HF', 'DHF', 'S'];
                        let selectedCat = cats[d["x"]];
                        map.setFilter('storms-point', ['==', 'category', selectedCat]);
                    }
                },
                axis: {
                    x: { type: 'category' },
                    y: { tick: { values: [5, 10, 15, 20, 25] } }
                },
                legend: { show: false },
                bindto: "#storm-chart"
            });

        });

        map.on('idle', () => {
            // guard: don't run until chart exists
            if (!stormChart) return;

            let counts = calStorms(storms, map.getBounds());
            numStorms = counts['TY'] + counts['HF'] + counts['DHF'] + counts['S'];
            document.getElementById("storm-count").innerHTML = numStorms;

            let x = Object.keys(counts);
            x.unshift("category");
            let y = Object.values(counts);
            y.unshift("#");

            stormChart.load({ columns: [x, y] });
        });
    }

    geojsonFetch();

    function calStorms(currentStorms, currentMapBounds) {
        let categoryCounts = { 'TY': 0, 'HF': 0, 'DHF': 0, 'S': 0 };
        currentStorms.features.forEach(function (d) {
            if (currentMapBounds.contains(d.geometry.coordinates)) {
                let cat = d.properties.category;
                if (categoryCounts[cat] !== undefined) {
                    categoryCounts[cat] += 1;
                }
            }
        });
        return categoryCounts;
    }

    const reset = document.getElementById('reset');
    reset.addEventListener('click', event => {
        map.flyTo({ zoom: 3, center: [170, 45] });
        map.setFilter('storms-point', null);
    });