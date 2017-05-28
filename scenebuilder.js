
var sceneModels = [];
var receivedFirstScene = false;
var currentScene = {};

function renderInBody() {
	document.body.innerHTML = "";
	renderer.setPixelRatio(window.devicePixelRatio);
	createBaseScene(window.innerWidth,window.innerHeight);
	document.body.appendChild(renderer.domElement);
}

function renderInPanel(width,height) {
	var panel = document.getElementById("3dscene");
	renderer.setPixelRatio(window.devicePixelRatio);
	createBaseScene(width,height);
	panel.appendChild(renderer.domElement);
}

function receiveSceneData(data) {
	console.log("receive scene data");
	console.log(data);
	if(receivedFirstScene == false) {
		receivedFirstScene = true;
		buildInitialScene(data);
	} else {
		updateScene(data);
	}
}

function updateScene(data) {
	placeModels(data.models);
	if(currentScene.skybox != data.skybox || currentScene.skyboxSize != data.skyboxSize || currentScene.skyboxPos != data.skyboxPos) {
		setSkyboxStage(scene,data.skybox,data.skyboxSize,data.skyboxPos);
	}
	currentScene = data;
}

function buildInitialScene(data) {
	currentScene = data;
	setSkyboxStage(scene,data.skybox,data.skyboxSize,data.skyboxPos);
	var models = data.models;
	placeModels(models);
	startInteraction();
	testReticulum();
}

function findModelInScene(path) {
	console.log("scene models");
	console.log(sceneModels);
	for(var i=0;i<sceneModels.length;i++) {
		var model = sceneModels[i];
		if(model.id === path) {
			return model.scene;
		}
	}
	return null;
}

function placeModels(models) {
	models.forEach(function(model) {
		var modelInScene = findModelInScene(model.path);
		if(modelInScene != null) {
			console.log("model already in scene");
			//update parameters, already in scene
			modelInScene.position.x = model.posx;
			modelInScene.position.y = model.posy;
			modelInScene.position.z = model.posz;
			modelInScene.rotation.x = model.rotx;
			modelInScene.rotation.y = model.roty;
			modelInScene.rotation.z = model.rotz;
			stopSpin(modelInScene);
			if(model.spin == 'true') {
				if(model.spinaxis.toUpperCase() == 'X') {
					startSpin(modelInScene,1,0,0);
				} else if(model.spinaxis.toUpperCase() == 'Y') {
					startSpin(modelInScene,0,1,0);
				} else if(model.spinaxis.toUpperCase() == 'Z') {
					startSpin(modelInScene,0,0,1);
				}
			}
			scaleModel(modelInScene,model.scale);
		} else {
			loadDAE(getModelPathFromServer(model.path),function(result) {
				if(model.posx == 0 && model.posy == 0 && model.posz == 0) {
					placeModelInFrontOfCamera(result.scene);
				} else {
					result.scene.position.x = model.posx;
					result.scene.position.y = model.posy;
					result.scene.position.z = model.posz;
				}
				result.scene.rotation.x = model.rotx;
				result.scene.rotation.y = model.roty;
				result.scene.rotation.z = model.rotz;
				console.log("scene uuid: " + result.scene.uuid);
				stopSpin(result.scene);
				if(model.spin == 'true') {
					if(model.spinaxis.toUpperCase() == 'X') {
						startSpin(result.scene,1,0,0);
					} else if(model.spinaxis.toUpperCase() == 'Y') {
						startSpin(result.scene,0,1,0);
					} else if(model.spinaxis.toUpperCase() == 'Z') {
						startSpin(result.scene,0,0,1);
					}
				}
				scaleModel(result.scene,model.scale);
				console.log("Result scene:");
				console.log(result.scene);
				sceneModels.push({scene: result.scene, id: model.path, originalScale: result.scene.scal});
				scene.add(result.scene);
			});
		}
	});
}
