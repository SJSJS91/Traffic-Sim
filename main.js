import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let gameStarted = false;
let didPlayerWin = false;
let gameReady = false;
 
 function startGame() {
     if (gameStarted) return; //prevent multiple starts

     console.log("game is being started");
     
     const introScreen = document.getElementById('introScreen');
     if (introScreen) {
         introScreen.style.opacity = '50';
         setTimeout(() => introScreen.style.display = 'none', 500);
     }
     //hide win screen if restart
     const winScreen = document.getElementById('winScreen');
     if (winScreen) {
         winScreen.style.display = 'none';
     }

     const collisionScreen = document.getElementById('collisionScreen');
     if (collisionScreen) {
         collisionScreen.style.display = 'none';
     }
 
 
     gameStarted = true;
     didPlayerWin = false; 
     gameReady = false;

    setTimeout(() => {
        gameReady = true;
        console.log("✅ Collision detection enabled!");
    }, 3000); // 3 second delay

    playerCar.position.set(startPosition.x, startPosition.y, startPosition.z);
    animate(); //start the game
 }
 function playerWins() {
 
     didPlayerWin = true;
     gameStarted = false;
 
     //show win screen
     const winScreen = document.getElementById('winScreen');
     if (winScreen) {
         winScreen.style.display = 'block';
     }
 }

 function showCollisionScreen() {
    console.log("showing the screen now");
    const collisionScreen = document.getElementById("collisionScreen");
    if (collisionScreen) {
        gameStarted = false; // Stop the game
        collisionScreen.style.display = "none"; // Reset display
        
        setTimeout(() => {
            collisionScreen.style.display = "flex"; // Ensure screen appears
        }, 10); // Small delay to force CSS reflow
    }
}


 

// Setup Scene, Camera, and Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set Camera Position
camera.position.set(0, 10, 20);
camera.position.set(0, 150, 0);
camera.lookAt(0, 0, 0);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 20, 10);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Adjust intensity as needed
scene.add(ambientLight);


const skyGeometry = new THREE.SphereGeometry(500, 32, 32);

//const skyTexture = new THREE.TextureLoader().load('assets/day.jpeg');
//const skyMaterial = new THREE.MeshBasicMaterial({ map: skyTexture, side: THREE.BackSide });

// const skyTexture = new THREE.TextureLoader().load('assets/day.jpeg');
const dayTexture = new THREE.TextureLoader().load('assets/day.jpeg');
const nightTexture = new THREE.TextureLoader().load('assets/night.avif');
const skyMaterial = new THREE.MeshBasicMaterial({ map: dayTexture, side: THREE.BackSide });
//if toggle night, make the skyTexture a night texture
const skySphere = new THREE.Mesh(skyGeometry, skyMaterial);
skySphere.position.set(0, 0, 0);
scene.add(skySphere);

//this is the night sky box:
 // Toggle variable
 let isDay = true;
 
 // Event listener for toggling
 window.addEventListener('keydown', (event) => {
     if (event.key.toLowerCase() === 't') {
         isDay = !isDay;
         skyMaterial.map = isDay ? dayTexture : nightTexture;
         skyMaterial.needsUpdate = true; // Ensure the material updates
     }
     // Adjust lighting
     if (isDay) {
         light.intensity = 1; // Full brightness for daytime
         ambientLight.intensity = 0.5; // Normal ambient light
         ambientLight.color.set(0xffffff); // White light
     } else {
         light.intensity = 0.3; // Dimmer light at night
         ambientLight.intensity = 0.2; // Lower ambient light
         ambientLight.color.set(0x446688); // Soft blue moonlight
     }
 });
 
 window.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        startGame();
    }
});

//event listener for clicking the start/restart button
document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('restartButton').addEventListener('click', startGame);
document.getElementById('retryButton').addEventListener('click', startGame);

// Create Ground (City Base) - changed this to just be the sidewalk for now
const groundGeometry = new THREE.PlaneGeometry(200, 200);

const groundTexture = new THREE.TextureLoader().load('assets/sidewalk4.jpeg');
const groundMaterial = new THREE.MeshStandardMaterial({ map: groundTexture });

const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Create Roads
function createRoad(x, z, y, width, height) {
    const roadGeometry = new THREE.PlaneGeometry(width, height);

    // Load texture
    const roadTexture = new THREE.TextureLoader().load('assets/asphalt2.jpg', (texture) => {
        texture.wrapS = THREE.RepeatWrapping;  // Tile horizontally
        texture.wrapT = THREE.RepeatWrapping;  // Tile vertically
        texture.repeat.set(width / 10, height / 10); // Adjust tiling based on size
    });

    const roadMaterial = new THREE.MeshStandardMaterial({ map: roadTexture });
    // const normalMap = textureLoader.load('path_to_your_texture/asphalt_normal.jpg');
    // const roughnessMap = textureLoader.load('path_to_your_texture/asphalt_roughness.jpg');

    const asphaltMaterial = new THREE.MeshStandardMaterial({
        map: roadTexture,
        // normalMap: normalMap,
        // roughnessMap: roughnessMap,
        roughness: 3.0, // Adjust based on your texture
        metalness: 0.0 // Asphalt is non-metallic
    });

    const road = new THREE.Mesh(roadGeometry, asphaltMaterial);
    road.position.set(x, y, z);
    road.rotation.x = -Math.PI / 2;
    scene.add(road);
    return road;
}


createRoad(0, 0, 0.2, 200, 20); // Horizontal road 
createRoad(0, -60, 0.2, 200, 20); // Horizontal road
createRoad(0, 60, 0.2, 200, 20); // Horizontal road

createRoad(-5, 0, 0.1, 20, 200,); // Vertical road
createRoad(-90, 0, 0.1, 20, 130,)
const shortRoad = createRoad(50, 0, 0.1, 20, 170,); // Vertical road
shortRoad.position.z -= 15;


// Create Buildings
const buildings = [];
const buildingLoader = new GLTFLoader();

function loadBuilding(modelPath, position) {
    buildingLoader.load(
        modelPath,
        function (gltf) {
            const building = gltf.scene;
            building.scale.set(
                position.scale.x,
                position.scale.y,
                position.scale.z
            );
            building.position.set(position.x, position.y, position.z);
            building.rotation.set(
                position.rotationX || 0,  // X-axis rotation
                position.rotationY || 0,  // Y-axis rotation
                position.rotationZ || 0   // Z-axis rotation
            );
            buildings.push(building);
            scene.add(building);
            console.log("Building model loaded at:", position);
        },
        undefined,
        function (error) {
            console.error("Error loading model:", error);
        }
    );
}

// Load all buildings with correct scaling
loadBuilding('models/simple_office_building_1.glb', { x: 40, y: 0, z: 79, rotationY: Math.PI / 2, scale: { x: 1, y: 3, z: 4.5 } });
loadBuilding('models/game_ready_city_buildings.glb', { x: 85, y: 0, z: -11, rotationY: 0, scale: { x: 12, y: 12, z: 12 } });
loadBuilding('models/realistic_chicago_buildings.glb', { x: -62, y: -3.7, z: 40, rotationY: 0, scale: { x: 1.5 * 0.2, y: 0.2, z: 0.2 } });
loadBuilding('models/realistic_chicago_buildings.glb', { x: -31, y: -3.7, z: 20, rotationY: Math.PI, scale: { x: 1.5 * 0.2, y: 0.2, z: 0.2 } });
loadBuilding('models/3_buildings_-_ww2_carentan_inspired.glb', { x: 33, y: 0, z: 30, rotationY: Math.PI / 2, scale: { x: 0.01, y: 0.01, z: 0.01 } });
loadBuilding('models/3_buildings_-_ww2_carentan_inspired.glb', { x: 10, y: 0, z: 28, rotationY: -Math.PI / 2, scale: { x: 0.01, y: 0.01, z: 0.01 } });
loadBuilding('models/3_buildings_-_ww2_carentan_inspired.glb', { x: 33, y: 0, z: -28, rotationY: Math.PI / 2, scale: { x: 0.01, y: 0.01, z: 0.01 } });
loadBuilding('models/3_buildings_-_ww2_carentan_inspired.glb', { x: 10, y: 0, z: -30, rotationY: -Math.PI / 2, scale: { x: 0.01, y: 0.01, z: 0.01 } });
loadBuilding('models/low-poly_building.glb', { x: -54, y: 0, z: -82, rotationY: Math.PI, scale: { x: 200, y: 100, z: 100 } });
loadBuilding('models/office_building.glb', { x: -60, y: 20, z: 75, rotationY: 0, scale: { x: 0.22, y: .22, z: 0.13 } });
loadBuilding('models/3_buildings_-_ww2_carentan_inspired.glb', { x: 80, y: 0, z: 45, rotationY: 0, scale: { x: 0.01, y: 0.01, z: 0.01 } });
loadBuilding('models/low_poly__dumpsters.glb', { x: 87, y: 0, z: 17, rotationY: Math.PI, scale: { x: 2, y: 2, z: 2 } });
loadBuilding('models/low_poly__dumpsters.glb', { x: -30, y: 0, z: -14, rotationY: Math.PI/8, scale: { x: 2, y: 2, z: 2 } });
loadBuilding('models/low_poly__pallets.glb', { x: 70, y: 0, z: 17, rotationY: Math.PI/4, scale: { x: 3, y: 3, z: 3 } });
loadBuilding('models/futuristic_building.glb', { x: -50, y: -0.5, z: -20, rotationY: 0, scale: { x: 2, y: 3, z: 2 } });

