define(["avalon", "text!./avalon.checkbox.html", "css!./avalon.checkbox.css"], function (avalon, template) {

    var _interface = function () {
    };

    avalon.component("ms:checkbox", {
        //内部变量
        _notice: "",
        _showNoticeImage: false,
        _focusing: false,
        //内部方法
        _blur: _interface,
        _focus: _interface,
        _keyup: _interface,
        _click:_interface,
        //回调方法
        onInit: _interface, //必须定义此接口
        onChange: _interface, //值修改时触发外部事件
        onClick:_interface, //点击某一项时触发
        check: _interface,
        getValue:_interface,
        //配置项
        did: "",
        title: "",
        value: [],
        notice: "请至少选择一项",
        data: [],
        isRequired: false,
        isDisabled: false,
        theme: "default",
        isShowNoticeImage: false,
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
            //设置默认值后，触发外部事件。
            //vm.onChange(vm.value)
        },
        $ready: function (vm, element) {
            vm.onInit(vm);
            vm._click=function(e,index)
            {
                vm.onClick(e,vm.$model.value,index);
            }
            vm.check = function ()
            {
                if (vm.isRequired)
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
                else
                {
                    vm._showNoticeImage = false;
                    vm.notice = "";
                    return true;
                }

            }
            vm.getValue=function()
            {
                return vm.value;
            }
            //监控属性
            vm.$watch("value.length", function (n, o) {
                if (vm.value.length == 0)
                {
                    if (vm.isRequired)
                    {
                        vm._showNoticeImage = false;
                        vm.notice = vm._notice;
                    }
                }
                else
                {
                    vm.notice = "";
                }
                vm.onChange(n, o, vm.value);
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
