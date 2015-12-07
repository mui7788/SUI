define(["avalon", "text!./sui.textbox.html", "css!../sui-input-common.css", "css!./sui.textbox.css"], function (avalon, template) {

    var _interface = function () {
    };

    avalon.component("sui:textbox", {
        //内部变量
        _focusing: false,
        _notice: "",
        _showNoticeImage: false,
        //内部方法
        _blur: _interface,
        _focus: _interface,
        _keyup: _interface,
        _keydown: _interface,
        _keypress: _interface,
        onInit: _interface, //必须定义此接口
        onChange: _interface, //值修改时触发外部事件
        onFocus: _interface,
        onKeydown: _interface,
        onKeyup: _interface,
        check: _interface,
        setFocus: _interface,
        setVisible: _interface,
        //配置项
        did: "",
        title: "",
        value: "",
        notice: "该项为必填项",
        isRequired: false,
        isDisabled: false,
        isReadonly: false,
        widthType: "normal",
        width: 0,
        height: 0,
        //自定义正则表达式
        regexContent: "",
        //校验类型
        regexType: "",
        //类型校验错误信息
        regexErrorNotice: "",
        theme: "default",
        type: "text",
        isShowNoticeImage: false,
        visible: true,
        maxlength: "",
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
            vm._notice = vm.notice;
            vm.title = vm.title + "：";
            if (vm.isRequired && vm.value == "")
            {
                vm.notice = "*";
            }
            else
            {
                vm.notice = "";
            }
            //监控属性
            vm.$watch("value", function (n, o) {
                vm.onChange(n, o)
                vm.check();
            })
        },
        $ready: function (vm, element) {
            vm.onInit(vm);
            vm.check = function ()
            {
                if (vm.isRequired && vm.value == "")
                {
                    vm._showNoticeImage = true;
                    vm.notice = vm._notice;
                    return false;
                }
                else
                {
                    vm._showNoticeImage = false;
                    vm.notice = "";
                }
                //校验长度
                if (vm.maxlength && vm.value != "")
                {
                    //var tmpreg = "^.{0," + vm.maxlength + "}$";
                    if (vm.type != "textarea")
                    {
                        var tmpreg = "^.{0," + vm.maxlength + "}$";
                    }
                    else
                    {
                        var tmpreg = "^[\s\S\n\r]{0," + vm.maxlength + "}$";
                    }
                    var re = new RegExp(tmpreg);
                    if (!re.test(vm.value))
                    {
                        vm._showNoticeImage = true;
                        vm.notice = "请少于" + vm.maxlength + "个字符";
                        return false;
                    }
                    else
                    {
                        vm._showNoticeImage = false;
                        vm.notice = "";
                    }
                }
                //校验自定义正则
                if (vm.regexContent != "" && vm.value != "")
                {
                    var re = new RegExp(vm.regexContent);
                    if (!re.test(vm.value))
                    {
                        vm._showNoticeImage = true;
                        vm.notice = vm.regexErrorNotice;
                        return false;
                    }
                    else
                    {
                        vm._showNoticeImage = false;
                        vm.notice = "";
                    }

                }

                //校验类型
                if (vm.regexType != "" && vm.value != "")
                {
                    var msg = checkTextType(vm.regexType, vm.value);
                    if (msg != undefined)
                    {
                        vm._showNoticeImage = true;
                        if (vm.regexErrorNotice != "")
                        {
                            vm.notice = vm.regexErrorNotice;
                        }
                        else
                        {
                            vm.notice = msg;
                        }
                        return false;
                    }
                    else
                    {
                        vm._showNoticeImage = false;
                        vm.notice = "";
                    }
                }
                return true;
            }
            vm._blur = function (e)
            {
                vm._focusing = false;
                vm.check();
            }
            vm._keyup = function (e)
            {
                vm.onKeyup(e);
                if (e.which == 13)
                {
                    //window.event.keyCode=9
                    e.target.blur();
                }
            }
            avalon.bind(element,"keydown",vm.bindKeydown)
            vm._keydown = function (e)
            {

//                window.event.keyCode = 0;
//                if (event.preventDefault)
//                {
//                    event.preventDefault();
//                }
//                else
//                {
//                    window.event.returnValue = false;
//                    return false; 
//                }
                vm.onKeydown(e);
            }
             //vm._keydown=vm.bindKeydown;

            vm._keypress = function (e)
            {
            }
            vm._focus = function (e)
            {
                vm._focusing = true;
                vm.onFocus();
            }
            vm.setFocus = function ()
            {
                if (vm.did)
                {
                    document.getElementById(vm.did).focus();
                }
            },
                    vm.setVisible = function (v)
                    {
                        vm.visible = v;
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

    function idCard(val) {
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

    function isCorrectDate(value) {
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
