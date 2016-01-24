/**
 * Created by chenkuan on 16/1/21.
 */

;(function(w){

    w.tempPhaser = function(rpl,json){

        var reg_property = /{{([a-zA-Z$_][a-zA-Z$_0-9\.\[0-9\]]*)}}/ig;
        var reg_statement = /{{(each)\s*?(([a-zA-Z$_][a-zA-Z$_0-9\.\[0-9\]]*)\s*?as\s*?([a-zA-Z$_][a-zA-Z$_0-9]*))}}([\w\W]*){{\/each}}/ig;

        //替换循环语句
        rpl = rpl.replace(reg_statement, function (raw,type,expr,objStr,alias,content) {
            if(type == 'each'){// 循环语句
                // 实例化 obj
                var obj = instantProperty(objStr,json);

                // 匹配语句块中参数的正则
                var ele = new RegExp("{{"+alias+"([a-zA-Z$_0-9\.\[0-9\]*)?}}",'g');
                console.log(ele);
                // 遍历自加语句块内容长度
                var _content="";
                content = content.replace(/^[\n\t\r\s]*/ig,"");//去掉两端换行符
                content = content.replace(/[\n\t\r\s]*$/ig,"");//去掉两端换行符
                for(var i=0;i<obj.length;i++){
                    //替换content中的内容
                    var eachEle = obj[i];
                    _content += content.replace(ele,function(raw,valStr){
                        var value = '';
                        if(valStr){//如果取值对象有子属性
                            value = instantProperty(valStr.substr(1),eachEle)
                        }else{//如果取值对象没有子属性
                            value = instantProperty(alias,eachEle)
                        }
                        return value;
                    });
                }

                return _content;
            }
            //if(type == "if"){// 条件语句
            //    // 0.将elseif(expr)的表达式分别存入数组,同时将语句块分割放入数组
            //    // 1.依次判断expr[]得出序号,并执对应的语句块
            //    // 2.依次判断expr结果,若为真则执行语句块,跳过后续语句块
            //}
        });

        // 替换property
        rpl = rpl.replace(reg_property,function(raw,key){
            return instantProperty(key,json);
        });


        return rpl;
    };

    // 完成 模板属性 到 json属性 的取值
    function instantProperty(str,json){
        str = str.replace(/\[/g,".").replace(/]\./g,".").replace(/]/g,".").replace(/\.$/g,"");
        var objStrArr = str.split(".");

        // 逐级确定 _json的值
        var _json = json;
        while (objStrArr.length>0){
            _json = _json[objStrArr.shift()]
        }
        return _json||str
    }
})(window);

