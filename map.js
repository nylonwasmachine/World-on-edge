// ============================================================
// WORLD ON EDGE - WORLD MAP
// Europa + rest van de wereld zichtbaar
// Frankrijk heeft voorlopig als enige 7 provincies
// ============================================================

const playerData = JSON.parse(
    sessionStorage.getItem("worldOnEdgePlayer") || "null"
);

const selectedCountry =
    sessionStorage.getItem("selectedCountry") || "Frankrijk";


// ============================================================
// HUD
// ============================================================

const countryElement = document.getElementById("map-country");
const pointsElement = document.getElementById("map-points");
const manpowerElement = document.getElementById("map-manpower");
const factoriesElement = document.getElementById("map-factories");

if (playerData) {
    countryElement.textContent =
        playerData.country || selectedCountry;

    pointsElement.textContent =
        playerData.points || 0;

    manpowerElement.textContent =
        playerData.manpower || 0;

    factoriesElement.textContent =
        playerData.factories || 0;
} else {
    countryElement.textContent = selectedCountry;
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
        maxZoom: 7,
        worldCopyJump: false
    });

    // Geen OpenStreetMap tiles!
    // Alleen onze eigen GeoJSON wereldkaart.


} catch (error) {

    showMapError(
        "KAART FOUT",
        "De kaart kon niet worden gestart."
    );

}


// ============================================================
// NAMEN NORMALISEREN
// ============================================================

