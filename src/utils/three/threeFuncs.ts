import React from 'react';
import SceneStore from '../../stores/sceneStore';
import {ThreeEvent} from '@react-three/fiber';
import * as THREE from 'three';

export const handleMouseMove = (
  e: ThreeEvent<PointerEvent>,
  sceneStore: SceneStore
) => {
  console.log(e);
  console.log(e.faceIndex);
  // const target = event.target as HTMLElement;
  // const rect = target.getBoundingClientRect();
  //
  // // canvas要素上のXY座標
  // const x = event.clientX - rect.left;
  // const y = event.clientY - rect.top;
  //
  // // canvas要素の幅・高さ
  // const w = target.offsetWidth;
  // const h = target.offsetHeight;
  //
  // // -1〜+1の範囲で現在のマウス座標を登録する
  // sceneStore.setMouseVector((x / w) * 2 - 1, -(y / h) * 2 + 1);
  // console.log(sceneStore.getMouseVector());
};

export const getRollOverMesh = () => {
  const rollOverGeo = new THREE.PlaneGeometry(1, 1);
  rollOverGeo.rotateX(-Math.PI / 2);
  // const rollOverGeo = new THREE.BoxGeometry(1, 1, 1);
  const rollOverMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    opacity: 0.5,
    transparent: true
  });
  const rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);
  return rollOverMesh;
};

export const getPlane = () => {
  const geometry = new THREE.PlaneGeometry(1000, 1000);
  geometry.rotateX(-Math.PI / 2);
  const plane = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({visible: false})
  );
  plane.name = 'mainPlane';
  return plane;
};

export const getPlacingPlaneMaterials = () => {
  const geometry = new THREE.PlaneGeometry(1, 1);
  geometry.rotateX(-Math.PI / 2);
  const material = new THREE.MeshPhongMaterial({
    color: new THREE.Color('#ff0080'),
    side: THREE.DoubleSide
  });
  return {geometry, material};
};

export const getMouseVector = (event: PointerEvent) => {
  const target = event.target as HTMLElement;
  const rect = target.getBoundingClientRect();

  // canvas要素上のXY座標
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // canvas要素の幅・高さ
  const w = target.offsetWidth;
  const h = target.offsetHeight;

  // -1〜+1の範囲で現在のマウス座標を登録する
  return new THREE.Vector2((x / w) * 2 - 1, -(y / h) * 2 + 1);
};
