import type { Mesh } from '@babylonjs/core/Meshes/mesh'
import type { Scene } from '@babylonjs/core/scene'

import { Vector3 } from '@babylonjs/core/Maths/math'
import { AmmoJSPlugin } from '@babylonjs/core/Physics/Plugins/ammoJSPlugin'
import { PhysicsImpostor } from  '@babylonjs/core/Physics/physicsImpostor'

// @TODO: this is a pretty sloppy connection to ammo, can be improved
export const initPhysics = async () => {
  // @ts-ignore
  const Ammo: any = await globalThis.InitAmmo()
  const useDeltaForWorldStep = true
  const gravityVector = new Vector3(0, -9.81, 0)
  const ammoPlugin = new AmmoJSPlugin(useDeltaForWorldStep, Ammo)

  // @ts-ignore
  scene.enablePhysics(gravityVector, ammoPlugin)
}

export const addPhysicsImposter = (
  mesh: Mesh,
  imposterType: 'SphereImpostor' | 'BoxImpostor',
  scene: Scene
) => {
  // @ts-ignore
  mesh.physicsImpostor = new PhysicsImpostor(mesh, PhysicsImpostor[imposterType], { mass: 1, restitution: 0.9 }, scene)
}
