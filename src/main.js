import * as THREE from 'three';

// Set up scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create multiple rotating cubes
const cubes = [];
const numCubes = 720;
for (let i = 0; i < numCubes; i++) {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff }); // Random color for each cube
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50); // Randomize cube positions
    cube.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2); // Randomize initial rotation
    cube.rotationSpeed = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(0.2); // Random rotation speed
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

camera.position.z = 10;

// Function to handle mouse movement
function onMouseMove(event) {
    // Calculate mouse position in normalized device coordinates (-1 to +1) for both components
    const mouseX = -(event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 -  1;

    // Set camera rotation based on mouse position
    camera.rotation.y = mouseX * Math.PI;
    camera.rotation.x = mouseY * Math.PI;
}

// Event listener for mouse movement
document.addEventListener('mousemove', onMouseMove, false);

// Function for animation
function animate() {
    requestAnimationFrame(animate);

    // Rotate each cube
    cubes.forEach(cube => {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
    });

    renderer.render(scene, camera);
}

// Start animation
animate();
