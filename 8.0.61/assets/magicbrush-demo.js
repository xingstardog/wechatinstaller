class Game {
    constructor(glCanvas) {
        this.glCanvas = glCanvas;
        let func = (event) => {
            if (event.type == "ontouchend") {
                let touch = event.changedTouches[0];
                console.log(
                            `recv event: ${touch.clientX} ${touch.clientY} ${touch.target.id} ${glCanvas.id}`,
                            event
                            );
               let result = mb.JSBridge.invoke("readFileSync", { path: "some/path" });
               let str = String.fromCharCode.apply(null, new Uint8Array(result.data));
                mb.JSBridge.invoke("showToast", {
                //wording: `${str}\nsystemVersion:${deviceInfo.systemVersion}`,
                //wording: `${str}\n canvasId:${glCanvas.id}`,
                //wording: `canvasId:${glCanvas.id}`,
                wording: `${str}\n`,
                });
            }
        };
        glCanvas.ontouchstart = glCanvas.ontouchmove = glCanvas.ontouchend = func;
        this.currentRotation = [0, 1];
        this.currentScale = [1.0, 1.0];
        this.previousTime = 0.0;
        this.degreesPerSecond = 180.0;
    }

    startup() {
        this.gl = this.glCanvas.getContext("webgl");
        let gl = this.gl;
        console.log(this.glCanvas, this.gl);

        const shaderSet = [
            {
            type: gl.VERTEX_SHADER,
            source: `
      attribute vec2 aVertexPosition;

      uniform vec2 uScalingFactor;
      uniform vec2 uRotationVector;

      void main() {
        vec2 rotatedPosition = vec2(
          aVertexPosition.x * uRotationVector.y +
                aVertexPosition.y * uRotationVector.x,
          aVertexPosition.y * uRotationVector.y -
                aVertexPosition.x * uRotationVector.x
      );

        gl_Position = vec4(rotatedPosition * uScalingFactor, 0.0, 1.0);
      }`,
            },
            {
            type: gl.FRAGMENT_SHADER,
            source: `
      #ifdef GL_ES
      precision highp float;
      #endif

      uniform vec4 uGlobalColor;

      void main() {
        gl_FragColor = uGlobalColor;
      }`,
            },
        ];

        this.shaderProgram = this.buildShaderProgram(shaderSet);

        this.aspectRatio = this.glCanvas.width / this.glCanvas.height;
        this.currentRotation = [0, 1];
        this.currentScale = [1.0 / 2, this.aspectRatio / 2];

        this.vertexArray = new Float32Array([
            -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5,
        ]);
        this.vertexIndexArray = new Uint16Array([0, 1, 2, 1, 3, 2]);

        this.vertexBuffer = this.gl.createBuffer();
        this.vertexIndexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(
                           this.gl.ARRAY_BUFFER,
                           this.vertexArray,
                           this.gl.STATIC_DRAW
                           );

        this.vertexNumComponents = 2;
        this.vertexCount = this.vertexArray.length / this.vertexNumComponents;

        this.currentAngle = 0.0;
        this.rotationRate = 6;
        this.color1 = [Math.random(), Math.random(), Math.random(), 1.0];
        this.color2 = [Math.random(), Math.random(), Math.random(), 1.0];

        this.animateScene();
    }

    buildShaderProgram(shaderInfo) {
        let gl = this.gl;
        let program = gl.createProgram();

        shaderInfo.forEach((desc) => {
            let shader = this.compileShader(desc.source, desc.type);

            if (shader) {
                this.gl.attachShader(program, shader);
            }
        });

        this.gl.linkProgram(program);

        this.uScalingFactor = gl.getUniformLocation(program, "uScalingFactor");
        this.uGlobalColor = gl.getUniformLocation(program, "uGlobalColor");
        this.uRotationVector = gl.getUniformLocation(program, "uRotationVector");
        this.aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.log("Error linking shader program:");
            console.log(gl.getProgramInfoLog(program));
        }

        return program;
    }
    compileShader(source, type) {
        let gl = this.gl;
        let code = source;
        let shader = gl.createShader(type);

        gl.shaderSource(shader, code);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.log(
        `Error compiling ${
          type === gl.VERTEX_SHADER ? "vertex" : "fragment"
        } shader:`
                        );
            console.log(gl.getShaderInfoLog(shader));
        }
        return shader;
    }
    animateScene() {
        let gl = this.gl;
        gl.viewport(0, 0, this.glCanvas.width, this.glCanvas.height);
        gl.clearColor(this.color1[0], this.color1[1], this.color1[2], this.color1[3]);
        gl.clear(gl.COLOR_BUFFER_BIT);

        let radians = (this.currentAngle * Math.PI) / 180.0;
        this.currentRotation[0] = Math.sin(radians);
        this.currentRotation[1] = Math.cos(radians);

        gl.useProgram(this.shaderProgram);

        gl.uniform2fv(this.uScalingFactor, this.currentScale);
        gl.uniform2fv(this.uRotationVector, this.currentRotation);
        gl.uniform4fv(this.uGlobalColor, this.color2);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

        gl.enableVertexAttribArray(this.aVertexPosition);
        gl.vertexAttribPointer(
                               this.aVertexPosition,
                               this.vertexNumComponents,
                               gl.FLOAT,
                               false,
                               0,
                               0
                               );

        gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);

        requestAnimationFrame((currentTime) => {
            let now = currentTime;

            let deltaAngle = ((now - this.previousTime) / 1000.0) * this.degreesPerSecond;

            this.currentAngle = (this.currentAngle + deltaAngle) % 360;

            this.previousTime = now;
            this.animateScene();
        });
    }
}

