/**
 * API base URL for fetch calls. Use same origin when served from Next.js (e.g. /appui/P-HOME.html).
 * For file:// or different port, set window.API_BASE before loading pages (e.g. API_BASE = 'http://localhost:3000').
 */
window.API_BASE = window.API_BASE || 'http://localhost:3000';

function apiUrl(path) {
  return (window.API_BASE + path).replace(/([^:]\/)\/+/g, '$1');
}

/**
 * Fetch cases list with optional filters.
 * @param {Object} opts - { page, pageSize, field, difficulty, sort, keyword }
 * @returns {Promise<{ data: Array, total: number, page: number, pageSize: number }>}
 */
window.fetchCases = function (opts) {
  const params = new URLSearchParams();
  if (opts && opts.page) params.set('page', opts.page);
  if (opts && opts.pageSize) params.set('pageSize', opts.pageSize);
  if (opts && opts.field) params.set('field', opts.field);
  if (opts && opts.difficulty) params.set('difficulty', opts.difficulty);
  if (opts && opts.sort) params.set('sort', opts.sort);
  if (opts && opts.keyword) params.set('keyword', opts.keyword);
  return fetch(apiUrl('/api/cases?' + params.toString())).then(function (res) {
    if (!res.ok) throw new Error('Cases API error: ' + res.status);
    return res.json();
  });
};

/**
 * Fetch single case by id or slug.
 * @param {string} id - case id (UUID) or slug (e.g. case-001)
 * @returns {Promise<Object>}
 */
window.fetchCaseById = function (id) {
  return fetch(apiUrl('/api/cases/' + encodeURIComponent(id))).then(function (res) {
    if (!res.ok) throw new Error('Case not found');
    return res.json();
  });
};

/**
 * Fetch videos, optionally for a case.
 * @param {string} [caseId] - optional case id or slug
 * @returns {Promise<Array>}
 */
window.fetchVideos = function (caseId) {
  const url = caseId ? apiUrl('/api/videos?caseId=' + encodeURIComponent(caseId)) : apiUrl('/api/videos');
  return fetch(url).then(function (res) {
    if (!res.ok) throw new Error('Videos API error: ' + res.status);
    return res.json();
  });
};

/**
 * Fetch leaderboard ranked by score descending.
 * @param {Object} opts - { limit, offset }
 * @returns {Promise<Array>}
 */
window.fetchLeaderboard = function (opts) {
  const params = new URLSearchParams();
  if (opts && opts.limit) params.set('limit', opts.limit);
  if (opts && opts.offset) params.set('offset', opts.offset);
  return fetch(apiUrl('/api/leaderboard?' + params.toString())).then(function (res) {
    if (!res.ok) throw new Error('Leaderboard API error: ' + res.status);
    return res.json();
  });
};

/**
 * Authentication API
 */
window.auth = {
  /**
   * Login with email and password
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{ user: Object, session: Object }>}
   */
  login: function(email, password) {
    return fetch(apiUrl('/api/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password })
    }).then(function(res) {
      return res.json().then(function(data) {
        if (!res.ok) throw new Error(data.error || 'Login failed');
        if (data.session) {
          localStorage.setItem('bird_session', JSON.stringify(data.session));
          localStorage.setItem('bird_user', JSON.stringify(data.user));
        }
        return data;
      });
    });
  },

  /**
   * Register with email and password
   * @param {string} email
   * @param {string} password
   * @param {string} [username]
   * @returns {Promise<{ user: Object, session: Object, requireConfirmation: boolean }>}
   */
  register: function(email, password, username) {
    return fetch(apiUrl('/api/auth/register'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password, username: username })
    }).then(function(res) {
      return res.json().then(function(data) {
        if (!res.ok) throw new Error(data.error || 'Registration failed');
        // If session exists (auto confirm), save it
        if (data.session) {
          localStorage.setItem('bird_session', JSON.stringify(data.session));
          localStorage.setItem('bird_user', JSON.stringify(data.user));
        }
        return data;
      });
    });
  },

  /**
   * Logout
   */
  logout: function() {
    localStorage.removeItem('bird_session');
    localStorage.removeItem('bird_user');
    window.location.href = 'P-LOGIN.html';
  },

  /**
   * Get current user from local storage
   * @returns {Object|null}
   */
  getUser: function() {
    try {
      return JSON.parse(localStorage.getItem('bird_user'));
    } catch (e) {
      return null;
    }
  },

  /**
   * Check if logged in
   * @returns {boolean}
   */
  isLoggedIn: function() {
    return !!localStorage.getItem('bird_session');
  }
};
