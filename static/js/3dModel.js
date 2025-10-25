import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const container = document.getElementById('canvas-container');
if (!container) {
    console.error("Container '#canvas-container' tidak ditemukan!");
    throw new Error("Container '#canvas-container' tidak ditemukan!");
}
const modelUrl = container.dataset.modelUrl;
console.log("Mencoba memuat model dari:", modelUrl);
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee); // background color

const camera = new THREE.PerspectiveCamera(
    70, // Field of View (FOV)
    container.clientWidth / container.clientHeight, 
    0.1, // Jarak dekat 
    1000 // Jarak jauh 
);


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement); 

// Kontrol
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; 
controls.autoRotate = true; 
controls.autoRotateSpeed = 1.0;

// Cahaya
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// Loader file model
const loader = new GLTFLoader();

loader.load(
    modelUrl, 
    function (gltf) {
        console.log("Model sukses dimuat!", gltf);
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        
        model.position.sub(center); 
        
        camera.position.x = 5; 
        camera.position.y = 5; 
        camera.position.z = 5; 

        // koordinat kamera mengarah ke (0,0,0)
        controls.target.set(0, 0, 0);
        controls.update();

        scene.add(model); 
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.error('Gagal memuat model!', error);
    }
);

// Animate
function animate() {
    requestAnimationFrame(animate);
    controls.update(); 
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
});

// render 
animate();