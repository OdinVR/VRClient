function startInteraction() {
	Reticulum.init(camera, {
		proximity: false,
		clickevents: true,
		reticle: {
			visible: true,
			restPoint: 10, //Defines the reticle's resting point when no object has been targeted
			color: 0xcc00cc,
			innerRadius: 0.0001,
			outerRadius: 0.003,
			hover: {
				color: 0x00cccc,
				innerRadius: 0.02,
				outerRadius: 0.024,
				speed: 5,
				vibrate: 50 //Set to 0 or [] to disable
			}
		},
		fuse: {
			visible: true,
			duration: 2.5,
			color: 0x00fff6,
			innerRadius: 0.045,
			outerRadius: 0.06,
			vibrate: 0, //Set to 0 or [] to disable
			clickCancelFuse: false //If users clicks on targeted object fuse is canceled
		}
	});
	scene.add(camera);
}

function testReticulum() {
	var boxGeometry = new THREE.BoxGeometry( 1, 1, 1 );
	for(var i = 0; i < 25; i++) {
		addMesh(boxGeometry);
	}

}

function addMesh(geo) {
	var object = new THREE.Mesh( geo, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
	
	object.position.x = Math.random() * 20 - 10;
	object.position.y = Math.random() * 20 - 10;
	object.position.z = Math.random() * 20 - 10;
	
	object.position.z = object.position.z > -1 && object.position.z < 1 ? Math.abs(object.position.z) + 2 : object.position.z;
	//object.rotation.y = Math.random() * 360;
	
	// *******************************
	// --- Reticulum ---
	// have the object react when user looks at it
	// track the object
	Reticulum.add( object, {
		onGazeOver: function(){
			// do something when user targets object
			//this.material.emissive.setHex( 0xffcc00 );
		},
		onGazeOut: function(){
			// do something when user moves reticle off targeted object
			//this.material.emissive.setHex( 0xcc0000 );
		},
		onGazeLong: function(){
			// do something user targetes object for specific time
			this.material.emissive.setHex( 0x0000cc );
		},
		onGazeClick: function(){
			// have the object react when user clicks / taps on targeted object
			//this.material.emissive.setHex( 0x00cccc * Math.random() );
		}
	});
	scene.add( object );
}

function poll(question) {
	
}