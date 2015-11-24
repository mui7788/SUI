define(["avalon", "text!./avalon.input.html", "css!./avalon.input.css"], function (avalon, template) {

    var _interface = function () {
    };

    function checkTextType(type, value)
    {
        switch (type)
        {
            case "decimal":
                if (!/^\-?\d*\.?\d+$/.test(value))
                {
                    return "请输入小数";
                }
                break;
            case "int":
                if (!/^\-?\d+$/.test(value))
                {
                    return  "请输入整型数字";
                }
                break;
            case "chs":
                if (!/^[\u4e00-\u9fa5]+$/.test(value))
                {
                    return "请输入中文";
                }
                break;
            case "url":
                if (!/^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/.test(value))
                {
                    return "请输入正确的网址";
                }
                break;
            case "email":
                if (!/^([A-Z0-9]+[_|\_|\.]?)*[A-Z0-9]+@([A-Z0-9]+[_|\_|\.]?)*[A-Z0-9]+\.[A-Z]{2,3}$/i.test(value))
                {
                    return "请输入正确的email";
                }
                break;
            default:
                return  "不支持的验证类型";
                break;
        }
    }

    avalon.component("ms:input", {
        //内部变量
        _notice: "",
        _regexErrorNotice: "",
        //内部方法
        _blur: _interface,
        _focus: _interface,
        onInit: _interface, //必须定义此接口
        _check:_interface,
        //配置项
        title: "",
        value: "",
        notice: "该项为必填项",
        isRequired: false,
        isDisabled: false,
        isReadonly: false,
        widthType: "normal",
        //自定义正则表达式
        regexContet: "",
        //文本类型
        textType: "",
        //类型校验错误信息
        regexErrorNotice: "",
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
            vm._regexErrorNotice = vm.regexErrorNotice;
            vm.regexErrorNotice = "";
            vm.title = vm.title + "：";
            if (vm.isRequired && vm.value.trim() == "")
            {
                vm.notice = "*";
            }
            else
            {
                vm.notice = "";
            }
        },
        $ready: function (vm, element) {
            vm.onInit(vm);
            vm._check=function()
            {
                 if (vm.isRequired && this.value.trim() == "")
                {
                    vm.notice = vm._notice;
                    return;
                }
                else
                {
                    vm.notice = "";
                }

                //校验类型
                vm.regexErrorNotice = "";
                if (vm.textType != "" && this.value.trim() != "")
                {
                    vm.regexErrorNotice = checkTextType(vm.textType, this.value);
                    if (vm.regexErrorNotice != "")
                    {
                        if (vm._regexErrorNotice != "")
                        {
                            vm.notice = vm._regexErrorNotice;
                        }
                        else
                        {
                            vm.notice = vm.regexErrorNotice;
                        }
                    }
                }
            }
            vm._blur = function ()
            {
               vm._check();
            }
            vm._focus = function ()
            {

            }
            //            vm.$watch("isDisabled",function(n,o){
            //                alert(n)
            //            })
        },
        $dispose: function (vm, element)
        {
            element.innerHTML = "";
        }

    })
    return avalon
})