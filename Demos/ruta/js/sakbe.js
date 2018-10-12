var aProj = new OpenLayers.Projection("EPSG:4326");
var deProj = new OpenLayers.Projection("EPSG:900913");
var id_i = 0,
    ban = 0;
var map, layer;
OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {
    defaultHandlerOptions: {
        'single': true,
        'double': false,
        'pixelTolerance': 0,
        'stopSingle': false,
        'stopDouble': false
    },

    initialize: function (options) {
        this.handlerOptions = OpenLayers.Util.extend({}, this.defaultHandlerOptions);
        OpenLayers.Control.prototype.initialize.apply(
            this, arguments
        );
        this.handler = new OpenLayers.Handler.Click(
            this, {
                'click': this.trigger
            }, this.handlerOptions
        );
    },

    trigger: function (e) {
        var lonlat = map.getLonLatFromPixel(e.xy).transform(deProj, aProj);
        var lonlat2 = map.getLonLatFromPixel(e.xy);

        var escala = map.getScale();
        var geojson = EncuentraRoad(lonlat.lat, lonlat.lon, escala);
        var geojson_punto = new OpenLayers.Format.GeoJSON({
            'internalProjection': new OpenLayers.Projection("EPSG:900913"),
            'externalProjection': new OpenLayers.Projection("EPSG:4326")
        });
        vectors1.addFeatures(geojson_punto.read(geojson));
        if (ban == 1) {
            rutear();
            document.getElementById('x').style.display = "none";
        }
    }

});


var apiKey = "Ar3-LKk-acyISMevsF2bqH70h21mzr_FN9AhHfi7pS26F5hMH1DmpI7PBK1VCLBk";

function init() {
    map = new OpenLayers.Map('map', {
        controls: [
            new OpenLayers.Control.Navigation(),
            new OpenLayers.Control.PanZoomBar(),
            new OpenLayers.Control.LayerSwitcher({
                'ascending': false
            }),
            new OpenLayers.Control.ScaleLine(),
            new OpenLayers.Control.Permalink('http://www.inegi.org.mx'),
            new OpenLayers.Control.MousePosition(),
            new OpenLayers.Control.KeyboardDefaults()
        ],
        projection: new OpenLayers.Projection('EPSG:900913'),
        displayProjection: new OpenLayers.Projection("EPSG:4326"),
        numZoomLevels: 23
    });

    map.addControl(new OpenLayers.Control.MousePosition());
    map.addControl(new OpenLayers.Control.LayerSwitcher());



    base1 = new OpenLayers.Layer.WMS("Mapa Base",
        "http://gaiamapas2.inegi.org.mx/mdmCache/service/wms?", {
            layers: 'MapaBaseTopograficov61_sinsombreado'
        }, {
            isBaseLayer: 'true'
        });



    vectors1 = new OpenLayers.Layer.Vector("Puntos Ruta", {
        styleMap: new OpenLayers.StyleMap({
            "default": new OpenLayers.Style(OpenLayers.Util.applyDefaults({
                externalGraphic: "img/punto.png",
                graphicOpacity: 1,
                rotation: 0,
                pointRadius: 20,
                graphicYOffset: -37,
                graphicXOffset: -18
            }, OpenLayers.Feature.Vector.style["default"]))

        })
    });
    map.addLayers([base1, vectors1]);
    map.addControl(new OpenLayers.Control.LayerSwitcher());

    selectControl = new OpenLayers.Control.SelectFeature(
        [vectors1], {
            clickout: true,
            toggle: false,
            multiple: false,
            hover: false,
            toggleKey: "ctrlKey", // ctrl key removes from selection
            multipleKey: "shiftKey" // shift key adds to selection
        });

    map.addControl(selectControl);
    selectControl.activate();
    navigator.geolocation.getCurrentPosition(PermitirUbicacion, NoUbicacion);

} ///////////////// TERMINA FUNCION Init()

function PermitirUbicacion(pos) {
    IrPosicion(pos.coords.longitude, pos.coords.latitude);
}

function NoUbicacion(pos) {
    IrPosicion(-104.62426, 24.03606);
}

function IrPosicion(lat, lon) {
    map.setCenter(
        new OpenLayers.LonLat(lat, lon).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject()), 13
    );
    var click = new OpenLayers.Control.Click();
    map.addControl(click);
    click.activate();
}

