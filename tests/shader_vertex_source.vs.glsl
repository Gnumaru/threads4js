attribute vec2 position; //the position of the point
attribute vec3 color;  //the color of the point
varying vec3 vColor;

void main(void) { //pre-built function
	gl_Position = vec4(position, 0., 1.); //0. is the z, and 1 is w
	vColor=color;
}