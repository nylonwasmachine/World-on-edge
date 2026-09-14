console.log("WORLD ON EDGE MAP V13 GELADEN");

// ======================================================
// SPELER
// ======================================================

const playerData =
    JSON.parse(
        sessionStorage.getItem("worldOnEdgePlayer") || "{}"
    );

const selectedCountry =
    sessionStorage.getItem("worldOnEdgeCountry") || "Onbekend";


// ======================================================
// HUD
// ======================================================

const countryElement =
    document.getElementById("map-country");

const pointsElement =
    document.getElementById("map-points");

const manpowerElement =
    document.getElementById("map-manpower");

const factoriesElement =
    document.getElementById("map-factories");

const statusElement =
    document.getElementById("map-status");

const errorElement =
    document.getElementById("map-error");

if (countryElement) {
    countryElement.textContent =
        selectedCountry;
}

if (pointsElement) {
    pointsElement.textContent = "0";
}

if (manpowerElement) {
    manpowerElement.textContent = "0";
}

if (factoriesElement) {
    factoriesElement.textContent = "0";
}


// ======================================================
// MODUS
// ======================================================

let currentMode = "land";

const landModeButton =
    document.getElementById("land-mode");

const provinceModeButton =
    document.getElementById("province-mode");

const provinceMessage =
    document.getElementById("province-message");


// Alle provincielagen worden hierin opgeslagen
const provinceGroups = [];


// ======================================================
// MODUS INSTELLEN
// ======================================================

function setMode(mode) {

    currentMode = mode;

    if (landModeButton) {
        landModeButton.classList.toggle(
            "active",
            mode === "land"
        );
    }

    if (provinceModeButton) {
        provinceModeButton.classList.toggle(
            "active",
            mode === "province"
        );
    }

    if (provinceMessage) {
        provinceMessage.classList.add(
            "hidden"
        );
    }

    // Eerst alle provincies verwijderen
    provinceGroups.forEach(group => {

        if (map.hasLayer(group.layer)) {
            map.removeLayer(group.layer);
        }

    });


    // ==============================================
    // LAND MODUS
    // ==============================================

    if (mode === "land") {

        updateStatus("WERELDKAART");

        console.log(
            "Modus: LAND"
        );

        return;
    }


    // ==============================================
    // PROVINCIE MODUS
    // ==============================================

    const realm =
        realms.find(
            r => r.name === selectedCountry
        );

    if (!realm || !realm.provinces) {

        showProvinceMessage();

        updateStatus(
            "GEEN PROVINCIES"
        );

        console.log(
            "Geen provincies voor:",
            selectedCountry
        );

        return;
    }


    const matchingGroup =
        provinceGroups.find(
            group =>
                group.realm.name ===
                selectedCountry
        );

    if (matchingGroup) {

        matchingGroup.layer.addTo(map);

        updateStatus(
            "PROVINCIES • " +
            selectedCountry
        );
    }
}


// ======================================================
// KNOPPEN
// ======================================================

if (landModeButton) {

    landModeButton.addEventListener(
        "click",
        () => {

            setMode("land");

        }
    );
}


if (provinceModeButton) {

    provinceModeButton.addEventListener(
        "click",
        () => {

            setMode("province");

        }
    );
}


// ======================================================
// MELDING
// ======================================================

function showProvinceMessage() {

    if (!provinceMessage) {
        return;
    }

    provinceMessage.textContent =
        "PROVINCIES KUNNEN NIET GELADEN WORDEN VOOR NU";

    provinceMessage.classList.remove(
        "hidden"
    );

    clearTimeout(
        window.provinceMessageTimer
    );

    window.provinceMessageTimer =
        setTimeout(() => {

            provinceMessage.classList.add(
                "hidden"
            );

        }, 3000);
}


// ======================================================
// STATUS
// ======================================================

function updateStatus(text) {

    if (statusElement) {
        statusElement.textContent =
            text;
    }
}


// ======================================================
// LANDEN
// ======================================================

