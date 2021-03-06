/*
My WebGL App
*/
let mainContainer = null;
let fpsContainer
let stats = null;
let camera = null;
let ground = null;
let renderer = null;
let scene = null;
let controls = null;
let life = 5;
let BoxExit = null;
let BoundBoxExit = null;
let PlBox = null;
let BoundPlBox = null;
let BoundEnemy = null;
let enemy = null;
let raycaster = new THREE.Raycaster();
let objects = [];
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let maze = null;
let win = document.getElementById('Win');
let begin = document.getElementById('begin');
let hurt = document.getElementById('hurt');
let LifeCon = document.getElementById('UHD');
let lose = document.getElementById('lose');


let prevTime = performance.now();
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();

let hit = false;
let runAnim = true;

// Global variables

function init() {
  if (THREE.WEBGL.isWebGLAvailable() === false) container.appendChild(WEBGL.getWebGLErrorMessage());
  fpsContainer = document.querySelector('#fps');
  mainContainer = document.querySelector('#webgl-secne');

  scene = new THREE.Scene();
  scene.down = scene.up.clone().multiplyScalar(-1);
  scene.background = new THREE.Color(0xEEEEEE); 
  scene.fog = new THREE.Fog(0xffffff, 0, 750);
  win.style.visibility = "hidden";
  begin.style.visibility = "hidden";
  hurt.style.visibility = "hidden";
  lose.style.visibility = "hidden";


  createStats();
  createCamera();
  createControls();
  createLights();
  createMeshes();
  createRenderer();

      renderer.setAnimationLoop(() => {
        
        if (runAnim){
        animate(); 
        }
        update(); 

        render();
        
        attack();

      });
 
}

function attack(){
  LifeCon.innerHTML = 'Gyvybių skaičius : ' + life;

  if (!hit && new THREE.Box3().setFromObject(PlBox).intersectsBox(BoundEnemy)){
    hurt.style.visibility = "visible";
    life -= 1;
    LifeCon.innerHTML = life;
    hit = true;
    console.log(life);
    setTimeout(function(){  hurt.style.visibility = "hidden";}, 250);
    setTimeout(function(){  hit = false;}, 2000);

  }

  if (!hit && new THREE.Box3().setFromObject(PlBox).intersectsBox(BoundEnemy1)){
    hurt.style.visibility = "visible";
    life -= 1;
    LifeCon.innerHTML = life;
    hit = true;
    console.log(life);
    setTimeout(function(){  hurt.style.visibility = "hidden";}, 250);
    setTimeout(function(){  hit = false;}, 2000);
  }

  if (!hit && new THREE.Box3().setFromObject(PlBox).intersectsBox(BoundEnemy2)){
    hurt.style.visibility = "visible";
    life -= 1;
    LifeCon.innerHTML = life;
    hit = true;
    console.log(life);
    setTimeout(function(){  hurt.style.visibility = "hidden";}, 250);
    setTimeout(function(){  hit = false;}, 2000);
  }

  if (!hit && new THREE.Box3().setFromObject(PlBox).intersectsBox(BoundEnemy3)){
    hurt.style.visibility = "visible";
    life -= 1;
    LifeCon.innerHTML = life;
    hit = true;
    console.log(life);
    setTimeout(function(){  hurt.style.visibility = "hidden";}, 250);
    setTimeout(function(){  hit = false;}, 2000);
  }
  
  if (life <= 0){
    runAnim = false;
    lose.style.visibility = "visible";
    setTimeout(function(){  location.reload();}, 2000);
    console.log('gameover');
  }

  if (life < 3){
    LifeCon.style.color = "red";
  }



}

// Animations
function update() {

  PlBox.position.x = camera.position.x;
  PlBox.position.y = camera.position.y;
  PlBox.position.z = camera.position.z;

  //enemy moving

  BoundEnemy = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
  BoundEnemy.setFromObject(enemy);

  BoundEnemy1 = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
  BoundEnemy1.setFromObject(enemy1);

  BoundEnemy2 = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
  BoundEnemy2.setFromObject(enemy2);

  BoundEnemy3 = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
  BoundEnemy3.setFromObject(enemy3);



  if (runAnim){
    enemy.position.x -= Math.random() * (0.030 - 0.009) + 0.009;
    enemy.position.z -= Math.random() * (0.030 - 0.009) + 0.009;

    enemy1.position.x += Math.random() * (0.030 - 0.009) + 0.009;
    enemy1.position.z -= Math.random() * (0.030 - 0.009) + 0.009;

    enemy2.position.x -= Math.random() * (0.030 - 0.009) + 0.009;
    enemy2.position.z += Math.random() * (0.030 - 0.009) + 0.009;

   enemy3.position.x += Math.random() * (0.030 - 0.009) + 0.009;
   enemy3.position.z += Math.random() * (0.030 - 0.009) + 0.009;

    if(BoundEnemy.intersectsBox(BoundMaze1)){
      scene.remove(enemy);
    }
    if(BoundEnemy.intersectsBox(BoundMaze2)){
      scene.remove(enemy);
    }

    if(BoundEnemy1.intersectsBox(BoundMaze)){
      scene.remove(enemy1);
    }
    if(BoundEnemy1.intersectsBox(BoundMaze1)){
      scene.remove(enemy1);
    }

    if(BoundEnemy2.intersectsBox(BoundMaze1)){
      scene.remove(enemy2);
    }
    if(BoundEnemy2.intersectsBox(BoundMaze3)){
      scene.remove(enemy2);
    }

    if(BoundEnemy3.intersectsBox(BoundMaze2)){
      scene.remove(enemy3);
    }
    if(BoundEnemy3.intersectsBox(BoundMaze3)){
      scene.remove(enemy3);
    }


  }

}


