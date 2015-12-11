/**
 * @version sui 1.0.0.0
 * @cnName 按钮
 * @enName button
 * @introduce
 * <p>按钮组件提供丰富的样式、形式选择，除与bootstrap可用的button样式保持一致外，支持small、default、big、large四种尺寸，
 * 同时支持图标button，可以是仅有图标的button，图标在左边的button、图标在右边的button、两边都有图标的button，
 * 当然也支持图标组，有水平图标组、垂直图标组两种形式</p>
 */
define(["avalon", "css!../../base/sui-common.css", "css!./sui.button.css"], 
function (avalon) 
{
    var baseClasses = ["sui-button","sui-state-default"];//

    function createButton(el, vm)
    {
        var buttonText,
            buttonClasses = baseClasses.concat(),
            iconText = false,
            icons = vm.icon,
            corner = vm.corner; //    corner   拐角; 角落，角;  [ˈkɔ:rnə(r)]

        el.tabIndex = -1
        if (corner)
        {
            buttonClasses.push("sui-corner-all"); /* 增加圆角样式*/
            if (corner = parseInt(corner)) /*将值数值化，有效后继续*/
            {
                el.style.borderRadius = corner + "px";/*设置圆角值*/
            }
        }

        if (vm.size) /* 按钮大小*/
        {
            buttonClasses.push("sui-button-" + vm.size)
        }
        if (vm.color)  /**/
        {
            buttonClasses.push("sui-button-" + vm.color)
        }
        if (vm.disabled) 
        {
            buttonClasses.push("sui-state-disabled")
        }
        /* 追加按钮样式 */
        avalon(el).addClass(buttonClasses.join(" "))

        /* 按钮类型 */
        switch (vm.type) 
        {
            case "text":
                buttonText = "<span class='sui-button-text'>{{label|html}}</span>"
                break;
            case "labeledIcon":
                iconText = true
            case "icon":
                switch (vm.iconPosition)  /* 图标位置 */
                {
                    case "left":
                        buttonText = "<i class='sui-icon " + (icons? icons:"") + "'></i>" +
                                "<span class='sui-button-text sui-button-text-right"
                                + (!iconText ? " sui-button-text-hidden" : "") + "'>{{label|html}}</span>"
                        break;
                    case "right":
                        buttonText = "<span class='sui-button-text sui-button-text-left" +
                                (!iconText ? " sui-button-text-hidden" : "") + "'>{{label|html}}</span>"
                                + "<i class='sui-icon " + (icons? icons:"") + "'></i>"
                        break;
                    case "left-right":
                        var iconArr = icons && icons.split("$") || ["", ""],
                                iconLeft = iconArr[0],
                                iconRight = iconArr[1]
                        buttonText = "<i class='sui-icon sui-icon-left " + (iconLeft? iconLeft:"") + "'></i>" +
                                "<span class='sui-button-text sui-button-text-middle" +
                                (!iconText ? " sui-button-text-hidden" : "") + "'>{{label|html}}</span>" +
                                "<i class='sui-icon sui-icon-right " + (iconRight? iconRight:"") + "'></i>"
                        break;
                }
                break;
        }
        
        vm.$$template = function () {
            return buttonText;
        }
    }

    avalon.component("sui:button", 
    {
        $replace:false, //   控件输出后替换。真值时表示替换其容器
        $slot: "label", //英 [slɒt] 美 [slɑ:t] 默认插入点的名字
        //•$template:String 组件的模板
        //•$extend: String 指定要继承的组件名
        //•$container: DOM 插入元素的位置,比如dialog就不一定在使用它的位置插入,通常放在body中
        //•$construct: Function 用于调整三个配置项的合并,默认是function:(a, b,c ){return avalon.mix(a, b,c)}
        //•$$template Function 用于微调组件的模板,传入$template与当前元素
        type: "text", //@config 配置button的展示形式，仅文字展示，还是仅图标展示，或者文字加图标的展示方式，三种方式分别对应："text"、"icon"、"labeledIcon"
        iconPosition: "left", //@config 当type为icon或者labeledIcon时，定义icon在哪边，默认在text的左边，也可以配置为右边("right"),或者两边都有("left-right")
        icon: "", //@config  当type为icon或者labeledIcon时，定义展示icon的内容，本组件的icon是使用web font实现，当iconPosition为"left"或者"right"时，将icon的码赋给icon，当iconPosition为"left-right",将left icon与right icon的码以"-"分隔，比如data-button-icon="\&\#xf001;-\&\#xf06b;"
        size: "", //@config button有四个尺寸"small", "default", "big", "large"
        color: "", //@config 定义button的颜色，默认提供了"primary", "warning", "danger", "success", "info", "inverse", "default" 7中颜色，与bootstrap保持一致
        corner: true, //@config 设置是否显示圆角，可以布尔值或者Number类型，布尔只是简单的说明显示或者不显示，Number则在表示显示与否的同时，也是在指定圆角的大小，圆角默认是2px。
        style: "", // 用于定义button的展现形式，比如"flat" "glow" "rounded" "3D" "pill" 本组件，仅提供flat的实现
        disabled: false, //@config 配置button的禁用状态
        label: "", //@config 设置button的显示文字，label的优先级高于元素的innerHTML
        width: "", //@config 设置button的宽度，注意button的盒模型设为了border-box
        //
        //•当vm构建好时, $replace, $slot, $template,$container, $construct会消失
        //•$init中添加各种$watch回调, 为IE6-8的VBscript函数的this指向不正确进行bind fix
        //•$ready中重新计算组件的高宽
        //•$dispose中将VM中的元素节点置为null，移除各种dom事件，清空元素内部，方便GC
        //•每个组件VM，还添加了一个叫 $refs 的非监控对象属性，用于存放子组件的VM。
        /*
            所有回调的执行顺序
            组件自身的$$template-- > 
            组件自身的$init-- > 库的全局$init-- > 
            组件自身的$childReady-- > 库的全局$childReady-- > 
            组件自身的$ready-- > 库的全局$ready-- > 
            组件自身的$dispose-- > 库的全局$dispose 
        */ 
         /**
         * 回调此方法后，往avalon.vmodels上添加该组件。
         * 该组件开始渲染时调用的回调
         * 刚开始渲染时调用的回调, 传入vm与当前元素
         * @param {type} vm 当前组件的vm
         * @param {type} el 当前自定义标签
         * @returns {undefined}
         */
        $init: function (vm, el) 
        {
            el.label = vm.label
            createButton(el, vm)
            function stop(event) 
            {
                if (vm.disabled) 
                {
                    event.preventDefault();/*取消默认操作*/
                    event.stopImmediatePropagation();/*终止事件，停止提交，当前及父级都终止*/
                }
            }
            var $element = avalon(el)
            var buttonWidth
            if (buttonWidth = parseInt(vm.width)) 
            {
                el.style.width = buttonWidth + "px"
            }
            $element.bind("mousedown", function (event) 
            {
                stop(event)
                $element.addClass("sui-state-active")
            })
            $element.bind("mouseup", function (event) 
            {
                stop(event)
                $element.removeClass("sui-state-active")
            })
            $element.bind("blur", function () 
            {
                $element.removeClass("sui-state-active")
                $element.removeClass("sui-state-focus")
            })
            $element.bind("focus", function () 
            {
                $element.addClass("sui-state-focus")
            })
        },
        /**
         * 该组件的子组件渲染完毕,冒泡上来的回调
         * 当其子组件$ready完毕后, 会冒泡到当前组件触发的回调, 传入vm与当前元素
         */        
        //$childReady:function(vm,el)
        /**
         * 该组件渲杂完毕时调用的回调，它位于其所有子组件的$ready之后
         * 当组件的所有子组件都调用其$ready回调后才触发的回调, 传入vm与当前元素
         * @param {type} vm
         * @param {type} el
         * @returns {undefined}
         */
        $ready: function (vm, el) 
        {
            /* 重新自定义的空方法*/
            if (el.label) 
            {
                vm.label = el.label
            }
        }
            /**
         * 该组件被移出DOM树，并且元素不存在msRetain属性，才会调用的回调
         * 该组件被移出DOM树，并且元素不存在msRetain属性时的销毁回调, 传入vm与当前元素
         */
        //$dispose:function(vm,el)
    })
    return avalon
})

