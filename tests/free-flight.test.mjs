import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OrbitalScene } from '../src/scene.js';

test('Q y Z giran el horizonte sin desplazar la cámara ni cambiar el objetivo', () => {
  const camera = new THREE.PerspectiveCamera();
  camera.position.set(0, 0, 10);
  const controls = new OrbitControls(camera);
  controls.enablePan = true;
  controls.update();
  const owner = Object.create(OrbitalScene.prototype);
  owner.camera = camera;
  owner.controls = controls;
  owner.navigationKeys = new Set(['KeyQ']);
  const position = camera.position.clone();
  const target = controls.target.clone();
  const forward = camera.getWorldDirection(new THREE.Vector3());

  owner.updateNavigation(0.1);
  assert.ok(camera.up.x > 0);
  assert.ok(camera.position.distanceTo(position) < 1e-10);
  assert.ok(controls.target.distanceTo(target) < 1e-10);
  assert.ok(camera.getWorldDirection(new THREE.Vector3()).distanceTo(forward) < 1e-10);

  owner.navigationKeys = new Set(['KeyZ']);
  owner.updateNavigation(0.1);
  assert.ok(camera.up.distanceTo(new THREE.Vector3(0, 1, 0)) < 1e-10);
});

test('al cambiar el origen de vista, los puntos y la órbita mantienen coordenadas absolutas', () => {
  const owner = Object.create(OrbitalScene.prototype);
  const oldOrigin = new THREE.Vector3(200, 0, 0);
  const newOrigin = new THREE.Vector3(340, 50, 0);
  const point = new THREE.Points();
  const debris = new THREE.Points();
  const orbit = new THREE.Line();
  for (const node of [point, debris, orbit]) node.userData.origin = oldOrigin.clone();
  owner.activePoints = point;
  owner.debrisPoints = debris;
  owner.selectedOrbit = orbit;
  owner.rebaseOrbitalMarkers(newOrigin);

  for (const node of [point, debris, orbit]) {
    assert.ok(node.position.clone().add(newOrigin).distanceTo(oldOrigin) < 1e-10);
  }
});
