﻿// TODO
// - Save content of unfinished markers and paste it in when reopened
// - Not Empty validation on marker editor
// - Marker Editor or Editor Marker?

console.log("[MAP.JS]");

var copenhagenLocation = [55.685, 12.57];
var copenhagenLocation2 = [55.6854, 12.5702];
var zoomLevel = 16; // higher number - sat closer to ground; default 13

var map = L.map('mapid').setView(copenhagenLocation, zoomLevel);
// first value of SetView goes up/down - higher number moves the satellite north
// second value goes left/right - higher number moves the satellite east

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11', // satellite-v9 also available
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYWRib3Jvd3NraSIsImEiOiJja21vcjJmYWgyN2RuMnBrNXdwaGQ5YXVyIn0.stnVilPeFh4jamL573O1Lw'
}).addTo(map);

// note: buttons only exist in the DOM after their marker is clicked

// define pin icon
var pinIcon = L.icon({
    iconUrl: 'images/pin-2.svg',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -10],
    shadowUrl: '',
    shadowSize: [68, 95],
    shadowAnchor: [22, 94]
});

// reduce this using inheritance with pinIcon
var pinIconEditMode = L.icon({
    iconUrl: 'images/pin-4.svg',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -10],
    shadowUrl: '',
    shadowSize: [68, 95],
    shadowAnchor: [22, 94]
});

var oTestMarker = {
    "id": 1,
    "latlng": {"lat": 55.6852, "lng": 12.5703},
    "ownerId": 2,
    "imgUrl": "1.jpg",
    "title": "Trash pickup around the lakes",
    "note": "Collect trash around the lakes. Make sure you get the cigarette butts.",
    "reward": 150
}

var markersLayerGroup = L.layerGroup();
var openMarker = false;

function addMarkerToGroup(markerObject){

    // console.log("Rendering marker: ", markerObject);

        var newMarker = L.marker(markerObject.latlng, {icon: pinIcon})

        newMarker.id = markerObject.id;
        newMarker.latlng = markerObject.latlng;
        newMarker.title = markerObject.title;
        newMarker.type = "marker";
        newMarker.owner_id = markerObject.owner_id;

        newMarker.addEventListener("click", function(e){
            openMarker = newMarker;
        });

        var newPopup = L.popup({offset: [0,-30]})
        .setLatLng(markerObject.latlng)
        .setContent(createPopupContent(markerObject))
        
        newPopup.addEventListener("click", function(newPopup){
            console.log(newPopup)
        })

        newPopup.type = "marker";
        newPopup.popupId = parseInt(markerObject.id);
        
        newMarker.bindPopup(newPopup);
        markersLayerGroup.addLayer(newMarker);

};

function renderMarkerGroup(markersLayerGroup){
    
    markersLayerGroup.addTo(map);

}

var openEditorMarker = false; // a bool, which later turns into a marker object
function renderMarkerEditor(latlng){

    console.log("Rendering marker editor.");

        if (openEditorMarker != false){ 
            openEditorMarker.remove(); // remove abandoned editor pins
        }

        var newMarker = L.marker(latlng, {draggable: false, icon: pinIconEditMode})
                         .on('click', ()=>{openMarker = false}); // hotfix - the openMarker flag system needs a rework

        newMarker.type = "markerEditor";
        console.log(newMarker);

        var newPopup = L.popup({offset: [0,-30]})
        .setLatLng(latlng)
        .setContent(createPopupEditorContent());

        newPopup.type = "markerEditor";
        
        newMarker.bindPopup(newPopup);
        newMarker.addTo(map);
        newMarker.openPopup();
        powerImageUploadButton();


        newPopup.addEventListener("click", function(newPopup){
            console.log(newPopup);
        })

        openEditorMarker = newMarker;
        openMarker = newMarker;

        $(".btn-cancel-marker").on("click", ()=>{
            newMarker.closePopup();
            newMarker.remove();
            openMarker = false;
        })

        $(".btn-post-marker").on("click", ()=>{
            console.log("Posting marker...");
            var newMarkerObject = {};
            newMarkerObject.latlng = latlng;
            newMarkerObject.imgurl = document.querySelector("#temporary-img-id").innerHTML; // dummy for now, will get back to img upload
            newMarkerObject.title = document.querySelector("div.title").innerHTML;
            newMarkerObject.note = document.querySelector("div.note").innerHTML;
            newMarkerObject.reward = document.querySelector("input.reward").value;
            var activeUserId = $("#user-marker").text();
            newMarkerObject.ownerId = activeUserId;

            postMarker(newMarkerObject);
        });

}

function createPopupContent(markerObject){

    // common popup with marker data from db
    var popupContentString = `

    <div class="popup">

        <div class="popup-image-content">
            <img src="images/${markerObject.imgurl}">
        </div>

        <div class="popup-text-content" data-pin-id=${markerObject.id}>
        <div class="reward"><div class="amount">${markerObject.reward} kr</div></div>
            <div class="title" type="text">${markerObject.title}</div>
            <div class="note" type="text">${markerObject.note}</div>

            <div class="popup controls">

                <div class="btn"><div class="label">Fund</div></div>
                <div class="btn btn-start-fix"><div class="label">Fix</div></div>
                <div class="btn btn-delete-marker"><div class="label">Delete</div></div>
 
            </div>
        </div>
    </div>
    `;


    return popupContentString;
}


