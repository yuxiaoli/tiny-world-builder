const fs = require('fs');

const hash = 'world=%7B%22v%22%3A4%2C%22gridSize%22%3A16%2C%22cameraMode%22%3A%22ortho%22%2C%22toolId%22%3A%22grass%22%2C%22cells%22%3A%5B%7B%22x%22%3A1%2C%22z%22%3A1%2C%22terrain%22%3A%22grass%22%2C%22kind%22%3A%22house%22%2C%22floors%22%3A6%2C%22terrainFloors%22%3A1%2C%22buildingType%22%3A%22cottage%22%2C%22fenceSide%22%3Anull%7D%2C%7B%22x%22%3A2%2C%22z%22%3A1%2C%22terrain%22%3A%22path%22%2C%22kind%22%3Anull%2C%22floors%22%3A1%2C%22terrainFloors%22%3A1%2C%22buildingType%22%3Anull%2C%22fenceSide%22%3Anull%7D%2C%7B%22x%22%3A10%2C%22z%22%3A1%2C%22terrain%22%3A%22water%22%2C%22kind%22%3A%22bridge%22%2C%22floors%22%3A1%2C%22terrainFloors%22%3A1%2C%22buildingType%22%3Anull%2C%22fenceSide%22%3Anull%7D%5D%7D';

const params = new URLSearchParams('');
if (hash && hash.includes('=')) {
  const hashParams = new URLSearchParams(hash);
  hashParams.forEach((value, key) => { if (!params.has(key)) params.set(key, value); });
}

const worldParam = params.get('world');
console.log("Raw param:", worldParam);
try {
  console.log("Parsed:", JSON.parse(worldParam));
} catch (e) {
  console.error("Parse error:", e);
}