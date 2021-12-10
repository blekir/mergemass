import React, { useRef, useState, useEffect, Suspense,useMemo, useLayoutEffect} from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {OrbitControls, Html, } from '@react-three/drei'


import * as THREE from 'three'

import "./App.css"
import Info from './components/Info'


export default function App() {
  const [totalMassx, setTotalMass] = useState(0)
  const [mass1, setMass1] = useState('')
  
  const totalMass = async() =>{
    console.log("total mass")
    
    
    const response = await fetch('https://ancientdust.fra1.cdn.digitaloceanspaces.com/mass.json', {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Access-Control-Allow-Origin': 'https://ancientdust.fra1.cdn.digitaloceanspaces.com/',
        'mode':'no-cors'
      }
    });
    const myJson = await response.json(); //extract JSON from the http response
    // console.log(myJson['result']);

    setMass1(myJson)
    setTotalMass(myJson.length)
  }

  useEffect(() => {
    totalMass();
  }, []);
  const niceColors = [[ "#fff", "#fff", "#fff", "#fff", "#fff" ]]
  const size = totalMassx
  const tempObject = new THREE.Object3D()
  const tempColor = new THREE.Color()
  const colors = new Array(size).fill().map(() => niceColors[0][Math.floor(Math.random() * 5)])

  function Instances(props) {
    const colorArray = useMemo(() => Float32Array.from(new Array(size).fill().flatMap((_, i) => tempColor.set(colors[i]).toArray())), [])
    const meshRef = useRef()
    const prevRef = useRef()
    const [hovered, set] = useState()
    let jsonMass = mass1
    useEffect(() => void (prevRef.current = hovered), [hovered])

    useLayoutEffect(() => {
      let i = 0;
      
      for (let x = 0; x < size; x++){
        let rndx = (Math.ceil(Math.random() * 99) * (Math.round(Math.random()) ? 1 : -1)) *5
        let rndy = (Math.ceil(Math.random() * 99) * (Math.round(Math.random()) ? 1 : -1)) *5
        let rndz = (Math.ceil(Math.random() * 99) * (Math.round(Math.random()) ? 1 : -1)) *5
        const id = i++
        let scale = Math.round(parseInt(jsonMass[x]["mass"]) / 10)
        let distanceFromAlpha = Math.round(scale / 2.3)
        tempObject.position.set(rndx*distanceFromAlpha, rndy*distanceFromAlpha, rndz*distanceFromAlpha)
        tempObject.scale.set(scale,scale,scale)
        if(jsonMass[x]["id"] == "1"){
          let scale = Math.round(parseInt(jsonMass[x]["mass"])/400 )
          tempObject.position.set(0, 0, 0)
          tempObject.scale.set(scale,scale,scale)
          
          tempObject.updateMatrix()
          
          const color2 = new THREE.Color("rgb(0, 0, 0)");
          meshRef.current.setMatrixAt(id, tempObject.matrix)
          meshRef.current.setColorAt(id, color2)
          if (hovered !== prevRef.Current) {
            tempColor.set(id === hovered ? 'black' : 'white')
            meshRef.current.geometry.attributes.color.needsUpdate = true
          }
          
        }
        else if(jsonMass[x]["tier"] === 2){

          tempObject.updateMatrix()
          const color = new THREE.Color("rgb(250, 250, 25)");
          meshRef.current.setColorAt(id, color)
          meshRef.current.setMatrixAt(id, tempObject.matrix)
          if (hovered !== prevRef.Current) {
            tempColor.set(id === hovered ? 'white' : 'black').toArray(colorArray, id * 3)
            meshRef.current.geometry.attributes.color.needsUpdate = true
          }
        }
        else if(jsonMass[x]["tier"] === 3){
          tempObject.updateMatrix()
          const color = new THREE.Color("rgb(51, 51, 255)");
          meshRef.current.setColorAt(id, color)
          meshRef.current.setMatrixAt(id, tempObject.matrix)
          if (hovered !== prevRef.Current) {
            tempColor.set(id === hovered ? 'white' : 'black').toArray(colorArray, id * 3)
            meshRef.current.geometry.attributes.color.needsUpdate = true
          }
        }
        else if(jsonMass[x]["tier"] === 4){
          tempObject.updateMatrix()
          const color = new THREE.Color("rgb(255, 51, 51)");
          meshRef.current.setColorAt(id, color)
          meshRef.current.setMatrixAt(id, tempObject.matrix)
          if (hovered !== prevRef.Current) {
            tempColor.set(id === hovered ? 'white' : 'black').toArray(colorArray, id * 3)
            meshRef.current.geometry.attributes.color.needsUpdate = true
          }
        }
        else{
          tempObject.updateMatrix()
          const color = new THREE.Color("rgb(255, 255, 255)");
          meshRef.current.setColorAt(id, color)
          
          meshRef.current.setMatrixAt(id, tempObject.matrix)
          if (hovered !== prevRef.Current) {
            tempColor.set(id === hovered ? 'white' : 'black').toArray(colorArray, id * 3)
            meshRef.current.geometry.attributes.color.needsUpdate = true
          }
        }
        
        
      }
      meshRef.current.instanceMatrix.needsUpdate = true
      
      
      
    }, [])
    const [data, setData] = useState("");
    
    return (
      <>
      
      <instancedMesh ref={meshRef} args={[null, null, size]} 
        onPointerEnter={(e) => {
          set(e.instanceId); 
          setData(jsonMass[e.instanceId])
          setPx(e.distance)
          setPy(e.offsetY)
        
        }}
        onPointerLeave={(e) => {
          set(null); 
          setData(null)
        }}>
        
        <sphereBufferGeometry attach="geometry" args={[1, 32, 32]}>
          <Html distanceFactor={100} >
          {hovered?(<div className="content">
              id: {data["id"]}<br/>
              mass: {data["mass"]}<br/>
              alpha: {data["alpha"]}<br/>
              tier: {data["tier"]}<br/>
              class: {data["class"]}<br/>
              merges: {data["merges"]}<br/>
            </div>):null}
          </Html>
        </sphereBufferGeometry>
        <meshLambertMaterial attach="material" />
        
      </instancedMesh>
      </>
    )
  }
 
  return (
    <>
    <Suspense fallback={<span className="Load">loading...</span>}>
      <Canvas style={{ background: "#fff" }} camera={{ fov: 75, near: 0.1, far: 1000000, position: [0, 0, 500] }}>
        
        <ambientLight intensity={0.2} />
        <directionalLight color="white" position={[1100, 0, 1500]} />
        
        <Instances />
        
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        
      </Canvas>
    </Suspense>

    </>
  )
}
