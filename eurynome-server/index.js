console.log('=========INITIAL START=========')
const EurynomeServer = require('./src')
const Eurynome = new EurynomeServer()

console.log('[^] Initializing Eurynome server...')
Eurynome.start()

if (process.argv.includes('--looping')) {
  let looping = false

  const debugStop = () => {
    console.log('======STOPPING======')
    Eurynome.stop()
    if (!looping) setInterval(() => debugStop(), 40 * 1000)
  }

  const debugStart = () => {
    console.log('======STARTING======')
    Eurynome.start()
    if (!looping) setInterval(() => debugStart(), 40 * 1000)
  }

  setTimeout(() => { debugStop(); setTimeout(() => { debugStart(); looping = true }, 20000) }, 20000)
}