loadBuilding('models/avenue_road_street_low_poly.glb', { x: 2, y: 0, z: -77, rotationY: 0, scale: { x: .1, y: .1, z: .1 } });
loadBuilding('models/fire_hydrant_low_poly.glb', { x: 65, y: 0, z: -75, rotationY: 0, scale: { x: 1, y: 1, z: 1 } });
loadBuilding('models/danger_barrier_proops.glb', { x: -5, y: 1.5, z: -73, rotationY: 0, scale: { x: 2, y: 2, z: 2 } });
loadBuilding('models/photoscan_low-poly_construction_sand_pile.glb', { x: 30, y: 0, z: -85, rotationY: 0, scale: { x: 2.5, y: 3.5, z: 2.5 } });
loadBuilding('models/chain_link_fence_low_poly_version.glb', { x: 22, y: 0, z: -75, rotationY: 0, scale: { x: 2, y: 1, z: 2 } });
loadBuilding('models/low_poly__pallets.glb', { x: 20, y: 0, z: -83, rotationY: Math.PI/4, scale: { x: 3, y: 3, z: 3 } });
loadBuilding('models/avika_street_food_cart.glb', { x: 77, y: 0, z: -73, rotationY: 0, scale: { x: 3, y: 3, z: 3 } });
loadBuilding('models/free_gmc_motorhome_reimagined_low_poly.glb', { x: 77, y: 3, z: -85, rotationY: -Math.PI/2, scale: { x: 2.5, y: 2.5, z: 2.5 } });

loadBuilding('models/traffic_cone.glb', { x: 50, y: 1.5, z: -84, rotationY: 0, scale: { x: 20, y: 20, z: 20 } });
loadBuilding('models/traffic_cone.glb', { x: 45, y: 1.5, z: -84, rotationY: 0, scale: { x: 20, y: 20, z: 20 } });
loadBuilding('models/traffic_cone.glb', { x: 55, y: 1.5, z: -84, rotationY: 0, scale: { x: 20, y: 20, z: 20 } });







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

    tunnel.geometry.computeBoundingBox();
    const bbox = new THREE.Box3().setFromObject(tunnel);
    return { tunnel, bbox };

}
function createSideExitTunnel(x, z, width, height, depth) {
    const tunnelGeometry = new THREE.BoxGeometry(width, height, depth);
    const tunnelMaterial = new THREE.MeshStandardMaterial({ color: 'black' });
  
    const tunnel = new THREE.Mesh(tunnelGeometry, tunnelMaterial);
    tunnel.position.set(x, height / 2, z); // Position it at the right spot on the top wall
    tunnel.rotation.y = Math.PI / 2;
    scene.add(tunnel);

    // Compute and return bounding box
    tunnel.geometry.computeBoundingBox();
    const bbox = new THREE.Box3().setFromObject(tunnel);
    return { tunnel, bbox };

}

const tunnelWidth = 6; 
const tunnelHeight = 5;
const tunnelDepth = 1;
let index = Math.floor(Math.random() * 4);  // Math.random() * 4 gives a range from 0 to 4 (4 excluded), Math.floor() rounds it to an integer
let random_var = Math.random() * 180 - 90;

let tunnelData;

switch (index) {
    case 0:
        tunnelData = createExitTunnel(random_var, 100, tunnelWidth, tunnelHeight, tunnelDepth);
        break;
    case 1:
        tunnelData = createExitTunnel(random_var, -100, tunnelWidth, tunnelHeight, tunnelDepth);
        break;
    case 2:
        tunnelData = createSideExitTunnel(100, random_var, tunnelWidth, tunnelHeight, tunnelDepth);
        break;
    case 3:
        tunnelData = createSideExitTunnel(-100, random_var, tunnelWidth, tunnelHeight, tunnelDepth);
        break;
    default:
        console.log("Unexpected index value");
}



// Traffic Light Class
class TrafficLight {
    constructor(x, z, rotation, visibleDirection) {
        this.state = 'red'; // Initial state
        this.group = new THREE.Group();
        this.visibleDirection = visibleDirection;
        
        // Pole
        const poleGeometry = new THREE.CylinderGeometry(0.2, 0.2, 8, 32);
        const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
        this.pole = new THREE.Mesh(poleGeometry, poleMaterial);
        this.pole.position.set(7, 2, 0);
        this.group.add(this.pole);

        // Light Box
        const boxGeometry = new THREE.BoxGeometry(12, 0.3, 0.5);
        const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
        this.box = new THREE.Mesh(boxGeometry, boxMaterial);
        this.box.position.set(1, 5.75, 0.1);
        this.group.add(this.box);

        const box2Geometry = new THREE.BoxGeometry(0.75, 2, 0.5);
        const box2Material = new THREE.MeshStandardMaterial({ color: 0x222222 });
        this.box2 = new THREE.Mesh(box2Geometry, box2Material);
        this.box2.position.set(-4.4, 4.75, 0.1);
        this.group.add(this.box2);

        // Lights
        this.lights = {};
        const colors = ['red', 'yellow', 'green'];
        colors.forEach((color, index) => {
            const lightGeometry = new THREE.SphereGeometry(0.3, 16, 16);
            const lightMaterial = new THREE.MeshStandardMaterial({ emissive: color });
            const light = new THREE.Mesh(lightGeometry, lightMaterial);
            light.position.set(-4.4, 5.45 - index * 0.6, -0.125);
            this.group.add(light);
            this.lights[color] = light;
        });
        
        this.group.position.set(x, 0, z);
        this.group.rotation.y = rotation;
        
        this.updateLights();

        // Dynamically compute bounding box based only on the pole
        this.boundingBox = new THREE.Box3().setFromObject(this.pole);
    }

    updateLights() {
        Object.keys(this.lights).forEach(color => {
            this.lights[color].material.emissiveIntensity = (color === this.state) ? 1 : 0.1;
            this.lights[color].visible = (color === this.state && this.visibleDirection);
        });
    }

    setState(newState) {
        this.state = newState;
        this.updateLights();
    }

    updateBoundingBox() {
        //this.boundingBox.setFromObject(this.group);

        this.boundingBox.setFromObject(this.pole);
    }
}

// Create Traffic Lights at Two 4-Way Intersections
const trafficLights = [];
trafficLights.push(new TrafficLight(-18.5, -3.5, Math.PI / 2, true)); // Intersection 1
trafficLights.push(new TrafficLight(6.5, 3.5, -Math.PI / 2, true));
trafficLights.push(new TrafficLight(-9, 14, -Math.PI, true));
trafficLights.push(new TrafficLight(-1.5, -13, 0, true));
trafficLights.push(new TrafficLight(37.5, -4, Math.PI / 2, true)); // Intersection 2
trafficLights.push(new TrafficLight(61.5, 3.5, -Math.PI / 2, true));
trafficLights.push(new TrafficLight(53.5, -13, 0, true));
trafficLights.push(new TrafficLight(46.5, 14, Math.PI, true));
trafficLights.push(new TrafficLight(37.5, -63.5, Math.PI / 2, true)); // Intersection 3
trafficLights.push(new TrafficLight(61.5, -56.5, -Math.PI / 2, true));
trafficLights.push(new TrafficLight(53.5, -72.5, 0, true));
trafficLights.push(new TrafficLight(46.5, -45.5, Math.PI, true));
trafficLights.push(new TrafficLight(-18.5, -63.5, Math.PI / 2, true)); // Intersection 4
trafficLights.push(new TrafficLight(6.5, -56.5, -Math.PI / 2, true));
trafficLights.push(new TrafficLight(-1.5, -72.5, 0, true));
trafficLights.push(new TrafficLight(-9, -45.5, Math.PI, true));
trafficLights.push(new TrafficLight(-18.5, 56.5, Math.PI / 2, true)); // Intersection 1
trafficLights.push(new TrafficLight(6.5, 63.5, -Math.PI / 2, true));
trafficLights.push(new TrafficLight(-9, 74, -Math.PI, true));
trafficLights.push(new TrafficLight(-1.5, 47, 0, true));

trafficLights.forEach(light => scene.add(light.group));


let stopSign;
const loader1 = new GLTFLoader();

loader1.load( 'models/stop_sign/scene.gltf', function ( gltfScene ) {
  stopSign = gltfScene.scene;
  stopSign.position.set(-78, 0, -11.5);
  stopSign.scale.set(0.4, 0.4, 0.4);
  stopSign.rotation.y = Math.PI;
  scene.add( stopSign );

}, undefined, function ( error ) {

	console.error( error );

} );

let stopSign2;
const loader2 = new GLTFLoader();

