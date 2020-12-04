
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property
    is_debug: boolean = false;

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
        if (this.is_debug) {
            var Bits = cc.PhysicsManager.DrawBits;
            cc.director.getPhysicsManager().debugDrawFlags =
                Bits.e_jointBit |
                Bits.e_shapeBit;
        } else {
            cc.director.getPhysicsManager().debugDrawFlags = 0;
        }
    }
}
