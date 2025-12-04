import { PerspectiveCamera } from "@react-three/drei";

export function FixedCamera() {
  return <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={50} />;
}
