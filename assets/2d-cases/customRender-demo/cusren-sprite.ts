
const { ccclass, property } = cc._decorator;

@ccclass
export default class CusRenSprite extends cc.RenderComponent {

    private _assembler = null;  // 顶点数据装配器
    private _spriteMaterial = null; // 材质
    private _uv = [];    // 纹理 uv 数据

    @property(cc.Texture2D)
    private _texture: cc.Texture2D = null;  // 渲染组件使用的 Texture
    @property(cc.Texture2D)
    get texture() {
        return this._texture;
    }
    set texture(value) {
        this._texture = value;
    }
}