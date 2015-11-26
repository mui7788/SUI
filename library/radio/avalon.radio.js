define(["avalon", "text!./avalon.radio.html","css!../sui-input-common.css", "css!./avalon.radio.css"], function (avalon, template) {

    var _interface = function () {
    };

    avalon.component("ms:radio", {
        //内部变量
        _notice: "",
        _showNoticeImage: false,
        _focusing: false,
        //内部方法
        _blur: _interface,
        _focus: _interface,
        _keyup: _interface,
        onInit: _interface, //必须定义此接口
        onChange: _interface, //值修改时触发外部事件
        check: _interface,
        setFocus: _interface,
        //配置项
        did: "",
        title: "",
        value: "",
        notice: "请选择一项",
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
            vm.onChange(vm.value)
        },
        $ready: function (vm, element) {
            vm.onInit(vm);
            vm._focus=function()
            {
               // vm._focusing=true;
            }
            vm.check = function ()
            {

                if (vm.value == "")
                {
                    vm._showNoticeImage = true;
                    vm.notice = vm._notice;
                    return false;
                }

                for (var i = 0; i < vm.data.length; i++)
                {
                    if (vm.data[i].value == vm.value)
                    {
                        return true
                        break;
                    }
                }

                vm._showNoticeImage = true;
                vm.notice = vm._notice;
                return false;
            }
            //监控属性
            vm.$watch("value", function (n, o) {
                vm.notice = "";
                vm.onChange(n, o);
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
