import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import "./location-search.css";
import HomepageService from "../../services/homepage";
import { formatPrice } from "../../utils";
import { useStateIfMounted } from "use-state-if-mounted";

export default function LocationSearch() {
  const [mapstate, setMap] = useStateIfMounted(null);
  const [center, setCenter] = useStateIfMounted({
    lat: 24.466667,
    lng: 54.366669,
  });
  const [centerAddress, setCenterAddress] = useStateIfMounted("");
  const [radius, setRadius] = useState(300);
  const [active, setActive] = useState(true);
  const [circle, setCirle] = useStateIfMounted(null);
  const [polygonState, setPolygonState] = useStateIfMounted(null);
  const [drawingManagerState, setDrawingManagerState] = useStateIfMounted("");
  const [properties, setProperties] = useStateIfMounted([]);
  const [markers, setMarkers] = useStateIfMounted([]);

  let map;
  let newMarkers = [];
  let centerMarker = null;
  let drawingManager;
  let polygon;
  const history = useHistory();

  const handleReset = () => {
    if (polygonState) {
      polygonState.setMap(null);
      setPolygonState(null);
      drawingManagerState.setDrawingMode(
        window.google.maps.drawing.OverlayType.POLYGON
      );

      setProperties([]);
      if (markers.length > 0) {
        markers.map((marker) => {
          marker.setMap(null);
        });
      }
    }
  };

  const searchByPolygon = async (drawnPolygon) => {
    const polygonCoords = drawnPolygon
      .getPath()
      .getArray()
      .map((point) => `${point.lng()} ${point.lat()}`);

    const data = await HomepageService.searchByPolygon({
      coordinates: polygonCoords,
    });
    if (data) {
      setProperties([]);

      if (newMarkers.length > 0) {
        newMarkers.map((marker) => {
          marker.setMap(null);
        });
      }

      newMarkers = [];
      if (data.length > 0) {
        setProperties(data);

        data.map((property) => {
          const position = {
            lat: parseFloat(property.latitude),
            lng: parseFloat(property.longitude),
          };

          const marker = addMarkerOnMap(
            map,
            position,
            "assets/img/icons/property-marker.png",
            { width: 40, height: 40 }
          );

          newMarkers.push(marker);
          marker.addListener("click", function () {
            window.open(
              `${process.env.REACT_APP_PUBLIC_URL}/property-details/${property.id}`,
              "_blank"
            );
          });
        });

        setMarkers(newMarkers);
      }
    }
  };

  const searchByCircle = async () => {
    const data = await HomepageService.searchByCircle({ radius, center });
    if (data.length > 0) {
      data.map((property) => {
        const position = {
          lat: parseFloat(property.latitude),
          lng: parseFloat(property.longitude),
        };

        const marker = addMarkerOnMap(
          mapstate,
          position,
          "assets/img/icons/property-marker.png",
          { width: 40, height: 40 }
        );
        marker.addListener("click", function () {});
      });
    }
  };

  const handleActive = () => {
    setActive(!active);
  };

  const reverseGeocode = (geocoder, location) => {
    return new Promise((resolve, reject) => {
      geocoder.geocode({ location }, function (results, status) {
        if (status == window.google.maps.GeocoderStatus.OK) {
          resolve(results[0].formatted_address);
        } else {
          reject(status);
        }
      });
    });
  };

  const addMarkerOnMap = (map, position, icon, icondimensions) => {
    const marker = new window.google.maps.Marker({
      position,
      map: map,
      animation: window.google.maps.Animation.DROP,
      icon: {
        url: icon,
        scaledSize: new window.google.maps.Size(
          icondimensions.width,
          icondimensions.height
        ), // Optional: set the size of the icon
      },
    });
    return marker;
  };

  const drawCircle = () => {
    if (circle) {
      circle.setMap(null);
    }

    const newCircle = new window.google.maps.Circle({
      map: mapstate,
      center: center,
      radius: radius,
      strokeColor: "#0000FF",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#0000FF",
      fillOpacity: 0.35,
    });

    mapstate.setOptions({ draggableCursor: "grab" });
    setCirle(newCircle);
    searchByCircle();
  };

  const handleLogoClick = () => {
    history.push("/services/properties");
  };

  useEffect(() => {
    const google = window.google;
    const geocoder = new google.maps.Geocoder();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          //const currentLocation = { lat: 24.466667, lng: 54.366669 };
          setCenter(currentLocation);
          map.setCenter(currentLocation);
          setCenterAddress(await reverseGeocode(geocoder, currentLocation));
          centerMarker = addMarkerOnMap(
            map,
            currentLocation,
            "assets/img/icons/map-marker.png",
            { width: 30, height: 40.5 }
          );
        },
        (error) => {
          console.log(error);
        }
      );
    }

    map = new window.google.maps.Map(document.getElementById("map"), {
      center,
      zoom: 17,
    });
    setMap(map);

    const autocomplete = new window.google.maps.places.Autocomplete(
      document.getElementById("autocomplete")
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }

      map.setCenter(place.geometry.location);
      map.setZoom(17);

      if (centerMarker) {
        centerMarker.setPosition(place.geometry.location);
      }
    });

    map.addListener("click", function (event) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      // const infowindow = new google.maps.InfoWindow({
      //   content: "Clicked location: " + lat + ", " + lng,
      // });
      // infowindow.setPosition(event.latLng);
      // infowindow.open(map);
    });

    drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          // google.maps.drawing.OverlayType.MARKER,
          // google.maps.drawing.OverlayType.CIRCLE,
          google.maps.drawing.OverlayType.POLYGON,
          // google.maps.drawing.OverlayType.POLYLINE,
          // google.maps.drawing.OverlayType.RECTANGLE,
        ],
      },
      polygonOptions: {
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        strokeWeight: 2,
        clickable: true,
        editable: true,
        draggable: true,
        zIndex: 1,
      },
    });

    google.maps.event.addListener(
      drawingManager,
      "polygoncomplete",
      function (drawnPolygon) {
        if (polygon) {
          polygon.setMap(null);
          setProperties([]);
          if (newMarkers.length > 0) {
            newMarkers.map((marker) => {
              marker.setMap(null);
            });
          }
        }

        google.maps.event.addListener(
          drawnPolygon,
          "dragend",
          function (event) {
            searchByPolygon(drawnPolygon);
          }
        );
        polygon = drawnPolygon;
        setPolygonState(drawnPolygon);
        searchByPolygon(drawnPolygon);
        drawingManager.setDrawingMode(null);
      }
    );

    setDrawingManagerState(drawingManager);
    drawingManager.setMap(map);
  }, []);

  return (
    <div className="map-container">
      <div className="custom_position">
        <button
          className={`open-button ${active ? "" : "closed-button"}`}
          onClick={handleActive}
        >
          {active ? "Close Search" : "Open Search"}
        </button>
        <button
          className={`open-button-reset ${active ? "" : "closed-button-reset"}`}
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
      <div className={`sidebarforsearch ${active ? "isActive" : ""}`}>
        <img
          src={`${process.env.REACT_APP_PUBLIC_URL}/assets/img/logo.png`}
          id="sideabar-logo"
          alt="Logo"
          height="80"
          onClick={handleLogoClick}
          className="cursor_pointer"
        />
        <p>
          You can search the properties in a specific area by drawing shapes on
          maps.{" "}
        </p>
        <br />
        <p>Move center to your desired location</p>
        <input
          type="text"
          value={centerAddress}
          name="ltn__name"
          id="autocomplete"
          onChange={(event) => {
            setCenterAddress(event.target.value);
          }}
          placeholder="Center your location"
        />
        <div className="scrollable">
          {properties &&
            properties.length > 0 &&
            properties.map((element, i) => (
              <div key={element} className="content-box">
                <img
                  src={`${process.env.REACT_APP_API_URL}/${element?.featuredImage}`}
                  alt="#"
                  className="featured-image-style"
                />
                <div className="content">
                  <h6 className="description mb-2">{element.title}</h6>
                  <span className="location">
                    <i className="flaticon-pin"></i> {element.address}
                  </span>
                </div>
                <div className="product-info-bottom">
                  <div className="product-price">
                    <span>{formatPrice(element.price)}</span>
                  </div>
                  <div className="product-price">
                    <button
                      className="btn theme-btn-2 request-now-btn"
                      onClick={() => {
                        window.open(
                          `${process.env.REACT_APP_PUBLIC_URL}/property-details/${element.id}`,
                          "_blank"
                        );
                      }}
                    >
                      Open Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div id="map"></div>
    </div>
  );
}
