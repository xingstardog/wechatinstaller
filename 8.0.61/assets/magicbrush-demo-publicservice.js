const API_PREFIX = 'api:';
const API_PREFIX_LEN = API_PREFIX.length;

console.info('Hello, Public Service!');

const bizMap = {};

mb.onBizConnected = (biz) => {
    bizMap[biz.bizName] = biz;
    biz.onmessage = (msg) => {
        onmessage(biz.bizName, msg);
    }
}

mb.onBizDisconnected = (biz) => {
    bizMap[biz.bizName] = undefined;
}

function onmessage(biz, obj) {
    console.log(`${biz}: ${obj.data}`);
    const msg = obj.data;
    if (msg.indexOf(API_PREFIX) === 0) {
        const apiSegment = msg.substr(API_PREFIX_LEN);
        const apiName = msg.substring(API_PREFIX_LEN, msg.indexOf(':', API_PREFIX_LEN));
        const apiArgs = msg.substr(msg.indexOf(':', API_PREFIX_LEN) + 1);
        
        // TODO: refactor
        if (apiName === 'createCanvas') {
            try {
                const args = JSON.parse(apiArgs);
                createCanvas(args);
            } catch(e) {
                console.error(e);
            }
        }
    }
}

class Game2D {
    constructor(glCanvas) {
        this.glCanvas = glCanvas;
        let func = (event) => {
            if (event.type == "ontouchend") {
                this.glCanvas.remove();
                this.glCanvas = undefined;
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
        this.gl.fillStyle = "black";
        this.gl.font = "20px serif"
        this.gl.fillText('Hello MagicBrush2.0!', 75, this.glCanvas.height / 2 + 5);
        this.gl.drawImage(this.img, 10, this.glCanvas.height / 2 - 25, 50, 50)
        
        requestAnimationFrame((currentTime) => {
            this.animateScene();
        });
    }
}

function createCanvas(args) {
    const canvas = new mb.ScreenCanvas();
    canvas.style.width = args.width; //add for android
    canvas.style.height = args.height;
    canvas.width = args.width;
    canvas.height = args.height;
    canvas.style.left = args.left;
    canvas.style.top = args.top;
    
    new Game2D(canvas).startup();
}
