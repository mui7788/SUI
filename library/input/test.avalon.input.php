<!DOCTYPE html> 
<html> 
    <head> 
        <META http-equiv="X-UA-Compatible" content="IE=edge"/>
        <META content="text/html; charset=UTF-8" http-equiv=Content-Type>
        <script src="../avalon.js"></script> 
        <script>
            require(["./input/avalon.input"], function () {
                var vm = avalon.define({
                    $id: "test",
                    $skipArray: ["inuptOpts"],
                    value:true,
                    inputOpts: {
                        title: "名　　称",
                        value: "",
                        notice: "请输入名称",
                        isReadonly: false,
                        isDisabled: false,
                        isRequired: false,
                        _blur:function()
                        {
                            alert("blur")
                        }
                    },
                    inputOpts2: {
                        title: "联系电话",
                        value: "",
                        notice: "请输入联系电话",
                        isReadonly: false,
                        isDisabled: false,
                        isRequired: true,
                    },
                    inputOpts3: {
                        title: "联系地址",
                        value: "",
                        notice: "请输入联系地址",
                        isReadonly: false,
                        isDisabled: false,
                        isRequired: true,
                        widthType: "big"
                    }
                })
                avalon.scan()
                
            })
        </script>
    </head>
    <body ms-controller="test">
        <div><ms:input title="联系人" value="abc" is-Required="true" ></ms:input></div>
<!--        <div><ms:input config="inputOpts2"></ms:input></div>
        <div><ms:input config="inputOpts3"></ms:input></div>-->
        <input type="button" ms-click="set">
    </body>



