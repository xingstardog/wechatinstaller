console.info("Hello, Magic Brush Demo!");

const ps = new mb.PublicService("MBDemoService");
ps.onmessage = (msg) => {
    console.log(`service: ${msg.data}`);
}

mb.JSBridge.on("postMessage", (data) => {
    console.log(data);
    ps.postMessage(data.msg);
});