function animate() {

  win.style.visibility = "hidden";
  begin.style.visibility = "hidden";
  
  if (new THREE.Box3().setFromObject(PlBox).intersectsBox(BoundBoxExit)) {
    win.style.visibility = "visible";
  } 
  if (new THREE.Box3().setFromObject(PlBox).intersectsBox(BoundBoxStart)) {
    begin.style.visibility = "visible";
  } 


  if (controls.isLocked === true) {
    
        

    let time = performance.now();
    let delta = ( time - prevTime ) / 1000;
    
    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;
    
    direction.z = Number( moveBackward ) - Number( moveForward );
    direction.x = Number( moveRight ) - Number( moveLeft );
    direction.normalize(); 


   
    if (direction.length() > 0){
      
      let rotatedDirection = direction.clone();
      rotatedDirection.applyEuler( controls.getObject().rotation );
      
      raycaster.set( controls.getObject().position, rotatedDirection);      
      let directionCast = raycaster.intersectObjects( objects );
      
      if (directionCast.length > 0 && directionCast[0].distance < 2){
        direction.multiplyScalar(0);
        velocity.x *= 0;
        velocity.z *= 0;
      }
      
    }
    
    velocity.z -= direction.z * 600.0 * delta;      
    velocity.x += direction.x * 600.0 * delta;

    controls.moveRight( velocity.x * delta );
    controls.moveForward( velocity.z * delta );  

    controls.getObject().position.y += velocity.y * delta; 

 
    raycaster.set( controls.getObject().position, scene.down);

    let intersects = raycaster.intersectObjects( objects.concat( [ground] ));
      
    if (intersects.length == 0 || intersects[0].distance < 10){
      velocity.y = Math.max(0, velocity.y);
      
      let y = 10;
      if (intersects.length > 0) y = intersects[0].point.y + 10;

      controls.getObject().position.y = y;
    }
    
    prevTime = time;

  }  
}


// Statically rendered content
function render() {

  stats.begin();
  renderer.render(scene, camera);
  stats.end();

}

// FPS counter
function createStats() {
  stats = new Stats();
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  fpsContainer.appendChild(stats.dom);
}

// Camera object
function createCamera() {
  const aspect = mainContainer.clientWidth / mainContainer.clientHeight;
  camera = new THREE.PerspectiveCamera(75, aspect, 0.1 , 500);
  camera.position.set(0, 10, 0);
  camera.rotation.y = 90 * Math.PI / 180;

}

// Interactive controls
function createControls() {
  controls = new THREE.PointerLockControls(camera, document.body);
  var blocker = document.getElementById('blocker');
  var instructions = document.getElementById('instructions');
  instructions.addEventListener('click', function() {
    controls.lock();
  }, false);
  controls.addEventListener('lock', function() {
    instructions.style.display = 'none';
    blocker.style.display = 'none';
    win.style.display = '';
    begin.style.display = '';

  });
  controls.addEventListener('unlock', function() {
    blocker.style.display = 'block';
    instructions.style.display = '';
    win.style.display = 'none';
    begin.style.display = 'none';
  });
  scene.add(controls.getObject());
  var onKeyDown = function(event) {
    switch (event.keyCode) {
      case 38: // up
      case 87: // w
        moveForward = true;
        break;
      case 37: // left
      case 65: // a
        moveLeft = true;
        break;
      case 40: // down
      case 83: // s
        moveBackward = true;
        break;
      case 39: // right
      case 68: // d
        moveRight = true;
        break;
    }
  };
  var onKeyUp = function(event) {
    switch (event.keyCode) {
      case 38: // up
      case 87: // w
        moveForward = false;
        break;
      case 37: // left
      case 65: // a
        moveLeft = false;
        break;
      case 40: // down
      case 83: // s
        moveBackward = false;
        break;
      case 39: // right
      case 68: // d
        moveRight = false;
        break;
    }
  };
  document.addEventListener('keydown', onKeyDown, false);
  document.addEventListener('keyup', onKeyUp, false);
  
}

// Light objects
function createLights() {

  ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const light = new THREE.PointLight( 0xffffff, 0.5, 150 );
  light.castShadow = true;  
  light.position.set(0,2.5,0);
  scene.add(light);
  camera.add(light);
  light.target = camera;
}

