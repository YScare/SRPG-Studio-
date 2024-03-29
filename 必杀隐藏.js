/**
 * 作者：千影衣
 * 与必杀有关的显示全部隐藏
 * 商用OK，无需署名
 */
(function(){
    //战斗预测窗口
    StatusRenderer.drawAttackStatus = function(x, y, arr, color, font, space) {
		var i, text;
		var length = this._getTextLength();
		var numberSpace = DefineControl.getNumberSpace();
		var buf = ['attack_capacity', 'hit_capacity'];
		
		for (i = 0; i < 2; i++) {
			text = root.queryCommand(buf[i]);
			TextRenderer.drawKeywordText(x, y, text, length, color, font);
			x += 28 + numberSpace;
			
			if (arr[i] >= 0) {
				NumberRenderer.drawNumber(x, y, arr[i]);
			}
			else {
				TextRenderer.drawSignText(x - 5, y, StringTable.SignWord_Limitless);
			}
			
			x += space;
		}	
	}
    //侧边栏属性
    UnitSentenceWindow._configureSentence = function(groupArray) {
		groupArray.appendObject(UnitSentence.Power);
		groupArray.appendObject(UnitSentence.Hit);
		groupArray.appendObject(UnitSentence.Avoid);
		groupArray.appendObject(UnitSentence.Range);
		if (DataConfig.isItemWeightDisplayable()) {
			groupArray.appendObject(UnitSentence.Agility);
		}
		groupArray.appendObject(UnitSentence.Fusion);
		groupArray.appendObject(UnitSentence.State);
		groupArray.appendObject(UnitSentence.Support);
	}
	//武器的必杀隐藏
	ItemSentence.CriticalAndRange.drawItemSentence = function(x, y, item) {
		var text;
		text = root.queryCommand('range_capacity');
		ItemInfoRenderer.drawKeyword(x, y, text);
		x += ItemInfoRenderer.getSpaceX();
		this._drawRange(x, y, item);
	}
})();