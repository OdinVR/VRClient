//because I am so used to swift
function print(str) {
	console.log(str);
}

//Android housekeeping
window.oncontextmenu = function(event) {
     event.preventDefault();
     event.stopPropagation();
     return false;
};

function renderSceneInDocument(scene,domobj,width,height) {
	
}

// Setup three.js WebGL renderer. Note: Antialiasing is a big performance hit.
// Only enable it if you actually need to.
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setPixelRatio(window.devicePixelRatio);

// Append the canvas element created by the renderer to document body element.
document.body.appendChild(renderer.domElement);

// Create a three.js scene.
var scene = new THREE.Scene();

// Create a three.js camera.
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

var controls = new THREE.VRControls(camera);

console.log("vr controls");
console.log(controls);
console.log("camera");
console.log(camera);

controls.standing = true;

// Apply VR stereo rendering to renderer.
var effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);

// Add a repeating grid as a skybox.
setSkyboxStage(scene,"grid",12.5);

// Create a VR manager helper to enter and exit VR mode.
var params = {
  hideButton: false, // Default: false.
  isUndistorted: false // Default: false.
};
var manager = new WebVRManager(renderer, effect, params);

// Create 3D objects.
var geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
var material = new THREE.MeshNormalMaterial();

window.addEventListener('resize', onResize, true);
window.addEventListener('vrdisplaypresentchange', onResize, true);

addSceneLight(scene,"");

setTimeout(function(){
  loadDAE("jupiter.dae",function(result) {
	  var container = new THREE.Object3D();
	  container.children = [result.scene];
	  //result.scene.position.z = -2;
	  result.scene.position.y = 1;
	  //result.scene.rotateY(Math.PI / 2);
	  result.scene.rotateX(-Math.PI / 2);
	  //scaleModel(result.scene,10);
	  placeModelInFrontOfCamera(result.scene);
	  startSpin(result.scene,0,0,1);
	  console.log("Result scene:");
	  console.log(result.scene);
	  scene.add(container);
  });
},2000);

// Request animation frame loop function
var lastRender = 0;
function animate(timestamp) {
  var delta = Math.min(timestamp - lastRender, 500);
  lastRender = timestamp;

  // Apply rotation to cube mesh  
  spinLoop(delta);

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

