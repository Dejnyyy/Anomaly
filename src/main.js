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
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1); // Set light position
scene.add(directionalLight);

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

    if (cameraControls.moveForward) {
        camera.position.z -= moveSpeed;
    }
    if (cameraControls.moveBackward) {
        camera.position.z += moveSpeed;
    }
    if (cameraControls.moveLeft) {
        camera.position.x -= moveSpeed;
    }
    if (cameraControls.moveRight) {
        camera.position.x += moveSpeed;
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

// Start animation
animate();
