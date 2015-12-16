/**
 * @version sui.dialog 1.0.0.0
 * @cnName 弹窗
 * @enName dialog
 * @introduce
 * <p>dialog组件提供弹窗显示或者隐藏,通过简单配置可以水平居中显示dialog弹窗，此组件支持弹窗中再弹窗，也可以用来模拟alert的行为，非常方便</p>
 */
define(["avalon",
        "text!./sui.dialog.html",
        "../../options/button/sui.button",
        "css!../../base/sui-common.css",
        "css!./sui.dialog.css"
       ], 
function (avalon) 
{
    var _interface = avalon.noop;
    
    var maskLayerExist = false ; //      页面不存在遮罩层就添加maskLayer节点，存在则忽略.
    //  添加到文档碎片上。
    var maskLayer = avalon.parseHTML('<div class="oni-dialog-layout"></div>').firstChild;
    
    return avalon ;
})