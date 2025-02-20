import * as THREE from 'three';

// Setup Scene, Camera, and Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set Camera Position
camera.position.set(0, 10, 20);
camera.lookAt(0, 0, 0);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 20, 10);
scene.add(light);

// Create Ground (City Base)
const groundGeometry = new THREE.PlaneGeometry(50, 50);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x777777 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Create Roads
function createRoad(x, z, width, height) {
    const roadGeometry = new THREE.PlaneGeometry(width, height);
    const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.position.set(x, 0.01, z);
    road.rotation.x = -Math.PI / 2;
    scene.add(road);
}

createRoad(0, 0, 50, 6);
createRoad(0, 10, 50, 6);
createRoad(0, -10, 50, 6);
createRoad(-10, 0, 6, 50);
createRoad(10, 0, 6, 50);

// Create Buildings
const buildings = [];
function createBuilding(x, z, width, height, depth) {
    const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
    const buildingMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
    building.position.set(x, height / 2, z);
    scene.add(building);
    buildings.push(building);
}

createBuilding(-15, -15, 5, 10, 5);
createBuilding(15, -15, 5, 12, 5);
createBuilding(-15, 15, 6, 8, 6);
createBuilding(15, 15, 6, 14, 6);

// Create Boundary Walls
const walls = [];
function createWall(x, z, width, height, depth) {
    const wallGeometry = new THREE.BoxGeometry(width, height, depth);
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wall.position.set(x, height / 2, z);
    scene.add(wall);
    walls.push(wall);
}

// Complete Enclosed Walls
createWall(0, -25, 50, 5, 1); // Bottom Wall
createWall(0, 25, 50, 5, 1);  // Top Wall
createWall(25, 0, 1, 5, 50);  // Right Wall
createWall(-25, 0, 1, 5, 50); // Left Wall (Fully Closed)

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
