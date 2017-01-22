var server = "http://52.14.34.73:6606";

var sio = io.connect(server);

var viewPlaced = false;

function connectToRoom(roomStr) {
	var roomNum = parseInt(roomStr);
	sio.emit("room",{room: roomnum});

	sio.on("update",function(data) {
		console.log("The socket has spoken");
		console.log(data);
		if(viewPlaced == false) {
			renderInBody();
			viewPlaced = true;
		}
		receiveSceneData(data);
	
	});
}



function getModelPathFromServer(directory) {
	return "/models/" + directory + "/model.dae";
}
