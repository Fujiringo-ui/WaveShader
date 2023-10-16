import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "lil-gui";
import vertexShader from "./shaders/vertexShader";
import fragmentShader from "./shaders/fragmentShader";
import skyImage from "./textures/sky.jpg";

const gui = new dat.GUI({ width: 200 });

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Canvas
const canvas = document.querySelector(".webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const skyTexture = textureLoader.load(skyImage);
scene.background = skyTexture;

// Geometry
const geometry = new THREE.PlaneGeometry(10, 10, 512, 512);

//color
const colorObject = {};
colorObject.depthColor = "#2d81ae";
colorObject.surfaceColor = "#66c1f9";

// Material
const material = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  uniforms: {
    uWaveLength: { value: 0.4 },
    uFrequency: { value: new THREE.Vector2(6.6, 3.0) },
    uTime: { value: 0 },
    uWaveSpeed: { value: 0.75 },
    uDepthColor: { value: new THREE.Color(colorObject.depthColor) },
    uSurfaceColor: { value: new THREE.Color(colorObject.surfaceColor) },
    uColorOffset: { value: 0.03 },
    uColorMutiplier: { value: 8.0 },
    uSmallWaveElevation: { value: 0.15 },
    uSmallWaveFrequency: { value: 3.0 },
    uSmallWaveSpeed: { value: 0.2 },
  },
});

//デバック
gui
  .add(material.uniforms.uWaveLength, "value")
  .min(0)
  .max(1)
  .step(0.001)
  .name("uWaveLength");

gui
  .add(material.uniforms.uFrequency.value, "x")
  .min(0)
  .max(10)
  .step(0.001)
  .name("uFrequency.x");

gui
  .add(material.uniforms.uFrequency.value, "y")
  .min(0)
  .max(10)
  .step(0.001)
  .name("uFrequency.y");

gui
  .add(material.uniforms.uWaveSpeed, "value")
  .min(0)
  .max(4)
  .step(0.001)
  .name("uWaveSpeed");

gui
  .add(material.uniforms.uColorOffset, "value")
  .min(0)
  .max(1)
  .step(0.001)
  .name("uColorOffset");

gui
  .add(material.uniforms.uColorMutiplier, "value")
  .min(0)
  .max(10)
  .step(0.001)
  .name("uColorMutiplier");

gui
  .add(material.uniforms.uSmallWaveElevation, "value")
  .min(0)
  .max(1)
  .step(0.001)
  .name("uSmallWaveElevation");

gui
  .add(material.uniforms.uSmallWaveFrequency, "value")
  .min(0)
  .max(10)
  .step(0.001)
  .name("uSmallWaveFrequency");

gui
  .add(material.uniforms.uSmallWaveSpeed, "value")
  .min(0)
  .max(10)
  .step(0.001)
  .name("uSmallWaveSpeed");

gui.addColor(colorObject, "depthColor").onChange(() => {
  material.uniforms.uDepthColor.value.set(colorObject.depthColor);
});

gui.addColor(colorObject, "surfaceColor").onChange(() => {
  material.uniforms.uSurfaceColor.value.set(colorObject.surfaceColor);
});

gui.show(false);

// Mesh
const mesh = new THREE.Mesh(geometry, material);
mesh.rotation.x = -Math.PI / 2;
scene.add(mesh);

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
// camera.fov = 90;
// camera.position.set(0, 0.3, 0);

camera.position.set(0, 0.5, 0);

scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const animate = () => {
  //時間取得
  const elapsedTime = clock.getElapsedTime();

  //値が時間とともに変更される
  material.uniforms.uTime.value = elapsedTime;

  //カメラを円周上に回転させる
  // camera.position.x = Math.sin(elapsedTime * 0.2) * 3.0;
  // camera.position.z = Math.cos(elapsedTime * 0.2) * 3.0;

  camera.lookAt(0, 0, 0);

  // camera.lookAt(
  //   Math.cos(elapsedTime),
  //   Math.sin(elapsedTime) * 0.5,
  //   Math.cos(elapsedTime) * 0.5
  // );

  // controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(animate);
};

//scroll-animation////////////////////////////////////////////////////////////////////////////////

//線形補間でアニメーションを滑らかに = lerp(最初の地点、最終地点、ベストコマ数)
function lerp(x, y, a) {
  return (1 - a) * x + a * y;
}

function scalePercent(start, end) {
  return (scrollPercent - start) / (end - start);
}

const animationScripts = [];

