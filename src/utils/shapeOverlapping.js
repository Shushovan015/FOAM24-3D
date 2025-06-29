export function isNear(a, b, t) {
  return !(
    a.x + a.sizeX/2 + t < b.x - b.sizeX/2 ||
    a.x - a.sizeX/2 - t > b.x + b.sizeX/2 ||
    a.y + a.sizeY/2 + t < b.y - b.sizeY/2 ||
    a.y - a.sizeY/2 - t > b.y + b.sizeY/2
  );
}

/** Returns true if A and B’s AABBs actually overlap. */
export function isOverlapping(a, b) {
  return !(
    a.x + a.sizeX/2 < b.x - b.sizeX/2 ||
    a.x - a.sizeX/2 > b.x + b.sizeX/2 ||
    a.y + a.sizeY/2 < b.y - b.sizeY/2 ||
    a.y - a.sizeY/2 > b.y + b.sizeY/2
  );
}