loader2.load( 'models/stop_sign/scene.gltf', function ( gltfScene ) {
  stopSign2 = gltfScene.scene;
  stopSign2.position.set(39, 0, 49);
  stopSign2.scale.set(0.4, 0.4, 0.4);
  stopSign2.rotation.y = -Math.PI/2;
  scene.add( stopSign2 );

}, undefined, function ( error ) {

	console.error( error );

} );


// Traffic Light Cycle
let timeElapsed = 0;
function updateTrafficLights(deltaTime) {
    timeElapsed += deltaTime;
    let cycleTime = timeElapsed % 14;

    if (cycleTime < 5) {
        trafficLights[0].setState('green');
        trafficLights[1].setState('green');
        trafficLights[2].setState('red');
        trafficLights[3].setState('red');
        trafficLights[4].setState('green');
        trafficLights[5].setState('green');
        trafficLights[6].setState('red');
        trafficLights[7].setState('red');
        trafficLights[8].setState('green');
        trafficLights[9].setState('green');
        trafficLights[10].setState('red');
        trafficLights[11].setState('red');
        trafficLights[12].setState('green');
        trafficLights[13].setState('green');
        trafficLights[14].setState('red');
        trafficLights[15].setState('red');
        trafficLights[16].setState('green');
        trafficLights[17].setState('green');
        trafficLights[18].setState('red');
        trafficLights[19].setState('red');
    } else if (cycleTime < 7) {
        trafficLights[0].setState('yellow');
        trafficLights[1].setState('yellow');
        trafficLights[4].setState('yellow');
        trafficLights[5].setState('yellow');
        trafficLights[8].setState('yellow');
        trafficLights[9].setState('yellow');
        trafficLights[12].setState('yellow');
        trafficLights[13].setState('yellow');
        trafficLights[16].setState('yellow');
        trafficLights[17].setState('yellow');
    } else if (cycleTime < 12) {
        trafficLights[0].setState('red');
        trafficLights[1].setState('red');
        trafficLights[2].setState('green');
        trafficLights[3].setState('green');
        trafficLights[4].setState('red');
        trafficLights[5].setState('red');
        trafficLights[6].setState('green');
        trafficLights[7].setState('green');
        trafficLights[8].setState('red');
        trafficLights[9].setState('red');
        trafficLights[10].setState('green');
        trafficLights[11].setState('green');
        trafficLights[12].setState('red');
        trafficLights[13].setState('red');
        trafficLights[14].setState('green');
        trafficLights[15].setState('green');
        trafficLights[16].setState('red');
        trafficLights[17].setState('red');
        trafficLights[18].setState('green');
        trafficLights[19].setState('green');
    } else {
        trafficLights[2].setState('yellow');
        trafficLights[3].setState('yellow');
        trafficLights[6].setState('yellow');
        trafficLights[7].setState('yellow');
        trafficLights[10].setState('yellow');
        trafficLights[11].setState('yellow');
        trafficLights[14].setState('yellow');
        trafficLights[15].setState('yellow');
        trafficLights[18].setState('yellow');
        trafficLights[19].setState('yellow');
    }
}

// Create Player Car
const startPosition = { x: -90, y: 0.4, z: 0 };


let playerCar;
const loader = new GLTFLoader();

loader.load( 'models/player_car/scene.gltf', function ( gltfScene ) {
  playerCar = gltfScene.scene;
  playerCar.position.set(0, 0.2, 0);
  playerCar.scale.set(1, 1, 1);
  playerCar.rotation.y = Math.PI / 2;
  scene.add( playerCar );

}, undefined, function ( error ) {

	console.error( error );

} );


// Automated Car
let autoCar;// = cars[1];
const autoCarLoader = new GLTFLoader();

autoCarLoader.load('models/car_model_1/scene.gltf', function (gltfScene) {
  autoCar = gltfScene.scene;
  autoCar.position.copy(autoCarState.position);
  //autoCar.position.set(-20, 0.5, 0); // Starting position
  autoCar.scale.set(1.75, 1.75, 1.75);
  autoCar.rotation.y = autoCarState.rotation;
  //autoCar.rotation.y = Math.PI / 2; // Initial rotation
  scene.add(autoCar);
}, undefined, function (error) {
  console.error('Error loading automated car:', error);
});

// Second Automated Car
let autoCar2;// = cars[2];
const autoCar2Loader = new GLTFLoader();

autoCar2Loader.load('models/car_model_2/scene.gltf', function (gltfScene) {
    autoCar2 = gltfScene.scene;
    autoCar2.position.copy(autoCar2State.position);
    autoCar2.scale.set(1.25, 1.25, 1.25);
    autoCar2.rotation.y = autoCar2State.rotation;
    scene.add(autoCar2);
  }, undefined, function (error) {
    console.error('Error loading automated car:', error);
});

// Third Automated Car
let autoCar3;// = cars[3];
const autoCar3Loader = new GLTFLoader();

autoCar3Loader.load('models/car_model_3/scene.gltf', function (gltfScene) {
    autoCar3 = gltfScene.scene;
    autoCar3.position.copy(autoCar3State.position);
    autoCar3.scale.set(1.25, 1.25, 1.25);
    autoCar3.rotation.y = autoCar3State.rotation;
    scene.add(autoCar3);
  }, undefined, function (error) {
    console.error('Error loading automated car:', error);
});

// Fourth Automated Car
let autoCar4;// = cars[4];
const autoCar4Loader = new GLTFLoader();

autoCar4Loader.load('models/car_model_4/scene.gltf', function (gltfScene) {
    autoCar4 = gltfScene.scene;
    autoCar4.position.copy(autoCar4State.position);
    autoCar4.scale.set(0.9, 0.9, 0.9);
    autoCar4.rotation.y = autoCar4State.rotation;
    scene.add(autoCar4);
  }, undefined, function (error) {
    console.error('Error loading automated car:', error);
});

// Fifth Automated Car
let autoCar5;// = cars[5];
const autoCar5Loader = new GLTFLoader();

autoCar5Loader.load('models/car_model_5/scene.gltf', function (gltfScene) {
    autoCar5 = gltfScene.scene;
    autoCar5.position.copy(autoCar5State.position);
    autoCar5.scale.set(1.5, 1.5, 1.5);
    autoCar5.rotation.y = autoCar5State.rotation;
    scene.add(autoCar5);
  }, undefined, function (error) {
    console.error('Error loading automated car:', error);
});


// Fifth Automated Car
let autoCar6;// = cars[5];
const autoCar6Loader = new GLTFLoader();

autoCar6Loader.load('models/car_model_1/scene.gltf', function (gltfScene) {
    autoCar6 = gltfScene.scene;
    autoCar6.position.copy(autoCar6State.position);
    autoCar6.scale.set(1.75, 1.75, 1.75);
    autoCar6.rotation.y = autoCar6State.rotation;
    scene.add(autoCar6);
  }, undefined, function (error) {
    console.error('Error loading automated car:', error);
});

// Path for the automated car to follow (positions around a building)
const autoCarPath = [
  { x: -11.25, z: -6, rotation: 0},
  { x: -11.25, z: 55, rotation: 0},
  { x: 2, z: 67, rotation: Math.PI / 2 },
  { x: 55, z: 67, rotation: Math.PI / 2 },
  { x: 55, z: 67, rotation: Math.PI},
  { x: 55, z: -6, rotation: Math.PI},
  { x: 55, z: -6, rotation: -Math.PI / 2 },
  { x: -8, z: -6, rotation: -Math.PI / 2 },
  { x: -8, z: -6, rotation: 0 }
];

const autoCar3Path = [
    { x: 2, z: -60, rotation: 0},
    { x: 2, z: -60, rotation: 0},
    { x: 50, z: -55, rotation: Math.PI / 2 },
    { x: 45, z: 0, rotation: Math.PI / 2 },
    { x: 45, z: 70, rotation: Math.PI},
    { x: 85, z: 65, rotation: Math.PI},
    { x: 51, z: 57, rotation: Math.PI},
    { x: 51, z: -6, rotation: Math.PI},
    { x: 51, z: -6, rotation: -Math.PI / 2 },
    { x: -5, z: -6, rotation: -Math.PI / 2 },
    { x: -5, z: -6, rotation: 0 }
  ];


  const autoCar4Path = [
    { x: -90, z: -5, rotation: 0},
    { x: -90, z: -5, rotation: 0},
    { x: -85, z: -60, rotation: Math.PI / 2 },
    { x: -5, z: -55, rotation: Math.PI / 2 },
    { x: -10, z: 0, rotation: Math.PI}
  ];



  const autoCar5Path = [
    { x: -97, z: -5, rotation: 0},
    { x: -97, z: -5, rotation: 0},
    { x: -94, z: 68, rotation: Math.PI / 2 },
    { x: 4, z: 63, rotation: Math.PI / 2 },
    { x: 2, z: -6, rotation: Math.PI},
  ];


  const autoCar6Path = [
    { x: -90, z: -5, rotation: 0},
    { x: -90, z: -5, rotation: 0},
    { x: -85, z: -60, rotation: Math.PI / 2 },
    { x: 50, z: -55, rotation: Math.PI / 2 },
    { x: 45, z: 0, rotation: Math.PI / 2 },
    { x: 45, z: 70, rotation: Math.PI},
    { x: 85, z: 65, rotation: Math.PI},
    { x: 51, z: 57, rotation: Math.PI},
    { x: 51, z: -6, rotation: Math.PI},
    { x: 51, z: -6, rotation: -Math.PI / 2 },
    { x: -5, z: -6, rotation: -Math.PI / 2 },
    { x: -5, z: -6, rotation: 0 }
  ];

