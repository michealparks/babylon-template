import './index.css'
import * as BABYLON from '@babylonjs/core'
import '@babylonjs/loaders/glTF'
import { initPhysics, addPhysicsImposter } from './physics'
import { addPostProcess } from './addPostProcess'

BABYLON.DefaultLoadingScreen.prototype.displayLoadingUI = () => {}

const canvas = document.createElement('canvas')
document.body.append(canvas)

const antialias = true
const adaptToDeviceRatio = true

let engine: BABYLON.Engine | BABYLON.WebGPUEngine

if (navigator.gpu) {
  engine = new BABYLON.WebGPUEngine(canvas, { antialias, adaptToDeviceRatio })
  await (engine as BABYLON.WebGPUEngine).initAsync()
} else {
  engine = new BABYLON.Engine(canvas, antialias, {}, adaptToDeviceRatio)
}

const scene = new BABYLON.Scene(engine)

const alpha = 0
const beta = 0
const radius = 5
const target = new BABYLON.Vector3(-4, 1, 5)
const camera = new BABYLON.ArcRotateCamera('camera', alpha, beta, radius, target, scene)

camera.setTarget(BABYLON.Vector3.Zero())
camera.attachControl(canvas, true)

await Promise.all([
  BABYLON.SceneLoader.AppendAsync('assets/glb/', 'pixel_room.glb', scene),
  initPhysics(scene)
])

let inspectorReady = false
let inspectorOpen = true

if (import.meta.env.MODE === 'development') {
  window.addEventListener('keydown', async ({ key }) => {
    if (key.toLowerCase() !== 'i') return
  
    if (inspectorReady === false) {
      await import('@babylonjs/core/Debug/debugLayer')
      await import('@babylonjs/inspector')
      inspectorReady = true
    }

    if (inspectorOpen === true) {
      localStorage.setItem('inspector', 'true')
      scene.debugLayer.hide()
    } else {
      localStorage.removeItem('inspector')
      scene.debugLayer.show()
    }
  })

  if (localStorage.getItem('inspector')) {
    scene.debugLayer.show()
  }  
}

for (const texture of scene.textures) {
  texture.updateSamplingMode(1)
}

{
  const width = 3.8
  const height = 3.8
  const subdivisions = 1
  const ground = BABYLON.MeshBuilder.CreateGround('ground', { width, height, subdivisions }, scene)
  ground.position.y = -0.01
  addPhysicsImposter(ground, BABYLON.PhysicsShapeType.BOX, scene, 0)
}

{
  const segments = 32
  const diameter = 1
  const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', { segments, diameter }, scene)
  sphere.position.y = 5
  addPhysicsImposter(sphere, BABYLON.PhysicsShapeType.SPHERE, scene)
}

addPostProcess(scene, [camera])

engine.runRenderLoop(() => scene.render())
