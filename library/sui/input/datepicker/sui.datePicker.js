define(["avalon", "text!./sui.datePicker.html", "css!../sui-input-common.css", "css!../textbox/sui.textbox.css", "css!./sui.datePicker.css"], function (avalon, template) {

    var _interface = function () {
    };

    avalon.component("sui:datepicker", {
        //内部变量
        _focusing: false,
        _msg: "",
        _showNoticeImage: false,
        _showDateGrid: false,
        _weekName: ["日", "一", "二", "三", "四", "五", "六"],
        _days: [], //日期数组长度42，包含上月及下月日期
        _year: 0, //当前年份
        _month: 0, //当前月份
        _day: 0, //当前日期
        _hour: 0, //当前小时
        _minute: 0, //当前分钟
        _second: 0, //当前秒
        _syear: 0, //用户移动选择年份
        _smonth: 0, //用户移动选择月份
        _sday: 0, //用户移动选择日期
        _cyear: 0, //默认值年份
        _cmonth: 0, //默认值月份
        _cday: 0, //默认值日期
        _chour: 0, ///默认值小时
        _cminute: 0, ///默认值分钟
        _csecond: 0, ///默认值秒
        _keydownBlur: false, //由于_keydown引起的blur
        __days:[], //记录日期数组
        //内部方法
        _blur: _interface,
        _focus: _interface,
        _keyup: _interface,
        _keydown: _interface,
        _dayClick: _interface, //日期单击
        _timeClick: _interface, //时间单击
        _collectTime: _interface, //收集时间
        _setPicker: _interface,
        _closePicker: _interface,
        _inputKeydown:_interface,
        onInit: _interface, //必须定义此接口
        onChange: _interface, //值修改时触发外部事件
        check: _interface,
        setFocus: _interface,
        getValue:_interface,
        //配置项
        did: "",
        title: "",
        value: "",
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
        isShowTime: false,
        isShowSecond: true,
        //模板
        $template: template,
        //替换自定义标签
        $replace: 0,
        $construct: function (defaultConfig, vmConfig, eleConfig) {
            var options = avalon.mix(defaultConfig, vmConfig, eleConfig)
            if(options.value && options.isShowTime && options.isShowSecond==false)
            {
                options.value=convertDateTime(options.value,options.isShowSecond)
            }
            return options
        },
        $init: function (vm) {
            vm._msg = vm.msg;
            vm.title = vm.title + "：";
            if (vm.require && vm.value.trim() == "")
            {
                vm.msg = "*";
            }
            else
            {
                vm.msg = "";
            }

            var currentDate = new Date();
            vm._year = currentDate.getFullYear();
            vm._month = currentDate.getMonth();
            vm._day = currentDate.getDate();
            vm._hour = currentDate.getHours();
            vm._minute = currentDate.getMinutes();
            vm._second = currentDate.getSeconds();

            //监控属性
            vm.$watch("value", function (n, o) {
                //手工输入验证有效性
                if (n)
                {
                    if (isCorrectDateTime(n, vm.isShowTime, vm.isShowSecond))
                    {
                        vm._focusing = true;
                        setPicker(vm);
                    }
                    else
                    {
                        vm._cyear = 0;
                        vm._cmonth = 0;
                        vm._cday = 0;
                        vm._chour = 0;
                        vm._cminute = 0;
                        vm._csecond = 0;

                    }
                }
                else
                {
                    vm._cyear = 0;
                    vm._cmonth = 0;
                    vm._cday = 0;
                    vm._chour = 0;
                    vm._cminute = 0;
                    vm._csecond = 0;
                }
                vm.onChange(vm.isShowTime && vm.isShowSecond?n:n+":00", o)
                vm.check()
            })

        },
        $ready: function (vm, element) {
            vm.onInit(vm);
            var arr = [
                [document, "click", function (e) {
                        var target = e.target;
                        var container = document.getElementById("datepicker-container-" + vm.inputid)
                        if (vm._focusing && (container.contains(target)))
                        {

                        }
                        else
                        {
                            if (!vm.check())
                            {
                                //vm.value = "";
                            }
                            vm._closePicker();
                        }
                    }]
            ]
            vm.check = function ()
            {
                if (vm.require && vm.value == "")
                {
                    vm.msg = vm._msg;
                    vm._showNoticeImage = true;
                    return false
                }

                if (vm.value)
                {
                    if (isCorrectDateTime(vm.value, vm.isShowTime, vm.isShowSecond))
                    {
                        vm.msg = "";
                        vm._showNoticeImage = false;
                        return true;
                    }
                    else
                    {
                        vm.msg = "请输入正确的日期";
                        vm._showNoticeImage = true;
                        return false;
                    }
                }
                return true;
            }
            vm._blur = function (e)
            {
                if (!vm._keydownBlur)
                {
                    if (!vm.isShowTime)
                    {
                        if (vm.value && isCorrectDateTime(vm.value, vm.isShowTime, vm.isShowSecond))
                        {
                            vm.value = convertDate(vm.value)
                        }
                    }
                    else
                    {
                        if (vm.value && isCorrectDateTime(vm.value, vm.isShowTime, vm.isShowSecond))
                        {
                            vm.value = convertDateTime(vm.value,vm.isShowSecond)
                        }
                    }
                }
                vm._keydownBlur = false;

            }
            vm._focus = function (e)
            {
                e.target.select();
                avalon.bind(arr[0][0], arr[0][1], arr[0][2])
                vm._focusing = true;
                setPicker(vm);

            }
            vm._keydown = function (e)
            {
                //alert(e.keyCode+"-" +e.shiftKey);
                //允许数字:- 退格键 del键 回车键 esc键
                if ((((e.which >= 48 && e.which <= 57) || e.which == 32 || e.which == 8 || e.which == 46 || e.which == 189) && e.shiftKey == false) || (e.shiftKey && e.which == 186) || e.which == 13 || e.which == 27)
                {
                    if (e.which == 13 || e.which == 27)
                    {
                        if (vm.value && isCorrectDateTime(vm.value, vm.isShowTime, vm.isShowSecond))
                        {
                            if (!vm.isShowTime)
                            {
                                vm.value = convertDate(vm.value);
                            }
                            else
                            {
                                vm.value = convertDateTime(vm.value,vm.isShowSecond);
                            }
                        }
                        vm._closePicker();
                        vm._keydownBlur = true;
                        e.target.blur();
                        //e.target.parentElement.focus();
                    }
                }
                else
                {
                   // window.event.keyCode = 0;
                    if (event.preventDefault)
                    {
                        event.preventDefault();
                    }
                    else
                    {
                        window.event.returnValue = false;
                        return false;
                    }
                }

            }
            vm._inputKeydown=function(e)
            {
                if ((((e.which >= 48 && e.which <= 57) || e.which == 8 || e.which == 46) && e.shiftKey == false))
                {

                }
                else
                {
                   // window.event.keyCode = 0;
                    if (event.preventDefault)
                    {
                        event.preventDefault();
                    }
                    else
                    {
                        window.event.returnValue = false;
                        return false;
                    }
                }
            }
            vm._dayClick = function (e, v, y, m, d)
            {
                if (!vm.isShowTime)
                {
                    vm.value = convertDate(v);
                    vm._closePicker();
                }
                else
                {
                    vm._cyear = y;
                    vm._cmonth = m;
                    vm._cday = d;
                }
            }
            vm._timeClick = function (e)
            {
                vm._collectTime();
                vm._closePicker();
            }
            vm._setPicker = function (y, m, d)
            {
                setPicker(vm, y, m, d)
            }
            vm._closePicker = function ()
            {
                vm._focusing = false;
                avalon.unbind(arr[0][0], arr[0][1], arr[0][2])
            }
            vm._collectTime = function ()
            {
                if (vm._cyear == 0)
                {
                    var tmpmonth = vm._month + 1 + "";
                    tmpmonth = tmpmonth.length == 1 ? "0" + tmpmonth : tmpmonth;
                    var tmpday = (vm._day + "").length == 1 ? "0" + vm._day : vm._day;
                    var tmpdate = vm._year + "-" + tmpmonth + "-" + tmpday;
                }
                else
                {
                    var tmpmonth = vm._cmonth + 1 + "";
                    tmpmonth = tmpmonth.length == 1 ? "0" + tmpmonth : tmpmonth;
                    var tmpday = (vm._cday + "").length == 1 ? "0" + vm._cday : vm._cday;
                    var tmpdate = vm._cyear + "-" + tmpmonth + "-" + tmpday;
                }
                var tmphour = (vm._chour + "").length == 1 ? "0" + vm._chour : vm._chour;
                var tmpminute = (vm._cminute + "").length == 1 ? "0" + vm._cminute : vm._cminute;
                var tmpsecond = (vm._csecond + "").length == 1 ? "0" + vm._csecond : vm._csecond;
                
                var tmptime = tmphour + ":" + tmpminute + (vm.isShowSecond?":" + tmpsecond:"");
                vm.value = tmpdate + " " + tmptime;
            }
            vm.setFocus=function()
            {
                if(vm.inputid)
                {
                var target=document.getElementById(vm.inputid)
                target.focus();
                vm._focusing=true;
                }
            }
            vm.getValue=function()
            {
                if(vm.check())
                {
                   return vm.isShowSecond?vm.value:vm.value+":00";
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

    function isCorrectDateTime(value, isShowTime, isShowSecond)
    {
        if (!isShowTime)
        {
            return isCorrectDate(value)
        }
        else
        {
            var tmpdate = null;
            var tmptime = null;
            if (value.indexOf("-") > 0 && value.indexOf(":") > 0 && value.indexOf(" ") > 0)
            {
                var tmparr = value.split(" ");
                tmpdate = tmparr[0];
                tmptime = tmparr[1];
            }
            else
            {
                if (value.length == 14)
                {
                    tmpdate = value.substr(0, 8);
                    tmptime = value.substr(8, 6);
                }
                if (value.length == 12 && isShowSecond==false)
                {
                    tmpdate = value.substr(0, 8);
                    tmptime = value.substr(8, 4);
                }
            }
            return isCorrectDate(tmpdate) && isCorrentTime(tmptime, isShowSecond)
        }
    }

//验证时间格式 时间格式允许 22:12:00 或 221200
    function isCorrentTime(value, isShowSecond)
    {
        if (typeof value === "string" && value)
        {
            if (value.indexOf(":") > 0)
            {
                var arr = value.split(":");
                if (arr.length === 3)
                {
                    var currentHour = ~~arr[0];
                    var currentMinute = ~~arr[1];
                    var currentSecond = ~~arr[2];
                    if (currentHour >= 0 && currentHour <= 23 && currentMinute >= 0 && currentMinute <= 59 && currentSecond >= 0 && currentSecond <= 59)
                    {
                        return true;
                    }
                }
                if(arr.length===2 && isShowSecond==false)
                {
                    var currentHour = ~~arr[0];
                    var currentMinute = ~~arr[1];
                    if (currentHour >= 0 && currentHour <= 23 && currentMinute >= 0 && currentMinute <= 59)
                    {
                        return true;
                    }
                }
            }
            else
            {
                if (value.length == 6)
                {
                    var currentHour = ~~value.substr(0, 2);
                    var currentMinute = ~~value.substr(2, 2);
                    var currentSecond = ~~value.substr(4, 2);
                    if (currentHour >= 0 && currentHour <= 23 && currentMinute >= 0 && currentMinute <= 59 && currentSecond >= 0 && currentSecond <= 59)
                    {
                        return true;
                    }
                }
                if (value.length == 4)
                {
                    var currentHour = ~~value.substr(0, 2);
                    var currentMinute = ~~value.substr(2, 2);
                    if (currentHour >= 0 && currentHour <= 23 && currentMinute >= 0 && currentMinute <= 59 )
                    {
                        return true;
                    }
                }                
            }
        }

        return false
    }

//是否正确的日期格式允许 "2015-12-16"或 20151216
    function isCorrectDate(value) {
        if (typeof value === "string" && value) { //是字符串但不能是空字符

            if (value.indexOf("-") > 0)
            {
                var arr = value.split("-") //可以被-切成3份，并且第1个是4个字符
                if (arr.length === 3 && arr[0].length === 4) {
                    var year = ~~arr[0] //全部转换为非负整数
                    var month = ~~arr[1] - 1
                    var date = ~~arr[2]
                    var d = new Date(year, month, date)
                    return d.getFullYear() === year && d.getMonth() === month && d.getDate() === date
                }
            }
            else
            {
                if (value.length == 8)
                {
                    var year = ~~value.substr(0, 4) //全部转换为非负整数
                    var month = ~~value.substr(4, 2) - 1
                    var date = ~~value.substr(6, 2)
                    var d = new Date(year, month, date)
                    return d.getFullYear() === year && d.getMonth() === month && d.getDate() === date
                }
            }
        }
        return false
    }

//判断是否润年
    function isLeapYear(pYear)
    {
        if ((pYear % 4 == 0 && pYear % 100 != 0) || (pYear % 100 == 0 && pYear % 400 == 0)) {
            return true;
        } else {
            return false;
        }
    }

//取月份天数
    function getMonthDays(pYear, pMonth)
    {
        switch (pMonth)
        {
            case 0:
            case 2:
            case 4:
            case 6:
            case 7:
            case 9:
            case 11:
                return 31;
                break;
            case 3:
            case 5:
            case 8:
            case 10:

                return 30;
                break;
            case 1:
                if (isLeapYear(pYear))
                {
                    return 29;
                }
                else
                {
                    return 28;
                }
                break;
            default:
                throw "月份不正确";
                break;
        }
    }
    
//转换长日期格式
    function convertDate(pDate)
    {
        if (typeof pDate == "object" || (typeof pDate == "string" && pDate.indexOf("-") > 0))
        {
            if (typeof pDate == "object")
            {
                var currentDate = new Date(pDate);
                var currentYear = currentDate.getFullYear();
                var currentMonth = currentDate.getMonth() + 1 + "";
                var currentDay = currentDate.getDate() + "";
            }
            else
            {
                arr = pDate.split("-");
                var currentYear = ~~arr[0] //全部转换为非负整数
                var currentMonth = ~~arr[1] + ""
                var currentDay = ~~arr[2] + ""
            }
            currentMonth = currentMonth.length == 1 ? "0" + currentMonth : currentMonth;
            currentDay = currentDay.length == 1 ? "0" + currentDay : currentDay;
            avalon.log(currentYear + "-" + currentMonth + "-" + currentDay);
            return currentYear + "-" + currentMonth + "-" + currentDay
        }
        else
        {
            var currentYear = pDate.substr(0, 4);
            var currentMonth = pDate.substr(4, 2) + "";
            var currentDay = pDate.substr(6, 2) + "";
            currentMonth = currentMonth.length == 1 ? "0" + currentMonth : currentMonth;
            currentDay = currentDay.length == 1 ? "0" + currentDay : currentDay;
            avalon.log(currentYear + "-" + currentMonth + "-" + currentDay);
            return currentYear + "-" + currentMonth + "-" + currentDay
        }

    }
    
//转换时间格式    
    function convertTime(pTime,pIsShowSecond)
    {
        if (pTime.indexOf(":") > 0)
        {
            arr = pTime.split(":")
            var tmphour = (~~arr[0] + "").length == 1 ? "0" + ~~arr[0] : arr[0];
            var tmpminute = (~~arr[1] + "").length == 1 ? "0" + ~~arr[1] : arr[1];
            var tmpsecond = (~~arr[2] + "").length == 1 ? "0" + ~~arr[2] : arr[2];
        }
        else
        {
            var tmphour = pTime.substr(0, 2) + "";
            var tmpminute = pTime.substr(2, 2) + "";
            var tmpsecond = pTime.substr(4, 2) + "";
            tmphour = tmphour.length == 1 ? "0" + tmphour : tmphour;
            tmpminute = tmpminute.length == 1 ? "0" + tmpminute : tmpminute;
            tmpsecond = tmpsecond.length == 1 ? "0" + tmpsecond : tmpsecond;
        }
        //return tmphour + ":" + tmpminute + ":" + (!!pIsShowSecond?tmpsecond:"00");
        return tmphour + ":" + tmpminute + (!!pIsShowSecond?":"+tmpsecond:"");
    }
    
//转换长时间格式
    function convertDateTime(pDateTime,pIsShowSecond)
    {
        var tmpdate = null;
        var tmptime = null;
        if (pDateTime.indexOf("-") > 0 && pDateTime.indexOf(":") > 0 && pDateTime.indexOf(" ") > 0)
        {
            var tmparr = pDateTime.split(" ");
            tmpdate = tmparr[0];
            tmptime = tmparr[1];
        }
        else
        {
            if (pDateTime.length == 14)
            {
                tmpdate = pDateTime.substr(0, 8);
                tmptime = pDateTime.substr(8, 6);
            }
            if (pDateTime.length == 12 && pIsShowSecond==false)
            {
                tmpdate = pDateTime.substr(0, 8);
                tmptime = pDateTime.substr(8, 4);
            }            
        }
        return convertDate(tmpdate) + " " + convertTime(tmptime,pIsShowSecond);
    }
    
//设置日历日期
    function setPicker()
    {
        var vm = arguments[0];
        vm._days.removeAll();
        vm.__days.removeAll();
        if (arguments.length == 4)
        {
            var currentYear = vm._syear = arguments[1];
            var currentMonth = vm._smonth = arguments[2];
            var currentDay = vm._sday = arguments[3];

            if (arguments[2] == 12)
            {
                var currentYear = vm._syear = arguments[1] + 1;
                var currentMonth = vm._smonth = 0;
            }
            if (arguments[2] == -1)
            {
                var currentYear = vm._syear = arguments[1] - 1;
                var currentMonth = vm._smonth = 11;
            }

        }
        else
        {

            //判断是否存在默认值
            if (vm.value == "")
            {
                var currentDate = new Date();
                var currentYear = vm._syear = currentDate.getFullYear();
                var currentMonth = vm._smonth = currentDate.getMonth();
                var currentDay = vm._sday = currentDate.getDate();
            }
            else
            {
                //判断默认值是否正确
                if (!isCorrectDateTime(vm.value, vm.isShowTime, vm.isShowSecond))
                {
                    vm._cyear = 0;
                    vm._cmonth = 0;
                    vm._cday = 0;
                    //vm.value = "";
                    var currentDate = new Date();
                    var currentYear = vm._syear = currentDate.getFullYear();
                    var currentMonth = vm._smonth = currentDate.getMonth();
                    var currentDay = vm._sday = currentDate.getDate();
                }
                else
                {
                    //读取日期
                    if (!vm.isShowTime)
                    {
                        if (vm.value.indexOf("-") > 0)
                        {
                            var arr = vm.value.split("-") //可以被-切成3份，并且第1个是4个字符
                            if (arr.length === 3 && arr[0].length === 4) {
                                var currentYear = vm._syear = vm._cyear = ~~arr[0] //全部转换为非负整数
                                var currentMonth = vm._smonth = vm._cmonth = ~~arr[1] - 1
                                var currentDay = vm._sday = vm._cday = ~~arr[2]
                            }
                        }
                        else
                        {
                            if (vm.value.length == 8)
                            {
                                var currentYear = vm._syear = vm._cyear = ~~vm.value.substr(0, 4) //全部转换为非负整数
                                var currentMonth = vm._smonth = vm._cmonth = ~~vm.value.substr(4, 2) - 1
                                var currentDay = vm._sday = vm._cday = ~~vm.value.substr(6, 2)
                            }
                        }
                    }
                    else
                    {
                        //日期时间
                        var tmpdate = null;
                        var tmptime = null;
                        if (vm.value.indexOf("-") > 0 && vm.value.indexOf(":") > 0 && vm.value.indexOf(" ") > 0)
                        {
                            var tmparr = vm.value.split(" ");
                            tmpdate = tmparr[0];
                            tmptime = tmparr[1];
                        }
                        else
                        {
                            if (vm.value.length == 14)
                            {
                                tmpdate = vm.value.substr(0, 8);
                                tmptime = vm.value.substr(8, 6);
                            }
                            if (vm.value.length == 12 && vm.isShowSecond==false)
                            {
                                tmpdate = vm.value.substr(0, 8);
                                tmptime = vm.value.substr(8, 4);
                            }
                        }
                        //日期
                        if (tmpdate.indexOf("-") > 0)
                        {
                            var arr = tmpdate.split("-") //可以被-切成3份，并且第1个是4个字符
                            if (arr.length === 3 && arr[0].length === 4) {
                                var currentYear = vm._syear = vm._cyear = ~~arr[0] //全部转换为非负整数
                                var currentMonth = vm._smonth = vm._cmonth = ~~arr[1] - 1
                                var currentDay = vm._sday = vm._cday = ~~arr[2]
                            }
                        }
                        else
                        {
                            if (tmpdate.length == 8)
                            {
                                var currentYear = vm._syear = vm._cyear = ~~tmpdate.substr(0, 4) //全部转换为非负整数
                                var currentMonth = vm._smonth = vm._cmonth = ~~tmpdate.substr(4, 2) - 1
                                var currentDay = vm._sday = vm._cday = ~~tmpdate.substr(6, 2)
                            }
                        }
                        //时间
                        if (tmptime.indexOf(":") > 0)
                        {
                            var arr = tmptime.split(":");
                            if (arr.length === 3)
                            {
                                var currentHour = vm._chour = ~~arr[0];
                                var currentMinute = vm._cminute = ~~arr[1];
                                var currentSecond = vm._csecond = ~~arr[2];
                            }
                            if(arr.length === 2 && vm.isShowSecond==false)
                            {
                                var currentHour = vm._chour = ~~arr[0];
                                var currentMinute = vm._cminute = ~~arr[1];
                                var currentSecond = vm._csecond ="00"
                            }
                        }
                        else
                        {
                            
                            if (tmptime.length == 6)
                            {
                                var currentHour = vm._chour = ~~tmptime.substr(0, 2);
                                var currentMinute = vm._cminute = ~~tmptime.substr(2, 2);
                                var currentSecond = vm._csecond = ~~tmptime.substr(4, 2);
                            }
                           if (tmptime.length == 4 && vm.isShowSecond==false)
                            {
                                var currentHour = vm._chour = ~~tmptime.substr(0, 2);
                                var currentMinute = vm._cminute = ~~tmptime.substr(2, 2);
                                var currentSecond = vm._csecond="00"
                                avalon.log(tmptime);
                            }
                        }
                    }
                }
            }
        }

        //显示6周
        var monthdays = 42;
        //上月日期
        var prevYear = null;
        var prevMonth = null;
        var prevMonthDays = null;
        if (currentMonth - 1 == -1)
        {
            prevYear = currentYear - 1;
            prevMonth = 11;
        }
        else
        {
            prevYear = currentYear;
            prevMonth = currentMonth - 1;
        }
        prevMonthDays = getMonthDays(prevYear, prevMonth);

        var oneDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
        if (oneDayOfWeek == 0)
        {
            oneDayOfWeek = 7
        }
        for (var temponeDayOfWeek = oneDayOfWeek; temponeDayOfWeek > 0; temponeDayOfWeek--)
        {
            var prevDay = prevMonthDays - temponeDayOfWeek + 1;
            vm._days.push({title: prevDay, value: new Date(prevYear, prevMonth, prevDay), year: prevYear, month: prevMonth, day1: prevDay, isThisMonth: false})
        }
        //本月日期
        var currentMonthDays = getMonthDays(currentYear, currentMonth);
        for (var i = 0; i < currentMonthDays; i++)
        {
            vm._days.push({title: (i + 1), value: new Date(currentYear, currentMonth, (i + 1)), year: currentYear, month: currentMonth, day1: (i + 1), isThisMonth: true})
        }
        //下月日期
        var nextDays = monthdays - oneDayOfWeek - currentMonthDays;
        if (currentMonth + 1 == 12)
        {
            currentYear = currentYear + 1;
            currentMonth = 0;
        }
        else
        {
            currentMonth = currentMonth + 1;
        }
        for (var i = 0; i < nextDays; i++)
        {
            vm._days.push({title: (i + 1), value: new Date(currentYear, currentMonth, (i + 1)), year: currentYear, month: currentMonth, day1: (i + 1), isThisMonth: false})
        }

        //对_days进行分组
        for (var i = 0; i < 6; i++)
        {
            vm.__days.push([])
        }
            var tmpi = 0;
            avalon.each(vm._days, function (index, item) {
                vm.__days[tmpi].push(item);
                if((index+1) % 7==0)
                {
                    tmpi=tmpi+1;
                }
            })
            //avalon.log(vm.__days)
        
    }
    
    return avalon
})

//
