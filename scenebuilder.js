
var sceneData = {
	models: [{path: "jupiter.dae", posx: 0, posy: 0, posz: 0, scale: 1, rotx: -Math.PI / 2, roty: 0, rotz: 0, spin: true, spinaxis: 'Z'}],
	skybox: "grid",
	skyboxSize: 25,
	skyboxPos: 12.5,
	cameraHeight: 1.5,
}

var sceneModels = [];

function renderInBody() {
	document.body.innerHTML = "";
	renderer.setPixelRatio(window.devicePixelRatio);
	createBaseScene();
	document.body.appendChild(renderer.domElement);
}

function buildInitialScene(data) {
	setSkyboxStage(scene,sceneData.skybox,sceneData.skyboxPos);
	var models = sceneData.models;
	placeModels(models);
}

function findModelInScene(path) {
	for(var i=0;i<sceneModels.length;i++) {
		var model = sceneModels[i];
		if(model.path === path) {
			return model.scene;
		}
	}
	return null;
}

function placeModels(models) {
	models.forEach(function(model) {
		var modelInScene = findModelInScene(model.path);
		if(modelInScene != null) {
			//update parameters, already in scene
			modelInScene.position.x = model.posx;
			modelInScene.position.y = model.posy;
			modelInScene.position.z = model.posz;
			modelInScene.rotateX(model.rotx);
			modelInScene.rotateY(model.roty);
			modelInScene.rotateZ(model.rotz);
			if(model.spin === true) {
				if(model.spinaxis == 'X') {
					startSpin(modelInScene,1,0,0);
				} else if(model.spinaxis == 'Y') {
					startSpin(modelInScene,0,1,0);
				} else if(model.spinaxis == 'Z') {
					startSpin(modelInScene,0,0,1);
				}
			}
			scaleModel(modelInScene,model.scale);
			
		} else {
			loadDAE(model.path,function(result) {
				if(model.posx == 0 && model.posy == 0 && model.posz == 0) {
					placeModelInFrontOfCamera(result.scene);
				} else {
					result.scene.position.x = model.posx;
					result.scene.position.y = model.posy;
					result.scene.position.z = model.posz;
				}
				result.scene.rotateX(model.rotx);
				result.scene.rotateY(model.roty);
				result.scene.rotateZ(model.rotz);
				console.log("scene uuid: " + result.scene.uuid);
				stopSpin(result.scene);
				if(model.spin === true) {
					if(model.spinaxis == 'X') {
						startSpin(result.scene,1,0,0);
					} else if(model.spinaxis == 'Y') {
						startSpin(result.scene,0,1,0);
					} else if(model.spinaxis == 'Z') {
						startSpin(result.scene,0,0,1);
					}
				}
				scaleModel(result.scene,model.scale);
				console.log("Result scene:");
				console.log(result.scene);
				sceneModels.push({scene: result.scene, id: model.path});
				scene.add(result.scene);
			});
		}
	});
}

function updateScene() {
	if(sceneData) {
		
	}
}