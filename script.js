// Crie uma instância do PouchDB conectada ao CouchDB local
const db = new PouchDB('test');

// Capture o formulário
const form = document.getElementById('myForm');

// Evento de envio do formulário
form.addEventListener('submit', function(event) {
  event.preventDefault(); // Impede o envio padrão do formulário

  // Captura os valores dos campos
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  // Cria um documento com os dados
  const formData = {
    _id: new Date().toISOString(), // ID único baseado na data/hora atual
    name: name,
    email: email,
    message: message
  };

  // Verifica se há conexão com a internet
  if (navigator.onLine) {
    // Salva o documento no CouchDB
    db.put(formData)
      .then(response => {
        console.log('Documento salvo no CouchDB:', response);
        form.reset(); // Limpa o formulário
      })
      .catch(error => {
        console.error('Erro ao salvar o documento no CouchDB:', error);
      });
  } else {
    // Salva o documento localmente no PouchDB
    db.put(formData)
      .then(response => {
        console.log('Documento salvo localmente no PouchDB:', response);
        form.reset(); // Limpa o formulário
      })
      .catch(error => {
        console.error('Erro ao salvar o documento localmente no PouchDB:', error);
      });
  }
});

// Função para sincronizar dados
function syncData() {
  // Verifica se há conexão com a internet
  if (navigator.onLine) {
    // Sincroniza os dados localmente armazenados no PouchDB com o CouchDB
    db.replicate.to('http://localhost:5984/my_database')
      .then(response => {
        console.log('Dados sincronizados com o CouchDB:', response);
      })
      .catch(error => {
        console.error('Erro ao sincronizar os dados com o CouchDB:', error);
      });
  }
}

// Verifica a conexão com a internet ao carregar a página
window.addEventListener('load', function() {
  if (navigator.onLine) {
    console.log('Conectado à internet');
  } else {
    console.log('Desconectado da internet');
  }
});

// Verifica a conexão com a internet quando o estado online/offline é alterado
window.addEventListener('online', function() {
  console.log('Conectado à internet');
  syncData(); // Sincroniza os dados quando a conexão é reestabelecida
});

window.addEventListener('offline', function() {
  console.log('Desconectado da internet');
});
