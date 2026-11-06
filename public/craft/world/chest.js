// A Minecraft-style chest placed in the world.
// Supports smooth lid opening/closing animations and collision obstacle registration.
import * as THREE from 'three';
import * as L from '@world/layout.js';

export function createChest({ stage, world, at = L.CHEST }) {
  if (!at) return { root: null, open() {}, close() {}, isOpen: () => false };

  const root = new THREE.Group();
  root.name = 'diary-chest';

  const woodColor = 0x8a5229;
  const ironColor = 0x222224;
  const goldColor = 0xf5b838;
  const innerColor = 0x3d2314;

  const matWood = new THREE.MeshLambertMaterial({ color: woodColor });
  const matIron = new THREE.MeshLambertMaterial({ color: ironColor });
  const matGold = new THREE.MeshLambertMaterial({ color: goldColor });
  const matInner = new THREE.MeshLambertMaterial({ color: innerColor });

  const box = (parent, w, h, d, mat, x, y, z) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };

  // Dimensions: 0.7m width, 0.44m base height, 0.7m depth
  const W = 0.7, H_BASE = 0.44, D = 0.7;

  // 1. Chest Body
  const body = new THREE.Group();
  // Main wood base
  box(body, W, H_BASE, D, matWood, 0, H_BASE / 2, 0);
  // Interior lining (visible when opened)
  box(body, W - 0.08, 0.02, D - 0.08, matInner, 0, H_BASE - 0.01, 0);

  // Black iron banding around body corners and edges
  const rimThick = 0.025;
  box(body, W + 0.01, rimThick, D + 0.01, matIron, 0, rimThick / 2, 0); // bottom band
  box(body, W + 0.01, rimThick, D + 0.01, matIron, 0, H_BASE - rimThick / 2, 0); // top rim of base

  root.add(body);

  // 2. Chest Lid (hinged at the back top edge: z = -D/2, y = H_BASE)
  const lidPivot = new THREE.Group();
  lidPivot.position.set(0, H_BASE, -D / 2);

  const H_LID = 0.16;
  const lidMeshGroup = new THREE.Group();
  // Lid sits forward from pivot: z center is D/2, y center is H_LID/2
  box(lidMeshGroup, W, H_LID, D, matWood, 0, H_LID / 2, D / 2);
  // Inner hollow illusion
  box(lidMeshGroup, W - 0.08, 0.02, D - 0.08, matInner, 0, 0.01, D / 2);
  // Iron banding along lid
  box(lidMeshGroup, W + 0.01, rimThick, D + 0.01, matIron, 0, rimThick / 2, D / 2);
  box(lidMeshGroup, W + 0.01, rimThick, D + 0.01, matIron, 0, H_LID - rimThick / 2, D / 2);

  // 3. Golden Latch (on front of the lid, centered)
  const latchW = 0.08, latchH = 0.14, latchD = 0.04;
  box(lidMeshGroup, latchW, latchH, latchD, matGold, 0, 0.02, D + latchD / 2);

  lidPivot.add(lidMeshGroup);
  root.add(lidPivot);

  // Position and rotate entire chest in world
  root.position.set(at.x, at.y ?? 0, at.z);
  root.rotation.y = at.yaw ?? 0;
  stage.scene.add(root);

  // Register physical obstacle in world
  if (world?.obstacles) {
    world.obstacles.push({
      x0: at.x - W / 2 - 0.1,
      x1: at.x + W / 2 + 0.1,
      z0: at.z - D / 2 - 0.1,
      z1: at.z + D / 2 + 0.1,
      level: at.y ?? 0,
    });
  }

  // Animation state
  let isOpen = false;
  let animId = null;
  const TARGET_OPEN_ANGLE = -Math.PI * 0.38; // ~68 degrees open

  function animateLid(targetAngle, duration = 400) {
    if (animId) cancelAnimationFrame(animId);
    const startAngle = lidPivot.rotation.x;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - t, 3);
      lidPivot.rotation.x = startAngle + (targetAngle - startAngle) * ease;
      if (t < 1) {
        animId = requestAnimationFrame(step);
      } else {
        animId = null;
      }
    }
    animId = requestAnimationFrame(step);
  }

  function open() {
    if (isOpen) return;
    isOpen = true;
    animateLid(TARGET_OPEN_ANGLE, 450);
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    animateLid(0, 350);
  }

  return {
    root,
    open,
    close,
    isOpen: () => isOpen,
  };
}
