var World,Body1,Body2;
var canvas, context;


//��ʼ��
function init(){
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
	canvasWidth = parseInt(canvas.width);
    canvasHeight = parseInt(canvas.height);

	box2dMain();
}

//��ʼ��box2d
function box2dMain() {
	
    setupWorld();				//1. ����һ������
    addBodys();					//2. Ϊ���紴������
    setInterval(step, 1000/60);	//3. �����綯����
	//step();
}

//setupWorld()
function setupWorld(){

    //1. ������Ч�����С - b2AABB �� �����Ͻ�����,���½�������
    worldAABB = new b2AABB();
    worldAABB.minVertex.Set(-1000, -1000);	//���Ͻ�
    worldAABB.maxVertex.Set(1000, 1000); 	//���½�

    //2. �������� - 2D���� - b2Vec2 �� ��x,y��
    gravity = new b2Vec2(0, 300);

    //3. �������ߵ�����
    var doSleep = true;

    //4. �������� - b2World
    World = new b2World(worldAABB, gravity, doSleep);
}

function add(x,y){
        //1. ������״   b2CircleDef,b2BoxDef,b2PolyDef ��
    var Shape1 = new b2CircleDef(); //Shape1:Բ��
    Shape1.radius = 20;                 //�뾶
    Shape1.localPosition.Set(0, 0);     //ƫ����
    Shape1.density = 99.0;              //�ܶ�
    Shape1.restitution = .9;            //����
    Shape1.friction = 1;                //Ħ����
        
    var Shape2 = new b2PolyDef();   //Shape2:�����
    Shape2.vertexCount = 3;                     //������Ϊ5
    Shape2.vertices[0] = new b2Vec2(0,-20);     //����1
    Shape2.vertices[1] = new b2Vec2(23.10,20);  //����2
    Shape2.vertices[2] = new b2Vec2(-23.10,20); //����3
    Shape2.localPosition.Set(0, 30);    //ƫ����
    Shape2.density = 1.0;               //�ܶ�
    Shape2.restitution = .9;            //����
    Shape2.friction = 1;                //Ħ����

    //2. ��������   b2BodyDef ��
    var BodyDef1 = new b2BodyDef();
    BodyDef1.position.Set(x, y);    //��������ĳ�ʼλ��
    BodyDef1.AddShape(Shape1);          //�����м���Shape1
    BodyDef1.AddShape(Shape2);          //�����м���Shape2

    //3. �����������world
    Body = World.CreateBody(BodyDef1);  //�������д�������
}

 document.getElementById("canvas").onmousedown = function(e){
         add(e.offsetX,e.offsetY);
    }
    
//addBodys()
function addBodys(){



	
	//...����ͬ�����̼���������壬�ٶ���һ��ذ�
	var Shape3 = new b2BoxDef();	//Shape3:����
	   
    //ľ��
    Shape3.extents.Set(300, 5);			//������θߡ���
	var BodyDef2 = new b2BodyDef();
    BodyDef2.position.Set(200, 500);	//��������ĳ�ʼλ��
    BodyDef2.AddShape(Shape3);			//�����м���Shape3
    Body2 = World.CreateBody(BodyDef2);	//�������д�������
	
	
	// ��������
	var vbox =  new b2BoxDef();
	vbox.extents.Set(10,90);
	var bodyVbox = new b2BodyDef();
	bodyVbox.position.Set(150,450);
	bodyVbox.AddShape(vbox);
	vbox.density = 1.0;				//�ܶ�
    vbox.restitution = .3;			//����
    vbox.friction = 1;				//Ħ����
	bodyVbox = World.CreateBody(bodyVbox);
	
	var vbox1 =  new b2BoxDef();
	vbox1.extents.Set(10,60);
	vbox1.density = 1.0;			//�ܶ�
    vbox1.restitution = .3;			//����
    vbox1.friction = 1;				//Ħ����
	var bodyVbox1 = new b2BodyDef();
	bodyVbox1.position.Set(200,450);
	bodyVbox1.AddShape(vbox1);
	bodyVbox1 = World.CreateBody(bodyVbox1);
	
	var vbox2 =  new b2BoxDef();
	vbox2.extents.Set(10,30);		
	vbox2.density = 1.0;			//�ܶ�
    vbox2.restitution = .3;			//����
    vbox2.friction = 1;				//Ħ����
	var bodyVbox2 = new b2BodyDef();
	bodyVbox2.position.Set(280,470); 
	bodyVbox2.AddShape(vbox2);
	bodyVbox2 = World.CreateBody(bodyVbox2);
	
	
}


//����ͻ����������һ֡
function step(){

	var dt = 1/60;
	//����������Ӱ��������ײ�ļ��㾫�ȣ�̫�߻ᵼ���ٶȹ���
	var iterations = 10;

	//����dt��֮�������������λ��
	World.Step(dt,iterations);

	//��������
	drawWorld();

}


//��������
function drawWorld(){
	//����֮ǰ����һ֡���������
	context.clearRect(0, 0, canvasWidth, canvasHeight);
	//���������е�����
    for (var b = World.m_bodyList; b; b = b.m_next) {
		//���������е���״
        for (var s = b.GetShapeList(); s != null; s = s.GetNext()) {
            this.drawShape(s);	//����һ����״
        }
    }
}

//����һ����״
function drawShape(shape){
    context.strokeStyle = '#000';		//����
    context.beginPath();
	context.fillStyle = '#000';
    switch (shape.m_type) {
        case b2Shape.e_circleShape:{	//�����Բ�Σ���Բ
            var circle = shape;
            var r = circle.m_radius;
            var pos = circle.m_position;
            var pos2 = circle.m_R.col1.clone().scale(r).add(pos);
            context.arc(pos.x, pos.y, r, 0, Math.PI * 2, false);
            context.moveTo(pos.x, pos.y);
            context.lineTo(pos2.x, pos2.y);
            break;
        }
        case b2Shape.e_polyShape:{		//����Ƕ���Σ��������
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
    context.stroke();	//����
}