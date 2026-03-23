// bg-particles.js — wii-style drifting symbol background
// canvas particle system, symbols drift down-left like wii channel menu

const SYMBOLS = ['♪', '♫', '♬', '♩', '★', '✦', '◆', '●', '▲', '✿', '♥', '✸']
const COLORS = ['#F03397', '#ff6ec7', '#ffb3e0', '#d4afc9', '#c9c9c9', '#E0DDD8']
const COUNT = 150

class Particle {
	constructor(canvas, initial = false) {
		this.c = canvas
		this.init(initial)
	}

	init(initial = false) {
		const { width, height } = this.c

		this.symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
		this.color = COLORS[Math.floor(Math.random() * COLORS.length)]
		this.size = 10 + Math.random() * 30
		this.opacity = 0.06 + Math.random() * 0.16
		this.speed = 0.35 + Math.random() * 0.65

		// drift angle: down-left (~125–145 deg in canvas coords where y+ = down)
		const angle = (125 + Math.random() * 20) * (Math.PI / 180)
		this.vx = Math.cos(angle) * this.speed // negative = left
		this.vy = Math.sin(angle) * this.speed // positive = down

		this.rot = Math.random() * Math.PI * 2
		this.rotSpeed = (Math.random() - 0.5) * 0.015

		if (initial) {
			// scatter across the whole canvas on first load so it doesn't look empty
			this.x = Math.random() * width
			this.y = Math.random() * height
		} else {
			// respawn from right edge or top edge
			if (Math.random() < 0.6) {
				this.x = width + this.size
				this.y = Math.random() * height
			} else {
				this.x = Math.random() * width + width * 0.2 // bias toward right side
				this.y = -this.size
			}
		}
	}

	update() {
		this.x += this.vx
		this.y += this.vy
		this.rot += this.rotSpeed

		// gone off left or bottom edge — respawn
		if (this.x < -this.size * 3 || this.y > this.c.height + this.size * 3) {
			this.init(false)
		}
	}

	draw(ctx) {
		ctx.save()
		ctx.translate(this.x, this.y)
		ctx.rotate(this.rot)
		ctx.globalAlpha = this.opacity
		ctx.fillStyle = this.color
		ctx.font = `${this.size}px 'Nunito', sans-serif`
		ctx.textAlign = 'center'
		ctx.textBaseline = 'middle'
		ctx.fillText(this.symbol, 0, 0)
		ctx.restore()
	}
}

// inject canvas behind everything
const canvas = document.createElement('canvas')
canvas.style.cssText = [
	'position: fixed',
	'top: 0',
	'left: 0',
	'width: 100%',
	'height: 100%',
	'z-index: -1',
	'pointer-events: none',
].join('; ')
document.body.prepend(canvas)

const ctx = canvas.getContext('2d')

function resize() {
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight
}
resize()
window.addEventListener('resize', resize)

// spawn particles — initial=true scatters them across screen from the start
const particles = Array.from({ length: COUNT }, () => new Particle(canvas, true))

function loop() {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	for (const p of particles) {
		p.update()
		p.draw(ctx)
	}
	requestAnimationFrame(loop)
}

loop()
