if (!window.showFPS) {
    window.showFPS = (function () {
        var requestAnimationFrame =
            window.requestAnimationFrame || //Chromium
            window.webkitRequestAnimationFrame || //Webkit
            window.mozRequestAnimationFrame || //Mozilla Geko
            window.oRequestAnimationFrame || //Opera Presto
            window.msRequestAnimationFrame || //IE Trident?
            function (callback) { //Fallback function
                window.setTimeout(callback, 1000 / 60);
            };
        var e, pe, pid, fps, last, offset, step, appendFps, curSeconds;
        fps = 0;
        curSeconds = 0;
        last = Date.now();
        step = function () {
            offset = Date.now() - last;
            fps += 1;
            if (offset >= 1000) {
                last += offset;
                if (curSeconds % 3 == 0) {
                    addFpsElement();
                }
                ++curSeconds;
                appendFps(fps);
                fps = 0;
            }
            requestAnimationFrame(step);
        };

        addFpsElement = function () {
                var fpsview = document.getElementById("fpsview");
                if (!fpsview) {
                    var div = document.createElement('div');
                    div.innerHTML = "<div style=\"z-index: 9999; position: fixed ! important; right: 50px; top: 10px; font-size:36px\" id=\"fpsview\"> </div>";
                    document.body.appendChild(div);
                }
            }

        //显示fps;
        appendFps = function (fps) {
            if (!e) e = document.createElement('span');
            e.innerHTML = "fps: " + fps;
            if (!pe) {
                pe = document.getElementById("fpsview");
                if (pe) pe.appendChild(e);
            }
        };
        return {
            go: function () {
                step();
            }
        }
    })();

    console.log("show fps start");
    window.showFPS.go();
}