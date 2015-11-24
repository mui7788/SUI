define(["avalon", "text!./avalon.input.html", "css!./avalon.input.css"], function (avalon, template) {

    var _interface = function () {
    };
    avalon.component("ms:input", {
        //内部变量
//        _readonly: false,
//        _disabled: false,
        _notice: "",
        _regexErrorNotice:"",
        //内部方法
        _blur: _interface,
        _focus: _interface,
        onInit:function(){},//必须定义此接口
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
        textType:"",
        //类型校验错误信息
        regexErrorNotice:"请输入正确的类型",
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
            vm._regexErrorNotice=vm.regexErrorNotice;
            vm.regexErrorNotice="";
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
            vm.onInit(vm);
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
                
                //校验类型
                if(vm.textType!="")
                {
                    switch(vm.textType)
                    {
                        case "number":
                            break;
                        case "int":
                            break;
                        default:
                            vm.regexErrorNotice="不支持的验证类型"
                            break;
                    }
                    if(vm.regexErrorNotice!="")
                    {
                        vm.notice=vm.regexErrorNotice;
                    }
                }
                
            }
            vm._focus = function ()
            {

            }
//            vm.$watch("isDisabled",function(n,o){
//                alert(n)
//            })
        },
        $dispose:function(vm,element)
        {
            element.innerHTML="";
        }

    })
    return avalon
})