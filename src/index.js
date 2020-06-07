import { promises } from "fs";
import path from "path";

const { readFile, writeFile } = promises;

init();

function init() {
  try {
    createStateWithCitiesFiles();
    getNumberOfCitiesPerState("AC");
  } catch (error) {
    console.log(error);
  }
}

async function createStateWithCitiesFiles() {
  const estados = await loadFile("Estados.json");
  const cidades = await loadFile("Cidades.json");

  estados.forEach(async (estado) => {
    let data = cidades.filter((cidade) => cidade.Estado === estado.ID);
    try {
      await writeFile(`files/out/${estado.Sigla}.json`, JSON.stringify(data));
    } catch (error) {
      console.log(error);
    }
  });
}

async function getNumberOfCitiesPerState(uf) {
  try {
    const cities = await loadFile(`${uf}.json`, true);
    console.log(cities.length);
  } catch (error) {
    console.log(error);
  }
}

async function loadFile(fileName, isOutputFile = false) {
  try {
    const response = await readFile(
      path.resolve(`files/${isOutputFile ? "out" : "in"}/${fileName}`)
    );
    const data = JSON.parse(response);
    return data;
  } catch (error) {
    console.log(error);
  }
}
