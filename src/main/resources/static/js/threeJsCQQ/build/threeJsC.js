

function ThreeJsC(domParnet,configure) {
    var context=this;
    // 场景
    this.scene=null;
    // 相机
    this.camera=null;
    // 渲染器
    this.renderer=null;
    // 渲染dom
    this.dom=null;

    // 辅助控制器
    this.controls=null;


    this.composer = null;

    this.outlinePass=null;
    this.outlinePass1=null;
    this.outlinePassGreen=null;
    this.effectFXAA=null;
    this.transfromControl=null;


    this.waitPlaceObj=null;


    this.tags=[];
    // this.tags=[{target:object3D,Dom:div}];

    var raycaster = new THREE.Raycaster();

    var mouse = new THREE.Vector2();


    var conf={
        dom: null,
        domParnet:document.body,
        style:{
            /**
             * type: 0:fullScreen,1:percent,3:px
             */
            width:{size:window.innerWidth ,type:0}
            , height:{size:window.innerHeight ,type:0}
        },
        composer:{
            switch:true,
        },
        defultScene:{
            background_type:0,  //background
            background_imgUrl:[],

            background_color:'#aaa'//未完成
        },
        event:{
            selectFunction:null,
            clickFunction:null,
            isBindWindow:false
        },
        popupPanels:function (dom,obj3D) {

        }
    };


    /**
     * 导入配置信息
     * @param dom
     * @param c
     */
    function loadConf(parentDom,c) {
            if(c==null)return;
            if(parentDom!=null){
                conf.domParnet=parentDom;
            }
            if(c.hasOwnProperty("style")){
                if(c.style.width!=undefined){
                    if(c.style.width!=""){
                        if(c.style.width.includes("%")){
                            conf.style.width.type=1;
                            conf.style.width.size=parseInt(c.style.width.substring(0,c.style.width.length-1));
                        }
                        else if(c.style.width.includes("px")){
                            conf.style.width.type=2;
                            conf.style.width.size=parseInt(c.style.width.substring(0,c.style.width.length-2));
                        }else {
                            conf.style.width.type=2;
                            conf.style.width.size=parseInt(c.style.width);
                        }
                    }
                }
                if(c.style.height!=undefined){
                    if(c.style.height!=""){
                        if(c.style.height.includes("%")){
                            conf.style.height.type=1;
                            conf.style.height.size=parseInt(c.style.height.substring(0,c.style.height.length-1));
                        }
                        else if(c.style.height.includes("px")){
                            conf.style.height.type=2;
                            conf.style.height.size=parseInt(c.style.height.substring(0,c.style.height.length-2));
                        }
                        else {
                            conf.style.height.type=2;
                            conf.style.height.size=parseInt(c.style.height);
                        }

                    }
                }

            }
            if(conf.domParnet!=document.body){
                conf.style.height.type=1;
                conf.style.height.size=100;
                conf.style.width.type=1;
                conf.style.width.size=100;
            }

            if(c.composer!=null){
                conf.composer.switch= c.composer['switch']==null?true:c.composer['switch'];
            }
            conf.event=c['event'];

            if(c.event!=null){
                if(c.event['isBindWindow']!=null) conf.event.isBindWindow=c.event['isBindWindow'];
            }

            if(c.hasOwnProperty("popupPanels")){
                conf.popupPanels=c.popupPanels;
            }

        }


    var loadSize=function(size,t,dom){
        switch (size.type) {
            // 全屏
            case 0:
                if(t=="width")return window.innerWidth;
                if (t=="height")return window.innerHeight;
                // 百分比
            case 1:
                if(dom==null){
                    console.log("当前没有指定节点");
                    return 0;
                }else{
                    if(t=="width")return dom.clientWidth*(size.size/100);
                    if (t=="height")return dom.clientHeight*(size.size/100);
                }
            case 2:
               return  size.size;
        }
    }



    /**
     * 基本场景初始化函数
     * @param width dom宽度
     * @param height
     * @param dom 挂载节点
     * 不输入则为默认全屏
     */
    var init=function (domParnet) {
        // 支持检查
        if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

        // 初始化场景
        context.scene = new THREE.Scene();
        // 初始化相机

        context.camera = new THREE.PerspectiveCamera( 45, loadSize(conf.style.width,"width",domParnet)/ loadSize(conf.style.height,"height",domParnet), 1, 10000 );

        context.camera.position.set( 300, 300, 300 );
        context.camera.fov=70;
        // 渲染器
        context.renderer = new THREE.WebGLRenderer();

        context.renderer.setSize( loadSize(conf.style.width,"width",domParnet),loadSize(conf.style.height,"height",domParnet) );

        console.log("初始化宽高：","width:"+loadSize(conf.style.width,"width",domParnet)+","+"height:"+loadSize(conf.style.height,"height",domParnet));

        //阴影打开
        // context.renderer.shadowMap.enabled = true;
        context.renderer.shadowMap.type = 0;
        conf.domParnet.appendChild( context.renderer.domElement );

        context.dom=context.renderer.domElement;
        conf.dom=context.renderer.domElement;


        // context.scene.background = new THREE.Color( 0xffffff );
        if(conf.composer.switch) context.composer = new THREE.EffectComposer( context.renderer );



    }
    // 基本控制初始化函数
    var init_controls=function () {
        context.controls=  new THREE.OrbitControls( context.camera,context.renderer.domElement);
        context.controls.keys = {
            LEFT: 37, //left arrow
            UP: 38, // up arrow
            RIGHT: 39, // right arrow
            BOTTOM: 40 // down arrow
        }
        context.controls.mouseButtons = {
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.PAN,
        }
        context.controls.panSpeed=2
        context.controls.rotationSpeed=2



        context.controls.update();

        // context.transfromControl = new THREE.TransformControls( context.camera, context.renderer.domElement );
        //
        // context.transfromControl.addEventListener( 'dragging-changed', function ( event ) {
        //
        //     context.controls.enabled = ! event.value;
        //
        // } );
        // context.scene.add(context.transfromControl)
    }

    var defult_light=function(buler){
        if(buler){
            //默认灯光
            var light = new THREE.AmbientLight( 0x666666 ); // soft white light
            light.intensity=1;
            light.position.set( 0, 200, 0 );
            light.castShadow = true;
            context.scene.add( light );
        }
    }

    var defult_background=function(buler){



        if(!buler)return;
        var texture = new THREE.TextureLoader().load( "js/threeJsCQQ/static/backGround/天空球3.jpg" );
        context.scene.background =texture;
    }

    var defult_compose=function(buler){
        if(!buler)return;
        var renderPass = new THREE.RenderPass( context.scene, context.camera );
        context.composer.addPass( renderPass );
        context.outlinePass = new THREE.OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), context.scene, context.camera );
        context.outlinePass.edgeStrength = 2;//包围线浓度
        context.outlinePass.edgeGlow = 2;//边缘线范围
        context.outlinePass.edgeThickness = 1;//边缘线浓度
        context.outlinePass.pulsePeriod = 2;//包围线闪烁频率
        context.outlinePass.visibleEdgeColor.set( '#ffffff' );//包围线颜色
        context.outlinePass.hiddenEdgeColor.set( '#190a05' );//被遮挡的边界线颜色

        context.outlinePass1 = new THREE.OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), context.scene, context.camera );
        context.outlinePass1.edgeStrength = 2;//包围线浓度
        context.outlinePass1.edgeGlow = 2;//边缘线范围
        context.outlinePass1.edgeThickness = 1;//边缘线浓度
        context.outlinePass1.pulsePeriod = 2;//包围线闪烁频率
        context.outlinePass1.visibleEdgeColor.set( '#ff2d39' );//包围线颜色
        context.outlinePass1.hiddenEdgeColor.set( '#190a05' );//被遮挡的边界线颜色

        context.outlinePassGreen = new THREE.OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), context.scene, context.camera );
        context.outlinePassGreen.edgeStrength = 2;//包围线浓度
        context.outlinePassGreen.edgeGlow = 2;//边缘线范围
        context.outlinePassGreen.edgeThickness = 1;//边缘线浓度
        context.outlinePassGreen.pulsePeriod = 2;//包围线闪烁频率
        context.outlinePassGreen.visibleEdgeColor.set( '#60ff43' );//包围线颜色
        context.outlinePassGreen.hiddenEdgeColor.set( '#190a05' );//被遮挡的边界线颜色


        context.composer.addPass( context.outlinePass );
        context.composer.addPass( context.outlinePass1 );
        context.composer.addPass( context.outlinePassGreen );
        context.effectFXAA = new THREE.ShaderPass( THREE.FXAAShader );
        context.effectFXAA.uniforms[ 'resolution' ].value.set( 1 / loadSize(conf.style.width,"width",conf.domParnet), 1 / loadSize(conf.style.height,"height",conf.domParnet) );
        context.effectFXAA.renderToScreen = true;
        context.composer.addPass( context.effectFXAA );
        console.log(context.composer)
    }

        /**
     * 运行渲染，默认为false
     * @param buler 简单无后处理 true:有后处理 ，false：无
     */
    var running=function(buler){
        function animateNoComposer() {
            requestAnimationFrame( animateNoComposer );
            context.controls.update();
            context.renderer.render( context.scene, context.camera );

            context.tags.forEach(function (item) {
                if(!item.hasOwnProperty('dom')||item['dom']==null){
                    var div = document.createElement('div');
                    // div.innerHTML = JSON.stringify(item['target'].userData['data']);
                    div.style.padding = '20px';
                    div.style.margin = '30px';
                    div.style.position = 'absolute';
                    div.style.borderRadius = '5px';
                    div.style.backgroundColor = '#fff';
                    div.style.boxShadow = '0px 3px 7px 0px rgba(28,31,33,0.15)';
                    item['target'].userData['popupPanels'](div,item['target']);
                    context.dom.parentElement.append(div);
                    item['dom']=div;
                }
                tag(item['target'],item['dom'])
            });



        }

        function animateComposer() {
            requestAnimationFrame( animateComposer );
            checkIntersection();
            context.controls.update();
            // 设置视野
            // context.renderer.setViewport(0,0,context.dom.clientWidth/2,context.dom.clientHeight/2);
            context.composer.render();


            context.tags.forEach(function (item) {
                if(!item.hasOwnProperty('dom')||item['dom']==null){
                    var div = document.createElement('div');
                    // div.innerHTML = JSON.stringify(item['target'].userData['data']);
                    div.style.padding = '20px';
                    div.style.margin = '30px';
                    div.style.position = 'absolute';
                    div.style.borderRadius = '5px';
                    div.style.backgroundColor = '#fff';
                    div.style.boxShadow = '0px 3px 7px 0px rgba(28,31,33,0.15)';
                    item['target'].userData['popupPanels'](div,item['target']);
                    context.dom.parentElement.append(div);
                    item['dom']=div;
                }
                tag(item['target'],item['dom'])
            });

            // context.composer.readRenderTargetPixels();
        }
        if(buler){
            animateComposer();

        }else {
            animateNoComposer();
        }
    }








    /**
     * 窗口调整
     */
    var  onWindowResize=function() {
       context.camera.aspect = loadSize(conf.style.width,"width",conf.domParnet)/ loadSize(conf.style.height,"height",conf.domParnet);
       context.camera.updateProjectionMatrix();


       context.renderer.setSize( loadSize(conf.style.width,"width",conf.domParnet),loadSize(conf.style.height,"height",conf.domParnet) );

       if(conf.composer.switch){
           context.composer.setSize( loadSize(conf.style.width,"width",conf.domParnet),loadSize(conf.style.height,"height",conf.domParnet) );
           context.effectFXAA.uniforms[ 'resolution' ].value.set( 1 / loadSize(conf.style.width,"width",conf.domParnet), 1 / loadSize(conf.style.height,"height",conf.domParnet) );
       }

       console.log("响应窗口变化：","width: "+conf.dom.clientWidth+" , "+"height: "+conf.dom.clientHeight);
    }



    var onTouchMove=function(event) {
        var x, y;
        if ( event.changedTouches ) {

            x = event.changedTouches[ 0 ].pageX;
            y = event.changedTouches[ 0 ].pageY;

        } else {

            x = event.clientX;
            y = event.clientY;

        }
        mouse.x = ( x / loadSize(conf.style.width,"width",conf.domParnet) ) * 2 - 1;
        mouse.y = - ( y / loadSize(conf.style.height,"height",conf.domParnet) ) * 2 + 1;


    }

    function checkIntersection() {

        raycaster.setFromCamera( mouse, context.camera );

        var intersects = raycaster.intersectObjects( context.scene.children, true );
        // console.log("选择",intersects)
        if ( intersects.length > 0 ) {
            
            context.outlinePass.selectedObjects.pop();

            var targetObj=intersects[0].object;
            for(var i=0;i<intersects.length;i++){
                if(intersects[i].object.userData.hasOwnProperty("selectable")){
                    targetObj=intersects[i].object;
                    break;
                }
                if(intersects[i].object.parent.userData.hasOwnProperty("selectable")&&intersects[i].object.parent.userData['selectable']){
                    targetObj=intersects[i].object.parent;
                    break;
                }
            }


            if(targetObj.userData.hasOwnProperty("selectable")&&targetObj.userData['selectable']){

                context.outlinePass.selectedObjects .push( targetObj);
                if(targetObj.userData.hasOwnProperty("selectFunction"))targetObj.userData.selectFunction(targetObj);



            }


        } else {
            context.outlinePass.selectedObjects.pop();
            // outlinePass.selectedObjects = [];

        }


    }

    function placeObj(ev) {

        raycaster.setFromCamera( mouse, context.camera );
        var intersects = raycaster.intersectObjects( context.scene.children, true );



        // if(context.waitPlaceObj!=null){
        //     context.waitPlaceObj.position.set(intersects[0].point.x,intersects[0].point.y,intersects[0].point.z);
        //
        // }

    }
    
    function refreshTags() {
        context.tags.forEach(function (item) {
            if(item['dom']!=null){

                conf.popupPanels(div,item['target']);

            }
        });
    }
    
    function tag(obj,div) {
        /**
         * 立方体世界坐标转屏幕坐标
         */
            //获取网格模型boxMesh的世界坐标
        var worldVector = new THREE.Vector3(
            obj.position.x,
            obj.position.y,
            obj.position.z
            );
        var standardVector = worldVector.project(context.camera);//世界坐标转标准设备坐标
        var a = window.innerWidth / 2;
        var b = window.innerHeight / 2;
        var x = Math.round(standardVector.x * a + a);//标准设备坐标转屏幕坐标
        var y = Math.round(-standardVector.y * b + b);//标准设备坐标转屏幕坐标
        /**
         * 更新立方体元素位置
         */
        div.style.left = x + 'px';
        div.style.top = y -130 + 'px';
    }


    function onClickObj(ev) {
        raycaster.setFromCamera( mouse,context.camera );

        // 计算物体和射线的焦点
        var intersects = raycaster.intersectObjects( context.scene.children,true );
        if(intersects.length > 0){


                var targetObj=null;
                for(var i=0;i<intersects.length;i++){
                    if(intersects[i].object.userData.hasOwnProperty("clickable")&&intersects[i].object.visible){
                        targetObj=intersects[i].object;
                        break;
                    }
                    if(intersects[i].object.parent.userData.hasOwnProperty("clickable")&&intersects[i].object.parent.userData['clickable']){
                        targetObj=intersects[i].object.parent;
                        break;
                    }
                }
                if(targetObj==null)return;


                    if(targetObj.userData.hasOwnProperty("clickAndLight")&&targetObj.userData["clickAndLight"]){
                        context.outlinePassGreen.selectedObjects.pop();
                        context.outlinePassGreen.selectedObjects.push(targetObj);
                    }else {

                    }
                    if(targetObj.userData.hasOwnProperty("tagsable")&&targetObj.userData["tagsable"]==true){
                        context.openTag(targetObj)
                    }

                    if(targetObj.userData.hasOwnProperty("clickFunction"))targetObj.userData['clickFunction'](ev,targetObj);
                    console.log("targetObj",targetObj)


                console.log("自定义点击事件挂载完成");

        }
    }
    

    
    context.openTag=function(targetObj) {
        if(targetObj==null)return;
        var obj=isObjInTags(context.tags,targetObj);
        if(obj==null){
            context.tags.push({target:targetObj})
        }else {
            if(obj['dom']!=null){
                obj['dom'].style.display="block"
            }
        }
    }

    context.closeTag=function(targetObj) {
        if(targetObj==null)return;
        var obj=isObjInTags(context.tags,targetObj);
        if(obj!=null){
            obj.dom.style.display="none"
        }
    }


    function isObjInTags(tags,obj) {
        for(var i=0;i<tags.length;i++){
            if(tags[i]['target'].id==obj.id){
                return tags[i];
            }
        }
        return null;
    }



    function  initEvent(isBindWindow) {
        var targetDom=context.dom;
        window.addEventListener( 'resize', onWindowResize, false );
        targetDom.addEventListener( 'mousemove', placeObj ,false);


            //给页面绑定滑轮滚动事件
            if (document.addEventListener) {
                document.addEventListener('DOMMouseScroll', placeObj, false);
            }
            window.onmousewheel = document.onmousewheel = placeObj;

        console.log("window事件挂载完成");

        if (isBindWindow){
            targetDom=window;
        }

        if(context.composer!=null){
            targetDom.addEventListener( 'mousemove', onTouchMove,false );
            targetDom.addEventListener( 'touchmove', onTouchMove ,false);
            targetDom.addEventListener( 'click', onClickObj ,false);

        }


    }

    loadConf(domParnet,configure);
    // 基本场景初始化
    init(domParnet);
    // 基本控制初始化
    init_controls();

    defult_compose(conf.composer.switch);

    defult_light(true);


    defult_background(false);

    // var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    // var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    // var cube = new THREE.Mesh( geometry, material );
    // context.scene.add( cube );


    // var cameraOrtho =   new THREE.PerspectiveCamera( 45, loadSize(conf.style.width,"width",domParnet)/ loadSize(conf.style.height,"height",domParnet), 0.1, 1000 );


    // context.camera.position.z = 50;

    context.camera.position.set( 200, 200, -200 );
    context.camera.fov=45;
    initEvent(conf.event.isBindWindow);
    running(conf.composer.switch);

    let af;
    const numLasers = 20;
    const tail = 200;
    const canvas = document.createElement("canvas");

    var backGroundTextureCanvas=new THREE.CanvasTexture(canvas);
    canvas.height=1024;
    canvas.width=1024;
    // document.body.appendChild(canvas)
    const ctx = canvas.getContext("2d");
    const createLasers = n => {
        const lasers = [];
        for (let i = 0; i < n; ++i) {
            lasers.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                s: Math.random() * 2 + 1
            });
        }
        return lasers;
    };
    const renderLaser = l => {
        const grad = ctx.createLinearGradient(l.x, l.y, l.x, l.y + tail);
        const a = 1 - (canvas.height - l.y) / canvas.height * 0.8;
        grad.addColorStop(0, `hsla(340,100%,100%,${a})`);
        grad.addColorStop(1, "hsla(340,100%,50%,0)");
        ctx.strokeStyle = grad;
        ctx.beginPath();
        ctx.moveTo(l.x, l.y);
        ctx.lineTo(l.x, l.y + tail);
        ctx.stroke();
    };
    const updateLaser = l => {
        l.y -= l.s;
        if (l.y < -tail) {
            l.y = canvas.height;
        }
    };
    const render = lasers => {
        ctx.fillStyle = "hsl(261,43%,7%)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (let l of lasers) {
            renderLaser(l);
            updateLaser(l);
        }
        af = requestAnimationFrame(() => {
            backGroundTextureCanvas.needsUpdate=true;
            render(lasers);
        });
    };
    const backinit = () => {
        cancelAnimationFrame(af);
        render(createLasers(numLasers));
    };

    backinit();

    context.scene.background=backGroundTextureCanvas;





   context.clearTags= function () {
        context.tags.forEach(function (item) {
            if(item.hasOwnProperty("dom")){
                item['dom'].parentElement.removeChild(item['dom'])
            }
        });
        for(var i=0;i<context.tags.length;i++){
            context.tags.shift();
        }

    }



}


