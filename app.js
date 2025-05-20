import ApiClient from './apiClient.js';

const client = new ApiClient('https://jsonplaceholder.typicode.com');

const methodEl = document.getElementById('method');
const routeEl = document.getElementById('route');
const paramsEl = document.getElementById('params');
const bodyGroup = document.getElementById('body-group');
const bodyEl = document.getElementById('body');
const resultEl = document.getElementById('result');
const toastEl = document.getElementById('toast');
const loadingEl = document.getElementById('loading');
const bg = document.getElementById('bgNames');

methodEl.addEventListener('change', () => {
  bodyGroup.style.display = ['POST', 'PUT', 'PATCH'].includes(methodEl.value)
    ? 'block'
    : 'none';
});

const parseKV = str =>
  str
    .split(',')
    .map(p => p.split('='))
    .filter(p => p[0] && p[1])
    .reduce((a, [k, v]) => ((a[k.trim()] = v.trim()), a), {});

function showToast(msg, time = 3000) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  setTimeout(() => toastEl.classList.remove('show'), time);
}

// Render names dynamically in random positions
const names = ['Soludo', 'Pedro', 'Yaya'];
names.forEach((name, i) => {
  const span = document.createElement('span');
  span.textContent = name;
  span.className = 'floating-name';
  const top = Math.floor(Math.random() * 90);  
  const left = Math.floor(Math.random() * 95); 
  span.style.top = `${top}%`;
  span.style.left = `${left}%`;
  span.style.animationDelay = `${i * 2}s`;
  span.style.transform = `rotate(${Math.floor(Math.random() * 20 - 10)}deg)`;
  bg.appendChild(span);
});

document.getElementById('sendBtn').onclick = async () => {
  resultEl.classList.remove('show');
  resultEl.textContent = '';
  loadingEl.classList.add('show');

  const method = methodEl.value.toLowerCase();
  const route = routeEl.value.trim();
  const params = parseKV(paramsEl.value);
  const allParams = parseKV(paramsEl.value);


  let bodyData = null;
  if (['post', 'put', 'patch'].includes(method)) {
    try {
      bodyData = JSON.parse(bodyEl.value);
    } catch {
      showToast(' Invalid JSON body');
      loadingEl.classList.remove('show');
      return;
    }
  }

  try {
    const start = performance.now();
    let res;

    if (method === 'get') res = await client.get(route, allParams);
    else if (method === 'post') res = await client.post(route, bodyData, allParams);
    else if (method === 'put') res = await client.put(route, bodyData, allParams);
    else if (method === 'patch') res = await client.patch(route, bodyData, allParams);
    else if (method === 'delete') res = await client.delete(route, allParams);

    const duration = (performance.now() - start).toFixed(2);
    const isEmpty = (Array.isArray(res) && res.length === 0) ||
                    (typeof res === 'object' && Object.keys(res).length === 0);

    resultEl.textContent = isEmpty
      ? ' No data found. Try different input.'
      :resultEl.textContent = JSON.stringify(res, null, 2);


    resultEl.classList.add('show');
    showToast(' Request successful!');
  } catch (error) {
    showToast(` ${error.message}`);
  } finally {
    loadingEl.classList.remove('show');
  }
};
