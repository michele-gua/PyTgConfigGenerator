const copyBtn = document.querySelector('button[title~="Copy"]');
const output = document.getElementById('output');

if (copyBtn) {
	copyBtn.disabled = false;
	copyBtn.addEventListener('click', function(e) {
		e.preventDefault();
		if (!output) return;
		const content = output.value;
		if (navigator.clipboard) {
			navigator.clipboard.writeText(content)
				.then(() => {
					copyBtn.textContent = 'Copied!';
					setTimeout(() => { copyBtn.textContent = 'Copy to clipboard'; }, 1200);
				})
				.catch(() => {
					copyBtn.textContent = 'Error';
					setTimeout(() => { copyBtn.textContent = 'Copy to clipboard'; }, 1200);
				});
		} else {
			// Fallback for older browsers
			output.select();
			document.execCommand('copy');
			copyBtn.textContent = 'Copied!';
			setTimeout(() => { copyBtn.textContent = 'Copy to clipboard'; }, 1200);
		}
	});
}
