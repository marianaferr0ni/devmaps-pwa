
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      let reg;
      reg = await navigator.serviceWorker.register('./sw.js', { type: "module" });
      console.log('Service worker registrada!', reg);
    } catch (err) {
      console.log(' Service worker registro falhou:', err);
    }
  });
}

const capturarLocalizacao = document.getElementById('pesquisarLocalizacao');
const inputLocalizacao = document.getElementById('inputLocalizacao');
const map = document.getElementById('mapa');

capturarLocalizacao.addEventListener('click', () => {
  const localizacaoDigitada = inputLocalizacao.value;
  if (localizacaoDigitada) {
    // Construir a URL do Google Maps com base na localização digitada
    const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(localizacaoDigitada)}&z=16&output=embed`;
    
    // Exibir o mapa no iframe
    map.src = mapUrl;
  } else {
    alert("Por favor, digite uma localização válida.");
  }
});