define(["avalon", "text!./avalon.button.html", "css!../sui-input-common.css", "css!./avalon.button.css"], function (avalon, template) {

    var _interface = function () {
    };

    avalon.component("ms:button", {
        //内部变量
        _focusing: false,
        //内部方法
        _click: _interface,
        _focus: _interface,
        _blur: _interface,
        _keyup: _interface,
        //回调函数
        onInit: _interface, //必须定义此接口
        onClick: _interface,
        //配置项
        did: "",
        value: "",
        isDisabled: false,
        widthType: "small",
        //自定义正则表达式
        theme: "default",
        //模板
        $template: template,
        //替换自定义标签
        $replace: 1,
        $construct: function (defaultConfig, vmConfig, eleConfig) {
            var options = avalon.mix(defaultConfig, vmConfig, eleConfig)
            return options
        },
        $init: function (vm) {

        },
        $ready: function (vm, element) {
            vm.onInit(vm);

            vm._blur = function (e)
            {
            }
            vm._keyup = function (e)
            {
                if (e.which == 13)
                {
                }
            }
            vm._focus = function ()
            {
                vm._focusing = true;
            }
            vm._click = function (e)
            {
                vm.onClick(e)
            }
        },
        $dispose: function (vm, element)
        {
            element.innerHTML = "";
        }

    })


    return avalon
})


//
