// ============================================================
// WORLD ON EDGE - WORLD MAP V10
// Hele wereld zichtbaar
// Europa als eigen rijken
// Frankrijk heeft voorlopig 7 provincies
// ============================================================

console.log("WORLD ON EDGE MAP.JS V10 GELADEN");


// ============================================================
// SPELER
// ============================================================

const playerData =
    sessionStorage.getItem("worldOnEdgePlayer");

const selectedCountry =
    sessionStorage.getItem("worldOnEdgeCountry") || "Onbekend";


if (!playerData) {
    window.location.href = "login.html";
}

const player =
    JSON.parse(playerData);


// ============================================================
// HUD
// ============================================================

document.getElementById("map-country").textContent =
    selectedCountry;

document.getElementById("map-points").textContent = "0";
document.getElementById("map-manpower").textContent = "0";
document.getElementById("map-factories").textContent = "0";


// ============================================================
// EUROPESE RIJKEN
// ============================================================

const europeanRealms = {

    "Frankrijk": [
        "France",
        "Belgium",
        "Netherlands",
        "Luxembourg"
    ],

    "Pools-Zwitserse Unie": [
        "Poland",
        "Switzerland",
        "Belarus",
        "Finland",
        "Estonia",
        "Latvia",
        "Lithuania"
    ],

    "Duitsland": [
        "Germany"
    ],

    "Oostenrijk-Hongarije": [
        "Austria",
        "Hungary",
        "Slovenia",
        "Croatia",
        "Bosnia and Herzegovina",
        "Slovakia",
        "Czech Republic"
    ],

    "Oekraïne": [
        "Ukraine"
    ],

    "Rusland": [
        "Russia"
    ],

    "Zweden": [
        "Sweden"
    ],

    "Groot-Brittannië": [
        "United Kingdom",
        "Ireland"
    ],

    "Servië": [
        "Republic of Serbia",
        "Kosovo",
        "Montenegro",
        "Macedonia"
    ],

    "Groote Türkiye": [
        "Turkey",
        "Greece",
        "Albania",
        "Bulgaria",
        "Georgia",
        "Armenia",
        "Azerbaijan"
    ],

    "Roemenië": [
        "Romania",
        "Moldova"
    ],

    "Iberische Staat": [
        "Spain",
        "Portugal"
    ],

    "Italië": [
        "Italy"
    ]

};


// ============================================================
// FRANKRIJK - 7 PROVINCIES
// ============================================================

const franceProvinces = [

    {
        name: "Parijs",
        capital: true,
        center: [2.3522, 48.8566]
    },

    {
        name: "Amsterdam",
        capital: false,
        center: [4.9041, 52.3676]
    },

    {
        name: "Brussel",
        capital: false,
        center: [4.3517, 50.8503]
    },

    {
        name: "Lyon",
        capital: false,
        center: [4.8357, 45.7640]
    },

    {
        name: "Marseille",
        capital: false,
        center: [5.3698, 43.2965]
    },

    {
        name: "Toulouse",
        capital: false,
        center: [1.4442, 43.6047]
    },

    {
        name: "Nantes",
        capital: false,
        center: [-1.5536, 47.2184]
    }

];


// ============================================================
// NAAM NORMALISEREN
// ============================================================

function normalizeName(name) {

    return String(name || "")
        .toLowerCase()
        .trim()
        .replace(/-/g, " ")
        .replace(/\s+/g, " ");

}


// ============================================================
// GEOJSON LANDNAAM
// ============================================================

function getCountryName(feature) {

    const properties =
        feature.properties || {};

    return (
        properties.name ||
        properties.NAME ||
        properties.ADMIN ||
        properties.admin ||
        properties.sovereignt ||
        ""
    );

}


// ============================================================
// KAART MAKEN
// ============================================================

let map;

