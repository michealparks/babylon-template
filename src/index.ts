import './index.css'
// import { WebGPUEngine } from '@babylonjs/core/Engines/webgpuEngine'
import { Engine } from '@babylonjs/core/Engines/engine'
import { Scene } from '@babylonjs/core/scene'
import { Vector3 } from '@babylonjs/core/Maths/math'
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera'
import { SceneLoader } from '@babylonjs/core/Loading'
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder'

import "@babylonjs/core/Materials/Textures/Loaders/envTextureLoader"
import "@babylonjs/core/Loading/loadingScreen"
import '@babylonjs/core/Materials/standardMaterial'
import '@babylonjs/core/Physics/physicsEngineComponent'
import "@babylonjs/core/Meshes/Builders/groundBuilder"
import '@babylonjs/loaders/glTF'

import { initPhysics, addPhysicsImposter } from './physics'
import { addPostProcess } from './addPostProcess'

const antialias = true
const adaptToDeviceRatio = true
const engineOptions = {}

const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!
// const engine = new WebGPUEngine(canvas);
// await engine.initAsync();

const engine = new Engine(canvas, antialias, engineOptions, adaptToDeviceRatio)
const scene = new Scene(engine)
const camera = new FreeCamera('camera', new Vector3(-4, 5, 10), scene)
camera.setTarget(Vector3.Zero())
camera.attachControl(canvas, true)

const promises: [Promise<Scene>?, Promise<void>?, Promise<unknown>?] = [
  SceneLoader.AppendAsync('./assets/glb/', 'pixel_room.glb', scene),
  initPhysics(scene)
]

if (import.meta.env.MODE === 'development') {
  promises.push(import('@babylonjs/core/Debug/debugLayer'))
  promises.push(import('@babylonjs/inspector'))

  let inspectorOpen = true

  addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'i') {
      if (inspectorOpen === true) {
        scene.debugLayer.hide()
      } else {
        scene.debugLayer.show()
      }
    }
  })
}

const [gltf] = await Promise.all(promises)

scene.debugLayer.show()

const NEAREST_NEAREST = 8
for (const texture of gltf!.textures) {
  texture.updateSamplingMode(NEAREST_NEAREST)
}

{
  const width = 3.8
  const height = 3.8
  const subdivisions = 1
  const ground = MeshBuilder.CreateGround('ground', { width, height, subdivisions }, scene)
  ground.position.y = -0.01
  addPhysicsImposter(ground, 'BoxImpostor', scene, 0)
}

{
  const segments = 32
  const diameter = 1
  const sphere = MeshBuilder.CreateSphere('sphere', { segments, diameter }, scene)
  sphere.position.y = 5
  addPhysicsImposter(sphere, 'SphereImpostor', scene)
}

addPostProcess(scene, [camera])

engine.runRenderLoop(() => {
  scene.render()
})
