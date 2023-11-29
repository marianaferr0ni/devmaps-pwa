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
const listarCoordenadas = document.getElementById('listarCoordenadas');
const listaCoordenadas = document.getElementById('listaCoordenadas');
const map = document.getElementById('mapa');

let db;

// Abrir ou criar o banco de dados IndexedDB
const request = indexedDB.open('CoordenadasDB', 1);

request.onerror = (event) => {
  console.error('Erro ao abrir o banco de dados:', event.target.error);
};

request.onsuccess = (event) => {
  db = event.target.result;
  console.log('Banco de dados IndexedDB aberto com sucesso');
};

request.onupgradeneeded = (event) => {
  const db = event.target.result;

  // Cria um objeto de armazenamento de objetos para as coordenadas
  const objectStore = db.createObjectStore('coordenadas', { keyPath: 'id', autoIncrement: true });

  console.log('Objeto de armazenamento de objetos criado com sucesso');
};

capturarLocalizacao.addEventListener('click', () => {
  const localizacaoDigitada = inputLocalizacao.value;
  if (localizacaoDigitada) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        
        const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(localizacaoDigitada)}&z=16&output=embed`;
        map.src = mapUrl;

        // Salvar as coordenadas no IndexedDB
        const coordenadas = {
          localizacao: `${localizacaoDigitada}, ${latitude}, ${longitude}`
        };
        const transaction = db.transaction(['coordenadas'], 'readwrite');
        const objectStore = transaction.objectStore('coordenadas');

        const request = objectStore.add(coordenadas);

        request.onsuccess = () => {
          console.log('Coordenadas salvas com sucesso no IndexedDB');
        };

        request.onerror = () => {
          console.error('Erro ao salvar coordenadas no IndexedDB');
        };
      }
    )
  } else {
    alert("Por favor, digite uma localização válida.");
  }
});

listarCoordenadas.addEventListener('click', () => {
  // Listar as coordenadas do IndexedDB
  const transaction = db.transaction(['coordenadas'], 'readonly');
  const objectStore = transaction.objectStore('coordenadas');

  const request = objectStore.getAll();

  request.onsuccess = () => {
    const coordenadas = request.result;

    // Exibir as coordenadas na área do HTML
    listaCoordenadas.innerHTML = '<h3>Coordenadas Armazenadas:</h3>';
    coordenadas.forEach(coordenada => {
      // Tornar o valor da pesquisa clicável para abrir no iframe
      listaCoordenadas.innerHTML += `<p class="coordenada" data-localizacao="${coordenada.localizacao}">${coordenada.localizacao}</p>`;
    });

    // Adicionar evento de clique aos elementos de coordenada
    const elementosCoordenada = document.querySelectorAll('.coordenada');
    elementosCoordenada.forEach(elemento => {
      elemento.addEventListener('click', () => {
        const localizacaoDigitada = elemento.getAttribute('data-localizacao');
        if (localizacaoDigitada) {
          const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(localizacaoDigitada)}&z=16&output=embed`;
          map.src = mapUrl;
        }
      });
    });
  };

  request.onerror = () => {
    console.error('Erro ao obter coordenadas do IndexedDB');
  };
});