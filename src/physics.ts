import type { Mesh } from '@babylonjs/core/Meshes/mesh'
import type { Scene } from '@babylonjs/core/scene'

import { Vector3 } from '@babylonjs/core/Maths/math'
import { AmmoJSPlugin } from '@babylonjs/core/Physics/Plugins/ammoJSPlugin'
import { PhysicsImpostor } from  '@babylonjs/core/Physics/physicsImpostor'

// @TODO: this is a pretty sloppy connection to ammo, can be improved
export const initPhysics = async (scene: Scene) => {
  // @ts-ignore
  const Ammo: any = await globalThis.InitAmmo()
  const useDeltaForWorldStep = true
  const gravityVector = new Vector3(0, -9.81, 0)
  const ammoPlugin = new AmmoJSPlugin(useDeltaForWorldStep, Ammo)

  scene.enablePhysics(gravityVector, ammoPlugin)
}

export const addPhysicsImposter = (
  mesh: Mesh,
  imposterType: 'SphereImpostor' | 'BoxImpostor',
  scene: Scene,
  mass: number = 1,
  restitution: number = 0.9
) => {
  const imposter = PhysicsImpostor[imposterType]
  const opts = { mass, restitution }
  mesh.physicsImpostor = new PhysicsImpostor(mesh, imposter, opts, scene)
}
