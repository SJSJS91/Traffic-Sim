import * as THREE from 'three';

// Setup Scene, Camera, and Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set Camera Position
// camera.position.set(0, 10, 50);
// camera.position.set(15, 10, 0);
camera.position.set(0, 50, 0);
// camera.lookAt(15, 0, -25);
camera.lookAt(0, 0, 0);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 20, 10);
scene.add(light);

// Create Ground (City Base)
const groundGeometry = new THREE.PlaneGeometry(50, 50);
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

// Create main roads
createRoad(0, 0, 50, 6); // Horizontal road
// createRoad(0, 10, 50, 6); // Parallel horizontal road
// createRoad(0, -10, 50, 6); // Another road
createRoad(-5, 0, 6, 50); // Vertical road
createRoad(15, 0, 6, 50); // Another vertical road


// Create Buildings
const buildings = [];
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

// Place buildings along the city blocks
createBuilding(-15, -12, 8, 10, 8);
createBuilding(21, -15, 5, 12, 5);
createBuilding(4, 7, 6, 8, 6);
// createBuilding(15, 15, 6, 14, 6);

// Create Boundary Walls
const walls = [];
function createWall(x, z, width, height, depth) {
    const wallGeometry = new THREE.BoxGeometry(width, height, depth); 
    const wallTexture = new THREE.TextureLoader().load('assets/wood.jpg');
    const wallMaterial = new THREE.MeshStandardMaterial({ map: wallTexture }); 
    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wall.position.set(x, height / 2, z); // Set position
    scene.add(wall);
    walls.push(wall);
}

const wallHeight = 10;  
  const wallDepth = 1;    
  const citySize = 52; //for the intermediate demo, our city is 50x50
  
  createWall(0, 25.5, citySize, wallHeight, wallDepth); //bottom
  createWall(0, -25.5, citySize, wallHeight, wallDepth); //top
  createWall(-25.5, 0, wallDepth, wallHeight, citySize); //left
  createWall(25.5, 0, wallDepth, wallHeight, citySize); //right


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
createExitTunnel(15, -25.5, tunnelWidth, tunnelHeight, tunnelDepth);


// Create Player Car
const carGeometry = new THREE.BoxGeometry(2, 1, 4);
const carMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const playerCar = new THREE.Mesh(carGeometry, carMaterial);
const startPosition = { x: 0, y: 0.5, z: 0 };
playerCar.position.set(startPosition.x, startPosition.y, startPosition.z);
scene.add(playerCar);

let keys = {};
document.addEventListener("keydown", (event) => keys[event.key.toLowerCase()] = true);
document.addEventListener("keyup", (event) => keys[event.key.toLowerCase()] = false);

let speed = 0;
let maxSpeed = 0.2;
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
    
    if (keys["w"]) speed = Math.min(speed + acceleration, maxSpeed);
    else if (keys["s"]) speed = Math.max(speed - acceleration, -maxSpeed / 2);
    else speed *= 0.98;
    
    if (speed !== 0) {
        if (keys["a"]) playerCar.rotation.y += turnSpeed * (speed > 0 ? 1 : -1);
        if (keys["d"]) playerCar.rotation.y -= turnSpeed * (speed > 0 ? 1 : -1);
    }
    
    nextX -= Math.sin(playerCar.rotation.y) * speed;
    nextZ -= Math.cos(playerCar.rotation.y) * speed;
    
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
    updatePlayerCar();
    renderer.render(scene, camera);
}
animate();
