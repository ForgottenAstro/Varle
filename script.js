const products = [
	{ id: 1, n: 'Chrome Chain', c: 'chains', p: 39.99, cl: '', image: 'images/chromechsin.jpg' },
	{ id: 2, n: 'Aureum Chain', c: 'chains', p: 44.99, cl: 'gold', image: 'images/aurem.jpg', imageFit: 'contain' },
	{ id: 3, n: 'Axis Ring', c: 'rings', p: 29.99, cl: '', image: 'images/Axis ring.jpg' },
	{ id: 4, n: 'Vanta Ring', c: 'rings', p: 27.99, cl: 'gold', image: 'images/vanta ring.jpg' },
	{ id: 5, n: 'Ethereal Bracelet', c: 'bracelets', p: 34.99, cl: '', image: 'images/Ethereal brace.jpg' },
	{ id: 6, n: 'Noir Bracelet', c: 'bracelets', p: 36.99, cl: '', image: 'images/the-noir-back.webp' },
	{ id: 7, n: 'Varel Chrono', c: 'watches', p: 89.99, cl: 'watch', image: 'images/chrono.jpg', imageFit: 'contain' },
	{ id: 8, n: 'Aureum Time', c: 'watches', p: 94.99, cl: 'watch gold', image: 'images/aureum black watch.jpg', imageFit: 'contain' },
	{ id: 9, n: 'Leather belt', c: 'belts', p: 49.99, cl: '', image: 'images/black belt.jpg' },
];

let cart = JSON.parse(localStorage.varelCart || '[]');
const $ = (s) => document.querySelector(s);

// Currency conversion: USD -> INR
// Default exchange rate (1 USD = 1 INR). Change `EXCHANGE_RATE` if you want a different rate.
const EXCHANGE_RATE = 1;
const INR_FORMATTER = new Intl.NumberFormat('en-IN', {
	style: 'currency',
	currency: 'INR',
	maximumFractionDigits: 2,
});
const money = (n) => INR_FORMATTER.format(n * EXCHANGE_RATE);

function render(filter = 'all') {
	const list = filter === 'all' ? products : products.filter((x) => x.c === filter);
	const html = list
		.map(
			(x) =>
				`<article class="product" onclick="add(${x.id})"><div class="pic ${x.cl}${x.image ? ' has-image' : ''}${x.imageFit ? ` fit-${x.imageFit}` : ''}"${x.image ? ` style="background-image: url('${x.image}')"` : ''}></div><div class="info"><div>${x.n}<p>★★★★★</p></div><span>${money(
					x.p
				)}</span></div></article>`
		)
		.join('');
	$('#products').innerHTML = html;
}

function add(id) {
	const item = cart.find((x) => x.id === id);
	if (item) item.q++;
	else cart.push({ id, q: 1 });
	save();
	openDrawer();
}

function save() {
	localStorage.varelCart = JSON.stringify(cart);
	renderCart();
}

function renderCart() {
	let total = 0;
	const html = cart
		.map((x) => {
			const p = products.find((p) => p.id === x.id);
			total += p.p * x.q;
			return `
				<div class="row">
					<div class="thumb"></div>
					<div>
						<h4>${p.n}</h4>
						<p>${money(p.p)}</p>
						<div class="qty">
							<button onclick="change(${p.id},-1)">−</button>
							${x.q}
							<button onclick="change(${p.id},1)">+</button>
						</div>
					</div>
					<button onclick="change(${p.id},-${x.q})">REMOVE</button>
				</div>
			`;
		})
		.join('');

	$('#items').innerHTML = html;
	$('#empty').style.display = cart.length ? 'none' : 'block';
	$('#count').textContent = cart.reduce((a, x) => a + x.q, 0);
	$('#subtotal').textContent = money(total);
}

function change(id, d) {
	const item = cart.find((x) => x.id === id);
	if (!item) return;
	item.q += d;
	if (item.q < 1) cart = cart.filter((x) => x.id !== id);
	save();
}

function openDrawer() {
	$('#drawer').classList.add('open');
	$('#backdrop').classList.add('open');
}

function closeDrawer() {
	$('#drawer').classList.remove('open');
	$('#backdrop').classList.remove('open');
}

$('#cartBtn').onclick = openDrawer;
$('#close').onclick = closeDrawer;
$('#backdrop').onclick = closeDrawer;
$('#checkout').onclick = () =>
	alert(
		'Demo checkout. Connect Stripe, Shopify, Razorpay, or another payment provider before launch.'
	);

document.querySelectorAll('#filters button').forEach((b) =>
	(b.onclick = () => {
		document.querySelectorAll('#filters button').forEach((x) => x.classList.remove('active'));
		b.classList.add('active');
		render(b.dataset.cat);
	})
);

document.querySelectorAll('[data-filter]').forEach((a) =>
	(a.onclick = () => {
		const f = a.dataset.filter;
		document.querySelectorAll('#filters button').forEach((x) => x.classList.toggle('active', x.dataset.cat === f));
		render(f);
	})
);

$('#form').onsubmit = (e) => {
	e.preventDefault();
	const emailInput = e.target.querySelector('input[type=email]');
	const email = emailInput ? emailInput.value.trim() : '';
	if (!email) return;
	// Redirect to auth page to let the user sign in / sign up. Prefill email via query param.
	window.location.href = `auth.html?email=${encodeURIComponent(email)}`;};
render();
renderCart();