// Meshes and other visible objects
function createMeshes() {

  //pagrindas

  const geo = new THREE.PlaneBufferGeometry(500, 500);
  const mat = new THREE.MeshLambertMaterial({color: 0x98FB98});
  ground = new THREE.Mesh(geo, mat);
  ground.position.set(0,0,0);
  ground.receiveShadow = true;
  ground.rotateX(-Math.PI / 2);
  scene.add(ground);

  //maze
  maze = new Maze({
    cols: 10,         // amount of cell columns
    rows: 10,         // amount of cell rows
    scale: 20,        // scale of maze
    thickness: 3,     // thickness of maze walls
    depth: 15,        // height of maze walls
    open: false,       // include start and end doors?
    rnd: Math.random  // custom random sampler (between 0 and 1)
});


  const MazeMaterial = new THREE.MeshLambertMaterial({color: 0xF1F1EE});
  const mazes = new THREE.Mesh(maze.geometry, MazeMaterial);
  mazes.rotateX(-Math.PI / 2);
  mazes.position.set(-90,7.5,80);
  maze.castShadow = true;
  scene.add(mazes);
  objects.push(mazes);

  //Box maze start/exit material
  const BoxExitGeo = new THREE.BoxGeometry(20,20,30);
  const BoxExitMat = new THREE.MeshBasicMaterial({transparent: true, opacity:0});
  //Box maze start

  BoxStart = new THREE.Mesh(BoxExitGeo, BoxExitMat);
  BoxStart.position.set(-5,2.5,0);
  BoxStart.rotateY(0.5*Math.PI);

  BoundBoxStart = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
  BoundBoxStart.setFromObject(BoxStart);

  scene.add(BoxStart);

  //Box maze exit

  BoxExit = new THREE.Mesh(BoxExitGeo, BoxExitMat);
  BoxExit.position.set(-215,2.5,178);
  BoxExit.rotateY(0.5*Math.PI);

  BoundBoxExit = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
  BoundBoxExit.setFromObject(BoxExit);

  scene.add(BoxExit);

  //playerBoundingBox

  const PlBoxGeo = new THREE.BoxGeometry(2,2);
  PlBox = new THREE.Mesh(PlBoxGeo, BoxExitMat);
  PlBox.rotateZ(0.5*Math.PI);
  PlBox.position.set(0,5,0);

  scene.add(PlBox);

  //Enemys

  const EnemyGeo = new THREE.BoxGeometry(10,10,10);
  const EnemyMat = new THREE.MeshLambertMaterial({color: 0xFF0000, side: THREE.DoubleSide})

  enemy = new THREE.Mesh(EnemyGeo,EnemyMat);
  enemy.position.setY(5);
  enemy.position.setX(Math.random() * (-185 - -20) + -20);
  enemy.position.setZ(Math.random() * (175 - 10) + 10);
  scene.add(enemy);

  enemy1 = new THREE.Mesh(EnemyGeo,EnemyMat);
  enemy1.position.setY(5);
  enemy1.position.setX(Math.random() * (-185 - -20) + -20);
  enemy1.position.setZ(Math.random() * (175 - 10) + 10);
  scene.add(enemy1);

  enemy2 = new THREE.Mesh(EnemyGeo,EnemyMat);
  enemy2.position.setY(5);
  enemy2.position.setX(Math.random() * (-185 - -20) + -20);
  enemy2.position.setZ(Math.random() * (175 - 10) + 10);
  scene.add(enemy2);

  enemy3 = new THREE.Mesh(EnemyGeo,EnemyMat);
  enemy3.position.setY(5);
  enemy3.position.setX(Math.random() * (-185 - -20) + -20);
  enemy3.position.setZ(Math.random() * (175 - 10) + 10);
  scene.add(enemy3);

  //maze bounding boxes
  MazeBoxSide = new THREE.BoxGeometry(210,20);
  MazeBox = new THREE.Mesh(MazeBoxSide, BoxExitMat);
  MazeBox.position.set(5,5,90);
  MazeBox.rotateY(0.5*Math.PI);
  scene.add(MazeBox);
  BoundMaze = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
  BoundMaze.setFromObject(MazeBox);

  MazeBox1 = new THREE.Mesh(MazeBoxSide, BoxExitMat);
  MazeBox1.position.set(-100,5,-15);
  scene.add(MazeBox1);
  BoundMaze1 = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
  BoundMaze1.setFromObject(MazeBox1);

  MazeBox2 = new THREE.Mesh(MazeBoxSide, BoxExitMat);
  MazeBox2.position.set(-205,5,90);
  MazeBox2.rotateY(0.5*Math.PI);
  scene.add(MazeBox2);
  BoundMaze2 = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
  BoundMaze2.setFromObject(MazeBox2);

  MazeBox3 = new THREE.Mesh(MazeBoxSide, BoxExitMat);
  MazeBox3.position.set(-100,5,195);
  scene.add(MazeBox3);
  BoundMaze3 = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
  BoundMaze3.setFromObject(MazeBox3);
}

// Renderer object and features
function createRenderer() {
  //added antialias
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(mainContainer.clientWidth, mainContainer.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  //renderer.setClearColor(0xEEEEEE);
  mainContainer.appendChild(renderer.domElement);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);
init();