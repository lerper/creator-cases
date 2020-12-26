
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    start() {
        const tip = new cc.Node("tip");
        tip.parent = this.node;
        tip.setAnchorPoint(1, 0);
        tip.position = cc.v3(cc.winSize.width / 2 - 5, -cc.winSize.height / 2, 0);
        tip.opacity = 150;
        const label = tip.addComponent(cc.Label);
        label.string = "点击任意位置关闭";
        label.lineHeight = 32;
        label.fontSize = 30;
        label.fontFamily = "宋体";

        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            cc.director.loadScene("main");
        })
    }
}
