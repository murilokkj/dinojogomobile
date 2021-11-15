var dinossauro,dino_img,dinogameover,dinoabaixado;
var bordas;
var chao,chao_img;
var chaoinvisivel;
var nuvem,nuvem_img;
var obstaculo;
var pontuacao = 0;
var obstaculogrupo;
var nuvemgrupo;
var gameover,gameover_img;
var restart,restart_img;
var bird,bird_img;
var birdgrupo;
var die;
var checkpoint;
var jump;

var JOGAR = 0;
var FIM = 1;

var mododejogo = JOGAR;

function preload(){
// pre carrega as imagens
  dino_img = loadAnimation("trex1.png","trex3.png","trex4.png");
  
  dinogameover = loadImage("trex_collided.png");
  
  dinoabaixado = loadAnimation("trex_low1.png","trex_low2.png");
  
  chao_img = loadImage("ground2.png");

  nuvem_img = loadImage("cloud.png");
  
  obstaculo1_img = loadImage("obstacle1.png");
  obstaculo2_img = loadImage("obstacle2.png");
  obstaculo3_img = loadImage("obstacle3.png");
  obstaculo4_img = loadImage("obstacle4.png");
  obstaculo5_img = loadImage("obstacle5.png");
  obstaculo6_img = loadImage("obstacle6.png");
  
  gameover_img = loadImage("gameOver.png");
  restart_img = loadImage("restart.png");
  
  bird_img = loadAnimation("bird1.png","bird2.png");
  
  die = loadSound("die.mp3");
  checkpoint = loadSound("checkPoint.mp3");
  jump = loadSound("jump.mp3");
  
}

function setup(){
 createCanvas(windowWidth,windowHeight);
  
  obstaculogrupo = new Group();
  nuvemgrupo = new Group();
  birdgrupo = new Group();
  
  //chao invisivel para corrigir a chao
  chaoinvisivel = createSprite(width /2,height - 5,width,20);
  chaoinvisivel.visible = false;
  
  //cria um sprite do trex
  dinossauro = createSprite(50,height - 100,20,20);
  //adiciona a imagem dentro do sprite
  dinossauro.addAnimation("running",dino_img);
  dinossauro.addImage("gameover",dinogameover);
  dinossauro.addAnimation("abaixado",dinoabaixado);
  dinossauro.scale = 0.5;
  dinossauro.debug = false;
  dinossauro.setCollider("rectangle",0,0,75,50);
  
  
  bordas = createEdgeSprites();
  
  chao = createSprite(width /2,height - 10,width,35);
  chao.x = chao.width /2;
  
  chao.addImage("chao",chao_img);
  
  gameover = createSprite(width /2,height /2,10,10);
  gameover.addImage(gameover_img);
  gameover.scale = 0.7
  gameover.visible = false;
  
  restart = createSprite(width /2,height /2 + 25,10,10);
  restart.addImage(restart_img);
  restart.scale = 0.6;
  restart.visible = false;
  
}

function draw(){
  background("white");
  
  text("Pontuação: " + pontuacao,width - 125,20);
  
  if (mododejogo === JOGAR){
     
    criarnuvens();
  
    criarobstaculo();
    
   criarbird();
    
    //comando para pular só uma vez
    if(touches.length >0 && dinossauro.isTouching(chao)){
     touches = []
      dinossauro.velocityY = -12;
     
      jump.play();
      
    }
    
    //gravidade
    dinossauro.velocityY =  dinossauro.velocityY + 0.8;
    
    //o dino colide com as bordas da tela
    dinossauro.collide(chaoinvisivel);
    
    //chao movendo
    chao.velocityX = -(10 + pontuacao /100);    
  
    if(chao.x < 0){
     chao.x = chao.width /2
    }
  
     pontuacao = pontuacao + Math.round(frameRate() /60);
    
     //if(pontuacao %100 === 0 && pontuacao >0){
       //checkpoint.play();
     //}
    
    
    if(dinossauro.isTouching(obstaculogrupo)||dinossauro.isTouching(birdgrupo)){
      mododejogo = FIM;
      die.play();
    }
    
    if(keyDown(DOWN_ARROW)){
      dinossauro.changeAnimation("abaixado");
    }
    else{
      dinossauro.changeAnimation("running");
    }
  }
  else if (mododejogo === FIM){
    
    chao.velocityX = 0;
    
    obstaculogrupo.setVelocityXEach(0);
    nuvemgrupo.setVelocityXEach(0);
    birdgrupo.setVelocityXEach(0);
    
    dinossauro.velocityY = 0;
    
    nuvemgrupo.setLifetimeEach(-1);
    obstaculogrupo.setLifetimeEach(-1);
    birdgrupo.setLifetimeEach(-1);
    
    dinossauro.changeAnimation("gameover");
    
    restart.visible = true;
    gameover.visible = true;
    
    if(touches.length >0){
      touches = []  
    
      recomecar();
    }
  }
  
  drawSprites();
}

function criarnuvens(){
  
  if (frameCount %80 === 0){
    nuvem = createSprite(width + 20,70,10,10);
    nuvem.velocityX = -2
    nuvem.addImage(nuvem_img);
    nuvem.scale = 0.7;
    nuvem.y = Math.round(random(height - 180,height - 80));
    
    nuvem.lifetime = width + 20;
  
  
    nuvem.depth = dinossauro.depth;
    dinossauro.depth = dinossauro.depth + 1;
    
    nuvemgrupo.add(nuvem)
}  
 
}

function criarobstaculo(){

  
  if (frameCount %60 === 0){
    obstaculo = createSprite(width + 20,height - 25,10,10);
    obstaculo.velocityX = -(10 + pontuacao /100);
    
    obstaculo.scale = 0.5;
    
    var aleatoriobs = Math.round(random(1,6));
    
    switch(aleatoriobs){
      case 1: obstaculo.addImage(obstaculo1_img);
      break;
      case 2: obstaculo.addImage(obstaculo2_img);
      break;
      case 3: obstaculo.addImage(obstaculo3_img);
      break;
      case 4: obstaculo.addImage(obstaculo4_img);
      break;
      case 5: obstaculo.addImage(obstaculo5_img);
      break;
      case 6: obstaculo.addImage(obstaculo6_img);
      break;
      
      default: break;
      
      
    }
    
    obstaculo.lifetime = width + 20;
    
    obstaculogrupo.add(obstaculo);
    
   }
 
}  
function criarbird(){

  if(frameCount %140 === 0){
    bird = createSprite(width + 20,70,10,10);
    bird.velocityX = -(12 + pontuacao /100);
    bird.addAnimation("bird",bird_img);
    bird.scale = 1;
    bird.y = Math.round(random(height - 50,height - 65));
    
    bird.lifetime = width + 50; 
   
    birdgrupo.add(bird);
    
    bird.debug = false;
    bird.setCollider("rectangle",0,0,30,15)
  }
}

function recomecar(){
  mododejogo = JOGAR;
  obstaculogrupo.destroyEach();
  nuvemgrupo.destroyEach();
  birdgrupo.destroyEach();
  
  pontuacao = 0;
  
  restart.visible = false;
  gameover.visible = false;
}
  