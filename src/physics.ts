import * as BABYLON from '@babylonjs/core'
import HavokPhysics from '@babylonjs/havok'

export const initPhysics = async (scene: BABYLON.Scene) => {
  const url = import.meta.env.DEV ? 'node_modules/@babylonjs/havok/lib/esm/HavokPhysics.wasm' : 'HavokPhysics.wasm'
  const response = await fetch(url)
  const wasmBinary = await response.arrayBuffer()
  const havokInstance = await HavokPhysics({ wasmBinary })
  const havokPlugin = new BABYLON.HavokPlugin(true, havokInstance)
  scene.enablePhysics(new BABYLON.Vector3(0, -9.8, 0), havokPlugin)
}

export const addPhysicsImposter = (
  mesh: BABYLON.Mesh,
  shape: BABYLON.PhysicsShapeType.SPHERE | BABYLON.PhysicsShapeType.BOX,
  scene: BABYLON.Scene,
  mass: number = 1,
  restitution: number = 0.9
) => {
  mesh.metadata = {}
  mesh.metadata.aggregate = new BABYLON.PhysicsAggregate(mesh, shape, { mass, restitution }, scene)
}
