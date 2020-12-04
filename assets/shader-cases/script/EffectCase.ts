const { ccclass, property } = cc._decorator;

@ccclass
export default class EffectCase extends cc.Component {

    timer: number = 0;
    timer_r: number = 0;
    streamers: cc.MaterialVariant[] = [];
    rollUvs: cc.MaterialVariant[] = [];

    onLoad() {
        const layout = cc.find("Canvas/layout");
        const streamer = cc.find("streamer", layout);
        const oldPhoto = cc.find("oldPhoto", layout);
        const gray = cc.find("gray", layout);
        const rollUv = cc.find("rollUv", layout);

        this.setProperty(streamer, "light", [0.5, 0.5], this.streamers);
        this.setProperty(oldPhoto, "oldLev", 1.0);
        this.setProperty(gray, "grayLev", 1.0);
        this.setProperty(rollUv, "timer", 0.5, this.rollUvs);
    }

    setProperty(node: cc.Node, key: string, value: any, mats?: cc.MaterialVariant[]) {
        const renders = node.getComponentsInChildren(cc.RenderComponent);
        for (let g = 0; g < renders.length; g++) {
            const render = renders[g];
            const material = render.getMaterial(0);
            material.setProperty(key, value);
            if (mats) mats.push(material);
        }
    }

    update(dt) {
        this.timer += dt;
        this.timer_r += dt;
        if (this.timer_r >= 3) this.timer_r = 0;

        if (this.streamers && this.streamers.length) {
            for (let g = 0; g < this.streamers.length; g++) {
                const streamer = this.streamers[g];
                streamer.setProperty("light", [this.timer_r / 2, this.timer_r / 2]);
            }
        }
        if (this.rollUvs && this.rollUvs.length) {
            for (let g = 0; g < this.rollUvs.length; g++) {
                const rollUv = this.rollUvs[g];
                rollUv.setProperty("timer", this.timer / 5);
            }
        }
    }
}
