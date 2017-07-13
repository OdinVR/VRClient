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

var skybox;
var skyboxType;
var boxSize;
var skyBoxY;

function setSkyboxStage(scene,type,size,negypos) {
	scene.remove(skybox);
	if(type == "grid") {
		console.log("type grid");
		boxSize = size;
		skyBoxY = negypos;
		var loader = new THREE.TextureLoader();
		loader.load('/img/box.png', onTextureLoaded);
	}
	if(type == "milky") {
		loadSkysphere("/vr/skyboxes/milkyhd.jpg")
	}
	if(type == "fores") {
		loadSkysphere("/vr/skyboxes/forest.png")
	}
	if(type == "icela") {
		loadSkysphere("/vr/skyboxes/iceland.jpg")
	}
	if(type == "purdu") {
		loadSkysphere("/vr/skyboxes/purdue.jpg")
	}
	if(type == "sunset") {
		document.body.style.background = "linear-gradient(#de6161 , #2657eb)";
		//setupStage();
	}
}

function loadSkysphere(path,size) {
	var skyGeo = new THREE.SphereGeometry(size, 64, 64); 
	var texture = THREE.ImageUtils.loadTexture(path);
	var material = new THREE.MeshPhongMaterial({ 
       	map: texture, 
    });
    texture.wrapS = THREE.RepeatWrapping;
    material.map.repeat.x = -1;
	skybox = new THREE.Mesh(skyGeo, material);
    skybox.material.side = THREE.BackSide;
    scene.add(skybox);
}

function onTextureLoaded(texture) {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(boxSize, boxSize);

  var geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
  var material = new THREE.MeshBasicMaterial({
    map: texture,
    color: 0x01BE00,
    side: THREE.BackSide
  });
  // Align the skybox to the floor (which is at y=0).
  skybox = new THREE.Mesh(geometry, material);
  skybox.position.y = boxSize/2 - skyBoxY;
  scene.add(skybox);

  // For high end VR devices like Vive and Oculus, take into account the stage
  // parameters provided.*/

  //setupStage();
}

function createText(text,font,weight,style,size) {
	var textShapes = THREE.FontUtils.generateShapes( text, options );
var text = new THREE.ShapeGeometry( textShapes );
var textMesh = new THREE.Mesh( text, new THREE.MeshBasicMaterial( { color: 0xff0000 } ) ) ;
scene.add(textMesh);
}

function scaleModel(model,multiplier) {
	model.scale.x = multiplier * 0.0254;
	model.scale.y = multiplier * 0.0254;
	model.scale.z = multiplier * 0.0254;
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
	
	for(var i=0;i<modelsToRotate.length;i++) {
		var rotation = modelsToRotate[i];
		console.log("rotation stop:");
		console.log(rotation);
		if(rotation.model.uuid === model.uuid) {
			console.log("remove that sh!t");
			modelsToRotate.splice(i,1);
			console.log(modelsToRotate);
		}
	}
}

var rotWorldMatrix;      
function rotateAroundWorldAxis( object, axis, radians ) {
    rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
    rotWorldMatrix.multiply(object.matrix);        // pre-multiply
    object.matrix = rotWorldMatrix;
    object.rotation.setEulerFromRotationMatrix(object.matrix, object.order);
} 