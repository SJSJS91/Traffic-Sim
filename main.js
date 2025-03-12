import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Setup Scene, Camera, and Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set Camera Position
camera.position.set(0, 10, 20);
// camera.position.set(0, 150, 0);
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

    //const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const roadTexture = new THREE.TextureLoader().load('assets/asphalt2.jpg');
    const roadMaterial = new THREE.MeshStandardMaterial({ map: roadTexture });

    const road = new THREE.Mesh(roadGeometry, roadMaterial);
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

function loadBuilding(modelPath, position, scaleMultiplier = { x: 1, y: 1, z: 1 }) {
    buildingLoader.load(
        modelPath,
        function (gltf) {
            const building = gltf.scene;
            building.scale.set(
                position.scale * scaleMultiplier.x,
                position.scale * scaleMultiplier.y,
                position.scale * scaleMultiplier.z
            );
            building.position.set(position.x, position.y, position.z);
            building.rotation.y = position.rotationY;
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

// Load all buildings with unified function
loadBuilding('models/simple_office_building_1.glb', { x: 40, y: 0, z: 79, rotationY: Math.PI / 2, scale: 3 });
loadBuilding('models/game_ready_city_buildings.glb', { x: 85, y: 0, z: -11, rotationY: 0, scale: 12 });
loadBuilding('models/realistic_chicago_buildings.glb', { x: -62, y: -3.7, z: 40, rotationY: 0, scale: 0.2 }, { x: 1.5, y: 1, z: 1 });
loadBuilding('models/realistic_chicago_buildings.glb', { x: -31, y: -3.7, z: 20, rotationY: Math.PI, scale: 0.2 }, { x: 1.5, y: 1, z: 1 });
loadBuilding('models/3_buildings_-_ww2_carentan_inspired.glb', { x: 33, y: 0, z: 30, rotationY: Math.PI / 2, scale: 0.01 });
loadBuilding('models/3_buildings_-_ww2_carentan_inspired.glb', { x: 10, y: 0, z: 28, rotationY: -Math.PI / 2, scale: 0.01 });
loadBuilding('models/3_buildings_-_ww2_carentan_inspired.glb', { x: 33, y: 0, z: -28, rotationY: Math.PI / 2, scale: 0.01 });
loadBuilding('models/3_buildings_-_ww2_carentan_inspired.glb', { x: 10, y: 0, z: -30, rotationY: -Math.PI / 2, scale: 0.01 });
loadBuilding('models/low-poly_building.glb', { x: -54, y: 0, z: -82, rotationY: Math.PI, scale: 100 }, { x: 2, y: 1, z: 1 });
loadBuilding('models/office_building.glb', { x: -60, y: 20, z: 75, rotationY: 0, scale: 0.22 });
/*

const buildings = [];
function createBuilding(x, z, width, height, depth) {

    const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
    const buildingTexture = new THREE.TextureLoader().load('assets/bldng3.JPG');
    const buildingMaterial = new THREE.MeshStandardMaterial({ map: buildingTexture });
    // const buildingMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
    building.position.set(x, height / 2, z);
    // scene.add(building);
    buildings.push(building);

}

const buildingLoader = new GLTFLoader();
function loadOfficeBuilding(position) {
    buildingLoader.load(
        'models/simple_office_building_1.glb',
        function (gltf) {
            const office = gltf.scene;
            office.scale.set(1.75, position.scale, 4.5);  // Apply scaling to all axes
            office.position.set(position.x, position.y, position.z);
            
            // Apply rotation based on the provided rotationY value
            office.rotation.y = position.rotationY;
            buildings.push(office);
            scene.add(office);
            console.log("Office model loaded at:", position);
        },
        undefined,
        function (error) {
            console.error("Error loading model:", error);
        }
    );
}
const pos = {x: 40, y: 0, z: 79, rotationY: Math.PI/2, scale: 3};
loadOfficeBuilding(pos);

function loadBrownBuilding(position) {
    buildingLoader.load(
        'models/game_ready_city_buildings.glb',
        function (gltf) {
            const office = gltf.scene;
            office.scale.set(position.scale, position.scale, position.scale); 
            office.position.set(position.x, position.y, position.z);
            office.rotation.y = position.rotationY;
            buildings.push(office);
            scene.add(office);
            console.log("Office model loaded at:", position);
        },
        undefined,
        function (error) {
            console.error("Error loading model:", error);
        }
    );
}
const brownBpos = {x: 85, y: 0, z: -11, rotationY: 0, scale: 12};
loadBrownBuilding(brownBpos);

function loadChicBuilding(position) {
    buildingLoader.load(
        'models/realistic_chicago_buildings.glb',
        function (gltf) {
            const office = gltf.scene;
            office.scale.set(1.5*position.scale, position.scale, position.scale); 
            office.position.set(position.x, position.y, position.z);
            office.rotation.y = position.rotationY;
            buildings.push(office);
            scene.add(office);
            console.log("Office model loaded at:", position);
        },
        undefined,
        function (error) {
            console.error("Error loading model:", error);
        }
    );
}
const chicagopos = {x: -62, y: -3.7, z: 40, rotationY: 0, scale: .2};
loadChicBuilding(chicagopos);
const chicagopos2 = {x: -31, y: -3.7, z: 20, rotationY: Math.PI, scale: .2};
loadChicBuilding(chicagopos2);

function load3Building(position) {
    buildingLoader.load(
        'models/3_buildings_-_ww2_carentan_inspired.glb',
        function (gltf) {
            const office = gltf.scene;
            office.scale.set(position.scale, position.scale, position.scale);  
            office.position.set(position.x, position.y, position.z);
            office.rotation.y = position.rotationY;
            buildings.push(office);
            scene.add(office);
            console.log("Office model loaded at:", position);
        },
        undefined,
        function (error) {
            console.error("Error loading model:", error);
        }
    );
}
const building3pos = {x: 33, y: 0, z: 30, rotationY: Math.PI/2, scale: .01};
load3Building(building3pos);
const building3pos2 = {x: 10, y: 0, z: 28, rotationY: -Math.PI/2, scale: .01};
load3Building(building3pos2);
const building3pos3 = {x: 33, y: 0, z: -28, rotationY: Math.PI/2, scale: .01};
load3Building(building3pos3);
const building3pos4 = {x: 10, y: 0, z: -30, rotationY: -Math.PI/2, scale: .01};
load3Building(building3pos4);

function loadWhiteB(position) {
    buildingLoader.load(
        'models/low-poly_building.glb',
        function (gltf) {
            const office = gltf.scene;
            office.scale.set(2*position.scale, position.scale, position.scale); 
            office.position.set(position.x, position.y, position.z);
            office.rotation.y = position.rotationY;
            buildings.push(office);
            scene.add(office);
            console.log("Office model loaded at:", position);
        },
        undefined,
        function (error) {
            console.error("Error loading model:", error);
        }
    );
}
const buildingWhitepos = {x: -54, y: 0, z: -82, rotationY: Math.PI, scale: 100};
loadWhiteB(buildingWhitepos);


function loadExpensiveOfficeBuilding(position) {
    buildingLoader.load(
        'models/office_building.glb',
        function (gltf) {
            const office = gltf.scene;
            office.scale.set(position.scale, position.scale, position.scale); 
            office.position.set(position.x, position.y, position.z);
            office.rotation.y = position.rotationY;
            buildings.push(office);
            scene.add(office);
            console.log("Office model loaded at:", position);
        },
        undefined,
        function (error) {
            console.error("Error loading model:", error);
        }
    );
}
const expPos = {x: -60, y: 20, z: 75, rotationY: 0, scale: .22};
loadExpensiveOfficeBuilding(expPos);
*/


// Create Boundary Walls
const walls = [];

function createWall(x, z, width, height, depth) {
    const wallGeometry = new THREE.BoxGeometry(width, height, depth); 
    const wallTexture = new THREE.TextureLoader().load('assets/wood.jpg');
    const wallMaterial = new THREE.MeshStandardMaterial({ map: wallTexture}); 
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

}
function createSideExitTunnel(x, z, width, height, depth) {
    const tunnelGeometry = new THREE.BoxGeometry(width, height, depth);
    const tunnelMaterial = new THREE.MeshStandardMaterial({ color: 'black' });
  
    const tunnel = new THREE.Mesh(tunnelGeometry, tunnelMaterial);
    tunnel.position.set(x, height / 2, z); // Position it at the right spot on the top wall
    tunnel.rotation.y = Math.PI / 2;
    scene.add(tunnel);

}

const tunnelWidth = 6; 
const tunnelHeight = 5;
const tunnelDepth = 1;
let index = Math.floor(Math.random() * 4);  // Math.random() * 4 gives a range from 0 to 4 (4 excluded), Math.floor() rounds it to an integer
let random_var = Math.random() * 180 - 90;

switch (index) {
    case 0:
        createExitTunnel(random_var, 100, tunnelWidth, tunnelHeight, tunnelDepth);
        break;
    case 1:
        createExitTunnel(random_var, -100, tunnelWidth, tunnelHeight, tunnelDepth);
        break;
    case 2:
        createSideExitTunnel(100, random_var, tunnelWidth, tunnelHeight, tunnelDepth);
        break;
    case 3:
        createSideExitTunnel(-100, random_var, tunnelWidth, tunnelHeight, tunnelDepth);
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
        const poleGeometry = new THREE.CylinderGeometry(0.2, 0.2, 4, 32);
        const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
        const pole = new THREE.Mesh(poleGeometry, poleMaterial);
        pole.position.set(0, 2, 0);
        this.group.add(pole);

        // Light Box
        const boxGeometry = new THREE.BoxGeometry(0.75, 2, 0.5);
        const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
        this.box = new THREE.Mesh(boxGeometry, boxMaterial);
        this.box.position.set(0, 3.5, 0.3);
        this.group.add(this.box);

        // Lights
        this.lights = {};
        const colors = ['red', 'yellow', 'green'];
        colors.forEach((color, index) => {
            const lightGeometry = new THREE.SphereGeometry(0.3, 16, 16);
            const lightMaterial = new THREE.MeshStandardMaterial({ emissive: color });
            const light = new THREE.Mesh(lightGeometry, lightMaterial);
            light.position.set(0, 4.2 - index * 0.6, 0.5);
            this.group.add(light);
            this.lights[color] = light;
        });
        
        this.group.position.set(x, 0, z);
        this.group.rotation.y = rotation;
        
        this.updateLights();

        this.boundingBox = new THREE.Box3().setFromObject(this.group);
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
        this.boundingBox.setFromObject(this.group);
    }
}

// Create Traffic Lights at Two 4-Way Intersections
const trafficLights = [];
trafficLights.push(new TrafficLight(-8.5, -3.5, Math.PI / 2, true)); // Intersection 1
trafficLights.push(new TrafficLight(-1.5, 3.5, -Math.PI / 2, true));
trafficLights.push(new TrafficLight(-8.5, 3.5, -Math.PI, true));
trafficLights.push(new TrafficLight(-1.5, -3.5, 0, true));
trafficLights.push(new TrafficLight(11.5, -3.5, Math.PI / 2, true)); // Intersection 2
trafficLights.push(new TrafficLight(18.5, 3.5, -Math.PI / 2, true));
trafficLights.push(new TrafficLight(18.5, -3.5, 0, true));
trafficLights.push(new TrafficLight(11.5, 3.5, Math.PI, true));

trafficLights.forEach(light => scene.add(light.group));

// Traffic Light Cycle
const clock = new THREE.Clock();
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
    } else if (cycleTime < 7) {
        trafficLights[0].setState('yellow');
        trafficLights[1].setState('yellow');
        trafficLights[4].setState('yellow');
        trafficLights[5].setState('yellow');
    } else if (cycleTime < 12) {
        trafficLights[0].setState('red');
        trafficLights[1].setState('red');
        trafficLights[2].setState('green');
        trafficLights[3].setState('green');
        trafficLights[4].setState('red');
        trafficLights[5].setState('red');
        trafficLights[6].setState('green');
        trafficLights[7].setState('green');
    } else {
        trafficLights[2].setState('yellow');
        trafficLights[3].setState('yellow');
        trafficLights[6].setState('yellow');
        trafficLights[7].setState('yellow');
    }
}