let currentPathIndex = 0;
let pathProgress = 0;
const autoCarSpeed = 0.15;
const autoCarTurnSpeed = 0.03;

// Current state of the automated car
let autoCarState = {
    position: new THREE.Vector3(-10, 0.2, 20), // Starting position
    rotation: Math.PI / 2, // Initial rotation in radians
    targetWaypoint: 1 // Index of next waypoint (start at 1 since we're at 0)
  };

  // Create a second car state - using a different starting position on the path
let autoCar2State = {
    position: new THREE.Vector3(-11, 0.2, -60), // Different starting position (third waypoint)
    rotation: Math.PI / 2, // Initial rotation for this position
    targetWaypoint: 1 // Start targeting the fourth waypoint
  };

let autoCar3State = {
    position: new THREE.Vector3(2, 0.2, 0), // Different starting position (third waypoint)
    rotation: -Math.PI / 2, // Initial rotation for this position
    targetWaypoint: 1 // Start targeting the fourth waypoint
  };

let autoCar4State = {
position: new THREE.Vector3(10, 0.2, -2), // Different starting position (third waypoint)
rotation: -Math.PI / 2, // Initial rotation for this position
targetWaypoint: 1 // Start targeting the fourth waypoint
};

let autoCar5State = {
    position: new THREE.Vector3(-20, 0.2, -3), // Different starting position (third waypoint)
    rotation: -Math.PI / 2, // Initial rotation for this position
    targetWaypoint: 1 // Start targeting the fourth waypoint
};


let autoCar6State = {
    position: new THREE.Vector3(90, 0.2, -3), // Different starting position (third waypoint)
    rotation: -Math.PI / 2, // Initial rotation for this position
    targetWaypoint: 1 // Start targeting the fourth waypoint
};


// Function to update the automated car's position
function updateAutoCar(deltaTime) {
  if (!autoCar) return;


  // Get current target waypoint
  const targetWaypoint = autoCarPath[autoCarState.targetWaypoint];
  
  // Calculate direction to target
  const directionToTarget = new THREE.Vector2(
    targetWaypoint.x - autoCarState.position.x,
    targetWaypoint.z - autoCarState.position.z
);


const distanceToTarget = directionToTarget.length();

// If we've reached the waypoint (within a small threshold)
if (distanceToTarget < 10) {
    // Move to next waypoint
    autoCarState.targetWaypoint = (autoCarState.targetWaypoint + 1) % autoCarPath.length;
}

// Calculate ideal heading (angle) to target
const targetAngle = Math.atan2(directionToTarget.x, directionToTarget.y);

// Calculate difference between current rotation and target angle
let rotationDiff = targetAngle - autoCarState.rotation;

// Normalize the difference to be between -PI and PI
if (rotationDiff > Math.PI) rotationDiff -= 2 * Math.PI;
if (rotationDiff < -Math.PI) rotationDiff += 2 * Math.PI;



if (autoCar.position.x <= 10 || autoCar.position.x >= 15 || autoCar.position.z >= -3 || autoCar.position.z <= -6
    || trafficLights[1].state != 'red') {
        if (autoCar.position.x <= -13 || autoCar.position.x >= -7 || autoCar.position.z >= -13 || autoCar.position.z <= -18
            || trafficLights[3].state != 'red') {
                if (autoCar.position.x <= -13|| autoCar.position.x >= -7 || autoCar.position.z >= 50 || autoCar.position.z <= 40
                    || trafficLights[19].state != 'red') {
                        if (autoCar.position.x <= 50|| autoCar.position.x >= 60 || autoCar.position.z >= 20 || autoCar.position.z <= 10
                            || trafficLights[7].state != 'red') {
                        

// Apply rotation - limited by turn speed
if (Math.abs(rotationDiff) > 0.01) {
    const rotationAmount = Math.sign(rotationDiff) * Math.min(autoCarTurnSpeed, Math.abs(rotationDiff));
    autoCarState.rotation += rotationAmount;
    
    // Normalize rotation to be between 0 and 2*PI
    if (autoCarState.rotation > Math.PI * 2) autoCarState.rotation -= Math.PI * 2;
    if (autoCarState.rotation < 0) autoCarState.rotation += Math.PI * 2;
}


// Always move forward in the direction the car is facing
autoCarState.position.x += Math.sin(autoCarState.rotation) * autoCarSpeed;
autoCarState.position.z += Math.cos(autoCarState.rotation) * autoCarSpeed;

// Update the actual car model position and rotation
autoCar.position.set(autoCarState.position.x, autoCarState.position.y, autoCarState.position.z);
autoCar.rotation.y = autoCarState.rotation;

                    
                }
            }
    }
    }

}

