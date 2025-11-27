const clearBtn = document.getElementById('clear-btn');

if (clearBtn) {
  clearBtn.addEventListener('click', function(e) {
    e.preventDefault();      // Previene eventuali comportamenti di default
    window.location.reload(); // Ricarica la pagina
  });
}