import { Engine } from '@babylonjs/core/Engines/engine'
import { Scene } from '@babylonjs/core/scene'
import { Vector3 } from '@babylonjs/core/Maths/math'
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera'
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { AmmoJSPlugin } from '@babylonjs/core/Physics/Plugins/ammoJSPlugin'
import { PhysicsImpostor } from '@babylonjs/core/Physics/physicsImpostor'
import { SceneLoader } from '@babylonjs/core/Loading'
import { GLTFLoader } from '@babylonjs/loaders/glTF/2.0/glTFLoader'

// Required side effects to populate the Create methods on the mesh class.
// Without this, the bundle would be smaller but the createXXX methods from mesh would not be accessible.
import '@babylonjs/core/Meshes/meshBuilder'
import '@babylonjs/core/Materials/standardMaterial'

const antialias = true
const adaptToDeviceRatio = true
const engineOptions = {
  
}

const canvas = document.getElementById('canvas') as HTMLCanvasElement
const engine = new Engine(canvas, antialias, engineOptions, adaptToDeviceRatio)
const scene = new Scene(engine)

// This creates and positions a free camera (non-mesh)
const camera = new FreeCamera('camera1', new Vector3(-4, 5, 10), scene)

// This targets the camera to scene origin
camera.setTarget(Vector3.Zero())

// This attaches the camera to the canvas
camera.attachControl(canvas, true)

// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
const light = new HemisphericLight('light1', new Vector3(0, 1, 0), scene)

// Default intensity is 1. Let's dim the light a small amount
light.intensity = 0.7

// Render every frame
engine.runRenderLoop(() => {
  scene.render()
})

const init = async () => {
  if (import.meta.env.MODE === 'development') {
    await Promise.all([
      import('@babylonjs/core/Debug/debugLayer'),
      import('@babylonjs/inspector')
    ])

    scene.debugLayer.show()
  }

  const Ammo = await window.InitAmmo()
  const useDeltaForWorldStep = true
  const gravityVector = new Vector3(0, -9.81, 0)
  const ammoPlugin = new AmmoJSPlugin(useDeltaForWorldStep, Ammo)
  scene.enablePhysics(gravityVector, ammoPlugin)

  const ground = Mesh.CreateGround("ground1", 3.8, 3.8, 2, scene)
  const sphere = Mesh.CreateSphere("sphere1", 32, 1, scene)

  ground.position.y = -0.01
  
  sphere.physicsImpostor = new PhysicsImpostor(sphere, PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9 }, scene)
  ground.physicsImpostor = new PhysicsImpostor(ground, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene)
  sphere.position.y = 5

  const gltf = await SceneLoader.AppendAsync('./assets/glb/', 'pixel_room.glb', scene)

  console.log(gltf)
  for (const texture of gltf.textures) {
    texture.updateSamplingMode(8)
  }
}

init()