// スクロールアニメーション01（z軸の移動）
animationScripts.push({
  start: 0,
  end: 20,
  function() {
    //線形補間
    // model.scene.position.z = lerp(-7, -1.5, scalePercent(0, 20));
    //時間取得
    const elapsedTime = clock.getElapsedTime();
    //値が時間とともに変更される
    material.uniforms.uTime.value = elapsedTime;

    camera.lookAt(
      Math.cos(elapsedTime),
      Math.sin(elapsedTime) * 0.5,
      Math.cos(elapsedTime) * 0.5
    );

    //カメラを円周上に回転させる
    // camera.position.x = Math.sin(elapsedTime * 0.2) * 3.0;
    // camera.position.z = Math.cos(elapsedTime * 0.2) * 3.0;

    camera.position.x = lerp(0, 0, scalePercent(0, 20));
    camera.position.z = lerp(0, 0, scalePercent(0, 20));
  },
});

// スクロールアニメーション02（z軸の移動）
animationScripts.push({
  start: 20,
  end: 40,
  function() {
    //線形補間
    // model.scene.position.z = lerp(-7, -1.5, scalePercent(0, 20));
    //時間取得
    const elapsedTime = clock.getElapsedTime();
    //値が時間とともに変更される
    material.uniforms.uTime.value = elapsedTime;

    camera.lookAt(
      Math.cos(elapsedTime),
      Math.sin(elapsedTime) * 0.5,
      Math.cos(elapsedTime) * 0.5
    );

    //カメラを円周上に回転させる
    // camera.position.x = Math.sin(elapsedTime * 0.2) * 3.0;
    // camera.position.z = Math.cos(elapsedTime * 0.2) * 3.0;

    camera.position.x = lerp(
      0,
      Math.sin(elapsedTime * 0.1) * 3.0,
      scalePercent(20, 40)
    );
    camera.position.z = lerp(
      0,
      Math.cos(elapsedTime * 0.1) * 3.0,
      scalePercent(20, 40)
    );
  },
});

// スクロールアニメーション03（z軸の移動）
animationScripts.push({
  start: 40,
  end: 60,
  function() {
    //線形補間
    // model.scene.position.z = lerp(-7, -1.5, scalePercent(0, 20));
    //時間取得
    const elapsedTime = clock.getElapsedTime();
    //値が時間とともに変更される
    material.uniforms.uTime.value = elapsedTime;

    camera.lookAt(
      Math.cos(elapsedTime),
      Math.sin(elapsedTime) * 0.5,
      Math.cos(elapsedTime) * 0.5
    );

    //カメラを円周上に回転させる
    // camera.position.x = Math.sin(elapsedTime * 0.2) * 3.0;
    // camera.position.z = Math.cos(elapsedTime * 0.2) * 3.0;

    camera.position.x = lerp(
      Math.sin(elapsedTime * 0.1) * 3.0,
      Math.sin(elapsedTime * 0.1) * 3.0,
      scalePercent(40, 60)
    );
    camera.position.z = lerp(
      Math.cos(elapsedTime * 0.1) * 3.0,
      Math.cos(elapsedTime * 0.1) * 3.0,
      scalePercent(40, 60)
    );
  },
});

// スクロールアニメーション04（z軸の移動）
animationScripts.push({
  start: 60,
  end: 80,
  function() {
    //線形補間
    // model.scene.position.z = lerp(-7, -1.5, scalePercent(0, 20));
    //時間取得
    const elapsedTime = clock.getElapsedTime();
    //値が時間とともに変更される
    material.uniforms.uTime.value = elapsedTime;

    camera.lookAt(
      Math.cos(elapsedTime),
      Math.sin(elapsedTime) * 0.5,
      Math.cos(elapsedTime) * 0.5
    );

    //カメラを円周上に回転させる
    // camera.position.x = Math.sin(elapsedTime * 0.2) * 3.0;
    // camera.position.z = Math.cos(elapsedTime * 0.2) * 3.0;

    camera.position.x = lerp(
      Math.sin(elapsedTime * 0.1) * 3.0,
      Math.sin(elapsedTime * 0.1) * 3.0,
      scalePercent(60, 80)
    );
    camera.position.z = lerp(
      Math.cos(elapsedTime * 0.1) * 3.0,
      Math.cos(elapsedTime * 0.1) * 3.0,
      scalePercent(60, 80)
    );
  },
});

//アニメーションを開始する
function playScrollAnimation() {
  animationScripts.forEach((animation) => {
    if (scrollPercent >= animation.start && scrollPercent <= animation.end)
      animation.function();
  });
}

//ブラウザのスクロール率を取得する（コピペ対象）
let scrollPercent = 0;

document.body.onscroll = () => {
  scrollPercent =
    (document.documentElement.scrollTop /
      (document.documentElement.scrollHeight -
        document.documentElement.clientHeight)) *
    100;
  console.log(document.documentElement.clientHeight);
};

//アニメーション
//tick：毎フレームごとに実行されるループアニメーション
const tick = () => {
  window.requestAnimationFrame(tick);
  playScrollAnimation();
  renderer.render(scene, camera);
};
tick();

animate();
