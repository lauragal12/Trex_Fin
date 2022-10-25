var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;



function preload(){
  //CARGAR TODAS LAS IMAGENES AL JUEGO 
  trex_running=loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided=loadAnimation("trex_collided.png");

  groundImage=loadImage("ground2.png");
  cloudImage=loadImage("cloud.png");

  obstacle1=loadImage("obstacle1.png");
  obstacle2=loadImage("obstacle2.png");
  obstacle3=loadImage("obstacle3.png");
  obstacle4=loadImage("obstacle4.png");
  obstacle5=loadImage("obstacle5.png");
  obstacle6=loadImage("obstacle6.png");

  gameOverImage=loadImage("gameOver.png");
  restartImage=loadImage("restart.png");

}

function setup() {
  //DIFERENTES OBJETOS
  createCanvas(600,200);

  trex=createSprite(50,180,20,50);
  trex.addAnimation("running",trex_running);
  trex.scale=0.5;

  ground=createSprite(200,180,400,20);
  ground.addImage("ground", groundImage); //imagen del suelo
  ground.x=ground.width/2;  //reiniciar suelo
  
  invisibleGround=createSprite(200,190,400,20);
  invisibleGround.visible=false;

  gameOver=createSprite(width/2, height/2);
  gameOver.addImage(gameOverImage);
  gameOver.scale=0.7;

  restart=createSprite(width/2, 150);
  restart.addImage(restartImage);
  restart.scale=0.7;

  gameOver.visible=false;
  restart.visible=false;

  cloudsGroup=new Group();
  obstaclesGroup= new Group();
  

}

function draw() {
  //TODO EL PROCESO - SE REPITE
  background(200);
  text("Score:"+score, 500,50);

  if(gameState===PLAY){
    score=score+Math.round(getFrameRate()/50);
    ground.velocityX=-5;
    if(ground.x<0)
      ground.x=ground.width/2;

    if(keyDown("space") && trex.y<=160)
      trex.velocityY=-10;
      trex.velocityY=trex.velocityY+0.8;

    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
    

    if(obstaclesGroup.isTouching(trex))
      gameState=END;
  }
  else if(gameState===END){
    gameOver.visible=true;
    restart.visible=true;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    ground.velocityX=0; //parar el suelo
    trex.velocityX=0; //parar al trex
    trex.changeAnimation("collided",trex_collided); //colision

    obstaclesGroup.setLifetimeEach(-1); //no seguir generando obstaculos
    cloudsGroup.setLifetimeEach(-1); //detener las nubes

    if(mousePressedOver(restart)){
      reset();
    }
  }
  drawSprites();
}

function spawnClouds(){
  if(frameCount % 60 == 0){
    var cloud = createSprite(600,120,40,10);
    cloud.y=Math.round(random(80,120));
    cloud.addImage("clouds",cloudImage);
    cloud.scale=0.5;
    cloud.velocityX=-3;

    cloud.lifetime=200;
    cloud.depth=trex.depth;
    trex.depth=trex.depth+1;
    }
  }
  function spawnObstacles(){
    if(frameCount % 80 == 0){
      var obstacle = createSprite(600,165,10,40);
      obstacle.velocityX=-6;
      
      var ran=Math.round(random(1,6));
      switch(ran){
        case 1: obstacle.addImage(obstacle1);
        break;
        case 2: obstacle.addImage(obstacle2);
        break;
        case 3: obstacle.addImage(obstacle3);
        break;
        case 4: obstacle.addImage(obstacle4);
        break;
        case 5: obstacle.addImage(obstacle5);
        break;
        case 6: obstacle.addImage(obstacle6);
        break;
        default: break;

      }
      obstacle.scale=0.5;
      obstacle.lifetime=200;
      obstaclesGroup.add(obstacle);
    }
  }
  function reset(){
    gameState = PLAY;
    gameOver.visible=false;
    restart.visible=false;
    obstaclesGroup.destroyEach();
    cloudsGroup.destroyEach();

    trex.changeAnimation("running", trex_running);
    score=0;

  }