function updateAutoCar2(deltaTime) {
    if (!autoCar2) return;
  
  
    // Get current target waypoint
    const targetWaypoint = autoCarPath[autoCar2State.targetWaypoint];
    
    // Calculate direction to target
    const directionToTarget = new THREE.Vector2(
      targetWaypoint.x - autoCar2State.position.x,
      targetWaypoint.z - autoCar2State.position.z
  );
  
  
  const distanceToTarget = directionToTarget.length();
  
  // If we've reached the waypoint (within a small threshold)
  if (distanceToTarget < 10) {
      // Move to next waypoint
      autoCar2State.targetWaypoint = (autoCar2State.targetWaypoint + 1) % autoCarPath.length;
  }
  
  // Calculate ideal heading (angle) to target
  const targetAngle = Math.atan2(directionToTarget.x, directionToTarget.y);
  
  // Calculate difference between current rotation and target angle
  let rotationDiff = targetAngle - autoCar2State.rotation;
  
  // Normalize the difference to be between -PI and PI
  if (rotationDiff > Math.PI) rotationDiff -= 2 * Math.PI;
  if (rotationDiff < -Math.PI) rotationDiff += 2 * Math.PI;
  
  if (autoCar2.position.x <= 10 || autoCar2.position.x >= 15 || autoCar2.position.z >= -3 || autoCar2.position.z <= -6
    || trafficLights[1].state != 'red') {
        if (autoCar2.position.x <= -13 || autoCar2.position.x >= -7 || autoCar2.position.z >= -13 || autoCar2.position.z <= -18
            || trafficLights[3].state != 'red') {
                if (autoCar2.position.x <= -13 || autoCar2.position.x >= -7 || autoCar2.position.z >= 50 || autoCar2.position.z <= 40
                    || trafficLights[19].state != 'red') {
                        if (autoCar2.position.x <= 50|| autoCar2.position.x >= 60 || autoCar2.position.z >= 20 || autoCar2.position.z <= 10
                            || trafficLights[7].state != 'red') {
  
  // Apply rotation - limited by turn speed
  if (Math.abs(rotationDiff) > 0.01) {
      const rotationAmount = Math.sign(rotationDiff) * Math.min(autoCarTurnSpeed, Math.abs(rotationDiff));
      autoCar2State.rotation += rotationAmount;
      
      // Normalize rotation to be between 0 and 2*PI
      if (autoCar2State.rotation > Math.PI * 2) autoCar2State.rotation -= Math.PI * 2;
      if (autoCar2State.rotation < 0) autoCar2State.rotation += Math.PI * 2;
  }
  
  
  // Always move forward in the direction the car is facing
  autoCar2State.position.x += Math.sin(autoCar2State.rotation) * autoCarSpeed;
  autoCar2State.position.z += Math.cos(autoCar2State.rotation) * autoCarSpeed;
  
  // Update the actual car model position and rotation
  autoCar2.position.set(autoCar2State.position.x, autoCar2State.position.y, autoCar2State.position.z);
  autoCar2.rotation.y = autoCar2State.rotation;

    }
    }
    }
    }
  }


  function updateAutoCar3(deltaTime) {
    if (!autoCar3) return;
  
  
    // Get current target waypoint
    const targetWaypoint = autoCar3Path[autoCar3State.targetWaypoint];
    
    // Calculate direction to target
    const directionToTarget = new THREE.Vector2(
      targetWaypoint.x - autoCar3State.position.x,
      targetWaypoint.z - autoCar3State.position.z
  );
  
  
  const distanceToTarget = directionToTarget.length();
  
  // If we've reached the waypoint (within a small threshold)
  if (distanceToTarget < 10) {
      // Move to next waypoint
      autoCar3State.targetWaypoint = (autoCar3State.targetWaypoint + 1) % autoCar3Path.length;
  }
  
  // Calculate ideal heading (angle) to target
  const targetAngle = Math.atan2(directionToTarget.x, directionToTarget.y);
  
  // Calculate difference between current rotation and target angle
  let rotationDiff = targetAngle - autoCar3State.rotation;
  
  // Normalize the difference to be between -PI and PI
  if (rotationDiff > Math.PI) rotationDiff -= 2 * Math.PI;
  if (rotationDiff < -Math.PI) rotationDiff += 2 * Math.PI;
  
  if (autoCar3.position.x <= 10 || autoCar3.position.x >= 15 || autoCar3.position.z >= -3 || autoCar3.position.z <= -6
    || trafficLights[1].state != 'red') {
        if (autoCar3.position.x <= -13 || autoCar3.position.x >= -7 || autoCar3.position.z >= -13 || autoCar3.position.z <= -18
            || trafficLights[3].state != 'red') {
                if (autoCar3.position.x <= -13 || autoCar3.position.x >= -7 || autoCar3.position.z >= 50 || autoCar3.position.z <= 40
                    || trafficLights[19].state != 'red') {
                        if (autoCar3.position.x <= -3 || autoCar3.position.x >= 3 || autoCar3.position.z >= -40 || autoCar3.position.z <= -50
                            || trafficLights[15].state != 'red') {
                                if (autoCar3.position.x <= 30|| autoCar3.position.x >= 40 || autoCar3.position.z >= -50 || autoCar3.position.z <= -60
                                    || trafficLights[8].state != 'red') {
                                        if (autoCar3.position.x <= 40|| autoCar3.position.x >= 50 || autoCar3.position.z >= -10 || autoCar3.position.z <= -20
                                            || trafficLights[6].state != 'red') {
                                                if (autoCar3.position.x <= 50|| autoCar3.position.x >= 60 || autoCar3.position.z >= 20 || autoCar3.position.z <= 10
                                                    || trafficLights[7].state != 'red') {


  // Apply rotation - limited by turn speed
  if (Math.abs(rotationDiff) > 0.01) {
      const rotationAmount = Math.sign(rotationDiff) * Math.min(autoCarTurnSpeed, Math.abs(rotationDiff));
      autoCar3State.rotation += rotationAmount;
      
      // Normalize rotation to be between 0 and 2*PI
      if (autoCar3State.rotation > Math.PI * 2) autoCar3State.rotation -= Math.PI * 2;
      if (autoCar3State.rotation < 0) autoCar3State.rotation += Math.PI * 2;
  }
  
  
  // Always move forward in the direction the car is facing
  autoCar3State.position.x += Math.sin(autoCar3State.rotation) * autoCarSpeed;
  autoCar3State.position.z += Math.cos(autoCar3State.rotation) * autoCarSpeed;
  
  // Update the actual car model position and rotation
  autoCar3.position.set(autoCar3State.position.x, autoCar3State.position.y, autoCar3State.position.z);
  autoCar3.rotation.y = autoCar3State.rotation;

    }
    }
    }
    }
    }
    }
    }
  
  }


  function updateAutoCar4(deltaTime) {
    if (!autoCar4) return;
  
  
    // Get current target waypoint
    const targetWaypoint = autoCar4Path[autoCar4State.targetWaypoint];
    
    // Calculate direction to target
    const directionToTarget = new THREE.Vector2(
      targetWaypoint.x - autoCar4State.position.x,
      targetWaypoint.z - autoCar4State.position.z
  );
  
  
  const distanceToTarget = directionToTarget.length();
  
  // If we've reached the waypoint (within a small threshold)
  if (distanceToTarget < 10) {
      // Move to next waypoint
      autoCar4State.targetWaypoint = (autoCar4State.targetWaypoint + 1) % autoCar4Path.length;
  }
  
  // Calculate ideal heading (angle) to target
  const targetAngle = Math.atan2(directionToTarget.x, directionToTarget.y);
  
  // Calculate difference between current rotation and target angle
  let rotationDiff = targetAngle - autoCar4State.rotation;
  
  // Normalize the difference to be between -PI and PI
  if (rotationDiff > Math.PI) rotationDiff -= 2 * Math.PI;
  if (rotationDiff < -Math.PI) rotationDiff += 2 * Math.PI;
  

  if (autoCar4.position.x <= 10 || autoCar4.position.x >= 15 || autoCar4.position.z >= -3 || autoCar4.position.z <= -6
    || trafficLights[1].state != 'red') {
        if (autoCar4.position.x <= -13 || autoCar4.position.x >= -7 || autoCar4.position.z >= -13 || autoCar4.position.z <= -18
            || trafficLights[3].state != 'red') {
                if (autoCar4.position.x <= -13 || autoCar4.position.x >= -7 || autoCar4.position.z >= 50 || autoCar4.position.z <= 40
                    || trafficLights[19].state != 'red') {
                        if (autoCar4.position.x <= -23 || autoCar4.position.x >= -17 || autoCar4.position.z >= -52 || autoCar4.position.z <= -62
                            || trafficLights[12].state != 'red') {
  
  // Apply rotation - limited by turn speed
  if (Math.abs(rotationDiff) > 0.01) {
      const rotationAmount = Math.sign(rotationDiff) * Math.min(autoCarTurnSpeed, Math.abs(rotationDiff));
      autoCar4State.rotation += rotationAmount;
      
      // Normalize rotation to be between 0 and 2*PI
      if (autoCar4State.rotation > Math.PI * 2) autoCar4State.rotation -= Math.PI * 2;
      if (autoCar4State.rotation < 0) autoCar4State.rotation += Math.PI * 2;
  }
  
  
  // Always move forward in the direction the car is facing
  autoCar4State.position.x += Math.sin(autoCar4State.rotation) * autoCarSpeed;
  autoCar4State.position.z += Math.cos(autoCar4State.rotation) * autoCarSpeed;
  
  // Update the actual car model position and rotation
  autoCar4.position.set(autoCar4State.position.x, autoCar4State.position.y, autoCar4State.position.z);
  autoCar4.rotation.y = autoCar4State.rotation;

    }
    }
    }
    }
  
  }


  function updateAutoCar5(deltaTime) {
    if (!autoCar5) return;
  
  
    // Get current target waypoint
    const targetWaypoint = autoCar5Path[autoCar5State.targetWaypoint];
    
    // Calculate direction to target
    const directionToTarget = new THREE.Vector2(
      targetWaypoint.x - autoCar5State.position.x,
      targetWaypoint.z - autoCar5State.position.z
  );
  
  
  const distanceToTarget = directionToTarget.length();
  
  // If we've reached the waypoint (within a small threshold)
  if (distanceToTarget < 10) {
      // Move to next waypoint
      autoCar5State.targetWaypoint = (autoCar5State.targetWaypoint + 1) % autoCar5Path.length;
  }
  
  // Calculate ideal heading (angle) to target
  const targetAngle = Math.atan2(directionToTarget.x, directionToTarget.y);
  
  // Calculate difference between current rotation and target angle
  let rotationDiff = targetAngle - autoCar5State.rotation;
  
  // Normalize the difference to be between -PI and PI
  if (rotationDiff > Math.PI) rotationDiff -= 2 * Math.PI;
  if (rotationDiff < -Math.PI) rotationDiff += 2 * Math.PI;
  
  if (autoCar5.position.x <= 10 || autoCar5.position.x >= 15 || autoCar5.position.z >= -3 || autoCar5.position.z <= -6
    || trafficLights[1].state != 'red') {
        if (autoCar5.position.x <= -2 || autoCar5.position.x >= 2 || autoCar5.position.z >= 25 || autoCar5.position.z <= 20
            || trafficLights[2].state != 'red') {
                if (autoCar5.position.x <= -13 || autoCar5.position.x >= -7 || autoCar5.position.z >= -13 || autoCar5.position.z <= -18
                    || trafficLights[3].state != 'red') {
                        if (autoCar5.position.x <= -28 || autoCar5.position.x >= -21 || autoCar5.position.z >= 68 || autoCar5.position.z <= 62
                            || trafficLights[16].state != 'red') {
                                if (autoCar5.position.x <= -13 || autoCar5.position.x >= -7 || autoCar5.position.z >= 50 || autoCar5.position.z <= 40
                                    || trafficLights[19].state != 'red') {


  // Apply rotation - limited by turn speed
  if (Math.abs(rotationDiff) > 0.01) {
      const rotationAmount = Math.sign(rotationDiff) * Math.min(autoCarTurnSpeed, Math.abs(rotationDiff));
      autoCar5State.rotation += rotationAmount;
      
      // Normalize rotation to be between 0 and 2*PI
      if (autoCar5State.rotation > Math.PI * 2) autoCar5State.rotation -= Math.PI * 2;
      if (autoCar5State.rotation < 0) autoCar5State.rotation += Math.PI * 2;
  }
  
  
  // Always move forward in the direction the car is facing
  autoCar5State.position.x += Math.sin(autoCar5State.rotation) * autoCarSpeed;
  autoCar5State.position.z += Math.cos(autoCar5State.rotation) * autoCarSpeed;
  
  // Update the actual car model position and rotation
  autoCar5.position.set(autoCar5State.position.x, autoCar5State.position.y, autoCar5State.position.z);
  autoCar5.rotation.y = autoCar5State.rotation;
  
            }
    }
    }
    }
    }
  }



  function updateAutoCar6(deltaTime) {
    if (!autoCar6) return;
  
  
    // Get current target waypoint
    const targetWaypoint = autoCar6Path[autoCar6State.targetWaypoint];
    
    // Calculate direction to target
    const directionToTarget = new THREE.Vector2(
      targetWaypoint.x - autoCar6State.position.x,
      targetWaypoint.z - autoCar6State.position.z
  );
  
  
  const distanceToTarget = directionToTarget.length();
  
  // If we've reached the waypoint (within a small threshold)
  if (distanceToTarget < 10) {
      // Move to next waypoint
      autoCar6State.targetWaypoint = (autoCar6State.targetWaypoint + 1) % autoCar6Path.length;
  }
  
  // Calculate ideal heading (angle) to target
  const targetAngle = Math.atan2(directionToTarget.x, directionToTarget.y);
  
  // Calculate difference between current rotation and target angle
  let rotationDiff = targetAngle - autoCar6State.rotation;
  
  // Normalize the difference to be between -PI and PI
  if (rotationDiff > Math.PI) rotationDiff -= 2 * Math.PI;
  if (rotationDiff < -Math.PI) rotationDiff += 2 * Math.PI;

  if (autoCar6.position.x <= 10 || autoCar6.position.x >= 15 || autoCar6.position.z >= -3 || autoCar6.position.z <= -6
    || trafficLights[1].state != 'red') {
        if (autoCar6.position.x <= -13 || autoCar6.position.x >= -7 || autoCar6.position.z >= -13 || autoCar6.position.z <= -18
            || trafficLights[3].state != 'red') {
                if (autoCar6.position.x <= -13 || autoCar6.position.x >= -7 || autoCar6.position.z >= 50 || autoCar6.position.z <= 40
                    || trafficLights[19].state != 'red') {
                        if (autoCar6.position.x <= -23 || autoCar6.position.x >= -17 || autoCar6.position.z >= -52 || autoCar6.position.z <= -62
                            || trafficLights[12].state != 'red') {
                                if (autoCar6.position.x <= 30|| autoCar6.position.x >= 40 || autoCar6.position.z >= -50 || autoCar6.position.z <= -60
                                    || trafficLights[8].state != 'red') {
                                        if (autoCar6.position.x <= 40|| autoCar6.position.x >= 50 || autoCar6.position.z >= -10 || autoCar6.position.z <= -20
                                            || trafficLights[6].state != 'red') {
                                                if (autoCar6.position.x <= 50|| autoCar6.position.x >= 60 || autoCar6.position.z >= 20 || autoCar6.position.z <= 10
                                                    || trafficLights[7].state != 'red') {
        
  
  
  // Apply rotation - limited by turn speed
  if (Math.abs(rotationDiff) > 0.01) {
      const rotationAmount = Math.sign(rotationDiff) * Math.min(autoCarTurnSpeed, Math.abs(rotationDiff));
      autoCar6State.rotation += rotationAmount;
      
      // Normalize rotation to be between 0 and 2*PI
      if (autoCar6State.rotation > Math.PI * 2) autoCar6State.rotation -= Math.PI * 2;
      if (autoCar6State.rotation < 0) autoCar6State.rotation += Math.PI * 2;
  }
  
  
  // Always move forward in the direction the car is facing
  autoCar6State.position.x += Math.sin(autoCar6State.rotation) * autoCarSpeed;
  autoCar6State.position.z += Math.cos(autoCar6State.rotation) * autoCarSpeed;
  
  // Update the actual car model position and rotation
  autoCar6.position.set(autoCar6State.position.x, autoCar6State.position.y, autoCar6State.position.z);
  autoCar6.rotation.y = autoCar6State.rotation;
  

    }
    }
    }
    }
    }
    }
    }
  }

