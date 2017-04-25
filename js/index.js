
/*
This is simple three.js space simulator

TODO: Figure out how to make things work on mobile
      Animate the planets
      Make the planets equal distance apart from each other
      Add music
      Add something to give you a frame of refernce so everything is less werid

*/

var camera, scene, renderer;
var geometry, material, mesh;
var controls;

var objects = [];

var raycaster;

// http://www.html5rocks.com/en/tutorials/pointerlock/intro/
var blocker = document.getElementById( 'blocker' );
var instructions = document.getElementById( 'instructions' );

var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

if ( havePointerLock ) {

  var element = document.body;

  var pointerlockchange = function ( event ) {

    if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

      controlsEnabled = true;
      controls.enabled = true;

      blocker.style.display = 'none';

    } else {

      controls.enabled = false;

      blocker.style.display = '-webkit-box';
      blocker.style.display = '-moz-box';
      blocker.style.display = 'box';

      instructions.style.display = '';

    }

  };

  var pointerlockerror = function ( event ) {

    instructions.style.display = '';

  };

  // Hook pointer lock state change events
  document.addEventListener( 'pointerlockchange', pointerlockchange, false );
  document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
  document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

  document.addEventListener( 'pointerlockerror', pointerlockerror, false );
  document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
  document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

  instructions.addEventListener( 'click', function ( event ) {

    instructions.style.display = 'none';

    // Ask the browser to lock the pointer
    element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
    element.requestPointerLock();

  }, false );

} else {

  instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

}

init();
animate();

var controlsEnabled = false;

var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;

var prevTime = performance.now();
var velocity = new THREE.Vector3();

function init() {

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 2000 );

  scene = new THREE.Scene();
  controls = new THREE.PointerLockControls( camera );
  scene.add( controls.getObject() );

  var onKeyDown = function ( event ) {

    switch ( event.keyCode ) {

      case 38: // up
      case 87: // w
        moveForward = true;
        break;

      case 37: // left
      case 65: // a
        moveLeft = true; break;

      case 40: // down
      case 83: // s
        moveBackward = true;
        break;

      case 39: // right
      case 68: // d
        moveRight = true;
        break;

    }

  };

  var onKeyUp = function ( event ) {

    switch( event.keyCode ) {

      case 38: // up
      case 87: // w
        moveForward = false;
        break;

      case 37: // left
      case 65: // a
        moveLeft = false;
        break;

      case 40: // down
      case 83: // s
        moveBackward = false;
        break;

      case 39: // right
      case 68: // d
        moveRight = false;
        break;

    }

  };


  document.addEventListener( 'keydown', onKeyDown, false );
  document.addEventListener( 'keyup', onKeyUp, false );

  raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

  // Create the bodies
  // Distances are in thousands of km

  var sunGeometry = new THREE.SphereGeometry( 695.7, 32, 32 );
  var sunMaterial = new THREE.MeshBasicMaterial( {color: 0xFFFFF0} );
  var sun = new THREE.Mesh( sunGeometry, sunMaterial );
  scene.add( sun );

  var mercuryGeometry = new THREE.SphereGeometry( 2.44, 32, 32);
  var mercuryMaterial = new THREE.MeshBasicMaterial( {color:0xA9A9A9 } );
  var mercury = new THREE.Mesh( mercuryGeometry, mercuryMaterial );
  mercury.position.z = 1000;
  scene.add( mercury );

  var venusGeometry = new THREE.SphereGeometry( 6.05, 32, 32);
  var venusMaterial = new THREE.MeshBasicMaterial( {color:0xB22222 } );
  var venus = new THREE.Mesh( venusGeometry, venusMaterial );
  venus.position.z = 1200;
  scene.add( venus );

  var earthGeometry = new THREE.SphereGeometry( 6.37, 32, 32);
  var earthMaterial = new THREE.MeshBasicMaterial( {color:0x0000FF } );
  var earth = new THREE.Mesh( earthGeometry, earthMaterial );
  earth.position.z = 1400;
  scene.add( earth );

  var marsGeometry = new THREE.SphereGeometry( 3.39, 32, 32);
  var marsMaterial = new THREE.MeshBasicMaterial( {color:0xA9A9A9 } );
  var mars = new THREE.Mesh( marsGeometry, marsMaterial );
  mars.position.z = 1600;
  scene.add( mars );

  var jupiterGeometry = new THREE.SphereGeometry( 69.91, 32, 32);
  var jupiterMaterial = new THREE.MeshBasicMaterial( {color:0xF4A460 } );
  var jupiter = new THREE.Mesh( jupiterGeometry, jupiterMaterial );
  jupiter.position.z = 1800;
  scene.add( jupiter );

  var saturnGeometry = new THREE.SphereGeometry( 58.23, 32, 32);
  var saturnMaterial = new THREE.MeshBasicMaterial( {color:0xEEE8AA } );
  var saturn = new THREE.Mesh( saturnGeometry, saturnMaterial );
  saturn.position.z = 2000;
  scene.add( saturn );

  var uranusGeometry = new THREE.SphereGeometry( 25.36, 32, 32);
  var uranusMaterial = new THREE.MeshBasicMaterial( {color:0xADD8E6 } );
  var uranus = new THREE.Mesh( uranusGeometry, uranusMaterial );
  uranus.position.z = 2200;
  scene.add( uranus );

  var neptuneGeometry = new THREE.SphereGeometry( 24.62, 32, 32);
  var neptuneMaterial = new THREE.MeshBasicMaterial( {color:0x6495ED } );
  var neptune = new THREE.Mesh( neptuneGeometry, neptuneMaterial );
  neptune.position.z = 2400;
  scene.add( neptune );

  // render
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor( 0x000000 );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  window.addEventListener( 'resize', onWindowResize, false );

  controls.getObject().position.x = 100;
  controls.getObject().position.y = 0;
  controls.getObject().position.z = 1000; 

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

  requestAnimationFrame( animate );

  if ( controlsEnabled ) {
    raycaster.ray.origin.copy( controls.getObject().position );

    var intersections = raycaster.intersectObjects( objects );

    var isOnObject = intersections.length > 0;

    var time = performance.now();
    var delta = ( time - prevTime ) / 1000;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    if ( moveForward ) velocity.z -= 1000 * delta;
    if ( moveBackward ) velocity.z += 1000 * delta;

    if ( moveLeft ) velocity.x -= 1000 * delta;
    if ( moveRight ) velocity.x += 1000 * delta;

    controls.getObject().translateX( velocity.x * delta );
    controls.getObject().translateZ( velocity.z * delta );

    prevTime = time;

  }

  console.log(controls.getObject().position)

  renderer.render( scene, camera );

}
