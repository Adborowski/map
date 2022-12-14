<?php require_once "db.php" ?>

<!DOCTYPE html>
<html lang="en">
<head>
    <!-- <meta charset="UTF-8"> -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DI-MAP</title>

    <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Open+Sans" />
    
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
    integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
    crossorigin=""/>

    <link rel="stylesheet" href="styles.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>

</head>

<body>
<div id="main">
    <div id="menu-panel">
        <!-- Welcome, <div id="active-username"></div> 
        
        <div class="hidden" id="user-marker">0</div>
        <div class="hidden" id="temporary-img-id">no img</div> -->
    </div>

    <?php include_once "login.php" ?>
    <div class="explainerBox"><span>Click anywhere on the map to create a new task. Click on a marker to open a task.</span></div>
    <div id="mapid"></div>
</div>

</body>

<script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
crossorigin=""></script>

<script src="map.js"></script>
<script src="login.js"></script>
<script src="img-upload.js"></script>

<script>
</script>

</html>

