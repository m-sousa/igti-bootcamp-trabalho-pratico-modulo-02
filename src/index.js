import { promises } from "fs";
import path from "path";

const { readFile, writeFile } = promises;

init();

function init() {
  try {
    criarArquivoEstadosCidades();
  } catch (err) {
    console.log(err);
  }
}

async function criarArquivoEstadosCidades() {
  const estados = await loadFile("Estados.json");
  const cidades = await loadFile("Cidades.json");

  estados.forEach(async (estado) => {
    let data = cidades.filter((cidade) => cidade.Estado === estado.ID);
    try {
      await writeFile(`files/out/${estado.Sigla}.json`, JSON.stringify(data));
    } catch (err) {
      console.log(err);
    }
  });
}

async function loadFile(fileName) {
  try {
    const response = await readFile(path.resolve(`files/in/${fileName}`));
    const data = JSON.parse(response);
    return data;
  } catch (err) {
    console.log(err);
  }
}