try {

    map = L.map("world-map", {

        zoomControl: true,

        attributionControl: false,

        minZoom: 2,

        maxZoom: 8,

        worldCopyJump: false,

        maxBounds: [
            [-90, -180],
            [90, 180]
        ],

        maxBoundsViscosity: 1

    });

    // Europa + Rusland + westelijk Azië
    map.setView(
        [50, 25],
        3.5
    );

    console.log("Leaflet kaart gestart.");

} catch (error) {

    console.error(
        "Leaflet fout:",
        error
    );

    showMapError(
        "KAART FOUT",
        "Leaflet kon niet worden gestart."
    );

}


// ============================================================
// WERELDKAART
// ============================================================

const WORLD_MAP_URL =
    "https://cdn.jsdelivr.net/gh/johan/world.geo.json@master/countries.geo.json";


if (map) {

    fetch(WORLD_MAP_URL)

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Wereldkaart kon niet worden geladen."
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


            // ==================================================
            // 1. HELE WERELD
            // ==================================================

            L.geoJSON(
                data,
                {

                    style: {

                        fillColor: "#686868",

                        fillOpacity: 1,

                        color: "#555555",

                        weight: 1,

                        opacity: 1

                    },

                    onEachFeature:
                        function(feature, layer) {

                            const countryName =
                                getCountryName(feature);

                            layer.bindTooltip(
                                countryName || "Onbekend",
                                {
                                    sticky: true
                                }
                            );

                        }

                }

            ).addTo(map);


            // ==================================================
            // 2. EUROPA
            // ==================================================

            Object.entries(
                europeanRealms
            ).forEach(
                ([realmName, countries]) => {

                    try {

                        drawEuropeanRealm(
                            data,
                            realmName,
                            countries
                        );

                    } catch (error) {

                        console.error(
                            "Fout bij rijk:",
                            realmName,
                            error
                        );

                    }

                }
            );


            console.log(
                "Europese rijken getekend."
            );

        })

        .catch(error => {

            console.error(
                "Wereldkaart fout:",
                error
            );

            showMapError(
                "KAART FOUT",
                "De wereldkaart kon niet worden geladen."
            );

        });

}


// ============================================================
// EUROPEES RIJK TEKENEN
// ============================================================

function drawEuropeanRealm(
    data,
    realmName,
    countries
) {

    const wanted =
        countries.map(normalizeName);


    const features =
        data.features.filter(
            feature => {

                const name =
                    normalizeName(
                        getCountryName(feature)
                    );

                return wanted.includes(name);

            }
        );


    if (features.length === 0) {

        console.warn(
            "Geen landen gevonden voor:",
            realmName
        );

        return;
    }


    // ========================================================
    // FRANKRIJK
    // ========================================================

    if (realmName === "Frankrijk") {

        drawFrance(
            features
        );

        return;
    }


    // ========================================================
    // RIJK SAMENVOEGEN
    // ========================================================

    let realmGeometry;


    try {

        if (features.length === 1) {

            realmGeometry =
                features[0];

        } else {

            realmGeometry =
                turf.union(
                    turf.featureCollection(
                        features
                    )
                );

        }

    } catch (error) {

        console.error(
            "Union mislukt voor:",
            realmName,
            error
        );

        // Als union mislukt:
        // teken de losse landen alsnog.

        L.geoJSON(
            features,
            {

                style: {

                    fillColor:
                        isPlayerRealm(
                            realmName
                        )
                            ? "#20c45a"
                            : "#686868",

                    fillOpacity: 1,

                    color: "#333333",

                    weight: 1.5

                }

            }

        ).bindTooltip(
            realmName
        ).addTo(map);

        return;
    }


    if (!realmGeometry) {
        return;
    }


    // ========================================================
    // RIJK TEKENEN
    // ========================================================

    L.geoJSON(
        realmGeometry,
        {

            style: {

                fillColor:
                    isPlayerRealm(
                        realmName
                    )
                        ? "#20c45a"
                        : "#686868",

                fillOpacity: 1,

                color: "#333333",

                weight: 1.5,

                opacity: 1

            }

        }

    )
    .bindTooltip(
        realmName
    )
    .addTo(map);

}