// Create Player Car
const startPosition = { x: 0, y: 0.2, z: 0 };

/*
let playerCar;
const loader = new GLTFLoader();

loader.load( 'models/player_car/scene.gltf', function ( gltfScene ) {
  playerCar = gltfScene.scene;
  playerCar.position.set(startPosition.x, startPosition.y, startPosition.z);
  playerCar.scale.set(1, 1, 1);
  playerCar.rotation.y = Math.PI;
  scene.add( playerCar );

}, undefined, function ( error ) {

	console.error( error );

} );
 */
let playerCar;
const cars = []; 
const loader = new GLTFLoader();

// Function to load a car model
function loadCar(modelPath, position, scale, rotationY = Math.PI, isPlayerCar = false) {
    loader.load(modelPath, function (gltfScene) {
        const car = gltfScene.scene;
        car.position.set(position.x, position.y, position.z);
        car.scale.set(scale, scale, scale);
        car.rotation.y = rotationY;
        scene.add(car);
        cars.push(car); 
        
        if (isPlayerCar && !playerCar) {
            playerCar = car;
        }
    }, undefined, function (error) {
        console.error(error);
    });
}


// Car models list
const carModels = [
    'models/player_car/scene.gltf',
    'models/car_model_1/scene.gltf',
    'models/car_model_2/scene.gltf',
    'models/car_model_3/scene.gltf',
    'models/car_model_4/scene.gltf',
    'models/car_model_5/scene.gltf'

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


const carConfigs = [
    { position: { x: 0, y: 0.2, z: 0 }, scale: 1 },  // Player car
    { position: { x: -5, y: 0.2, z: 0 }, scale: 1.75 },
    { position: { x: 10, y: 0.2, z: 0 }, scale: 1.25 },
    { position: { x: 0, y: 0.2, z: 5 }, scale: 1.25 },
    { position: { x: 0, y: 0.2, z: -15 }, scale: 0.9 },
    { position: { x: 15, y: 0.2, z: 0 }, scale: 1.25 }
];

carConfigs.forEach((config, index) => {
    const modelPath = carModels[index % carModels.length]; 
    const isPlayerCar = index === 0; // First car is the player car
    loadCar(modelPath, config.position, config.scale, Math.PI, isPlayerCar);
});

// `playerCar` is assigned asynchronously, so it may not be available immediately
setTimeout(() => {
    if (!playerCar && cars.length > 0) {
        playerCar = cars[0];
    }
}, 1000); // Delay check to wait for loading

const npcs = []; 
const npcLoader = new GLTFLoader();

// Function to load an NPC model
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

// Example usage for multiple NPCs with different positions and scales
const npcConfigs = [
    { position: { x: 5, y: 0.2, z: 5 }, scale: 1, rotationY: 0 },
    { position: { x: -10, y: 0.2, z: 10 }, scale: 0.4, rotationY: 0 },
    { position: { x: 8, y: 1.25, z: -8 }, scale: 0.6, rotationY: Math.PI },
    { position: { x: -12, y: 0.19, z: -6 }, scale: 0.01, rotationY: 0 },
    { position: { x: 15, y: 0.2, z: 3 }, scale: 1, rotationY: 0 },
    { position: { x: -7, y: 0.2, z: -15 }, scale: 1, rotationY: 0 }
];

// Load different NPC models at different positions
npcConfigs.forEach((config, index) => {
    const modelPath = npcModels[index % npcModels.length]; // Cycle through models
    loadNPC(modelPath, config.position, config.scale, config.rotationY);
});


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


function checkCollision() {

    for (const building of buildings.concat(walls)) {
        const carBox = new THREE.Box3().setFromObject(playerCar);
        const buildingBox = new THREE.Box3().setFromObject(building);
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
        
    return false;
}

let speed = 0;
let maxSpeed = 0.18;
let acceleration = 0.01;
let turnSpeed = 0.03;

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

    if (autoBox.intersectsBox(autoBox2)) {
        autoCarState.position.x = -20;
        autoCarState.position.z = 20;
        autoCarState.targetWaypoint = 1;
    }

    if (autoBox.intersectsBox(autoBox3)) {
        autoCarState.position.x = -20;
        autoCarState.position.z = 20;
        autoCarState.targetWaypoint = 1;
    }

    if (autoBox2.intersectsBox(autoBox3)) {
        autoCar2State.position.x = -20;
        autoCar2State.position.z = -60;
        autoCar2State.targetWaypoint = 1;
    }




}
function animate() {
    requestAnimationFrame(animate);
    
    let deltaTime = clock.getDelta();

    if (playerCar) {

      updatePlayerCar(deltaTime);

      updateCamera();
    }

    updateTrafficLights(deltaTime);
    renderer.render(scene, camera);
  }
  animate();
