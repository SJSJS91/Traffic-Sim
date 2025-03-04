import * as THREE from 'three';

// Setup Scene, Camera, and Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set Camera Position
//amanda birds eye view:
camera.position.set(0, 10, 20);
camera.position.set(0, 200, 0);
camera.lookAt(0, 0, 0);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 20, 10);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Adjust intensity as needed
scene.add(ambientLight);


const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
const skyTexture = new THREE.TextureLoader().load('assets/day.jpeg');
const skyMaterial = new THREE.MeshBasicMaterial({ map: skyTexture, side: THREE.BackSide });
//if toggle night, make the skyTexture a night texture
const skySphere = new THREE.Mesh(skyGeometry, skyMaterial);
skySphere.position.set(0, 0, 0);
scene.add(skySphere);



// Create Ground (City Base) - changed this to just be the sidewalk for now
const groundGeometry = new THREE.PlaneGeometry(200, 200);
// const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x777777 });

const groundTexture = new THREE.TextureLoader().load('assets/sidewalk4.jpeg');
const groundMaterial = new THREE.MeshStandardMaterial({ map: groundTexture });

const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Create Roads
function createRoad(x, z, width, height) {
    const roadGeometry = new THREE.PlaneGeometry(width, height);

    //const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const roadTexture = new THREE.TextureLoader().load('assets/asphalt2.jpg');
    const roadMaterial = new THREE.MeshStandardMaterial({ map: roadTexture });

    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.position.set(x, 0.01, z);
    road.rotation.x = -Math.PI / 2;
    scene.add(road);
}

// Create 5 horizontal roads
createRoad(0, 0, 200, 10); // Horizontal road (across entire city)
// createRoad(0, 50, 200, 10); // Horizontal road
createRoad(0, -50, 200, 10); // Horizontal road
createRoad(0, 70, 200, 10); // Horizontal road
// createRoad(0, -85, 200, 10); // Horizontal road

// Create 5 vertical roads
createRoad(-50, 0, 10, 200,); // Vertical road
createRoad(50, 0, 10, 200, ); // Vertical road
// createRoad(-85, 0, 10, 200,); // Vertical road (across entire city)
createRoad(80, 0, 10, 200, ); // Vertical road (across entire city)
createRoad(0, 0, 10, 200, ); // Vertical road (centered)




// Create Buildings
// const buildings = [];
function createBuilding(x, z, width, height, depth) {

    const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
    const buildingTexture = new THREE.TextureLoader().load('assets/bldng3.JPG');
    const buildingMaterial = new THREE.MeshStandardMaterial({ map: buildingTexture });
    // const buildingMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
    building.position.set(x, height / 2, z);
    scene.add(building);
    buildings.push(building);

}