// ============================================================
// FRANKRIJK
// ============================================================

function drawFrance(
    features
) {

    let franceEmpire;


    try {

        if (features.length === 1) {

            franceEmpire =
                features[0];

        } else {

            franceEmpire =
                turf.union(
                    turf.featureCollection(
                        features
                    )
                );

        }

    } catch (error) {

        console.error(
            "Frankrijk kon niet worden samengevoegd:",
            error
        );

        return;
    }


    if (!franceEmpire) {
        return;
    }


    const selected =
        normalizeName(
            selectedCountry
        ) ===
        normalizeName(
            "Frankrijk"
        );


    // ========================================================
    // PROVINCIEPUNTEN
    // ========================================================

    const points =
        turf.featureCollection(

            franceProvinces.map(
                province =>

                    turf.point(
                        province.center,
                        {
                            province:
                                province.name,

                            capital:
                                province.capital
                        }
                    )

            )

        );


    // ========================================================
    // VORONOI
    // ========================================================

    let voronoi;

    try {

        voronoi =
            turf.voronoi(
                points,
                {
                    bbox:
                        turf.bbox(
                            franceEmpire
                        )
                }
            );

    } catch (error) {

        console.error(
            "Frankrijk Voronoi fout:",
            error
        );

        return;
    }


    if (!voronoi) {
        return;
    }


    // ========================================================
    // BASIS FRANKRIJK
    // ========================================================

    L.geoJSON(
        franceEmpire,
        {

            style: {

                fillColor:
                    selected
                        ? "#20c45a"
                        : "#686868",

                fillOpacity: 1,

                color: "#333333",

                weight: 2

            }

        }

    ).addTo(map);


    // ========================================================
    // PROVINCIES
    // ========================================================

    voronoi.features.forEach(
        (cell, index) => {

            const province =
                franceProvinces[index];

            if (!province) {
                return;
            }


            let clipped;


            try {

                clipped =
                    turf.intersect(
                        turf.featureCollection([
                            cell,
                            franceEmpire
                        ])
                    );

            } catch (error) {

                console.error(
                    "Provincie fout:",
                    province.name,
                    error
                );

                return;
            }


            if (!clipped) {
                return;
            }


            L.geoJSON(
                clipped,
                {

                    style: {

                        fillColor:
                            selected
                                ? "#20c45a"
                                : "#686868",

                        fillOpacity: 1,

                        color: "#555555",

                        weight: 1.5

                    }

                }

            )
            .bindTooltip(
                province.name +
                (
                    province.capital
                        ? " • Hoofdstad"
                        : ""
                )
            )
            .addTo(map);

        }
    );


    // ========================================================
    // STEDEN
    // ========================================================

    franceProvinces.forEach(
        province => {

            L.circleMarker(
                [
                    province.center[1],
                    province.center[0]
                ],
                {

                    radius:
                        province.capital
                            ? 7
                            : 4,

                    fillColor:
                        "#ffffff",

                    fillOpacity: 1,

                    color:
                        "#222222",

                    weight: 2

                }

            )
            .bindTooltip(
                province.name
            )
            .addTo(map);

        }
    );

}


// ============================================================
// CONTROLEREN OF RIJK VAN SPELER IS
// ============================================================

function isPlayerRealm(
    realmName
) {

    return (
        normalizeName(
            selectedCountry
        ) ===
        normalizeName(
            realmName
        )
    );

}


// ============================================================
// FOUTMELDING
// ============================================================

function showMapError(
    title,
    message
) {

    const errorBox =
        document.getElementById(
            "map-error"
        );

    if (!errorBox) {
        return;
    }


    errorBox.style.display =
        "flex";


    errorBox.innerHTML = `
        <strong>${title}</strong>
        <span>${message}</span>
    `;

}