function normalizeCountryName(name) {

    if (!name) return "";

    return name
        .toLowerCase()
        .trim()
        .replace(/-/g, " ")
        .replace(/\s+/g, " ");

}


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
        "Lithuania",
        "Russia"
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
        "Serbia",
        "Kosovo",
        "Montenegro",
        "North Macedonia"
    ],

    "Groot-Türkiye": [
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
// BELANGRIJK:
// Rusland hoort bij Rusland, niet ook bij de Pools-Zwitserse Unie
// Daarom maken we een speciale lijst voor de unie.
// ============================================================

europeanRealms["Pools-Zwitserse Unie"] = [
    "Poland",
    "Switzerland",
    "Belarus",
    "Finland",
    "Estonia",
    "Latvia",
    "Lithuania"
];


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
// HELPER: LANDNAAM UIT GEOJSON
// ============================================================

function getCountryName(feature) {

    if (!feature || !feature.properties) {
        return "";
    }

    return (
        feature.properties.name ||
        feature.properties.NAME ||
        feature.properties.ADMIN ||
        feature.properties.admin ||
        ""
    );

}


// ============================================================
// HELPER: FEATURES VINDEN
// ============================================================

function getRealmFeatures(data, countries) {

    const wanted = countries.map(normalizeCountryName);

    return data.features.filter(feature => {

        const name = normalizeCountryName(
            getCountryName(feature)
        );

        return wanted.includes(name);

    });

}


// ============================================================
// RIJK SAMENVOEGEN
// ============================================================

function mergeRealm(data, countries) {

    const features = getRealmFeatures(
        data,
        countries
    );

    if (features.length === 0) {
        return null;
    }

    // Eén land
    if (features.length === 1) {
        return features[0];
    }

    // Meerdere landen samenvoegen
    try {

        return turf.union(
            turf.featureCollection(features)
        );

    } catch (error) {

        console.error(
            "Kon rijk niet samenvoegen:",
            countries,
            error
        );

        return null;
    }

}


// ============================================================
// FRANKRIJK PROVINCIES MAKEN
// ============================================================

function drawFranceProvinces(
    map,
    franceEmpire,
    isSelected
) {

    if (!franceEmpire) return;

    const provincePoints =
        turf.featureCollection(
            franceProvinces.map(province =>
                turf.point([
                    province.center[0],
                    province.center[1]
                ], {
                    provinceName: province.name,
                    capital: province.capital
                })
            )
        );

    const bbox =
        turf.bbox(franceEmpire);

    const voronoi =
        turf.voronoi(
            provincePoints,
            {
                bbox: bbox
            }
        );

    if (!voronoi) return;


    // --------------------------------------------------------
    // BASIS VAN FRANKRIJK
    // --------------------------------------------------------

    L.geoJSON(
        franceEmpire,
        {
            style: {
                fillColor: isSelected
                    ? "#20c45a"
                    : "#686868",

                fillOpacity: 1,

                color: "#333333",

                weight: 2
            }
        }
    ).addTo(map);


    // --------------------------------------------------------
    // 7 PROVINCIES
    // --------------------------------------------------------

    voronoi.features.forEach(
        (cell, index) => {

            const province =
                franceProvinces[index];

            if (!province) return;


            let clipped;

            try {

                clipped = turf.intersect(
                    turf.featureCollection([
                        cell,
                        franceEmpire
                    ])
                );

            } catch (error) {

                console.error(
                    "Provincie kon niet worden geknipt:",
                    province.name,
                    error
                );

                return;
            }


            if (!clipped) return;


            L.geoJSON(
                clipped,
                {

                    style: {

                        fillColor: isSelected
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
                (province.capital
                    ? " • Hoofdstad"
                    : ""),
                {
                    sticky: true
                }
            )
            .on(
                "click",
                function () {

                    console.log(
                        "Provincie:",
                        province.name
                    );

                    console.log(
                        "Hoofdstad:",
                        province.capital
                            ? "Ja"
                            : "Nee"
                    );

                }
            )
            .addTo(map);

        }
    );


    // --------------------------------------------------------
    // STEDEN / HOOFDSTEDEN
    // --------------------------------------------------------

    franceProvinces.forEach(
        province => {

            const marker =
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
                            province.capital
                                ? "#ffffff"
                                : "#dddddd",

                        fillOpacity: 1,

                        color: "#222222",

                        weight: 2
                    }
                );

            marker
                .bindTooltip(
                    province.name
                )
                .addTo(map);

        }
    );

}


// ============================================================
// ANDERE RIJKEN
// ============================================================

function drawRealm(
    map,
    data,
    realmName,
    countries,
    isSelected
) {

    // Frankrijk wordt apart met provincies getekend
    if (realmName === "Frankrijk") {
        return;
    }


    const realm =
        mergeRealm(
            data,
            countries
        );

    if (!realm) {

        console.warn(
            "Geen GeoJSON-landen gevonden voor:",
            realmName
        );

        return;
    }


    L.geoJSON(
        realm,
        {

            style: {

                fillColor:
                    isSelected
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
// KAART LADEN
// ============================================================

fetch(
    "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json"
)

.then(response => {

    if (!response.ok) {
        throw new Error(
            "GeoJSON kon niet worden geladen."
        );
    }

    return response.json();

})

.then(data => {


    // ========================================================
    // 1. HELE WERELD ALS BASIS
    // ========================================================

    L.geoJSON(
        data,
        {

            style: {

                fillColor: "#686868",

                fillOpacity: 1,

                color: "#555555",

                weight: 1,

                opacity: 1
            }

        }
    ).addTo(map);


    // ========================================================
    // 2. EUROPESE RIJKEN
    // ========================================================

    Object.entries(
        europeanRealms
    ).forEach(
        ([realmName, countries]) => {

            const isSelected =
                normalizeCountryName(
                    selectedCountry
                ) ===
                normalizeCountryName(
                    realmName
                );

            drawRealm(
                map,
                data,
                realmName,
                countries,
                isSelected
            );

        }
    );


    // ========================================================
    // 3. FRANKRIJK MET 7 PROVINCIES
    // ========================================================

    const franceEmpire =
        mergeRealm(
            data,
            europeanRealms["Frankrijk"]
        );

    const franceSelected =
        normalizeCountryName(
            selectedCountry
        ) ===
        normalizeCountryName(
            "Frankrijk"
        );


    drawFranceProvinces(
        map,
        franceEmpire,
        franceSelected
    );


    // ========================================================
    // 4. KAART POSITIE
    // ========================================================

    // Europa + westelijk Azië + een groot deel van Rusland
    map.setView(
        [50, 25],
        3.5
    );


    // ========================================================
    // STATUS
    // ========================================================

    const status =
        document.getElementById(
            "map-status"
        );

    if (status) {
        status.textContent =
            "WERELDKAART";
    }

})

.catch(error => {

    console.error(error);

    showMapError(
        "KAART FOUT",
        "De wereldkaart kon niet worden geladen."
    );

});


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

    if (!errorBox) return;

    errorBox.style.display =
        "flex";

    errorBox.innerHTML = `
        <strong>${title}</strong>
        <span>${message}</span>
    `;

}
