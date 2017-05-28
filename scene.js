//Android housekeeping
window.oncontextmenu = function(event) {
     event.preventDefault();
     event.stopPropagation();
     return false;
};


var renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
var scene = new THREE.Scene();

var sceneWidth, sceneHeight, effect, camera, controls, manager;

function createBaseScene(width,height) {

	sceneWidth = width;
	sceneHeight = height;

	// Setup three.js WebGL renderer. Note: Antialiasing is a big performance hit.
	// Only enable it if you actually need to.
	
	// Apply VR stereo rendering to renderer.
	effect = new THREE.VREffect(renderer);
	
	// Append the canvas element created by the renderer to document body element
	
	// Create a three.js scene.
	
	// Create a three.js camera.
	camera = new THREE.PerspectiveCamera(75, sceneWidth / sceneHeight, 0.1, 10000);
	
	controls = new THREE.VRControls(camera);
	
	console.log("vr controls");
	console.log(controls);
	console.log("camera");
	console.log(camera);
	
	controls.standing = true;
	
	// Create a VR manager helper to enter and exit VR mode.
	var params = {
	  hideButton: false, // Default: false.	`
	  isUndistorted: false // Default: false.
	};
	manager = new WebVRManager(renderer, effect, params);
	
	// Create 3D objects.
	var geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
	var material = new THREE.MeshNormalMaterial();
	
	if(width == window.innerWidth) {
		window.addEventListener('resize', onResize, true);
	}
	window.addEventListener('vrdisplaypresentchange', onResize, true);

	addSceneLight(scene,"");
	
	effect.setSize(sceneWidth,sceneHeight);
	camera.aspect = sceneWidth / sceneHeight;
	camera.updateProjectionMatrix();
	
	setupStage();
		
	/*buildInitialScene({
	  	models: [{path: "/vr/jupiter.dae", posx: 0, posy: 0, posz: 0, scale: 1, rotx: -Math.PI / 2, roty: 0, rotz: 0, spin: 'true', spinaxis: 'Z'}],
		skybox: "milkyway",
		skyboxSize: 50,
		skyboxPos: 12.5,
		cameraHeight: 1.5,
	});*/ 
	
	/*setTimeout(function() {
		receiveSceneData({models: [{path: "jupiter.dae", posx: -3, posy: 0, posz: 0, scale: 1, rotx: -Math.PI / 2, roty: 0, rotz: 0, spin: false, spinaxis: 'Z'}]})
	}, 10000);*/
}

//simulate a socket.io callback to start the scene
/*setTimeout(function() {
	renderInBody();
}, 4000);x Z*/

// Request animation frame loop function
var lastRender = 0;
function animate(timestamp) {
  var delta = Math.min(timestamp - lastRender, 500);
  lastRender = timestamp;

  // Apply rotation to cube mesh  
  spinLoop(delta);

  Reticulum.update();

  controls.update();
  // Render the scene through the manager.
  manager.render(scene, camera, timestamp);
  effect.render(scene, camera);

  vrDisplay.requestAnimationFrame(animate);
}

function onResize(e) {
  effect.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

var vrDisplay;

// Get the HMD, and if we're dealing with something that specifies
// stageParameters, rearrange the scene.
function setupStage() {
  navigator.getVRDisplays().then(function(displays) {
    if (displays.length > 0) {
      vrDisplay = displays[0];
      if (vrDisplay.stageParameters) {
        setStageDimensions(vrDisplay.stageParameters);
      }
      vrDisplay.requestAnimationFrame(animate);
    }
  });
}

function setStageDimensions(stage) {
  // Make the skybox fit the stage.
  var material = skybox.material;
  scene.remove(skybox);
  
  // Size the skybox according to the size of the actual stage.
  var geometry = new THREE.BoxGeometry(stage.sizeX, boxSize, stage.sizeZ);
  skybox = new THREE.Mesh(geometry, material);

  // Place it on the floor.
  skybox.position.y = boxSize/2 - skyBoxY;
  scene.add(skybox);
  
  // Place the cube in the middle of the scene, at user height.
  //cube.position.set(0, controls.userHeight, 0);
}

