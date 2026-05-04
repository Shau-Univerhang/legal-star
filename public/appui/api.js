/**
 * API base URL for fetch calls. Use same origin when served from Next.js (e.g. /appui/P-HOME.html).
 * For file:// or different port, set window.API_BASE before loading pages (e.g. API_BASE = 'http://localhost:3000').
 */
// Auto-detect: if served via HTTP/HTTPS (Next.js), use same origin; otherwise (file://) use localhost
window.API_BASE =
  window.API_BASE ||
  (window.location.protocol === "file:" ? "http://localhost:3000" : "");

function apiUrl(path) {
  return (window.API_BASE + path).replace(/([^:]\/)\/+/g, "$1");
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
 * Fetch leaderboard ranked by score/time/accuracy descending.
 * @param {Object} opts - { limit, offset, sort }
 * @returns {Promise<Array>}
 */
window.fetchLeaderboard = function (opts) {
  const params = new URLSearchParams();
  if (opts && opts.limit) params.set('limit', opts.limit);
  if (opts && opts.offset) params.set('offset', opts.offset);
  if (opts && opts.sort) params.set('sort', opts.sort);
  return fetch(apiUrl('/api/leaderboard?' + params.toString())).then(function (res) {
    if (!res.ok) throw new Error('Leaderboard API error: ' + res.status);
    return res.json();
  });
};

/**
 * Fetch latest daily learning content.
 * @returns {Promise<Object|null>}
 */
window.fetchDailyLearning = function () {
  return fetch(apiUrl('/api/daily-learning')).then(function (res) {
    if (!res.ok) throw new Error('Daily Learning API error: ' + res.status);
    return res.json();
  });
};

/**
 * Fetch user statistics (learning hours, cases, rank, streak).
 * @param {string} userId
 * @returns {Promise<Object>}
 */
window.fetchUserStats = function (userId) {
  return fetch(apiUrl('/api/user/stats?userId=' + encodeURIComponent(userId))).then(function (res) {
    if (!res.ok) throw new Error('User Stats API error: ' + res.status);
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
   * Send verification code (OTP)
   * @param {string} email
   * @returns {Promise<{ message: string }>}
   */
  sendCode: function(email) {
    return fetch(apiUrl('/api/auth/send-code'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email })
    }).then(function(res) {
      return res.json().then(function(data) {
        if (!res.ok) throw new Error(data.error || 'Send code failed');
        return data;
      });
    });
  },

  /**
   * Login with verification code
   * @param {string} email
   * @param {string} code
   * @returns {Promise<{ user: Object, session: Object }>}
   */
  loginWithCode: function(email, code) {
    return fetch(apiUrl('/api/auth/verify-code'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, token: code })
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
   * Register with email, password and verification code
   * @param {string} email
   * @param {string} password
   * @param {string} [username]
   * @param {string} code
   * @returns {Promise<{ user: Object, session: Object, requireConfirmation: boolean }>}
   */
  register: function(email, password, username, code) {
    return fetch(apiUrl('/api/auth/register'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password, username: username, code: code })
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

/**
 * Send message to Coze AI and get response
 * @param {string} message - User message
 * @param {string} [conversationId] - Optional conversation ID for context
 * @returns {Promise<{message: string, conversationId: string}>}
 */
window.sendToCozeAI = function (message, conversationId) {
  const url = apiUrl('/api/ai/chat');

  const body = {
    message: message,
  };

  if (conversationId) {
    body.conversationId = conversationId;
  }

  console.log("sendToCozeAI request:", url, body);

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then(function (res) {
      console.log("sendToCozeAI response status:", res.status);
      if (!res.ok) {
        throw new Error("HTTP error! status: " + res.status);
      }
      return res.json();
    })
    .then(function (data) {
      console.log("sendToCozeAI response data:", data);

      if (data.code !== 0) {
        throw new Error(data.msg || "Coze API error: " + JSON.stringify(data));
      }

      // 获取 AI 回复 - 处理不同可能的响应格式
      let aiContent = "抱歉，我没有理解您的问题。";
      let convId = null;

      if (data.data) {
        convId = data.data.conversation_id || data.data.id;

        // 尝试从 messages 数组获取
        if (data.data.messages && data.data.messages.length > 0) {
          const aiMessage = data.data.messages.find(function (m) {
            return m.role === "assistant";
          });
          if (aiMessage && aiMessage.content) {
            aiContent = aiMessage.content;
          }
        }
        // 尝试直接获取 content
        else if (data.data.content) {
          aiContent = data.data.content;
        }
        // 尝试从 answer 获取
        else if (data.data.answer) {
          aiContent = data.data.answer;
        }
      }

      return {
        message: aiContent,
        conversationId: convId,
      };
    })
    .catch(function (err) {
      console.error("sendToCozeAI error:", err);
      throw err;
    });
};

/**
 * Stream chat with Coze AI (for real-time response)
 * @param {string} message - User message
 * @param {Function} onMessage - Callback for each message chunk
 * @param {Function} onComplete - Callback when stream completes
 * @param {string} [conversationId] - Optional conversation ID
 */
window.streamCozeAI = function (
  message,
  onMessage,
  onComplete,
  conversationId,
) {
  const url = apiUrl('/api/ai/chat');

  const body = {
    message: message,
    stream: true
  };

  if (conversationId) {
    body.conversationId = conversationId;
  }

  console.log("Sending request to Coze:", url, body);

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then(function (res) {
      console.log("Coze response status:", res.status);

      if (!res.ok) {
        throw new Error("HTTP error! status: " + res.status);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let hasReceivedMessage = false;
      let currentEvent = null;

      function read() {
        return reader
          .read()
          .then(function (result) {
            if (result.done) {
              console.log(
                "Stream completed. Received message:",
                hasReceivedMessage,
              );
              // 如果没有收到任何有效消息，才显示错误
              if (!hasReceivedMessage && onMessage) {
                 // 可能是因为 Coze 返回了错误信息，或者流意外中断
                 // 不要直接报错，因为可能只是没有 delta 消息
                 console.warn("No message content received");
              }
              if (onComplete) onComplete();
              return;
            }

            buffer += decoder.decode(result.value, { stream: true });
            
            const lines = buffer.split("\n");
            // 处理最后一行可能不完整的情况
            buffer = lines.pop();

            lines.forEach(function (line) {
              line = line.trim();
              if (!line) return; // 跳过空行

              if (line.startsWith("event:")) {
                currentEvent = line.substring(6).trim();
              } else if (line.startsWith("data:")) {
                const dataStr = line.substring(5).trim();
                
                try {
                  const data = JSON.parse(dataStr);
                  
                  // 尝试获取事件类型：优先用 SSE 的 event，其次用 data.event
                  const eventType = currentEvent || data.event;

                  // 1. 处理增量消息 (Stream Delta)
                  if (
                    (eventType === "conversation.message.delta" || !eventType) && // 如果没有 eventType，也尝试解析 content
                    data.content && 
                    data.role === "assistant" &&
                    data.type === "answer"
                  ) {
                    hasReceivedMessage = true;
                    onMessage(data.content);
                  }
                  // 兼容：有些情况下 content 在 data.data.content
                  else if (
                     data.data && 
                     data.data.content &&
                     data.data.role === "assistant"
                  ) {
                     hasReceivedMessage = true;
                     onMessage(data.data.content);
                  }
                  
                  // 2. 处理完成消息
                  else if (eventType === "conversation.message.completed") {
                    console.log("Message completed");
                    // 确保标记为已接收，避免报错
                    hasReceivedMessage = true; 
                  }
                  
                  // 3. 处理错误消息
                  else if (data.code && data.code !== 0) {
                     console.error("Coze Error:", data.msg);
                     onMessage("\n[系统错误: " + (data.msg || "未知错误") + "]");
                     hasReceivedMessage = true;
                  }

                } catch (e) {
                  console.error("Parse error:", e);
                }
              }
            });

            return read();
          })
          .catch(function (err) {
            console.error("Read error:", err);
            if (onComplete) onComplete(err);
          });
      }

      return read();
    })
    .catch(function (err) {
      console.error("Fetch error:", err);
      if (onComplete) onComplete(err);
    });
};
