// animations.js — wii-energy interactions for portfolio cards
// gsap loaded via CDN before this script runs

const BASE_ROTATIONS = [-1.1, 0.7, -0.4, 1.3, -0.8, 0.3, -1.5, 0.9];

document.addEventListener('DOMContentLoaded', () => {
	const cards = document.querySelectorAll('.grid-entry');

	// assign each card a base rotation and store it
	cards.forEach((card, i) => {
		card._rot = BASE_ROTATIONS[i % BASE_ROTATIONS.length];
		gsap.set(card, { rotation: card._rot, opacity: 0, y: 50, scale: 0.88 });
	});

	// fly in on load — staggered, bouncy
	gsap.to(cards, {
		opacity: 1,
		y: 0,
		scale: 1,
		duration: 0.55,
		stagger: { each: 0.055, from: 'start' },
		ease: 'back.out(2)',
	});

	// header name — pop in, then letter wave
	const h1 = document.querySelector('header h1');
	if (h1) {
		gsap.from(h1, {
			opacity: 0,
			y: -20,
			scale: 0.85,
			duration: 0.6,
			ease: 'elastic.out(1, 0.5)',
			delay: 0.1,
		});

		// split name into chars for wave — target the <a> if present, else h1 itself
		const nameEl = h1.querySelector('a') || h1;
		const raw = nameEl.textContent;
		nameEl.innerHTML = raw.split('').map(c =>
			c === ' ' ? '<span style="display:inline-block;width:0.3em">&nbsp;</span>'
			          : `<span style="display:inline-block">${c}</span>`
		).join('');

		// stagger each char's infinite yoyo loop — offset by index = rolling wave
		nameEl.querySelectorAll('span').forEach((char, i) => {
			gsap.to(char, {
				y: -6,
				duration: 0.55,
				ease: 'sine.inOut',
				repeat: -1,
				yoyo: true,
				delay: 0.8 + i * 0.07,
			});
		});
	}

	// nav links — cascade in
	const navLinks = document.querySelectorAll('header nav a');
	gsap.from(navLinks, {
		opacity: 0,
		y: -10,
		duration: 0.4,
		stagger: 0.07,
		ease: 'back.out(2)',
		delay: 0.25,
	});

	// card interactions
	cards.forEach(card => {
		// hover in — spring up, lose rotation
		card.addEventListener('mouseenter', () => {
			gsap.to(card, {
				scale: 1.06,
				rotation: 0,
				y: -5,
				duration: 0.35,
				ease: 'elastic.out(1.2, 0.5)',
			});
		});

		// hover out — spring back to resting wonk
		card.addEventListener('mouseleave', () => {
			gsap.to(card, {
				scale: 1,
				rotation: card._rot,
				y: 0,
				duration: 0.5,
				ease: 'elastic.out(1, 0.4)',
			});
		});

		// click down — squish
		card.addEventListener('mousedown', () => {
			gsap.to(card, {
				scale: 0.93,
				duration: 0.08,
				ease: 'power3.in',
			});
		});

		// click release — pop!
		card.addEventListener('mouseup', () => {
			gsap.timeline()
				.to(card, { scale: 1.1, rotation: 0, duration: 0.18, ease: 'back.out(3)' })
				.to(card, { scale: 1.06, duration: 0.15, ease: 'power2.out' });
		});
	});
});
