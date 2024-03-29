/**
 * ==================================
 * 对各类属性与设置进行隐藏
 * 作者：千影衣
 * ==================================
 * 
 */
(function(){

//人物属性显示，true显示，false隐藏。
var isPowDisp = true;//力量
var isMagDisp = true;//魔法
var isSkiDisp = true;//技巧
var isSpdDisp = true;//速度
var isLukDisp = true;//幸运
var isDefDisp = true;//防御
var isMdfDisp = true;//魔法防御
var isMovDisp = true;//移动力

//设置项目隐藏
var DISP_MusicPlay           = true;//音乐   
var DISP_SoundEffect         = true;//音效，以下以此类推，因为我也是一个一个推的，笑。      
var DISP_Voice               = true;    
var DISP_RealBattle          = true;    
var DISP_RealBattleScaling   = true; 
var DISP_AutoCursor          = true;    
var DISP_AutoTurnEnd         = true;    
var DISP_AutoTurnSkip        = true;    
var DISP_EnemyMarking        = true;    
var DISP_MapGrid             = true;    
var DISP_UnitSpeed           = true;   
var DISP_MessageSpeed        = true;    
var DISP_ScrollSpeed         = true;    
var DISP_UnitMenuStatus      = true;   
var DISP_MapUnitHpVisible    = true;  
var DISP_MapUnitSymbol       = true;    
var DISP_DamagePopup         = true;    
var DISP_LoadCommand         = true;    
var DISP_SkipControl         = true;    
var DISP_MouseOperation      = true;    
var DISP_MouseCursorTracking = true; 

//武器详情的显示，true显示。flase隐藏。
var DISP_AttackAndHit         = false;//武器的威力与命中隐藏
var DISP_CriticalAndRange     = true;//必杀与射程
var DISP_WeaponLevelAndWeight = true;
var DISP_AdditionState        = true;
var DISP_WeaponOption         = true;
var DISP_Effective            = true;
var DISP_ReverseWeapon        = true;
var DISP_Skill                = true;//武器技能
var DISP_Only                 = true;
var DISP_Bonus                = true;
//以下为本体脚本。

UnitParameter.POW.isParameterDisplayable= function(unitStatusType) {
    return isPowDisp;
}

UnitParameter.MAG.isParameterDisplayable= function(unitStatusType) {
    return isMagDisp;
}

UnitParameter.SKI.isParameterDisplayable= function(unitStatusType) {
    return isSkiDisp;
}

UnitParameter.SPD.isParameterDisplayable= function(unitStatusType) {
    return isSpdDisp;
}

UnitParameter.LUK.isParameterDisplayable= function(unitStatusType) {
    return isLukDisp;
}

UnitParameter.DEF.isParameterDisplayable= function(unitStatusType) {
    return isDefDisp;
}

UnitParameter.MDF.isParameterDisplayable= function(unitStatusType) {
    return isMdfDisp;
}

UnitParameter.MOV.isParameterDisplayable= function(unitStatusType) {
    return isMovDisp;
}


ItemInfoWindow._configureWeapon= function(groupArray) {
if(DISP_AttackAndHit)
groupArray.appendObject(ItemSentence.AttackAndHit);
if(DISP_CriticalAndRange)
groupArray.appendObject(ItemSentence.CriticalAndRange);
if(DISP_WeaponLevelAndWeight)
groupArray.appendObject(ItemSentence.WeaponLevelAndWeight);
if(DISP_AdditionState)
groupArray.appendObject(ItemSentence.AdditionState);
if(DISP_WeaponOption)
groupArray.appendObject(ItemSentence.WeaponOption);
if(DISP_Effective)
groupArray.appendObject(ItemSentence.Effective);
if(DISP_ReverseWeapon)
groupArray.appendObject(ItemSentence.ReverseWeapon);
if(DISP_Skill)
groupArray.appendObject(ItemSentence.Skill);
if(DISP_Only)
groupArray.appendObject(ItemSentence.Only);
if(DISP_Bonus)
groupArray.appendObject(ItemSentence.Bonus);
};


ConfigWindow._configureConfigItem = function(groupArray) {


    if(DISP_MusicPlay)
		groupArray.appendObject(ConfigItem.MusicPlay);      
        
    if(DISP_SoundEffect)
		groupArray.appendObject(ConfigItem.SoundEffect);   

    if(DISP_Voice){
		if (DataConfig.getVoiceCategoryName() !== '') {    
			groupArray.appendObject(ConfigItem.Voice);
		}
    }

    if (DataConfig.isMotionGraphicsEnabled()) {
	
        if(DISP_RealBattle) 
            groupArray.appendObject(ConfigItem.RealBattle);             

        if(DISP_RealBattleScaling){
			if (DataConfig.isHighResolution()) {
				groupArray.appendObject(ConfigItem.RealBattleScaling);  
			}
        }
	}

    if(DISP_AutoCursor)
		groupArray.appendObject(ConfigItem.AutoCursor);     

    if(DISP_AutoTurnEnd)
		groupArray.appendObject(ConfigItem.AutoTurnEnd);   

    if(DISP_AutoTurnSkip)
		groupArray.appendObject(ConfigItem.AutoTurnSkip);   

    if(DISP_EnemyMarking)
		groupArray.appendObject(ConfigItem.EnemyMarking);  

    if(DISP_MapGrid)
		groupArray.appendObject(ConfigItem.MapGrid);        

    if(DISP_UnitSpeed)
		groupArray.appendObject(ConfigItem.UnitSpeed);      

    if(DISP_MessageSpeed)
		groupArray.appendObject(ConfigItem.MessageSpeed);   

    if(DISP_ScrollSpeed)
		groupArray.appendObject(ConfigItem.ScrollSpeed);   

    if(DISP_UnitMenuStatus)
		groupArray.appendObject(ConfigItem.UnitMenuStatus);     

    if(DISP_MapUnitHpVisible)
		groupArray.appendObject(ConfigItem.MapUnitHpVisible);   

    if(DISP_MapUnitSymbol)
		groupArray.appendObject(ConfigItem.MapUnitSymbol); 

    if(DISP_DamagePopup)
		groupArray.appendObject(ConfigItem.DamagePopup);    

    if(DISP_LoadCommand){
		if (this._isVisible(CommandLayoutType.MAPCOMMAND, CommandActionType.LOAD)) {   
			groupArray.appendObject(ConfigItem.LoadCommand);
		}
    }

    if(DISP_SkipControl)
		groupArray.appendObject(ConfigItem.SkipControl);           

    if(DISP_MouseOperation)
		groupArray.appendObject(ConfigItem.MouseOperation);         

    if(DISP_MouseCursorTracking)
		groupArray.appendObject(ConfigItem.MouseCursorTracking);    
};

})();