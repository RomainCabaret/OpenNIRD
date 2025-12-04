import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as THREE from "three";
import { GLOBE_RADIUS } from "./constant";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function latLonToVector3(lat: number, lon: number, radius = GLOBE_RADIUS) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}
