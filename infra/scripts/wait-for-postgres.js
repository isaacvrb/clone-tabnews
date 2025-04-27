const { exec } = require("node:child_process");

let intervaloBolinhas;
let indiceBolinhas = 0;
// Loading de bolinhas (mais daora)
const bolinhas = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

function renderPostgresLoadingSpinner() {
  intervaloBolinhas = setInterval(() => {
    const frame = bolinhas[indiceBolinhas++ % bolinhas.length];
    process.stdout.write(
      `\r\x1b[33m${frame} Aguardando Postgres aceitar conexões...\x1b[0m `,
    );
  }, 100);
}

function stopLoading() {
  clearInterval(intervaloBolinhas);
  process.stdout.write(
    `\r\x1b[32m✔ Postgres está pronto e aceitando conexões!\x1b[0m\n`,
  );
}

function checkPostgres() {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);

  function handleReturn(error, stdout) {
    if (stdout.search("accepting connections") === -1) {
      setTimeout(checkPostgres, 500); // Tenta de novo a cada meio segundo
      return;
    }

    stopLoading();
  }
}

renderPostgresLoadingSpinner();
checkPostgres();
