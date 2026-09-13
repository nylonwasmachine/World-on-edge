console.log("WORLD ON EDGE MAP.JS V8 - PROVINCIES GELADEN");

// ==================================================
// WORLD ON EDGE - MAP
// PROVINCIE TEST: FRANKRIJK
// ==================================================

// --------------------------------------------------
// SPELER
// --------------------------------------------------

const playerData =
    sessionStorage.getItem("worldOnEdgePlayer");

const selectedCountry =
    sessionStorage.getItem("worldOnEdgeCountry");

if (!playerData) {
    window.location.href = "login.html";
}

const player = JSON.parse(playerData);


// --------------------------------------------------
// HUD
// --------------------------------------------------

document.getElementById("map-country").textContent =
    selectedCountry || "Onbekend";

document.getElementById("map-points").textContent = "0";
document.getElementById("map-manpower").textContent = "0";
document.getElementById("map-factories").textContent = "0";


// --------------------------------------------------
// TEST-RIJK
// --------------------------------------------------

const franceEmpire = [
    "France",
    "Belgium",
    "Netherlands",
    "Luxembourg"
];


// --------------------------------------------------
// 7 PROVINCIES
// --------------------------------------------------

const franceProvinces = [
    {
        name: "Parijs",
        capital: "Parijs",
        coordinates: [2.3522, 48.8566],
        capitalCity: true
    },

    {
        name: "Amsterdam",
        capital: "Amsterdam",
        coordinates: [4.9041, 52.3676]
    },

    {
        name: "Brussel",
        capital: "Brussel",
        coordinates: [4.3517, 50.8503]
    },

    {
        name: "Lyon",
        capital: "Lyon",
        coordinates: [4.8357, 45.7640]
    },

    {
        name: "Marseille",
        capital: "Marseille",
        coordinates: [5.3698, 43.2965]
    },

    {
        name: "Toulouse",
        capital: "Toulouse",
        coordinates: [1.4442, 43.6047]
    },

    {
        name: "Nantes",
        capital: "Nantes",
        coordinates: [-1.5536, 47.2184]
    }
];


// --------------------------------------------------
// KAART
// --------------------------------------------------

let map;

try {

    map = L.map("world-map", {

        zoomControl: true,

        minZoom: 2,

        maxZoom: 8,

        worldCopyJump: false,

        maxBounds: [
            [-90, -180],
            [90, 180]
        ],

        maxBoundsViscosity: 1.0

    }).setView([50, 3], 4);

    console.log("Leaflet geladen.");

} catch (error) {

    console.error(
        "Leaflet fout:",
        error
    );

    showMapError(
        "KAARTFOUT",
        "Leaflet kon niet worden geladen."
    );
}


// --------------------------------------------------
// GEOJSON
// --------------------------------------------------

const WORLD_MAP_URL =
    "https://cdn.jsdelivr.net/gh/johan/world.geo.json@master/countries.geo.json";


