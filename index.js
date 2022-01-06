import { Wave } from './modules/Wave.js'

const container = document.querySelector('[data-container]')
const wave = new Wave({ container })

const playBackControls = document.querySelectorAll('[data-control]')

playBackControls.forEach(control => {
  const type = control.dataset.control
  control.addEventListener('click', () => wave[type]() )
})

const spread = document.querySelector('#spread')
spread.addEventListener('input', (event) => wave.setSpread(event.target.value))

