---
title: 測試 web AR(尚未完成)
katex: true
date: 2024-07-21 22:08:55
categories: code
tags: 
- javascript 
- AR.js
- three.js
cover: cover.webp
---
{% asset_img  cover.webp 測試標記式 %}

目前還是停留在參考範例的代碼，不過發現有一些小重點可以注意，

像是新舊版本的 AR.js ，會受到 gltf 1.0 還是 gltf 2.0 的影響 。

### 標記式
```html
<!DOCTYPE html>
<html>
<head>
    <link rel="icon" href="data:;base64,iVBORw0KGgo=">
    <script src="https://aframe.io/releases/1.3.0/aframe.min.js"></script>
    <script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js"></script>
</head>
<body style="margin: 0px; overflow: hidden;">
    <a-scene embedded vr-mode-ui="enabled: false;" arjs="debugUIEnabled: false;">
        <!-- Define a directional light to simulate sunlight from above -->
        <a-light type="directional" color="#FFF" intensity="1" castShadow="true" position="0 3 0" rotation="0 90 0" shadow-mapWidth="512" shadow-mapHeight="512" shadow-camera-left="-20" shadow-camera-right="20" shadow-camera-bottom="-20" shadow-camera-top="20"></a-light>

        <!-- Define a marker and the object inside it -->
        <a-marker type="pattern" url="assets/pattern-marker.patt">
            <!-- Model -->
            <a-entity gltf-model="url(assets/model/03/03.gltf)"
                      position="0 0 0"
                      rotation="0 0 0"
                      scale="10 10 10"
                      shadow="cast: true; receive: true"></a-entity>

            <!-- Cylinder -->
            <a-cylinder position="0 1.1 0.5" rotation="0 90 90" radius="0.05" height="2" color="red" shadow="cast: true;"></a-cylinder>
        </a-marker>

        <!-- Define the camera -->
        <a-entity camera></a-entity>
    </a-scene>
</body>
</html>

```

### 圖片

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Image based tracking AR.js demo</title>
    <!-- import aframe and then ar.js with image tracking / location based features -->
    <script src="js/aframe.min.js"></script>
    <script src="js/aframe-ar-nft.js"></script>

    <!-- style for the loader -->
    <style>
      .arjs-loader {
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.8);
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .arjs-loader div {
        text-align: center;
        font-size: 1.25em;
        color: white;
      }
    </style>
  </head>

  <body style="margin: 0px; overflow: hidden;">
    <!-- minimal loader shown until image descriptors are loaded. Loading may take a while according to the device computational power -->
    <div class="arjs-loader">
      <div>Loading, please wait...</div>
    </div>

    <!-- a-frame scene -->
    <a-scene
    vr-mode-ui='enabled: false;'
    renderer="logarithmicDepthBuffer: true"
    embedded arjs='trackingMethod: best; sourceType: webcam; debugUIEnabled: false;'>
      <!-- a-nft is the anchor that defines an Image Tracking entity -->
      <!-- on 'url' use the path to the Image Descriptors created before. -->
      <!-- the path should end with the name without the extension e.g. if file is trex.fset' the path should end with trex -->
      <a-nft
        type="nft"
        url="https://michaelpig0912.github.io/sideProject/ar/assets/summer/test"
        smooth="true"
        smoothCount="10"
        smoothTolerance=".01"
        smoothThreshold="5">
          <!-- as a child of the a-nft entity, you can define the content to show. here's a GLTF model entity -->
          <a-entity
          gltf-model="assets/model/03/03.gltf"
              scale="5 5 5"
              position="15 30 00">
          </a-entity>
      </a-nft>
      <!-- static camera that moves according to the device movemenents -->
      <a-entity camera></a-entity>
    </a-scene>
  </body>
