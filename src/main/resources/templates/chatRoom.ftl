<#include "chen_model.ftl">

<#macro css>
    <link rel="icon" href="${rc.contextPath}/images/title_icon/监控.png">
    <link rel="stylesheet" href="${rc.contextPath}/js/vue/elementui.css">
</#macro>
<#macro js>


<#--    <script src="${rc.contextPath}/js/vue/elementui.js"></script>-->

</#macro>
<#macro style>

    <style>
        *, *:before, *:after {
            box-sizing: border-box;
        }
        body, html {
            height: 100%;
            overflow: hidden;
        }
        body, ul {
            margin: 0;
            padding: 0;
        }
        body {
            color: #4d4d4d;
            font: 14px/1.4em 'Helvetica Neue', Helvetica, 'Microsoft Yahei', Arial, sans-serif;
            background: #f5f5f5 url('dist/images/bg.jpg') no-repeat center;
            background-size: cover;
            font-smoothing: antialiased;
        }
        ul {
            list-style: none;
        }
        #chat {
            margin: 20px auto;
            width: 800px;
            height: 600px;
        }
    </style>
</#macro>






<@layout "聊天室">

    <div>
        <form action="pdfChangeWord" method="post" enctype="multipart/form-data">
            上传文件:<br>
            <input type="file" name="file" />
            <button type="submit">提交</button>

        </form>
    </div>

    <script>
        $.ajax()
    </script>
    <app></app>
    <script>
        var baseUrl="${rc.contextPath}";
    </script>
    <script src="dist/build.js"></script>




</@layout>