const realms = [

    // EUROPA

    {
        name: "Frankrijk",

        countries: [
            "France",
            "Belgium",
            "Netherlands",
            "Luxembourg"
        ],

        provinces: [
            ["Amsterdam", 4.9041, 52.3676],
            ["Brussel", 4.3517, 50.8503],
            ["Lyon", 4.8357, 45.7640],
            ["Marseille", 5.3698, 43.2965],
            ["Toulouse", 1.4442, 43.6047],
            ["Nantes", -1.5536, 47.2184],
            ["Parijs", 2.3522, 48.8566, true]
        ]
    },

    {
        name: "Pools-Zwitserse Unie",

        countries: [
            "Poland",
            "Switzerland",
            "Belarus",
            "Finland",
            "Estonia",
            "Latvia",
            "Lithuania"
        ],

        provinces: [
            ["Bern", 7.4474, 46.9480],
            ["Warschau", 21.0122, 52.2297, true],
            ["Helsinki", 24.9384, 60.1699],
            ["Riga", 24.1052, 56.9496],
            ["Minsk", 27.5615, 53.9045],
            ["Tallinn", 24.7536, 59.4370],
            ["Vilnius", 25.2797, 54.6872]
        ]
    },

    {
        name: "Duitsland",

        countries: [
            "Germany"
        ],

        provinces: [
            ["Berlijn", 13.4050, 52.5200, true],
            ["Hamburg", 9.9937, 53.5511],
            ["Munich", 11.5820, 48.1351],
            ["Leipzig", 12.3731, 51.3397],
            ["Stuttgart", 9.1829, 48.7758],
            ["Frankfurt", 8.6821, 50.1109],
            ["Dusseldorf", 6.9603, 51.2277]
        ]
    },

    {
        name: "Oostenrijk-Hongarije",

        countries: [
            "Austria",
            "Hungary",
            "Slovenia",
            "Croatia",
            "Bosnia and Herzegovina",
            "Slovakia",
            "Czech Republic"
        ],

        provinces: [
            ["Wenen", 16.3738, 48.2082, true],
            ["Ljubljana", 14.5058, 46.0569],
            ["Praag", 14.4378, 50.0755],
            ["Boedapest", 19.0402, 47.4979],
            ["Sarajevo", 18.4131, 43.8563],
            ["Bratislava", 17.1077, 48.1486],
            ["Salzburg", 13.0550, 47.8095]
        ]
    },

    {
        name: "Oekraïne",

        countries: [
            "Ukraine"
        ],

        provinces: [
            ["Kiev", 30.5234, 50.4501, true],
            ["Lviv", 24.0297, 49.8397],
            ["Chernobil", 30.0995, 51.2763],
            ["Donetsk", 37.8029, 48.0159],
            ["Odessa", 30.7233, 46.4825],
            ["Kryvyi", 33.3918, 47.9105],
            ["Poltava", 34.5514, 49.5883]
        ]
    },

    {
        name: "Rusland",

        countries: [
            "Russia"
        ],

        provinces: [
            ["Moscow", 37.6173, 55.7558, true],
            ["Kaliningrad", 20.4522, 54.7104],
            ["St.petersburg", 30.3351, 59.9343],
            ["Novosibirsk", 82.9346, 55.0084],
            ["Yakutsk", 129.7331, 62.0355],
            ["Anadyr", 177.5103, 64.7337],
            ["Salekhard", 66.6019, 66.5299]
        ]
    },

    {
        name: "Zweden",

        countries: [
            "Sweden"
        ],

        provinces: [
            ["Stokholm", 18.0686, 59.3293, true],
            ["Lulea", 22.1547, 65.5848],
            ["Ostersund", 14.6357, 63.1792],
            ["Karlstad", 13.5036, 59.3793],
            ["Goteborg", 11.9746, 57.7089],
            ["Falun", 15.6250, 60.6065],
            ["Malmo", 13.0038, 55.6050]
        ]
    },

    {
        name: "Groot-Brittannië",

        countries: [
            "United Kingdom",
            "Ireland"
        ],

        provinces: [
            ["London", -0.1276, 51.5074, true],
            ["Liverpool", -2.9916, 53.4084],
            ["Edinburgh", -3.1883, 55.9533],
            ["Dublin", -6.2603, 53.3498],
            ["Cork", -8.4863, 51.8985],
            ["Swansea", -3.9436, 51.6214],
            ["Belfast", -5.9301, 54.5973]
        ]
    },

    {
        name: "Servië",

        countries: [
            "Serbia",
            "Republic of Serbia",
            "Kosovo",
            "Montenegro",
            "Macedonia"
        ],

        provinces: [
            ["Belgrado", 20.4489, 44.7866, true],
            ["Podgorica", 19.2621, 42.4304],
            ["Skopje", 21.4280, 42.0000],
            ["Pristina", 21.1662, 42.6629],
            ["Kraljevo", 20.6868, 43.7238],
            ["Nis", 21.8958, 43.3209],
            ["Novi sad", 19.8335, 45.2671]
        ]
    },

    {
        name: "Groote Türkiye",

        countries: [
            "Turkey",
            "Greece",
            "Albania",
            "Bulgaria",
            "Georgia",
            "Armenia",
            "Azerbaijan"
        ],

        provinces: [
            ["Istanbul", 28.9784, 41.0082, true],
            ["Ankara", 32.8597, 39.9334],
            ["Athene", 23.7275, 37.9838],
            ["Sophia", 23.3219, 42.6977],
            ["Bakoe", 49.8671, 40.4093],
            ["Trabzon", 39.7168, 41.0027],
            ["Antalya", 30.7133, 36.8969]
        ]
    },

    {
        name: "Roemenië",

        countries: [
            "Romania",
            "Moldova"
        ],

        provinces: [
            ["Boekarest", 26.1025, 44.4268, true],
            ["Chisinau", 28.8638, 47.0105],
            ["Oradea", 21.9189, 47.0465],
            ["Arad", 21.3123, 46.1866],
            ["Cluj-napoca", 23.6236, 46.7712],
            ["Bacau", 26.9146, 46.5670],
            ["Craiova", 23.7949, 44.3302]
        ]
    },

    {
        name: "Iberische Staat",

        countries: [
            "Spain",
            "Portugal"
        ],

        provinces: [
            ["Madrid", -3.7038, 40.4168, true],
            ["Barcelona", 2.1734, 41.3851],
            ["Lisbon", -9.1393, 38.7223],
            ["Porto", -8.6291, 41.1579],
            ["A coruna", -8.4115, 43.3623],
            ["Leon", -5.5671, 42.5987],
            ["Jaen", -3.7903, 37.7796]
        ]
    },

    {
        name: "Italië",

        countries: [
            "Italy"
        ],

        provinces: [
            ["Rome", 12.4964, 41.9028, true],
            ["Napels", 14.2681, 40.8518],
            ["milaan", 9.1900, 45.4642],
            ["Cagliari", 9.1217, 39.2238],
            ["Palermo", 13.3615, 38.1157],
            ["Venetië", 12.3155, 45.4408],
            ["Florence", 11.2558, 43.7696]
        ]
    },


    // AZIË

    {
        name: "Indië",
        countries: [
            "India",
            "Pakistan",
            "Bangladesh",
            "Sri Lanka",
            "Nepal",
            "Bhutan"
        ]
    },

    {
        name: "China",
        countries: [
            "China",
            "Mongolia",
            "Taiwan"
        ]
    },

    {
        name: "De Stannen",
        countries: [
            "Kazakhstan",
            "Kyrgyzstan",
            "Turkmenistan",
            "Uzbekistan"
        ]
    },

    {
        name: "Indonesisch Rijk",
        countries: [
            "Indonesia",
            "Malaysia",
            "Brunei",
            "Singapore",
            "Papua New Guinea",
            "Philippines"
        ]
    },

    {
        name: "Japans-Koreaanse Unie",
        countries: [
            "Japan",
            "North Korea",
            "South Korea",
            "Denmark"
        ]
    },

    {
        name: "Zuidwest-Azië",
        countries: [
            "Thailand",
            "Vietnam",
            "Myanmar",
            "Cambodia",
            "Laos"
        ]
    },

    {
        name: "Tajik-Noordse Samenwerking",
        countries: [
            "Tajikistan",
            "Norway",
            "Iceland"
        ]
    },

    {
        name: "Oostelijk Midden-Oosten",
        countries: [
            "Saudi Arabia",
            "Iran",
            "Iraq",
            "Yemen",
            "Oman",
            "Qatar",
            "United Arab Emirates"
        ]
    },

    {
        name: "Westelijk Midden-Oosten",
        countries: [
            "Palestine",
            "Syria",
            "Jordan",
            "Lebanon"
        ]
    },


    // AFRIKA

    {
        name: "Marokkaanse Rijk",
        countries: [
            "Morocco",
            "Algeria",
            "Mali",
            "Mauritania",
            "Tunisia",
            "Western Sahara"
        ]
    },

    {
        name: "Congo",
        countries: [
            "Republic of the Congo",
            "Democratic Republic of the Congo",
            "Gabon",
            "Equatorial Guinea",
            "Burundi",
            "Rwanda"
        ]
    },

    {
        name: "Zuid-Afrikaanse Republiek",
        countries: [
            "South Africa",
            "Lesotho",
            "Angola",
            "Namibia",
            "Botswana",
            "Zambia",
            "Zimbabwe",
            "Mozambique",
            "Eswatini",
            "Malawi"
        ]
    },

    {
        name: "Madagascar Rijk",
        countries: [
            "Madagascar"
        ]
    },

    {
        name: "Midden-Afrikaanse Unie",
        countries: [
            "Central African Republic",
            "Niger",
            "Nigeria",
            "Sudan",
            "South Sudan",
            "Libya",
            "Chad",
            "Cameroon"
        ]
    },

    {
        name: "Oostelijk Afrika",
        countries: [
            "Somalia",
            "Kenya",
            "Ethiopia",
            "Djibouti",
            "Eritrea",
            "Uganda"
        ]
    },

    {
        name: "Egypte",
        countries: [
            "Egypt"
        ]
    },

    {
        name: "Zuidwestelijk Afrika",
        countries: [
            "Senegal",
            "Guinea",
            "Ivory Coast",
            "Burkina Faso",
            "Benin",
            "Togo",
            "Ghana",
            "Liberia",
            "Sierra Leone",
            "Gambia",
            "Guinea-Bissau"
        ]
    },


    // NOORD-AMERIKA

    {
        name: "Amerika",
        countries: [
            "United States of America"
        ]
    },

    {
        name: "Canada",
        countries: [
            "Canada"
        ]
    },

    {
        name: "Mexico",
        countries: [
            "Mexico"
        ]
    },

    {
        name: "Caribisch Gebied",
        countries: [
            "Puerto Rico",
            "Bahamas",
            "Barbados",
            "Grenada",
            "Dominica",
            "Saint Lucia",
            "Antigua and Barbuda",
            "Haiti",
            "Dominican Republic",
            "Trinidad and Tobago"
        ]
    },

    {
        name: "Jamaicubaanse Samenwerking",
        countries: [
            "Jamaica",
            "Cuba"
        ]
    },

    {
        name: "Midden-Amerikaanse Unie",
        countries: [
            "Guatemala",
            "Belize",
            "El Salvador",
            "Honduras",
            "Nicaragua",
            "Costa Rica",
            "Panama"
        ]
    },


    // ZUID-AMERIKA

    {
        name: "Brazilië",
        countries: [
            "Brazil",
            "Paraguay",
            "Uruguay"
        ]
    },

    {
        name: "Argentinië",
        countries: [
            "Argentina"
        ]
    },

    {
        name: "Chili",
        countries: [
            "Chile"
        ]
    },

    {
        name: "Noordelijk-Zuid-Amerika",
        countries: [
            "Suriname",
            "Guyana",
            "Venezuela"
        ]
    },

    {
        name: "West-Zuid-Amerika",
        countries: [
            "Colombia",
            "Peru",
            "Ecuador"
        ]
    },


    // OCEANIË

    {
        name: "Australië",
        countries: [
            "Australia",
            "New Zealand"
        ]
    }
];


