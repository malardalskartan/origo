import urlparser from '../utils/urlparser';

let getPin;
const permalinkStore = {};

function getSaveLayers(layers) {
  const saveLayers = [];
  layers.forEach((layer) => {
    const saveLayer = {};
    saveLayer.v = layer.getVisible() === true ? 1 : 0;
    saveLayer.s = layer.get('legend') === true ? 1 : 0;
    if (saveLayer.s || saveLayer.v) {
      saveLayer.name = layer.get('name');
      saveLayers.push(urlparser.stringify(saveLayer, {
        topmost: 'name'
      }));
    }
  });
  return saveLayers;
}

permalinkStore.getState = function getState(viewer) {
  const state = {};
  const view = viewer.getMap().getView();
  const layers = viewer.getLayers();
  const featureinfo = viewer.getFeatureinfo();
  getPin = featureinfo.getPin;
  state.layers = getSaveLayers(layers);
  state.center = view.getCenter().map(coord => Math.round(coord)).join();
  state.zoom = view.getZoom().toString();

  if (featureinfo.getSelection().id) {
    state.feature = featureinfo.getSelection().id;
  }

  if (getPin()) {
    state.pin = getPin().getGeometry().getCoordinates().map(coord => Math.round(coord))
      .join();
  }

  if (viewer.getMapName()) {
    state.map = viewer.getMapName().split('.')[0];
  }

  return state;
};

permalinkStore.getUrl = function getUrl(viewer) {
  const url = viewer.getUrl();
  return url;
};

export default permalinkStore;
