define(["avalon", "text!./avalon.select.html", "css!../sui-input-common.css", "css!./avalon.select.css"], function (avalon, template) {

    var _interface = function () {
    };

    avalon.component("ms:select", {
        //内部变量
        _notice: "",
        _showNoticeImage: false,
        _focusing: false,
        //内部方法
        _blur: _interface,
        //回调方法
        onInit: _interface, //必须定义此接口
        onChange: _interface, //值修改时触发外部事件
        check: _interface,
        getValue: _interface,
        //配置项
        did: "",
        title: "",
        value: [],
        notice: "请至少选择一项",
        data: [],
        isRequired: false,
        isDisabled: false,
        widthType:"normal",
        theme: "default",
        isShowNoticeImage: false,
        isShowCustomOption: false,
        customData: [],
        //模板
        $template: template,
        //替换自定义标签
        $replace: 1,
        $construct: function (defaultConfig, vmConfig, eleConfig) {
            var options = avalon.mix(defaultConfig, vmConfig, eleConfig)
            return options
        },
        $init: function (vm) {
            vm._notice = vm.notice;
            vm.notice = "";
            vm.title = vm.title + "：";

            //设置默认选项
            if (vm.value.length == 0)
            {
                if (vm.isShowCustomOption && vm.customData.length != 0)
                {
                    vm.value = vm.customData[0].value;
                }
            }
        },
        $ready: function (vm, element) {
            vm.onInit(vm);
            vm.check = function ()
            {
                if (vm.isRequired)
                {
                    if (vm.isShowCustomOption && vm.customData.length != 0)
                    {
                        if (vm.value == vm.customData[0].value)
                        {
                            vm._showNoticeImage = true;
                            vm.notice = vm._notice;
                            return false;
                        }
                        else
                        {
                            vm._showNoticeImage = false;
                            vm.notice = "";
                            return true;
                        }
                    }
                    else
                    {
                        if (vm.value.length == 0)
                        {
                            vm._showNoticeImage = true;
                            vm.notice = vm._notice;
                            return false;
                        }
                        else
                        {
                            vm._showNoticeImage = false;
                            vm.notice = "";
                            return true;
                        }
                    }
                }
                else
                {
                    vm._showNoticeImage = false;
                    vm.notice = "";
                    return true;
                }

            }
            vm.getValue = function ()
            {
                return vm.value;
            }
            //监控属性
            vm.$watch("value", function (n, o) {
                vm.check()
                if (vm.check())
                {
                    vm.onChange(n, o);
                }
            })
        },
        $dispose: function (vm, element)
        {
            element.innerHTML = "";
        }

    })

    return avalon
})


//
