import { promises } from "fs";
import path from "path";

const { readFile, writeFile } = promises;

init();

async function init() {
  try {
    await createStateWithCitiesFiles();
    await getNumberOfCitiesPerState("AC");
    await printTopFiveStatesWithMoreCities();
    await printTopFiveStatesWithLessCities();
    await printCityWithBiggerNameOfEachState();
    await printCityWithSmallerNameOfEachState();
    await printCityWithBiggerNameOfAllStates();
    await printCityWithSmallerNameOfAllStates();
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

async function printTopFiveStatesWithMoreCities() {
  const states = await getStatesOrderedByNumberOfCities();
  const topFiveStates = states
    .reverse()
    .slice(0, 5)
    .map((state) => `${state.uf} - ${state.numberOfCities}`);
  console.log(topFiveStates);
}

async function printTopFiveStatesWithLessCities() {
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

async function printCityWithBiggerNameOfEachState() {
  const states = await loadFile("Estados.json");
  let citiesWithBiggerNameOfEachState = [];

  for (const state of states) {
    let cities = await loadFile(`${state.Sigla}.json`, true);
    let serializedCities = cities.map((city) => {
      return {
        name: city.Nome,
        sizeOfCityName: city.Nome.length,
      };
    });

    serializedCities = serializedCities.sort((a, b) => {
      if (a.sizeOfCityName > b.sizeOfCityName) return -1;
      if (a.sizeOfCityName < b.sizeOfCityName) return 1;

      if (a.name > b.name) return 1;
      if (a.name < b.name) return -1;
    });

    citiesWithBiggerNameOfEachState = [
      ...citiesWithBiggerNameOfEachState,
      `${serializedCities[0].name} - ${state.Sigla}`,
    ];
  }

  console.log(citiesWithBiggerNameOfEachState);
}

async function printCityWithSmallerNameOfEachState() {
  const states = await loadFile("Estados.json");
  let citiesWithSmallerNameOfEachState = [];

  for (const state of states) {
    let cities = await loadFile(`${state.Sigla}.json`, true);
    let serializedCities = cities.map((city) => {
      return {
        name: city.Nome,
        sizeOfCityName: city.Nome.length,
      };
    });

    serializedCities = serializedCities.sort((a, b) => {
      if (a.sizeOfCityName > b.sizeOfCityName) return 1;
      if (a.sizeOfCityName < b.sizeOfCityName) return -1;

      if (a.name > b.name) return 1;
      if (a.name < b.name) return -1;
    });

    citiesWithSmallerNameOfEachState = [
      ...citiesWithSmallerNameOfEachState,
      `${serializedCities[0].name} - ${state.Sigla}`,
    ];
  }
  console.log(citiesWithSmallerNameOfEachState);
}

async function printCityWithBiggerNameOfAllStates() {
  const states = await loadFile("Estados.json");
  let serializedCities = [];

  for (const state of states) {
    let cities = await loadFile(`${state.Sigla}.json`, true);
    cities.map((city) => {
      serializedCities = [
        ...serializedCities,
        {
          name: city.Nome,
          sizeOfCityName: city.Nome.length,
          uf: state.Sigla,
        },
      ];
    });
  }

  serializedCities = serializedCities.sort((a, b) => {
    if (a.sizeOfCityName > b.sizeOfCityName) return -1;
    if (a.sizeOfCityName < b.sizeOfCityName) return 1;

    if (a.name > b.name) return 1;
    if (a.name < b.name) return -1;
  });

  let cityWithBiggerNameOfAllStates = serializedCities[0];

  console.log(
    `${cityWithBiggerNameOfAllStates.name} - ${cityWithBiggerNameOfAllStates.uf}`
  );
}

async function printCityWithSmallerNameOfAllStates() {
  const states = await loadFile("Estados.json");
  let serializedCities = [];

  for (const state of states) {
    let cities = await loadFile(`${state.Sigla}.json`, true);
    cities.map((city) => {
      serializedCities = [
        ...serializedCities,
        {
          name: city.Nome,
          sizeOfCityName: city.Nome.length,
          uf: state.Sigla,
        },
      ];
    });
  }

  serializedCities = serializedCities.sort((a, b) => {
    if (a.sizeOfCityName > b.sizeOfCityName) return 1;
    if (a.sizeOfCityName < b.sizeOfCityName) return -1;

    if (a.name > b.name) return 1;
    if (a.name < b.name) return -1;
  });

  let cityWithSmallerNameOfAllStates = serializedCities[0];

  console.log(
    `${cityWithSmallerNameOfAllStates.name} - ${cityWithSmallerNameOfAllStates.uf}`
  );
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
