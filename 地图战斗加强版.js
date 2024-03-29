/*
=======================================================
插件名称；地图战斗加强版
原作者；仁菜
汉化与加强；千影衣
=======================================================
根据仁菜大佬的插件进行了汉化和加强。
功能：可以实现地图上的简单战斗，增加了包含战斗在内的多个动画。
每组动画为6帧，也就是行走图一行6个图像，支持每个人物拥有两套行走图素材。
可以自定义行走图尺寸。
使用方法；第一套素材，在职业显示条件中添加关键字为EX。
         第二套素材行走图放入effect文件夹，在职业显示条件中添加关键为EX2.并在自定义参数中写入{id2:x}x为effect素材的ID。
*/

//设置行走图的尺寸，在ss中，行走图的尺寸是地图尺寸的两倍，且最大尺寸为192，但是本插件没有限制。
var ZHENPIC_1 = 64;//第一套素材的尺寸
var ZHENPIC_2= 64;//第二套素材的尺寸

//第二套素材的位置补正，方便与第一套对齐
var EX2_X = 32;//第二套素材的x值补正
var EX2_Y = 32;//第二套素材的y值补正
var ChipConf={
	EASY_BATTLE:true,//开启插件功能
	FPS:10,//待机时的每帧时间，由于加速功能的影响，最好设置为双数，以下同理。
	FPS2:5,//战斗时的每帧时间
	BSTEP:15,//战斗用计数，1周（FPS2*帧）/2以上，{5*5/2=12}12以上，剩下的部分是攻击后的待机计数
	EX2PIC:GraphicsType.EFFECT,//第二个插件的图像素材存放位置
	//理论上上方向与下方向的素材可以省去，这样只需要设计一个方向的素材，然后翻转复制粘贴就行了
	DIR_NORMAL: [ 1, 2, 3, 4, 0], //行走方向，素材的行数【左上右下正】以下同理
	DIR_ATK:    [ 1, 2, 3, 4, 0], //攻撃方向
	DIR_DAME:   [ 1, 2, 3, 4, 0], //被攻击
	DIR_AVOID:  [ 1, 2, 3, 4, 0], //闪避
	DIR_CRI:    [ 1, 2, 3, 4, 0], //暴击
	PIC_WAIT:'unitwait.png',
	
	DEBUGMODE:false,//显示故障字符串
	ACTSTART:0,
	BA_ORDER:null,
	BA_START:0
};

(function() {
var alias1 = CustomCharChipGroup._configureCustomCharChip;
CustomCharChipGroup._configureCustomCharChip = function(groupArray) {
	alias1.call(this, groupArray);
	groupArray.push(ChipEX);
	groupArray.push(ChipEX2);
};
})();

(function(){
	GraphicsFormat.CHARCHIP_WIDTH=ZHENPIC_1;
})();


