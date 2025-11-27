// JS to generate config.py from form values in pytg.html and show in textarea
document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('form.card');
  const output = document.getElementById('output');
  const errorBox = document.getElementById('error-box');
  if (!form || !output) return;

  function showError(msg) {
    if (errorBox) {
      errorBox.textContent = msg;
      errorBox.style.display = "block";
    } else {
      alert(msg);
    }
  }

  function clearError() {
    if (errorBox) {
      errorBox.textContent = "";
      errorBox.style.display = "none";
    }
  }

  function isNumeric(val) {
    return /^[0-9]+$/.test(val);
  }

  function parseList(val, numeric = false) {
    if (!val) return [];
    const list = val.split(/[,\n]+/).map(v => v.trim()).filter(Boolean);

    if (numeric) {
      for (const item of list) {
        if (!isNumeric(item)) {
          showError(`La lista contiene valori non numerici: "${item}"`);
          return null;
        }
      }
    }
    return list;
  }

  function validate() {
    clearError();

    const botToken = document.getElementById('bot_token').value.trim();
    if (!botToken) return showError("Inserisci un BOT TOKEN valido.");

    const allowedEl = document.getElementById('allowed_chat_ids');
    const allowedVal = allowedEl ? allowedEl.value : '';
    const allowedParsed = parseList(allowedVal, true);
    if (allowedParsed && allowedParsed.error) {
      return showError(allowedParsed.error, 'allowed_chat_ids');
    }

    const msgLimit = document.getElementById('msg_limit').value.trim();
    if (msgLimit && !isNumeric(msgLimit)) {
      return showError("MSG_LIMIT deve essere un numero.");
    }

    const path = document.getElementById('backup_script_path').value.trim();
    if (!path) return showError("Inserisci un percorso per BACKUP_SCRIPT_PATH.");

    const hbInterval = document.getElementById('heartbeat_interval').value.trim();
    if (hbInterval && !isNumeric(hbInterval)) {
      return showError("HEARTBEAT_INTERVAL deve essere un numero.");
    }

    const hbRetry = document.getElementById('heartbeat_max_retries').value.trim();
    if (hbRetry && !isNumeric(hbRetry)) {
      return showError("HEARTBEAT_MAX_RETRIES deve essere un numero.");
    }

    return true;
  }

  function getValue(id, type = 'input') {
    const el = document.getElementById(id);
    if (!el) return '';
    if (type === 'checkbox') return el.checked ? 'True' : 'False';
    return el.value || '';
  }

  function generateConfig() {
    const BOT_TOKEN = getValue('bot_token');
    const ALLOWED_CHAT_IDS = parseList(getValue('allowed_chat_ids', 'textarea'));
    const MSG_LIMIT = getValue('msg_limit');

    const BACKUP_SCRIPT_PATH = getValue('backup_script_path');
    const BACKUP_SCRIPT_ARGS = parseList(getValue('backup_script_args', 'textarea'));

    const NGINX_DB_UPDATE_PATH = getValue('nginx_db_update_path');

    const HEARTBEAT_ENABLED = getValue('heartbeat_enabled', 'checkbox');
    const HEARTBEAT_URL = getValue('heartbeat_url');
    const HEARTBEAT_INTERVAL = getValue('heartbeat_interval');
    const HEARTBEAT_MAX_RETRIES = getValue('heartbeat_max_retries');
    const HEARTBEAT_LOG_SUCCESS = getValue('heartbeat_log_success', 'checkbox');
    const HEARTBEAT_FAIL_ON_ERROR = getValue('heartbeat_fail_on_error', 'checkbox');

    let config = '';
    config += `BOT_TOKEN = "${BOT_TOKEN}"\n`;
    config += `ALLOWED_CHAT_IDS = [${ALLOWED_CHAT_IDS.map(id => `'${id}'`).join(', ')}]\n`;
    config += `MSG_LIMIT = ${MSG_LIMIT || 60}\n`;
    config += `BACKUP_SCRIPT_PATH = "${BACKUP_SCRIPT_PATH}"\n`;
    config += `BACKUP_SCRIPT_ARGS = [${BACKUP_SCRIPT_ARGS.map(a => `'${a}'`).join(', ')}]\n`;
    config += `BACKUP_FLAG_PATH = BACKUP_SCRIPT_PATH[0:BACKUP_SCRIPT_PATH.rfind("/")] + "/update"\n`;
    config += `NGINX_DB_UPDATE_PATH = "${NGINX_DB_UPDATE_PATH}"\n`;
    config += `HEARTBEAT_ENABLED = ${HEARTBEAT_ENABLED}\n`;
    config += `HEARTBEAT_URL = "${HEARTBEAT_URL}"\n`;
    config += `HEARTBEAT_INTERVAL = ${HEARTBEAT_INTERVAL || 50}\n`;
    config += `HEARTBEAT_MAX_RETRIES = ${HEARTBEAT_MAX_RETRIES || 3}\n`;
    config += `HEARTBEAT_LOG_SUCCESS = ${HEARTBEAT_LOG_SUCCESS}\n`;
    config += `HEARTBEAT_FAIL_ON_ERROR = ${HEARTBEAT_FAIL_ON_ERROR}\n`;

    return config;
  }

  form.addEventListener('submit', function(e) {
    const action = e.submitter && e.submitter.value;
    if (action === 'generate') {
      e.preventDefault();
      if (validate()) output.value = generateConfig();
    }
  });
});
