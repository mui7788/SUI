define(["avalon", "text!./avalon.input.html", "css!./avalon.input.css"], function (avalon, template) {

    var _interface = function () {
    };
    avalon.component("ms:input", {
        //内部变量
//        _readonly: false,
//        _disabled: false,
        _notice: "",
        //内部方法
        _blur: _interface,
        _focus: _interface,
        //配置项
        title: "",
        value: "",
        notice: "该项为必填项",
        isRequired: false,
        isDisabled: false,
        isReadonly: false,
        widthType: "normal",
        //模板
        $template: template,
        //替换自定义标签
        $replace: 1,

        $construct: function (defaultConfig, vmConfig, eleConfig) {
            avalon.log(defaultConfig);
            avalon.log(vmConfig);
            avalon.log(eleConfig);
            var options = avalon.mix(defaultConfig, vmConfig, eleConfig)
            return options
        },

        $init: function (vm) {
            vm._notice = vm.notice;
            vm.title = vm.title + "：";
            if (vm.isRequired && vm.value=="")
            {
                vm.notice = "*";
            }
            else
            {
                vm.notice = "";
            }
        },
        $ready: function (vm, element) {
            vm._blur = function ()
            {
                if (vm.isRequired && this.value == "")
                {
                    vm.notice = vm._notice;
                }
                else
                {
                    vm.notice = "";
                }

            }
            vm._focus = function ()
            {

            }
        }

    })
    return avalon
})