var ChipEX = defineObject(BaseCustomCharChip,
{
	_unit:null,
	_pic:null,_picwait:null,
	_pictype:GraphicsType.CHARCHIP,
	_w:GraphicsFormat.CHARCHIP_WIDTH,
	_dir:0,_fid:0,_cnt:0,
	_fps:ChipConf.FPS,
	_fps2:0,_skipspd:1,
	_sx:0,_sy:0,
	_actstop:0,_actfinish:0,
	_FrameX:3,//あとで再設定される
		
	setupCustomCharChip: function(unit) {
		this._unit=unit;
		var handle = unit.getCharChipResourceHandle();
		var colorIndex = unit.getUnitType();
		this._picwait=root.getMaterialManager().createImage('pic', ChipConf.PIC_WAIT);
		if(this._picwait){colorIndex=0;}
		this._pic=this._getpic(handle, colorIndex, this._pictype);		
		this._FrameX=this._pic.getWidth()/this._w;//GraphicsFormat.CHARCHIP_WIDTH;//画像の幅/64
	},
	
	moveCustomCharChip: function() {
		if(Miscellaneous.isGameAcceleration()==true){this._skipspd=2;}else{this._skipspd=1;}//SKIPで２倍速
		if(ChipConf.BA_START==1 && this._fps2>0){this._fps=this._fps2/this._skipspd;}
		else{
			this._fps2=0;
			if(this._unit.custom.dir6==null){
				this._fps=ChipConf.FPS/this._skipspd;
			}
		}
		if(this._cnt>=this._fps){this._fid++;this._cnt=0;}
		this._fid=this._fid%this._FrameX;
		if(this._actstop==1 && ChipConf.BA_START==1){this._fid=this._FrameX-1;}
		this._cnt++;//ここで加算されたから1-16になる
		this._dir=ChipConf.DIR_NORMAL[this._unit.getDirection()];
		this.chk6();//6行目以降のチップ指定
		
		return MoveResult.CONTINUE;
	},
	
	drawCustomCharChip: function(cpData) {//待機中
		if(!this._picwait){this._setColor(cpData);}
		this._drawSymbol(cpData.xPixel, cpData.yPixel, cpData);
		this.drawUnitEX(cpData);
		this._drawInfo(cpData.xPixel, cpData.yPixel, cpData);
	},
	
	
	drawMenuCharChip: function(cpData) {
		if(ChipConf.EASY_BATTLE == true){//簡易戦闘変更ON		
			var order;
			//order.isCurrentHit();order.isCurrentCritical();order.isCurrentFinish();order.isCurrentFirstAttack()
			if(cpData.direction != DirectionType.NULL && cpData.unit.getDirection() === DirectionType.NULL){//攻撃中				
				order = ChipConf.BA_ORDER;

				this._fps2=ChipConf.FPS2;
				if(order.getActiveUnit() == cpData.unit){//攻撃ユニット
					this._dir=ChipConf.DIR_ATK[cpData.direction];
					if(ChipConf.ACTSTART == 1) {
						ChipConf.ACTSTART = 2;
						this._cnt=0;
						this._fid=0;
						this._actstop = 0;
					}
					if(order.isCurrentCritical()){this._dir=ChipConf.DIR_CRI[cpData.direction];}
					if(this._fid==this._FrameX-1 && this._cnt>=this._fps){//1周終わり									
						this._actstop=1;
					}
				}
				
				if(order.getActiveUnit() != cpData.unit){//被攻撃ユニット
					if(ChipConf.ACTSTART == 2) {
						ChipConf.ACTSTART = 0;
						this._cnt = 0;
						this._fid = 0;
						this._actstop=0;
					}
					if(order.isCurrentHit()!=true){//回避
						this._dir=ChipConf.DIR_AVOID[cpData.direction];						
					} else {//被ダメ
						this._dir=ChipConf.DIR_DAME[cpData.direction];						
					}
					
					if(this._fid==this._FrameX-1 && this._cnt>=this._fps){//1周終わり
						this._actstop=1;						
					}
				}
				this.drawUnitEX(cpData);
			}
			else{
				if(cpData.direction==DirectionType.NULL){//4.メニュー、タゲ選択中のメニュー
					this._setColor(cpData,1);
					this.drawUnitEX(cpData,1);
				}
				else{//0-3 移動中、攻撃中（↑のIFに消された）
					this.drawUnitEX(cpData);
				}
			}
		} else{//簡易戦闘変更OFF
			var directionArray = ChipConf.DIR_NORMAL;//攻撃用			
			if(cpData.direction != DirectionType.NULL && cpData.unit.getDirection() === DirectionType.NULL){//攻撃中
				this._dir = directionArray[cpData.direction];
				this.drawUnitEX(cpData);				
			} else {
				if(cpData.direction==DirectionType.NULL){//4.メニュー、タゲ選択中のメニュー
					this._setColor(cpData,1);
					this.drawUnitEX(cpData,1);
				} else {//0-3 移動中、攻撃中（↑のIFに消された）
					this.drawUnitEX(cpData);
				}
			}
		}
	},
	
	isDefaultMenuUnit: function() {
		return false;
	},	
	drawUnitEX: function(cpData,type){
		var w= this._w;
		var h= w;
		this._pic.setDegree(cpData.degree);
		this._pic.setReverse(cpData.isReverse);
		this._pic.setAlpha(cpData.alpha);
		if(!type){			
			this._pic.drawStretchParts(cpData.xPixel-(w/4),cpData.yPixel-(h/4),w,h,this._fid*w,this._dir*h,w,h);
			if(this._picwait && cpData.unit.isWait()){				
				this._picwait.drawStretchParts(cpData.xPixel-(w/4),cpData.yPixel-(h/4),w,h,0,0,w,h);
			}
		}
		else{this._pic.drawStretchParts(cpData.xPixel-(w/4),cpData.yPixel-(h/4),w,h,0,0,w,h);}//チップ１枚目
		if(ChipConf.DEBUGMODE == true){this.drawdebug(cpData);}
	},

	drawdebug: function(cpData){
		var font=TextRenderer.getDefaultFont();
		var text="("+this._dir+","+this._fid+")";
		
		// 绘制行数和帧数
		// TextRenderer.drawText(cpData.xPixel, cpData.yPixel-20, text, 64, 0xffffff, font);

		// 只绘制帧数		
		TextRenderer.drawText(cpData.xPixel, cpData.yPixel-20, this._fid + "", 64, 0xffffff, font);		
		
		text=this._cnt;
		if(this._cnt<10){text="0"+this._cnt;}
		TextRenderer.drawText(cpData.xPixel, cpData.yPixel+32, text, 128, 0xffffff, font);
		
	},
	//専用コマンドで6行目以降のチップ指定
	//dir6[value][ループ数][fps][カウント][一時スイッチ]
	set6: function(value,loop,fps,x,y){//コマンド中だとthisの操作ができないぽい
		if(!value){return -1;}
		var arr=ChipEX.get_arrUnit();		
		for(var i=0;i<arr.length;i++){			
			var dir6={};
			dir6.value=value;
			if(loop){dir6.loop=loop;}
			else{dir6.loop=0;}
			if(fps){dir6.fps=fps;}
			dir6.cnt=0;
			dir6.st=0;
			if(x){dir6.x=x;}else{dir6.x=0;}
			if(y){dir6.y=y;}else{dir6.y=0;}
			arr[i].custom.dir6=dir6;
		}
	},
	end6: function(ec){
		var arr=ChipEX.get_arrUnit();
		for(var i=0;i<arr.length;i++){
			this.skip6(arr[i]);
		}			
	},
	
	chk6: function(){
		var dir6=this._unit.custom.dir6;
		if(dir6){
			if(dir6.fps>0){this._fps=dir6.fps/this._skipspd;}
			if(dir6.st==0){//初回
				dir6.st=1;
				this._fid=0;this._cnt=0;
				//if(dir6.fps>0){this._fps=dir6.fps/this._skipspd;}		
				this._sx=0;
				this._sy=0;	
			}
			if(dir6.loop>0){//回数ループ
				//if(this._cnt>(this._FrameX*this._fps)){//1周回のカウント数
				if(this._fid==this._FrameX-1 && this._cnt==this._fps){
					dir6.cnt++;
					this._cnt=0;
					this._fid=0;
				}				
				if(dir6.loop<=dir6.cnt){//終了															
					this.skip6(this._unit);					
				}
				else{//ループ
					this._dir=dir6.value;
					this._sx+=dir6.x/(this._FrameX*this._fps);
					this._unit.setSlideX(this._sx);
					this._sy+=dir6.y/(this._FrameX*this._fps);
					this._unit.setSlideY(this._sy);					
				}
			}
			else if(dir6.loop==0){//無限ループ end6使うまでに 移動できません
				this._dir=dir6.value;
			}
		}
	},
	
	skip6: function(unit){
		var x,y;
		var dir6=unit.custom.dir6;
		var w=root.getCurrentSession().getCurrentMapInfo().getMapWidth();
		var h=root.getCurrentSession().getCurrentMapInfo().getMapHeight();	
		if(dir6){
			x=unit.getMapX()+dir6.x*dir6.loop/GraphicsFormat.MAPCHIP_WIDTH;//16->0 17->1
			y=unit.getMapY()+dir6.y*dir6.loop/GraphicsFormat.MAPCHIP_HEIGHT;
			if(x<=0){x=0;}if(x>=w){x=w-1;}//マップ外禁止
			if(y<=0){y=0;}if(y>=h){y=h-1;}
			unit.setMapX(x);
			unit.setMapY(y);
		}
		unit.setSlideX(0);
		unit.setSlideY(0);
		unit.custom.dir6=null;
	},
	
	getKeyword: function() {
		return 'EX';
	},
	
	_setColor: function(cpData, ismenu) {
		
		if(!this._picwait){
			var colorIndex = cpData.unit.getUnitType();
		
			if(!ismenu){
				if (cpData.unit.isWait()) {
					colorIndex = 3;		
				}
			}
			this._pic=this._getpic(cpData.unit.getCharChipResourceHandle(), colorIndex, this._pictype);
			
		}
	},
	
	_drawInfo: function(x, y, cpData) {
		// HPゲージを描画する位置を決定する。
		// エフェクトによって最適な位置は異なる。
		this._drawHpGauge(x, y + 10, cpData);
		this._drawStateIcon(x, y - 20, cpData);
	},
	_getpic: function(handle, colorIndex, type) {
		var isRuntime, list;
		var handleType = handle.getHandleType();
		
		if (handleType === ResourceHandleType.ORIGINAL) {
			isRuntime = false;
		}
		else if (handleType === ResourceHandleType.RUNTIME) {
			isRuntime = true;
		}
		else {
			return null;
		}
		list = root.getBaseData().getGraphicsResourceList(type, 0);
		
		
		if(this.getKeyword()=='EX2'){
			var id=this._unit.getClass().custom.id2;
			if(list.getCollectionDataFromId(id,colorIndex)==null){
				root.msg("画像がない!");root.endGame();
			}
			return list.getCollectionDataFromId(id, colorIndex);
			
		}
		return list.getCollectionDataFromId(handle.getResourceId(), colorIndex);
	},
	
	get_arrUnit: function(){//スクリプト実行のオリデータからユニット登録
		var unitlist, unit, i, j, cnt;
		var index = 0;
		var arr=[];
		//ユニット味方以外を選択したら１ユニットのみ登録
		var unit=root.getEventCommandObject().getOriginalContent().getUnit();
		if(unit!=null && unit.getUnitType()!=0){//味方以外
			arr.push(unit);
			return arr;
		}
		//複数データ登録
		var aggregation = root.getEventCommandObject().getOriginalContent().getTargetAggregation();
		for( i = 0;i < 3;i++ ) {
			if( i == 0 ) {
				unitlist = PlayerList.getMainList();
			}
			else if( i == 1 ) {
				unitlist = root.getCurrentSession().getEnemyList();
			}
			else {
				unitlist = root.getCurrentSession().getAllyList();
			}
			
			cnt = unitlist.getCount();
			for( j = 0;j < cnt;j++ ) {
				unit = unitlist.getData(j); 
				if( unit == null ) {
					continue;
				}
				
				if( aggregation.isCondition(unit) ) {
					arr.push(unit);
				}
			}
		}
		if( arr.length === 0 ) {//複数データ条件なしの場合全員登録
			root.log('unitが配列未登録なので実行しません');
		}
		return arr;
	}
	
}
);

