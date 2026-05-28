const HOME_GRID_MAX = 8;
const GRID = 8;
const STORAGE_VERSION = 4;

function normalizeAppearance(app) { return true; }

function validateWorld(data) {
    if (!data || typeof data !== 'object') return 'not an object';
    // Coerce v: accept missing (assume current), strings ('2'), and numbers.
    // We only need to reject obviously incompatible versions.
    if (data.v === undefined || data.v === null) data.v = STORAGE_VERSION;
    if (typeof data.v === 'string') data.v = parseInt(data.v, 10);
    if (data.v !== 1 && data.v !== 2 && data.v !== 3 && data.v !== 4) return 'unsupported v: ' + data.v;
    if (!Array.isArray(data.cells)) return 'cells must be an array';
    if (data.cameraMode === 'soft') data.cameraMode = 'perspective';
    const okCameraMode = new Set(['ortho','topdown','perspective','fp']);
    if (data.cameraMode !== undefined && !okCameraMode.has(data.cameraMode)) return 'cameraMode invalid: ' + data.cameraMode;
    const isValidGridSize = (s) => [8, 12, 16, 20, 32, 48].includes(s);
    if (data.gridSize !== undefined && !isValidGridSize(data.gridSize)) return 'gridSize invalid: ' + data.gridSize;
    
    // Test other root properties
    if (data.toolId !== undefined && typeof data.toolId !== 'string') return 'toolId must be a string';
    if (data.useLandscapeEngine !== undefined && typeof data.useLandscapeEngine !== 'boolean') return 'useLandscapeEngine must be a boolean';
    if (data.landscapeMeshMode !== undefined && typeof data.landscapeMeshMode !== 'boolean') return 'landscapeMeshMode must be a boolean';
    if (data.landscapeMeshBiome !== undefined && !['grassland', 'desert', 'snow'].includes(data.landscapeMeshBiome)) return 'landscapeMeshBiome invalid';
    if (data.landscapeMeshStyle !== undefined && !['lowpoly', 'realistic'].includes(data.landscapeMeshStyle)) return 'landscapeMeshStyle invalid';
    if (data.landscapeEngineSeed !== undefined && typeof data.landscapeEngineSeed !== 'number' && typeof data.landscapeEngineSeed !== 'string' && data.landscapeEngineSeed !== null) return 'landscapeEngineSeed invalid';
    if (data.landscapeEngineBiome !== undefined && !['grassland', 'desert', 'snow', null].includes(data.landscapeEngineBiome)) return 'landscapeEngineBiome invalid';
    
    if (data.planetLandscape !== undefined && data.planetLandscape !== null) {
      if (typeof data.planetLandscape !== 'object') return 'planetLandscape invalid';
      if (data.planetLandscape.enabled !== undefined && typeof data.planetLandscape.enabled !== 'boolean') return 'planetLandscape.enabled invalid';
      if (data.planetLandscape.biome !== undefined && !['grassland', 'desert', 'snow'].includes(data.planetLandscape.biome)) return 'planetLandscape.biome invalid';
      if (data.planetLandscape.styleMode !== undefined && !['lowpoly', 'realistic'].includes(data.planetLandscape.styleMode)) return 'planetLandscape.styleMode invalid';
      if (data.planetLandscape.drop !== undefined && (typeof data.planetLandscape.drop !== 'number' || data.planetLandscape.drop < 20 || data.planetLandscape.drop > 300)) return 'planetLandscape.drop invalid';
    }

    const okTerrain = new Set(['grass','path','dirt','water','stone','lava','sand','snow']);
    const okKind = new Set([null,'house','tree','fence','rock','bridge','crop','corn','wheat','pumpkin','carrot','sunflower','tuft','flower','bush','cow','sheep','chimney','ripple','shrub','stone','pebble','bridge-rail','voxel-build', 'model-stamp']);
    const okBT = new Set([null,'cottage','manor','tower','turret','skyscraper']);
    const okFenceSide = new Set([null,'n','s','e','w','center-x','center-z']);
    const seen = new Set();
    for (let i = 0; i < data.cells.length; i++) {
      const c = data.cells[i];
      let x, z, terrain, kind, floors, buildingType, terrainFloors, fenceSide, appearance, extras, transform;
      if (Array.isArray(c)) {
        if (c.length < 4) return 'cells[' + i + '] tuple too short';
        [x, z, terrain, kind, floors, buildingType, terrainFloors, fenceSide, extras, transform, appearance] = c;
      } else if (c && typeof c === 'object') {
        ({ x, z, terrain, kind, floors, buildingType, terrainFloors, fenceSide, extras, transform, appearance } = c);
      } else {
        return 'cells[' + i + '] not object';
      }
      const coordLimit = Math.max(HOME_GRID_MAX * 2, (data.gridSize || GRID) * 2, 64);
      if (!Number.isInteger(x) || x < -coordLimit || x > coordLimit) return 'cells[' + i + '].x out of range';
      if (!Number.isInteger(z) || z < -coordLimit || z > coordLimit) return 'cells[' + i + '].z out of range';
      const key = x + ',' + z;
      if (seen.has(key)) return 'duplicate cell at ' + key;
      seen.add(key);
      if (!okTerrain.has(terrain)) return 'cells[' + i + '].terrain invalid: ' + terrain;
      const k = (kind === undefined ? null : kind);
      if (!okKind.has(k)) return 'cells[' + i + '].kind invalid: ' + kind;
      const f = floors === undefined ? 1 : floors;
      if (!Number.isInteger(f) || f < 1 || f > 8) return 'cells[' + i + '].floors out of range';
      const tf = terrainFloors === undefined ? 1 : terrainFloors;
      if (!Number.isInteger(tf) || tf < 1 || tf > 8) return 'cells[' + i + '].terrainFloors out of range';
      const bt = k === 'house' ? (buildingType === undefined ? null : buildingType) : null;
      if (!okBT.has(bt)) return 'cells[' + i + '].buildingType invalid: ' + buildingType;
      const fs = fenceSide === undefined ? null : fenceSide;
      if (!okFenceSide.has(fs)) return 'cells[' + i + '].fenceSide invalid: ' + fenceSide;
      if (fs && k !== 'fence') return 'cells[' + i + '].fenceSide only allowed on fence';
      if (appearance !== undefined && appearance !== null && !normalizeAppearance(appearance)) return 'cells[' + i + '].appearance invalid';
      
      // Test extras
      if (extras !== undefined && extras !== null) {
        if (!Array.isArray(extras)) return 'cells[' + i + '].extras must be array';
        for (const extra of extras) {
            const extraKind = extra.kind || extra.k;
            if (!['fence', 'tuft'].includes(extraKind)) return 'cells[' + i + '].extras item kind invalid';
        }
      }
      
      // Test transform
      if (transform !== undefined && transform !== null) {
          if (Array.isArray(transform)) {
              if (transform.length < 3 || transform.length > 4) return 'cells[' + i + '].transform array invalid length';
          } else if (typeof transform === 'object') {
              if (transform.rotationY !== undefined && typeof transform.rotationY !== 'number') return 'cells[' + i + '].transform.rotationY invalid';
              if (transform.offsetX !== undefined && typeof transform.offsetX !== 'number') return 'cells[' + i + '].transform.offsetX invalid';
          } else {
              return 'cells[' + i + '].transform invalid type';
          }
      }
    }
    return null;
  }

const fs = require('fs');
const data = JSON.parse(fs.readFileSync('d:/workspace/html/tiny-world-builder/data/world.test.json', 'utf8'));
console.log('world.test.json validation:', validateWorld(data));

const exampleData = JSON.parse(fs.readFileSync('d:/workspace/html/tiny-world-builder/data/world.example.json', 'utf8'));
console.log('world.example.json validation:', validateWorld(exampleData));

const snowyData = JSON.parse(fs.readFileSync('d:/workspace/html/tiny-world-builder/data/world.snowy_village.json', 'utf8'));
console.log('world.snowy_village.json validation:', validateWorld(snowyData));