function leeXML() {
    if (window.XMLHttpRequest) {
        // Objeto para IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {
        // Objeto para IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    var p = 2; // Calcuar ruta Recomendada por Sakbé
    var v = 1; // Transitar con un auto  
    var e = 0; //  Cero ejes exedentes

    url = "http://gaia.inegi.org.mx/sakbe/wservice?make=CR&id_i=" + id_i + "&source_i=" + source_i + "&target_i=" + target_i + "&id_f=" + id_f + "&source_f=" + source_f + "&target_f=" + target_f + "&p=" + p + "&v=" + v + "&e=" + e + "&type=xml&key=SIATL";

    xmlhttp.open("GET", url, false);
    xmlhttp.send();
    xmlDoc = xmlhttp.responseXML;

    long = xmlDoc.getElementsByTagName("long_km")[0].childNodes[0].nodeValue
    tiempo = xmlDoc.getElementsByTagName("tiempo_min")[0].childNodes[0].nodeValue
    peaje = xmlDoc.getElementsByTagName("peaje")[0].childNodes[0].nodeValue
    costo = xmlDoc.getElementsByTagName("costo_caseta")[0].childNodes[0].nodeValue
    if (e > 0)
        eje = xmlDoc.getElementsByTagName("eje_excedente")[0].childNodes[0].nodeValue
    geoJSON = xmlDoc.getElementsByTagName("geojson")[0].childNodes[0].nodeValue

    var codHtml = "<table><tr><td><b>Distancia:<b></td><td>" + long + " km</td></tr>" +
        "<tr><td><b>Tiempo:</b></td><td>" + tiempo + " min</td></tr>" +
        "<tr><td><b>Costo Casetas:</b></td><td>$ " + costo + "</td></tr></table>";

    document.getElementById("resultado").innerHTML = codHtml;
    return geoJSON;
}

function EncuentraRoad(y, x, escala) {

    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest(); // Objeto para IE7+, Firefox, Chrome, Opera, Safari
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); // Objeto para IE6, IE5
    }
    try {


        url = "http://gaia.inegi.org.mx/sakbe/wservice?make=IL&escala=" + escala + "&y=" + y + "&x=" + x + "&type=xml&key=SIATL";

        xmlhttp.open("GET", url, false)
        xmlhttp.send();
        xmlDoc = xmlhttp.responseXML;

    } catch (err) {
        alert(err);

    }

    id_routing_net = xmlDoc.getElementsByTagName("id_routing_net")[0].childNodes[0].nodeValue
    source = xmlDoc.getElementsByTagName("source")[0].childNodes[0].nodeValue
    target = xmlDoc.getElementsByTagName("target")[0].childNodes[0].nodeValue
    nombre = xmlDoc.getElementsByTagName("nombre")[0].childNodes[0].nodeValue
    geojson = xmlDoc.getElementsByTagName("geojson")[0].childNodes[0].nodeValue


    if (id_i == 0) {
        id_i = id_routing_net;
        source_i = source;
        target_i = target;
        document.getElementById('origen').value = nombre;
    } else {

        id_f = id_routing_net;
        source_f = source;
        target_f = target;
        document.getElementById('destino').value = nombre;
        ban = 1;
    }
    location.href = "#openModal";
    return geojson;
}

/***********  CREAR PUNTO EN COORDENADAS ESPECIFICAS en Vectors1  **********************/
function createFeatures2(x1, y1) {
    var features = [];
    features.push(new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(y1, x1)));
    return features;
}

function rutear() {
    var geojson_format = new OpenLayers.Format.GeoJSON({
        'internalProjection': new OpenLayers.Projection("EPSG:900913"),
        'externalProjection': new OpenLayers.Projection("EPSG:4326")
    });
    var style_ruta = {
        strokeColor: "#0000EE",
        strokeWidth: 6,
        strokeDashstyle: "solid",
        pointRadius: 15,
        pointerEvents: "visiblePainted",
        title: "Ruta Sugerida",
        strokeOpacity: 0.5
    };

    var vector_layer = new OpenLayers.Layer.Vector('Ruta', {
        style: style_ruta
    });

    map.addLayer(vector_layer);

    vector_layer.addFeatures(geojson_format.read(leeXML()));
}