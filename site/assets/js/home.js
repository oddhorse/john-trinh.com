// Fetch artifact page and inject its main content into #portfolio-detail
async function loadDetailContent(url) {
	const detail = document.getElementById('portfolio-detail')
	if (!detail) return
	detail.innerHTML = '<p>Loading…</p>'
	try {
		const res = await fetch(url, { credentials: 'same-origin' })
		if (!res.ok) throw new Error(res.status + ' ' + res.statusText)
		const text = await res.text()
		const parser = new DOMParser()
		const doc = parser.parseFromString(text, 'text/html')
		// extract the content inside <main>
		const main = doc.querySelector('main')
		if (main) {
			// inject inner content
			detail.innerHTML = main.innerHTML
		} else {
			// fallback: full body
			detail.innerHTML = doc.body.innerHTML
		}
		// enhance any local video elements: try mp4 fallback or show download link
		enhanceVideos(detail)
		// focus detail for accessibility
		detail.setAttribute('tabindex', '-1')
		detail.focus()
	} catch (err) {
		detail.innerHTML = '<p>Error loading content.</p>'
		console.error(err)
	}
}

// Try to improve local video playback: prefer .mp4 sibling if available,
// otherwise show a download link if browser can't play provided sources.
function enhanceVideos(container) {
	if (!container) return
	const videos = container.querySelectorAll('video')
	videos.forEach(async (vid) => {
		// if browser can play at least one source, do nothing
		const sources = Array.from(vid.querySelectorAll('source'))
		const canPlay = sources.some(s => {
			const type = s.getAttribute('type') || ''
			try { return vid.canPlayType(type) !== '' }
			catch (e) { return false }
		})
		if (canPlay) return

		// try to find an mp4 sibling by swapping the extension
		for (const s of sources) {
			const src = s.getAttribute('src')
			if (!src) continue
			const mp4 = src.replace(/\.[^.]+$/, '.mp4')
			try {
				const head = await fetch(mp4, { method: 'HEAD' })
				if (head.ok) {
					// replace sources with mp4 and reload
					vid.innerHTML = `<source src="${mp4}" type="video/mp4">` +
						'<p>Your browser does not support the video tag.</p>'
					vid.load()
					return
				}
			} catch (err) {
				// ignore network errors
			}
		}

		// nothing playable found: add a download link below the video
		const firstSrc = sources[0] && sources[0].getAttribute('src')
		if (firstSrc) {
			const dl = document.createElement('p')
			dl.className = 'video-download'
			dl.innerHTML = `Can't play this video here — <a href="${firstSrc}" download>download</a>`
			vid.insertAdjacentElement('afterend', dl)
		}
	})
}

function setActiveByHref(href) {
	document.querySelectorAll('.grid-entry .entry-title').forEach(el => el.classList.remove('active'))
	const match = document.querySelector(`.grid-entry .entry-title[href="${href}"]`)
	if (match) match.classList.add('active')
}

export async function openDetail(href, push = true) {
	await loadDetailContent(href)
	setActiveByHref(href)
	if (push) {
		try {
			history.pushState({ href }, '', href)
		} catch (err) {
			// fallback to replaceState if pushState fails for some reason
			history.replaceState({ href }, '', href)
		}
	}
}

export function init() {
	// handle clicks on entries
	document.addEventListener('click', (e) => {
		const a = e.target.closest('a.entry-title')
		if (!a) return
		const href = a.getAttribute('href')
		if (!href) return
		// only handle same-origin
		if (href.startsWith('http') && new URL(href, location.href).origin !== location.origin) return
		e.preventDefault()
		openDetail(href, true)
	})

	// Make the whole `.grid-entry` act like clicking its `.entry-title` link.
	// Ignore clicks on interactive elements (links, buttons, inputs, labels).
	document.addEventListener('click', (e) => {
		const entry = e.target.closest('.grid-entry')
		if (!entry) return
		// if the click originated inside an actual link or interactive control, skip
		if (e.target.closest('a, button, input, textarea, select, label')) return
		const a = entry.querySelector('a.entry-title')
		if (!a) return
		const href = a.getAttribute('href')
		if (!href) return
		e.preventDefault()
		openDetail(href, true)
	})

	// handle back/forward
	window.addEventListener('popstate', (e) => {
		const state = e.state
		if (state && state.href) {
			openDetail(state.href, false)
		} else {
			// no state = show list only (clear detail and active state)
			clearDetail()
		}
	})

	// initial load: if URL already points to an artifact, try to open it
	const currentHref = location.pathname + location.search
	const isArtifactPath = /\/artifacts\/.+\/$/.test(location.pathname)
	if (isArtifactPath) {
		// open detail without pushing a new history entry
		openDetail(currentHref, false)
		// set initial state for back/forward
		history.replaceState({ href: currentHref }, '', currentHref)
	} else {
		// list page: do not auto-open any artifact by default
		// leave the detail pane empty so no artifact appears selected
		clearDetail()
	}
}

function clearDetail() {
	const detail = document.getElementById('portfolio-detail')
	if (detail) {
		// show a neutral placeholder or empty state
		detail.innerHTML = '<p class="detail-placeholder">Select an item to view details.</p>'
		detail.removeAttribute('tabindex')
	}
	// clear active state on entries
	document.querySelectorAll('.grid-entry .entry-title').forEach(el => el.classList.remove('active'))
}

// auto-init when loaded as a module on the list page
if (document.getElementById('portfolio-detail')) {
	document.addEventListener('DOMContentLoaded', () => init())
}

export default { init, openDetail }
