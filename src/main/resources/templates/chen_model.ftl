<#macro layout title>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <title>${title}</title>

<#--        <script type="text/javascript" src="${rc.contextPath}/js/vue/vue_2.5.7.js"></script>-->
        <script type="text/javascript" src="${rc.contextPath}/js/Jquery/jquery.min.js"></script>

        <@css/>
        <@js/>
        <@style/>
    </head>
    <body style="height: -webkit-fill-available;">
    <#nested >






    </body>
    </html>
</#macro>