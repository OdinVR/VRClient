var server = "http://localhost:6606";

var sio = io.connect(server);

var viewPlaced = false;

sio.on('accessResponse',function(data){
	console.log("Access reponse",data);
	if(!data.error) {
		console.log(data);
		callback();
		if(viewPlaced == false) {
			renderInBody();
			viewPlaced = true;
		}
		receiveSceneData(data);
	} else {
		alert(data.error);
	}
});

sio.on("update",function(data) {
	console.log("The socket has spoken");
	console.log(data);
	if(viewPlaced == false) {
		renderInBody();
		viewPlaced = true;
	}
	receiveSceneData(data);
});

function connectToRoom(roomStr,callback) {
	sio.emit("room",{room: roomStr});

	
}

function getModelPathFromServer(directory) {
	//return "/models/" + directory + "/model.dae";
	return 'https://odinvr.s3.us-east-2.amazonaws.com/public/models/' + directory + '/model.dae';
}
