import * as THREE from 'three'

export class TestGraph {
  constructor({
    numNodes,
    midrange,
    highrange,
  }) {
    this.numNodes = numNodes
    this.midrange = midrange
    this.highrange = highrange

    this.bars = []
    
    this.group = new THREE.Group() 
    this.createBars()
  }

  get position() {
    return this.group.position
  }
  
  createBars() {
    const width = 0.1
    const X_OFFSET = -5;
    for (let i = 0; i < this.numNodes; i++) {
      let color = null
      if (i < this.midrange) {
        color = 0xff0000;
      } else if (i < this.highrange) {
        color = 0x00ff00;
      } else {
        color = 0x0000ff
      }
      const g = new THREE.BoxGeometry(width, 0.02, width)
      const m = new THREE.MeshBasicMaterial({ color })
      const mesh = new THREE.Mesh(g, m);
      mesh.position.set(width * i + X_OFFSET, 0, 1);
      this.group.add(mesh);
      this.bars.push(mesh)
    }
  }
  update(frequencyData, bassAverages, midrangeAverages, highrangeAverages) {
    const scale = 1.8
    frequencyData.forEach((freq, i) => {
      const averages
        = i < this.midrange ?
          bassAverages :
          i < this.highrange ?
            midrangeAverages :
            highrangeAverages
      const average = averages[averages.length - 1]
      
      const diff = freq - average
      this.bars[i].scale.y = (Math.abs(freq - average) + 0.01) * scale
      // this.bars[i].scale.y = (diff <= 0 ? 0.01 : diff) * scale
      // this.bars[i].scale.y = (diff > 0 ? 0.01 : diff) * scale
      // this.bars[i].scale.y = freq + 0.01
    })
  }
}
