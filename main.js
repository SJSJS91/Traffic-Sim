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
ground.rotation.x = -Math.PI / 2; // Lay flat
scene.add(ground);

// Create Roads
function createRoad(x, z, width, height) {
    const roadGeometry = new THREE.PlaneGeometry(width, height);
    const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.position.set(x, 0.01, z); // Slightly above ground
    road.rotation.x = -Math.PI / 2;
    scene.add(road);
}

// Create main roads
createRoad(0, 0, 50, 6); // Horizontal road
createRoad(0, 10, 50, 6); // Parallel horizontal road
createRoad(0, -10, 50, 6); // Another road
createRoad(-10, 0, 6, 50); // Vertical road
createRoad(10, 0, 6, 50); // Another vertical road

// Create Sidewalks
function createSidewalk(x, z, width, height) {
    const sidewalkGeometry = new THREE.PlaneGeometry(width, height);
    const sidewalkMaterial = new THREE.MeshStandardMaterial({ color: 0xAAAAAA });
    const sidewalk = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);
    sidewalk.position.set(x, 0.02, z);
    sidewalk.rotation.x = -Math.PI / 2;
    scene.add(sidewalk);
}

// Place sidewalks beside roads
createSidewalk(0, 3, 50, 2);
createSidewalk(0, -3, 50, 2);
createSidewalk(0, 13, 50, 2);
createSidewalk(0, -13, 50, 2);
createSidewalk(-13, 0, 2, 50);
createSidewalk(13, 0, 2, 50);

function createBuilding(x, z, width, height, depth) {
  const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
  const buildingMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
  const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
  building.position.set(x, height / 2, z);
  scene.add(building);
}

// Place buildings along the city blocks
createBuilding(-15, -15, 5, 10, 5);
createBuilding(15, -15, 5, 12, 5);
createBuilding(-15, 15, 6, 8, 6);
createBuilding(15, 15, 6, 14, 6);
/*
const carGeometry = new THREE.BoxGeometry(2, 1, 4);
const carMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const playerCar = new THREE.Mesh(carGeometry, carMaterial);
playerCar.position.set(0, 0.5, 0);
scene.add(playerCar);
*/

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
  const offset = new THREE.Vector3(0, 4, -8); // (x, height, distance behind)
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
// Detect Key Presses
document.addEventListener("keydown", (event) => keys[event.key.toLowerCase()] = true);
document.addEventListener("keyup", (event) => keys[event.key.toLowerCase()] = false);

let speed = 0;
let maxSpeed = 0.2;
let acceleration = 0.01;
let turnSpeed = 0.03;

function updatePlayerCar() {
    if (keys["w"] || keys["arrowup"]) {
        speed = Math.min(speed + acceleration, maxSpeed);
    } else if (keys["s"] || keys["arrowdown"]) {
        speed = Math.max(speed - acceleration, -maxSpeed / 2);
    } else {
        speed *= 0.98; // Natural deceleration
    }

    if (speed !== 0) {
        if (keys["a"] || keys["arrowleft"]) playerCar.rotation.y += turnSpeed * (speed > 0 ? 1 : -1);
        if (keys["d"] || keys["arrowright"]) playerCar.rotation.y -= turnSpeed * (speed > 0 ? 1 : -1);
    }

    playerCar.position.x += Math.sin(playerCar.rotation.y) * speed;
    playerCar.position.z += Math.cos(playerCar.rotation.y) * speed;
}

function animate() {
  requestAnimationFrame(animate);
  if (playerCar) {
    updatePlayerCar();
    updateCamera();
  }
  renderer.render(scene, camera);
}
animate();
