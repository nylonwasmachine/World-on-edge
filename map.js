// ============================================================
// WORLD ON EDGE - MAP V11
// ============================================================

console.log("WORLD ON EDGE MAP.JS V11 GELADEN");


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

    const p =
        feature.properties || {};

    return (
        p.name ||
        p.NAME ||
        p.ADMIN ||
        p.admin ||
        p.sovereignt ||
        ""
    );

}


// ============================================================
// KAART
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

    map.setView(
        [50, 25],
        3.5
    );

    console.log("Leaflet geladen.");

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
// GEOJSON
// ============================================================

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


            // ==================================================
            // KAART FOUTMELDING VERBERGEN
            // ==================================================

            hideMapError();


            // ==================================================
            // HELE WERELD
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

                            const name =
                                getCountryName(feature);

                            layer.bindTooltip(
                                name || "Onbekend",
                                {
                                    sticky: true
                                }
                            );

                        }

                }

            ).addTo(map);


            // ==================================================
            // EUROPA
            // ==================================================

            Object.entries(
                europeanRealms
            ).forEach(
                ([realmName, countries]) => {

                    drawRealm(
                        data,
                        realmName,
                        countries
                    );

                }
            );


            console.log(
                "Europese rijken geladen."
            );

        })

        .catch(error => {

            console.error(
                "WERELDKAART FOUT:",
                error
            );

            showMapError(
                "KAART FOUT",
                "De wereldkaart kon niet worden geladen."
            );

        });

}


// ============================================================
// RIJK TEKENEN
// ============================================================

function drawRealm(
    data,
    realmName,
    countries
) {

    const wanted =
        countries.map(
            normalizeName
        );


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
            "Geen GeoJSON voor:",
            realmName
        );

        return;
    }


    // ========================================================
    // FRANKRIJK
    // ========================================================

    if (
        realmName === "Frankrijk"
    ) {

        drawFrance(
            features
        );

        return;
    }


    // ========================================================
    // ANDERE RIJKEN
    // ========================================================

    let realm;


    try {

        if (features.length === 1) {

            realm =
                features[0];

        } else {

            realm =
                turf.union(
                    turf.featureCollection(
                        features
                    )
                );

        }

    } catch (error) {

        console.error(
            "Samenvoegen mislukt:",
            realmName,
            error
        );

        // Fallback:
        // echte landvormen blijven zichtbaar.

        L.geoJSON(
            features,
            {

                style: {

                    fillColor:
                        isSelectedRealm(
                            realmName
                        )
                            ? "#20c45a"
                            : "#686868",

                    fillOpacity: 1,

                    color: "#333333",

                    weight: 1.5

                }

            }

        )
        .bindTooltip(
            realmName
        )
        .addTo(map);

        return;
    }


    if (!realm) {
        return;
    }


    // ========================================================
    // RIJK OP KAART
    // ========================================================

    const layer =
        L.geoJSON(
            realm,
            {

                style: {

                    fillColor:
                        isSelectedRealm(
                            realmName
                        )
                            ? "#20c45a"
                            : "#686868",

                    fillOpacity: 1,

                    color: "#222222",

                    weight: 2,

                    opacity: 1

                }

            }

        )
        .bindTooltip(
            realmName
        )
        .addTo(map);


    // ========================================================
    // LAND KLIKKEN
    // ========================================================

    layer.on(
        "click",
        function() {

            console.log(
                "LAND GESELECTEERD:",
                realmName
            );

            document.getElementById(
                "map-status"
            ).textContent =
                realmName;

        }
    );

}


// ============================================================
// FRANKRIJK MET PROVINCIES
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
            "Frankrijk union fout:",
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
    // FRANKRIJK BASIS
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

                color: "#222222",

                weight: 2

            }

        }

    ).addTo(map);


    // ========================================================
    // PROVINCIEPUNTEN
    // ========================================================

    const points =
        turf.featureCollection(

            franceProvinces.map(
                province => {

                    return turf.point(
                        province.center,
                        {

                            province:
                                province.name,

                            capital:
                                province.capital

                        }
                    );

                }
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
            "Voronoi fout:",
            error
        );

        return;
    }


    if (!voronoi) {
        return;
    }


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
                    "Intersect fout:",
                    province.name,
                    error
                );

                return;
            }


            if (!clipped) {
                return;
            }


            const provinceLayer =
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

                );


            provinceLayer
                .bindTooltip(
                    province.name +
                    (
                        province.capital
                            ? " • Hoofdstad"
                            : ""
                    )
                );


            // ==================================================
            // PROVINCIE KLIKKEN
            // ==================================================

            provinceLayer.on(
                "click",
                function() {

                    console.log(
                        "PROVINCIE GESELECTEERD:",
                        province.name
                    );

                    document.getElementById(
                        "map-status"
                    ).textContent =
                        province.name;

                }
            );


            provinceLayer.addTo(map);

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
// GESELECTEERD RIJK?
// ============================================================

function isSelectedRealm(
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
// FOUTMELDING VERBERGEN
// ============================================================

function hideMapError() {

    const errorBox =
        document.getElementById(
            "map-error"
        );

    if (!errorBox) {
        return;
    }

    errorBox.style.display =
        "none";

}


// ============================================================
// FOUTMELDING TONEN
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
