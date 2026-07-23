(() => {
  const $ = (q) => document.querySelector(q);
  const gate = $('#authGate');
  const form = $('#authForm');
  const emailInput = $('#authEmail');
  const passwordInput = $('#authPassword');
  const submitBtn = $('#authSubmitBtn');
  const switchBtn = $('#authSwitchBtn');
  const loginTab = $('#authLoginTab');
  const signupTab = $('#authSignupTab');
  const googleBtn = $('#googleLoginBtn');
  const result = $('#authResult');
  const configNote = $('#authConfigNote');

  let client = null;
  let currentUser = null;
  let authMode = 'login';
  let busyAction = '';
  let authConfigured = false;
  let saveTimer = null;
  let lastSavePayload = null;
  let handlingUserId = null;
  let systemChannel = null;
  let systemPollTimer = null;
  let currentAnnouncement = null;
  let systemRefreshTimer = null;
  let trialTimer = null;
  let trialEndsAt = 0;

  function configValue(value) {
    const text = String(value || '').trim();
    return text && !text.includes('PASTE_') ? text : '';
  }

  function getConfig() {
    return {
      url: configValue(window.LEXORA_SUPABASE_URL),
      key: configValue(window.LEXORA_SUPABASE_ANON_KEY)
    };
  }

  function setMessage(message, kind = '') {
    if (!result) return;
    result.textContent = message || '';
    result.className = `result-box auth-result ${kind}`.trim();
  }

  function googleButtonLabel(label = 'Lanjutkan dengan Google') {
    if (!googleBtn) return;
    googleBtn.innerHTML = `<span>G</span><b>${label}</b>`;
  }

  function setBusy(action = '', label = '') {
    busyAction = action;
    const busy = Boolean(action);
    if (submitBtn) {
      submitBtn.disabled = busy || !authConfigured;
      submitBtn.textContent = action === 'submit'
        ? (label || (authMode === 'login' ? 'Masuk...' : 'Membuat akun...'))
        : (authMode === 'login' ? 'Masuk' : 'Buat akun');
    }
    if (googleBtn) {
      googleBtn.disabled = busy || !authConfigured;
      googleButtonLabel(action === 'google' ? (label || 'Membuka Google...') : 'Lanjutkan dengan Google');
    }
    // Tab Masuk/Daftar dan tombol switch sengaja tetap aktif agar UI tidak terasa macet.
  }

  function updateAuthMode() {
    const login = authMode === 'login';
    $('#authTitle').textContent = login ? 'Masuk ke Lexora' : 'Buat akun Lexora';
    $('#authSubtitle').textContent = login
      ? 'Lanjutkan vocabulary, saved words, practice, dan achievement dari perangkat mana pun.'
      : 'Daftar gratis agar seluruh progress belajar tersimpan khusus di akunmu.';
    loginTab?.classList.toggle('active', login);
    signupTab?.classList.toggle('active', !login);
    loginTab?.setAttribute('aria-selected', String(login));
    signupTab?.setAttribute('aria-selected', String(!login));
    if (!busyAction && submitBtn) submitBtn.textContent = login ? 'Masuk' : 'Buat akun';
    if (switchBtn) switchBtn.innerHTML = login
      ? 'Belum punya akun? <b>Daftar</b>'
      : 'Sudah punya akun? <b>Masuk</b>';
    if (passwordInput) passwordInput.autocomplete = login ? 'current-password' : 'new-password';
    setMessage('');
  }

  function setAuthMode(mode) {
    authMode = mode === 'signup' ? 'signup' : 'login';
    setBusy('');
    updateAuthMode();
  }

  function displayName(user) {
    return user?.user_metadata?.full_name || user?.user_metadata?.name || user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'User';
  }

  function initial(user) {
    return displayName(user).trim().charAt(0).toUpperCase() || 'U';
  }

  function renderUser(user) {
    const name = displayName(user);
    const email = user?.email || '';
    const first = initial(user);
    if ($('#sidebarUserName')) $('#sidebarUserName').textContent = name;
    if ($('#sidebarUserEmail')) $('#sidebarUserEmail').textContent = email;
    if ($('#sidebarUserAvatar')) $('#sidebarUserAvatar').textContent = first;
    if ($('#topUserInitial')) $('#topUserInitial').textContent = first;
    if ($('#accountName')) $('#accountName').textContent = name;
    if ($('#accountEmail')) $('#accountEmail').textContent = email;
    if ($('#accountAvatar')) $('#accountAvatar').textContent = first;
  }

  function showGate(show) {
    gate?.classList.toggle('hidden', !show);
    document.body.classList.toggle('auth-ready', !show);
    if (show && gate) requestAnimationFrame(() => gate.scrollTo({ top: 0, behavior: 'instant' }));
  }

  function friendlyAuthError(error, fallback = 'Login gagal. Coba lagi.') {
    const raw = String(error?.message || error || '').trim();
    const lower = raw.toLowerCase();
    if (lower.includes('invalid login credentials')) return 'Email atau password salah.';
    if (lower.includes('email not confirmed')) return 'Email belum dikonfirmasi. Cek inbox lalu klik link konfirmasi.';
    if (lower.includes('user already registered')) return 'Email ini sudah terdaftar. Pilih Masuk.';
    if (lower.includes('provider is not enabled') || lower.includes('unsupported provider')) return 'Login Google belum aktif di Supabase.';
    if (lower.includes('redirect') && lower.includes('not allowed')) return 'Alamat website belum dimasukkan ke Redirect URLs Supabase.';
    if (lower.includes('network') || lower.includes('fetch')) return 'Koneksi ke layanan login gagal. Coba lagi.';
    return raw || fallback;
  }

  function readOAuthErrorFromUrl() {
    const hash = new URLSearchParams(location.hash.replace(/^#/, ''));
    const query = new URLSearchParams(location.search);
    const code = hash.get('error_code') || query.get('error_code') || hash.get('error') || query.get('error');
    const description = hash.get('error_description') || query.get('error_description');
    if (!code && !description) return;
    setMessage(friendlyAuthError(description || code, 'Login Google gagal.'), 'error');
  }

  function isMissingSystemTable(error) {
    const code = String(error?.code || '');
    const message = String(error?.message || '').toLowerCase();
    return code === '42P01' || code === 'PGRST205' || message.includes('could not find the table') || message.includes('does not exist');
  }

  function blockIsActive(control) {
    if (!control?.blocked) return false;
    if (!control.blocked_until) return true;
    const until = new Date(control.blocked_until).getTime();
    return Number.isFinite(until) && until > Date.now();
  }

  function showBlocked(control = {}) {
    hideTrialUi();
    const overlay = $('#systemLockOverlay');
    const message = $('#systemLockMessage');
    const meta = $('#systemLockMeta');
    if (message) message.textContent = control.block_reason || 'Akun ini sementara tidak dapat menggunakan Lexora Academy.';
    if (meta) {
      if (control.blocked_until) {
        const until = new Date(control.blocked_until);
        meta.textContent = `Blokir berlaku sampai ${until.toLocaleString('id-ID')}`;
        meta.classList.add('show');
      } else {
        meta.textContent = 'Akses akun dinonaktifkan sampai admin membuka blokiran.';
        meta.classList.add('show');
      }
    }
    document.body.classList.add('lexora-user-blocked');
    overlay?.classList.add('show');
    overlay?.setAttribute('aria-hidden', 'false');
  }

  function hideBlocked() {
    document.body.classList.remove('lexora-user-blocked');
    $('#systemLockOverlay')?.classList.remove('show');
    $('#systemLockOverlay')?.setAttribute('aria-hidden', 'true');
  }


  function appealResult(message = '', kind = '') {
    const el = $('#blockAppealResult');
    if (!el) return;
    el.textContent = message;
    el.className = `result-box ${kind}`.trim();
  }

  function openBlockAppeal() {
    if (!currentUser || !client) return;
    appealResult('');
    const overlay = $('#blockAppealOverlay');
    overlay?.classList.add('show');
    overlay?.setAttribute('aria-hidden', 'false');
    setTimeout(() => $('#blockAppealMessage')?.focus(), 80);
  }

  function closeBlockAppeal() {
    $('#blockAppealOverlay')?.classList.remove('show');
    $('#blockAppealOverlay')?.setAttribute('aria-hidden', 'true');
  }

  function safeAppealFilename(name = 'evidence') {
    const clean = String(name).toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '');
    return clean.slice(-90) || 'evidence';
  }

  function renderAppealImagePreview() {
    const file = $('#blockAppealImage')?.files?.[0];
    const preview = $('#blockAppealPreview');
    if (!preview) return;
    preview.innerHTML = '';
    if (!file) return;
    if (!['image/png','image/jpeg','image/webp'].includes(file.type)) {
      appealResult('Format gambar harus PNG, JPG, atau WEBP.', 'error');
      $('#blockAppealImage').value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      appealResult('Ukuran gambar maksimal 5 MB.', 'error');
      $('#blockAppealImage').value = '';
      return;
    }
    const url = URL.createObjectURL(file);
    preview.innerHTML = `<img src="${url}" alt="Preview bukti"><div><b>${file.name}</b><small>${(file.size/1024/1024).toFixed(2)} MB</small></div>`;
    const img = preview.querySelector('img');
    img?.addEventListener('load', () => setTimeout(() => URL.revokeObjectURL(url), 1000), { once: true });
  }

  function isMissingAppealSystem(error) {
    const message = String(error?.message || '').toLowerCase();
    return isMissingSystemTable(error) || message.includes('bucket not found') || message.includes('lexora-block-appeals');
  }

  async function submitBlockAppeal(event) {
    event.preventDefault();
    if (!client || !currentUser) return appealResult('Login diperlukan.', 'error');
    const message = String($('#blockAppealMessage')?.value || '').trim();
    const file = $('#blockAppealImage')?.files?.[0] || null;
    const button = $('#blockAppealSubmitBtn');
    if (message.length < 12) return appealResult('Jelaskan bandingmu sedikit lebih lengkap.', 'error');
    if (file && !['image/png','image/jpeg','image/webp'].includes(file.type)) return appealResult('Format gambar harus PNG, JPG, atau WEBP.', 'error');
    if (file && file.size > 5 * 1024 * 1024) return appealResult('Ukuran gambar maksimal 5 MB.', 'error');
    if (button) { button.disabled = true; button.textContent = 'Mengirim banding...'; }
    appealResult('');
    let imagePath = null;
    try {
      const since = new Date(Date.now() - 30000).toISOString();
      const { data: recent, error: recentError } = await client.from('lexora_block_appeals').select('id').eq('user_id', currentUser.id).gte('created_at', since).limit(1);
      if (recentError) throw recentError;
      if (recent?.length) throw new Error('Tunggu sekitar 30 detik sebelum mengirim banding lagi.');
      if (file) {
        imagePath = `${currentUser.id}/${Date.now()}-${safeAppealFilename(file.name)}`;
        const { error: uploadError } = await client.storage.from('lexora-block-appeals').upload(imagePath, file, { upsert: false, contentType: file.type, cacheControl: '3600' });
        if (uploadError) throw uploadError;
      }
      const { error } = await client.from('lexora_block_appeals').insert({ user_id: currentUser.id, message, image_path: imagePath, status: 'pending' });
      if (error) throw error;
      appealResult('Pengajuan banding terkirim. Admin akan meninjau laporanmu.', 'success');
      $('#blockAppealForm')?.reset();
      $('#blockAppealPreview').innerHTML = '';
      setTimeout(closeBlockAppeal, 1600);
    } catch (error) {
      if (imagePath) await client.storage.from('lexora-block-appeals').remove([imagePath]).catch(() => {});
      if (isMissingAppealSystem(error)) appealResult('Sistem banding belum aktif. Admin perlu menjalankan supabase-schema.sql terbaru.', 'error');
      else appealResult(error?.message || 'Banding belum terkirim. Coba lagi.', 'error');
      console.warn('Lexora block appeal error:', error);
    } finally {
      if (button) { button.disabled = false; button.textContent = 'Kirim pengajuan banding'; }
    }
  }


  function configLink(value, fallback = '#') {
    const text = String(value || '').trim();
    return text && !text.includes('PASTE_') ? text : fallback;
  }

  function formatTrialTime(ms) {
    const total = Math.max(0, Math.ceil(ms / 1000));
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;
    return hours > 0
      ? `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`
      : `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
  }

  function configureTrialLinks() {
    const purchase = configLink(window.LEXORA_PURCHASE_URL, '#');
    const contact = configLink(window.LEXORA_ADMIN_CONTACT_URL, purchase);
    ['trialBuyMini','trialPurchaseBtn'].forEach(id => { const el = $('#'+id); if(el) el.href = purchase; });
    const contactBtn = $('#trialContactBtn'); if(contactBtn) contactBtn.href = contact;
  }

  function hideTrialUi() {
    clearInterval(trialTimer); trialTimer = null; trialEndsAt = 0;
    document.body.classList.remove('lexora-trial-active','lexora-trial-expired');
    $('#trialStatusBar')?.classList.remove('show');
    $('#trialStatusBar')?.setAttribute('aria-hidden','true');
    $('#trialExpiredOverlay')?.classList.remove('show');
    $('#trialExpiredOverlay')?.setAttribute('aria-hidden','true');
  }

  function showTrialExpired() {
    clearInterval(trialTimer); trialTimer = null;
    document.body.classList.remove('lexora-trial-active');
    document.body.classList.add('lexora-trial-expired');
    $('#trialStatusBar')?.classList.remove('show');
    $('#trialExpiredOverlay')?.classList.add('show');
    $('#trialExpiredOverlay')?.setAttribute('aria-hidden','false');
  }

  function startTrialCountdown(endsAt) {
    clearInterval(trialTimer);
    trialEndsAt = new Date(endsAt).getTime();
    if (!Number.isFinite(trialEndsAt) || trialEndsAt <= Date.now()) return showTrialExpired();
    configureTrialLinks();
    document.body.classList.remove('lexora-trial-expired');
    document.body.classList.add('lexora-trial-active');
    $('#trialExpiredOverlay')?.classList.remove('show');
    $('#trialStatusBar')?.classList.add('show');
    $('#trialStatusBar')?.setAttribute('aria-hidden','false');
    const tick = () => {
      const remaining = trialEndsAt - Date.now();
      if (remaining <= 0) return showTrialExpired();
      if ($('#trialCountdown')) $('#trialCountdown').textContent = formatTrialTime(remaining);
      if ($('#trialStatusText')) $('#trialStatusText').textContent = remaining < 5*60000
        ? 'Waktumu hampir habis. Progress tetap tersimpan di akun.'
        : 'Nikmati seluruh fitur selama masa percobaan aktif.';
    };
    tick(); trialTimer = setInterval(tick, 1000);
  }

  function applyTrialControl(control = {}) {
    const type = String(control?.access_type || 'full').toLowerCase();
    if (type !== 'trial') { hideTrialUi(); return { trial:false, expired:false }; }
    const ends = control?.trial_ends_at ? new Date(control.trial_ends_at).getTime() : 0;
    if (!ends || ends <= Date.now()) { showTrialExpired(); return { trial:true, expired:true }; }
    startTrialCountdown(control.trial_ends_at);
    return { trial:true, expired:false };
  }

  function announcementIcon(kind = 'info') {
    return ({ maintenance: '🛠️', update: '✨', warning: '⚠️', info: '📢' })[String(kind).toLowerCase()] || '📢';
  }

  function announcementLabel(kind = 'info') {
    return ({ maintenance: 'Perbaikan Lexora', update: 'Update Lexora', warning: 'Pemberitahuan Penting', info: 'Pemberitahuan Lexora' })[String(kind).toLowerCase()] || 'Pemberitahuan Lexora';
  }

  function showAnnouncement(row) {
    currentAnnouncement = row || null;
    const overlay = $('#systemAnnouncementOverlay');
    if (!row) {
      overlay?.classList.remove('show');
      overlay?.setAttribute('aria-hidden', 'true');
      return;
    }
    if ($('#systemAnnouncementIcon')) $('#systemAnnouncementIcon').textContent = announcementIcon(row.kind);
    if ($('#systemAnnouncementLabel')) $('#systemAnnouncementLabel').textContent = announcementLabel(row.kind);
    if ($('#systemAnnouncementTitle')) $('#systemAnnouncementTitle').textContent = row.title || 'Pemberitahuan Lexora';
    if ($('#systemAnnouncementMessage')) $('#systemAnnouncementMessage').textContent = row.message || '';
    overlay?.classList.add('show');
    overlay?.setAttribute('aria-hidden', 'false');
  }

  async function loadAnnouncements(user) {
    if (!client || !user || document.body.classList.contains('lexora-user-blocked')) return;
    try {
      const [{ data: rows, error }, { data: dismissed, error: dismissedError }] = await Promise.all([
        client.from('lexora_announcements').select('id,title,message,kind,priority,active,starts_at,ends_at,created_at').eq('active', true).order('priority', { ascending: false }).order('created_at', { ascending: false }).limit(50),
        client.from('lexora_announcement_dismissals').select('announcement_id').eq('user_id', user.id)
      ]);
      if (error) throw error;
      if (dismissedError) throw dismissedError;
      const dismissedIds = new Set((dismissed || []).map(x => String(x.announcement_id)));
      const now = Date.now();
      const next = (rows || []).find(row => {
        const starts = row.starts_at ? new Date(row.starts_at).getTime() : -Infinity;
        const ends = row.ends_at ? new Date(row.ends_at).getTime() : Infinity;
        return starts <= now && ends > now && !dismissedIds.has(String(row.id));
      });
      showAnnouncement(next || null);
    } catch (error) {
      if (!isMissingSystemTable(error)) console.warn('Lexora announcement load error:', error);
      showAnnouncement(null);
    }
  }

  async function dismissCurrentAnnouncement() {
    const row = currentAnnouncement;
    showAnnouncement(null);
    if (!row || !client || !currentUser) return;
    try {
      const { error } = await client.from('lexora_announcement_dismissals').upsert({ user_id: currentUser.id, announcement_id: row.id }, { onConflict: 'user_id,announcement_id' });
      if (error) throw error;
    } catch (error) {
      if (!isMissingSystemTable(error)) console.warn('Lexora announcement dismiss error:', error);
    }
    await loadAnnouncements(currentUser);
  }

  async function loadSystemState(user = currentUser) {
    if (!client || !user) return { blocked: false };
    try {
      const { data: control, error } = await client.from('lexora_user_controls').select('blocked,block_reason,blocked_at,blocked_until,access_type,trial_started_at,trial_ends_at,updated_at').eq('user_id', user.id).maybeSingle();
      if (error) throw error;
      if (blockIsActive(control)) {
        showAnnouncement(null);
        showBlocked(control);
        return { blocked: true, control };
      }
      hideBlocked();
      const trial = applyTrialControl(control || {});
      if (!trial.expired) await loadAnnouncements(user); else showAnnouncement(null);
      return { blocked: false, control, trial };
    } catch (error) {
      hideBlocked();
      hideTrialUi();
      if (!isMissingSystemTable(error)) console.warn('Lexora user control load error:', error);
      await loadAnnouncements(user);
      return { blocked: false, error };
    }
  }

  function scheduleSystemRefresh(delay = 120) {
    clearTimeout(systemRefreshTimer);
    systemRefreshTimer = setTimeout(() => loadSystemState(currentUser).catch(console.warn), delay);
  }

  function stopSystemWatch() {
    clearTimeout(systemRefreshTimer);
    clearInterval(systemPollTimer);
    clearInterval(trialTimer);
    trialTimer = null;
    systemRefreshTimer = null;
    systemPollTimer = null;
    if (systemChannel && client) client.removeChannel(systemChannel).catch(() => {});
    systemChannel = null;
  }

  function startSystemWatch(user) {
    stopSystemWatch();
    if (!client || !user) return;
    try {
      systemChannel = client.channel(`lexora-system-${user.id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'lexora_user_controls', filter: `user_id=eq.${user.id}` }, () => scheduleSystemRefresh())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'lexora_announcements' }, () => scheduleSystemRefresh())
        .subscribe();
    } catch (error) {
      console.warn('Lexora realtime control unavailable:', error);
    }
    systemPollTimer = setInterval(() => loadSystemState(user).catch(() => {}), 20000);
  }

  async function waitForApp() {
    if (window.LexoraSync?.waitUntilReady) await window.LexoraSync.waitUntilReady();
  }

  async function persist(payload = lastSavePayload) {
    if (!client || !currentUser || !payload) return;
    lastSavePayload = payload;
    const body = {
      user_id: currentUser.id,
      progress: payload.progress || {},
      achievements: payload.achievements || {},
      last_mode: payload.lastMode || 'english',
      updated_at: new Date().toISOString()
    };
    const { error } = await client.from('lexora_user_data').upsert(body, { onConflict: 'user_id' });
    if (error) throw error;

    const records = window.LexoraSync?.getCloudRecords?.() || { savedWords: [], achievements: [] };
    const savedRows = (records.savedWords || []).map(row => ({ ...row, user_id: currentUser.id }));
    const achievementRows = (records.achievements || []).map(row => ({ ...row, user_id: currentUser.id }));

    const { error: deleteSavedError } = await client.from('lexora_saved_words').delete().eq('user_id', currentUser.id);
    if (deleteSavedError) throw deleteSavedError;
    if (savedRows.length) {
      const { error: savedError } = await client.from('lexora_saved_words').insert(savedRows);
      if (savedError) throw savedError;
    }

    const { error: deleteAchievementError } = await client.from('lexora_user_achievements').delete().eq('user_id', currentUser.id);
    if (deleteAchievementError) throw deleteAchievementError;
    if (achievementRows.length) {
      const { error: achievementError } = await client.from('lexora_user_achievements').insert(achievementRows);
      if (achievementError) throw achievementError;
    }
  }

  async function loadCloudUser(user) {
    await waitForApp();
    const { data, error } = await client
      .from('lexora_user_data')
      .select('progress, achievements, last_mode')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) throw error;

    if (data) {
      window.LexoraSync?.applyData?.({
        progress: data.progress || {},
        achievements: data.achievements || {},
        lastMode: data.last_mode || 'english'
      });
    } else {
      const local = window.LexoraSync?.getData?.() || { progress: {}, achievements: {}, lastMode: 'english' };
      await persist(local);
    }

    const { data: writingRows, error: writingError } = await client
      .from('lexora_saved_writing')
      .select('id, mode, task_type, prompt, answer, ai_feedback, unit_count, created_at, updated_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100);
    if (writingError) throw writingError;
    window.LexoraSync?.setSavedWritings?.(writingRows || []);
  }


  let presenceTimer = null;
  let lastPresenceWrite = 0;

  async function touchLastSeen(user, force = false) {
    if (!client || !user?.id) return;
    const now = Date.now();
    if (!force && now - lastPresenceWrite < 45000) return;
    lastPresenceWrite = now;
    const payload = {
      user_id: user.id,
      email: user.email || '',
      display_name: user.user_metadata?.display_name || user.user_metadata?.full_name || (user.email || '').split('@')[0] || 'Learner',
      last_seen_at: new Date(now).toISOString(),
      updated_at: new Date(now).toISOString()
    };
    const { error } = await client.from('lexora_profiles').upsert(payload, { onConflict: 'user_id' });
    if (error) console.warn('Last online update gagal:', error.message);
  }

  function startPresence(user) {
    clearInterval(presenceTimer);
    touchLastSeen(user, true);
    presenceTimer = setInterval(() => touchLastSeen(user), 60000);
  }

  function stopPresence() {
    clearInterval(presenceTimer);
    presenceTimer = null;
  }

  async function handleSession(session) {
    const user = session?.user || null;
    document.documentElement.classList.remove('lexora-session-hint');
    if (!user) {
      stopSystemWatch(); stopPresence(); hideBlocked(); hideTrialUi(); closeBlockAppeal(); showAnnouncement(null);
      currentUser = null; handlingUserId = null; showGate(true); return;
    }
    if (handlingUserId === user.id && currentUser?.id === user.id) return;
    handlingUserId = user.id; currentUser = user; renderUser(user); startPresence(user);

    // Tampilkan aplikasi segera. Cloud sync dan pemeriksaan blokir berjalan di belakang.
    showGate(false);
    document.body.classList.add('lexora-syncing');
    try {
      const systemPromise = loadSystemState(user);
      await loadCloudUser(user);
      lastSavePayload = window.LexoraSync?.getData?.() || null;
      if (lastSavePayload) persist(lastSavePayload).catch((e)=>console.warn('Background sync:',e));
      await systemPromise;
      startSystemWatch(user);
      renderUser(user);
    } catch (error) {
      console.error('Lexora cloud load error:', error);
      // Jangan lempar user kembali ke login hanya karena koneksi sync lambat.
      window.dispatchEvent(new CustomEvent('lexora:sync-warning',{detail:{message:error?.message||'Cloud sync gagal'}}));
      handlingUserId = null;
    } finally {
      document.body.classList.remove('lexora-syncing');
    }
  }

  async function submitAuth(event) {
    event.preventDefault();
    if (!client) {
      setMessage('Login belum aktif. Hubungkan Supabase terlebih dahulu.', 'error');
      return;
    }
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    if (!email || password.length < 6) {
      setMessage('Isi email dan password minimal 6 karakter.', 'error');
      return;
    }

    setBusy('submit', authMode === 'login' ? 'Masuk...' : 'Membuat akun...');
    setMessage('');
    try {
      if (authMode === 'login') {
        const { error } = await client.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { data, error } = await client.auth.signUp({
          email,
          password,
          options: { data: { display_name: email.split('@')[0] } }
        });
        if (error) throw error;
        if (!data.session) {
          setAuthMode('login');
          emailInput.value = email;
          setMessage('Akun berhasil dibuat. Cek email konfirmasi, lalu kembali dan masuk.', 'success');
        }
      }
    } catch (error) {
      setMessage(friendlyAuthError(error), 'error');
    } finally {
      setBusy('');
    }
  }

  function currentRedirectUrl() {
    const url = new URL(location.href);
    url.hash = '';
    url.search = '';
    return url.toString();
  }

  async function loginGoogle() {
    if (!client) {
      setMessage('Login Google belum aktif. Hubungkan Supabase terlebih dahulu.', 'error');
      return;
    }
    setBusy('google', 'Membuka Google...');
    setMessage('');
    try {
      const { data, error } = await client.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: currentRedirectUrl() }
      });
      if (error) throw error;
      // Supabase biasanya langsung redirect. Jika browser tetap di halaman ini, arahkan manual.
      if (data?.url) window.location.assign(data.url);
    } catch (error) {
      setMessage(friendlyAuthError(error, 'Login Google gagal. Periksa konfigurasi Google di Supabase.'), 'error');
      setBusy('');
    }
  }

  function openAccount() {
    if (!currentUser) return showGate(true);
    renderUser(currentUser);
    $('#accountModal')?.classList.add('show');
  }

  async function logout() {
    if (!client) return;
    try {
      if (lastSavePayload) await persist(lastSavePayload).catch(() => {});
      await client.auth.signOut();
    } finally {
      stopSystemWatch();
      hideBlocked();
      hideTrialUi();
      closeBlockAppeal();
      showAnnouncement(null);
      localStorage.removeItem('lexora-split-progress');
      localStorage.removeItem('lexora-achievements');
      window.LexoraSync?.resetForUser?.();
      $('#accountModal')?.classList.remove('show');
      currentUser = null;
      handlingUserId = null;
      setAuthMode('login');
      showGate(true);
      setMessage('Kamu sudah keluar dari akun.', 'success');
    }
  }

  window.LexoraBackend = {
    getClient: () => client,
    getUser: () => currentUser
  };

  window.LexoraCloud = {
    queueSave(payload) {
      lastSavePayload = payload;
      if (!currentUser || !client) return;
      clearTimeout(saveTimer);
      const snapshot = typeof structuredClone === 'function' ? structuredClone(payload) : JSON.parse(JSON.stringify(payload));
      saveTimer = setTimeout(() => persist(snapshot).catch((error) => console.error('Lexora cloud save error:', error)), 700);
    },
    async saveWriting(record) {
      if (!currentUser || !client) throw new Error('Login diperlukan.');
      const body = {
        user_id: currentUser.id,
        mode: record.mode || 'english',
        task_type: record.taskType || 'Writing',
        prompt: record.prompt || '',
        answer: record.answer || '',
        ai_feedback: record.aiFeedback || '',
        unit_count: Number(record.unitCount) || 0,
        updated_at: new Date().toISOString()
      };
      const { data, error } = await client.from('lexora_saved_writing').insert(body).select().single();
      if (error) throw error;
      return data;
    },
    refreshSystem: () => loadSystemState(currentUser),
    openAccount
  };

  function bindUi() {
    form?.addEventListener('submit', submitAuth);
    loginTab?.addEventListener('click', () => setAuthMode('login'));
    signupTab?.addEventListener('click', () => setAuthMode('signup'));
    switchBtn?.addEventListener('click', () => setAuthMode(authMode === 'login' ? 'signup' : 'login'));
    $('#closeAccountModal')?.addEventListener('click', () => $('#accountModal')?.classList.remove('show'));
    $('#logoutBtn')?.addEventListener('click', logout);
    $('#systemLockAppealBtn')?.addEventListener('click', openBlockAppeal);
    $('#closeBlockAppeal')?.addEventListener('click', closeBlockAppeal);
    $('#blockAppealImage')?.addEventListener('change', renderAppealImagePreview);
    $('#blockAppealForm')?.addEventListener('submit', submitBlockAppeal);
    $('#systemLockLogoutBtn')?.addEventListener('click', logout);
    $('#trialLogoutBtn')?.addEventListener('click', logout);
    $('#systemAnnouncementClose')?.addEventListener('click', dismissCurrentAnnouncement);
    $('#systemAnnouncementOk')?.addEventListener('click', dismissCurrentAnnouncement);
  }

  async function init() {
    bindUi();
    updateAuthMode();
    readOAuthErrorFromUrl();

    const cfg = getConfig();
    if (!cfg.url || !cfg.key || !window.supabase?.createClient) {
      showGate(true);
      if (submitBtn) submitBtn.disabled = true;
      if (googleBtn) googleBtn.disabled = true;
      if (configNote) configNote.textContent = 'Login sedang belum tersedia. Hubungkan konfigurasi Supabase untuk mengaktifkannya.';
      setMessage('Login belum aktif.', 'error');
      return;
    }

    authConfigured = true;
    setBusy('');
    if (document.documentElement.classList.contains('lexora-session-hint')) showGate(false);
    configureTrialLinks();
    client = window.supabase.createClient(cfg.url, cfg.key, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });

    client.auth.onAuthStateChange((_event, session) => {
      setTimeout(() => handleSession(session), 0);
    });

    const { data, error } = await client.auth.getSession();
    if (error) setMessage(friendlyAuthError(error), 'error');
    await handleSession(data?.session || null);
  }

  init().catch((error) => {
    console.error(error);
    showGate(true);
    setMessage('Login gagal dimuat. Muat ulang halaman dan coba lagi.', 'error');
    setBusy('');
  });
})();