// Check collision between player car and automated car
function checkAutoCarCollision() {
  if (!playerCar || !autoCar) return false;
  
  const playerBox = new THREE.Box3().setFromObject(playerCar);
  const autoBox = new THREE.Box3().setFromObject(autoCar);
  const autoBox2 = new THREE.Box3().setFromObject(autoCar2);
  const autoBox3 = new THREE.Box3().setFromObject(autoCar3);
  const autoBox4 = new THREE.Box3().setFromObject(autoCar4);
  const autoBox5 = new THREE.Box3().setFromObject(autoCar5);
  const autoBox6 = new THREE.Box3().setFromObject(autoCar6);
  
  return (playerBox.intersectsBox(autoBox) || playerBox.intersectsBox(autoBox2)|| playerBox.intersectsBox(autoBox3)
  || playerBox.intersectsBox(autoBox4) || playerBox.intersectsBox(autoBox5) || playerBox.intersectsBox(autoBox6));
}


const npcs = []; 
const npcLoader = new GLTFLoader();

// Function to load a static NPC model
function loadNPC(modelPath, position, scale, rotationY = 0) {
    npcLoader.load(modelPath, function (gltfScene) {
        const npc = gltfScene.scene;
        npc.position.set(position.x, position.y, position.z);
        npc.scale.set(scale, scale, scale);
        npc.rotation.y = rotationY;
        scene.add(npc);
        npcs.push(npc); 
    }, undefined, function (error) {
        console.error(error);
    });
}

// List of NPC models
const npcModels = [
    'models/npc1/scene.gltf',
    'models/npc2/scene.gltf',
    'models/npc3/scene.gltf',
    'models/npc4/scene.gltf',
    'models/npc5/scene.gltf',
    'models/npc6/scene.gltf'
];

// Data for multiple NPCs with different positions and scales
const npcConfigs = [
    { position: { x: 62, y: 0.2, z: 45 }, scale: 1, rotationY: -Math.PI / 2 },
    { position: { x: -20, y: 0.2, z: 75 }, scale: 0.4, rotationY: Math.PI },
    { position: { x: 10, y: 1.25, z: 75 }, scale: 0.6, rotationY: 0 },
    { position: { x: 8, y: -0.01, z: -72 }, scale: 0.01, rotationY: -Math.PI / 2 },
    { position: { x: 67, y: 0.2, z: -78 }, scale: 1, rotationY: 0 },
    { position: { x: -17, y: 0.2, z: -72 }, scale: 1, rotationY: 0 }
];

// Load different NPC models at different positions
npcConfigs.forEach((config, index) => {
    const modelPath = npcModels[index % npcModels.length]; // Cycle through models
    loadNPC(modelPath, config.position, config.scale, config.rotationY);
});

// animated pedestrians
const animatedNpcs = [];
const mixers = []; // store animation mixers
const animatedNpcLoader = new GLTFLoader();

// NPC state initialization with correct path definitions
const npcPaths = [
    // Pedestrian 1 Path (clockwise loop)
    [
        new THREE.Vector3(-75, 0.2, -45),  // Starting point
        new THREE.Vector3(-20, 0.2, -45),  // Waypoint 1
        new THREE.Vector3(-20, 0.2, -15),  // Waypoint 2
        new THREE.Vector3(-75, 0.2, -15),  // Waypoint 3
    ],
    // Pedestrian 2 Path (clockwise loop)
    [
        new THREE.Vector3(-78, 1.1, 14),  // Starting point
        new THREE.Vector3(-18, 1.1, 14),  // Waypoint 1
        new THREE.Vector3(-18, 1.1, 47),  // Waypoint 2
        new THREE.Vector3(-78, 1.1, 47),  // Waypoint 3
    ],
    // Pedestrian 3 Path (clockwise loop)
    [
        new THREE.Vector3(65, 0.2, -20),   // Starting point
        new THREE.Vector3(65, 0.2, -49),   // Waypoint 1
        new THREE.Vector3(90, 0.2, -49),   // Waypoint 2
        new THREE.Vector3(90, 0.2, -11),   // Waypoint 3
        new THREE.Vector3(65, 0.2, -11),   // Waypoint 4
        new THREE.Vector3(65, 0.2, -49),   // Waypoint 5
    ],
    // Pedestrian 4 Path (back and forth)
    [
        new THREE.Vector3(20, 0.2, -25),  // Starting point
        new THREE.Vector3(20, 0.2, -13),  // Waypoint 1
        new THREE.Vector3(20, 0.2, -47),  // Waypoint 2
        new THREE.Vector3(20, 0.2, -13),  // Waypoint 3
        new THREE.Vector3(20, 0.2, -47),  // Waypoint 4
    ],
    // Pedestrian 5 Path (back and forth)
    [
        new THREE.Vector3(23, 0.2, 15),   // Starting point
        new THREE.Vector3(23, 0.2, 47),   // Waypoint 1
        new THREE.Vector3(23, 0.2, 13),   // Waypoint 2
        new THREE.Vector3(23, 0.2, 47),   // Waypoint 3
        new THREE.Vector3(23, 0.2, 13),   // Waypoint 4
    ]
];

// NPC state initialization
let animatedNpcsState = [];

