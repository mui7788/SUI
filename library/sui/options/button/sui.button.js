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

    function createButton(element, options)
    {
        var buttonText,
            buttonClasses = baseClasses.concat(),
            iconText = false,
            icons = options.icon,
            corner = options.corner; //    corner   拐角; 角落，角;  [ˈkɔ:rnə(r)]

        element.tabIndex = -1
        if (corner)
        {
            buttonClasses.push("sui-corner-all"); /* 增加圆角样式*/
            if (corner = parseInt(corner)) /*将值数值化，有效后继续*/
            {
                element.style.borderRadius = corner + "px";/*设置圆角值*/
            }
        }

        if (options.size) /* 按钮大小*/
        {
            buttonClasses.push("sui-button-" + options.size)
        }
        if (options.color)  /**/
        {
            buttonClasses.push("sui-button-" + options.color)
        }
        if (options.disabled) 
        {
            buttonClasses.push("sui-state-disabled")
        }
        /* 追加按钮样式 */
        avalon(element).addClass(buttonClasses.join(" "))

        /* 按钮类型 */
        switch (options.type) 
        {
            case "text":
                buttonText = "<span class='sui-button-text'>{{label|html}}</span>"
                break;
            case "labeledIcon":
                iconText = true
            case "icon":
                switch (options.iconPosition)  /* 图标位置 */
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
        
        options.$$template = function () {
            return buttonText;
        }
    }

    avalon.component("sui:button", 
    {
        $replace:false, //   控件输出后替换。
        $slot: "label", //英 [slɒt] 美 [slɑ:t] 
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
        $init: function (options, element) 
        {
            element.label = options.label
            createButton(element, options)
            function stop(event) 
            {
                if (options.disabled) 
                {
                    event.preventDefault();/*取消默认操作*/
                    event.stopImmediatePropagation();/*终止事件，停止提交，当前及父级都终止*/
                }
            }
            var $element = avalon(element)
            var buttonWidth
            if (buttonWidth = parseInt(options.width)) 
            {
                element.style.width = buttonWidth + "px"
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
        $ready: function (vm, element) 
        {
            if (element.label) 
            {
                vm.label = element.label
            }
        }
    })
    return avalon
})
/**
 @links
 [设置button的大小、宽度，展示不同类型的button](avalon.button.ex1.html)
 [设置button的width和color](avalon.button.ex2.html)
 [通过ms-widget="button, $, buttonConfig"的方式设置button组](avalon.button.ex3.html)
 [通过ms-widget="buttonset"的方式设置button](avalon.button.ex4.html)
 */
