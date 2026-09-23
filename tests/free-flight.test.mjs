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
  assert.ok(new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion).x > 0);
  assert.ok(camera.position.distanceTo(position) < 1e-10);
  assert.ok(controls.target.distanceTo(target) < 1e-10);
  assert.ok(camera.getWorldDirection(new THREE.Vector3()).distanceTo(forward) < 1e-10);

  owner.navigationKeys = new Set(['KeyZ']);
  owner.updateNavigation(0.1);
  assert.ok(new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion).distanceTo(new THREE.Vector3(0, 1, 0)) < 1e-10);
});

test('vista FPS: mirada sin tope, avance, lateral, ascensor y aceleración', () => {
  const owner = Object.create(OrbitalScene.prototype);
  owner.camera = new THREE.PerspectiveCamera();
  owner.camera.position.set(0, 0, 100);
  owner.camera.lookAt(0, 0, 0);
  owner.controls = { enablePan: true };
  owner.focusOrigin = new THREE.Vector3();
  owner.focus = { item: { id: 'free-flight' } };
  owner.updateWorld = () => owner.focusOrigin.fromArray(owner.focus.item.position);

  owner.lookFreeFlight(0, -250);
  const forward = owner.camera.getWorldDirection(new THREE.Vector3());
  assert.ok(forward.y > 0.6);
  owner.navigationKeys = new Set(['KeyW']);
  owner.updateNavigation(0.1);
  const walked = owner.focusOrigin.clone();
  assert.ok(walked.clone().normalize().distanceTo(forward) < 1e-10);

  owner.navigationKeys = new Set(['KeyS']);
  owner.updateNavigation(0.1);
  assert.ok(owner.focusOrigin.length() < 1e-10);

  owner.navigationKeys = new Set(['KeyD']);
  owner.updateNavigation(0.1);
  assert.ok(Math.abs(owner.focusOrigin.dot(forward)) < 1e-10);
  owner.navigationKeys = new Set(['KeyA']);
  owner.updateNavigation(0.1);
  assert.ok(owner.focusOrigin.length() < 1e-10);

  owner.navigationKeys = new Set(['KeyE']);
  owner.updateNavigation(0.1);
  assert.ok(owner.focusOrigin.y > 0 && Math.abs(owner.focusOrigin.x) < 1e-10);
  owner.navigationKeys = new Set(['KeyC']);
  owner.updateNavigation(0.1);
  assert.ok(owner.focusOrigin.length() < 1e-10);

  owner.navigationKeys = new Set(['KeyW', 'ShiftLeft']);
  owner.updateNavigation(0.1);
  assert.ok(Math.abs(owner.focusOrigin.length() / walked.length() - 2 / 0.3) < 1e-10);

  owner.lookFreeFlight(0, -450);
  assert.ok(owner.camera.getWorldDirection(new THREE.Vector3()).z > 0);
});

test('el Sol se encuadra fuera de la esfera aunque su centro coincida con el origen', () => {
  const owner = Object.create(OrbitalScene.prototype);
  owner.camera = new THREE.PerspectiveCamera();
  owner.camera.position.set(0, 0, 0);
  owner.controls = new OrbitControls(owner.camera);
  owner.controls.enabled = false;
  owner.focus = { type: 'body', id: 'sun' };
  owner.bodyNodes = new Map([['sun', { extentKm: 696340, definition: { radiusKm: 696340 } }]]);
  owner.rawPositions = new Map([['sun', new THREE.Vector3()]]);
  owner.resetCamera();
  assert.ok(Math.abs(owner.camera.position.length() - 696340 * 5.5) < 1e-6);
  assert.ok(owner.camera.position.length() > owner.controls.minDistance);
  assert.equal(owner.controls.enabled, true);
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