class Game2D {
    constructor(glCanvas) {
        this.glCanvas = glCanvas;
        let func = (event) => {
            if (event.type == "ontouchend") {
                let touch = event.changedTouches[0];
//                console.log(
//                            `recv event: ${touch.clientX} ${touch.clientY} ${touch.target.id} ${glCanvas.id}`,
//                            event
//                            ); //TODO
                let result = mb.JSBridge.invoke("readFileSync", { path: "some/path" });
                let str = String.fromCharCode.apply(null, new Uint8Array(result.data));
                mb.JSBridge.invoke("showToast", {
                //wording: `${str}\ncanvasId:${glCanvas.id}`, //TODO
                title: `${str}\n`,
                icon: 'success'
                });
//                mb.JSBridge.invoke("showModal", {
//                                        title: 'test',
//                                        content: 'content',
//                                        confirmText: 'confirmText',
//                                        cancelText: 'cancelText',
//                                        showCancel:'true',
//                                        confirmColor: '#576B95',
//                                        cancelColor: '#576B95'
//                                        });
            }
        };
        glCanvas.ontouchstart = glCanvas.ontouchmove = glCanvas.ontouchend = func;
    }

    startup() {
        this.gl = this.glCanvas.getContext("2d", {alpha : true});
        console.log(this.glCanvas, this.gl);
        this.img = new Image();
        this.img.src = 'https://mat1.gtimg.com/www/icon/favicon2.ico';

        this.animateScene();
    }

    animateScene() {
        this.gl.clearRect(0, 0, this.glCanvas.width, this.glCanvas.height);
        this.gl.fillStyle = "white";
        this.gl.font = "20px serif"
        this.gl.fillText('Hello MagicBrush2.0!', 75, this.glCanvas.height / 2 + 5);
        this.gl.drawImage(this.img, 10, this.glCanvas.height / 2 - 25, 50, 50)

        requestAnimationFrame((currentTime) => {
            this.animateScene();
        });
    }
}

function createCanvas(width, height, left, top) {
    let result = new mb.ScreenCanvas();
    result.width = width;
    result.height = height;
    result.style.left = left;
    result.style.top = top;
    result.style.width = width;
    result.style.height = height;
    new Game(result).startup();
    let result2 = new mb.ScreenCanvas();
    result2.width = width;
    result2.height = height;
    result2.style.left = left;
    result2.style.top = top;
    result2.style.width = width;
    result2.style.height = height;
    new Game2D(result2).startup();
}

const WeApp = this.document == undefined;
if (WeApp) {
    mb.JSBridge.on('createCanvas', (params) => {
        createCanvas(params.width, params.height, params.left, params.top);
    });
}
function startup() {
    new Game(document.getElementById("canvas")).startup();
    new Game2D(document.getElementById("canvas2")).startup()
}
if (!WeApp) {
    startup();
}
