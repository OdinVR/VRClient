function loadDAE(url,callback) {

  var coloader = new THREE.ColladaLoader();

  coloader.load(url, function (result) {
    callback(result);
  });

}

function modelSizeBox(scene) {
	var box = new THREE.Box3().setFromObject(scene);
	console.log("size box");
	console.log(box.size());
	return box;
}

function addSceneLight(scene,color) {
	scene.add( new THREE.AmbientLight( 0xcccccc ) );
	/*
	var directionalLight = new THREE.DirectionalLight( 0xeeeeee );
	directionalLight.position.x = Math.random() - 0.5;
	directionalLight.position.y = Math.random() - 0.5;
	directionalLight.position.z = Math.random() - 0.5;
	directionalLight.position.normalize();
	scene.add( directionalLight );
	*/
}

function addSkybox() {
	
}

function scaleModel(model,multiplier) {
	model.scale.x *= multiplier;
	model.scale.y *= multiplier;
	model.scale.z *= multiplier;
}


function placeModelInFrontOfCamera(model) {
	var box = modelSizeBox(model)
	var size = box.getSize();
	var sizetotal = (size.x + size.y + size.z) / 3;
	var zdisplacement = 2 * sizetotal;
	model.position.z = -zdisplacement;
}

var modelsToRotate = [];

function startSpin(model,x,y,z) {
	var rotation = {model: model, x: x, y: y, z: z};
	modelsToRotate.push(rotation);
}

function spinLoop(delta) {
	modelsToRotate.forEach(function(rotation) {
		var model = rotation.model;
		
		model.rotation.set(model.rotation.x + (rotation.x * delta * 0.0006),model.rotation.y + (rotation.y * delta * 0.0006), model.rotation.z + (rotation.z * delta * 0.0006), 'XYZ');
		//rotateAroundWorldAxis(model, new THREE.Vector3(0,1,0), model.rotation.y + delta * 0.0006);
		//rotateAroundWorldAxis( model,new THREE.Vector3(0, 1, 0), model.rotation.y + delta * 0.0006 );
	});
}

function stopSpin(model) {
	modelsToRotate.forEach(function(rotation) {
		if(rotation.model == model) {
			var index = modelsToRotate.indexOf(rotation);
			modelsToRotate = modelsToRotate.splice(index, 1);
		}
	});
	
}

var rotWorldMatrix;      
function rotateAroundWorldAxis( object, axis, radians ) {
    rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
    rotWorldMatrix.multiply(object.matrix);        // pre-multiply
    object.matrix = rotWorldMatrix;
    object.rotation.setEulerFromRotationMatrix(object.matrix, object.order);
} 