function loadAnimatedNpc(modelPath, position, scale, rotationY = 0, index_in) {
    animatedNpcLoader.load(modelPath, function (gltf) {
        const npc = gltf.scene;
        npc.position.set(position.x, position.y, position.z);
        npc.scale.set(scale, scale, scale);
        npc.rotation.y = rotationY; // Apply initial rotation
        
        // Store the index directly in the npc userData for reliable reference
        npc.userData.index = index_in;
        
        scene.add(npc);
        animatedNpcs.push(npc); // Store in NPCs array

        // Initialize the state for this NPC
        const npcState = {
            position: position.clone(),
            currentWaypoint: 0,
            targetWaypoint: 1,
            isMovingForward: true, // For back-and-forth paths
            pathType: index_in >= 3 ? 'backAndForth' : 'loop', // Determine path type based on index
            index: index_in // Store the index in state as well for easy reference
        };
        animatedNpcsState.push(npcState);

        // Setup animations
        if (gltf.animations.length > 0) {
            const mixer = new THREE.AnimationMixer(npc);
            const action = mixer.clipAction(gltf.animations[0]); // Play walking animation
            action.play();
            mixers.push(mixer);
            npc.userData.mixer = mixer;
        } else {
            console.warn("No animations found in model:", modelPath);
        }
    }, undefined, function (error) {
        console.error("Error loading NPC model:", error);
    });
}

// Load the NPCs with initial positioning
loadAnimatedNpc('models/animated_npc1/scene.gltf', new THREE.Vector3(-75, 0.2, -45), 0.009, Math.PI/2, 0);
loadAnimatedNpc('models/animated_npc2/scene.gltf', new THREE.Vector3(-78, 1.1, 14), 0.02, Math.PI/2, 1);
loadAnimatedNpc('models/animated_npc3/scene.gltf', new THREE.Vector3(65, 0.2, -20), 0.95, Math.PI, 2);
loadAnimatedNpc('models/animated_npc4/scene.gltf', new THREE.Vector3(20, 0.2, -25), 12, 0, 3);
loadAnimatedNpc('models/animated_npc5/scene.gltf', new THREE.Vector3(23, 0.2, 25), 0.5, 0, 4);

function updatePedestrianMovement(deltaTime) {
    if (animatedNpcs.length === 0) return;  // Wait until NPCs are fully loaded

    // Create a map to associate NPCs with their states and paths
    // This prevents the need for nested loops
    const npcMap = new Map();
    
    // First, sort the NPCs by their index
    for (let i = 0; i < animatedNpcs.length; i++) {
        const npc = animatedNpcs[i];
        const index = npc.userData.index;
        
        // Check if this NPC has a valid index
        if (index !== undefined) {
            npcMap.set(index, {
                npc: npc,
                state: null,
                path: null
            });
        }
    }
    
    // Then, match states to NPCs
    for (let i = 0; i < animatedNpcsState.length; i++) {
        const state = animatedNpcsState[i];
        const index = state.index;
        
        if (npcMap.has(index)) {
            npcMap.get(index).state = state;
        }
    }
    
    // Assign paths to NPCs
    for (let i = 0; i < npcPaths.length; i++) {
        const path = npcPaths[i];
        
        if (npcMap.has(i)) {
            npcMap.get(i).path = path;
        }
    }
    
    // Now process each NPC with its correct state and path
    for (let i = 0; i < npcPaths.length; i++) {
        // Skip if no NPC exists for this path
        if (!npcMap.has(i)) continue;
        
        const { npc, state, path } = npcMap.get(i);
        
        // Skip if any required data is missing
        if (!npc || !state || !path) continue;
        
        // Speed is now dependent on delta time for smoother animation
        const speed = 2.0; // Units per second
        const moveStep = speed * deltaTime;
        
        // Get current and target waypoints
        const currentPos = state.position;
        const targetPos = path[state.targetWaypoint];
        
        // Calculate direction vector to target
        const directionVector = new THREE.Vector3(
            targetPos.x - currentPos.x,
            targetPos.y - currentPos.y,
            targetPos.z - currentPos.z
        );
        
        const distanceToTarget = directionVector.length();
        
        // If we've reached the waypoint (within a small threshold)
        if (distanceToTarget < moveStep) {
            // Move directly to the waypoint
            state.position.copy(targetPos);
            npc.position.copy(state.position);
            
            // Update waypoint targeting based on path type
            if (state.pathType === 'loop') {
                // For loop paths, simply move to the next waypoint in sequence
                state.currentWaypoint = state.targetWaypoint;
                state.targetWaypoint = (state.targetWaypoint + 1) % path.length;
            } else if (state.pathType === 'backAndForth') {
                // For back-and-forth paths, change direction at endpoints
                state.currentWaypoint = state.targetWaypoint;
                
                if (state.isMovingForward) {
                    if (state.targetWaypoint === path.length - 1) {
                        state.isMovingForward = false;
                        state.targetWaypoint--;
                    } else {
                        state.targetWaypoint++;
                    }
                } else {
                    if (state.targetWaypoint === 0) {
                        state.isMovingForward = true;
                        state.targetWaypoint++;
                    } else {
                        state.targetWaypoint--;
                    }
                }
            }
            
            // Calculate new facing direction
            const newTargetPos = path[state.targetWaypoint];
            const facingDir = new THREE.Vector3(
                newTargetPos.x - state.position.x,
                0,
                newTargetPos.z - state.position.z
            ).normalize();
            
            // Apply rotation to face the next waypoint
            if (facingDir.length() > 0.001) {
                const angle = Math.atan2(facingDir.x, facingDir.z);
                npc.rotation.y = angle;
            }
        } else {
            // Move towards the target waypoint
            directionVector.normalize().multiplyScalar(moveStep);
            state.position.add(directionVector);
            npc.position.copy(state.position);
            
            // Update rotation to face movement direction
            const facingDir = new THREE.Vector3(
                directionVector.x,
                0,
                directionVector.z
            ).normalize();
            
            if (facingDir.length() > 0.001) {
                const angle = Math.atan2(facingDir.x, facingDir.z);
                npc.rotation.y = angle;
            }
        }
        
        // Update animation mixer
        if (npc.userData.mixer) {
            npc.userData.mixer.update(deltaTime);
        }
    }
}






// Camera control
let isTopDownView = false; // Track if the camera is in top-down mode
const cameraBoundingSize = new THREE.Vector3(2, 2, 2);
const transitionSpeed = 0.05;

function updateCamera() {
    if (!playerCar) return;
    // Define the fixed offset in the car's local space (Behind and Above)
    const offset = new THREE.Vector3(0, 2, -4); // (x, height, distance behind)
    const translationMatrix = new THREE.Matrix4().makeTranslation(offset.x, offset.y, offset.z);
    const desiredCameraMatrix = playerCar.matrixWorld.clone().multiply(translationMatrix);
    const desiredCameraPosition = new THREE.Vector3().setFromMatrixPosition(desiredCameraMatrix);
    // Create a virtual bounding box around the desired camera position
    const cameraBox = new THREE.Box3().setFromCenterAndSize(desiredCameraPosition, cameraBoundingSize);
    // Check for collisions with buildings and walls
    let isObstructed = false;
    for (const obj of buildings.concat(walls)) {
        const objBox = new THREE.Box3().setFromObject(obj);
        if (cameraBox.intersectsBox(objBox)) {
            isObstructed = true;
            break; // Stop checking once we detect an obstruction
        }
    }
    if (isObstructed) {
        // Switch to top-down view if obstructed
        if (!isTopDownView) {
            isTopDownView = true;
        }
        // Align top-down view with the player's car direction
        const topDownOffset = new THREE.Vector3(0, 10, 0); // Move above the car
        const topDownPosition = playerCar.position.clone().add(topDownOffset);
        // Get the car's forward direction
        const carDirection = new THREE.Vector3();
        playerCar.getWorldDirection(carDirection);
        carDirection.setY(0); // Ignore vertical direction (we only care about horizontal rotation)
        // Adjust camera to look slightly ahead in the direction of the car
        const lookAtTarget = playerCar.position.clone().add(carDirection);
        // Smoothly move to top-down position
        camera.position.lerp(topDownPosition, transitionSpeed);
        camera.lookAt(lookAtTarget);
    } else {
        // If no obstruction, switch back to third-person view
        if (isTopDownView) {
            isTopDownView = false;
        }
        // Smooth transition back to third-person camera
        camera.position.lerp(desiredCameraPosition, transitionSpeed);
        camera.lookAt(playerCar.position);
    }
}


let keys = {};
document.addEventListener("keydown", (event) => keys[event.key.toLowerCase()] = true);
document.addEventListener("keyup", (event) => keys[event.key.toLowerCase()] = false);





function createBoundingBoxHelper(box, color) {
    const helper = new THREE.Box3Helper(box, color);
    scene.add(helper);
    return helper;
  }


// manually creating bounding boxes
const npcBoundingSize = new THREE.Vector3(1, 2, 1);  // Set an appropriate size for the NPC

// Function to create and track NPC bounding boxes
function createNpcBoundingBox(npc) {
    // Get the NPC's current position
    const npcPosition = npc.position.clone();
    
    // Create a bounding box using the NPC's position and the predefined size
    const npcBox = new THREE.Box3().setFromCenterAndSize(npcPosition, npcBoundingSize);
    

    return npcBox;  // Return the bounding box for collision detection
}


