
/**
 * 一些向量角度互转方法
 */
export default class VecMath {

    /**
     * vec2与x轴正向角度
     * @param vec 
     */
    public static v2toDeg(vec: cc.Vec2) {
        let comVec = cc.v2(1, 0);
        let radian = vec.signAngle(comVec);
        let degree = cc.misc.radiansToDegrees(radian);
        return degree;
    }

    /**
     * vec2与x轴正向弧度
     * @param vec 
     */
    public static v2toRad(vec: cc.Vec2) {
        let comVec = cc.v2(1, 0);
        let radian = vec.signAngle(comVec);
        return radian;
    }

    /**
     * 弧度转归一化向量
     * @param radian 
     */
    public static radToV2(radian: number) {
        let v2 = cc.v2();
        v2.x = Math.cos(radian);
        v2.y = Math.sin(radian);
        return v2;
    }
}