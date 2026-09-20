"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Maillage réseau en trois dimensions.
 *
 * Des nœuds répartis sur une sphère par la suite de Fibonacci, reliés à leurs
 * voisins proches. Le curseur allume les nœuds qu'il survole, le défilement
 * fait basculer le maillage. Le motif renvoie au sujet — un réseau — plutôt
 * qu'à une forme décorative.
 */
export default function NetworkField({ className }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      // Pas de WebGL : la page reste parfaitement lisible sans le maillage.
      return;
    }

    const size = () => ({
      w: mount.clientWidth || 1,
      h: mount.clientHeight || 1,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(size().w, size().h, false);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    mount.appendChild(renderer.domElement);

    const compact = window.matchMedia("(max-width: 720px)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, size().w / size().h, 0.1, 60);
    // Sur un écran étroit le maillage remplit toute la largeur : on recule.
    camera.position.z = compact ? 6.4 : 5.1;

    const COUNT = compact ? 130 : 200;
    const RADIUS = 1.38;
    const LINK = compact ? 0.5 : 0.38;

    // --- Nœuds -------------------------------------------------------------
    const base = new Float32Array(COUNT * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < COUNT; i++) {
      const y = 1 - (i / (COUNT - 1)) * 2;
      const ring = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i;
      base[i * 3] = Math.cos(theta) * ring * RADIUS;
      base[i * 3 + 1] = y * RADIUS;
      base[i * 3 + 2] = Math.sin(theta) * ring * RADIUS;
    }

    // Les teintes viennent des jetons CSS : le maillage suit donc le thème.
    const readToken = (name: string, fallback: string) =>
      getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim() || fallback;

    const nodeColors = new Float32Array(COUNT * 3);
    const calm = new THREE.Color(readToken("--mesh-node", "#8c8272"));
    const lit = new THREE.Color(readToken("--brass", "#a07a46"));
    for (let i = 0; i < COUNT; i++) {
      calm.toArray(nodeColors, i * 3);
    }

    const nodeGeometry = new THREE.BufferGeometry();
    nodeGeometry.setAttribute("position", new THREE.BufferAttribute(base, 3));
    const colorAttr = new THREE.BufferAttribute(nodeColors, 3);
    colorAttr.setUsage(THREE.DynamicDrawUsage);
    nodeGeometry.setAttribute("color", colorAttr);

    const nodeMaterial = new THREE.PointsMaterial({
      size: compact ? 0.034 : 0.028,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
    });

    const nodes = new THREE.Points(nodeGeometry, nodeMaterial);

    // --- Liens -------------------------------------------------------------
    const segments: number[] = [];
    for (let i = 0; i < COUNT; i++) {
      for (let j = i + 1; j < COUNT; j++) {
        const dx = base[i * 3] - base[j * 3];
        const dy = base[i * 3 + 1] - base[j * 3 + 1];
        const dz = base[i * 3 + 2] - base[j * 3 + 2];
        if (dx * dx + dy * dy + dz * dz < LINK * LINK) {
          segments.push(
            base[i * 3],
            base[i * 3 + 1],
            base[i * 3 + 2],
            base[j * 3],
            base[j * 3 + 1],
            base[j * 3 + 2],
          );
        }
      }
    }

    const linkGeometry = new THREE.BufferGeometry();
    linkGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(segments, 3),
    );
    const linkMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(readToken("--mesh-line", "#16130f")),
      transparent: true,
      opacity: 0.1,
      depthWrite: false,
    });
    const links = new THREE.LineSegments(linkGeometry, linkMaterial);

    const group = new THREE.Group();
    group.add(links);
    group.add(nodes);
    group.rotation.set(0.22, 0.4, 0);
    scene.add(group);

    // --- Interaction -------------------------------------------------------
    const pointer = new THREE.Vector2(2, 2); // hors champ tant qu'on n'a pas bougé
    const aim = new THREE.Vector2(0, 0);
    const spin = new THREE.Vector2(0.4, 0.22);
    let scrollTilt = 0;

    const onPointerMove = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      aim.x = pointer.x * 0.28;
      aim.y = pointer.y * 0.2;
    };

    const onPointerLeave = () => {
      pointer.set(2, 2);
      aim.set(0, 0);
    };

    const onScroll = () => {
      scrollTilt = Math.min(window.scrollY / window.innerHeight, 1.4);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    // --- Boucle ------------------------------------------------------------
    const clock = new THREE.Clock();
    const world = new THREE.Vector3();
    const shade = new THREE.Color();
    let frame = 0;
    let visible = true;

    const render = () => {
      const t = clock.getElapsedTime();

      if (!reduceMotion) {
        spin.x += 0.0016;
        group.rotation.y = spin.x + aim.x;
        group.rotation.x = 0.22 + aim.y + scrollTilt * 0.55;
        group.rotation.z = Math.sin(t * 0.14) * 0.04;
        group.scale.setScalar(1 + Math.sin(t * 0.5) * 0.012);
      } else {
        group.rotation.y = spin.x + aim.x;
        group.rotation.x = 0.22 + aim.y;
      }

      // Les nœuds proches du curseur passent du gris chaud au laiton.
      group.updateMatrixWorld();
      for (let i = 0; i < COUNT; i++) {
        world
          .fromArray(base, i * 3)
          .applyMatrix4(group.matrixWorld)
          .project(camera);
        const d = Math.hypot(world.x - pointer.x, world.y - pointer.y);
        const k = Math.max(0, 1 - d / 0.3);
        shade.copy(calm).lerp(lit, k * k);
        shade.toArray(nodeColors, i * 3);
      }
      colorAttr.needsUpdate = true;

      renderer.render(scene, camera);
      frame = requestAnimationFrame(render);
    };

    frame = requestAnimationFrame(render);

    // --- Redimensionnement & mise en veille hors écran ---------------------
    const resizeObserver = new ResizeObserver(() => {
      const { w, h } = size();
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    });
    resizeObserver.observe(mount);

    // Bascule clair / sombre : on repeint les matériaux au lieu de tout rebâtir.
    const themeObserver = new MutationObserver(() => {
      calm.set(readToken("--mesh-node", "#8c8272"));
      lit.set(readToken("--brass", "#a07a46"));
      linkMaterial.color.set(readToken("--mesh-line", "#16130f"));
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !visible) {
          visible = true;
          frame = requestAnimationFrame(render);
        } else if (!entry.isIntersecting && visible) {
          visible = false;
          cancelAnimationFrame(frame);
        }
      },
      { threshold: 0 },
    );
    visibilityObserver.observe(mount);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("scroll", onScroll);
      nodeGeometry.dispose();
      linkGeometry.dispose();
      nodeMaterial.dispose();
      linkMaterial.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
}
