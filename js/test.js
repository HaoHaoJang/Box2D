var World,Body1,Body2;
var canvas, context;


//初始化
function init(){
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
	canvasWidth = parseInt(canvas.width);
    canvasHeight = parseInt(canvas.height);

	box2dMain();
}

//初始化box2d
function box2dMain() {
	
    setupWorld();				//1. 创建一个世界
    addBodys();					//2. 为世界创建物体
    setInterval(step, 1000/60);	//3. 让世界动起来
	//step();
}

//setupWorld()
function setupWorld(){

    //1. 设置有效区域大小 - b2AABB 类 （左上角向量,右下角向量）
    worldAABB = new b2AABB();
    worldAABB.minVertex.Set(-1000, -1000);	//左上角
    worldAABB.maxVertex.Set(1000, 1000); 	//右下角

    //2. 定义重力 - 2D向量 - b2Vec2 类 （x,y）
    gravity = new b2Vec2(0, 300);

    //3. 忽略休眠的物体
    var doSleep = true;

    //4. 创建世界 - b2World
    World = new b2World(worldAABB, gravity, doSleep);
}

function add(x,y){
        //1. 定义形状   b2CircleDef,b2BoxDef,b2PolyDef 类
    var Shape1 = new b2CircleDef(); //Shape1:圆形
    Shape1.radius = 20;                 //半径
    Shape1.localPosition.Set(0, 0);     //偏移量
    Shape1.density = 99.0;              //密度
    Shape1.restitution = .9;            //弹性
    Shape1.friction = 1;                //摩擦力
        
    var Shape2 = new b2PolyDef();   //Shape2:多边形
    Shape2.vertexCount = 3;                     //顶点数为5
    Shape2.vertices[0] = new b2Vec2(0,-20);     //顶点1
    Shape2.vertices[1] = new b2Vec2(23.10,20);  //顶点2
    Shape2.vertices[2] = new b2Vec2(-23.10,20); //顶点3
    Shape2.localPosition.Set(0, 30);    //偏移量
    Shape2.density = 1.0;               //密度
    Shape2.restitution = .9;            //弹性
    Shape2.friction = 1;                //摩擦力

    //2. 定义物体   b2BodyDef 类
    var BodyDef1 = new b2BodyDef();
    BodyDef1.position.Set(x, y);    //设置物体的初始位置
    BodyDef1.AddShape(Shape1);          //物体中加入Shape1
    BodyDef1.AddShape(Shape2);          //物体中加入Shape2

    //3. 将物体添加至world
    Body = World.CreateBody(BodyDef1);  //在世界中创建物体
}

 document.getElementById("canvas").onmousedown = function(e){
         add(e.offsetX,e.offsetY);
    }
    
//addBodys()
function addBodys(){



	
	//...可用同样流程继续添加物体，再定义一块地板
	var Shape3 = new b2BoxDef();	//Shape3:矩形
	   
    //木板
    Shape3.extents.Set(300, 5);			//定义矩形高、宽
	var BodyDef2 = new b2BodyDef();
    BodyDef2.position.Set(200, 500);	//设置物体的初始位置
    BodyDef2.AddShape(Shape3);			//物体中加入Shape3
    Body2 = World.CreateBody(BodyDef2);	//在世界中创建物体
	
	
	// 定义物体
	var vbox =  new b2BoxDef();
	vbox.extents.Set(10,90);
	var bodyVbox = new b2BodyDef();
	bodyVbox.position.Set(150,450);
	bodyVbox.AddShape(vbox);
	vbox.density = 1.0;				//密度
    vbox.restitution = .3;			//弹性
    vbox.friction = 1;				//摩擦力
	bodyVbox = World.CreateBody(bodyVbox);
	
	var vbox1 =  new b2BoxDef();
	vbox1.extents.Set(10,60);
	vbox1.density = 1.0;			//密度
    vbox1.restitution = .3;			//弹性
    vbox1.friction = 1;				//摩擦力
	var bodyVbox1 = new b2BodyDef();
	bodyVbox1.position.Set(200,450);
	bodyVbox1.AddShape(vbox1);
	bodyVbox1 = World.CreateBody(bodyVbox1);
	
	var vbox2 =  new b2BoxDef();
	vbox2.extents.Set(10,30);		
	vbox2.density = 1.0;			//密度
    vbox2.restitution = .3;			//弹性
    vbox2.friction = 1;				//摩擦力
	var bodyVbox2 = new b2BodyDef();
	bodyVbox2.position.Set(280,470); 
	bodyVbox2.AddShape(vbox2);
	bodyVbox2 = World.CreateBody(bodyVbox2);
	
	
}


//计算和绘制世界的下一帧
function step(){

	var dt = 1/60;
	//迭代次数，影响物体碰撞的计算精度，太高会导致速度过慢
	var iterations = 10;

	//计算dt秒之后世界中物体的位置
	World.Step(dt,iterations);

	//绘制世界
	drawWorld();

}


//绘制世界
function drawWorld(){
	//绘制之前将上一帧的内容清除
	context.clearRect(0, 0, canvasWidth, canvasHeight);
	//遍历世界中的物体
    for (var b = World.m_bodyList; b; b = b.m_next) {
		//遍历物体中的形状
        for (var s = b.GetShapeList(); s != null; s = s.GetNext()) {
            this.drawShape(s);	//绘制一个形状
        }
    }
}

//绘制一个形状
function drawShape(shape){
    context.strokeStyle = '#000';		//线形
    context.beginPath();
	context.fillStyle = '#000';
    switch (shape.m_type) {
        case b2Shape.e_circleShape:{	//如果是圆形，画圆
            var circle = shape;
            var r = circle.m_radius;
            var pos = circle.m_position;
            var pos2 = circle.m_R.col1.clone().scale(r).add(pos);
            context.arc(pos.x, pos.y, r, 0, Math.PI * 2, false);
            context.moveTo(pos.x, pos.y);
            context.lineTo(pos2.x, pos2.y);
            break;
        }
        case b2Shape.e_polyShape:{		//如果是多边形，画多边形
            var poly = shape;
            var tV = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[0]));
            context.moveTo(tV.x, tV.y);
            for (var i = 0; i < poly.m_vertexCount; i++) {
                var v = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[i]));
                context.lineTo(v.x, v.y);
            }
            context.lineTo(tV.x, tV.y);
            break;
        }
    }
	context.fill();
    context.stroke();	//绘制
}