import * as THREE from 'three';

// Set up scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create multiple random geometric shapes
const shapes = [];
const numShapes = 360;
for (let i = 0; i < numShapes; i++) {
    let shape;
    const randomGeometry = Math.floor(Math.random() * 3); // Random number to determine geometry type

    switch (randomGeometry) {
        case 0:
            shape = new THREE.SphereGeometry(Math.random() * 3, 16, 16); // Random radius for spheres
            break;
        case 1:
            shape = new THREE.ConeGeometry(Math.random() * 3, Math.random() * 5, 16); // Random radius and height for cones
            break;
        case 2:
            shape = new THREE.CylinderGeometry(Math.random() * 2, Math.random() * 2, Math.random() * 5, 16); // Random radii and height for cylinders
            break;
    }

    const material = new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff }); // Random color for each shape
    const mesh = new THREE.Mesh(shape, material);
    mesh.position.set(Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50); // Randomize positions
    
    // Increase the speed, but not excessively fast
    const speedMultiplier = 1.5; // You can adjust this value to change the speed
    mesh.velocity = new THREE.Vector3((Math.random() - 0.5) * 0.3 * speedMultiplier, (Math.random() - 0.5) * 0.1 * speedMultiplier, (Math.random() - 0.5) * 0.1 * speedMultiplier); // Random velocity
    
    scene.add(mesh);
    shapes.push(mesh);
}

// Add ambient light to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
scene.add(ambientLight);

// Add directional light to the scene
const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight1.position.set(1, 1, 1); // Set light position
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight2.position.set(-1, -1, -1); // Set another light position for better lighting
scene.add(directionalLight2);

camera.position.z = 50;
// Set up camera controls
const cameraControls = {
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
};

document.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            cameraControls.moveForward = true;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            cameraControls.moveLeft = true;
            break;
        case 'ArrowDown':
        case 'KeyS':
            cameraControls.moveBackward = true;
            break;
        case 'ArrowRight':
        case 'KeyD':
            cameraControls.moveRight = true;
            break;
    }
});

document.addEventListener('keyup', (event) => {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            cameraControls.moveForward = false;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            cameraControls.moveLeft = false;
            break;
        case 'ArrowDown':
        case 'KeyS':
            cameraControls.moveBackward = false;
            break;
        case 'ArrowRight':
        case 'KeyD':
            cameraControls.moveRight = false;
            break;
    }
});

// Function to handle camera movement
function moveCamera() {
    const moveSpeed = 0.5;

    const frontVector = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    const rightVector = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);

    if (cameraControls.moveForward) {
        camera.position.add(frontVector.multiplyScalar(moveSpeed));
    }
    if (cameraControls.moveBackward) {
        camera.position.add(frontVector.multiplyScalar(-moveSpeed));
    }
    if (cameraControls.moveLeft) {
        camera.position.add(rightVector.multiplyScalar(-moveSpeed));
    }
    if (cameraControls.moveRight) {
        camera.position.add(rightVector.multiplyScalar(moveSpeed));
    }
}

// Function for animation
function animate() {
    requestAnimationFrame(animate);

    // Move and rotate each shape
    shapes.forEach(shape => {
        shape.rotation.x += 0.01;
        shape.rotation.y += 0.01;

        shape.position.add(shape.velocity);

        // Wrap shape around when it goes out of view
        if (shape.position.x > 50) shape.position.x = -50;
        if (shape.position.x < -50) shape.position.x = 50;
        if (shape.position.y > 50) shape.position.y = -50;
        if (shape.position.y < -50) shape.position.y = 50;
        if (shape.position.z > 50) shape.position.z = -50;
        if (shape.position.z < -50) shape.position.z = 50;
    });

    moveCamera(); // Move the camera based on user input
    renderer.render(scene, camera);
}

// Set up camera rotation controls
const cameraRotation = {
    mouseX: 0,
    mouseY: 0,
    prevMouseX: 0,
    prevMouseY: 0,
    mouseDown: false,
};

document.addEventListener('mousemove', (event) => {
    if (cameraRotation.mouseDown) {
        const movementX = event.clientX - cameraRotation.prevMouseX;
        const movementY = event.clientY - cameraRotation.prevMouseY;

        cameraRotation.mouseX -= movementX * 0.002;
        cameraRotation.mouseY -= movementY * 0.002;

        camera.rotation.x = cameraRotation.mouseY;
        camera.rotation.y = cameraRotation.mouseX;
    }

    cameraRotation.prevMouseX = event.clientX;
    cameraRotation.prevMouseY = event.clientY;
});

document.addEventListener('mousedown', () => {
    cameraRotation.mouseDown = true;
});

document.addEventListener('mouseup', () => {
    cameraRotation.mouseDown = false;
});

// Function to create and shoot a laser
function shootLaser() {
    const laserGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 8);
    const laserMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const laser = new THREE.Mesh(laserGeometry, laserMaterial);

    // Position the laser at the camera position
    laser.position.copy(camera.position);
    laser.rotation.copy(camera.rotation);

    // Move the laser forward along the camera's local z-axis
    const laserDirection = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    laser.velocity = laserDirection.clone().multiplyScalar(5);

    // Adjust laser orientation to shoot horizontally like a bullet
    laser.rotation.x = Math.PI / 2;

    scene.add(laser);

    // Remove the laser after 3 seconds
    setTimeout(() => {
        scene.remove(laser);
    }, 10000);

    shapes.push(laser);
}

// Event listener for mouse clicks to shoot lasers
document.addEventListener('click', shootLaser);

// Start animation
animate();
