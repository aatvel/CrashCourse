import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { DoubleSide, Light, Plane } from 'three'
import gsap from 'gsap'

// Debug
const gui = new dat.GUI()
const world = {
    plane: {
        width: 200,
        height: 200,
        widthSegments: 50,
        heightSegments: 50
    }
}

gui.add(world.plane, 'width', 1, 300).onChange(generatePlane)
gui.add(world.plane, 'height', 1, 300).onChange(generatePlane)
gui.add(world.plane, 'widthSegments', 1, 100).onChange(generatePlane)
gui.add(world.plane, 'heightSegments', 1, 100).onChange(generatePlane)

function generatePlane(){
    plane.geometry.dispose()
    plane.geometry = new THREE.PlaneGeometry( world.plane.width, world.plane.height, world.plane.widthSegments, world.plane.heightSegments)

    //Randomize position
    const {array} = plane.geometry.attributes.position
    const randomValues = []
    for (let i = 0; i < array.length ; i++){

        if(i % 3 === 0){
        const x = array[i]
        const y = array[i + 1]
        const z = array[i + 2]
        
        array[i] = x + (Math.random() - 0.5) *2
        array[i + 1] = y + (Math.random() - 0.5) * 2
        array[i + 2] = z + (Math.random() - 0.5) * 3
        }

        randomValues.push(Math.random() - 0.5) * Math.PI * 2
    }

    plane.geometry.attributes.position.originalPosition = plane.geometry.attributes.position.array
    plane.geometry.attributes.position.randomValues = randomValues

    const colors = []
    for (let i =0; i < plane.geometry.attributes.position.count; i++){
        colors.push(0, 0.26, 0.6)
    }

    plane.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))
    
}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.PlaneGeometry( world.plane.width, world.plane.height, world.plane.widthSegments, world.plane.heightSegments)


// Materials

const material = new THREE.MeshPhongMaterial({side: DoubleSide, flatShading: THREE.FlatShading, vertexColors: true})
// material.color = new THREE.Color(0x00ffff)

// Mesh
const plane = new THREE.Mesh(geometry,material)
scene.add(plane)
generatePlane()



//Color attribute addition
const colors = []
    for (let i =0; i < plane.geometry.attributes.position.count; i++){
        colors.push(0, 0.26, 0.6)
    }

    plane.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))

//RayCaster
const raycaster = new THREE.Raycaster()


// Lights

const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.position.x = 40
pointLight.position.y = 20
pointLight.position.z = 40
scene.add(pointLight)

const backLight = new THREE.PointLight(0xffffff, 1)
backLight.position.x = -40
backLight.position.y = - 20
backLight.position.z = - 10
scene.add(backLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 50
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.maxDistance = 120
controls.minDistance = 5
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

renderer.setPixelRatio(devicePixelRatio)

const mouse = {
    x: undefined,
    y: undefined
}

/**
 * Animate
 */

const clock = new THREE.Clock()

let frame = 0

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()
    frame += 0.01

    // Update objects
    // sphere.rotation.y = .5 * elapsedTime

    // Update Orbital Controls
    // controls.update()

    raycaster.setFromCamera(mouse, camera)
    const {array, originalPosition, randomValues} = plane.geometry.attributes.position
    for(let i = 0; i < array.length; i+= 3){

        array[i] = originalPosition[i] + Math.cos(frame + randomValues[i]) * 0.025
        array[i + 1] = originalPosition[i + 1] + Math.cos(frame + randomValues[i + 1]) * 0.01
        // array[i + 2] = originalPosition[i + 2] + Math.sin(frame + randomValues[i + 2]) * 0.008
    
    }
    plane.geometry.attributes.position.needsUpdate = true

    const intersects = raycaster.intersectObject(plane)
    if (intersects.length > 0) {
        // console.log(intersects[0].face)
    const {color} = intersects[0].object.geometry.attributes

        intersects[0].object.geometry.attributes.color.setX(intersects[0].face.a, 0.1)  // SetX = R ; Set Y = G; SetZ = B;  Setx(что изменяем, интенсивность)//
        intersects[0].object.geometry.attributes.color.setY(intersects[0].face.a, 0.5)
        intersects[0].object.geometry.attributes.color.setZ(intersects[0].face.a, 1)

        
        intersects[0].object.geometry.attributes.color.setX(intersects[0].face.b, 0.1)
        intersects[0].object.geometry.attributes.color.setY(intersects[0].face.b, 0.5)
        intersects[0].object.geometry.attributes.color.setZ(intersects[0].face.b, 1)
       

        
        intersects[0].object.geometry.attributes.color.setX(intersects[0].face.c, 0.1)
        intersects[0].object.geometry.attributes.color.setY(intersects[0].face.c, 0.5)
        intersects[0].object.geometry.attributes.color.setZ(intersects[0].face.c, 1)

        intersects[0].object.geometry.attributes.color.needsUpdate = true

        const initialColor = {
            r: 0,
            g: 0.25,
            b: 0.5
        }

        const hoverColor = {
            r: 0.12,
            g: 0.4,
            b: 0.98
        }

        gsap.to(hoverColor, {
            r: initialColor.r ,
            g: initialColor.g ,
            b: initialColor.b,
            duration: 2,
            onUpdate: () => {

                intersects[0].object.geometry.attributes.color.setX(intersects[0].face.a, hoverColor.r) 
                intersects[0].object.geometry.attributes.color.setY(intersects[0].face.a, hoverColor.g)
                intersects[0].object.geometry.attributes.color.setZ(intersects[0].face.a, hoverColor.b)
                
                intersects[0].object.geometry.attributes.color.setX(intersects[0].face.b, hoverColor.r)
                intersects[0].object.geometry.attributes.color.setY(intersects[0].face.b, hoverColor.g)
                intersects[0].object.geometry.attributes.color.setZ(intersects[0].face.b, hoverColor.b)
            
                intersects[0].object.geometry.attributes.color.setX(intersects[0].face.c, hoverColor.r)
                intersects[0].object.geometry.attributes.color.setY(intersects[0].face.c, hoverColor.g)
                intersects[0].object.geometry.attributes.color.setZ(intersects[0].face.c, hoverColor.b)
                color.needsUpdate = true    }
        })

    }

    //light
    pointLight.position.x= Math.cos(elapsedTime) * 30
    pointLight.position.y = Math.cos(elapsedTime) * 30

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()



addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / innerWidth ) * 2 - 1
    mouse.y = -(event.clientY / innerHeight) * 2 + 1
})