import List from "./main/script/component/List";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {

    @property(List)
    mainList: List = null;
    @property(sp.Skeleton)
    touch: sp.Skeleton = null;

    cases: Array<{ title: string, items: string[] }> = null;

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            const nodePos = this.node.convertToNodeSpaceAR(event.getLocation());
            this.touch.node.position = cc.v3(nodePos.x, nodePos.y, 0);
            this.touch && this.touch.setAnimation(0, "action", false);
        }, this, true);
    }

    start() {
        const cases = [
            {
                title: "2d-cases",
                items: ["three.js-demo", "RigidBody-demo", "PeekCard-mask"]
            },
            {
                title: "3d-cases",
                items: ["ParticleCase"]
            },
            {
                title: "shader-cases",
                items: [
                    "EffectCase", "SpotlightCase", "WaveCase", "WavelightCase", "FiretunnelCase",
                    "MechaspaceCase"
                ]
            }
        ];
        this.cases = cases;

        this.mainList.numItems = cases.length;
    }

    onMainListRender(item: cc.Node, index: number) {
        const _case = this.cases[index];
        const title = item.getChildByName("title").getComponent(cc.Label);
        const list = item.getChildByName("scrollView").getComponent(List);
        title.string = _case.title;
        list.numItems = _case.items.length;
        list.node["_case_data"] = _case.items;
    }

    onItemListRender(item: cc.Node, index: number) {
        const _case: string[] = item.parent.parent.parent["_case_data"];
        const title = item.getChildByName("title").getComponent(cc.Label);
        if (_case && _case[index]) title.string = _case[index];
    }

    onItemClick(event: cc.Event.EventTouch) {
        const target: cc.Node = event.target;
        const str = target.getChildByName("title").getComponent(cc.Label).string;
        if (str && str != "敬请期待") cc.director.loadScene(str);
    }
}
