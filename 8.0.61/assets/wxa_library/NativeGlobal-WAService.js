// below for WebGL component
(function(){
let viewIdTransfer = MagicBrushViewIdTransfer;
let findElementById = NativeGlobal.findElementById;
NativeGlobal.findElementById = function(viewId) {
if (typeof viewIdTransfer === 'undefined') {
    console.error("HTMLCanvasElement ViewId Transfer not found.");
}
return findElementById(viewIdTransfer.exec(viewId));
}
})();
MagicBrushViewIdTransfer = undefined;
