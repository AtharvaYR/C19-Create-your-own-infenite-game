var PLAY = 1;
var END = 0;
var gameState = PLAY;

var john, john_running, john_collided;
var ground, invisibleGround, groundImage;

var fenceImg;

var backgroundImg;
var score=0;
var jumpSound, collidedSound,cryingSound;

var gameOver, restart;


function preload(){
    jumpSound = loadSound("jump.wav")
    collidedSound = loadSound("collided.wav")
    cryingSound = loadSound("crying.wav")
    backgroundImg = loadImage("stadium.jpg")
    
    fenceImg = loadImage("fence.png")
    
    john_running = loadAnimation("running.png","running2.png","running3.png");
    john_collided = loadAnimation("crying.png");
    
    groundImage = loadImage("ground.jpg");
    
    
    
    gameOverImg = loadImage("gameOver.png");
    restartImg = loadImage("restart.png");
}

function setup() {
    createCanvas(600, 200);
  
    
    
    john = createSprite(50,160,20,50);
  john.addAnimation("running", john_running);
  john.addAnimation("collided", john_collided);
  

  john.scale = 0.1;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.1;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  ground.visible=false;
  //create Obstacle and Cloud Groups
  fenceGroup = createGroup();
  
  john.setCollider("rectangle",0,0,john.width,john.height);
  john.debug = false;
  
  score = 0;
  
}

function draw() {
    background(backgroundImg);
    textSize(20);
    fill("black")
    text("Score: "+ score,100,25);
    textSize(20);
  fill("white")
  text("Use space key to jump and space key to restart if your game ends",10,135);
    
    if (gameState===PLAY){
      score = score + Math.round(getFrameRate()/60);
      ground.velocityX = -(6 + 3*score/100);
      
      if((keyDown("SPACE")) && john.y  >= height-120) {
        jumpSound.play( )
        john.velocityY = -10;
         
      }
      
      john.velocityY = john.velocityY + 0.5;
    
      if (ground.x < 0){
        ground.x = ground.width/2;
      }
      gameOver.visible = false;
      restart.visible = false;
      john.collide(invisibleGround);
      
      if (fenceGroup.isTouching(john)){
        cryingSound.play()
        gameState=END
        ;
      }
      spawnfence();
    
      
    }
    else if (gameState === END) {
      
      
      gameOver.visible = true;
      restart.visible = true;
      
      
      //set velcity of each game object to 0
      ground.velocityX = 0;
      john.velocityY = 0;
      fenceGroup.setVelocityXEach(0);
      
      
      //change the trex animation
      john.changeAnimation("collided",john_collided);
      
      //set lifetime of the game objects so that they are never destroyed
      fenceGroup.setLifetimeEach(-1);
      
      
      if( keyDown("SPACE")) {      
        reset();
        
      }
    }
    
    
    drawSprites();
}
function spawnfence() {
    if(frameCount % 60 === 0) {
      var fence = createSprite(600,165,10,40);
       fence.addImage(fenceImg);
      fence.setCollider("rectangle",0,0,fence.width,fence.height);
      // obstacle.debug = true
        fence.debug=false;
      fence.velocityX = -(6 + 3*score/100);
      
      //generate random obstacles
     
      
      //assign scale and lifetime to the obstacle           
      fence.scale = 0.2;
      fence.lifetime = 300;
      fence.depth = john.depth;
      john.depth +=1;
      //add each obstacle to the group
      fenceGroup.add(fence);
    }
  }
  
  function reset(){
    gameState = PLAY;
    gameOver.visible = false;
    restart.visible = false;
    
    fenceGroup.destroyEach();
    
    
    john.changeAnimation("running",john_running);
    
    score = 0;
  }