</html>
```

### MindAR 圖片 with three.js

```html
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script type="importmap">
    {
      "imports": {
        "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
        "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/",
        "mindar-image-three":"https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-three.prod.js"
      }
    }
    </script>
    <script type="module">
      import * as THREE from 'three';
      import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
      import { MindARThree } from 'mindar-image-three';

      const mindarThree = new MindARThree({
        container: document.querySelector("#container"),
        imageTargetSrc: "assets/targets.mind"
      });

      const {renderer, scene, camera} = mindarThree;

      // Enable shadow map in the renderer
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      const anchor = mindarThree.addAnchor(0);
      const geometry = new THREE.SphereGeometry(0.5, 32, 32);

      // Create a RectAreaLight and enable shadow
      const rectLight1 = new THREE.RectAreaLight(0xffffff, 10, 10, 10);
      rectLight1.position.set(5, 5, 5);
      rectLight1.lookAt(0, 0, 0);
      rectLight1.castShadow = true;
      scene.add(rectLight1);

      // Add helper for RectAreaLight
      const rectLightHelper1 = new RectAreaLightHelper(rectLight1);
      rectLight1.add(rectLightHelper1);

      // Create a second RectAreaLight on the right
      const rectLight2 = new THREE.RectAreaLight(0xffffff, 10, 10, 10);
      rectLight2.position.set(-5, 5, 5); // Positioned on the right side
      rectLight2.lookAt(0, 0, 0);
      rectLight2.castShadow = true;
      scene.add(rectLight2);

      // Add helper for the second RectAreaLight
      const rectLightHelper2 = new RectAreaLightHelper(rectLight2);
      rectLight2.add(rectLightHelper2);

      const material = new THREE.MeshStandardMaterial({ color: 0x0077ff });
      material.roughness = 0.4;

      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.y = 0.5;
      sphere.castShadow = true; // Enable shadow casting for the sphere
      sphere.receiveShadow = true; // Enable shadow receiving for the sphere

      const cube = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        material
      );
      cube.position.set(1, 0.5, 0);
      cube.castShadow = true; // Enable shadow casting for the cube
      cube.receiveShadow = true; // Enable shadow receiving for the cube

      anchor.group.add(sphere, cube);

      // Add a ground plane to receive shadows
      const groundGeometry = new THREE.PlaneGeometry(10, 10);
      const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.5 });
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -0.5;
      ground.receiveShadow = true;
      scene.add(ground);

      const start = async() => {
        await mindarThree.start();
        renderer.setAnimationLoop(() => {
          renderer.render(scene, camera);
        });
      }

      const startButton = document.querySelector("#startButton");
      startButton.addEventListener("click", () => {
        start();
      });

      const stopButton = document.querySelector("#stopButton");
      stopButton.addEventListener("click", () => {
        mindarThree.stop();
        mindarThree.renderer.setAnimationLoop(null);
      });
    </script>
    <style>
      body {
        margin: 0;
      }
      #container {
        width: 100vw;
        height: 100vh;
        position: relative;
        overflow: hidden;
      }
      #control {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 2;
      }
    </style>
  </head>
  <body>
    <div id="control">
      <button id="startButton">Start</button>
      <button id="stopButton">Stop</button>
    </div>
    <div id="container">
    </div>
  </body>
</html>

```

## 參考資料 

1. [Keeping the object on the screen even when the camera is not focusing the marker](https://github.com/jeromeetienne/AR.js/issues/313)
2. [MindAR - Documentation](https://hiukim.github.io/mind-ar-js-doc/examples/basic/)
3. [mind-ar-js](https://github.com/hiukim/mind-ar-js)
4. [AR.js examples](https://stemkoski.github.io/AR.js-examples/index.html)
5. [AR.js-examples github](https://github.com/stemkoski/AR.js-examples)
6. [AR.js - Augmented Reality on the Web](https://ar-js-org.github.io/AR.js-Docs/)
7. [10 tips to enhance your AR.js app.](https://medium.com/chialab-open-source/10-tips-to-enhance-your-ar-js-app-8b44c6faffca)