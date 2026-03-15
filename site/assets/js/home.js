// Fetch artifact page and inject its main content into #portfolio-detail
async function loadDetail(url) {
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
		// focus detail for accessibility
		detail.setAttribute('tabindex', '-1')
		detail.focus()
	} catch (err) {
		detail.innerHTML = '<p>Error loading content.</p>'
		console.error(err)
	}
}

// attach handlers
document.addEventListener('click', (e) => {
	const a = e.target.closest('a.entry-title')
	if (!a) return
	// ensure link is internal
	const href = a.getAttribute('href')
	if (!href || (href.startsWith('http') && new URL(href, location.href).origin !== location.origin)) return
	e.preventDefault()
	// mark active
	document.querySelectorAll('.grid-entry .entry-title').forEach(el => el.classList.remove('active'))
	a.classList.add('active')
	loadDetail(href)
	// update history
	history.replaceState({}, '', href)
})

// Optionally load first artifact on page load
window.addEventListener('DOMContentLoaded', () => {
	const first = document.querySelector('.grid-entry .entry-title')
	if (first) {
		// load but don't push history (we replace when clicked)
		loadDetail(first.getAttribute('href'))
		first.classList.add('active')
	}
})

export default {}