function createPopupEditorContent(){

    var popupEditorContentString = `

    <div class="popup">

        <div class="popup-image-content" id="btn-img-upload">
            <label class="img-upload" for="file">
                <div class="overlay" id="image-upload-overlay"><div class="line">Click to upload an image</div></div>
                <img id="upload-preview" class="preview" src="images/1.jpg">
            </label>

            <div class="controls-img-upload" style="position: absolute; top: 36px">
                <input class="control" onchange="uploadImage()" type="file" id="file" name="file"></input>
                <input class="control" type="button" class="button" value="Upload" id="but_upload">
            </div>
        </div>

        <div class="popup-text-content editor">
        <input type="number" class="editable reward" placeholder="Set a reward"></input></span>
            <div contenteditable="true" class="editable title" type="text" data-placeholder="Add a title"></div>
            <div contenteditable="true" class="editable note" type="text" data-placeholder="Add a note"></div>
            
            <div class="popup controls">
                
                <div class="btn btn-cancel-marker"><div class="label">Cancel</div></div>
                <div class="btn btn-post-marker"><div class="label">Post</div></div>

            </div>
        
        </div>

    </div>
    `
    return popupEditorContentString;
}

function postMarker(newMarkerObject){

    $.ajax({ // marker gets saved in the backend first

        url: "apis/api-post-new-marker.php",
        data: {
            "newMarkerLatlng": JSON.stringify(newMarkerObject.latlng),
            "newMarkerImgurl": newMarkerObject.imgurl,
            "newMarkerTitle": newMarkerObject.title,
            "newMarkerNote": newMarkerObject.note,
            "newMarkerReward": newMarkerObject.reward,
            "newMarkerOwnerId" : newMarkerObject.ownerId
        },
        method: "post",

    }).done(function(sData){

        console.log(sData);
        oData = JSON.parse(sData);
        console.log("Posting marker...", oData);
        getMarkerObjectsFromBackend(); // the map gets updated
        map.closePopup(); // close after posting
        openMarker = false; // marker is closed now

    });
}

function panToPopup(openMarker){
    var px = map.project(openMarker._popup._latlng); // get pixels from latlng
    console.log(px);
    px.y -= openMarker._popup._container.clientHeight/2 + 42; // the 42 is arbitrary
    map.panTo(map.unproject(px),{animate: true}); 
}

if( screen.width <= 480 ){// smaller than mobile
    console.log("Device: Mobile");
    powerMobileMapClicks();
} 

if( screen.width > 480 ){// larger than mobile
    powerMapClicks();
    console.log("Device: Desktop");
} 

// map click handling

function powerMapClicks(){ // desktop

    map.addEventListener("click", function(mapClick){

        console.log("Map clicked at latlng", mapClick.latlng);
    
        if (openMarker != false){ // control what happens when you click away while there is an open popup on the map
            openMarker.closePopup();
            openMarker = false;
        } else {
            renderMarkerEditor(mapClick.latlng);
            console.log(openMarker);
            panToPopup(openMarker); // custom function
        }
    
    });
}

function powerMobileMapClicks(){ //mobile

    map.addEventListener("click", function(mapClick){
            console.log("map clicked on mobile");
            renderMarkerEditor(mapClick.latlng);
            console.log(mapClick);
            console.log(openMarker);
            panToPopup(openMarker); // custom function
    });
}


map.addEventListener("popupopen", (popupEvent)=>{ // some buttons get powered at this event, because they only exist after opening a popup

    var markerParent = popupEvent.popup._source; // which MARKER is behind the popup;
    panToPopup(markerParent);

    if (markerParent.type == "marker"){ // this is only for regular, not for editor-type markers (types: "marker", "markerEditor")

        var markerId = popupEvent.popup.popupId;
        $(".btn-delete-marker").on("click", ()=>{
            console.log(popupEvent.popup._source);
            markerParent.remove();
            popupEvent.popup._source.closePopup();
            openMarker = false;
            deleteMarker(markerId);
        })
    
        var activeUser = $("#user-marker").text(); // get the active user's id from the echoed DOM element
    
        // figure out which markers should have a DELETE button (question of ownership)
    
        if (activeUser != markerParent.owner_id){
            document.querySelector(".btn-delete-marker").remove();
        }

    }


})

map.addEventListener("popupclose", (popup)=>{
    openEditorMarker ? openEditorMarker.remove() : console.log();
    openEditorMarker = false;
});

function deleteMarker(markerId){

    $.ajax({
        url: "apis/api-delete-marker.php",
        type: "post",
        data: {markerId: markerId},
    }).done(function(sData){
        var jData = JSON.parse(sData);
        console.log("Deleting marker with id", markerId, jData);
    })
}

// rendering function is called inside this
function getMarkerObjectsFromBackend(){

    var backendMarkersArray = [];

    $.ajax({
      url: "apis/api-get-markers.php",
      type: "post",
      data: "",
    }).done(function(jData){
        markersArray = JSON.parse(jData);

        // parse JSON strings into JSON objects, and string-integers into integers
        markersArray.forEach((singleMarkerData) => {
            singleMarkerData.latlng = JSON.parse(singleMarkerData.latlng);
            singleMarkerData.id = JSON.parse(singleMarkerData.id);
            singleMarkerData.owner_id = JSON.parse(singleMarkerData.owner_id);
        })

        console.log("Fetched markers from database:", markersArray);
        console.log("GROUP:", markersLayerGroup);

        markersLayerGroup.clearLayers();
        markersArray.forEach((markerObject)=>{
            addMarkerToGroup(markerObject);
        });
        
        renderMarkerGroup(markersLayerGroup);
    
    }).fail(function(){
        console.log("Failed to get markers from backend.")
    });
}

getMarkerObjectsFromBackend();



