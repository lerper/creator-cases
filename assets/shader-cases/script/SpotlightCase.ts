const { ccclass, property } = cc._decorator;

@ccclass
export default class SpotlightCase extends cc.Component {

    @property(cc.Node)
    bg: cc.Node = null;

    touchDis: number = 0;

    onLoad() {
        let onBgTouched = (event: cc.Event.EventTouch) => {
            //this.touchDis += event.getDelta().len();
            let worldPos = event.getLocation();
            let nodePos = this.bg.convertToNodeSpaceAR(worldPos);

            // 将触摸点转换为OpenGL坐标系并归一化
            // OpenGl坐标系原点在左上角
            let spot = cc.v2(
                this.bg.anchorX + nodePos.x / this.bg.width,
                1 - (this.bg.anchorY + nodePos.y / this.bg.height)
            );
            let render = this.bg.getComponent(cc.RenderComponent);
            let matrial = render.getMaterial(0);
            matrial.setProperty("spot", spot);
        }
        this.bg.on(cc.Node.EventType.TOUCH_START, onBgTouched, this);
        this.bg.on(cc.Node.EventType.TOUCH_MOVE, onBgTouched, this);
    }
}