function checkCollision() {

    if (!gameReady) return false;


    for (const building of buildings.concat(walls)) {
        const carBox = new THREE.Box3().setFromObject(playerCar);
        const buildingBox = new THREE.Box3().setFromObject(building);
        const center = buildingBox.getCenter(new THREE.Vector3()); // Get the center
        const size = buildingBox.getSize(new THREE.Vector3()); // Get the original size

        if (building.position.y == -3.7) {
            const scaleFactor = new THREE.Vector3(0.83, 1, 0.72); // Example scale factors (x, y, z)

            // Scale the size components independently
            const newSize = size.multiply(scaleFactor);

            // Set new min and max, keeping the center the same
            buildingBox.set(
                center.clone().sub(newSize.clone().multiplyScalar(0.5)), // New min
                center.clone().add(newSize.clone().multiplyScalar(0.5))  // New max
            );
        }

        if (building.position.x == -60) {
            const scaleFactor = new THREE.Vector3(0.93, 1, 0.75); // Example scale factors (x, y, z)

            // Scale the size components independently
            const newSize = size.multiply(scaleFactor);

            // Set new min and max, keeping the center the same
            buildingBox.set(
                center.clone().sub(newSize.clone().multiplyScalar(0.5)), // New min
                center.clone().add(newSize.clone().multiplyScalar(0.5))  // New max
            );
        }

        if (building.position.x == 40) {
            const scaleFactor = new THREE.Vector3(0.85, 1, 0.85); // Example scale factors (x, y, z)

            // Scale the size components independently
            const newSize = size.multiply(scaleFactor);

            // Set new min and max, keeping the center the same
            buildingBox.set(
                center.clone().sub(newSize.clone().multiplyScalar(0.5)), // New min
                center.clone().add(newSize.clone().multiplyScalar(0.5))  // New max
            );
        }

        if (building.position.x == 85) {
            const scaleFactor = new THREE.Vector3(0.9, 1, 0.9); // Example scale factors (x, y, z)

            // Scale the size components independently
            const newSize = size.multiply(scaleFactor);

            // Set new min and max, keeping the center the same
            buildingBox.set(
                center.clone().sub(newSize.clone().multiplyScalar(0.5)), // New min
                center.clone().add(newSize.clone().multiplyScalar(0.5))  // New max
            );
        }

        if (building.position.x == -50) {
            const scaleFactor = new THREE.Vector3(0.72, 1, 0.5); // Example scale factors (x, y, z)

            // Visualize different bounding boxes
            //const originalHelper = createBoundingBoxHelper(buildingBox, 0xff0000); // Red

            // Scale the size components independently
            const newSize = size.multiply(scaleFactor);

            // Set new min and max, keeping the center the same
            buildingBox.set(
                center.clone().sub(newSize.clone().multiplyScalar(0.5)), // New min
                center.clone().add(newSize.clone().multiplyScalar(0.5))  // New max
            );
        }

        
        const carBox2 = new THREE.Box3().setFromObject(playerCar);
        if (tunnelData && tunnelData.bbox.intersectsBox(carBox2)) {
            console.log("hit the exit tunnel");
            didPlayerWin = true;
        } else {
            // console.log("not at the exit tunnel")
        }
        

        if (carBox.intersectsBox(buildingBox)) {
            return true;
        }
        
    }


    for (let light of trafficLights) {
        light.updateBoundingBox(); // Update bounding box before checking collision
        const carBox = new THREE.Box3().setFromObject(playerCar);
        if (carBox.intersectsBox(light.boundingBox)) {
            return true;
        }
    }

    const npcBoundingBoxes = npcs.concat(animatedNpcs).map(npc => createNpcBoundingBox(npc));
    for (const npcBox of npcBoundingBoxes) {
        const carBox = new THREE.Box3().setFromObject(playerCar);

        if (carBox.intersectsBox(npcBox)) {
            return true; 
        }
    }


    const carBox = new THREE.Box3().setFromObject(playerCar);
    const stopSignBox = new THREE.Box3().setFromObject(stopSign);
    const stopSign2Box = new THREE.Box3().setFromObject(stopSign2);
    if (carBox.intersectsBox(stopSignBox) || carBox.intersectsBox(stopSign2Box)) {
        return true;
    }

    if (checkAutoCarCollision()) {
        return true;
    }

    return false;
}

function checkExitCollision() {
    const carBox = new THREE.Box3().setFromObject(playerCar);
    if (tunnelData && tunnelData.bbox.intersectsBox(carBox)) {
        return true;
    } else {
        return false;
    }
}



let speed = 0;
let maxSpeed = 0.18;
let acceleration = 0.01;
let turnSpeed = 0.025;

function updatePlayerCar(deltaTime) {

    let nextX = playerCar.position.x;
    let nextZ = playerCar.position.z;
    

    // Adjust acceleration & deceleration based on deltaTime
    let adjustedAcceleration = acceleration * deltaTime * 60;
    let adjustedTurnSpeed = turnSpeed * deltaTime * 60; // Scale turning properly
    let adjustedDrag = Math.pow(0.98, deltaTime * 60); // Keep drag frame-rate independent
    
    // Apply acceleration and braking
    if (keys["w"] || keys["arrowup"]) {
        speed = Math.min(speed + adjustedAcceleration, maxSpeed);
    } else if (keys["s"] || keys["arrowdown"]) {
        speed = Math.max(speed - adjustedAcceleration, -maxSpeed / 2);
    } else {
        speed *= adjustedDrag; // Apply friction dynamically
    }
    
    // Apply turning based on speed direction
    if (speed !== 0) {
        if (keys["a"] || keys["arrowleft"]) {
            playerCar.rotation.y += adjustedTurnSpeed * (speed > 0 ? 1 : -1);
        }
        if (keys["d"] || keys["arrowright"]) {
            playerCar.rotation.y -= adjustedTurnSpeed * (speed > 0 ? 1 : -1);
        }
    }
    
    // Update movement (scaled by deltaTime)
    nextX += Math.sin(playerCar.rotation.y) * speed * deltaTime * 60;
    nextZ += Math.cos(playerCar.rotation.y) * speed * deltaTime * 60;
    
    if (!checkCollision()) {
        playerCar.position.x = nextX;
        playerCar.position.z = nextZ;
    } else {
        playerCar.position.set(startPosition.x, startPosition.y, startPosition.z);
        speed = 0;
    }

    const autoBox = new THREE.Box3().setFromObject(autoCar);
    const autoBox2 = new THREE.Box3().setFromObject(autoCar2);
    const autoBox3 = new THREE.Box3().setFromObject(autoCar3); 
    const autoBox4 = new THREE.Box3().setFromObject(autoCar4);
    const autoBox5 = new THREE.Box3().setFromObject(autoCar5);
    const autoBox6 = new THREE.Box3().setFromObject(autoCar6);

    if (autoBox.intersectsBox(autoBox2) || autoBox.intersectsBox(autoBox3) || autoBox.intersectsBox(autoBox4)
        || autoBox.intersectsBox(autoBox5) || autoBox.intersectsBox(autoBox6)) {
        autoCarState.position.x = -10;
        autoCarState.position.z = 20;
        autoCarState.targetWaypoint = 1;
    }

    if (autoBox2.intersectsBox(autoBox3) || autoBox2.intersectsBox(autoBox4) || autoBox2.intersectsBox(autoBox5)
        || autoBox2.intersectsBox(autoBox6)) {
        autoCar2State.position.x = -11;
        autoCar2State.position.z = -60;
        autoCar2State.targetWaypoint = 1;
    }

    if (autoBox3.intersectsBox(autoBox4) || autoBox3.intersectsBox(autoBox5) || autoBox3.intersectsBox(autoBox6)) {
        autoCar3State.position.x = 2;
        autoCar3State.position.z = 0;
        autoCar3State.targetWaypoint = 1;
    }

    if (autoBox4.intersectsBox(autoBox5) || autoBox4.intersectsBox(autoBox6)) {
        autoCar4State.position.x = 10;
        autoCar4State.position.z = 0;
        autoCar4State.targetWaypoint = 1;
    }

    if (autoBox5.intersectsBox(autoBox6)) {
        autoCar5State.position.x = -20;
        autoCar5State.position.z = -3;
        autoCar5State.targetWaypoint = 1;
    }


}

let lastTime = performance.now();
function animate() {
    // console.log("animate is running");
    if (!gameStarted) return;


    if(didPlayerWin){
        playerWins();
    }

    if(checkCollision()){
        console.log("❌ Collision detected");
        showCollisionScreen();
    }
    
    requestAnimationFrame(animate);

    let now = performance.now();
    let deltaTime = (now - lastTime) / 1000;
    lastTime = now;

    if (playerCar) {
      updatePlayerCar(deltaTime);
      updateCamera();
    }




    // Update all animation mixers
    mixers.forEach(mixer => mixer.update(deltaTime));

    // Update automated car
    updateAutoCar(deltaTime);
    updateAutoCar2(deltaTime);
    updateAutoCar3(deltaTime);
    updateAutoCar4(deltaTime);
    updateAutoCar5(deltaTime);
    updateAutoCar6(deltaTime);

    updatePedestrianMovement(deltaTime);  // Update pedestrian movement

    updateTrafficLights(deltaTime);
    renderer.render(scene, camera);

  }
  animate();
