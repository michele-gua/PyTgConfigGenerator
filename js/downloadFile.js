const downloadBtn = document.querySelector('button[name="action"][value="download"]');
const output = document.getElementById('output');

if (downloadBtn) {
  downloadBtn.addEventListener('click', function(e) {
    e.preventDefault();

    const content = output.value;

    const blob = new Blob([content], { type: 'text/plain' });

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'config.py';
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}
