import {
  Box3,
  DirectionalLight,
  HemisphereLight,
  Matrix4,
  type Mesh,
  MeshPhysicalMaterial,
  type Object3D,
  OrthographicCamera,
  PMREMGenerator,
  Scene,
  SRGBColorSpace,
  type Texture,
  Vector3,
  WebGLRenderer,
} from "three"
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js"

const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder)

// One WebGL context for all artworks on a page: the models stand still, so
// each is drawn once into the shared renderer and copied onto its own 2D
// canvas. Browsers drop the oldest contexts beyond a handful per page, which
// a context per artwork would hit on long pages and phones.
let shared: { renderer: WebGLRenderer; environment: Texture } | undefined
const sharedRenderer = () => {
  if (shared) return shared
  const renderer = new WebGLRenderer({ antialias: true, alpha: true })
  renderer.outputColorSpace = SRGBColorSpace
  renderer.setClearColor(0x000000, 0)
  // Same light setup as the artwork lab's live preview.
  const pmrem = new PMREMGenerator(renderer)
  const room = new RoomEnvironment()
  const environment = pmrem.fromScene(room, 0.04).texture
  room.dispose()
  pmrem.dispose()
  shared = { renderer, environment }
  return shared
}

// Object extents in camera space, from each mesh's own bounding box so the
// frame stays tight around parts that sit at an angle.
const viewBounds = (object: Object3D, camera: OrthographicCamera) => {
  const bounds = new Box3()
  const corner = new Vector3()
  const toView = new Matrix4()
  object.updateMatrixWorld(true)
  object.traverse((node) => {
    const mesh = node as Mesh
    if (!mesh.isMesh) return
    mesh.geometry.computeBoundingBox()
    const box = mesh.geometry.boundingBox
    if (!box) return
    toView.multiplyMatrices(camera.matrixWorldInverse, mesh.matrixWorld)
    for (let i = 0; i < 8; i++) {
      corner
        .set(
          i & 1 ? box.max.x : box.min.x,
          i & 2 ? box.max.y : box.min.y,
          i & 4 ? box.max.z : box.min.z,
        )
        .applyMatrix4(toView)
      bounds.expandByPoint(corner)
    }
  })
  return bounds
}

export const createModelView = async (stage: HTMLElement) => {
  const file = stage.dataset.model
  if (!file) throw new Error("missing model")
  const [x, y, z] = (stage.dataset.camera ?? "0 -10 10").split(" ").map(Number)

  const gltf = await loader.loadAsync(file)

  const { renderer, environment } = sharedRenderer()
  const canvas = document.createElement("canvas")
  canvas.setAttribute("aria-hidden", "true")
  const context = canvas.getContext("2d")
  if (!context) throw new Error("no 2D canvas")

  const scene = new Scene()
  scene.environment = environment
  scene.environmentIntensity = 0.6
  scene.add(new HemisphereLight(0xffffff, 0x7a7a7a, 1))
  const light = new DirectionalLight(0xffffff, 2.4)
  light.position.set(-4, 7, 5)
  scene.add(light)

  // Clear glass refracts the dark Cycles world into a grey pane. On a
  // transparent canvas WebGL transmission has nothing behind it and turns
  // milky white, and its extra pass is expensive on phones; tinted
  // translucency keeps the render's look in both themes.
  const model = gltf.scene
  model.traverse((node) => {
    const mesh = node as Mesh
    if (!mesh.isMesh) return
    for (const material of [mesh.material].flat()) {
      if (!(material instanceof MeshPhysicalMaterial) || !material.transmission)
        continue
      material.transmission = 0
      material.transparent = true
      material.opacity = 0.22
      material.depthWrite = false
      material.color.multiplyScalar(0.3)
    }
  })

  // Centre the object so the camera looks at its middle.
  const centre = new Box3().setFromObject(model).getCenter(new Vector3())
  model.position.sub(centre)
  scene.add(model)

  // Blender is z-up, glTF y-up.
  const direction = new Vector3(x, z, -y).normalize()
  const radius = new Box3().setFromObject(model).getSize(new Vector3()).length()
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0.01, radius * 4)
  camera.position.copy(direction).multiplyScalar(radius * 2)
  camera.lookAt(0, 0, 0)
  camera.updateMatrixWorld()

  const bounds = viewBounds(model, camera)
  const viewCentre = bounds.getCenter(new Vector3())
  const viewSize = bounds.getSize(new Vector3())

  const draw = () => {
    const width = stage.clientWidth
    const height = stage.clientHeight
    if (!width || !height) return
    const scale = Math.min(devicePixelRatio, 2)
    renderer.setPixelRatio(scale)
    renderer.setSize(width, height, false)
    const aspect = width / height
    const w = Math.max(viewSize.x, viewSize.y * aspect)
    const h = w / aspect
    camera.left = viewCentre.x - w / 2
    camera.right = viewCentre.x + w / 2
    camera.top = viewCentre.y + h / 2
    camera.bottom = viewCentre.y - h / 2
    camera.updateProjectionMatrix()
    renderer.render(scene, camera)
    const source = renderer.domElement
    canvas.width = source.width
    canvas.height = source.height
    context.drawImage(source, 0, 0)
  }

  draw()
  stage.append(canvas)

  let width = stage.clientWidth
  new ResizeObserver(() => {
    if (stage.clientWidth === width) return
    width = stage.clientWidth
    draw()
  }).observe(stage)
}
