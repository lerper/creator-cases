/**
 * 常用工具类
 */
export default class CommonUtil {
    /**
     * 获得一个[min, max]的随机数
     * @param min 
     * @param max 
     */
    public static randInt(min: number, max: number) {
        const rand = Math.floor(Math.random() * (max - min + 1) + min);
        return rand;
    }
}