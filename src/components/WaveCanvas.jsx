import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// White 3D ribbon of rolling waves, like the Xceed preloader.
function WaveCanvas() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.1
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100)
    camera.position.set(0, 2.2, 14)
    camera.lookAt(0, 0, 0)

    scene.add(new THREE.HemisphereLight(0xffffff, 0xbfc2c9, 1.6))
    const key = new THREE.DirectionalLight(0xffffff, 1.6)
    key.position.set(-4, 8, 6)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0xffffff, 0.45)
    rim.position.set(2, -8, 4)
    scene.add(rim)

    const WIDTH = 22
    const DEPTH = 3.2
    const geometry = new THREE.PlaneGeometry(WIDTH, DEPTH, 320, 48)
    geometry.rotateX(-Math.PI / 2)
    const pos = geometry.attributes.position
    const base = Float32Array.from(pos.array)

    const material = new THREE.MeshStandardMaterial({
      color: 0xf4f4f6,
      roughness: 0.55,
      metalness: 0.0,
      side: THREE.DoubleSide,
      flatShading: false,
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.rotation.x = 0.18
    scene.add(mesh)

    const height = (x, z, t) => {
      const nx = x / (WIDTH / 2)
      const nz = z / (DEPTH / 2)
      // Fade the waves out toward the left/right edges
      const envelope = Math.pow(Math.cos((nx * Math.PI) / 2), 1.4)
      const w =
        Math.sin(x * 0.8 + t * 0.9 + nz * 1.6) * 0.85 +
        Math.sin(x * 1.6 - t * 1.2 + nz * 2.4) * 0.6 +
        Math.sin(x * 0.45 + t * 0.5 - nz * 3.1) * 0.7 +
        Math.sin(x * 2.7 + t * 1.6 - nz * 1.8) * 0.35 +
        Math.cos(x * 4.1 - t * 1.1 + nz * 2.2) * 0.15
      // Crests rise on one edge and dip on the other, giving the sheet its twist
      return envelope * w * (0.5 + 0.6 * nz)
    }

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = mount
      renderer.setSize(w, h)
      camera.aspect = w / h
      // Keep the ribbon spanning the viewport on narrow screens
      camera.position.z = w / h < 1.2 ? 22 : 14
      camera.updateProjectionMatrix()
    }
    resize()
    window.addEventListener('resize', resize)

    let frame
    const clock = new THREE.Clock()
    const animate = () => {
      const t = clock.getElapsedTime()
      for (let i = 0; i < pos.count; i++) {
        const x = base[i * 3]
        const z = base[i * 3 + 2]
        pos.array[i * 3 + 1] = height(x, z, t)
      }
      pos.needsUpdate = true
      geometry.computeVertexNormals()
      renderer.render(scene, camera)
      frame = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div className="wave-canvas" ref={mountRef} />
}

export default WaveCanvas
