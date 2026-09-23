(() => {
  'use strict';

  const apiBase = 'https://mgt3745-hw4.semajjohnson.workers.dev';
  const maxTrackLength = 200;
  const maxSourceLength = 60;

  const poolForm = document.querySelector('#pool-form');
  const trackInput = document.querySelector('#track-input');
  const sourceInput = document.querySelector('#source-input');
  const poolList = document.querySelector('#pool-list');
  const formError = document.querySelector('#form-error');
  const saveStatus = document.querySelector('#save-status');
  const emptyState = document.querySelector('#empty-state');

  // ?apiDown points the page at a path the Worker does not answer, so the
  // failed-response path can be demonstrated without taking the server down.
  const api = new URLSearchParams(window.location.search).has('apiDown')
    ? apiBase + '/not-a-real-endpoint'
    : apiBase + '/entries';

  let poolItems = [];

  function showError(message) {
    formError.textContent = message;
    saveStatus.textContent = '';
  }

  // The server returns one row per track-and-person pair, so a track
  // recommended by two people is merged here for display (A6).
  function mergeByTrack(rows) {
    const merged = [];
    rows.forEach(row => {
      const match = merged.find(item => item.track.toLowerCase() === row.track.toLowerCase());
      if (match) {
        match.sources.push(row.source);
        match.ids.push(row.id);
      } else {
        merged.push({ track: row.track, sources: [row.source], ids: [row.id], createdAt: row.created_at });
      }
    });
    return merged;
  }

  async function loadPool() {
    try {
      const response = await fetch(api);
      if (!response.ok) {
        showError('Could not load the pool. The server returned ' + response.status + '.');
        return [];
      }
      return mergeByTrack(await response.json());
    } catch {
      // A network failure must say so on the page rather than only in the console.
      showError('Could not reach the server. Check your connection and reload.');
      return [];
    }
  }

  async function savePool(track, source) {
    try {
      const response = await fetch(api, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ track, source })
      });
      if (response.ok) return true;
      // The Worker's 400 messages name the problem, so they are shown as written.
      showError(await response.text());
      return false;
    } catch {
      showError('Could not reach the server. Your entry was not saved.');
      return false;
    }
  }

  async function dismissItem(id) {
    try {
      const response = await fetch(apiBase + '/entries/' + id + '/dismiss', { method: 'POST' });
      if (!response.ok) {
        showError('Could not dismiss that item. The server returned ' + response.status + '.');
        return;
      }
      poolItems = await loadPool();
      renderPool();
      saveStatus.textContent = 'Dismissed. It will not come back from that person.';
    } catch {
      showError('Could not reach the server. Nothing was dismissed.');
    }
  }

  function formatSources(sources) {
    if (sources.length === 1) return sources[0];
    return `${sources.slice(0, -1).join(', ')} and ${sources[sources.length - 1]}`;
  }

  function formatDate(text) {
    const parsed = new Date(text.replace(' ', 'T') + 'Z');
    return Number.isNaN(parsed.getTime())
      ? text
      : parsed.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function renderPool() {
    poolList.replaceChildren();
    emptyState.hidden = poolItems.length > 0;

    poolItems.forEach(item => {
      const listItem = document.createElement('li');
      const details = document.createElement('div');
      details.className = 'item-details';

      const trackText = document.createElement('span');
      trackText.className = 'item-track';
      trackText.textContent = item.track;

      const metaText = document.createElement('span');
      metaText.className = 'item-meta';
      metaText.textContent = `from ${formatSources(item.sources)} · added ${formatDate(item.createdAt)}`;

      details.append(trackText, metaText);

      const dismissButton = document.createElement('button');
      dismissButton.type = 'button';
      dismissButton.className = 'remove-button';
      dismissButton.textContent = 'Dismiss';
      dismissButton.setAttribute('aria-label', `Dismiss ${item.track}`);
      dismissButton.addEventListener('click', () => {
        item.ids.forEach(id => dismissItem(id));
      });

      listItem.append(details, dismissButton);
      poolList.append(listItem);
    });
  }

  function showFieldError(message, field) {
    field.setAttribute('aria-invalid', 'true');
    showError(message);
    field.focus();
  }

  poolForm.addEventListener('submit', async event => {
    event.preventDefault();
    trackInput.removeAttribute('aria-invalid');
    sourceInput.removeAttribute('aria-invalid');
    formError.textContent = '';

    const track = trackInput.value.trim();
    const source = sourceInput.value.trim();

    if (track.length < 1 || track.length > maxTrackLength) {
      showFieldError(`Enter a track of 1 to ${maxTrackLength} characters.`, trackInput);
      return;
    }
    if (source.length < 1 || source.length > maxSourceLength) {
      showFieldError(`Enter the name of the person this came from, 1 to ${maxSourceLength} characters.`, sourceInput);
      return;
    }

    if (!await savePool(track, source)) return;

    poolItems = await loadPool();
    renderPool();
    trackInput.value = '';
    sourceInput.value = '';
    trackInput.focus();
    saveStatus.textContent = `Added to the pool from ${source}.`;
  });

  loadPool().then(items => {
    poolItems = items;
    renderPool();
  });
})();