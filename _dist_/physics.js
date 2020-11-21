import {Vector3} from "../web_modules/@babylonjs/core/Maths/math.js";
import {AmmoJSPlugin} from "../web_modules/@babylonjs/core/Physics/Plugins/ammoJSPlugin.js";
import {PhysicsImpostor} from "../web_modules/@babylonjs/core/Physics/physicsImpostor.js";
export const initPhysics = async (scene) => {
  const Ammo = await window.Ammo();
  const useDeltaForWorldStep = true;
  const gravityVector = new Vector3(0, -9.81, 0);
  const ammoPlugin = new AmmoJSPlugin(useDeltaForWorldStep, Ammo);
  scene.enablePhysics(gravityVector, ammoPlugin);
};
export const addPhysicsImposter = (mesh, imposterType, scene, mass = 1, restitution = 0.9) => {
  const imposter = PhysicsImpostor[imposterType];
  const opts = {mass, restitution};
  mesh.physicsImpostor = new PhysicsImpostor(mesh, imposter, opts, scene);
};
