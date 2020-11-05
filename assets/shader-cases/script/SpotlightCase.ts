import CommonUtil from "../../main/script/CommonUtil";
import VecMath from "../../main/script/VecMath";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SpotlightCase extends cc.Component {

    @property(cc.Node)
    bg: cc.Node = null;

    touchDis: number = 0;

    v2: cc.Vec2 = cc.v2();
    move: cc.Vec2 = cc.v2();

    onLoad() {
        let onBgTouched = (event: cc.Event.EventTouch) => {
            //this.touchDis += event.getDelta().len();
            let worldPos = event.getLocation();
            let nodePos = this.bg.convertToNodeSpaceAR(worldPos);
            this.updateMat(nodePos);
        }
        // this.bg.on(cc.Node.EventType.TOUCH_START, onBgTouched, this);
        // this.bg.on(cc.Node.EventType.TOUCH_MOVE, onBgTouched, this);

        const degree = CommonUtil.randInt(20, 70);
        const radian = cc.misc.degreesToRadians(degree);
        this.v2 = VecMath.radToV2(radian);
        this.v2.multiplyScalar(0.003);
    }

    updateMat(pos: cc.Vec2, _spot?: cc.Vec2) {
        // 将触摸点转换为OpenGL坐标系并归一化
        // OpenGl坐标系原点在左上角
        let spot = cc.v2(
            this.bg.anchorX + pos.x / this.bg.width,
            1 - (this.bg.anchorY + pos.y / this.bg.height)
        );
        if (_spot) spot = _spot;
        let render = this.bg.getComponent(cc.RenderComponent);
        let matrial = render.getMaterial(0);
        matrial.setProperty("spot", spot);
    }

    update(dt) {
        let move = this.move.add(this.v2);
        let spot = this.move.lerp(move, dt * 10);
        this.updateMat(cc.v2(), spot);
        this.move = move;
        if(this.move.x <= 0 || this.move.x >= 1) this.v2.x = -this.v2.x;
        if(this.move.y <= 0 || this.move.y >= 1) this.v2.y = -this.v2.y;
    }
}
