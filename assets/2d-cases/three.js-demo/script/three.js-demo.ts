// @ts-ignore
const THREE = require("three"), TWEENMAX = require("TweenMax");
const { ccclass, property } = cc._decorator;

const vertexShader = [
    "varying vec2 vUv;",
    "void main()",
    "{",
    "  vUv = uv;",
    "  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
    "  gl_Position = projectionMatrix * mvPosition;",
    "}"].join("");

const fragmentShader = [
    "uniform float r;",
    "uniform float g;",
    "uniform float b;",
    "uniform float distanceZ;",
    "uniform float distanceX;",
    "uniform float pulse;",
    "uniform float speed;",

    "varying vec2 vUv;",

    // "float checkerRows = 8.0;",
    // "float checkerCols = 16.0;",

    "void main( void ) {",
    "  vec2 position = abs(-1.0 + 2.0 * vUv);",
    "  float edging = abs((pow(position.y, 5.0) + pow(position.x, 5.0)) / 2.0);",
    "  float perc = (0.2 * pow(speed + 1.0, 2.0) + edging * 0.8) * distanceZ * distanceX;",

    // "  float perc = distanceX * distanceZ;",
    // "  vec2 checkPosition = vUv;",
    // "  float checkerX = ceil(mod(checkPosition.x, 1.0 / checkerCols) - 1.0 / checkerCols / 2.0);",
    // "  float checkerY = ceil(mod(checkPosition.y, 1.0 / checkerRows) - 1.0 / checkerRows / 2.0);",
    // "  float checker = ceil(checkerX * checkerY);",
    // "  float r = checker;",
    // "  float g = checker;",
    // "  float b = checker;",

    // "  float perc = 1.0;",
    "  float red = r * perc + pulse;",
    "  float green = g * perc + pulse;",
    "  float blue = b * perc + pulse;",
    "  gl_FragColor = vec4(red, green, blue, 1.0);",
    "}"].join("");

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    control: cc.Node = null;

    @property(cc.Texture2D)
    textureRender: cc.Texture2D = null;

    aGraphics: cc.Graphics = null;
    isMouseDown: boolean = false;
    clientX: number = 0;
    clientY: number = 0;

    onLoad() {
        this.aGraphics = this.control.getComponent(cc.Graphics);

        this.control.on(cc.Node.EventType.TOUCH_START, this.touchStart, this, true);
        this.control.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this, true);
        this.control.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this, true);
        this.control.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this, true);

        this.control.on(cc.Node.EventType.MOUSE_MOVE, this.mouseMove, this, true);
    }

    start() {
        this.clientX = 0;
        this.clientY = 0;

        this.test1();
    }

    onDestroy() {

    }

    touchStart() {
        this.isMouseDown = true;
    }
    touchMove(event: cc.Event.EventTouch) {
        this.clientX = event.getLocationX();
        this.clientY = event.getLocationY();
    }
    touchEnd() {
        this.isMouseDown = false;
    }
    mouseMove(event: cc.Event.EventMouse) {
        this.clientX = event.getLocationX();
        this.clientY = event.getLocationY();
    }

    test1() {
        const ref = this;

        let isMouseDown = false;
        let camera, scene, renderer;
        const emptySlot = "emptySlot", planeTop = "planeTop", planeBottom = "planeBottom";
        const mouse = { x: 0, y: 0 };
        const camPos = { x: 0, y: 0, z: 10 };

        let sw = this.node.width, sh = this.node.height;
        const cols = 50;
        const rows = 20;
        const gap = 20;
        // 方块的长宽高
        const size = {
            width: 100,
            height: 20,
            depth: 150,
        }
        // 空间高度
        const planeOffset = 300;
        const allRowsDepth = rows * (size.depth + gap);
        const allColsWidth = cols * (size.depth + gap);
        // 方块默认速度
        const speedNormal = 2;
        // 方块点击速度
        const speedFast = 50;
        let speed = speedNormal;
        const boxes = {
            planeBottom: [],
            planeTop: []
        };
        const boxes1d = [];

        function num(min, max) { return Math.random() * (max - min) + min; }
        function draw(props) {

            const colours = {
                slow: {
                    r: num(0, 0.2),
                    g: num(0.5, 0.9),
                    b: num(0.3, 0.7)
                },
                fast: {
                    r: num(0.9, 1.0),
                    g: num(0.1, 0.7),
                    b: num(0.2, 0.5)
                }
            }

            const uniforms = {
                r: { type: "f", value: colours.slow.r },
                g: { type: "f", value: colours.slow.g },
                b: { type: "f", value: colours.slow.b },
                distanceX: { type: "f", value: 1.0 },
                distanceZ: { type: "f", value: 1.0 },
                pulse: { type: "f", value: 0 },
                speed: { type: "f", value: speed },
            };

            const material = new THREE.ShaderMaterial({
                uniforms: uniforms,
                vertexShader: vertexShader,
                fragmentShader: fragmentShader
            });

            const geometry = new THREE.BoxGeometry(props.width, props.height, props.depth);
            const object = new THREE.Mesh(geometry, material);
            object.colours = colours;
            return object;
        }


        function init() {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(100, sw / sh, 1, 10000);
            scene.add(camera);
            renderer = new THREE.WebGLRenderer(cc.game.canvas);
            renderer.setSize(sw, sh);
            for (let j = 0, jl = rows; j < jl; j++) {
                boxes.planeBottom[j] = [];
                boxes.planeTop[j] = [];
                for (let i = 0, il = cols; i < il; i++) {
                    boxes.planeBottom[j][i] = emptySlot;
                    boxes.planeTop[j][i] = emptySlot;
                };
            };

            function createBox() {
                let xi = Math.floor(Math.random() * cols),
                    xai = xi;
                let yi = Math.random() > 0.5 ? 1 : -1,
                    yai = yi === -1 ? planeBottom : planeTop;
                let zi = Math.floor(Math.random() * rows),
                    zai = zi;
                let x = (xi - cols / 2) * (size.width + gap);
                let y = yi * planeOffset;
                let z = zi * (size.depth + gap);
                if (boxes[yai][zai][xai] === emptySlot) {
                    let box = draw(size);
                    box.position.y = y;
                    box.isWarping = false;
                    box.offset = {
                        x: x,
                        z: 0
                    };
                    box.posZ = z;
                    boxes[yai][zai][xai] = box;
                    boxes1d.push(box);
                    scene.add(box)
                }

            }
            for (let i = 0, il = rows * cols; i < il; i++) {
                createBox();
            };
            // document.body.appendChild(renderer.domElement);

            // function listen(eventNames, callback) {
            // 	for (let i = 0; i < eventNames.length; i++) {
            // 		window.addEventListener(eventNames[i], callback);
            // 	}
            // }
            // listen(["resize"], function (e) {
            // 	sw = window.innerWidth;
            // 	sh = window.innerHeight
            // 	camera.aspect = sw / sh;
            // 	camera.updateProjectionMatrix();
            // 	renderer.setSize(sw, sh);
            // });
            // listen(["mousedown", "touchstart"], function (e) {
            // 	e.preventDefault();
            // 	isMouseDown = true;
            // });
            // listen(["mousemove", "touchmove"], function (e) {
            // 	e.preventDefault();
            // 	if (e.changedTouches && e.changedTouches[0]) e = e.changedTouches[0];
            // 	mouse.x = (e.clientX / sw) * 2 - 1;
            // 	mouse.y = -(e.clientY / sh) * 2 + 1;
            // });
            // listen(["mouseup", "touchend"], function (e) {
            // 	e.preventDefault();
            // 	isMouseDown = false;
            // });
            render(0);
        }

        function move(x, y, z) {
            let box = boxes[y][z][x];

            if (box !== emptySlot) {

                box.position.x = box.offset.x;

                box.position.z = box.offset.z + box.posZ;

                if (box.position.z > 0) {
                    box.posZ -= allRowsDepth;
                }

                // return;
                // if (isMouseDown) return;
                if (!box.isWarping && Math.random() > 0.999) {

                    let dir = Math.floor(Math.random() * 5), xn = x, zn = z, yn = y, yi = 0, xo = 0, zo = 0;
                    switch (dir) {
                        case 0: xn++; xo = 1; break;
                        case 1: xn--; xo = -1; break;
                        case 2: zn++; zo = 1; break;
                        case 3: zn--; zo = -1; break;
                        case 4:
                            yn = (y === planeTop) ? planeBottom : planeTop;
                            yi = (y === planeTop) ? -1 : 1;

                            break;
                    }

                    if (boxes[yn][zn] && boxes[yn][zn][xn] === emptySlot) {

                        boxes[y][z][x] = emptySlot;

                        box.isWarping = true;

                        boxes[yn][zn][xn] = box;

                        // con.log( box.offset.x,  box.offset.z);

                        if (dir === 4) { // slide vertically
                            TWEENMAX.to(box.position, 0.5, {
                                y: yi * planeOffset
                            });
                        } else { // slide horizontally
                            TWEENMAX.to(box.offset, 0.5, {
                                x: box.offset.x + xo * (size.width + gap),
                                z: box.offset.z + zo * (size.depth + gap),
                            });
                        }
                        TWEENMAX.to(box.offset, 0.6, {
                            onComplete: function () {
                                box.isWarping = false;
                            }
                        });

                    }
                }

            }
        }

        function render(time) {
            if(!ref || !ref.node || !ref.textureRender) return;

            isMouseDown = ref.isMouseDown;
            mouse.x = (ref.clientX / sw) * 2 - 1;
            mouse.y = (ref.clientY / sh) * 2 - 1;

            speed -= (speed - (isMouseDown ? speedFast : speedNormal)) * 0.05;

            let box;
            for (let b = 0, bl = boxes1d.length; b < bl; b++) {
                box = boxes1d[b];
                box.posZ += speed;

                // normalized z distance from camera
                let distanceZ = 1 - ((allRowsDepth - box.posZ) / (allRowsDepth) - 1);
                box.material.uniforms.distanceZ.value = distanceZ;

                // normalized x distance from camera (centre)
                let distanceX = 1 - (Math.abs(box.position.x)) / (allColsWidth / 3);
                box.material.uniforms.distanceX.value = distanceX;

                let colour = isMouseDown ? box.colours.fast : box.colours.slow;
                box.material.uniforms.r.value -= (box.material.uniforms.r.value - colour.r) * 0.1;
                box.material.uniforms.g.value -= (box.material.uniforms.g.value - colour.g) * 0.1;
                box.material.uniforms.b.value -= (box.material.uniforms.b.value - colour.b) * 0.1;

                // normalized speed
                let currentSpeed = (speed - speedNormal) / (speedFast - speedNormal)
                box.material.uniforms.speed.value = currentSpeed;

                // pulses more with more speed... of course!
                if (Math.random() > (0.99995 - currentSpeed * 0.005)) {
                    box.material.uniforms.pulse.value = 1;
                }
                box.material.uniforms.pulse.value -= box.material.uniforms.pulse.value * 0.1 / (currentSpeed + 1);

                // if (b ==13) con.log(box.material.uniforms.speed.value);
            }

            for (let j = 0, jl = rows; j < jl; j++) { // iterate through rows: z
                for (let i = 0, il = cols; i < il; i++) { // iterate throw cols: x
                    move(i, planeBottom, j);
                    move(i, planeTop, j);
                };
            };

            camPos.x -= (camPos.x - mouse.x * 400) * 0.02;
            camPos.y -= (camPos.y - mouse.y * 150) * 0.05;
            camPos.z = -100;
            camera.position.set(camPos.x, camPos.y, camPos.z);

            // camera.lookAt( scene.position );

            // camera.rotation.z = time * 0.0001;
            camera.rotation.y = camPos.x / -1000;
            camera.rotation.x = camPos.y / 1000;
            // camera.rotation.z = camPos.x / -2000;
            camera.rotation.z = (camPos.x - mouse.x * 400) / 2000;

            renderer.render(scene, camera);

            // if (time < 800)
            requestAnimationFrame(render);

            ref.textureRender.initWithElement(renderer.domElement);
            ref.node.getComponent(cc.Sprite).spriteFrame.setTexture(ref.textureRender);
        }

        init();
    }
}
