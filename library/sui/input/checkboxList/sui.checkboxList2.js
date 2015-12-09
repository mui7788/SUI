define(["avalon", "text!./sui.checkboxList.html", "css!../sui-input-common.css", "css!./sui.checkboxList.css"], function (avalon, template) {

    var _interface = function () {
    };

    avalon.component("sui:checkboxlist", {
        //内部变量
        _focusing: false, //是否获得焦点
        _msg: "",
        _showNoticeImage: false,
        _isClick: false, //判断是否是点击checkbox某一项按钮触发all回调
        //内部方法
        _click: _interface,
        _clickAll: _interface,
        _clickAllCheckbox: _interface,
        //回调方法
        onInit: _interface, //必须定义此接口
        onChange: _interface, //值修改时触发外部事件
        //公有方法
        check: _interface,
        getValue: _interface,
        //配置项
        inputid: "", //文本框id
        title: "", //标签标题
        value: [], //默认值
        data: [],
        msg: "请至少选择一项", //默认提示信息
        require: false, //是否必填项  
        disabled: false, //是否禁用
        visible: true, //是否可见
        theme: "default",
        isShowNoticeImage: false,
        isShowMsg: true, //是否显示提示信息
        count: 1, //每行显示个数
        isShowAll: false, //是否显示全选按钮
        all: false,
        //模板
        $template: template,
        //替换自定义标签
        $replace: 1,
        $construct: function (defaultConfig, vmConfig, eleConfig) {
            var options = avalon.mix(defaultConfig, vmConfig, eleConfig)
            return options
        },
        $init: function (vm) {
            vm.all = vm.value.length === vm.data.length;
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
        },
        $ready: function (vm, element) {
            vm._clickAllCheckbox = function ()
            {
                vm._isClick = false;
            }
            vm._click = function (e, index)
            {
                vm._isClick = true;
                //vm.all = vm.value.length === vm.data.length;
                setTimeout(function () {
                    vm.all = vm.value.length === vm.data.length;
                    vm.onChange(e, vm.value, index)
                }, 0)
            }
            vm._clickAll = function (e)
            {
                vm.value = []
                if (vm.all)
                {
                    var tmpArr = [];
                    avalon.each(vm.data, function (i, listItem) {
                        tmpArr.push(listItem.value || listItem)
                    })
                    vm.value = tmpArr;
                }

                setTimeout(function () {
                    vm.onChange(e, vm.value);
                }, 0)

            }
            vm.check = function ()
            {
                if (vm.require)
                {
                    if (vm.value.length == 0)
                    {
                        vm._showNoticeImage = true;
                        vm.msg = vm._msg;
                        return false;
                    }
                    else
                    {
                        vm._showNoticeImage = false;
                        vm.msg = "";
                        return true;
                    }
                }
                else
                {
                    vm._showNoticeImage = false;
                    vm.msg = "";
                    return true;
                }

            }
            vm.getValue = function ()
            {
                return vm.value;
            }
            //监控属性
            vm.$watch("value.length", function (n, o) {
                vm.check();
            })
            //临控全选属性
            vm.$watch("all", function () {
                if (vm.all || (vm._isClick==false && vm.all==false))
                {
                    vm._isClick=false;
                    vm._clickAll();
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
