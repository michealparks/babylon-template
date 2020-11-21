import type { Mesh } from '@babylonjs/core/Meshes/mesh'
import type { Scene } from '@babylonjs/core/scene'

import { Vector3 } from '@babylonjs/core/Maths/math'
import { AmmoJSPlugin } from '@babylonjs/core/Physics/Plugins/ammoJSPlugin'
import { PhysicsImpostor } from  '@babylonjs/core/Physics/physicsImpostor'


export const initPhysics = async (scene: Scene) => {

  // @TODO: add typescript typings when available.
  // https://github.com/kripken/ammo.js/issues/233
  // @ts-ignore
  const Ammo: any = await window.Ammo()

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
