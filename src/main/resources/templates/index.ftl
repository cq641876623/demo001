<#include "chen_model.ftl">

<#macro css>
    <link rel="icon" href="${rc.contextPath}/images/title_icon/监控.png">
    <link rel="stylesheet" href="${rc.contextPath}/js/vue/elementui.css">
    <link rel="stylesheet" href="${rc.contextPath}/css/index.css">
</#macro>
<#macro js>


    <script src="${rc.contextPath}/js/vue/elementui.js"></script>

    <script src="${rc.contextPath}/js/threeJs/build/three.js"></script>
    <!--检查webGL环境-->
    <script src="${rc.contextPath}/js/threeJs/js/Detector.js"></script>
</#macro>
<#macro style>

    <style>
        /*@keyframes fadeout{*/
        /*    100%   {background: rgba(255, 255, 255, 0);  top:-80px;}*/
        /*    75%  {background: rgba(255, 255, 255, 0.25);  top:-60px;}*/
        /*    50%  {background: rgba(255, 255, 255, 0.5); top:-30px;}*/
        /*    25%  {background: rgba(255, 255, 255, 0.75);  top:-10px;}*/
        /*    0% {background: rgba(255, 255, 255, 1);  top:0px;}*/
        /*}*/
        /*.cq-page-header{*/
        /*    animation-name: fadeout;*/
        /*    animation-duration: 3s;*/
        /*    animation-timing-function: linear;*/
        /*    animation-delay: 0s;*/
        /*    animation-iteration-count: infinite;*/
        /*    animation-direction: alternate;*/
        /*    animation-play-state: running;*/
        /*}*/
    </style>
</#macro>






<@layout "login">
<#--    <div class="cq-page-header ">-->
<#--        <div class="container">-->
<#--            <div id="title" >-->
<#--                <div style="font-size: 13px;">Ramo Smart park system</div>-->
<#--                <div>智慧园区系统</div>-->
<#--            </div>-->
<#--        </div>-->



<#--    </div>-->

    <div id="background" style="position: fixed;top: 80px;left: 0;width: 100%;height: calc(100% - 80px);background: linear-gradient(45deg, #665fee 0%, #27c2de 100%);">

        <div class="container cq-page-body" id="app">

            <div class="cq-col" style="width: 100%;user-select: none;padding: 10px;">
                <h2>智慧园区系统</h2>
                <p>提供完善的企业智慧园区系统解决方案</p>
            </div>

            <div class="cq-col" style="width: 100%;">
                <form   action="${rc.contextPath}/signIn" method="post" class="cq-form cq-bg-white cq-rounded">
                    <h2 style="text-align: center;">欢迎/Welcome</h2>
                    <div class="cq-form-group">
                        <input placeholder="用户名/username" type="text" class="cq-sign-input" name="username" v-model="form.username">
                    </div>
                    <div class="cq-form-group">
                        <input placeholder="密码/password" type="password" class="cq-sign-input" name="password" v-model="form.password" autocomplete>
                    </div>


                    <#if st??>
                        <input  type="password" class="cq-sign-input" name="st" value="${st}">
                    </#if>

                    <div class="cq-form-group">
                        <button type="button" class="cq-sgin-btn cq-sgin-norl" v-on:click="check">登录/Sign in</button>
                    </div>
                    <#if error??>
                        <div style="color:red;">${error}</div>
                    </#if>


                </form>
            </div>
        </div>

    </div>

    <script>
        var vueobj=new Vue(
            {
                el:"#app",
                data(){
                    return {
                        form:{
                            username:'',
                            password:'',
                            lt:'',
                            companyid:''
                        },
                        companyList:[],
                    };
                },
                methods:{
                    check:function () {
                        if(this.form.username.trim()==""||this.form.password.trim()==""){
                            this.$message({
                                showClose: true,
                                message: '用户名和密码不能为空！',
                                type: 'error'
                            });
                            return;
                        }
                        this.form.username=this.form.username.trim();
                        this.form.password=this.form.password.trim();
                        document.forms[0].submit();
                    }
                },
                watch:{
                }
            }
        );
        var ajaxErrorFunc=function (e) {
            console.log("ajax-error",e);
        }
        initBackGround(document.getElementById("background"));
        document.onkeydown=function(event){
            var e = event || window.event || arguments.callee.caller.arguments[0];
            if(e && e.keyCode==13){ // enter 键
                vueobj.check();
            }
        };
        function initBackGround(container) {
            if(!container){
                console.log("无装载节点");
                return;
            }
            if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
            var mouseX = 0, mouseY = 0;
            var camera, scene, renderer;
            var windowHalfX = window.innerWidth / 2;
            var windowHalfY = window.innerHeight / 2;
            document.addEventListener( 'mousemove', onDocumentMouseMove, false );
            function onDocumentMouseMove( event ) {
                mouseX = ( event.clientX - windowHalfX ) * 10;
                mouseY = ( event.clientY - windowHalfY ) * 10;
            }
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera( 60,  window.innerWidth /window.innerHeight, 1, 100000 );
            renderer = new THREE.WebGLRenderer();
            renderer.setSize(  window.innerWidth , window.innerHeight );
            camera.position.z = 3200;
            var oCanvas=document.createElement("canvas");
            oCanvas.setAttribute("width",256)
            oCanvas.setAttribute("height",128)
            var oGc = oCanvas.getContext( '2d' );
            var linear = oGc.createLinearGradient( 0, 400, 500, 400 );
            linear.addColorStop( 0, '#2778f1' );
            linear.addColorStop( 1, '#99deff' );
            oGc.fillStyle = linear;
            oGc.fillRect( 0, 0, oCanvas.width , oCanvas.height );
            container.append( renderer.domElement );
            renderer.domElement.style.position="fixed"
            renderer.domElement.style.top="0";
            renderer.domElement.style.left="0";
            renderer.domElement.style.zIndex=-1;
            scene.background = new THREE.CanvasTexture( oCanvas );
            var materialLine = new THREE.LineBasicMaterial({
                blending: THREE.AdditiveBlending,
                transparent: true
            });
            var geometryLine= new THREE.Geometry();
            geometryLine.vertices.push(
                new THREE.Vector3( 0, 0, -300 ),
                new THREE.Vector3( 100, 100, 0 ),
            );
            for ( var i = 0; i < 1000; i ++ ) {
                var line = new THREE.Line( geometryLine, materialLine );
                line.position.x = Math.random() * 10000 - 5000;
                line.position.y = Math.random() * 10000 - 5000;
                line.position.z = Math.random() * 10000 - 5000;
                scene.add( line );
            }
            function animate() {
                requestAnimationFrame( animate );
                renderer.render( scene, camera );
                render();
            }
            var  onWindowResize=function() {
                camera.aspect = window.innerWidth /window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(  window.innerWidth , window.innerHeight );
            }
            window.addEventListener( 'resize', onWindowResize, false );
            function render() {
                camera.position.x += ( mouseX - camera.position.x ) * .05;
                camera.position.y += ( - mouseY - camera.position.y ) * .05;
                camera.lookAt( scene.position );
            }
            animate();
        }
    </script>


</@layout>