import * as THREE from 'three'
import { utils } from './utils'
import fragmentShader from './shaders/water.frag'
import vertexShader from './shaders/water.vert'

export class Water {
  constructor(context = {}) {
    this.context = context
    this.geometry = new THREE.PlaneGeometry(10, 10);
    this.material = new THREE.RawShaderMaterial({
      fragmentShader,
      vertexShader,
      uniforms: {
          uFreq: { value: 0 },
      },
      transparent: true,
  })
    this.group = new THREE.Mesh(this.geometry, this.material)
    this.rotation.x = -utils.toRadians(90)
    this.position.y = -0.5
  }

  get position() {
    return this.group.position
  }

  get rotation() {
    return this.group.rotation
  }
  
  get uniforms() {
    return this.material.uniforms
}
  update() {
    this.uniforms.uFreq.value = this.context.beatManager.latestBassAverage
}
}
