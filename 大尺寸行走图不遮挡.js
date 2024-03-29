/**
 * ===========================================================
 * 插件名称；大尺寸行走图不遮挡
 * 作者；千影衣
 * ===========================================================
 * 使用环境；配合地图战斗插件使用。
 * 在ss中，行走图每一帧的尺寸是地图格子尺寸的两倍，所以我们有时会绘制一些出格的大型单位。
 * 然而在使用简易战斗时，如果你的角色尺寸超过了地图格子的尺寸，那么经常会出现战斗时人物图像被遮挡的情况。
 * 这个插件就是解决了这个问题。
 */
(function(){
    EasyBattle._drawArea=function(){
        var battler;
		var wof = this._battlerRight.getUnit();
		var dif = this._battlerLeft.getUnit();
		var y1 = wof.getMapY();
		var y2 = dif.getMapY();
		this._drawColor(EffectRangeType.MAP);
		battler = this.getActiveBattler();
		if(y1<y2){
			if (battler === this._battlerRight) {
				this._drawUnit(this._battlerRight);
				this._drawColor(EffectRangeType.MAPANDCHAR);
				this._drawUnit(this._battlerLeft);
				
			}
			else {
				this._drawUnit(this._battlerRight);
				this._drawColor(EffectRangeType.MAPANDCHAR);
				this._drawUnit(this._battlerLeft);
			}
		}
		if(y1>y2){
			if (battler === this._battlerRight) {
				this._drawUnit(this._battlerLeft);
				this._drawColor(EffectRangeType.MAPANDCHAR);
				this._drawUnit(this._battlerRight);
			}
			else {
				this._drawUnit(this._battlerLeft);
				this._drawColor(EffectRangeType.MAPANDCHAR);
				this._drawUnit(this._battlerRight);
			}
		}
		if(y1===y2){
			if (battler === this._battlerRight) {
				this._drawUnit(this._battlerLeft);
				this._drawColor(EffectRangeType.MAPANDCHAR);
				this._drawUnit(this._battlerRight);
			}
			else {
				this._drawUnit(this._battlerRight);
				this._drawColor(EffectRangeType.MAPANDCHAR);
				this._drawUnit(this._battlerLeft);
			}
		}
		
		
		this._drawColor(EffectRangeType.ALL);
		
		this._drawEffect();
    }
})();