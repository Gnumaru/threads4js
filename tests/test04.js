xmlhttp = new XMLHttpRequest();
var retrieveRemoteFileContent = function(filePath) {
	var responseText = null;
	console.log("Retrieving \"" + filePath + "\" through XMLHttpRequest.");
	//forces synchronous retrieval with third parameter set to false
	xmlhttp.open("GET", filePath, false);
	try {
		xmlhttp.send();
		responseText = xmlhttp.responseText;
	} catch (err) {
		var errorMessage = "Error trying to request \"" + filePath + "\".\r\nJavascript engine's error message:\r\n==========\r\n" + err.message + "\r\n==========\r\n";
		if(err.message.indexOf("Access to restricted URI denied") !== -1) {
			errorMessage += "Probably the referenced file is mispelled or doesn't exist.";
		}
		throw new Error(errorMessage);
	}
	return responseText;
}


function getGLContext(CANVAS){
	var GL;
	try {
		GL = CANVAS.getContext("experimental-webgl", {
			antialias : true
		});
	} catch (e) {
		throw("You are not webgl compatible :("+e);
	}
	return GL;
}

function get_shader(source, type, typeString, GL) {
	var shader = GL.createShader(type);
	GL.shaderSource(shader, source);
	GL.compileShader(shader);
	if(!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
		alert("ERROR IN " + typeString + " SHADER : " + GL.getShaderInfoLog(shader));
		return false;
	}
	return shader;
};

var main = function() {

	var CANVAS = document.getElementById("your_canvas");

	CANVAS.width = window.innerWidth;
	CANVAS.height = window.innerHeight;

	/* ========================= GET WEBGL CONTEXT ========================= */
	var GL = getGLContext(CANVAS);

	/* ========================= SHADERS ========================= */
	/* jshint multistr: true */
	var shader_vertex_source = retrieveRemoteFileContent("./shader_vertex_source.vs.glsl");
	var shader_fragment_source = retrieveRemoteFileContent("./shader_fragment_source.fs.glsl");

	var shader_vertex = get_shader(shader_vertex_source, GL.VERTEX_SHADER, "VERTEX", GL);
	var shader_fragment = get_shader(shader_fragment_source, GL.FRAGMENT_SHADER, "FRAGMENT", GL);

	var SHADER_PROGRAM = GL.createProgram();
	GL.attachShader(SHADER_PROGRAM, shader_vertex);
	GL.attachShader(SHADER_PROGRAM, shader_fragment);

	GL.linkProgram(SHADER_PROGRAM);

	var _color = GL.getAttribLocation(SHADER_PROGRAM, "color");
	var _position = GL.getAttribLocation(SHADER_PROGRAM, "position");

	GL.enableVertexAttribArray(_color);
	GL.enableVertexAttribArray(_position);

	GL.useProgram(SHADER_PROGRAM);

	/* ========================= THE TRIANGLE ========================= */
	//POINTS :
	var triangle_vertex = [
							// first summit -> bottom left of the viewport
							-0.66, // X
							-0.66, // Y
							0, // R
							0, // G
							1, // B
							// bottom right of the viewport
							0.66,
							-0.66,
							1,
							1,
							0,
							// top right of the viewport
							0,
							0.66,
							1,
							0,
							0 ];

	var TRIANGLE_VERTEX = GL.createBuffer();
	GL.bindBuffer(GL.ARRAY_BUFFER, TRIANGLE_VERTEX);
	GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(triangle_vertex), GL.STATIC_DRAW);

	//FACES :
	var triangle_faces = [
							0,
							1,
							2 ];
	var TRIANGLE_FACES = GL.createBuffer();
	GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TRIANGLE_FACES);
	GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(triangle_faces), GL.STATIC_DRAW);

	/* ========================= DRAWING ========================= */
	GL.clearColor(0.0, 0.0, 0.0, 0.0);

	var animate = function() {

		GL.viewport(0.0, 0.0, CANVAS.width, CANVAS.height);
		GL.clear(GL.COLOR_BUFFER_BIT);

		GL.bindBuffer(GL.ARRAY_BUFFER, TRIANGLE_VERTEX);

		GL.vertexAttribPointer(_position, 2, GL.FLOAT, false, 4 * (2 + 3), 0);
		GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 4 * (2 + 3), 2 * 4);

		GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TRIANGLE_FACES);
		GL.drawElements(GL.TRIANGLES, 3, GL.UNSIGNED_SHORT, 0);
		GL.flush();

		window.requestAnimationFrame(animate);
	};

	animate();
};
