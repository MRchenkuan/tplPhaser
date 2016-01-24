<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<p style="background-color: #56802f">{{username}}<p>
<p>{{url}}<p>
<p>{{data2.data1.b[2]}}<p>
<pre>
    {{if data1.a == 'chenkuan' }}
        ok 5
    {{elseif data1.a>=4}}
        ok 4
    {{elseif data1.a>=3}}
        ok 3
    {{elseif data1.a>=2}}
        ok 2
    {{else}}
        ok last
    {{/if}}

    {{each list as li}}
        fdsafdsaf{{li.b}}dsafsf fdsafdsaf{{li.b}}dsafsf<br>
    {{/each}}
</pre>
</body>
</html>