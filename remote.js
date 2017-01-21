var server = "http://buyweedfrom.me:6606";

var socket = io.connect(server);

function getModelPathFromServer(directory) {
	return "/models/" + directory + "/model.dae";
}