if (map) {

    fetch(WORLD_MAP_URL)

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "GeoJSON kon niet worden geladen."
                );
            }

            return response.json();
        })

        .then(data => {

            console.log(
                "Wereldkaart geladen:",
                data.features.length,
                "landen"
            );


            // ------------------------------------------
            // FRANKRIJK + BELGIË + NEDERLAND + LUXEMBURG
            // ------------------------------------------

            const empireFeatures =
                data.features.filter(feature => {

                    const name =
                        getCountryName(feature);

                    return franceEmpire.includes(name);
                });


            console.log(
                "Gebieden van Frankrijk-rijk:",
                empireFeatures.map(
                    feature => getCountryName(feature)
                )
            );


            if (empireFeatures.length !== 4) {

                throw new Error(
                    "Niet alle 4 gebieden van Frankrijk-rijk zijn gevonden."
                );
            }


            // ------------------------------------------
            // RIJK SAMENVOEGEN
            // ------------------------------------------

            const empireCollection =
                turf.featureCollection(
                    empireFeatures
                );

            const empire =
                turf.union(empireCollection);


            if (!empire) {

                throw new Error(
                    "Het Frankrijk-rijk kon niet worden samengevoegd."
                );
            }


            // ------------------------------------------
            // RIJK ACHTERGROND
            // ------------------------------------------

            L.geoJSON(empire, {

                style: {

                    fillColor: "#20c45a",

                    fillOpacity: 0.9,

                    color: "#333333",

                    weight: 2,

                    opacity: 1
                }

            }).addTo(map);


            // ------------------------------------------
            // PROVINCIEPUNTEN
            // ------------------------------------------

            const provincePoints =
                turf.featureCollection(

                    franceProvinces.map(
                        province => {

                            return turf.point(
                                province.coordinates,
                                {
                                    name:
                                        province.name,

                                    capital:
                                        province.capital,

                                    capitalCity:
                                        province.capitalCity || false
                                }
                            );
                        }
                    )
                );


            // ------------------------------------------
            // VORONOI PROVINCIES
            // ------------------------------------------

            const bbox =
                turf.bbox(empire);

            const voronoi =
                turf.voronoi(
                    provincePoints,
                    {
                        bbox: bbox
                    }
                );


            // ------------------------------------------
            // PROVINCIES CLIPPEN
            // ------------------------------------------

            const provinceFeatures = [];


            voronoi.features.forEach(
                function(cell, index) {

                    if (!cell) {
                        return;
                    }


                    const clipped =
                        turf.intersect(
                            turf.featureCollection([
                                cell,
                                empire
                            ])
                        );


                    if (!clipped) {
                        return;
                    }


                    const province =
                        franceProvinces[index];


                    clipped.properties = {

                        province:
                            province.name,

                        capital:
                            province.capital,

                        capitalCity:
                            province.capitalCity || false
                    };


                    provinceFeatures.push(
                        clipped
                    );
                }
            );


            console.log(
                "Provincies gemaakt:",
                provinceFeatures.length
            );


            // ------------------------------------------
            // PROVINCIES TEKENEN
            // ------------------------------------------

            provinceFeatures.forEach(
                function(provinceFeature) {

                    const isOwnEmpire =
                        normalizeCountryName(
                            selectedCountry
                        ) ===
                        normalizeCountryName(
                            "Frankrijk"
                        );


                    const layer =
                        L.geoJSON(
                            provinceFeature,
                            {

                                style: {

                                    fillColor:
                                        isOwnEmpire
                                            ? "#20c45a"
                                            : "#686868",

                                    fillOpacity:
                                        0.9,

                                    color:
                                        "#555555",

                                    weight:
                                        1.5,

                                    opacity:
                                        1
                                }
                            }
                        ).addTo(map);


                    layer.bindTooltip(
                        provinceFeature.properties.province +
                        " — " +
                        provinceFeature.properties.capital,
                        {
                            sticky: true
                        }
                    );


                    layer.on({

                        mouseover:
                            function(event) {

                                event.target.setStyle({

                                    weight: 2.5,

                                    color: "#aaaaaa",

                                    fillOpacity: 1
                                });

                                event.target.bringToFront();
                            },


                        mouseout:
                            function(event) {

                                event.target.setStyle({

                                    fillColor:
                                        isOwnEmpire
                                            ? "#20c45a"
                                            : "#686868",

                                    fillOpacity:
                                        0.9,

                                    color:
                                        "#555555",

                                    weight:
                                        1.5,

                                    opacity:
                                        1
                                });
                            },


                        click:
                            function() {

                                console.log(
                                    "Provincie aangeklikt:",
                                    provinceFeature.properties.province
                                );

                                console.log(
                                    "Hoofdstad:",
                                    provinceFeature.properties.capital
                                );
                            }

                    });
                }
            );


            // ------------------------------------------
            // HOOFDSTEDEN
            // ------------------------------------------

            franceProvinces.forEach(
                function(province) {

                    const marker =
                        L.circleMarker(
                            [
                                province.coordinates[1],
                                province.coordinates[0]
                            ],
                            {

                                radius:
                                    province.capitalCity
                                        ? 8
                                        : 5,

                                color:
                                    "#222222",

                                weight:
                                    2,

                                fillColor:
                                    "#ffffff",

                                fillOpacity:
                                    1
                            }
                        ).addTo(map);


                    marker.bindTooltip(
                        province.capital +
                        (
                            province.capitalCity
                                ? " ★"
                                : ""
                        ),
                        {
                            direction: "top"
                        }
                    );


                    marker.on(
                        "click",
                        function() {

                            console.log(
                                "Hoofdstad aangeklikt:",
                                province.capital
                            );
                        }
                    );
                }
            );


            // ------------------------------------------
            // KAART INSTELLEN
            // ------------------------------------------

            map.fitBounds(
                L.geoJSON(empire).getBounds(),
                {
                    padding: [30, 30]
                }
            );


            document.getElementById(
                "map-status"
            ).textContent =
                "FRANKRIJK-RIJK • 7 PROVINCIES";


            document.getElementById(
                "map-error"
            ).style.display =
                "none";

        })


        .catch(error => {

            console.error(
                "Wereldkaart fout:",
                error
            );

            showMapError(
                "KAARTFOUT",
                error.message
            );
        });
}


// --------------------------------------------------
// HULPFUNCTIES
// --------------------------------------------------

function normalizeCountryName(name) {

    if (!name) {
        return "";
    }

    return name
        .toString()
        .trim()
        .toLowerCase()
        .replace(/-/g, " ")
        .replace(/\s+/g, " ");
}


function getCountryName(feature) {

    const properties =
        feature.properties || {};

    return (
        properties.name ||
        properties.ADMIN ||
        properties.NAME ||
        properties.admin ||
        properties.sovereignt ||
        ""
    );
}


function showMapError(title, text) {

    const errorBox =
        document.getElementById("map-error");

    errorBox.style.display =
        "flex";

    errorBox.innerHTML = `
        <strong>${title}</strong>
        <span>${text}</span>
    `;
}
