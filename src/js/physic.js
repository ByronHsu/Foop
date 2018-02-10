function overlap(box1, box2) {
  if (box1 === undefined || box2 === undefined) return false;
  let xlap = false;
  let ylap = false;
  if (box1.edge.xL > box2.edge.xL && box1.edge.xL < box2.edge.xR) xlap = true;
  if (box1.edge.xR > box2.edge.xL && box1.edge.xR < box2.edge.xR) xlap = true;
  if (box2.edge.xL > box1.edge.xL && box2.edge.xL < box1.edge.xR) xlap = true;
  if (box2.edge.xR > box1.edge.xL && box2.edge.xR < box1.edge.xR) xlap = true;

  if (box1.edge.yT > box2.edge.yT && box1.edge.yT < box2.edge.yB) ylap = true;
  if (box1.edge.yB > box2.edge.yT && box1.edge.yB < box2.edge.yB) ylap = true;
  if (box2.edge.yT > box1.edge.yT && box2.edge.yT < box1.edge.yB) ylap = true;
  if (box2.edge.yB > box1.edge.yT && box2.edge.yB < box1.edge.yB) ylap = true;

  if (xlap && ylap) return true;
  else return false;
}
function inside(box1, box2) {
  // box1是否包含在box2
  let cnt = 0;
  for (let i = 0; i < 4; i++) {
    if (
      box1.vtx[i].x < box2.edge.xR &&
      box1.vtx[i].x > box2.edge.xL &&
      box1.vtx[i].y > box2.edge.yT &&
      box1.vtx[i].y < box2.edge.yB
    ) {
      cnt++;
    }
  }
  if (cnt == 4) return true;
  else return false;
}

function outside(box1, box2) {
  // box1是否在box2外
  let cnt = 0;
  for (let i = 0; i < 4; i++) {
    if (
      !(
        box1.vtx[i].x < box2.edge.xR &&
        box1.vtx[i].x > box2.edge.xL &&
        box1.vtx[i].y > box2.edge.yT &&
        box1.vtx[i].y < box2.edge.yB
      )
    ) {
      cnt++;
    }
  }
  if (cnt == 4) return true;
  else return false;
}

function hit(box1, box2) {
  if (box1 === undefined || box2 === undefined) return false;
  // box2的中心被包含在box1中
  if (
    box2.x < box1.edge.xR &&
    box2.x > box1.edge.xL &&
    box2.y > box1.edge.yT &&
    box2.y < box1.edge.yB
  )
    return true;
  else return false;
}

function hitLaser(box1, box2) {
  if (box1 === undefined || box2 === undefined) return false;
  if (box2.y > box1.edge.yT + 10) return true;
  else return false;
}

export { overlap, inside, outside, hit, hitLaser };
