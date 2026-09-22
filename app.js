(() => {
  'use strict';

  const storageKey = 'mgt3745.pool.v1';
  const maxTrackLength = 200;
  const maxSourceLength = 60;

  const poolForm = document.querySelector('#pool-form');
  const trackInput = document.querySelector('#track-input');
  const sourceInput = document.querySelector('#source-input');
  const poolList = document.querySelector('#pool-list');
  const formError = document.querySelector('#form-error');
  const saveStatus = document.querySelector('#save-status');
  const emptyState = document.querySelector('#empty-state');

  // ?failSave forces the storage-failure path so it can be tested on demand
  // without actually filling the browser's storage.
  const simulateFailedSave = new URLSearchParams(window.location.search).has('failSave');

  let poolItems = loadPool();

  // A stored item is only trusted if it still has at least one source name,
  // because an unattributed item would break A5 even if it was edited in storage.
  function isValidItem(item) {
    return Boolean(item)
      && typeof item.track === 'string'
      && typeof item.addedOn === 'string'
      && Array.isArray(item.sources)
      && item.sources.length > 0
      && item.sources.every(name => typeof name === 'string' && name.trim().length > 0);
  }

  function loadPool() {
    try {
      const storedText = window.localStorage.getItem(storageKey);
      const parsed = storedText === null ? [] : JSON.parse(storedText);
      if (!Array.isArray(parsed) || !parsed.every(isValidItem)) {
        throw new Error('Unexpected stored data');
      }
      return parsed;
    } catch {
      // Storage is left as-is so a bad read never overwrites data that might be recoverable.
      saveStatus.textContent = 'The saved pool could not be read. Stored data was left unchanged.';
      return [];
    }
  }

  function savePool(nextItems) {
    try {
      if (simulateFailedSave) throw new Error('Simulated write failure');
      window.localStorage.setItem(storageKey, JSON.stringify(nextItems));
      return true;
    } catch {
      formError.textContent = 'Could not save. Your entry is still here. Try again when storage is available.';
      saveStatus.textContent = '';
      return false;
    }
  }

  function formatSources(sources) {
    if (sources.length === 1) return sources[0];
    return `${sources.slice(0, -1).join(', ')} and ${sources[sources.length - 1]}`;
  }

  function formatDate(isoText) {
    return new Date(isoText).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function removeItem(index) {
    const nextItems = poolItems.filter((item, itemIndex) => itemIndex !== index);
    if (!savePool(nextItems)) return;
    poolItems = nextItems;
    formError.textContent = '';
    renderPool();
    saveStatus.textContent = 'Removed from the pool.';
    trackInput.focus();
  }

  function renderPool() {
    poolList.replaceChildren();
    emptyState.hidden = poolItems.length > 0;

    poolItems.forEach((item, index) => {
      const listItem = document.createElement('li');
      const details = document.createElement('div');
      details.className = 'item-details';

      const trackText = document.createElement('span');
      trackText.className = 'item-track';
      trackText.textContent = item.track;

      const metaText = document.createElement('span');
      metaText.className = 'item-meta';
      metaText.textContent = `from ${formatSources(item.sources)} · added ${formatDate(item.addedOn)}`;

      details.append(trackText, metaText);

      const removeButton = document.createElement('button');
      removeButton.type = 'button';
      removeButton.className = 'remove-button';
      removeButton.textContent = 'Remove';
      removeButton.setAttribute('aria-label', `Remove ${item.track}`);
      removeButton.addEventListener('click', () => removeItem(index));

      listItem.append(details, removeButton);
      poolList.append(listItem);
    });
  }

  function showError(message, field) {
    formError.textContent = message;
    field.setAttribute('aria-invalid', 'true');
    saveStatus.textContent = '';
    field.focus();
  }

  poolForm.addEventListener('submit', event => {
    event.preventDefault();
    trackInput.removeAttribute('aria-invalid');
    sourceInput.removeAttribute('aria-invalid');
    formError.textContent = '';

    const track = trackInput.value.trim();
    const source = sourceInput.value.trim();

    if (track.length < 1 || track.length > maxTrackLength) {
      showError(`Enter a track of 1 to ${maxTrackLength} characters.`, trackInput);
      return;
    }
    // Rejected here, before savePool, because an item with no person attached
    // is indistinguishable from an algorithmic suggestion (A5).
    if (source.length < 1 || source.length > maxSourceLength) {
      showError(`Enter the name of the person this came from, 1 to ${maxSourceLength} characters.`, sourceInput);
      return;
    }

    const matchIndex = poolItems.findIndex(item => item.track.toLowerCase() === track.toLowerCase());
    let nextItems;
    let message;

    if (matchIndex === -1) {
      nextItems = [...poolItems, { track, sources: [source], addedOn: new Date().toISOString() }];
      message = `Added to the pool from ${source}.`;
    } else {
      const existing = poolItems[matchIndex];
      if (existing.sources.some(name => name.toLowerCase() === source.toLowerCase())) {
        showError('That track is already in the pool from that person.', sourceInput);
        return;
      }
      // One entry per track: a second recommender adds a name, not a duplicate row (A6).
      nextItems = poolItems.map((item, itemIndex) =>
        itemIndex === matchIndex ? { ...item, sources: [...item.sources, source] } : item);
      message = `${source} added as another source for that track.`;
    }

    if (!savePool(nextItems)) return;

    poolItems = nextItems;
    renderPool();
    trackInput.value = '';
    sourceInput.value = '';
    trackInput.focus();
    saveStatus.textContent = message;
  });

  renderPool();
})();
