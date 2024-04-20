import * as THREE from 'three'
import { TestGraph } from './TestGraph'
import { SketchManager } from './SketchManager'
import { audioMeta, BeatManager } from './audio'
import { LightsManager } from './LightsManager'
import { Block } from './Block'
import { Crosswalk } from './Crosswalk'
import { Clouds } from './Clouds'
import { Sand } from './Sand'
import { Water } from './Water'
import { Pillars } from './Pillars'

/**
 * https://www.pinterest.ca/pin/516295544785518297/
 * https://www.pinterest.ca/pin/4785143349468989/
 * https://www.pinterest.ca/pin/516295544785518292/
 * https://www.pinterest.ca/pin/516295544785518682/
 * https://www.pinterest.ca/pin/516295544783655443/
 * https://www.pinterest.ca/pin/516295544785519697/
 * https://www.pinterest.ca/pin/516295544796753880/
 * https://www.pinterest.ca/pin/516295544785519753/
 * https://www.pinterest.ca/pin/516295544785518572/
 * https://www.pinterest.ca/pin/758645499715261341/
 * https://www.pinterest.ca/pin/370210031885499117/
 * https://www.pinterest.ca/pin/77757531049275835/
 * https://www.pinterest.ca/pin/671810469442917934/
 * 
 */

export class Sketch extends SketchManager {
  constructor(canvas, audioElement) {
    super(canvas, audioElement)
    this.clock = new THREE.Clock()
    this.audioSrc = audioMeta.url;
    this.fftSize = 256;
    this.numFrequencyNodes = this.fftSize / 2;
    this.spectrumStart = {
      bass: 0,
      midrange: 7,
      highrange: 30,
    }
    this.testGraph = new TestGraph({
      numNodes: this.numFrequencyNodes,
      midrange: this.spectrumStart.midrange,
      highrange: this.spectrumStart.highrange,
    })
    this.beatManager = new BeatManager(this);
    this.lights = new LightsManager()
    this.block = new Block()
    this.crosswalk = new Crosswalk(this)
    this.clouds = new Clouds(this)
    this.sand = new Sand(this)
    this.water = new Water(this)
    this.pillars = new Pillars(this)
  }

  init() {
    this.setClearColor(0x25b5f5)
    this.setCameraPos(0, 5, 10)
    // this.controls.target.set(0, 0, -40)
    this.initAudio({
      fftSize: this.fftSize,
      dataLength: this.numFrequencyNodes,
    });
    this.audio.setSmoothingTimeConstant(0.85);
    this.audio.volume(1)

    this.crosswalk.center()

    // this.scene.add(this.testGraph.group)
    this.scene.add(this.lights.group)
    // this.scene.add(this.block.group)
    this.scene.add(this.crosswalk.group)
    // this.scene.add(this.clouds.group)
    // this.scene.add(this.sand.group)
    // this.scene.add(this.water.group)
    // this.scene.add(this.pillars.group)


  }

  draw() {
    this.renderer.render(this.scene, this.camera)
    this.controls.update()

    this.audio.getByteFrequencyData();
    this.beatManager.update()
    this.crosswalk.update()
    this.clouds.update()
    this.water.update()
    this.pillars.update()

    this.testGraph.update(this.audio.frequencyData, this.beatManager.bassAverages, this.beatManager.midrangeAverages, this.beatManager.highrangeAverages, this.beatManager.midrangeAverages, this.beatManager.highrangeAverages)
    requestAnimationFrame(() => this.draw())
  }
}