// const buildings = [
//     { x: -75, z: 80, width: 8, height: 12, depth: 8 },
//     // { x: -50, z: 85, width: 10, height: 15, depth: 10 },
//     { x: -90, z: 40, width: 12, height: 18, depth: 12 },
//     { x: -65, z: -60, width: 8, height: 10, depth: 8 },
//     { x: -30, z: -80, width: 10, height: 14, depth: 10 },
//     { x: 60, z: 40, width: 12, height: 18, depth: 12 },
//     { x: 90, z: 30, width: 14, height: 20, depth: 14 },
//     { x: -20, z: 60, width: 8, height: 16, depth: 8 },
//     { x: 70, z: -20, width: 12, height: 14, depth: 12 },
//     { x: -60, z: 20, width: 9, height: 12, depth: 9 },
//     // { x: 50, z: -90, width: 10, height: 15, depth: 10 },
//     // { x: 80, z: -70, width: 14, height: 18, depth: 14 },
//     { x: -40, z: 80, width: 10, height: 12, depth: 10 },
//     { x: -80, z: -20, width: 12, height: 14, depth: 12 },
//     { x: -10, z: 50, width: 8, height: 12, depth: 8 },
//     // { x: 20, z: 70, width: 14, height: 16, depth: 14 },
//     { x: -20, z: -40, width: 10, height: 14, depth: 10 },
//     // { x: 0, z: 0, width: 9, height: 12, depth: 9 },
//     { x: 60, z: 10, width: 12, height: 16, depth: 12 },
//     // { x: -50, z: -90, width: 15, height: 20, depth: 15 },
//     { x: 70, z: 50, width: 10, height: 15, depth: 10 },
//     { x: -80, z: 50, width: 14, height: 18, depth: 14 },
//     { x: 30, z: -60, width: 8, height: 10, depth: 8 },
//     { x: 40, z: 90, width: 10, height: 12, depth: 10 },
//     { x: 70, z: 20, width: 15, height: 20, depth: 15 },
//     { x: -70, z: -10, width: 10, height: 12, depth: 10 },
//     // { x: -50, z: 10, width: 12, height: 16, depth: 12 },
//     { x: -80, z: -90, width: 9, height: 12, depth: 9 },
//     { x: 40, z: -80, width: 14, height: 18, depth: 14 },
//     { x: 60, z: -10, width: 10, height: 12, depth: 10 },
//     // { x: 80, z: 70, width: 12, height: 16, depth: 12 },
//     { x: -60, z: -80, width: 10, height: 12, depth: 10 },
//     { x: 30, z: 10, width: 12, height: 14, depth: 12 },
//     { x: -10, z: 10, width: 15, height: 20, depth: 15 },
//     // { x: 50, z: 50, width: 8, height: 10, depth: 8 },
//     { x: -90, z: 30, width: 10, height: 14, depth: 10 },
//     { x: 70, z: 60, width: 9, height: 12, depth: 9 },
//     { x: -30, z: 90, width: 10, height: 16, depth: 10 },
//     { x: 10, z: -30, width: 14, height: 18, depth: 14 },
//     { x: 20, z: -70, width: 10, height: 12, depth: 10 },
//     // { x: -50, z: 50, width: 12, height: 14, depth: 12 },
//     { x: -70, z: 40, width: 12, height: 16, depth: 12 },
//     { x: -90, z: -60, width: 10, height: 12, depth: 10 },
//     // { x: 50, z: -50, width: 8, height: 12, depth: 8 },
//     { x: -20, z: -30, width: 14, height: 18, depth: 14 },
//     { x: 70, z: 80, width: 10, height: 12, depth: 10 },
//     // { x: 80, z: 30, width: 12, height: 16, depth: 12 },
//     { x: 40, z: -40, width: 9, height: 12, depth: 9 },
//     { x: -40, z: -40, width: 12, height: 16, depth: 12 },
//     { x: 60, z: -40, width: 8, height: 10, depth: 8 },
//     { x: -10, z: 90, width: 14, height: 18, depth: 14 },
//     // { x: 50, z: 20, width: 10, height: 12, depth: 10 },
//     // { x: -30, z: 70, width: 12, height: 14, depth: 12 },
//     { x: -70, z: 20, width: 9, height: 12, depth: 9 },
//     { x: -80, z: -30, width: 12, height: 14, depth: 12 },
//     { x: 90, z: -80, width: 8, height: 12, depth: 8 },
//     // { x: -50, z: 30, width: 10, height: 12, depth: 10 },
//     { x: -80, z: 80, width: 8, height: 10, depth: 8 },
//     { x: 10, z: -20, width: 12, height: 14, depth: 12 },
//     // { x: -40, z: 0, width: 10, height: 12, depth: 10 },
//     { x: -60, z: 60, width: 9, height: 12, depth: 9 },
//     { x: -10, z: 80, width: 10, height: 12, depth: 10 },
//     // { x: 70, z: 70, width: 12, height: 14, depth: 12 },
//     { x: -30, z: -80, width: 10, height: 14, depth: 10 },
//     { x: -80, z: -40, width: 12, height: 16, depth: 12 },
//     // { x: 80, z: -40, width: 10, height: 12, depth: 10 },
//     { x: -10, z: 50, width: 14, height: 18, depth: 14 },
//     { x: 40, z: 40, width: 12, height: 14, depth: 12 },
//     { x: -60, z: -30, width: 8, height: 10, depth: 8 },
//     // { x: 70, z: 0, width: 10, height: 12, depth: 10 }
// ];

// // // Place all buildings
// // buildings.forEach(building => {
// //     createBuilding(building.x, building.z, building.width, building.height, building.depth);
// // });



// Create Boundary Walls
const walls = [];

function createWall(x, z, width, height, depth) {
    const wallGeometry = new THREE.BoxGeometry(width, height, depth); 
    const wallTexture = new THREE.TextureLoader().load('assets/wood.jpg');
    const wallMaterial = new THREE.MeshStandardMaterial({ map: wallTexture, side:THREE.DoubleSide }); 
    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wall.position.set(x, height / 2, z); // Set position
    scene.add(wall);

    walls.push(wall);
}

const wallHeight = 10;  

  const wallDepth = 1;    
  const citySize = 200; //for the intermediate demo, our city is 50x50 --> now 200x200
  
  createWall(0, 100.5, citySize, wallHeight, wallDepth); //bottom
  createWall(0, -100.5, citySize, wallHeight, wallDepth); //top
  createWall(-100.5, 0, wallDepth, wallHeight, citySize); //left
  createWall(100.5, 0, wallDepth, wallHeight, citySize); //right



