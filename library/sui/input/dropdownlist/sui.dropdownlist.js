define(["avalon", "text!./sui.dropdownlist.html", "css!../sui-input-common.css", "css!../textbox/sui.textbox.css", "css!./sui.dropdownlist.css"], function (avalon, template) {

    var _interface = function () {
    };

    avalon.component("sui:dropdownlist", {
        //内部变量
        _focusing: false,
        _msg: "",
        _showNoticeImage: false,
        _textWidth: 0, //文本框宽度
        _listHeight: 0, //最大高度
        _tempValue: [], //临时值
        _isHover: false, //是否移动
        _tempData: [], //临时数据,用于保存初始数据
        //内部方法
        _blur: _interface,
        _focus: _interface,
        _keyup: _interface,
        _keydown: _interface,
        _itemClick: _interface,
        _mouseover: _interface,
        onInit: _interface, //必须定义此接口
        onChange: _interface, //值修改时触发外部事件
        check: _interface,
        setFocus: _interface,
        getValue: _interface,
        _close: _interface,
        //配置项
        did: "",
        title: "",
        value: [],
        data: [],
        msg: "该项为必填项",
        require: false,
        disabled: false,
        readonly: false,
        visible: true,
        isShowMsg: true,
        width: 0,
        height: 0,
        theme: "default",
        styleType: "normal",
        isShowNoticeImage: false,
        isMultiple: false, //是否多选
        filterColumns:["text"], //过滤字段
        displayColumns:["text"], //单选显示文本
        valueColumn:"id", //值列
        titleColumns:[], //多列标题
        widthColumns:[],//多列列宽
        //模板
        $template: template,
        //替换自定义标签
        $replace: 0,
        $construct: function (defaultConfig, vmConfig, eleConfig) {
            var options = avalon.mix(defaultConfig, vmConfig, eleConfig)
            if (options.width == 0)
            {
                options.width = 152
                options._textWidth = (152 - 25);
            }
            if (options.data.length > 8)
            {
                options._listHeight = 8 * 25;
            }
            else
            {
                options._listHeight = "";
            }
            return options
        },
        $init: function (vm) {
            vm._msg = vm.msg;
            vm.title = vm.title + "：";
            vm._tempData = vm.data;
            if (vm.require && vm.value.length == 0)
            {
                vm.msg = "*";
            }
            else
            {
                vm.msg = "";
            }
            //监控属性
//            vm.$watch("value", function (n, o) {
//                vm.onChange(n, o)
//                vm.check()
//            })
            //监测data是否变化
            vm.$watch("data", function (n, o) {
                vm._tempData = vm.data;
            })
        },
        $ready: function (vm, element) {
            //给文本框赋初值。
            avalon.each(vm.data, function (index, item) {
                if (vm.value.indexOf(item.id) >= 0)
                {
                    if (vm.inputid && vm.isMultiple==false)
                    {
                        vm._tempValue=item[vm.displayColumns[0]];
                        document.getElementById(vm.inputid).value = item[vm.displayColumns[0]];
                    }
                }
            })

            vm.onInit(vm);
            
            var arr = [
                [document, "click", function (e) {
                        var target = e.target;
                        var container = document.getElementById("dropdownlist-container-" + vm.inputid)
                        if (vm._focusing && (container.contains(target)))
                        {

                        }
                        else
                        {
                            if (!vm.check())
                            {
                                //如果不正确清空value值
                                //vm.value = "";
                            }
                            vm._close();
                        }
                    }]
            ]
            vm.check = function ()
            {
                if (vm.require && vm.value.length == 0)
                {
                    vm.msg = vm._msg;
                    vm._showNoticeImage = true;
                    return false
                }

                return true;
            }
            vm._blur = function (e)
            {

            }
            vm._focus = function (e)
            {
                vm._isHover = false;
                if (vm.inputid)
                {
                    avalon.bind(arr[0][0], arr[0][1], arr[0][2])
                    if (!vm.readonly)
                    {
                        document.getElementById(vm.inputid).value = "";
                    }
                }
                vm._focusing = true;

            }
            vm._keydown = function (e)
            {

            }
            vm._keyup = function (e)
            {
                if (!vm.readonly)
                {
                    var tmpv = e.target.value;
                    var tmparr = [];
                    avalon.each(vm.data, function (index, item) {
                        if (item.text.indexOf(tmpv) >= 0)
                        {
                            tmparr.push(item);
                        }
                    })
                    vm._tempData = tmparr;
                }
            }
            vm._mouseover = function (e)
            {
                vm._isHover = true;
            }
            vm._close = function ()
            {
                
                 if (vm.inputid)
                {
                    document.getElementById(vm.inputid).value = vm._tempValue;
                }
                vm._focusing = false;
                if (vm.inputid)
                {
                    avalon.unbind(arr[0][0], arr[0][1], arr[0][2])
                }
            }
            vm._itemClick = function (e, index)
            {
                vm.value.removeAll()
                vm.value.push(vm._tempData[index][vm.valueColumn]);
                vm._tempValue = vm._tempData[index][vm.displayColumns[0]];

                vm._focusing = false;
                vm._isHover = false;
//                if(vm._tempData.length!=vm.data.length)
//                {
                vm._tempData = vm.data
//                }
            }
            vm.setFocus = function ()
            {
                if (vm.inputid)
                {
                    var target = document.getElementById(vm.inputid)
                    target.focus();
                    vm._focusing = true;
                }
            }
            vm.getValue = function ()
            {
                if (vm.check())
                {
//                    return vm.isShowSecond ? vm.value : vm.value + ":00";
                }
                else
                {
                    throw vm.msg;
                }
            }
        },
        $dispose: function (vm, element)
        {
            element.innerHTML = "";
        }

    })


    return avalon
})

//