// ======================================================
// GEOJSON LANDNAAM
// ======================================================

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


// ======================================================
// KAART
// ======================================================

const map =
    L.map("world-map", {
        zoomControl: true,
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
    [20, 0],
    2
);


// ======================================================
// GEOJSON LADEN
// ======================================================

const WORLD_MAP_URL =
    "https://cdn.jsdelivr.net/gh/johan/world.geo.json@master/countries.geo.json";


fetch(WORLD_MAP_URL)

.then(response => {

    if (!response.ok) {
        throw new Error(
            "GeoJSON kon niet worden geladen."
        );
    }

    return response.json();

})

.then(world => {

    console.log(
        "Wereldkaart geladen."
    );


    // ==================================================
    // WERELD ACHTERGROND
    // ==================================================
    //
    // GEEN GRENZEN!
    //
    // Alleen de landmassa wordt getekend.
    // ==================================================

    L.geoJSON(
        world,
        {
            style: {
                fillColor: "#697983",
                fillOpacity: 0.65,

                color: "transparent",
                weight: 0,

                interactive: false
            }
        }
    ).addTo(map);


    // ==================================================
    // RIJKEN
    // ==================================================

    realms.forEach(realm => {

        const matching =
            world.features.filter(
                feature => {

                    const name =
                        getCountryName(feature);

                    return realm.countries.includes(
                        name
                    );

                }
            );


        if (!matching.length) {

            console.warn(
                "Geen kaartgebied gevonden:",
                realm.name
            );

            return;
        }


        // ==============================================
        // RIJK SAMENVOEGEN
        // ==============================================

        let merged =
            matching[0];


        for (
            let i = 1;
            i < matching.length;
            i++
        ) {

            try {

                merged =
                    turf.union(
                        turf.featureCollection([
                            merged,
                            matching[i]
                        ])
                    );

            } catch (error) {

                console.warn(
                    "Union fout:",
                    realm.name,
                    error
                );

            }

        }


        if (!merged) {
            return;
        }


        // ==============================================
        // RIJK LAAG
        // ==============================================

        const realmLayer =
            L.geoJSON(
                merged,
                {
                    style: {
                        fillColor: "#4caf50",
                        fillOpacity: 0.35,

                        color: "#17232c",
                        weight: 1.8,

                        opacity: 1
                    }
                }
            );


        realmLayer.bindTooltip(
            realm.name,
            {
                sticky: true
            }
        );


        // ==============================================
        // LAND KLIKKEN
        // ==============================================

        realmLayer.on(
            "click",
            event => {

                L.DomEvent.stopPropagation(
                    event
                );


                if (
                    currentMode !==
                    "land"
                ) {
                    return;
                }


                console.log(
                    "LAND GESELECTEERD:",
                    realm.name
                );


                updateStatus(
                    "LAND • " +
                    realm.name
                );


                if (countryElement) {

                    countryElement.textContent =
                        realm.name;

                }


                // geselecteerd uiterlijk
                realmLayer.setStyle({

                    fillOpacity:
                        0.7,

                    weight:
                        3

                });

            }
        );


        realmLayer.addTo(map);


        // ==============================================
        // PROVINCIES MAKEN
        // ==============================================

        if (
            realm.provinces
        ) {

            const provinceGroup =
                L.layerGroup();

            createProvinces(
                realm,
                merged,
                provinceGroup
            );

            provinceGroups.push({

                realm:
                    realm,

                layer:
                    provinceGroup

            });

        }

    });


    // ==================================================
    // KAART KLAAR
    // ==================================================

    if (errorElement) {

        errorElement.style.display =
            "none";

    }

    updateStatus(
        "WERELDKAART"
    );

    console.log(
        "WORLD ON EDGE MAP V13 KLAAR"
    );

})

.catch(error => {

    console.error(
        error
    );

    if (errorElement) {

        errorElement.innerHTML = `
            <strong>KAARTFOUT</strong>
            <span>De wereldkaart kon niet worden geladen.</span>
        `;

    }

});


// ======================================================
// PROVINCIES MAKEN
// ======================================================

function createProvinces(
    realm,
    mergedGeometry,
    provinceGroup
) {

    const points =
        realm.provinces.map(
            province => {

                return turf.point(
                    [
                        province[1],
                        province[2]
                    ],
                    {
                        provinceName:
                            province[0],

                        capital:
                            province[3] === true
                    }
                );

            }
        );


    const collection =
        turf.featureCollection(
            points
        );


    const voronoi =
        turf.voronoi(
            collection
        );


    if (
        !voronoi ||
        !voronoi.features
    ) {
        return;
    }


    voronoi.features.forEach(
        (cell, index) => {

            if (!cell) {
                return;
            }


            const point =
                points[index];


            const provinceName =
                point.properties
                    .provinceName;


            const isCapital =
                point.properties
                    .capital;


            try {

                const clipped =
                    turf.intersect(
                        turf.featureCollection([
                            cell,
                            mergedGeometry
                        ])
                    );


                if (!clipped) {
                    return;
                }


                // ======================================
                // PROVINCIEVLAK
                // ======================================

                const provinceLayer =
                    L.geoJSON(
                        clipped,
                        {
                            interactive: true,

                            style: {

                                fillColor:
                                    "#4caf50",

                                fillOpacity:
                                    0.12,

                                color:
                                    "#ffffff",

                                weight:
                                    1,

                                opacity:
                                    0.9
                            }
                        }
                    );


                provinceLayer.bindTooltip(
                    provinceName,
                    {
                        sticky: true
                    }
                );


                provinceLayer.on(
                    "click",
                    event => {

                        L.DomEvent.stopPropagation(
                            event
                        );


                        if (
                            currentMode !==
                            "province"
                        ) {
                            return;
                        }


                        console.log(
                            "PROVINCIE:",
                            provinceName
                        );


                        updateStatus(
                            "PROVINCIE • " +
                            provinceName
                        );


                        if (countryElement) {

                            countryElement.textContent =
                                realm.name +
                                " • " +
                                provinceName;

                        }


                        provinceLayer.setStyle({

                            fillOpacity:
                                0.65,

                            weight:
                                2

                        });

                    }
                );


                provinceLayer.addTo(
                    provinceGroup
                );


                // ======================================
                // STAD / HOOFDSTAD
                // ======================================

                const marker =
                    L.circleMarker(
                        [
                            point.geometry
                                .coordinates[1],

                            point.geometry
                                .coordinates[0]
                        ],
                        {

                            radius:
                                isCapital
                                    ? 6
                                    : 3,

                            color:
                                "#ffffff",

                            weight:
                                1.5,

                            fillColor:
                                "#111111",

                            fillOpacity:
                                1
                        }
                    );


                marker.bindTooltip(
                    provinceName
                );


                marker.on(
                    "click",
                    event => {

                        L.DomEvent.stopPropagation(
                            event
                        );


                        if (
                            currentMode !==
                            "province"
                        ) {
                            return;
                        }


                        updateStatus(
                            "PROVINCIE • " +
                            provinceName
                        );


                        if (countryElement) {

                            countryElement.textContent =
                                realm.name +
                                " • " +
                                provinceName;

                        }

                    }
                );


                marker.addTo(
                    provinceGroup
                );

            } catch (error) {

                console.warn(
                    "Provincie fout:",
                    provinceName,
                    error
                );

            }

        }
    );
}
