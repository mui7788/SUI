define(["avalon", "text!./avalon.input.html", "css!./avalon.input.css"], function (avalon, template) {

    var _interface = function () {
    };

    avalon.component("ms:input", {
        //内部变量
        _focusing:false,
        _notice: "",
        //内部方法
        _blur: _interface,
        _focus: _interface,
        onInit: _interface, //必须定义此接口
        check: _interface,
        //配置项
        title: "",
        value: "",
        notice: "该项为必填项",
        isRequired: false,
        isDisabled: false,
        isReadonly: false,
        widthType: "normal",
        //自定义正则表达式
        regexContent: "",
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
            vm.check = function ()
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

                //校验自定义正则
                if(vm.regexContent!="" && this.value.trim() != "")
                {
                    var re = new RegExp(vm.regexContent);
                    if(!re.test(this.value.trim()))
                    {
                        vm.notice = vm.regexErrorNotice;
                        return;
                    }
                    else
                    {
                        vm.notice="";
                    }
                  
                }

                //校验类型
                if (vm.textType != "" && this.value.trim() != "")
                {
                    var msg = checkTextType(vm.textType, this.value);
                    if (msg != "")
                    {
                        if (vm.regexErrorNotice != "")
                        {
                            vm.notice = vm.regexErrorNotice;
                        }
                        else
                        {
                            vm.notice = msg;
                        }
                    }
                }
            }
            vm._blur = function ()
            {
                vm._focusing=false;
                vm.check();
            }
            vm._focus = function ()
            {
                   vm._focusing=true;
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
    
    function setFocus(element)
    {
        //var input = element.children[1];
        //input.focus()
    }
    function setlostFocus(element)
    {
        //var input = element.children[1];
        //input.blur();
    }

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

    return avalon
})