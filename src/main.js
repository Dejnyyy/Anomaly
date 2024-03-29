import * as THREE from 'three';

// Set up scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create multiple moving and rotating cubes
const cubes = [];
const numCubes = 720;
for (let i = 0; i < numCubes; i++) {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff }); // Random color for each cube
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50); // Randomize cube positions
    cube.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2); // Randomize initial rotation
    cube.rotationSpeed = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(0.2); // Random rotation speed
    cube.moveSpeed = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(0.1); // Random movement speed
    scene.add(cube);
    cubes.push(cube);
}

// Add ambient light to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
scene.add(ambientLight);

// Add directional light to the scene
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1); // Set light position
scene.add(directionalLight);

camera.position.z = 50;

// Function to handle mouse movement
function onMouseMove(event) {
    // Calculate mouse position in normalized device coordinates (-1 to +1) for both components
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    // Smooth camera rotation based on mouse position
    const targetRotationY = mouseX * Math.PI * 0.5;
    const targetRotationX = mouseY * Math.PI * 0.5;
    camera.rotation.y += (targetRotationY - camera.rotation.y) * 0.05;
    camera.rotation.x += (targetRotationX - camera.rotation.x) * 0.05;
}

// Event listener for mouse movement
document.addEventListener('mousemove', onMouseMove, false);

// Function for animation
function animate() {
    requestAnimationFrame(animate);

    // Move and rotate each cube
    cubes.forEach(cube => {
        cube.rotation.x += cube.rotationSpeed.x;
        cube.rotation.y += cube.rotationSpeed.y;
        cube.rotation.z += cube.rotationSpeed.z;

        cube.position.x += cube.moveSpeed.x;
        cube.position.y += cube.moveSpeed.y;
        cube.position.z += cube.moveSpeed.z;

        // Wrap cube around when it goes out of view
        if (cube.position.x > 50) cube.position.x = -50;
        if (cube.position.x < -50) cube.position.x = 50;
        if (cube.position.y > 50) cube.position.y = -50;
        if (cube.position.y < -50) cube.position.y = 50;
        if (cube.position.z > 50) cube.position.z = -50;
        if (cube.position.z < -50) cube.position.z = 50;
    });

    renderer.render(scene, camera);
}

// Start animation
animate();