//making the exit
function createExitTunnel(x, z, width, height, depth) {
    const tunnelGeometry = new THREE.BoxGeometry(width, height, depth);
    const tunnelMaterial = new THREE.MeshStandardMaterial({ color: 'black' });
  
    const tunnel = new THREE.Mesh(tunnelGeometry, tunnelMaterial);
    tunnel.position.set(x, height / 2, z); // Position it at the right spot on the top wall
    scene.add(tunnel);

    // const archGeometry = new THREE.CircleGeometry(width / 2, 32, 0, Math.PI); //half-circle
    // const archMaterial = new THREE.MeshStandardMaterial({ color: 'green' }); 
    // const arch = new THREE.Mesh(archGeometry, archMaterial);

    // arch.position.set(0, 0, 0); // Position it directly above the tunnel (height + some offset)
    // arch.rotation.x = Math.PI/2; // Rotate the arch to face downwards
    // scene.add(arch);

}


//FOR DEMO: exit tunnel at the end of the rightmost road on the top wall --> actual product will randomize exit loc
const tunnelWidth = 6;   //same as the road width
const tunnelHeight = 5;
const tunnelDepth = 1;
createExitTunnel(15, -100, tunnelWidth, tunnelHeight, tunnelDepth);


// Create Player Car
/*const carGeometry = new THREE.BoxGeometry(2, 1, 4);
const carMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const playerCar = new THREE.Mesh(carGeometry, carMaterial);*/
const startPosition = { x: 0, y: 0.5, z: 0 };
//playerCar.position.set(startPosition.x, startPosition.y, startPosition.z);
//scene.add(playerCar);

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let playerCar;
const loader = new GLTFLoader();

loader.load( 'models/car_model/scene.gltf', function ( gltfScene ) {
  playerCar = gltfScene.scene;
  playerCar.position.set(0, 0.5, 0);
  playerCar.scale.set(2, 2, 2);
  playerCar.rotation.y = Math.PI;
  scene.add( playerCar );

}, undefined, function ( error ) {

	console.error( error );

} );


function updateCamera() {
  if (!playerCar) return;
  // Define the fixed offset in the car's local space (Behind and Above)
  const offset = new THREE.Vector3(0, 2, -4); // (x, height, distance behind)
  // Create a translation matrix to apply the offset in local space
  const translationMatrix = new THREE.Matrix4().makeTranslation(offset.x, offset.y, offset.z);
  // Apply the translation relative to the car's world transform
  const cameraMatrix = playerCar.matrixWorld.clone().multiply(translationMatrix);
  // Extract the new camera position from the transformed matrix
  const cameraPosition = new THREE.Vector3().setFromMatrixPosition(cameraMatrix);
  // Smoothly move the camera for a natural follow effect
  camera.position.lerp(cameraPosition, 0.1);
  // Make the camera look at the car
  camera.lookAt(playerCar.position);
}


let keys = {};
document.addEventListener("keydown", (event) => keys[event.key.toLowerCase()] = true);
document.addEventListener("keyup", (event) => keys[event.key.toLowerCase()] = false);

let speed = 0;
let maxSpeed = 0.18;
let acceleration = 0.01;
let turnSpeed = 0.03;

function checkCollision(newX, newZ) {
    for (const building of buildings.concat(walls)) {
        const carBox = new THREE.Box3().setFromObject(playerCar);
        const buildingBox = new THREE.Box3().setFromObject(building);
        if (carBox.intersectsBox(buildingBox)) {
            return true;
        }
    }
    return false;
}

function updatePlayerCar() {
    let nextX = playerCar.position.x;
    let nextZ = playerCar.position.z;
    
    if (keys["w"] || keys["arrowup"]) speed = Math.min(speed + acceleration, maxSpeed);
    else if (keys["s"] || keys["arrowdown"]) speed = Math.max(speed - acceleration, -maxSpeed / 2);
    else speed *= 0.98;
    
    if (speed !== 0) {
        if (keys["a"] || keys["arrowleft"]) playerCar.rotation.y += turnSpeed * (speed > 0 ? 1 : -1);
        if (keys["d"] || keys["arrowright"]) playerCar.rotation.y -= turnSpeed * (speed > 0 ? 1 : -1);
    }
    
    nextX += Math.sin(playerCar.rotation.y) * speed;
    nextZ += Math.cos(playerCar.rotation.y) * speed;
    
    if (!checkCollision(nextX, nextZ)) {
        playerCar.position.x = nextX;
        playerCar.position.z = nextZ;
    } else {
        playerCar.position.set(startPosition.x, startPosition.y, startPosition.z);
        speed = 0;
    }
}

function animate() {
    requestAnimationFrame(animate);
    if (playerCar) {
      updatePlayerCar();
    //   updateCamera();
    }
    renderer.render(scene, camera);
  }
  animate();