var server = "http://52.14.34.73:6606";

var sio = io.connect(server);

console.log("Window Hash: " + window.location.hash);

sio.emit("room",{room: 14368});

sio.on("update",function(data) {
	console.log(data);
});

function getModelPathFromServer(directory) {
	return "models/" + directory + "/model.dae";
}