ChipEX2 = defineObject(ChipEX,
{
	_pictype:ChipConf.EX2PIC,
	_w:ZHENPIC_2,
	
	getKeyword: function() {
		return 'EX2';
	},
	
	drawUnitEX: function(cpData,type){
		var w= this._w;
		var h= w;

		this._pic.setDegree(cpData.degree);
		this._pic.setReverse(cpData.isReverse);
		this._pic.setAlpha(cpData.alpha);
		if(!type){			
			this._pic.drawStretchParts(cpData.xPixel-EX2_X,cpData.yPixel-EX2_Y,w,h,this._fid*w,this._dir*h,w,h);
			if(this._picwait && cpData.unit.isWait()){
				
				this._picwait.drawStretchParts(cpData.xPixel-32,cpData.yPixel-32,w,h,0,0,w,h);
			}
		}
		else{this._pic.drawStretchParts(cpData.xPixel-32,cpData.yPixel-32,w,h,0,0,w,h);}//チップ１枚目
		if(ChipConf.DEBUGMODE==true){this.drawdebug(cpData);}	
/*
		this._pic.drawStretchParts(cpData.xPixel-32,cpData.yPixel-32,w,h,this._fid*w,this._dir*h,w,h);
		if(ChipConf.DEBUGMODE==true){this.drawdebug(cpData);}		
		*/
	}
}
);
//元スクリプト再定義 
(function() {

EasyBattle._moveBattleStart= function() {
	if (this._battleTable.moveBattleStart() !== MoveResult.CONTINUE) {
		ChipConf.BA_START = 1;
		if (!this._attackFlow.validBattle()) {
			// 戦闘を開始できない場合は、直ちに終了する
			this._processModeBattleEnd();
			return MoveResult.CONTINUE;
		}
		this._processModeActionStart();
	}
	
	return MoveResult.CONTINUE;
};

EasyBattle.endBattle= function() {
	var rootEffect = root.getScreenEffect();
	
	// 通常は、checkNextAttackが既に呼ばれているはずだが、
	// スキップ戦闘のことを考え、実行しておく必要がある。
	rootEffect.resetEffect();
	this._enableDefaultCharChip(false);
	
	this._battleTable.endMusic();
	this._parentCoreAttack = null;
	ChipConf.BA_START = 0;
};

/* 
	2022-09-01 把ACTSTART值的更新从原本的 EasyBattle._moveIdle 
	提前到 EasyInterruptSkillFlowEntry._prepareMemberData和EasyBattle._changeIdleMode
	避免反击时、反击时触发技能时提前播放第5帧的问题
*/
var alias_EasyInterruptSkillFlowEntry_prepareMemberData = EasyInterruptSkillFlowEntry._prepareMemberData;
EasyInterruptSkillFlowEntry._prepareMemberData = function(battleTable) {
	ChipConf.ACTSTART = 1;	
	alias_EasyInterruptSkillFlowEntry_prepareMemberData.call(this, battleTable);
}

var alias_EasyBattle_changeIdleMode = EasyBattle._changeIdleMode;
EasyBattle._changeIdleMode = function(nextmode, value) {		
	ChipConf.BA_ORDER = this._order;
	alias_EasyBattle_changeIdleMode.call(this, nextmode, value);	
}

EasyMapUnit._getStepMax= function() {
	if(ChipConf.EASY_BATTLE==true){return ChipConf.BSTEP;}
	else{return 14;}
};

var alias2 = EasyMapUnit._moveNormal;
EasyMapUnit._moveNormal= function(isForward) {
	if(ChipConf.EASY_BATTLE == true){return MoveResult.CONTINUE;}
	alias2.call(this, isForward);	
};

var alias3 = EasyMapUnit._moveAvoid;
EasyMapUnit._moveAvoid= function(isForward) {
	if(ChipConf.EASY_BATTLE == true){return MoveResult.CONTINUE;}
	alias3.call(this, isForward);
};

})();
