// JS to generate config.py from form values in api.html and show in textarea
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('config-form');
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
          showError(`La lista contiene un valore non numerico: "${item}"`);
          return null;
        }
      }
    }
    return list;
  }

  function validate() {
    clearError();

    const timeout = document.getElementById('token_timeout').value.trim();
    if (timeout && !isNumeric(timeout)) {
      return showError("TOKEN_TIMEOUT deve essere un numero.");
    }

    const authSecret = document.getElementById('auth_secret').value.trim();
    if (!authSecret) return showError("AUTH_SECRET non può essere vuoto.");

    const username = document.getElementById('auth_username').value.trim();
    if (!username) return showError("AUTH_USERNAME non può essere vuoto.");

    const hash = document.getElementById('auth_password_hash').value.trim();
    if (!hash) return showError("AUTH_PASSWORD_HASH non può essere vuoto.");

    const path = document.getElementById('backup_script_path').value.trim();
    if (!path) return showError("BACKUP_SCRIPT_PATH non può essere vuoto.");

    return true;
  }

  function getValue(id, type = 'input') {
    const el = document.getElementById(id);
    if (!el) return '';
    if (type === 'checkbox') return el.checked ? 'True' : 'False';
    return el.value || '';
  }

  function generateConfig() {
    const DEBUG_LOGGING = getValue('debug_logging', 'checkbox');
    const PROTECTED_CONTAINERS = parseList(getValue('protected_containers', 'textarea'));

    const TOKEN_TIMEOUT = getValue('token_timeout');
    const AUTH_SECRET = getValue('auth_secret');
    const AUTH_USERNAME = getValue('auth_username');
    const AUTH_PASSWORD_HASH = getValue('auth_password_hash');

    const BACKUP_SCRIPT_PATH = getValue('backup_script_path');
    const BACKUP_SCRIPT_ARGS = parseList(getValue('backup_script_args', 'textarea'));

    const NGINX_DB_UPDATE_PATH = getValue('nginx_db_update_path');

    let config = '';
    config += `DEBUG_LOGGING = ${DEBUG_LOGGING}\n`;
    config += `PROTECTED_CONTAINERS = [${PROTECTED_CONTAINERS.map(id => `'${id}'`).join(', ')}]\n`;
    config += `TOKEN_TIMEOUT = ${TOKEN_TIMEOUT || 30}\n`;
    config += `AUTH_SECRET = "${AUTH_SECRET}"\n`;
    config += `AUTH_USERNAME = "${AUTH_USERNAME}"\n`;
    config += `AUTH_PASSWORD_HASH = "${AUTH_PASSWORD_HASH}"\n`;
    config += `BACKUP_SCRIPT_PATH = "${BACKUP_SCRIPT_PATH}"\n`;
    config += `BACKUP_SCRIPT_ARGS = [${BACKUP_SCRIPT_ARGS.map(a => `'${a}'`).join(', ')}]\n`;
    config += `BACKUP_FLAG_PATH = BACKUP_SCRIPT_PATH[0:BACKUP_SCRIPT_PATH.rfind("/")] + "/update"\n`;
    config += `NGINX_DB_UPDATE_PATH = "${NGINX_DB_UPDATE_PATH}"\n`;

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
