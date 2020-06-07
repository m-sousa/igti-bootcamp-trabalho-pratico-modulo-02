import { promises } from "fs";
import path from "path";

const { readFile, writeFile } = promises;

init();

async function init() {
  try {
    await createStateWithCitiesFiles();
    await getNumberOfCitiesPerState("AC");
    await printTopFiveStatesMoreCities();
    await printTopFiveStatesLessCities();
  } catch (error) {
    console.log(error);
  }
}

async function createStateWithCitiesFiles() {
  const states = await loadFile("Estados.json");
  const cities = await loadFile("Cidades.json");

  states.forEach(async (state) => {
    let data = cities.filter((city) => city.Estado === state.ID);
    try {
      await writeFile(`files/out/${state.Sigla}.json`, JSON.stringify(data));
    } catch (error) {
      console.log(error);
    }
  });
}

async function getNumberOfCitiesPerState(uf) {
  try {
    const cities = await loadFile(`${uf}.json`, true);
    return cities.length;
  } catch (error) {
    console.log(error);
  }
}

async function printTopFiveStatesMoreCities() {
  const states = await getStatesOrderedByNumberOfCities();
  const topFiveStates = states
    .reverse()
    .slice(0, 5)
    .map((state) => `${state.uf} - ${state.numberOfCities}`);
  console.log(topFiveStates);
}

async function printTopFiveStatesLessCities() {
  const states = await getStatesOrderedByNumberOfCities();
  const topFiveStates = states
    .slice(0, 5)
    .map((state) => `${state.uf} - ${state.numberOfCities}`);
  console.log(topFiveStates);
}

async function getStatesOrderedByNumberOfCities() {
  const states = await loadFile("Estados.json");
  let serializedStates = [];

  for (const state of states) {
    let actualStateNumberOfCities = await getNumberOfCitiesPerState(
      state.Sigla
    );

    serializedStates = [
      ...serializedStates,
      { uf: state.Sigla, numberOfCities: actualStateNumberOfCities },
    ];
  }

  serializedStates = serializedStates.sort(
    (a, b) => a.numberOfCities - b.numberOfCities
  );

  return serializedStates;
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
