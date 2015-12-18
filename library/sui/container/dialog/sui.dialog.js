/**
 * @version sui.dialog 1.0.0.0
 * @cnName 弹窗
 * @enName dialog
 * @introduce
 * <p>dialog组件提供弹窗显示或者隐藏,通过简单配置可以水平居中显示dialog弹窗，此组件支持弹窗中再弹窗，也可以用来模拟alert的行为，非常方便</p>
 */
define(["avalon",
        "../../options/button/sui.button",
        "../../../scb/browse/scb.browser",
        "text!./sui.dialog.html",
        "css!../../base/sui-common.css",
        "css!./sui.dialog.css"
       ], 
function (avalon,btn,browser,template) 
{
    var _interface = avalon.noop;
    
    var maskLayerExist = false ; //      页面不存在遮罩层就添加maskLayer节点，存在则忽略.
    //  添加到文档碎片上。
    var maskLayer = avalon.parseHTML('<div class="oni-dialog-layout"></div>').firstChild;
    //  一个iframe,用于处理IE6select BUG 
    var maskLayerShim ;
    //  存在层上层时由此数组判断层的个数
    var dialogShows = [];
    //  保存页面dialog的数量，当dialogNum为0时，清除maskLayer
    var dialogNum = 0 ;
    var root = document.documentElement
    
    avalon.component("sui:dialog",
    {
        $template:template,
        $skipArray: ["container", "widgetElement"],
        width:480,          //  @config 设置Dialog的宽。
        title:"&nbsp;",     //  @config 设置弹窗的标题。
        draggable: false,   //  @config 设置dialog是否可拖动
        type: "confirm",    //  @config 配置弹窗的类型，可以配置为alert来模拟浏览器
        content: "", 
        //  @config 配置dialog的content，默认取dialog的innerHTML作为dialog的content，如果innerHTML为空，再去取content配置项.
        //  需要注意的是：content只在初始化配置的起作用，之后需要通过setContent来动态的修改
        showClose: true,//  @config配置dialog是否显示"取消"按钮，但是如果type为alert，不论showClose为true or false都不会显示"取消"按钮
        toggle: false, //@config 通过此属性的决定dialog的显示或者隐藏状态
        //  toggle  [英][ˈtɒgl][美][ˈtɑ:gl] n.棒形纽扣; 套索扣; 转换键; 切换键; v. 切换
        container: "body",      //  @config dialog元素的上下文父元素，container必须是dialog要appendTo的父元素的id或者元素dom对象
        confirmText: "确定",    //  @config 配置dialog的"确定"按钮的显示文字
        cancelText: "取消",     //  @config 配置dialog的"取消"按钮的显示文字
        position: browser.browser.ie ==6 ? "absolute" : "fixed", // 弹窗定位方式。
         
        $construct:function(a,b,c)
        {
            var componentDefine = avalon.mix(a, b, c)
            var $container = componentDefine.$container || componentDefine.container
            componentDefine.$container = $container && $container.nodeType === 1 ? $container : document.body
            // 如果显示模式为alert或者配置了showClose为false，不显示关闭按钮
            componentDefine.showClose = componentDefine.type === "alert" ? false : componentDefine.showClose;
            //  
            delete componentDefine.container
            return componentDefine
        },
        $init:function(vm,el)
        {
            var body = document.body ;
            var windowHeight = avalon(window).height();
            if (avalon(body).height() < windowHeight) 
            {
                avalon(body).css("min-height", windowHeight);// 设置Body的最小高度。
            }
            vm.widgetElement = el; //   当前控件元素。
            avalon(el).addClass("oni-dialog");
            el.setAttribute("ms-visible", "toggle");
            el.setAttribute("ms-css-position", "position");
            el.setAttribute("ms-css-width", "width");
            // 当窗口尺寸发生变化时重新调整dialog的位置，始终使其水平垂直居中
            el.resizeCallback = avalon(window).bind("resize", throttle(resetCenter, 50, 100, [vm, el]))
            el.scrollCallback = avalon(window).bind("scroll", throttle(resetCenter, 50, 100, [vm, el]))

        },
        $ready:function(vm,el)
        {
            
        },
        $dispose:function(vm,el)
        {
            
        }
    })
    
         
    /**
     * 使dialog始终出现在视窗中间
     * @param {type} vm  dialog 使用定义的vm对象。
     * @param {type} el  dialog 定义的元素
     * @returns {undefined}
     */
    function resetCenter(vm, el) 
    {
        //  非显示状态退出。
        if (!vm.toggle) return
        //  多个层时，每个层显示。
        for (var i = 0, el; el = dialogShows[i++]; )
        {
            el.widgetElement.style.display = "block"
        }

        var windowWidth = avalon(window).width()
        var windowHeight = avalon(window).height()
        //  页面滚动、body滚动位置
        var scrollTop = document.body.scrollTop + root.scrollTop
        var scrollLeft = document.body.scrollLeft + root.scrollLeft
        //  窗口大小
        var dialogWidth = el.offsetWidth
        var dialogHeight = el.offsetHeight
        //  窗口相对页面显示位置。
        var top = Math.max((windowHeight - dialogHeight) / 2, 0)
        var left = Math.max((windowWidth - dialogWidth) / 2, 0)
        //  遮罩层显示的高度与滚动位置。
        avalon(maskLayer).css(
                {
                    height: windowHeight + scrollTop,
                    width: windowWidth + scrollLeft,
                    position: "absolute",
                    overflow: "auto",
                    top: scrollTop,
                    left: 0
                })
        //  ie6 下遮罩层无法覆盖select 解决
        if (maskLayerShim) 
        {
            avalon(maskLayerShim).css(
                    {
                        height: windowHeight + scrollTop,
                        width: windowWidth + scrollLeft,
                        top: scrollTop,
                        left: 0
                    })
        }
        
        var curTop = top;
        //  弹出dialog 大于 界面时。
        if (dialogHeight > windowHeight) 
        {
            //  如果弹出层的高度大于窗口高,为了能看到弹出层的内容,需要通过滚动,上下移动弹出层
            var curTop = top + el.openScrollTop - scrollTop;
            //  。
            var minTop = windowHeight - dialogHeight - 15
            if (curTop < minTop && minTop < 0) 
            {
                curTop = minTop
            } 
            else if (curTop > el.openScrollTop) 
            {
                curTop = el.openScrollTop
            }
        }
        avalon(el).css({"top": curTop, "left": left})
    }

    return avalon ;
})