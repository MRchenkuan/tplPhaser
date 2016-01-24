/**
 * Created by chenkuan on 16/1/21.
 */

;(function(w){

    w.tempPhaser = function(rpl,json){

        var reg_property = /{{([a-zA-Z$_][a-zA-Z$_0-9\.\[0-9\]]*)}}/ig;
        var reg_loop = /{{(each)\s*?(([a-zA-Z$_][a-zA-Z$_0-9\.\[0-9\]]*)\s*?as\s*?([a-zA-Z$_][a-zA-Z$_0-9]*))}}([\w\W]*){{\/each}}/ig;
        var reg_condition  = /{{(if)\s*?([a-zA-Z$_0-9\.\[0-9\]\s><=!'"]*)\s?}}([\w\W]*){{\/if}}/ig;
        var reg_ifsep = /{{(else|elseif\s([a-zA-Z$_0-9\.\[0-9\]\s><=!'"]*?))}}/ig;

        // 替换条件语句
        rpl = rpl.replace(reg_condition, function (raw,type,expr,content) {
            //取后续包体
            content = content.replace(/^[\n\t\r\s]*/ig,"");//去掉两端换行符
            content = content.replace(/[\n\t\r\s]*$/ig,"");//去掉两端换行符
            // 提取分割表达式
            var content_seps = content.match(reg_ifsep);
            content_seps.some(function(it,id){
                it = it.replace("{{elseif","");
                it = it.replace("}}","");
                it = it.replace("{{else","true");
                content_seps[id] = it;
            });
            // 将最顶部表达式放入第一位
            content_seps.unshift(expr);
            console.log(content_seps);
            // 2.根据else分割语句块
            var content_blocks = content.split(reg_ifsep);

            // 逐次计算表达式
            for(var _i=0;_i<content_seps.length;_i++){
                if(calculateExpr(content_seps[_i],json)){
                    content = content_blocks[_i*3];
                    break;
                }
            }
            return content;
        });

        //替换循环语句
        rpl = rpl.replace(reg_loop, function (raw,type,expr,objStr,alias,content) {
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
        });


        
        // 替换property
        rpl = rpl.replace(reg_property,function(raw,key){
            return instantProperty(key,json);
        });

        return rpl;
    };


    /**
     * 若要支持嵌套语句,则需要在进入每一层事,拷贝上层环境变量,并加上上层所生成的环境变量,如循环语句,其实也只有循环语句需要扩充一个种子
     * 至于条件语句,则可以直接嵌套
     */


    // 工具方法 - 计算表达式
    function calculateExpr(expr,scope){

        // 替换链式作用域
        expr = expr.replace(/([a-zA-Z$_][a-zA-Z$_0-9\.\[0-9\]]*)/,function(raw){
            var rst = instantProperty(raw,scope);
            //如果类型为字符串则在比较之前要加上引号
            if((typeof rst)=='string'){
                return "'"+rst+"'"
            }else{
                return rst
            }
        });
        var result;
        try{
            console.log(expr);
            result = eval("("+expr+")");
        }catch(e){
            result = false;
        }
        return result;
    }

    // 工具方法 - 完成 模板属性 到 json属性 的取值
    function instantProperty(str,scope){
        str = str.replace(/\[/g,".").replace(/]\./g,".").replace(/]/g,".").replace(/\.$/g,"");
        var objStrArr = str.split(".");

        // 逐级确定 _json的值
        var _json = scope;
        while (objStrArr.length>0){
            _json = _json[objStrArr.shift()]
        }

        return _json||str
    }
})(window);

