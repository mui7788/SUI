define(["../scb"], function (scb) 
{    
    /**
     * resize、scroll等频繁触发页面回流的操作要进行函数节流
     * @param {type} fn, 要截留处理的函数引用。
     * @param {type} delay  延时执行的毫秒数。
     * @param {type} mustRunDelay   节流监控、等待的毫秒数。
     * @param {type} args   节流处理的的函数参数。
     * @returns {Function}
     */
    function throttle(fn, delay, mustRunDelay, args) 
    {
        var timer = null
        var t_start
        return  function () 
                {
                    var context = this,
                        t_curr = +new Date();// 返回当前时间戳。
                    clearTimeout(timer)
                    if (!t_start) 
                    {
                        t_start = t_curr
                    }
                    if (t_curr - t_start >= mustRunDelay) 
                    {
                        fn.apply(context, args)
                        t_start = t_curr
                    }
                    else 
                    {
                        timer = setTimeout(function () {
                                                            fn.apply(context, args)
                                                        }
                                            , delay)
                    }
                }
    }
    scb.event_throttle = throttle ;
    return scb;
})
