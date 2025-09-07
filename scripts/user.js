
const API_BASE = "https://53911fcfda7e.ngrok-free.app";
const ADMIN_USERS_ENDPOINT = `${API_BASE}/user/admin/users`; 

function getToken() {
  return localStorage.getItem('token'); 
}

async function apiFetch(url, options = {}) {
  const token = getToken();
  const headers = Object.assign({ 'Content-Type': 'application/json' }, 
    options.headers || {});
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, Object.assign({}, options, { headers }));
  if (!res.ok) {
    const errText = await res.text().catch(()=>null);
    let err;
    try { err = JSON.parse(errText); } catch(e){ err = { error: errText || res.statusText }; }
    throw Object.assign(new Error('API error'), { status: res.status, body: err });
  }
  return res.status !== 204 ? res.json() : null;
}

function createStatusPill(status) {
  const span = document.createElement('span');
  span.classList.add('status-pill');
  switch ((status || '').toLowerCase()) {
    case 'suspended':
      span.classList.add('status-suspended');
      span.textContent = 'Suspended';
      break;
    case 'activated':
    case 'active':
      span.classList.add('status-active');
      span.textContent = 'Activated';
      break;
    case 'pending':
    case 'awaiting_activation':
    default:
      span.classList.add('status-pending');
      span.textContent = 'Awaiting activation';
      break;
  }
  return span;
}

function buildActionButtons(username, status) {
  const container = document.createElement('div');
  container.className = 'actions';

  // Delete button
  const del = document.createElement('button');
  del.className = 'btn-delete';
  del.textContent = 'Delete';
  del.addEventListener('click', () => confirmAndDelete(username));
  container.appendChild(del);

  if ((status || '').toLowerCase() === 'suspended') {
    const act = document.createElement('button');
    act.className = 'btn-activate';
    act.textContent = 'Activate';
    act.addEventListener('click', () => confirmAndActivate(username));
    container.appendChild(act);
  } else {
    const susp = document.createElement('button');
    susp.className = 'btn-suspend';
    susp.textContent = 'Suspend';
    susp.addEventListener('click', () => confirmAndSuspend(username));
    container.appendChild(susp);
  }

  return container;
}

async function confirmAndDelete(username) {
  if (!confirm(`Delete user "${username}"? This action is irreversible.`)) return;
  try {
    await apiFetch(`${ADMIN_USERS_ENDPOINT}/${encodeURIComponent(username)}`, { method: 'DELETE' });
    await loadAndRenderUsers();
    alert('User deleted');
  } catch (err) {
    console.error(err);
    alert(err.body?.error || `Failed to delete user (${err.status || 'error'})`);
  }
}

async function confirmAndSuspend(username) {
  if (!confirm(`Suspend user "${username}"?`)) return;
  try {
    await apiFetch(`${ADMIN_USERS_ENDPOINT}/${encodeURIComponent(username)}/suspend`, { method: 'PATCH' });
    await loadAndRenderUsers();
    alert('User suspended');
  } catch (err) {
    console.error(err);
    alert(err.body?.error || `Failed to suspend user (${err.status || 'error'})`);
  }
}

async function confirmAndActivate(username) {
  if (!confirm(`Activate user "${username}"?`)) return;
  try {
    await apiFetch(`${ADMIN_USERS_ENDPOINT}/${encodeURIComponent(username)}/activate`, { method: 'PATCH' });
    await loadAndRenderUsers();
    alert('User activated');
  } catch (err) {
    console.error(err);
    alert(err.body?.error || `Failed to activate user (${err.status || 'error'})`);
  }
}

function renderUsers(users) {
  const tbody = document.querySelector('#usersTable tbody');
  const noUsers = document.getElementById('noUsers');
  tbody.innerHTML = '';

  if (!Array.isArray(users) || users.length === 0) {
    noUsers.classList.remove('hidden');
    document.getElementById('loading').classList.add('hidden');
    return;
  }
  noUsers.classList.add('hidden');

  users.forEach(u => {
    const tr = document.createElement('tr');

    // Username cell
    const tdUser = document.createElement('td');
    tdUser.textContent = u.username || u.id || '—';
    tr.appendChild(tdUser);

    const tdEmail = document.createElement('td');
    tdEmail.textContent = u.email || '—';
    tr.appendChild(tdEmail);

    // Role
    const tdRole = document.createElement('td');
    tdRole.textContent = u.role || 'USER';
    tr.appendChild(tdRole);

    // Status
    const tdStatus = document.createElement('td');
    tdStatus.appendChild(createStatusPill(u.status || (u.activated ? 'activated' : 'pending')));
    tr.appendChild(tdStatus);

    // Actions
    const tdActions = document.createElement('td');
    tdActions.appendChild(buildActionButtons(u.username || u.id, u.status || (u.activated ? 'activated' : 'pending')));
    tr.appendChild(tdActions);

    tbody.appendChild(tr);
  });

  document.getElementById('loading').classList.add('hidden');
}

async function loadAndRenderUsers() {
  document.getElementById('loading').classList.remove('hidden');
  try {
   
    const users = await apiFetch(ADMIN_USERS_ENDPOINT, { method: 'GET' });
    renderUsers(users);
  } catch (err) {
    console.error('Failed to load users', err);
    document.getElementById('loading').textContent = 'Failed to load users';
  }
}

// initialize on load
window.addEventListener('load', () => {
  loadAndRenderUsers();
});