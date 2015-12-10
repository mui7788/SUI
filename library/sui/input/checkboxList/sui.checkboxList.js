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
        tmpData: [], //根据count每行显示数量动态设置2维数组,0时不启用
        msg: "请至少选择一项", //默认提示信息
        require: false, //是否必填项  
        disabled: false, //是否禁用
        visible: true, //是否可见
        theme: "default",
        isShowNoticeImage: false,
        isShowMsg: true, //是否显示提示信息
        count: 0, //每行显示个数
        isShowAll: false, //是否显示全选按钮
        all: false, //全选按钮值
        width:0, //checkboxlist容器宽度，为0自动延身,当设置高度后如果显示内容超出高度自动出滚动条
        height:0, //checkboxlist容器高度，为0自动延身,当设置高度后如果显示内容超出高度自动出滚动条
        itemWidth:80, //checkbox 项宽度，包含checkbox选择框，count为0时失效
        isControlItem:true, //是否控制checkbox项宽度 true控制宽度为itemWidth,count为0时失效
        //模板
        $template: template,
        //替换自定义标签
        $replace: 1,
        $construct: function (defaultConfig, vmConfig, eleConfig) {
            var options = avalon.mix(defaultConfig, vmConfig, eleConfig)
            //查看是否自定义宽高
            if(options.width==0)
            {
                options.width="";
            }
            if(options.height==0)
            {
                options.height="";
            }
            if(!options.isControlItem)
            {
                options.itemWidth="";
            }
            //把data平配到数组中
            if (options.count != 0 && options.data && options.data.length > 0)
            {
                var tmpData = [];
                for (var i = 0; i < options.count; i++)
                {
                    tmpData.push([]);
                }
                var i = 0;
                avalon.each(options.data, function (index, item) {

                    if (typeof item == "object")
                    {
                        item['index'] = index;
                        tmpData[i].push(item);
                    }
                    else
                    {
                        var tmpObj = null;
                        tmpObj = {text: item, value: item, index: index};
                        tmpData[i].push(tmpObj);
                    }

                    i = i + 1;
                    if (i >= options.count)
                    {
                        i = 0;
                    }
                })
                options.tmpData = tmpData;
                avalon.log(tmpData);
            }
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
                //vm._isClick = false;
                vm._clickAll();
            }
            vm._click = function (e, index)
            {
                vm._isClick = true;
                vm.all = vm.value.length === vm.data.length;
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
                if (vm.check())
                {
                    return vm.value;
                }
                else
                {
                    throw vm._msg;
                }
            }
            //监控属性
            vm.$watch("value.length", function (n, o) {
                vm.check();
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
