import { Engine } from '@babylonjs/core/Engines/engine'
import { Scene } from '@babylonjs/core/scene'
import { Vector2, Vector3 } from '@babylonjs/core/Maths/math'
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera'
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight'
import { SpotLight } from '@babylonjs/core/Lights/spotLight'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { AmmoJSPlugin } from '@babylonjs/core/Physics/Plugins/ammoJSPlugin'
import { PhysicsImpostor } from '@babylonjs/core/Physics/physicsImpostor'
import { SceneLoader } from '@babylonjs/core/Loading'
import { DefaultRenderingPipeline } from '@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/defaultRenderingPipeline'

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

const noPreventDefault = true
const camera = new FreeCamera('camera', new Vector3(-4, 5, 10), scene)
camera.setTarget(Vector3.Zero())
camera.attachControl(canvas, noPreventDefault)

{
  const name = 'hemisphericLight'
  const direction = new Vector3(0, 1, 0)
  const light = new HemisphericLight(name, direction, scene)
  light.intensity = 0.4
}

{
  const name = 'spotLight'
  const position = new Vector3(0, 3, 0)
  const direction = new Vector3(0, -1, 0)
  const angle = Math.PI / 3
  const exponent = 2
  const light = new SpotLight(name, position, direction, angle, exponent, scene)
  light.intensity = 40
}

// Render every frame

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

  {
    const width = 3.8
    const height = 3.8
    const subdivisions = 1
    const ground = Mesh.CreateGround('ground', width, height, subdivisions, scene)
    ground.physicsImpostor = new PhysicsImpostor(ground, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene)
    ground.position.y = -0.01
  }

  {
    const segments = 32
    const diameter = 1
    const sphere = Mesh.CreateSphere('sphere', segments, diameter, scene)
    sphere.physicsImpostor = new PhysicsImpostor(sphere, PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9 }, scene)
    sphere.position.y = 5
  }

  const gltf = await SceneLoader.AppendAsync('./assets/glb/', 'pixel_room.glb', scene)

  for (const texture of gltf.textures) {
    texture.updateSamplingMode(8)
  }

  {
    const hdr = true
    const pipeline = new DefaultRenderingPipeline('standardPipeline', hdr, scene, [camera])
    pipeline.samples = 4
  
    pipeline.bloomEnabled = true
    pipeline.bloomThreshold = 0.2
    pipeline.bloomWeight = 0.3
    pipeline.bloomKernel = 64
    pipeline.bloomScale = 0.5

    pipeline.depthOfFieldEnabled = true
    // distance of the current focus point from the camera in millimeters considering 1 scene unit is 1 meter
    pipeline.depthOfField.focusDistance = 2000
    // focal length of the camera in millimeters  
    pipeline.depthOfField.focalLength = 40
    // aka F number of the camera defined in stops as it would be on a physical device
    pipeline.depthOfField.fStop = 1.4
  }

  // const postProcess = new BABYLON.HighlightsPostProcess("highlights", 1.0, camera)

  engine.runRenderLoop(() => {
    scene.render()
  })
}

init()
