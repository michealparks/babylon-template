import {Engine} from "../web_modules/@babylonjs/core/Engines/engine.js";
import {Scene} from "../web_modules/@babylonjs/core/scene.js";
import {Vector3} from "../web_modules/@babylonjs/core/Maths/math.js";
import {FreeCamera} from "../web_modules/@babylonjs/core/Cameras/freeCamera.js";
import {HemisphericLight} from "../web_modules/@babylonjs/core/Lights/hemisphericLight.js";
import {SpotLight} from "../web_modules/@babylonjs/core/Lights/spotLight.js";
import {Mesh} from "../web_modules/@babylonjs/core/Meshes/mesh.js";
import {SceneLoader} from "../web_modules/@babylonjs/core/Loading.js";
import "../web_modules/@babylonjs/core/Meshes/meshBuilder.js";
import "../web_modules/@babylonjs/core/Materials/Textures/Loaders/envTextureLoader.js";
import "../web_modules/@babylonjs/core/Loading/loadingScreen.js";
import "../web_modules/@babylonjs/core/Materials/standardMaterial.js";
import "../web_modules/@babylonjs/core/Physics/physicsEngineComponent.js";
import "../web_modules/@babylonjs/loaders/glTF.js";
import {initPhysics, addPhysicsImposter} from "./physics.js";
import {addPostProcess as addPostProcess2} from "./addPostProcess.js";
const antialias = true;
const adaptToDeviceRatio = true;
const engineOptions = {};
const canvas = document.getElementById("canvas");
const engine2 = new Engine(canvas, antialias, engineOptions, adaptToDeviceRatio);
const scene2 = new Scene(engine2);
const noPreventDefault = true;
const camera = new FreeCamera("camera", new Vector3(-4, 5, 10), scene2);
camera.setTarget(Vector3.Zero());
camera.attachControl(canvas, noPreventDefault);
{
  const name = "hemisphericLight";
  const direction = new Vector3(0, 1, 0);
  const light = new HemisphericLight(name, direction, scene2);
  light.intensity = 0.4;
}
{
  const name = "spotLight";
  const position = new Vector3(0, 3, 0);
  const direction = new Vector3(0, -1, 0);
  const angle = Math.PI / 3;
  const exponent = 2;
  const light = new SpotLight(name, position, direction, angle, exponent, scene2);
  light.intensity = 40;
}
const init = async () => {
  const promises = [];
  promises.push(SceneLoader.AppendAsync("./assets/glb/", "pixel_room.glb", scene2));
  promises.push(initPhysics(scene2));
  if ('production' === "development") {
    promises.push(import("../web_modules/@babylonjs/core/Debug/debugLayer.js"));
    promises.push(import("../web_modules/@babylonjs/inspector.js"));
    let inspectorOpen = true;
    addEventListener("keydown", (e) => {
      if (e.key.toLowerCase() === "i") {
        if (inspectorOpen === true) {
          scene2.debugLayer.hide();
        } else {
          scene2.debugLayer.show();
        }
      }
    });
  }
  const [gltf] = await Promise.all(promises);
  scene2.debugLayer.show();
  const NEAREST_NEAREST = 8;
  for (const texture of gltf.textures) {
    texture.updateSamplingMode(NEAREST_NEAREST);
  }
  {
    const width = 3.8;
    const height = 3.8;
    const subdivisions = 1;
    const ground = Mesh.CreateGround("ground", width, height, subdivisions, scene2);
    ground.position.y = -0.01;
    addPhysicsImposter(ground, "BoxImpostor", scene2, 0);
  }
  {
    const segments = 32;
    const diameter = 1;
    const sphere = Mesh.CreateSphere("sphere", segments, diameter, scene2);
    sphere.position.y = 5;
    addPhysicsImposter(sphere, "SphereImpostor", scene2);
  }
  addPostProcess2(scene2, [camera]);
  engine2.runRenderLoop(() => {
    scene2.render();
  });
};
init();
