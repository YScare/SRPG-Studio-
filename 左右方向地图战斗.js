/**
 * 如果你使用了简易战斗插件，并且想删掉掉行走图的上下方向来减少制作图像素材的压力时，
 * 你会发现远程单位攻击时容易向相反方向攻击。
 * 这个插件解决了这个问题。
 *
 * 制作者：千影衣
 * 插件网址：https://github.com/YScare/SRPG-Studio-
 * 商用OK，无需署名。 
 */
(function(){
    EasyMapUnit._getAdhocDirection=function(src, dest) {
        var dx,directionLeftRight,direction;
    
        if (src.getMapX() < dest.getMapX()) {
            directionLeftRight = DirectionType.RIGHT;
            dx = dest.getMapX() - src.getMapX();
        }
        else {
            directionLeftRight = DirectionType.LEFT;
            dx = src.getMapX() - dest.getMapX();
        }
        direction = directionLeftRight;
        return direction;
    }
})();
