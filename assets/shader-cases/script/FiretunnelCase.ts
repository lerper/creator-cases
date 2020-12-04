
const { ccclass, property } = cc._decorator;

@ccclass
export default class Params extends cc.Component {

    @property(cc.RenderComponent)
    fire: cc.RenderComponent = null;
    private fireMat: cc.MaterialVariant = null;

    onLoad() {
        this.fireMat = this.fire.getMaterial(0);
    }

    start() {
        const size = cc.view.getFrameSize();
        if (this.fireMat) this.fireMat.setProperty("resolution", [size.width, size.height]);
    }

    update(dt) { }
}
