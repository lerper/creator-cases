import PeekCard from "./prefab/PeekCard";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(PeekCard)
    peekCard: PeekCard = null;
    @property(cc.SpriteFrame)
    back: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    card: cc.SpriteFrame = null;

    start() {

        this.peekCard.setContentSize(cc.size(270, 390));
        this.peekCard.setCardSize(cc.size(270, 390))
        this.peekCard.setCardBack(this.back);
        this.peekCard.setCardFace(this.card);
        //this.peekCard.setShadow("");
        //this.peekCard.setFinger("", 1);
        //this.peekCard.setFinger("", 2);
        //this.peekCard._directionLength = 20;
        //this.peekCard._moveSpeed = 0.6;
        //this.peekCard.angleFixed = 15;
        this.peekCard.init();
    }
}
