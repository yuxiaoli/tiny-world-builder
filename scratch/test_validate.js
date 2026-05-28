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
    const okTerrain = new Set(['grass','path','dirt','water','stone','lava','sand','snow']);
    const okKind = new Set([null,'house','tree','fence','rock','bridge','crop','corn','wheat','pumpkin','carrot','sunflower','tuft','flower','bush','cow','sheep','chimney','ripple','shrub','stone','pebble','bridge-rail','voxel-build']);
    const okBT = new Set([null,'cottage','manor','tower','turret','skyscraper']);
    const okFenceSide = new Set([null,'n','s','e','w','center-x','center-z']);
    const seen = new Set();
    for (let i = 0; i < data.cells.length; i++) {
      const c = data.cells[i];
      let x, z, terrain, kind, floors, buildingType, terrainFloors, fenceSide, appearance;
      if (Array.isArray(c)) {
        if (c.length < 4) return 'cells[' + i + '] tuple too short';
        [x, z, terrain, kind, floors, buildingType, terrainFloors, fenceSide, , , appearance] = c;
      } else if (c && typeof c === 'object') {
        ({ x, z, terrain, kind, floors, buildingType, terrainFloors, fenceSide, appearance } = c);
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
    }
    return null;
  }

const fs = require('fs');
const data = JSON.parse(fs.readFileSync('d:/workspace/html/tiny-world-builder/data/world.snowy_village.json', 'utf8'));
console.log(validateWorld(data));
