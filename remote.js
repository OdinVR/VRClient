var server = "http://52.14.34.73:6606";

var sio = io.connect(server);

var viewPlaced = false;

console.log("Window Hash: " + window.location.hash.substring(1, window.location.hash.length));

var roomnum = parseInt(window.location.hash.substring(1, window.location.hash.length));

sio.emit("room",{room: roomnum});

sio.on("update",function(data) {
	/*console.log("The socket has spoken");
	console.log(data);
	if(viewPlaced == false) {
		renderInBody();
		viewPlaced = true;
	}
	receiveSceneData(data);*/

});

function getModelPathFromServer(directory) {
	return "/models/" + directory + "/model.dae";
}
