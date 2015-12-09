define(["avalon", "text!./sui.textbox.html", "css!../sui-input-common.css", "css!./sui.textbox.css"], function (avalon, template) {

    var _interface = function () {
    };

    avalon.component("sui:textbox", {
        //内部变量
        _focusing: false, //是否获得焦点
        _msg: "",
        _showNoticeImage: false,
        //内部方法
        _blur: _interface,
        _focus: _interface,
        _keyup: _interface,
        _keydown: _interface,
        _keypress: _interface,
        //回调方法
        onInit: _interface, //必须定义此接口
        onChange: _interface, //值修改时触发外部事件
        onFocus: _interface,
        onBlur: _interface,
        onKeydown: _interface,
        onKeyup: _interface,
        onKeypress: _interface,
        //公有方法
        check: _interface,
        setFocus: _interface,
        getValue: _interface,
        //配置项
        inputid: "", //文本框id
        title: "", //标签标题
        value: "", //默认值
        msg: "该项为必填项", //默认提示信息    
        require: false, //是否必填项  
        disabled: false, //是否禁用
        readonly: false, //是否只读
        visible: true, //是否可见
        styleType: "normal", //文本框风格
        width: 0, //自定义文本框宽度
        height: 0, //自定义文本框高度
        customRegex: "", //自定义正则表达式
        regexType: "", //控件内置校验类型
        maxLength: "", //文本框最大长度 功能需要修改
        regexErrMsg: "", //自定义校验错误信息
        theme: "default",
        type: "text", //文本框类型，text,textarea,password 
        isShowNoticeImage: false,
        placeholder: "",
        isShowMsg: true, //是否显示提示信息
        //模板
        $template: template,
        //替换自定义标签
        $replace: 1,
        $construct: function (defaultConfig, vmConfig, eleConfig) {
            var options = avalon.mix(defaultConfig, vmConfig, eleConfig)
            if (options.width == 0)
            {
                options.width = "";
            }
            if (options.height == 0)
            {
                options.height = "";
            }
            return options
        },
        $init: function (vm) {
            vm._msg = vm.msg;
            vm.title = vm.title + "：";
            if (vm.require && vm.value == "")
            {
                vm.msg = "*";
            }
            else
            {
                vm.msg = "";
            }
            //监控属性
            vm.$watch("value", function (n, o) {
                if (vm.check())
                {
                    vm.onChange(n, o)
                }
            })
        },
        $ready: function (vm, element) {
            vm.onInit(vm);
            vm.check = function ()
            {
                //校验是否必填项
                if (vm.require && vm.value == "")
                {
                    vm._showNoticeImage = true;
                    vm.msg = vm._msg;
                    return false;
                }
                else
                {
                    vm._showNoticeImage = false;
                    vm.msg = "";
                }
                
                //校验长度
                if (vm.maxLength && vm.value != "")
                {
                    if (vm.type != "textarea")
                    {
                        var tmpreg = "^.{0," + vm.maxLength + "}$";
                    }
                    else
                    {
                        var tmpreg = "^[\\s\\S\\n\\r]{0," + vm.maxLength + "}$";
                    }
                    var re = new RegExp(tmpreg);
                    if (!re.test(vm.value))
                    {
                        vm._showNoticeImage = true;
                        vm.msg = "请少于" + vm.maxLength + "个字符";
                        return false;
                    }
                    else
                    {
                        vm._showNoticeImage = false;
                        vm.msg = "";
                    }
                }

                //校验自定义正则
                if (vm.customRegex != "" && vm.value != "")
                {
                    var re = new RegExp(vm.customRegex);
                    if (!re.test(vm.value))
                    {
                        vm._showNoticeImage = true;
                        vm.msg = vm.regexErrMsg;
                        return false;
                    }
                    else
                    {
                        vm._showNoticeImage = false;
                        vm.msg = "";
                        return true;
                    }
                }

                //校验类型
                if (vm.regexType != "" && vm.value != "")
                {
                    var tmpMsg = checkTextType(vm.regexType, vm.value);
                    if (tmpMsg != undefined)
                    {
                        vm._showNoticeImage = true;
                        if (vm.regexErrMsg != "")
                        {
                            vm.msg = vm.regexErrMsg;
                        }
                        else
                        {
                            vm.msg = tmpMsg;
                        }
                        return false;
                    }
                    else
                    {
                        vm._showNoticeImage = false;
                        vm.msg = "";
                    }
                }
                return true;
            }
            vm._blur = function (e)
            {
                vm._focusing = false;
                vm.onBlur(e);
                vm.check();
            }
            vm._keyup = function (e)
            {
                vm.onKeyup(e);
            }
            vm._keydown = function (e)
            {
                vm.onKeydown(e);
            }
            //vm._keydown=vm.bindKeydown;
            vm._keypress = function (e)
            {
                vm.onKeypress(e);
            }
            vm._focus = function (e)
            {
                vm._focusing = true;
                vm.onFocus(e);
            }
            vm.setFocus = function ()
            {
                if (vm.inputid)
                {
                    document.getElementById(vm.inputid).focus();
                }
            }
            vm.getValue = function ()
            {
                if (vm.check())
                {
                    return vm.value;
                }
                else
                {
                    vm.setFocus();
                    throw vm.msg;
                }
            }
        },
        $dispose: function (vm, element)
        {
            element.innerHTML = "";
        }

    })

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
            case "idcard":
                if (!idCard(value))
                {
                    return "请输入正确的身份证号";
                }
                break;
            case "date":
                if (!isCorrectDate(value))
                {
                    return "请输入正确的日期格式";
                }
                break;
            case "alpha":
                if (!/^[a-z]+$/i.test(value))
                {
                    return "请输入字母";
                }
                break;
            case "alpha_numeric":
                if (!/^[a-z0-9]+$/i.test(value))
                {
                    return "请输入字母或数字";
                }
                break;
            case "alpha_dash":
                if (!/^[a-z0-9_\-]+$/i.test(value))
                {
                    return "请输入字母或数字及下划线等特殊字符";
                }
                break;             
            default:
                return  "不支持的验证类型";
                break;
        }
    }

    function idCard(val)
    {
        if ((/^\d{15}$/).test(val)) {
            return true;
        } else if ((/^\d{17}[0-9xX]$/).test(val)) {
            var vs = "1,0,x,9,8,7,6,5,4,3,2".split(","),
                    ps = "7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2".split(","),
                    ss = val.toLowerCase().split(""),
                    r = 0;
            for (var i = 0; i < 17; i++) {
                r += ps[i] * ss[i];
            }
            return (vs[r % 11] == ss[17]);
        }
    }

    function isCorrectDate(value)
    {
        if (typeof value === "string" && value) { //是字符串但不能是空字符
            var arr = value.split("-") //可以被-切成3份，并且第1个是4个字符
            if (arr.length === 3 && arr[0].length === 4) {
                var year = ~~arr[0] //全部转换为非负整数
                var month = ~~arr[1] - 1
                var date = ~~arr[2]
                var d = new Date(year, month, date)
                return d.getFullYear() === year && d.getMonth() === month && d.getDate() === date
            }
        }
        return false
    }

    return avalon
})


//
