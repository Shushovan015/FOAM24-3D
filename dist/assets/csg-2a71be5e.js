(function() {
  "use strict";
  const flatten$L = (arr) => arr.reduce((acc, val) => Array.isArray(val) ? acc.concat(flatten$L(val)) : acc.concat(val), []);
  var flatten_1 = flatten$L;
  const clone$c = (geometry) => Object.assign({}, geometry);
  var clone_1$a = clone$c;
  const add$3 = (out, a, b) => {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    out[4] = a[4] + b[4];
    out[5] = a[5] + b[5];
    out[6] = a[6] + b[6];
    out[7] = a[7] + b[7];
    out[8] = a[8] + b[8];
    out[9] = a[9] + b[9];
    out[10] = a[10] + b[10];
    out[11] = a[11] + b[11];
    out[12] = a[12] + b[12];
    out[13] = a[13] + b[13];
    out[14] = a[14] + b[14];
    out[15] = a[15] + b[15];
    return out;
  };
  var add_1$2 = add$3;
  const create$K = () => [
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1
  ];
  var create_1$c = create$K;
  const create$J = create_1$c;
  const clone$b = (matrix) => {
    const out = create$J();
    out[0] = matrix[0];
    out[1] = matrix[1];
    out[2] = matrix[2];
    out[3] = matrix[3];
    out[4] = matrix[4];
    out[5] = matrix[5];
    out[6] = matrix[6];
    out[7] = matrix[7];
    out[8] = matrix[8];
    out[9] = matrix[9];
    out[10] = matrix[10];
    out[11] = matrix[11];
    out[12] = matrix[12];
    out[13] = matrix[13];
    out[14] = matrix[14];
    out[15] = matrix[15];
    return out;
  };
  var clone_1$9 = clone$b;
  const copy$8 = (out, matrix) => {
    out[0] = matrix[0];
    out[1] = matrix[1];
    out[2] = matrix[2];
    out[3] = matrix[3];
    out[4] = matrix[4];
    out[5] = matrix[5];
    out[6] = matrix[6];
    out[7] = matrix[7];
    out[8] = matrix[8];
    out[9] = matrix[9];
    out[10] = matrix[10];
    out[11] = matrix[11];
    out[12] = matrix[12];
    out[13] = matrix[13];
    out[14] = matrix[14];
    out[15] = matrix[15];
    return out;
  };
  var copy_1$5 = copy$8;
  const invert$2 = (out, matrix) => {
    const a00 = matrix[0];
    const a01 = matrix[1];
    const a02 = matrix[2];
    const a03 = matrix[3];
    const a10 = matrix[4];
    const a11 = matrix[5];
    const a12 = matrix[6];
    const a13 = matrix[7];
    const a20 = matrix[8];
    const a21 = matrix[9];
    const a22 = matrix[10];
    const a23 = matrix[11];
    const a30 = matrix[12];
    const a31 = matrix[13];
    const a32 = matrix[14];
    const a33 = matrix[15];
    const b00 = a00 * a11 - a01 * a10;
    const b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10;
    const b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11;
    const b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30;
    const b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30;
    const b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31;
    const b11 = a22 * a33 - a23 * a32;
    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    if (!det) {
      return null;
    }
    det = 1 / det;
    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
    return out;
  };
  var invert_1$2 = invert$2;
  const equals$9 = (a, b) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] && a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15];
  var equals_1$7 = equals$9;
  const spatialResolution = 1e5;
  const EPS$k = 1e-5;
  const NEPS$4 = 1e-13;
  const TAU$i = Math.PI * 2;
  var constants$1 = {
    EPS: EPS$k,
    NEPS: NEPS$4,
    TAU: TAU$i,
    spatialResolution
  };
  const { NEPS: NEPS$3 } = constants$1;
  const rezero = (n) => Math.abs(n) < NEPS$3 ? 0 : n;
  const sin$f = (radians) => rezero(Math.sin(radians));
  const cos$f = (radians) => rezero(Math.cos(radians));
  var trigonometry = { sin: sin$f, cos: cos$f };
  const identity$1 = (out) => {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  };
  var identity_1 = identity$1;
  const { EPS: EPS$j } = constants$1;
  const { sin: sin$e, cos: cos$e } = trigonometry;
  const identity = identity_1;
  const fromRotation$1 = (out, rad, axis) => {
    let [x, y, z] = axis;
    const lengthSquared = x * x + y * y + z * z;
    if (Math.abs(lengthSquared) < EPS$j) {
      return identity(out);
    }
    const len = 1 / Math.sqrt(lengthSquared);
    x *= len;
    y *= len;
    z *= len;
    const s = sin$e(rad);
    const c = cos$e(rad);
    const t = 1 - c;
    out[0] = x * x * t + c;
    out[1] = y * x * t + z * s;
    out[2] = z * x * t - y * s;
    out[3] = 0;
    out[4] = x * y * t - z * s;
    out[5] = y * y * t + c;
    out[6] = z * y * t + x * s;
    out[7] = 0;
    out[8] = x * z * t + y * s;
    out[9] = y * z * t - x * s;
    out[10] = z * z * t + c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  };
  var fromRotation_1 = fromRotation$1;
  const fromScaling = (out, vector) => {
    out[0] = vector[0];
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = vector[1];
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = vector[2];
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  };
  var fromScaling_1 = fromScaling;
  const { sin: sin$d, cos: cos$d } = trigonometry;
  const fromTaitBryanRotation = (out, yaw, pitch, roll) => {
    const sy = sin$d(yaw);
    const cy = cos$d(yaw);
    const sp = sin$d(pitch);
    const cp = cos$d(pitch);
    const sr = sin$d(roll);
    const cr = cos$d(roll);
    out[0] = cp * cy;
    out[1] = cp * sy;
    out[2] = -sp;
    out[3] = 0;
    out[4] = sr * sp * cy - cr * sy;
    out[5] = cr * cy + sr * sp * sy;
    out[6] = sr * cp;
    out[7] = 0;
    out[8] = sr * sy + cr * sp * cy;
    out[9] = cr * sp * sy - sr * cy;
    out[10] = cr * cp;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  };
  var fromTaitBryanRotation_1 = fromTaitBryanRotation;
  const fromTranslation = (out, vector) => {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = vector[0];
    out[13] = vector[1];
    out[14] = vector[2];
    out[15] = 1;
    return out;
  };
  var fromTranslation_1 = fromTranslation;
  const create$I = create_1$c;
  const fromValues$5 = (m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) => {
    const out = create$I();
    out[0] = m00;
    out[1] = m01;
    out[2] = m02;
    out[3] = m03;
    out[4] = m10;
    out[5] = m11;
    out[6] = m12;
    out[7] = m13;
    out[8] = m20;
    out[9] = m21;
    out[10] = m22;
    out[11] = m23;
    out[12] = m30;
    out[13] = m31;
    out[14] = m32;
    out[15] = m33;
    return out;
  };
  var fromValues_1$4 = fromValues$5;
  const abs$2 = (out, vector) => {
    out[0] = Math.abs(vector[0]);
    out[1] = Math.abs(vector[1]);
    out[2] = Math.abs(vector[2]);
    return out;
  };
  var abs_1$1 = abs$2;
  const add$2 = (out, a, b) => {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    return out;
  };
  var add_1$1 = add$2;
  const dot$5 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  var dot_1$2 = dot$5;
  const dot$4 = dot_1$2;
  const angle$1 = (a, b) => {
    const ax = a[0];
    const ay = a[1];
    const az = a[2];
    const bx = b[0];
    const by = b[1];
    const bz = b[2];
    const mag1 = Math.sqrt(ax * ax + ay * ay + az * az);
    const mag2 = Math.sqrt(bx * bx + by * by + bz * bz);
    const mag = mag1 * mag2;
    const cosine = mag && dot$4(a, b) / mag;
    return Math.acos(Math.min(Math.max(cosine, -1), 1));
  };
  var angle_1 = angle$1;
  const create$H = () => [0, 0, 0];
  var create_1$b = create$H;
  const create$G = create_1$b;
  const clone$a = (vector) => {
    const out = create$G();
    out[0] = vector[0];
    out[1] = vector[1];
    out[2] = vector[2];
    return out;
  };
  var clone_1$8 = clone$a;
  const copy$7 = (out, vector) => {
    out[0] = vector[0];
    out[1] = vector[1];
    out[2] = vector[2];
    return out;
  };
  var copy_1$4 = copy$7;
  const cross$5 = (out, a, b) => {
    const ax = a[0];
    const ay = a[1];
    const az = a[2];
    const bx = b[0];
    const by = b[1];
    const bz = b[2];
    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
  };
  var cross_1$1 = cross$5;
  const distance$2 = (a, b) => {
    const x = b[0] - a[0];
    const y = b[1] - a[1];
    const z = b[2] - a[2];
    return Math.sqrt(x * x + y * y + z * z);
  };
  var distance_1$1 = distance$2;
  const divide$1 = (out, a, b) => {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    return out;
  };
  var divide_1$1 = divide$1;
  const equals$8 = (a, b) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
  var equals_1$6 = equals$8;
  const fromScalar$2 = (out, scalar) => {
    out[0] = scalar;
    out[1] = scalar;
    out[2] = scalar;
    return out;
  };
  var fromScalar_1$2 = fromScalar$2;
  const create$F = create_1$b;
  const fromValues$4 = (x, y, z) => {
    const out = create$F();
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
  };
  var fromValues_1$3 = fromValues$4;
  const fromVector2 = (out, vector, z = 0) => {
    out[0] = vector[0];
    out[1] = vector[1];
    out[2] = z;
    return out;
  };
  var fromVec2 = fromVector2;
  const length$2 = (vector) => {
    const x = vector[0];
    const y = vector[1];
    const z = vector[2];
    return Math.sqrt(x * x + y * y + z * z);
  };
  var length_1$1 = length$2;
  const lerp$1 = (out, a, b, t) => {
    out[0] = a[0] + t * (b[0] - a[0]);
    out[1] = a[1] + t * (b[1] - a[1]);
    out[2] = a[2] + t * (b[2] - a[2]);
    return out;
  };
  var lerp_1$1 = lerp$1;
  const max$1 = (out, a, b) => {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    return out;
  };
  var max_1$1 = max$1;
  const min$1 = (out, a, b) => {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    return out;
  };
  var min_1$1 = min$1;
  const multiply$2 = (out, a, b) => {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    return out;
  };
  var multiply_1$2 = multiply$2;
  const negate$1 = (out, vector) => {
    out[0] = -vector[0];
    out[1] = -vector[1];
    out[2] = -vector[2];
    return out;
  };
  var negate_1$1 = negate$1;
  const normalize$3 = (out, vector) => {
    const x = vector[0];
    const y = vector[1];
    const z = vector[2];
    let len = x * x + y * y + z * z;
    if (len > 0) {
      len = 1 / Math.sqrt(len);
    }
    out[0] = x * len;
    out[1] = y * len;
    out[2] = z * len;
    return out;
  };
  var normalize_1$1 = normalize$3;
  const abs$1 = abs_1$1;
  const create$E = create_1$b;
  const cross$4 = cross_1$1;
  const orthogonal = (out, vector) => {
    const bV = abs$1(create$E(), vector);
    const b0 = 0 + (bV[0] < bV[1] && bV[0] < bV[2]);
    const b1 = 0 + (bV[1] <= bV[0] && bV[1] < bV[2]);
    const b2 = 0 + (bV[2] <= bV[0] && bV[2] <= bV[1]);
    return cross$4(out, vector, [b0, b1, b2]);
  };
  var orthogonal_1 = orthogonal;
  const rotateX$2 = (out, vector, origin2, radians) => {
    const p = [];
    const r = [];
    p[0] = vector[0] - origin2[0];
    p[1] = vector[1] - origin2[1];
    p[2] = vector[2] - origin2[2];
    r[0] = p[0];
    r[1] = p[1] * Math.cos(radians) - p[2] * Math.sin(radians);
    r[2] = p[1] * Math.sin(radians) + p[2] * Math.cos(radians);
    out[0] = r[0] + origin2[0];
    out[1] = r[1] + origin2[1];
    out[2] = r[2] + origin2[2];
    return out;
  };
  var rotateX_1$1 = rotateX$2;
  const rotateY$2 = (out, vector, origin2, radians) => {
    const p = [];
    const r = [];
    p[0] = vector[0] - origin2[0];
    p[1] = vector[1] - origin2[1];
    p[2] = vector[2] - origin2[2];
    r[0] = p[2] * Math.sin(radians) + p[0] * Math.cos(radians);
    r[1] = p[1];
    r[2] = p[2] * Math.cos(radians) - p[0] * Math.sin(radians);
    out[0] = r[0] + origin2[0];
    out[1] = r[1] + origin2[1];
    out[2] = r[2] + origin2[2];
    return out;
  };
  var rotateY_1$1 = rotateY$2;
  const rotateZ$2 = (out, vector, origin2, radians) => {
    const p = [];
    const r = [];
    p[0] = vector[0] - origin2[0];
    p[1] = vector[1] - origin2[1];
    r[0] = p[0] * Math.cos(radians) - p[1] * Math.sin(radians);
    r[1] = p[0] * Math.sin(radians) + p[1] * Math.cos(radians);
    out[0] = r[0] + origin2[0];
    out[1] = r[1] + origin2[1];
    out[2] = vector[2];
    return out;
  };
  var rotateZ_1$1 = rotateZ$2;
  const scale$4 = (out, vector, amount) => {
    out[0] = vector[0] * amount;
    out[1] = vector[1] * amount;
    out[2] = vector[2] * amount;
    return out;
  };
  var scale_1$3 = scale$4;
  const snap$2 = (out, vector, epsilon) => {
    out[0] = Math.round(vector[0] / epsilon) * epsilon + 0;
    out[1] = Math.round(vector[1] / epsilon) * epsilon + 0;
    out[2] = Math.round(vector[2] / epsilon) * epsilon + 0;
    return out;
  };
  var snap_1$2 = snap$2;
  const squaredDistance$2 = (a, b) => {
    const x = b[0] - a[0];
    const y = b[1] - a[1];
    const z = b[2] - a[2];
    return x * x + y * y + z * z;
  };
  var squaredDistance_1$1 = squaredDistance$2;
  const squaredLength$2 = (vector) => {
    const x = vector[0];
    const y = vector[1];
    const z = vector[2];
    return x * x + y * y + z * z;
  };
  var squaredLength_1$1 = squaredLength$2;
  const subtract$8 = (out, a, b) => {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    return out;
  };
  var subtract_1$3 = subtract$8;
  const toString$a = (vec) => `[${vec[0].toFixed(7)}, ${vec[1].toFixed(7)}, ${vec[2].toFixed(7)}]`;
  var toString_1$a = toString$a;
  const transform$b = (out, vector, matrix) => {
    const x = vector[0];
    const y = vector[1];
    const z = vector[2];
    let w = matrix[3] * x + matrix[7] * y + matrix[11] * z + matrix[15];
    w = w || 1;
    out[0] = (matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12]) / w;
    out[1] = (matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13]) / w;
    out[2] = (matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14]) / w;
    return out;
  };
  var transform_1$b = transform$b;
  var vec3$Y = {
    abs: abs_1$1,
    add: add_1$1,
    angle: angle_1,
    clone: clone_1$8,
    copy: copy_1$4,
    create: create_1$b,
    cross: cross_1$1,
    distance: distance_1$1,
    divide: divide_1$1,
    dot: dot_1$2,
    equals: equals_1$6,
    fromScalar: fromScalar_1$2,
    fromValues: fromValues_1$3,
    fromVec2,
    length: length_1$1,
    lerp: lerp_1$1,
    max: max_1$1,
    min: min_1$1,
    multiply: multiply_1$2,
    negate: negate_1$1,
    normalize: normalize_1$1,
    orthogonal: orthogonal_1,
    rotateX: rotateX_1$1,
    rotateY: rotateY_1$1,
    rotateZ: rotateZ_1$1,
    scale: scale_1$3,
    snap: snap_1$2,
    squaredDistance: squaredDistance_1$1,
    squaredLength: squaredLength_1$1,
    subtract: subtract_1$3,
    toString: toString_1$a,
    transform: transform_1$b
  };
  const vec3$X = vec3$Y;
  const fromRotation = fromRotation_1;
  const fromVectorRotation = (out, source, target) => {
    const sourceNormal = vec3$X.normalize(vec3$X.create(), source);
    const targetNormal = vec3$X.normalize(vec3$X.create(), target);
    const axis = vec3$X.cross(vec3$X.create(), targetNormal, sourceNormal);
    const cosA = vec3$X.dot(targetNormal, sourceNormal);
    if (cosA === -1)
      return fromRotation(out, Math.PI, vec3$X.orthogonal(axis, sourceNormal));
    const k = 1 / (1 + cosA);
    out[0] = axis[0] * axis[0] * k + cosA;
    out[1] = axis[1] * axis[0] * k - axis[2];
    out[2] = axis[2] * axis[0] * k + axis[1];
    out[3] = 0;
    out[4] = axis[0] * axis[1] * k + axis[2];
    out[5] = axis[1] * axis[1] * k + cosA;
    out[6] = axis[2] * axis[1] * k - axis[0];
    out[7] = 0;
    out[8] = axis[0] * axis[2] * k - axis[1];
    out[9] = axis[1] * axis[2] * k + axis[0];
    out[10] = axis[2] * axis[2] * k + cosA;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  };
  var fromVectorRotation_1 = fromVectorRotation;
  const { sin: sin$c, cos: cos$c } = trigonometry;
  const fromXRotation = (out, radians) => {
    const s = sin$c(radians);
    const c = cos$c(radians);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = c;
    out[6] = s;
    out[7] = 0;
    out[8] = 0;
    out[9] = -s;
    out[10] = c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  };
  var fromXRotation_1 = fromXRotation;
  const { sin: sin$b, cos: cos$b } = trigonometry;
  const fromYRotation = (out, radians) => {
    const s = sin$b(radians);
    const c = cos$b(radians);
    out[0] = c;
    out[1] = 0;
    out[2] = -s;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = s;
    out[9] = 0;
    out[10] = c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  };
  var fromYRotation_1 = fromYRotation;
  const { sin: sin$a, cos: cos$a } = trigonometry;
  const fromZRotation = (out, radians) => {
    const s = sin$a(radians);
    const c = cos$a(radians);
    out[0] = c;
    out[1] = s;
    out[2] = 0;
    out[3] = 0;
    out[4] = -s;
    out[5] = c;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  };
  var fromZRotation_1 = fromZRotation;
  const isIdentity = (matrix) => matrix[0] === 1 && matrix[1] === 0 && matrix[2] === 0 && matrix[3] === 0 && matrix[4] === 0 && matrix[5] === 1 && matrix[6] === 0 && matrix[7] === 0 && matrix[8] === 0 && matrix[9] === 0 && matrix[10] === 1 && matrix[11] === 0 && matrix[12] === 0 && matrix[13] === 0 && matrix[14] === 0 && matrix[15] === 1;
  var isIdentity_1 = isIdentity;
  const isOnlyTransformScale = (matrix) => (
    // TODO check if it is worth the effort to add recognition of 90 deg rotations
    isZero(matrix[1]) && isZero(matrix[2]) && isZero(matrix[3]) && isZero(matrix[4]) && isZero(matrix[6]) && isZero(matrix[7]) && isZero(matrix[8]) && isZero(matrix[9]) && isZero(matrix[11]) && matrix[15] === 1
  );
  const isZero = (num) => Math.abs(num) < Number.EPSILON;
  var isOnlyTransformScale_1 = isOnlyTransformScale;
  const isMirroring = (matrix) => {
    const x = matrix[4] * matrix[9] - matrix[8] * matrix[5];
    const y = matrix[8] * matrix[1] - matrix[0] * matrix[9];
    const z = matrix[0] * matrix[5] - matrix[4] * matrix[1];
    const d = x * matrix[2] + y * matrix[6] + z * matrix[10];
    return d < 0;
  };
  var isMirroring_1 = isMirroring;
  const mirrorByPlane = (out, plane2) => {
    const [nx, ny, nz, w] = plane2;
    out[0] = 1 - 2 * nx * nx;
    out[1] = -2 * ny * nx;
    out[2] = -2 * nz * nx;
    out[3] = 0;
    out[4] = -2 * nx * ny;
    out[5] = 1 - 2 * ny * ny;
    out[6] = -2 * nz * ny;
    out[7] = 0;
    out[8] = -2 * nx * nz;
    out[9] = -2 * ny * nz;
    out[10] = 1 - 2 * nz * nz;
    out[11] = 0;
    out[12] = 2 * nx * w;
    out[13] = 2 * ny * w;
    out[14] = 2 * nz * w;
    out[15] = 1;
    return out;
  };
  var mirrorByPlane_1 = mirrorByPlane;
  const multiply$1 = (out, a, b) => {
    const a00 = a[0];
    const a01 = a[1];
    const a02 = a[2];
    const a03 = a[3];
    const a10 = a[4];
    const a11 = a[5];
    const a12 = a[6];
    const a13 = a[7];
    const a20 = a[8];
    const a21 = a[9];
    const a22 = a[10];
    const a23 = a[11];
    const a30 = a[12];
    const a31 = a[13];
    const a32 = a[14];
    const a33 = a[15];
    let b0 = b[0];
    let b1 = b[1];
    let b2 = b[2];
    let b3 = b[3];
    out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[4];
    b1 = b[5];
    b2 = b[6];
    b3 = b[7];
    out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[8];
    b1 = b[9];
    b2 = b[10];
    b3 = b[11];
    out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[12];
    b1 = b[13];
    b2 = b[14];
    b3 = b[15];
    out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return out;
  };
  var multiply_1$1 = multiply$1;
  const { EPS: EPS$i } = constants$1;
  const { sin: sin$9, cos: cos$9 } = trigonometry;
  const copy$6 = copy_1$5;
  const rotate$4 = (out, matrix, radians, axis) => {
    let [x, y, z] = axis;
    const lengthSquared = x * x + y * y + z * z;
    if (Math.abs(lengthSquared) < EPS$i) {
      return copy$6(out, matrix);
    }
    const len = 1 / Math.sqrt(lengthSquared);
    x *= len;
    y *= len;
    z *= len;
    const s = sin$9(radians);
    const c = cos$9(radians);
    const t = 1 - c;
    const a00 = matrix[0];
    const a01 = matrix[1];
    const a02 = matrix[2];
    const a03 = matrix[3];
    const a10 = matrix[4];
    const a11 = matrix[5];
    const a12 = matrix[6];
    const a13 = matrix[7];
    const a20 = matrix[8];
    const a21 = matrix[9];
    const a22 = matrix[10];
    const a23 = matrix[11];
    const b00 = x * x * t + c;
    const b01 = y * x * t + z * s;
    const b02 = z * x * t - y * s;
    const b10 = x * y * t - z * s;
    const b11 = y * y * t + c;
    const b12 = z * y * t + x * s;
    const b20 = x * z * t + y * s;
    const b21 = y * z * t - x * s;
    const b22 = z * z * t + c;
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;
    if (matrix !== out) {
      out[12] = matrix[12];
      out[13] = matrix[13];
      out[14] = matrix[14];
      out[15] = matrix[15];
    }
    return out;
  };
  var rotate_1$2 = rotate$4;
  const { sin: sin$8, cos: cos$8 } = trigonometry;
  const rotateX$1 = (out, matrix, radians) => {
    const s = sin$8(radians);
    const c = cos$8(radians);
    const a10 = matrix[4];
    const a11 = matrix[5];
    const a12 = matrix[6];
    const a13 = matrix[7];
    const a20 = matrix[8];
    const a21 = matrix[9];
    const a22 = matrix[10];
    const a23 = matrix[11];
    if (matrix !== out) {
      out[0] = matrix[0];
      out[1] = matrix[1];
      out[2] = matrix[2];
      out[3] = matrix[3];
      out[12] = matrix[12];
      out[13] = matrix[13];
      out[14] = matrix[14];
      out[15] = matrix[15];
    }
    out[4] = a10 * c + a20 * s;
    out[5] = a11 * c + a21 * s;
    out[6] = a12 * c + a22 * s;
    out[7] = a13 * c + a23 * s;
    out[8] = a20 * c - a10 * s;
    out[9] = a21 * c - a11 * s;
    out[10] = a22 * c - a12 * s;
    out[11] = a23 * c - a13 * s;
    return out;
  };
  var rotateX_1 = rotateX$1;
  const { sin: sin$7, cos: cos$7 } = trigonometry;
  const rotateY$1 = (out, matrix, radians) => {
    const s = sin$7(radians);
    const c = cos$7(radians);
    const a00 = matrix[0];
    const a01 = matrix[1];
    const a02 = matrix[2];
    const a03 = matrix[3];
    const a20 = matrix[8];
    const a21 = matrix[9];
    const a22 = matrix[10];
    const a23 = matrix[11];
    if (matrix !== out) {
      out[4] = matrix[4];
      out[5] = matrix[5];
      out[6] = matrix[6];
      out[7] = matrix[7];
      out[12] = matrix[12];
      out[13] = matrix[13];
      out[14] = matrix[14];
      out[15] = matrix[15];
    }
    out[0] = a00 * c - a20 * s;
    out[1] = a01 * c - a21 * s;
    out[2] = a02 * c - a22 * s;
    out[3] = a03 * c - a23 * s;
    out[8] = a00 * s + a20 * c;
    out[9] = a01 * s + a21 * c;
    out[10] = a02 * s + a22 * c;
    out[11] = a03 * s + a23 * c;
    return out;
  };
  var rotateY_1 = rotateY$1;
  const { sin: sin$6, cos: cos$6 } = trigonometry;
  const rotateZ$1 = (out, matrix, radians) => {
    const s = sin$6(radians);
    const c = cos$6(radians);
    const a00 = matrix[0];
    const a01 = matrix[1];
    const a02 = matrix[2];
    const a03 = matrix[3];
    const a10 = matrix[4];
    const a11 = matrix[5];
    const a12 = matrix[6];
    const a13 = matrix[7];
    if (matrix !== out) {
      out[8] = matrix[8];
      out[9] = matrix[9];
      out[10] = matrix[10];
      out[11] = matrix[11];
      out[12] = matrix[12];
      out[13] = matrix[13];
      out[14] = matrix[14];
      out[15] = matrix[15];
    }
    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a02 * c + a12 * s;
    out[3] = a03 * c + a13 * s;
    out[4] = a10 * c - a00 * s;
    out[5] = a11 * c - a01 * s;
    out[6] = a12 * c - a02 * s;
    out[7] = a13 * c - a03 * s;
    return out;
  };
  var rotateZ_1 = rotateZ$1;
  const scale$3 = (out, matrix, dimensions) => {
    const x = dimensions[0];
    const y = dimensions[1];
    const z = dimensions[2];
    out[0] = matrix[0] * x;
    out[1] = matrix[1] * x;
    out[2] = matrix[2] * x;
    out[3] = matrix[3] * x;
    out[4] = matrix[4] * y;
    out[5] = matrix[5] * y;
    out[6] = matrix[6] * y;
    out[7] = matrix[7] * y;
    out[8] = matrix[8] * z;
    out[9] = matrix[9] * z;
    out[10] = matrix[10] * z;
    out[11] = matrix[11] * z;
    out[12] = matrix[12];
    out[13] = matrix[13];
    out[14] = matrix[14];
    out[15] = matrix[15];
    return out;
  };
  var scale_1$2 = scale$3;
  const subtract$7 = (out, a, b) => {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    out[4] = a[4] - b[4];
    out[5] = a[5] - b[5];
    out[6] = a[6] - b[6];
    out[7] = a[7] - b[7];
    out[8] = a[8] - b[8];
    out[9] = a[9] - b[9];
    out[10] = a[10] - b[10];
    out[11] = a[11] - b[11];
    out[12] = a[12] - b[12];
    out[13] = a[13] - b[13];
    out[14] = a[14] - b[14];
    out[15] = a[15] - b[15];
    return out;
  };
  var subtract_1$2 = subtract$7;
  const toString$9 = (mat) => mat.map((n) => n.toFixed(7)).toString();
  var toString_1$9 = toString$9;
  const translate$4 = (out, matrix, offsets) => {
    const x = offsets[0];
    const y = offsets[1];
    const z = offsets[2];
    let a00;
    let a01;
    let a02;
    let a03;
    let a10;
    let a11;
    let a12;
    let a13;
    let a20;
    let a21;
    let a22;
    let a23;
    if (matrix === out) {
      out[12] = matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12];
      out[13] = matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13];
      out[14] = matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14];
      out[15] = matrix[3] * x + matrix[7] * y + matrix[11] * z + matrix[15];
    } else {
      a00 = matrix[0];
      a01 = matrix[1];
      a02 = matrix[2];
      a03 = matrix[3];
      a10 = matrix[4];
      a11 = matrix[5];
      a12 = matrix[6];
      a13 = matrix[7];
      a20 = matrix[8];
      a21 = matrix[9];
      a22 = matrix[10];
      a23 = matrix[11];
      out[0] = a00;
      out[1] = a01;
      out[2] = a02;
      out[3] = a03;
      out[4] = a10;
      out[5] = a11;
      out[6] = a12;
      out[7] = a13;
      out[8] = a20;
      out[9] = a21;
      out[10] = a22;
      out[11] = a23;
      out[12] = a00 * x + a10 * y + a20 * z + matrix[12];
      out[13] = a01 * x + a11 * y + a21 * z + matrix[13];
      out[14] = a02 * x + a12 * y + a22 * z + matrix[14];
      out[15] = a03 * x + a13 * y + a23 * z + matrix[15];
    }
    return out;
  };
  var translate_1$1 = translate$4;
  var mat4$r = {
    add: add_1$2,
    clone: clone_1$9,
    copy: copy_1$5,
    create: create_1$c,
    invert: invert_1$2,
    equals: equals_1$7,
    fromRotation: fromRotation_1,
    fromScaling: fromScaling_1,
    fromTaitBryanRotation: fromTaitBryanRotation_1,
    fromTranslation: fromTranslation_1,
    fromValues: fromValues_1$4,
    fromVectorRotation: fromVectorRotation_1,
    fromXRotation: fromXRotation_1,
    fromYRotation: fromYRotation_1,
    fromZRotation: fromZRotation_1,
    identity: identity_1,
    isIdentity: isIdentity_1,
    isOnlyTransformScale: isOnlyTransformScale_1,
    isMirroring: isMirroring_1,
    mirrorByPlane: mirrorByPlane_1,
    multiply: multiply_1$1,
    rotate: rotate_1$2,
    rotateX: rotateX_1,
    rotateY: rotateY_1,
    rotateZ: rotateZ_1,
    scale: scale_1$2,
    subtract: subtract_1$2,
    toString: toString_1$9,
    translate: translate_1$1
  };
  const mat4$q = mat4$r;
  const create$D = (sides) => {
    if (sides === void 0) {
      sides = [];
    }
    return {
      sides,
      transforms: mat4$q.create()
    };
  };
  var create_1$a = create$D;
  const abs = (out, vector) => {
    out[0] = Math.abs(vector[0]);
    out[1] = Math.abs(vector[1]);
    return out;
  };
  var abs_1 = abs;
  const add$1 = (out, a, b) => {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    return out;
  };
  var add_1 = add$1;
  const angleRadians$1 = (vector) => Math.atan2(vector[1], vector[0]);
  var angleRadians_1 = angleRadians$1;
  var angle = angleRadians_1;
  const angleRadians = angleRadians_1;
  const angleDegrees = (vector) => angleRadians(vector) * 57.29577951308232;
  var angleDegrees_1 = angleDegrees;
  const create$C = () => [0, 0];
  var create_1$9 = create$C;
  const create$B = create_1$9;
  const clone$9 = (vector) => {
    const out = create$B();
    out[0] = vector[0];
    out[1] = vector[1];
    return out;
  };
  var clone_1$7 = clone$9;
  const copy$5 = (out, vector) => {
    out[0] = vector[0];
    out[1] = vector[1];
    return out;
  };
  var copy_1$3 = copy$5;
  const cross$3 = (out, a, b) => {
    out[0] = 0;
    out[1] = 0;
    out[2] = a[0] * b[1] - a[1] * b[0];
    return out;
  };
  var cross_1 = cross$3;
  const distance$1 = (a, b) => {
    const x = b[0] - a[0];
    const y = b[1] - a[1];
    return Math.sqrt(x * x + y * y);
  };
  var distance_1 = distance$1;
  const divide = (out, a, b) => {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    return out;
  };
  var divide_1 = divide;
  const dot$3 = (a, b) => a[0] * b[0] + a[1] * b[1];
  var dot_1$1 = dot$3;
  const equals$7 = (a, b) => a[0] === b[0] && a[1] === b[1];
  var equals_1$5 = equals$7;
  const { sin: sin$5, cos: cos$5 } = trigonometry;
  const fromAngleRadians$1 = (out, radians) => {
    out[0] = cos$5(radians);
    out[1] = sin$5(radians);
    return out;
  };
  var fromAngleRadians_1 = fromAngleRadians$1;
  const fromAngleRadians = fromAngleRadians_1;
  const fromAngleDegrees = (out, degrees) => fromAngleRadians(out, degrees * 0.017453292519943295);
  var fromAngleDegrees_1 = fromAngleDegrees;
  const fromScalar$1 = (out, scalar) => {
    out[0] = scalar;
    out[1] = scalar;
    return out;
  };
  var fromScalar_1$1 = fromScalar$1;
  const create$A = create_1$9;
  const fromValues$3 = (x, y) => {
    const out = create$A();
    out[0] = x;
    out[1] = y;
    return out;
  };
  var fromValues_1$2 = fromValues$3;
  const length$1 = (vector) => Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
  var length_1 = length$1;
  const lerp = (out, a, b, t) => {
    const ax = a[0];
    const ay = a[1];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    return out;
  };
  var lerp_1 = lerp;
  const max = (out, a, b) => {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    return out;
  };
  var max_1 = max;
  const min = (out, a, b) => {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    return out;
  };
  var min_1 = min;
  const multiply = (out, a, b) => {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    return out;
  };
  var multiply_1 = multiply;
  const negate = (out, vector) => {
    out[0] = -vector[0];
    out[1] = -vector[1];
    return out;
  };
  var negate_1 = negate;
  const rotate$3 = (out, vector, origin2, radians) => {
    const x = vector[0] - origin2[0];
    const y = vector[1] - origin2[1];
    const c = Math.cos(radians);
    const s = Math.sin(radians);
    out[0] = x * c - y * s + origin2[0];
    out[1] = x * s + y * c + origin2[1];
    return out;
  };
  var rotate_1$1 = rotate$3;
  const { TAU: TAU$h } = constants$1;
  const create$z = create_1$9;
  const rotate$2 = rotate_1$1;
  const normal = (out, vector) => rotate$2(out, vector, create$z(), TAU$h / 4);
  var normal_1 = normal;
  const normalize$2 = (out, vector) => {
    const x = vector[0];
    const y = vector[1];
    let len = x * x + y * y;
    if (len > 0) {
      len = 1 / Math.sqrt(len);
    }
    out[0] = x * len;
    out[1] = y * len;
    return out;
  };
  var normalize_1 = normalize$2;
  const scale$2 = (out, vector, amount) => {
    out[0] = vector[0] * amount;
    out[1] = vector[1] * amount;
    return out;
  };
  var scale_1$1 = scale$2;
  const snap$1 = (out, vector, epsilon) => {
    out[0] = Math.round(vector[0] / epsilon) * epsilon + 0;
    out[1] = Math.round(vector[1] / epsilon) * epsilon + 0;
    return out;
  };
  var snap_1$1 = snap$1;
  const squaredDistance$1 = (a, b) => {
    const x = b[0] - a[0];
    const y = b[1] - a[1];
    return x * x + y * y;
  };
  var squaredDistance_1 = squaredDistance$1;
  const squaredLength$1 = (vector) => {
    const x = vector[0];
    const y = vector[1];
    return x * x + y * y;
  };
  var squaredLength_1 = squaredLength$1;
  const subtract$6 = (out, a, b) => {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    return out;
  };
  var subtract_1$1 = subtract$6;
  const toString$8 = (vector) => `[${vector[0].toFixed(7)}, ${vector[1].toFixed(7)}]`;
  var toString_1$8 = toString$8;
  const transform$a = (out, vector, matrix) => {
    const x = vector[0];
    const y = vector[1];
    out[0] = matrix[0] * x + matrix[4] * y + matrix[12];
    out[1] = matrix[1] * x + matrix[5] * y + matrix[13];
    return out;
  };
  var transform_1$a = transform$a;
  var vec2$E = {
    abs: abs_1,
    add: add_1,
    angle,
    angleDegrees: angleDegrees_1,
    angleRadians: angleRadians_1,
    clone: clone_1$7,
    copy: copy_1$3,
    create: create_1$9,
    cross: cross_1,
    distance: distance_1,
    divide: divide_1,
    dot: dot_1$1,
    equals: equals_1$5,
    fromAngleDegrees: fromAngleDegrees_1,
    fromAngleRadians: fromAngleRadians_1,
    fromScalar: fromScalar_1$1,
    fromValues: fromValues_1$2,
    length: length_1,
    lerp: lerp_1,
    max: max_1,
    min: min_1,
    multiply: multiply_1,
    negate: negate_1,
    normal: normal_1,
    normalize: normalize_1,
    rotate: rotate_1$1,
    scale: scale_1$1,
    snap: snap_1$1,
    squaredDistance: squaredDistance_1,
    squaredLength: squaredLength_1,
    subtract: subtract_1$1,
    toString: toString_1$8,
    transform: transform_1$a
  };
  const vec2$D = vec2$E;
  const create$y = create_1$a;
  const fromPoints$b = (points) => {
    if (!Array.isArray(points)) {
      throw new Error("the given points must be an array");
    }
    let length2 = points.length;
    if (length2 < 3) {
      throw new Error("the given points must define a closed geometry with three or more points");
    }
    if (vec2$D.equals(points[0], points[length2 - 1]))
      --length2;
    const sides = [];
    let prevpoint = points[length2 - 1];
    for (let i = 0; i < length2; i++) {
      const point = points[i];
      sides.push([vec2$D.clone(prevpoint), vec2$D.clone(point)]);
      prevpoint = point;
    }
    return create$y(sides);
  };
  var fromPoints_1$7 = fromPoints$b;
  const mat4$p = mat4$r;
  const vec2$C = vec2$E;
  const create$x = create_1$a;
  const fromCompactBinary$2 = (data) => {
    if (data[0] !== 0)
      throw new Error("invalid compact binary data");
    const created = create$x();
    created.transforms = mat4$p.clone(data.slice(1, 17));
    for (let i = 21; i < data.length; i += 4) {
      const point0 = vec2$C.fromValues(data[i + 0], data[i + 1]);
      const point1 = vec2$C.fromValues(data[i + 2], data[i + 3]);
      created.sides.push([point0, point1]);
    }
    if (data[17] >= 0) {
      created.color = [data[17], data[18], data[19], data[20]];
    }
    return created;
  };
  var fromCompactBinary_1$2 = fromCompactBinary$2;
  const isA$8 = (object) => {
    if (object && typeof object === "object") {
      if ("sides" in object && "transforms" in object) {
        if (Array.isArray(object.sides) && "length" in object.transforms) {
          return true;
        }
      }
    }
    return false;
  };
  var isA_1$4 = isA$8;
  const mat4$o = mat4$r;
  const vec2$B = vec2$E;
  const applyTransforms$5 = (geometry) => {
    if (mat4$o.isIdentity(geometry.transforms))
      return geometry;
    geometry.sides = geometry.sides.map((side) => {
      const p0 = vec2$B.transform(vec2$B.create(), side[0], geometry.transforms);
      const p1 = vec2$B.transform(vec2$B.create(), side[1], geometry.transforms);
      return [p0, p1];
    });
    geometry.transforms = mat4$o.create();
    return geometry;
  };
  var applyTransforms_1$2 = applyTransforms$5;
  const applyTransforms$4 = applyTransforms_1$2;
  const toSides$4 = (geometry) => applyTransforms$4(geometry).sides;
  var toSides_1 = toSides$4;
  const create$w = create_1$a;
  const toSides$3 = toSides_1;
  const reverse$4 = (geometry) => {
    const oldsides = toSides$3(geometry);
    const newsides = oldsides.map((side) => [side[1], side[0]]);
    newsides.reverse();
    return create$w(newsides);
  };
  var reverse_1$4 = reverse$4;
  const vec2$A = vec2$E;
  const toSides$2 = toSides_1;
  const toSharedVertices = (sides) => {
    const unique = /* @__PURE__ */ new Map();
    const getUniqueVertex = (vertex) => {
      const key = vertex.toString();
      if (unique.has(key)) {
        return unique.get(key);
      } else {
        unique.set(key, vertex);
        return vertex;
      }
    };
    return sides.map((side) => side.map(getUniqueVertex));
  };
  const toVertexMap = (sides) => {
    const vertexMap = /* @__PURE__ */ new Map();
    const edges = toSharedVertices(sides);
    edges.forEach((edge) => {
      if (vertexMap.has(edge[0])) {
        vertexMap.get(edge[0]).push(edge);
      } else {
        vertexMap.set(edge[0], [edge]);
      }
    });
    return vertexMap;
  };
  const toOutlines$2 = (geometry) => {
    const vertexMap = toVertexMap(toSides$2(geometry));
    const outlines = [];
    while (true) {
      let startSide;
      for (const [vertex, edges] of vertexMap) {
        startSide = edges.shift();
        if (!startSide) {
          vertexMap.delete(vertex);
          continue;
        }
        break;
      }
      if (startSide === void 0)
        break;
      const connectedVertexPoints = [];
      const startVertex = startSide[0];
      while (true) {
        connectedVertexPoints.push(startSide[0]);
        const nextVertex = startSide[1];
        if (nextVertex === startVertex)
          break;
        const nextPossibleSides = vertexMap.get(nextVertex);
        if (!nextPossibleSides) {
          throw new Error(`geometry is not closed at vertex ${nextVertex}`);
        }
        const nextSide = popNextSide(startSide, nextPossibleSides);
        if (nextPossibleSides.length === 0) {
          vertexMap.delete(nextVertex);
        }
        startSide = nextSide;
      }
      if (connectedVertexPoints.length > 0) {
        connectedVertexPoints.push(connectedVertexPoints.shift());
      }
      outlines.push(connectedVertexPoints);
    }
    vertexMap.clear();
    return outlines;
  };
  const popNextSide = (startSide, nextSides) => {
    if (nextSides.length === 1) {
      return nextSides.pop();
    }
    const v0 = vec2$A.create();
    const startAngle = vec2$A.angleDegrees(vec2$A.subtract(v0, startSide[1], startSide[0]));
    let bestAngle;
    let bestIndex;
    nextSides.forEach((nextSide2, index) => {
      const nextAngle = vec2$A.angleDegrees(vec2$A.subtract(v0, nextSide2[1], nextSide2[0]));
      let angle2 = nextAngle - startAngle;
      if (angle2 < -180)
        angle2 += 360;
      if (angle2 >= 180)
        angle2 -= 360;
      if (bestIndex === void 0 || angle2 > bestAngle) {
        bestIndex = index;
        bestAngle = angle2;
      }
    });
    const nextSide = nextSides[bestIndex];
    nextSides.splice(bestIndex, 1);
    return nextSide;
  };
  var toOutlines_1 = toOutlines$2;
  const toSides$1 = toSides_1;
  const toPoints$8 = (geometry) => {
    const sides = toSides$1(geometry);
    const points = sides.map((side) => side[0]);
    if (points.length > 0) {
      points.push(points.shift());
    }
    return points;
  };
  var toPoints_1$3 = toPoints$8;
  const vec2$z = vec2$E;
  const toSides = toSides_1;
  const toString$7 = (geometry) => {
    const sides = toSides(geometry);
    let result = "geom2 (" + sides.length + " sides):\n[\n";
    sides.forEach((side) => {
      result += "  [" + vec2$z.toString(side[0]) + ", " + vec2$z.toString(side[1]) + "]\n";
    });
    result += "]\n";
    return result;
  };
  var toString_1$7 = toString$7;
  const toCompactBinary$2 = (geometry) => {
    const sides = geometry.sides;
    const transforms2 = geometry.transforms;
    let color = [-1, -1, -1, -1];
    if (geometry.color)
      color = geometry.color;
    const compacted = new Float32Array(1 + 16 + 4 + sides.length * 4);
    compacted[0] = 0;
    compacted[1] = transforms2[0];
    compacted[2] = transforms2[1];
    compacted[3] = transforms2[2];
    compacted[4] = transforms2[3];
    compacted[5] = transforms2[4];
    compacted[6] = transforms2[5];
    compacted[7] = transforms2[6];
    compacted[8] = transforms2[7];
    compacted[9] = transforms2[8];
    compacted[10] = transforms2[9];
    compacted[11] = transforms2[10];
    compacted[12] = transforms2[11];
    compacted[13] = transforms2[12];
    compacted[14] = transforms2[13];
    compacted[15] = transforms2[14];
    compacted[16] = transforms2[15];
    compacted[17] = color[0];
    compacted[18] = color[1];
    compacted[19] = color[2];
    compacted[20] = color[3];
    for (let i = 0; i < sides.length; i++) {
      const ci = i * 4 + 21;
      const point0 = sides[i][0];
      const point1 = sides[i][1];
      compacted[ci + 0] = point0[0];
      compacted[ci + 1] = point0[1];
      compacted[ci + 2] = point1[0];
      compacted[ci + 3] = point1[1];
    }
    return compacted;
  };
  var toCompactBinary_1$2 = toCompactBinary$2;
  const mat4$n = mat4$r;
  const transform$9 = (matrix, geometry) => {
    const transforms2 = mat4$n.multiply(mat4$n.create(), matrix, geometry.transforms);
    return Object.assign({}, geometry, { transforms: transforms2 });
  };
  var transform_1$9 = transform$9;
  const vec2$y = vec2$E;
  const isA$7 = isA_1$4;
  const toOutlines$1 = toOutlines_1;
  const validate$3 = (object) => {
    if (!isA$7(object)) {
      throw new Error("invalid geom2 structure");
    }
    toOutlines$1(object);
    object.sides.forEach((side) => {
      if (vec2$y.equals(side[0], side[1])) {
        throw new Error(`geom2 self-edge ${side[0]}`);
      }
    });
    if (!object.transforms.every(Number.isFinite)) {
      throw new Error(`geom2 invalid transforms ${object.transforms}`);
    }
  };
  var validate_1$3 = validate$3;
  var geom2$K = {
    clone: clone_1$a,
    create: create_1$a,
    fromPoints: fromPoints_1$7,
    fromCompactBinary: fromCompactBinary_1$2,
    isA: isA_1$4,
    reverse: reverse_1$4,
    toOutlines: toOutlines_1,
    toPoints: toPoints_1$3,
    toSides: toSides_1,
    toString: toString_1$7,
    toCompactBinary: toCompactBinary_1$2,
    transform: transform_1$9,
    validate: validate_1$3
  };
  const clone$8 = (geometry) => Object.assign({}, geometry);
  var clone_1$6 = clone$8;
  const mat4$m = mat4$r;
  const create$v = (polygons) => {
    if (polygons === void 0) {
      polygons = [];
    }
    return {
      polygons,
      transforms: mat4$m.create()
    };
  };
  var create_1$8 = create$v;
  const create$u = (vertices) => {
    if (vertices === void 0 || vertices.length < 3) {
      vertices = [];
    }
    return { vertices };
  };
  var create_1$7 = create$u;
  const create$t = create_1$7;
  const vec3$W = vec3$Y;
  const clone$7 = (...params) => {
    let out;
    let poly32;
    if (params.length === 1) {
      out = create$t();
      poly32 = params[0];
    } else {
      out = params[0];
      poly32 = params[1];
    }
    out.vertices = poly32.vertices.map((vec) => vec3$W.clone(vec));
    return out;
  };
  var clone_1$5 = clone$7;
  const vec3$V = vec3$Y;
  const create$s = create_1$7;
  const fromPoints$a = (points) => {
    const vertices = points.map((point) => vec3$V.clone(point));
    return create$s(vertices);
  };
  var fromPoints_1$6 = fromPoints$a;
  const create$r = create_1$7;
  const fromPointsAndPlane = (vertices, plane2) => {
    const poly = create$r(vertices);
    poly.plane = plane2;
    return poly;
  };
  var fromPointsAndPlane_1 = fromPointsAndPlane;
  const create$q = () => [0, 0, 0, 0];
  var create_1$6 = create$q;
  const create$p = create_1$6;
  const clone$6 = (vector) => {
    const out = create$p();
    out[0] = vector[0];
    out[1] = vector[1];
    out[2] = vector[2];
    out[3] = vector[3];
    return out;
  };
  var clone_1$4 = clone$6;
  const copy$4 = (out, vector) => {
    out[0] = vector[0];
    out[1] = vector[1];
    out[2] = vector[2];
    out[3] = vector[3];
    return out;
  };
  var copy_1$2 = copy$4;
  const equals$6 = (a, b) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
  var equals_1$4 = equals$6;
  const flip$3 = (out, plane2) => {
    out[0] = -plane2[0];
    out[1] = -plane2[1];
    out[2] = -plane2[2];
    out[3] = -plane2[3];
    return out;
  };
  var flip_1$1 = flip$3;
  const vec3$U = vec3$Y;
  const fromNormalAndPoint = (out, normal2, point) => {
    const u = vec3$U.normalize(vec3$U.create(), normal2);
    const w = vec3$U.dot(point, u);
    out[0] = u[0];
    out[1] = u[1];
    out[2] = u[2];
    out[3] = w;
    return out;
  };
  var fromNormalAndPoint_1 = fromNormalAndPoint;
  const create$o = create_1$6;
  const fromValues$2 = (x, y, z, w) => {
    const out = create$o();
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
  };
  var fromValues_1$1 = fromValues$2;
  const vec3$T = vec3$Y;
  const fromPoints$9 = (out, ...vertices) => {
    const len = vertices.length;
    const ba = vec3$T.create();
    const ca = vec3$T.create();
    const vertexNormal = (index) => {
      const a = vertices[index];
      const b = vertices[(index + 1) % len];
      const c = vertices[(index + 2) % len];
      vec3$T.subtract(ba, b, a);
      vec3$T.subtract(ca, c, a);
      vec3$T.cross(ba, ba, ca);
      vec3$T.normalize(ba, ba);
      return ba;
    };
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    if (len === 3) {
      vec3$T.copy(out, vertexNormal(0));
    } else {
      vertices.forEach((v, i) => {
        vec3$T.add(out, out, vertexNormal(i));
      });
      vec3$T.normalize(out, out);
    }
    out[3] = vec3$T.dot(out, vertices[0]);
    return out;
  };
  var fromPoints_1$5 = fromPoints$9;
  const { EPS: EPS$h } = constants$1;
  const vec3$S = vec3$Y;
  const fromPointsRandom = (out, a, b, c) => {
    let ba = vec3$S.subtract(vec3$S.create(), b, a);
    let ca = vec3$S.subtract(vec3$S.create(), c, a);
    if (vec3$S.length(ba) < EPS$h) {
      ba = vec3$S.orthogonal(ba, ca);
    }
    if (vec3$S.length(ca) < EPS$h) {
      ca = vec3$S.orthogonal(ca, ba);
    }
    let normal2 = vec3$S.cross(vec3$S.create(), ba, ca);
    if (vec3$S.length(normal2) < EPS$h) {
      ca = vec3$S.orthogonal(ca, ba);
      normal2 = vec3$S.cross(normal2, ba, ca);
    }
    normal2 = vec3$S.normalize(normal2, normal2);
    const w = vec3$S.dot(normal2, a);
    out[0] = normal2[0];
    out[1] = normal2[1];
    out[2] = normal2[2];
    out[3] = w;
    return out;
  };
  var fromPointsRandom_1 = fromPointsRandom;
  const vec3$R = vec3$Y;
  const projectionOfPoint = (plane2, point) => {
    const a = point[0] * plane2[0] + point[1] * plane2[1] + point[2] * plane2[2] - plane2[3];
    const x = point[0] - a * plane2[0];
    const y = point[1] - a * plane2[1];
    const z = point[2] - a * plane2[2];
    return vec3$R.fromValues(x, y, z);
  };
  var projectionOfPoint_1 = projectionOfPoint;
  const vec3$Q = vec3$Y;
  const signedDistanceToPoint$1 = (plane2, point) => vec3$Q.dot(plane2, point) - plane2[3];
  var signedDistanceToPoint_1 = signedDistanceToPoint$1;
  const toString$6 = (vec) => `(${vec[0].toFixed(9)}, ${vec[1].toFixed(9)}, ${vec[2].toFixed(9)}, ${vec[3].toFixed(9)})`;
  var toString_1$6 = toString$6;
  const mat4$l = mat4$r;
  const vec3$P = vec3$Y;
  const fromPoints$8 = fromPoints_1$5;
  const flip$2 = flip_1$1;
  const transform$8 = (out, plane2, matrix) => {
    const ismirror = mat4$l.isMirroring(matrix);
    const r = vec3$P.orthogonal(vec3$P.create(), plane2);
    const u = vec3$P.cross(r, plane2, r);
    const v = vec3$P.cross(vec3$P.create(), plane2, u);
    let point1 = vec3$P.fromScalar(vec3$P.create(), plane2[3]);
    vec3$P.multiply(point1, point1, plane2);
    let point2 = vec3$P.add(vec3$P.create(), point1, u);
    let point3 = vec3$P.add(vec3$P.create(), point1, v);
    point1 = vec3$P.transform(point1, point1, matrix);
    point2 = vec3$P.transform(point2, point2, matrix);
    point3 = vec3$P.transform(point3, point3, matrix);
    fromPoints$8(out, point1, point2, point3);
    if (ismirror) {
      flip$2(out, out);
    }
    return out;
  };
  var transform_1$8 = transform$8;
  var plane$b = {
    /**
     * @see [vec4.clone()]{@link module:modeling/maths/vec4.clone}
     * @function clone
     */
    clone: clone_1$4,
    /**
     * @see [vec4.copy()]{@link module:modeling/maths/vec4.copy}
     * @function copy
     */
    copy: copy_1$2,
    /**
     * @see [vec4.create()]{@link module:modeling/maths/vec4.create}
     * @function create
     */
    create: create_1$6,
    /**
     * @see [vec4.equals()]{@link module:modeling/maths/vec4.equals}
     * @function equals
     */
    equals: equals_1$4,
    flip: flip_1$1,
    fromNormalAndPoint: fromNormalAndPoint_1,
    /**
     * @see [vec4.fromValues()]{@link module:modeling/maths/vec4.fromValues}
     * @function fromValues
     */
    fromValues: fromValues_1$1,
    fromPoints: fromPoints_1$5,
    fromPointsRandom: fromPointsRandom_1,
    projectionOfPoint: projectionOfPoint_1,
    signedDistanceToPoint: signedDistanceToPoint_1,
    /**
     * @see [vec4.toString()]{@link module:modeling/maths/vec4.toString}
     * @function toString
     */
    toString: toString_1$6,
    transform: transform_1$8
  };
  const plane$a = plane$b;
  const create$n = create_1$7;
  const invert$1 = (polygon2) => {
    const vertices = polygon2.vertices.slice().reverse();
    const inverted = create$n(vertices);
    if (polygon2.plane) {
      inverted.plane = plane$a.flip(plane$a.create(), polygon2.plane);
    }
    return inverted;
  };
  var invert_1$1 = invert$1;
  const isA$6 = (object) => {
    if (object && typeof object === "object") {
      if ("vertices" in object) {
        if (Array.isArray(object.vertices)) {
          return true;
        }
      }
    }
    return false;
  };
  var isA_1$3 = isA$6;
  const plane$9 = plane$b;
  const vec3$O = vec3$Y;
  const isConvex$1 = (polygon2) => areVerticesConvex(polygon2.vertices);
  const areVerticesConvex = (vertices) => {
    const numvertices = vertices.length;
    if (numvertices > 2) {
      const normal2 = plane$9.fromPoints(plane$9.create(), ...vertices);
      let prevprevpos = vertices[numvertices - 2];
      let prevpos = vertices[numvertices - 1];
      for (let i = 0; i < numvertices; i++) {
        const pos = vertices[i];
        if (!isConvexPoint(prevprevpos, prevpos, pos, normal2)) {
          return false;
        }
        prevprevpos = prevpos;
        prevpos = pos;
      }
    }
    return true;
  };
  const isConvexPoint = (prevpoint, point, nextpoint, normal2) => {
    const crossproduct = vec3$O.cross(
      vec3$O.create(),
      vec3$O.subtract(vec3$O.create(), point, prevpoint),
      vec3$O.subtract(vec3$O.create(), nextpoint, point)
    );
    const crossdotnormal = vec3$O.dot(crossproduct, normal2);
    return crossdotnormal >= 0;
  };
  var isConvex_1 = isConvex$1;
  const mplane = plane$b;
  const plane$8 = (polygon2) => {
    if (!polygon2.plane) {
      polygon2.plane = mplane.fromPoints(mplane.create(), ...polygon2.vertices);
    }
    return polygon2.plane;
  };
  var plane_1 = plane$8;
  const plane$7 = plane_1;
  const measureArea$5 = (polygon2) => {
    const n = polygon2.vertices.length;
    if (n < 3) {
      return 0;
    }
    const vertices = polygon2.vertices;
    const normal2 = plane$7(polygon2);
    const ax = Math.abs(normal2[0]);
    const ay = Math.abs(normal2[1]);
    const az = Math.abs(normal2[2]);
    if (ax + ay + az === 0) {
      return 0;
    }
    let coord = 3;
    if (ax > ay && ax > az) {
      coord = 1;
    } else if (ay > az) {
      coord = 2;
    }
    let area2 = 0;
    let h = 0;
    let i = 1;
    let j = 2;
    switch (coord) {
      case 1:
        for (i = 1; i < n; i++) {
          h = i - 1;
          j = (i + 1) % n;
          area2 += vertices[i][1] * (vertices[j][2] - vertices[h][2]);
        }
        area2 += vertices[0][1] * (vertices[1][2] - vertices[n - 1][2]);
        area2 /= 2 * normal2[0];
        break;
      case 2:
        for (i = 1; i < n; i++) {
          h = i - 1;
          j = (i + 1) % n;
          area2 += vertices[i][2] * (vertices[j][0] - vertices[h][0]);
        }
        area2 += vertices[0][2] * (vertices[1][0] - vertices[n - 1][0]);
        area2 /= 2 * normal2[1];
        break;
      case 3:
      default:
        for (i = 1; i < n; i++) {
          h = i - 1;
          j = (i + 1) % n;
          area2 += vertices[i][0] * (vertices[j][1] - vertices[h][1]);
        }
        area2 += vertices[0][0] * (vertices[1][1] - vertices[n - 1][1]);
        area2 /= 2 * normal2[2];
        break;
    }
    return area2;
  };
  var measureArea_1$2 = measureArea$5;
  const vec3$N = vec3$Y;
  const measureBoundingBox$7 = (polygon2) => {
    const vertices = polygon2.vertices;
    const numvertices = vertices.length;
    const min2 = numvertices === 0 ? vec3$N.create() : vec3$N.clone(vertices[0]);
    const max2 = vec3$N.clone(min2);
    for (let i = 1; i < numvertices; i++) {
      vec3$N.min(min2, min2, vertices[i]);
      vec3$N.max(max2, max2, vertices[i]);
    }
    return [min2, max2];
  };
  var measureBoundingBox_1$1 = measureBoundingBox$7;
  const dot$2 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  var dot_1 = dot$2;
  const fromScalar = (out, scalar) => {
    out[0] = scalar;
    out[1] = scalar;
    out[2] = scalar;
    out[3] = scalar;
    return out;
  };
  var fromScalar_1 = fromScalar;
  const transform$7 = (out, vector, matrix) => {
    const [x, y, z, w] = vector;
    out[0] = matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12] * w;
    out[1] = matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13] * w;
    out[2] = matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14] * w;
    out[3] = matrix[3] * x + matrix[7] * y + matrix[11] * z + matrix[15] * w;
    return out;
  };
  var transform_1$7 = transform$7;
  var vec4$1 = {
    clone: clone_1$4,
    copy: copy_1$2,
    create: create_1$6,
    dot: dot_1,
    equals: equals_1$4,
    fromScalar: fromScalar_1,
    fromValues: fromValues_1$1,
    toString: toString_1$6,
    transform: transform_1$7
  };
  const vec4 = vec4$1;
  const cache$3 = /* @__PURE__ */ new WeakMap();
  const measureBoundingSphere$1 = (polygon2) => {
    let boundingSphere = cache$3.get(polygon2);
    if (boundingSphere)
      return boundingSphere;
    const vertices = polygon2.vertices;
    const out = vec4.create();
    if (vertices.length === 0) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      return out;
    }
    let minx = vertices[0];
    let miny = minx;
    let minz = minx;
    let maxx = minx;
    let maxy = minx;
    let maxz = minx;
    vertices.forEach((v) => {
      if (minx[0] > v[0])
        minx = v;
      if (miny[1] > v[1])
        miny = v;
      if (minz[2] > v[2])
        minz = v;
      if (maxx[0] < v[0])
        maxx = v;
      if (maxy[1] < v[1])
        maxy = v;
      if (maxz[2] < v[2])
        maxz = v;
    });
    out[0] = (minx[0] + maxx[0]) * 0.5;
    out[1] = (miny[1] + maxy[1]) * 0.5;
    out[2] = (minz[2] + maxz[2]) * 0.5;
    const x = out[0] - maxx[0];
    const y = out[1] - maxy[1];
    const z = out[2] - maxz[2];
    out[3] = Math.sqrt(x * x + y * y + z * z);
    cache$3.set(polygon2, out);
    return out;
  };
  var measureBoundingSphere_1$1 = measureBoundingSphere$1;
  const vec3$M = vec3$Y;
  const measureSignedVolume = (polygon2) => {
    let signedVolume = 0;
    const vertices = polygon2.vertices;
    const cross2 = vec3$M.create();
    for (let i = 0; i < vertices.length - 2; i++) {
      vec3$M.cross(cross2, vertices[i + 1], vertices[i + 2]);
      signedVolume += vec3$M.dot(vertices[0], cross2);
    }
    signedVolume /= 6;
    return signedVolume;
  };
  var measureSignedVolume_1 = measureSignedVolume;
  const toPoints$7 = (polygon2) => polygon2.vertices;
  var toPoints_1$2 = toPoints$7;
  const vec3$L = vec3$Y;
  const toString$5 = (polygon2) => {
    let result = "poly3: vertices: [";
    polygon2.vertices.forEach((vertex) => {
      result += `${vec3$L.toString(vertex)}, `;
    });
    result += "]";
    return result;
  };
  var toString_1$5 = toString$5;
  const mat4$k = mat4$r;
  const vec3$K = vec3$Y;
  const create$m = create_1$7;
  const transform$6 = (matrix, polygon2) => {
    const vertices = polygon2.vertices.map((vertex) => vec3$K.transform(vec3$K.create(), vertex, matrix));
    if (mat4$k.isMirroring(matrix)) {
      vertices.reverse();
    }
    return create$m(vertices);
  };
  var transform_1$6 = transform$6;
  const signedDistanceToPoint = signedDistanceToPoint_1;
  const { NEPS: NEPS$2 } = constants$1;
  const vec3$J = vec3$Y;
  const isA$5 = isA_1$3;
  const isConvex = isConvex_1;
  const measureArea$4 = measureArea_1$2;
  const plane$6 = plane_1;
  const validate$2 = (object) => {
    if (!isA$5(object)) {
      throw new Error("invalid poly3 structure");
    }
    if (object.vertices.length < 3) {
      throw new Error(`poly3 not enough vertices ${object.vertices.length}`);
    }
    if (measureArea$4(object) <= 0) {
      throw new Error("poly3 area must be greater than zero");
    }
    for (let i = 0; i < object.vertices.length; i++) {
      if (vec3$J.equals(object.vertices[i], object.vertices[(i + 1) % object.vertices.length])) {
        throw new Error(`poly3 duplicate vertex ${object.vertices[i]}`);
      }
    }
    if (!isConvex(object)) {
      throw new Error("poly3 must be convex");
    }
    object.vertices.forEach((vertex) => {
      if (!vertex.every(Number.isFinite)) {
        throw new Error(`poly3 invalid vertex ${vertex}`);
      }
    });
    if (object.vertices.length > 3) {
      const normal2 = plane$6(object);
      object.vertices.forEach((vertex) => {
        const dist = Math.abs(signedDistanceToPoint(normal2, vertex));
        if (dist > NEPS$2) {
          throw new Error(`poly3 must be coplanar: vertex ${vertex} distance ${dist}`);
        }
      });
    }
  };
  var validate_1$2 = validate$2;
  var poly3$A = {
    clone: clone_1$5,
    create: create_1$7,
    fromPoints: fromPoints_1$6,
    fromPointsAndPlane: fromPointsAndPlane_1,
    invert: invert_1$1,
    isA: isA_1$3,
    isConvex: isConvex_1,
    measureArea: measureArea_1$2,
    measureBoundingBox: measureBoundingBox_1$1,
    measureBoundingSphere: measureBoundingSphere_1$1,
    measureSignedVolume: measureSignedVolume_1,
    plane: plane_1,
    toPoints: toPoints_1$2,
    toString: toString_1$5,
    transform: transform_1$6,
    validate: validate_1$2
  };
  const poly3$z = poly3$A;
  const create$l = create_1$8;
  const fromPoints$7 = (listofpoints) => {
    if (!Array.isArray(listofpoints)) {
      throw new Error("the given points must be an array");
    }
    const polygons = listofpoints.map((points, index) => {
      const polygon2 = poly3$z.create(points);
      return polygon2;
    });
    const result = create$l(polygons);
    return result;
  };
  var fromPoints_1$4 = fromPoints$7;
  const vec3$I = vec3$Y;
  const mat4$j = mat4$r;
  const poly3$y = poly3$A;
  const create$k = create_1$8;
  const fromCompactBinary$1 = (data) => {
    if (data[0] !== 1)
      throw new Error("invalid compact binary data");
    const created = create$k();
    created.transforms = mat4$j.clone(data.slice(1, 17));
    const numberOfVertices = data[21];
    let ci = 22;
    let vi = data.length - numberOfVertices * 3;
    while (vi < data.length) {
      const verticesPerPolygon = data[ci];
      ci++;
      const vertices = [];
      for (let i = 0; i < verticesPerPolygon; i++) {
        vertices.push(vec3$I.fromValues(data[vi], data[vi + 1], data[vi + 2]));
        vi += 3;
      }
      created.polygons.push(poly3$y.create(vertices));
    }
    if (data[17] >= 0) {
      created.color = [data[17], data[18], data[19], data[20]];
    }
    return created;
  };
  var fromCompactBinary_1$1 = fromCompactBinary$1;
  const mat4$i = mat4$r;
  const poly3$x = poly3$A;
  const applyTransforms$3 = (geometry) => {
    if (mat4$i.isIdentity(geometry.transforms))
      return geometry;
    geometry.polygons = geometry.polygons.map((polygon2) => poly3$x.transform(geometry.transforms, polygon2));
    geometry.transforms = mat4$i.create();
    return geometry;
  };
  var applyTransforms_1$1 = applyTransforms$3;
  const applyTransforms$2 = applyTransforms_1$1;
  const toPolygons$4 = (geometry) => applyTransforms$2(geometry).polygons;
  var toPolygons_1$1 = toPolygons$4;
  const poly3$w = poly3$A;
  const create$j = create_1$8;
  const toPolygons$3 = toPolygons_1$1;
  const invert = (geometry) => {
    const polygons = toPolygons$3(geometry);
    const newpolygons = polygons.map((polygon2) => poly3$w.invert(polygon2));
    return create$j(newpolygons);
  };
  var invert_1 = invert;
  const isA$4 = (object) => {
    if (object && typeof object === "object") {
      if ("polygons" in object && "transforms" in object) {
        if (Array.isArray(object.polygons) && "length" in object.transforms) {
          return true;
        }
      }
    }
    return false;
  };
  var isA_1$2 = isA$4;
  const poly3$v = poly3$A;
  const toPolygons$2 = toPolygons_1$1;
  const toPoints$6 = (geometry) => {
    const polygons = toPolygons$2(geometry);
    const listofpoints = polygons.map((polygon2) => poly3$v.toPoints(polygon2));
    return listofpoints;
  };
  var toPoints_1$1 = toPoints$6;
  const poly3$u = poly3$A;
  const toPolygons$1 = toPolygons_1$1;
  const toString$4 = (geometry) => {
    const polygons = toPolygons$1(geometry);
    let result = "geom3 (" + polygons.length + " polygons):\n";
    polygons.forEach((polygon2) => {
      result += "  " + poly3$u.toString(polygon2) + "\n";
    });
    return result;
  };
  var toString_1$4 = toString$4;
  const poly3$t = poly3$A;
  const toCompactBinary$1 = (geometry) => {
    const polygons = geometry.polygons;
    const transforms2 = geometry.transforms;
    const numberOfPolygons = polygons.length;
    const numberOfVertices = polygons.reduce((count, polygon2) => count + polygon2.vertices.length, 0);
    let color = [-1, -1, -1, -1];
    if (geometry.color)
      color = geometry.color;
    const compacted = new Float32Array(1 + 16 + 4 + 1 + numberOfPolygons + numberOfVertices * 3);
    compacted[0] = 1;
    compacted[1] = transforms2[0];
    compacted[2] = transforms2[1];
    compacted[3] = transforms2[2];
    compacted[4] = transforms2[3];
    compacted[5] = transforms2[4];
    compacted[6] = transforms2[5];
    compacted[7] = transforms2[6];
    compacted[8] = transforms2[7];
    compacted[9] = transforms2[8];
    compacted[10] = transforms2[9];
    compacted[11] = transforms2[10];
    compacted[12] = transforms2[11];
    compacted[13] = transforms2[12];
    compacted[14] = transforms2[13];
    compacted[15] = transforms2[14];
    compacted[16] = transforms2[15];
    compacted[17] = color[0];
    compacted[18] = color[1];
    compacted[19] = color[2];
    compacted[20] = color[3];
    compacted[21] = numberOfVertices;
    let ci = 22;
    let vi = ci + numberOfPolygons;
    polygons.forEach((polygon2) => {
      const points = poly3$t.toPoints(polygon2);
      compacted[ci] = points.length;
      ci++;
      for (let i = 0; i < points.length; i++) {
        const point = points[i];
        compacted[vi + 0] = point[0];
        compacted[vi + 1] = point[1];
        compacted[vi + 2] = point[2];
        vi += 3;
      }
    });
    return compacted;
  };
  var toCompactBinary_1$1 = toCompactBinary$1;
  const mat4$h = mat4$r;
  const transform$5 = (matrix, geometry) => {
    const transforms2 = mat4$h.multiply(mat4$h.create(), matrix, geometry.transforms);
    return Object.assign({}, geometry, { transforms: transforms2 });
  };
  var transform_1$5 = transform$5;
  const poly3$s = poly3$A;
  const isA$3 = isA_1$2;
  const validate$1 = (object) => {
    if (!isA$3(object)) {
      throw new Error("invalid geom3 structure");
    }
    object.polygons.forEach(poly3$s.validate);
    validateManifold(object);
    if (!object.transforms.every(Number.isFinite)) {
      throw new Error(`geom3 invalid transforms ${object.transforms}`);
    }
  };
  const validateManifold = (object) => {
    const edgeCount = /* @__PURE__ */ new Map();
    object.polygons.forEach(({ vertices }) => {
      vertices.forEach((v, i) => {
        const v12 = `${v}`;
        const v22 = `${vertices[(i + 1) % vertices.length]}`;
        const edge = `${v12}/${v22}`;
        const count = edgeCount.has(edge) ? edgeCount.get(edge) : 0;
        edgeCount.set(edge, count + 1);
      });
    });
    const nonManifold = [];
    edgeCount.forEach((count, edge) => {
      const complementEdge = edge.split("/").reverse().join("/");
      const complementCount = edgeCount.get(complementEdge);
      if (count !== complementCount) {
        nonManifold.push(edge.replace("/", " -> "));
      }
    });
    if (nonManifold.length > 0) {
      throw new Error(`non-manifold edges ${nonManifold.length}
${nonManifold.join("\n")}`);
    }
  };
  var validate_1$1 = validate$1;
  var geom3$K = {
    clone: clone_1$6,
    create: create_1$8,
    fromPoints: fromPoints_1$4,
    fromCompactBinary: fromCompactBinary_1$1,
    invert: invert_1,
    isA: isA_1$2,
    toPoints: toPoints_1$1,
    toPolygons: toPolygons_1$1,
    toString: toString_1$4,
    toCompactBinary: toCompactBinary_1$1,
    transform: transform_1$5,
    validate: validate_1$1
  };
  const clone$5 = (geometry) => Object.assign({}, geometry);
  var clone_1$3 = clone$5;
  const { EPS: EPS$g } = constants$1;
  const vec2$x = vec2$E;
  const clone$4 = clone_1$3;
  const close$1 = (geometry) => {
    if (geometry.isClosed)
      return geometry;
    const cloned = clone$4(geometry);
    cloned.isClosed = true;
    if (cloned.points.length > 1) {
      const points = cloned.points;
      const p0 = points[0];
      let pn = points[points.length - 1];
      while (vec2$x.distance(p0, pn) < EPS$g * EPS$g) {
        points.pop();
        if (points.length === 1)
          break;
        pn = points[points.length - 1];
      }
    }
    return cloned;
  };
  var close_1 = close$1;
  const mat4$g = mat4$r;
  const create$i = (points) => {
    if (points === void 0) {
      points = [];
    }
    return {
      points,
      isClosed: false,
      transforms: mat4$g.create()
    };
  };
  var create_1$5 = create$i;
  const { EPS: EPS$f } = constants$1;
  const vec2$w = vec2$E;
  const close = close_1;
  const create$h = create_1$5;
  const fromPoints$6 = (options, points) => {
    const defaults = { closed: false };
    let { closed } = Object.assign({}, defaults, options);
    let created = create$h();
    created.points = points.map((point) => vec2$w.clone(point));
    if (created.points.length > 1) {
      const p0 = created.points[0];
      const pn = created.points[created.points.length - 1];
      if (vec2$w.distance(p0, pn) < EPS$f * EPS$f) {
        closed = true;
      }
    }
    if (closed === true)
      created = close(created);
    return created;
  };
  var fromPoints_1$3 = fromPoints$6;
  const mat4$f = mat4$r;
  const vec2$v = vec2$E;
  const applyTransforms$1 = (geometry) => {
    if (mat4$f.isIdentity(geometry.transforms))
      return geometry;
    geometry.points = geometry.points.map((point) => vec2$v.transform(vec2$v.create(), point, geometry.transforms));
    geometry.transforms = mat4$f.create();
    return geometry;
  };
  var applyTransforms_1 = applyTransforms$1;
  const applyTransforms = applyTransforms_1;
  const toPoints$5 = (geometry) => applyTransforms(geometry).points;
  var toPoints_1 = toPoints$5;
  const { TAU: TAU$g } = constants$1;
  const vec2$u = vec2$E;
  const fromPoints$5 = fromPoints_1$3;
  const toPoints$4 = toPoints_1;
  const appendArc = (options, geometry) => {
    const defaults = {
      radius: [0, 0],
      // X and Y radius
      xaxisrotation: 0,
      clockwise: false,
      large: false,
      segments: 16
    };
    let { endpoint, radius, xaxisrotation, clockwise, large, segments } = Object.assign({}, defaults, options);
    if (!Array.isArray(endpoint))
      throw new Error("endpoint must be an array of X and Y values");
    if (endpoint.length < 2)
      throw new Error("endpoint must contain X and Y values");
    endpoint = vec2$u.clone(endpoint);
    if (!Array.isArray(radius))
      throw new Error("radius must be an array of X and Y values");
    if (radius.length < 2)
      throw new Error("radius must contain X and Y values");
    if (segments < 4)
      throw new Error("segments must be four or more");
    const decimals = 1e5;
    if (geometry.isClosed) {
      throw new Error("the given path cannot be closed");
    }
    const points = toPoints$4(geometry);
    if (points.length < 1) {
      throw new Error("the given path must contain one or more points (as the starting point for the arc)");
    }
    let xradius = radius[0];
    let yradius = radius[1];
    const startpoint = points[points.length - 1];
    xradius = Math.round(xradius * decimals) / decimals;
    yradius = Math.round(yradius * decimals) / decimals;
    endpoint = vec2$u.fromValues(Math.round(endpoint[0] * decimals) / decimals, Math.round(endpoint[1] * decimals) / decimals);
    const sweepFlag = !clockwise;
    let newpoints = [];
    if (xradius === 0 || yradius === 0) {
      newpoints.push(endpoint);
    } else {
      xradius = Math.abs(xradius);
      yradius = Math.abs(yradius);
      const phi = xaxisrotation;
      const cosphi = Math.cos(phi);
      const sinphi = Math.sin(phi);
      const minushalfdistance = vec2$u.subtract(vec2$u.create(), startpoint, endpoint);
      vec2$u.scale(minushalfdistance, minushalfdistance, 0.5);
      const x = Math.round((cosphi * minushalfdistance[0] + sinphi * minushalfdistance[1]) * decimals) / decimals;
      const y = Math.round((-sinphi * minushalfdistance[0] + cosphi * minushalfdistance[1]) * decimals) / decimals;
      const startTranslated = vec2$u.fromValues(x, y);
      const biglambda = startTranslated[0] * startTranslated[0] / (xradius * xradius) + startTranslated[1] * startTranslated[1] / (yradius * yradius);
      if (biglambda > 1) {
        const sqrtbiglambda = Math.sqrt(biglambda);
        xradius *= sqrtbiglambda;
        yradius *= sqrtbiglambda;
        xradius = Math.round(xradius * decimals) / decimals;
        yradius = Math.round(yradius * decimals) / decimals;
      }
      let multiplier1 = Math.sqrt((xradius * xradius * yradius * yradius - xradius * xradius * startTranslated[1] * startTranslated[1] - yradius * yradius * startTranslated[0] * startTranslated[0]) / (xradius * xradius * startTranslated[1] * startTranslated[1] + yradius * yradius * startTranslated[0] * startTranslated[0]));
      if (sweepFlag === large)
        multiplier1 = -multiplier1;
      const centerTranslated = vec2$u.fromValues(xradius * startTranslated[1] / yradius, -yradius * startTranslated[0] / xradius);
      vec2$u.scale(centerTranslated, centerTranslated, multiplier1);
      let center2 = vec2$u.fromValues(cosphi * centerTranslated[0] - sinphi * centerTranslated[1], sinphi * centerTranslated[0] + cosphi * centerTranslated[1]);
      center2 = vec2$u.add(center2, center2, vec2$u.scale(vec2$u.create(), vec2$u.add(vec2$u.create(), startpoint, endpoint), 0.5));
      const vector1 = vec2$u.fromValues((startTranslated[0] - centerTranslated[0]) / xradius, (startTranslated[1] - centerTranslated[1]) / yradius);
      const vector2 = vec2$u.fromValues((-startTranslated[0] - centerTranslated[0]) / xradius, (-startTranslated[1] - centerTranslated[1]) / yradius);
      const theta1 = vec2$u.angleRadians(vector1);
      const theta2 = vec2$u.angleRadians(vector2);
      let deltatheta = theta2 - theta1;
      deltatheta = deltatheta % TAU$g;
      if (!sweepFlag && deltatheta > 0) {
        deltatheta -= TAU$g;
      } else if (sweepFlag && deltatheta < 0) {
        deltatheta += TAU$g;
      }
      let numsteps = Math.ceil(Math.abs(deltatheta) / TAU$g * segments) + 1;
      if (numsteps < 1)
        numsteps = 1;
      for (let step = 1; step < numsteps; step++) {
        const theta = theta1 + step / numsteps * deltatheta;
        const costheta = Math.cos(theta);
        const sintheta = Math.sin(theta);
        const point = vec2$u.fromValues(cosphi * xradius * costheta - sinphi * yradius * sintheta, sinphi * xradius * costheta + cosphi * yradius * sintheta);
        vec2$u.add(point, point, center2);
        newpoints.push(point);
      }
      if (numsteps)
        newpoints.push(options.endpoint);
    }
    newpoints = points.concat(newpoints);
    const result = fromPoints$5({}, newpoints);
    return result;
  };
  var appendArc_1 = appendArc;
  const fromPoints$4 = fromPoints_1$3;
  const toPoints$3 = toPoints_1;
  const { equals: equals$5 } = vec2$E;
  const concat$1 = (...paths) => {
    let isClosed = false;
    let newpoints = [];
    paths.forEach((path, i) => {
      const tmp = toPoints$3(path).slice();
      if (newpoints.length > 0 && tmp.length > 0 && equals$5(tmp[0], newpoints[newpoints.length - 1]))
        tmp.shift();
      if (tmp.length > 0 && isClosed) {
        throw new Error(`Cannot concatenate to a closed path; check the ${i}th path`);
      }
      isClosed = path.isClosed;
      newpoints = newpoints.concat(tmp);
    });
    return fromPoints$4({ closed: isClosed }, newpoints);
  };
  var concat_1 = concat$1;
  const concat = concat_1;
  const create$g = create_1$5;
  const appendPoints$1 = (points, geometry) => concat(geometry, create$g(points));
  var appendPoints_1 = appendPoints$1;
  const { TAU: TAU$f } = constants$1;
  const vec2$t = vec2$E;
  const vec3$H = vec2$E;
  const appendPoints = appendPoints_1;
  const toPoints$2 = toPoints_1;
  const appendBezier = (options, geometry) => {
    const defaults = {
      segments: 16
    };
    let { controlPoints, segments } = Object.assign({}, defaults, options);
    if (!Array.isArray(controlPoints))
      throw new Error("controlPoints must be an array of one or more points");
    if (controlPoints.length < 1)
      throw new Error("controlPoints must be an array of one or more points");
    if (segments < 4)
      throw new Error("segments must be four or more");
    if (geometry.isClosed) {
      throw new Error("the given geometry cannot be closed");
    }
    const points = toPoints$2(geometry);
    if (points.length < 1) {
      throw new Error("the given path must contain one or more points (as the starting point for the bezier curve)");
    }
    controlPoints = controlPoints.slice();
    const firstControlPoint = controlPoints[0];
    if (firstControlPoint === null) {
      if (controlPoints.length < 2) {
        throw new Error("a null control point must be passed with one more control points");
      }
      let lastBezierControlPoint = points[points.length - 2];
      if ("lastBezierControlPoint" in geometry) {
        lastBezierControlPoint = geometry.lastBezierControlPoint;
      }
      if (!Array.isArray(lastBezierControlPoint)) {
        throw new Error("the given path must contain TWO or more points if given a null control point");
      }
      const controlpoint = vec2$t.scale(vec2$t.create(), points[points.length - 1], 2);
      vec2$t.subtract(controlpoint, controlpoint, lastBezierControlPoint);
      controlPoints[0] = controlpoint;
    }
    controlPoints.unshift(points[points.length - 1]);
    const bezierOrder = controlPoints.length - 1;
    const factorials = [];
    let fact = 1;
    for (let i = 0; i <= bezierOrder; ++i) {
      if (i > 0)
        fact *= i;
      factorials.push(fact);
    }
    const binomials = [];
    for (let i = 0; i <= bezierOrder; ++i) {
      const binomial = factorials[bezierOrder] / (factorials[i] * factorials[bezierOrder - i]);
      binomials.push(binomial);
    }
    const v0 = vec2$t.create();
    const v12 = vec2$t.create();
    const v3 = vec3$H.create();
    const getPointForT = (t) => {
      let tk = 1;
      let oneMinusTNMinusK = Math.pow(1 - t, bezierOrder);
      const invOneMinusT = t !== 1 ? 1 / (1 - t) : 1;
      const point = vec2$t.create();
      for (let k = 0; k <= bezierOrder; ++k) {
        if (k === bezierOrder)
          oneMinusTNMinusK = 1;
        const bernsteinCoefficient = binomials[k] * tk * oneMinusTNMinusK;
        const derivativePoint = vec2$t.scale(v0, controlPoints[k], bernsteinCoefficient);
        vec2$t.add(point, point, derivativePoint);
        tk *= t;
        oneMinusTNMinusK *= invOneMinusT;
      }
      return point;
    };
    const newpoints = [];
    const newpointsT = [];
    const numsteps = bezierOrder + 1;
    for (let i = 0; i < numsteps; ++i) {
      const t = i / (numsteps - 1);
      const point = getPointForT(t);
      newpoints.push(point);
      newpointsT.push(t);
    }
    let subdivideBase = 1;
    const maxangle = TAU$f / segments;
    const maxsinangle = Math.sin(maxangle);
    while (subdivideBase < newpoints.length - 1) {
      const dir1 = vec2$t.subtract(v0, newpoints[subdivideBase], newpoints[subdivideBase - 1]);
      vec2$t.normalize(dir1, dir1);
      const dir2 = vec2$t.subtract(v12, newpoints[subdivideBase + 1], newpoints[subdivideBase]);
      vec2$t.normalize(dir2, dir2);
      const sinangle = vec2$t.cross(v3, dir1, dir2);
      if (Math.abs(sinangle[2]) > maxsinangle) {
        const t0 = newpointsT[subdivideBase - 1];
        const t1 = newpointsT[subdivideBase + 1];
        const newt0 = t0 + (t1 - t0) * 1 / 3;
        const newt1 = t0 + (t1 - t0) * 2 / 3;
        const point0 = getPointForT(newt0);
        const point1 = getPointForT(newt1);
        newpoints.splice(subdivideBase, 1, point0, point1);
        newpointsT.splice(subdivideBase, 1, newt0, newt1);
        subdivideBase--;
        if (subdivideBase < 1)
          subdivideBase = 1;
      } else {
        ++subdivideBase;
      }
    }
    newpoints.shift();
    const result = appendPoints(newpoints, geometry);
    result.lastBezierControlPoint = controlPoints[controlPoints.length - 2];
    return result;
  };
  var appendBezier_1 = appendBezier;
  const vec2$s = vec2$E;
  const toPoints$1 = toPoints_1;
  const equals$4 = (a, b) => {
    if (a.isClosed !== b.isClosed) {
      return false;
    }
    if (a.points.length !== b.points.length) {
      return false;
    }
    const apoints = toPoints$1(a);
    const bpoints = toPoints$1(b);
    const length2 = apoints.length;
    let offset2 = 0;
    do {
      let unequal = false;
      for (let i = 0; i < length2; i++) {
        if (!vec2$s.equals(apoints[i], bpoints[(i + offset2) % length2])) {
          unequal = true;
          break;
        }
      }
      if (unequal === false) {
        return true;
      }
      if (!a.isClosed) {
        return false;
      }
    } while (++offset2 < length2);
    return false;
  };
  var equals_1$3 = equals$4;
  const mat4$e = mat4$r;
  const vec2$r = vec2$E;
  const create$f = create_1$5;
  const fromCompactBinary = (data) => {
    if (data[0] !== 2)
      throw new Error("invalid compact binary data");
    const created = create$f();
    created.transforms = mat4$e.clone(data.slice(1, 17));
    created.isClosed = !!data[17];
    for (let i = 22; i < data.length; i += 2) {
      const point = vec2$r.fromValues(data[i], data[i + 1]);
      created.points.push(point);
    }
    if (data[18] >= 0) {
      created.color = [data[18], data[19], data[20], data[21]];
    }
    return created;
  };
  var fromCompactBinary_1 = fromCompactBinary;
  const isA$2 = (object) => {
    if (object && typeof object === "object") {
      if ("points" in object && "transforms" in object && "isClosed" in object) {
        if (Array.isArray(object.points) && "length" in object.transforms) {
          return true;
        }
      }
    }
    return false;
  };
  var isA_1$1 = isA$2;
  const clone$3 = clone_1$3;
  const reverse$3 = (geometry) => {
    const cloned = clone$3(geometry);
    cloned.points = geometry.points.slice().reverse();
    return cloned;
  };
  var reverse_1$3 = reverse$3;
  const vec2$q = vec2$E;
  const toPoints = toPoints_1;
  const toString$3 = (geometry) => {
    const points = toPoints(geometry);
    let result = "path (" + points.length + " points, " + geometry.isClosed + "):\n[\n";
    points.forEach((point) => {
      result += "  " + vec2$q.toString(point) + ",\n";
    });
    result += "]\n";
    return result;
  };
  var toString_1$3 = toString$3;
  const toCompactBinary = (geometry) => {
    const points = geometry.points;
    const transforms2 = geometry.transforms;
    let color = [-1, -1, -1, -1];
    if (geometry.color)
      color = geometry.color;
    const compacted = new Float32Array(1 + 16 + 1 + 4 + points.length * 2);
    compacted[0] = 2;
    compacted[1] = transforms2[0];
    compacted[2] = transforms2[1];
    compacted[3] = transforms2[2];
    compacted[4] = transforms2[3];
    compacted[5] = transforms2[4];
    compacted[6] = transforms2[5];
    compacted[7] = transforms2[6];
    compacted[8] = transforms2[7];
    compacted[9] = transforms2[8];
    compacted[10] = transforms2[9];
    compacted[11] = transforms2[10];
    compacted[12] = transforms2[11];
    compacted[13] = transforms2[12];
    compacted[14] = transforms2[13];
    compacted[15] = transforms2[14];
    compacted[16] = transforms2[15];
    compacted[17] = geometry.isClosed ? 1 : 0;
    compacted[18] = color[0];
    compacted[19] = color[1];
    compacted[20] = color[2];
    compacted[21] = color[3];
    for (let j = 0; j < points.length; j++) {
      const ci = j * 2 + 22;
      const point = points[j];
      compacted[ci] = point[0];
      compacted[ci + 1] = point[1];
    }
    return compacted;
  };
  var toCompactBinary_1 = toCompactBinary;
  const mat4$d = mat4$r;
  const transform$4 = (matrix, geometry) => {
    const transforms2 = mat4$d.multiply(mat4$d.create(), matrix, geometry.transforms);
    return Object.assign({}, geometry, { transforms: transforms2 });
  };
  var transform_1$4 = transform$4;
  const vec2$p = vec2$E;
  const isA$1 = isA_1$1;
  const validate = (object) => {
    if (!isA$1(object)) {
      throw new Error("invalid path2 structure");
    }
    if (object.points.length > 1) {
      for (let i = 0; i < object.points.length; i++) {
        if (vec2$p.equals(object.points[i], object.points[(i + 1) % object.points.length])) {
          throw new Error(`path2 duplicate points ${object.points[i]}`);
        }
      }
    }
    object.points.forEach((point) => {
      if (!point.every(Number.isFinite)) {
        throw new Error(`path2 invalid point ${point}`);
      }
    });
    if (!object.transforms.every(Number.isFinite)) {
      throw new Error(`path2 invalid transforms ${object.transforms}`);
    }
  };
  var validate_1 = validate;
  var path2$u = {
    appendArc: appendArc_1,
    appendBezier: appendBezier_1,
    appendPoints: appendPoints_1,
    clone: clone_1$3,
    close: close_1,
    concat: concat_1,
    create: create_1$5,
    equals: equals_1$3,
    fromPoints: fromPoints_1$3,
    fromCompactBinary: fromCompactBinary_1,
    isA: isA_1$1,
    reverse: reverse_1$3,
    toPoints: toPoints_1,
    toString: toString_1$3,
    toCompactBinary: toCompactBinary_1,
    transform: transform_1$4,
    validate: validate_1
  };
  const flatten$K = flatten_1;
  const geom2$J = geom2$K;
  const geom3$J = geom3$K;
  const path2$t = path2$u;
  const poly3$r = poly3$A;
  const colorGeom2 = (color, object) => {
    const newgeom2 = geom2$J.clone(object);
    newgeom2.color = color;
    return newgeom2;
  };
  const colorGeom3 = (color, object) => {
    const newgeom3 = geom3$J.clone(object);
    newgeom3.color = color;
    return newgeom3;
  };
  const colorPath2 = (color, object) => {
    const newpath2 = path2$t.clone(object);
    newpath2.color = color;
    return newpath2;
  };
  const colorPoly3 = (color, object) => {
    const newpoly = poly3$r.clone(object);
    newpoly.color = color;
    return newpoly;
  };
  const colorize = (color, ...objects) => {
    if (!Array.isArray(color))
      throw new Error("color must be an array");
    if (color.length < 3)
      throw new Error("color must contain R, G and B values");
    if (color.length === 3)
      color = [color[0], color[1], color[2], 1];
    objects = flatten$K(objects);
    if (objects.length === 0)
      throw new Error("wrong number of arguments");
    const results = objects.map((object) => {
      if (geom2$J.isA(object))
        return colorGeom2(color, object);
      if (geom3$J.isA(object))
        return colorGeom3(color, object);
      if (path2$t.isA(object))
        return colorPath2(color, object);
      if (poly3$r.isA(object))
        return colorPoly3(color, object);
      object.color = color;
      return object;
    });
    return results.length === 1 ? results[0] : results;
  };
  var colorize_1 = colorize;
  const cssColors$1 = {
    // basic color keywords
    black: [0 / 255, 0 / 255, 0 / 255],
    silver: [192 / 255, 192 / 255, 192 / 255],
    gray: [128 / 255, 128 / 255, 128 / 255],
    white: [255 / 255, 255 / 255, 255 / 255],
    maroon: [128 / 255, 0 / 255, 0 / 255],
    red: [255 / 255, 0 / 255, 0 / 255],
    purple: [128 / 255, 0 / 255, 128 / 255],
    fuchsia: [255 / 255, 0 / 255, 255 / 255],
    green: [0 / 255, 128 / 255, 0 / 255],
    lime: [0 / 255, 255 / 255, 0 / 255],
    olive: [128 / 255, 128 / 255, 0 / 255],
    yellow: [255 / 255, 255 / 255, 0 / 255],
    navy: [0 / 255, 0 / 255, 128 / 255],
    blue: [0 / 255, 0 / 255, 255 / 255],
    teal: [0 / 255, 128 / 255, 128 / 255],
    aqua: [0 / 255, 255 / 255, 255 / 255],
    // extended color keywords
    aliceblue: [240 / 255, 248 / 255, 255 / 255],
    antiquewhite: [250 / 255, 235 / 255, 215 / 255],
    // 'aqua': [ 0 / 255, 255 / 255, 255 / 255 ],
    aquamarine: [127 / 255, 255 / 255, 212 / 255],
    azure: [240 / 255, 255 / 255, 255 / 255],
    beige: [245 / 255, 245 / 255, 220 / 255],
    bisque: [255 / 255, 228 / 255, 196 / 255],
    // 'black': [ 0 / 255, 0 / 255, 0 / 255 ],
    blanchedalmond: [255 / 255, 235 / 255, 205 / 255],
    // 'blue': [ 0 / 255, 0 / 255, 255 / 255 ],
    blueviolet: [138 / 255, 43 / 255, 226 / 255],
    brown: [165 / 255, 42 / 255, 42 / 255],
    burlywood: [222 / 255, 184 / 255, 135 / 255],
    cadetblue: [95 / 255, 158 / 255, 160 / 255],
    chartreuse: [127 / 255, 255 / 255, 0 / 255],
    chocolate: [210 / 255, 105 / 255, 30 / 255],
    coral: [255 / 255, 127 / 255, 80 / 255],
    cornflowerblue: [100 / 255, 149 / 255, 237 / 255],
    cornsilk: [255 / 255, 248 / 255, 220 / 255],
    crimson: [220 / 255, 20 / 255, 60 / 255],
    cyan: [0 / 255, 255 / 255, 255 / 255],
    darkblue: [0 / 255, 0 / 255, 139 / 255],
    darkcyan: [0 / 255, 139 / 255, 139 / 255],
    darkgoldenrod: [184 / 255, 134 / 255, 11 / 255],
    darkgray: [169 / 255, 169 / 255, 169 / 255],
    darkgreen: [0 / 255, 100 / 255, 0 / 255],
    darkgrey: [169 / 255, 169 / 255, 169 / 255],
    darkkhaki: [189 / 255, 183 / 255, 107 / 255],
    darkmagenta: [139 / 255, 0 / 255, 139 / 255],
    darkolivegreen: [85 / 255, 107 / 255, 47 / 255],
    darkorange: [255 / 255, 140 / 255, 0 / 255],
    darkorchid: [153 / 255, 50 / 255, 204 / 255],
    darkred: [139 / 255, 0 / 255, 0 / 255],
    darksalmon: [233 / 255, 150 / 255, 122 / 255],
    darkseagreen: [143 / 255, 188 / 255, 143 / 255],
    darkslateblue: [72 / 255, 61 / 255, 139 / 255],
    darkslategray: [47 / 255, 79 / 255, 79 / 255],
    darkslategrey: [47 / 255, 79 / 255, 79 / 255],
    darkturquoise: [0 / 255, 206 / 255, 209 / 255],
    darkviolet: [148 / 255, 0 / 255, 211 / 255],
    deeppink: [255 / 255, 20 / 255, 147 / 255],
    deepskyblue: [0 / 255, 191 / 255, 255 / 255],
    dimgray: [105 / 255, 105 / 255, 105 / 255],
    dimgrey: [105 / 255, 105 / 255, 105 / 255],
    dodgerblue: [30 / 255, 144 / 255, 255 / 255],
    firebrick: [178 / 255, 34 / 255, 34 / 255],
    floralwhite: [255 / 255, 250 / 255, 240 / 255],
    forestgreen: [34 / 255, 139 / 255, 34 / 255],
    // 'fuchsia': [ 255 / 255, 0 / 255, 255 / 255 ],
    gainsboro: [220 / 255, 220 / 255, 220 / 255],
    ghostwhite: [248 / 255, 248 / 255, 255 / 255],
    gold: [255 / 255, 215 / 255, 0 / 255],
    goldenrod: [218 / 255, 165 / 255, 32 / 255],
    // 'gray': [ 128 / 255, 128 / 255, 128 / 255 ],
    // 'green': [ 0 / 255, 128 / 255, 0 / 255 ],
    greenyellow: [173 / 255, 255 / 255, 47 / 255],
    grey: [128 / 255, 128 / 255, 128 / 255],
    honeydew: [240 / 255, 255 / 255, 240 / 255],
    hotpink: [255 / 255, 105 / 255, 180 / 255],
    indianred: [205 / 255, 92 / 255, 92 / 255],
    indigo: [75 / 255, 0 / 255, 130 / 255],
    ivory: [255 / 255, 255 / 255, 240 / 255],
    khaki: [240 / 255, 230 / 255, 140 / 255],
    lavender: [230 / 255, 230 / 255, 250 / 255],
    lavenderblush: [255 / 255, 240 / 255, 245 / 255],
    lawngreen: [124 / 255, 252 / 255, 0 / 255],
    lemonchiffon: [255 / 255, 250 / 255, 205 / 255],
    lightblue: [173 / 255, 216 / 255, 230 / 255],
    lightcoral: [240 / 255, 128 / 255, 128 / 255],
    lightcyan: [224 / 255, 255 / 255, 255 / 255],
    lightgoldenrodyellow: [250 / 255, 250 / 255, 210 / 255],
    lightgray: [211 / 255, 211 / 255, 211 / 255],
    lightgreen: [144 / 255, 238 / 255, 144 / 255],
    lightgrey: [211 / 255, 211 / 255, 211 / 255],
    lightpink: [255 / 255, 182 / 255, 193 / 255],
    lightsalmon: [255 / 255, 160 / 255, 122 / 255],
    lightseagreen: [32 / 255, 178 / 255, 170 / 255],
    lightskyblue: [135 / 255, 206 / 255, 250 / 255],
    lightslategray: [119 / 255, 136 / 255, 153 / 255],
    lightslategrey: [119 / 255, 136 / 255, 153 / 255],
    lightsteelblue: [176 / 255, 196 / 255, 222 / 255],
    lightyellow: [255 / 255, 255 / 255, 224 / 255],
    // 'lime': [ 0 / 255, 255 / 255, 0 / 255 ],
    limegreen: [50 / 255, 205 / 255, 50 / 255],
    linen: [250 / 255, 240 / 255, 230 / 255],
    magenta: [255 / 255, 0 / 255, 255 / 255],
    // 'maroon': [ 128 / 255, 0 / 255, 0 / 255 ],
    mediumaquamarine: [102 / 255, 205 / 255, 170 / 255],
    mediumblue: [0 / 255, 0 / 255, 205 / 255],
    mediumorchid: [186 / 255, 85 / 255, 211 / 255],
    mediumpurple: [147 / 255, 112 / 255, 219 / 255],
    mediumseagreen: [60 / 255, 179 / 255, 113 / 255],
    mediumslateblue: [123 / 255, 104 / 255, 238 / 255],
    mediumspringgreen: [0 / 255, 250 / 255, 154 / 255],
    mediumturquoise: [72 / 255, 209 / 255, 204 / 255],
    mediumvioletred: [199 / 255, 21 / 255, 133 / 255],
    midnightblue: [25 / 255, 25 / 255, 112 / 255],
    mintcream: [245 / 255, 255 / 255, 250 / 255],
    mistyrose: [255 / 255, 228 / 255, 225 / 255],
    moccasin: [255 / 255, 228 / 255, 181 / 255],
    navajowhite: [255 / 255, 222 / 255, 173 / 255],
    // 'navy': [ 0 / 255, 0 / 255, 128 / 255 ],
    oldlace: [253 / 255, 245 / 255, 230 / 255],
    // 'olive': [ 128 / 255, 128 / 255, 0 / 255 ],
    olivedrab: [107 / 255, 142 / 255, 35 / 255],
    orange: [255 / 255, 165 / 255, 0 / 255],
    orangered: [255 / 255, 69 / 255, 0 / 255],
    orchid: [218 / 255, 112 / 255, 214 / 255],
    palegoldenrod: [238 / 255, 232 / 255, 170 / 255],
    palegreen: [152 / 255, 251 / 255, 152 / 255],
    paleturquoise: [175 / 255, 238 / 255, 238 / 255],
    palevioletred: [219 / 255, 112 / 255, 147 / 255],
    papayawhip: [255 / 255, 239 / 255, 213 / 255],
    peachpuff: [255 / 255, 218 / 255, 185 / 255],
    peru: [205 / 255, 133 / 255, 63 / 255],
    pink: [255 / 255, 192 / 255, 203 / 255],
    plum: [221 / 255, 160 / 255, 221 / 255],
    powderblue: [176 / 255, 224 / 255, 230 / 255],
    // 'purple': [ 128 / 255, 0 / 255, 128 / 255 ],
    // 'red': [ 255 / 255, 0 / 255, 0 / 255 ],
    rosybrown: [188 / 255, 143 / 255, 143 / 255],
    royalblue: [65 / 255, 105 / 255, 225 / 255],
    saddlebrown: [139 / 255, 69 / 255, 19 / 255],
    salmon: [250 / 255, 128 / 255, 114 / 255],
    sandybrown: [244 / 255, 164 / 255, 96 / 255],
    seagreen: [46 / 255, 139 / 255, 87 / 255],
    seashell: [255 / 255, 245 / 255, 238 / 255],
    sienna: [160 / 255, 82 / 255, 45 / 255],
    // 'silver': [ 192 / 255, 192 / 255, 192 / 255 ],
    skyblue: [135 / 255, 206 / 255, 235 / 255],
    slateblue: [106 / 255, 90 / 255, 205 / 255],
    slategray: [112 / 255, 128 / 255, 144 / 255],
    slategrey: [112 / 255, 128 / 255, 144 / 255],
    snow: [255 / 255, 250 / 255, 250 / 255],
    springgreen: [0 / 255, 255 / 255, 127 / 255],
    steelblue: [70 / 255, 130 / 255, 180 / 255],
    tan: [210 / 255, 180 / 255, 140 / 255],
    // 'teal': [ 0 / 255, 128 / 255, 128 / 255 ],
    thistle: [216 / 255, 191 / 255, 216 / 255],
    tomato: [255 / 255, 99 / 255, 71 / 255],
    turquoise: [64 / 255, 224 / 255, 208 / 255],
    violet: [238 / 255, 130 / 255, 238 / 255],
    wheat: [245 / 255, 222 / 255, 179 / 255],
    // 'white': [ 255 / 255, 255 / 255, 255 / 255 ],
    whitesmoke: [245 / 255, 245 / 255, 245 / 255],
    // 'yellow': [ 255 / 255, 255 / 255, 0 / 255 ],
    yellowgreen: [154 / 255, 205 / 255, 50 / 255]
  };
  var cssColors_1 = cssColors$1;
  const cssColors = cssColors_1;
  const colorNameToRgb = (s) => cssColors[s.toLowerCase()];
  var colorNameToRgb_1 = colorNameToRgb;
  const hexToRgb = (notation) => {
    notation = notation.replace("#", "");
    if (notation.length < 6)
      throw new Error("the given notation must contain 3 or more hex values");
    const r = parseInt(notation.substring(0, 2), 16) / 255;
    const g = parseInt(notation.substring(2, 4), 16) / 255;
    const b = parseInt(notation.substring(4, 6), 16) / 255;
    if (notation.length >= 8) {
      const a = parseInt(notation.substring(6, 8), 16) / 255;
      return [r, g, b, a];
    }
    return [r, g, b];
  };
  var hexToRgb_1 = hexToRgb;
  const hueToColorComponent$1 = (p, q, t) => {
    if (t < 0)
      t += 1;
    if (t > 1)
      t -= 1;
    if (t < 1 / 6)
      return p + (q - p) * 6 * t;
    if (t < 1 / 2)
      return q;
    if (t < 2 / 3)
      return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  var hueToColorComponent_1 = hueToColorComponent$1;
  const flatten$J = flatten_1;
  const hueToColorComponent = hueToColorComponent_1;
  const hslToRgb = (...values) => {
    values = flatten$J(values);
    if (values.length < 3)
      throw new Error("values must contain H, S and L values");
    const h = values[0];
    const s = values[1];
    const l = values[2];
    let r = l;
    let g = l;
    let b = l;
    if (s !== 0) {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hueToColorComponent(p, q, h + 1 / 3);
      g = hueToColorComponent(p, q, h);
      b = hueToColorComponent(p, q, h - 1 / 3);
    }
    if (values.length > 3) {
      const a = values[3];
      return [r, g, b, a];
    }
    return [r, g, b];
  };
  var hslToRgb_1 = hslToRgb;
  const flatten$I = flatten_1;
  const hsvToRgb = (...values) => {
    values = flatten$I(values);
    if (values.length < 3)
      throw new Error("values must contain H, S and V values");
    const h = values[0];
    const s = values[1];
    const v = values[2];
    let r = 0;
    let g = 0;
    let b = 0;
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0:
        r = v;
        g = t;
        b = p;
        break;
      case 1:
        r = q;
        g = v;
        b = p;
        break;
      case 2:
        r = p;
        g = v;
        b = t;
        break;
      case 3:
        r = p;
        g = q;
        b = v;
        break;
      case 4:
        r = t;
        g = p;
        b = v;
        break;
      case 5:
        r = v;
        g = p;
        b = q;
        break;
    }
    if (values.length > 3) {
      const a = values[3];
      return [r, g, b, a];
    }
    return [r, g, b];
  };
  var hsvToRgb_1 = hsvToRgb;
  const flatten$H = flatten_1;
  const rgbToHex = (...values) => {
    values = flatten$H(values);
    if (values.length < 3)
      throw new Error("values must contain R, G and B values");
    const r = values[0] * 255;
    const g = values[1] * 255;
    const b = values[2] * 255;
    let s = `#${Number(16777216 + r * 65536 + g * 256 + b).toString(16).substring(1, 7)}`;
    if (values.length > 3) {
      s = s + Number(values[3] * 255).toString(16);
    }
    return s;
  };
  var rgbToHex_1 = rgbToHex;
  const flatten$G = flatten_1;
  const rgbToHsl = (...values) => {
    values = flatten$G(values);
    if (values.length < 3)
      throw new Error("values must contain R, G and B values");
    const r = values[0];
    const g = values[1];
    const b = values[2];
    const max2 = Math.max(r, g, b);
    const min2 = Math.min(r, g, b);
    let h;
    let s;
    const l = (max2 + min2) / 2;
    if (max2 === min2) {
      h = s = 0;
    } else {
      const d = max2 - min2;
      s = l > 0.5 ? d / (2 - max2 - min2) : d / (max2 + min2);
      switch (max2) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    if (values.length > 3) {
      const a = values[3];
      return [h, s, l, a];
    }
    return [h, s, l];
  };
  var rgbToHsl_1 = rgbToHsl;
  const flatten$F = flatten_1;
  const rgbToHsv = (...values) => {
    values = flatten$F(values);
    if (values.length < 3)
      throw new Error("values must contain R, G and B values");
    const r = values[0];
    const g = values[1];
    const b = values[2];
    const max2 = Math.max(r, g, b);
    const min2 = Math.min(r, g, b);
    let h;
    const v = max2;
    const d = max2 - min2;
    const s = max2 === 0 ? 0 : d / max2;
    if (max2 === min2) {
      h = 0;
    } else {
      switch (max2) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    if (values.length > 3) {
      const a = values[3];
      return [h, s, v, a];
    }
    return [h, s, v];
  };
  var rgbToHsv_1 = rgbToHsv;
  var colors = {
    colorize: colorize_1,
    colorNameToRgb: colorNameToRgb_1,
    cssColors: cssColors_1,
    hexToRgb: hexToRgb_1,
    hslToRgb: hslToRgb_1,
    hsvToRgb: hsvToRgb_1,
    hueToColorComponent: hueToColorComponent_1,
    rgbToHex: rgbToHex_1,
    rgbToHsl: rgbToHsl_1,
    rgbToHsv: rgbToHsv_1
  };
  const create$e = (points) => {
    if (!Array.isArray(points))
      throw new Error("Bezier points must be a valid array/");
    if (points.length < 2)
      throw new Error("Bezier points must contain at least 2 values.");
    const pointType = getPointType(points);
    return {
      points,
      pointType,
      dimensions: pointType === "float_single" ? 0 : points[0].length,
      permutations: getPermutations(points.length - 1),
      tangentPermutations: getPermutations(points.length - 2)
    };
  };
  const getPointType = function(points) {
    let firstPointType = null;
    points.forEach((point) => {
      let pType = "";
      if (Number.isFinite(point)) {
        pType = "float_single";
      } else if (Array.isArray(point)) {
        point.forEach((val) => {
          if (!Number.isFinite(val))
            throw new Error("Bezier point values must all be numbers.");
        });
        pType = "float_" + point.length;
      } else
        throw new Error("Bezier points must all be numbers or arrays of number.");
      if (firstPointType == null) {
        firstPointType = pType;
      } else {
        if (firstPointType !== pType) {
          throw new Error("Bezier points must be either all numbers or all arrays of numbers of the same size.");
        }
      }
    });
    return firstPointType;
  };
  const getPermutations = function(c) {
    const permutations = [];
    for (let i = 0; i <= c; i++) {
      permutations.push(factorial(c) / (factorial(i) * factorial(c - i)));
    }
    return permutations;
  };
  const factorial = function(b) {
    let out = 1;
    for (let i = 2; i <= b; i++) {
      out *= i;
    }
    return out;
  };
  var create_1$4 = create$e;
  const valueAt = (t, bezier2) => {
    if (t < 0 || t > 1) {
      throw new Error("Bezier valueAt() input must be between 0 and 1");
    }
    if (bezier2.pointType === "float_single") {
      return bezierFunction(bezier2, bezier2.points, t);
    } else {
      const result = [];
      for (let i = 0; i < bezier2.dimensions; i++) {
        const singleDimensionPoints = [];
        for (let j = 0; j < bezier2.points.length; j++) {
          singleDimensionPoints.push(bezier2.points[j][i]);
        }
        result.push(bezierFunction(bezier2, singleDimensionPoints, t));
      }
      return result;
    }
  };
  const bezierFunction = function(bezier2, p, t) {
    const n = p.length - 1;
    let result = 0;
    for (let i = 0; i <= n; i++) {
      result += bezier2.permutations[i] * Math.pow(1 - t, n - i) * Math.pow(t, i) * p[i];
    }
    return result;
  };
  var valueAt_1 = valueAt;
  const tangentAt = (t, bezier2) => {
    if (t < 0 || t > 1) {
      throw new Error("Bezier tangentAt() input must be between 0 and 1");
    }
    if (bezier2.pointType === "float_single") {
      return bezierTangent(bezier2, bezier2.points, t);
    } else {
      const result = [];
      for (let i = 0; i < bezier2.dimensions; i++) {
        const singleDimensionPoints = [];
        for (let j = 0; j < bezier2.points.length; j++) {
          singleDimensionPoints.push(bezier2.points[j][i]);
        }
        result.push(bezierTangent(bezier2, singleDimensionPoints, t));
      }
      return result;
    }
  };
  const bezierTangent = function(bezier2, p, t) {
    const n = p.length - 1;
    let result = 0;
    for (let i = 0; i < n; i++) {
      const q = n * (p[i + 1] - p[i]);
      result += bezier2.tangentPermutations[i] * Math.pow(1 - t, n - 1 - i) * Math.pow(t, i) * q;
    }
    return result;
  };
  var tangentAt_1 = tangentAt;
  var bezier = {
    create: create_1$4,
    valueAt: valueAt_1,
    tangentAt: tangentAt_1
  };
  var curves = {
    bezier
  };
  const area$9 = (points) => {
    let area2 = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area2 += points[i][0] * points[j][1];
      area2 -= points[j][0] * points[i][1];
    }
    return area2 / 2;
  };
  var area_1 = area$9;
  const area$8 = area_1;
  const measureArea$3 = (polygon2) => area$8(polygon2.vertices);
  var measureArea_1$1 = measureArea$3;
  const create$d = (vertices) => {
    if (vertices === void 0 || vertices.length < 3) {
      vertices = [];
    }
    return { vertices };
  };
  var create_1$3 = create$d;
  const create$c = create_1$3;
  const flip$1 = (polygon2) => {
    const vertices = polygon2.vertices.slice().reverse();
    return create$c(vertices);
  };
  var flip_1 = flip$1;
  const measureArea$2 = measureArea_1$1;
  const flip = flip_1;
  const arePointsInside$1 = (points, polygon2) => {
    if (points.length === 0)
      return 0;
    const vertices = polygon2.vertices;
    if (vertices.length < 3)
      return 0;
    if (measureArea$2(polygon2) < 0) {
      polygon2 = flip(polygon2);
    }
    const sum = points.reduce((acc, point) => acc + isPointInside(point, vertices), 0);
    return sum === points.length ? 1 : 0;
  };
  const isPointInside = (point, polygon2) => {
    const numverts = polygon2.length;
    const tx = point[0];
    const ty = point[1];
    let vtx0 = polygon2[numverts - 1];
    let vtx1 = polygon2[0];
    let yflag0 = vtx0[1] > ty;
    let insideFlag = 0;
    let i = 0;
    for (let j = numverts + 1; --j; ) {
      const yflag1 = vtx1[1] > ty;
      if (yflag0 !== yflag1) {
        const xflag0 = vtx0[0] > tx;
        const xflag1 = vtx1[0] > tx;
        if (xflag0 && xflag1) {
          insideFlag = !insideFlag;
        } else {
          if (vtx1[0] - (vtx1[1] - ty) * (vtx0[0] - vtx1[0]) / (vtx0[1] - vtx1[1]) >= tx) {
            insideFlag = !insideFlag;
          }
        }
      }
      yflag0 = yflag1;
      vtx0 = vtx1;
      vtx1 = polygon2[++i];
    }
    return insideFlag;
  };
  var arePointsInside_1 = arePointsInside$1;
  var poly2$1 = {
    arePointsInside: arePointsInside_1,
    create: create_1$3,
    flip: flip_1,
    measureArea: measureArea_1$1
  };
  var geometries = {
    geom2: geom2$K,
    geom3: geom3$K,
    path2: path2$u,
    poly2: poly2$1,
    poly3: poly3$A
  };
  const create$b = () => [0, 1, 0];
  var create_1$2 = create$b;
  const create$a = create_1$2;
  const clone$2 = (line4) => {
    const out = create$a();
    out[0] = line4[0];
    out[1] = line4[1];
    out[2] = line4[2];
    return out;
  };
  var clone_1$2 = clone$2;
  const vec2$o = vec2$E;
  const direction$3 = (line4) => {
    const vector = vec2$o.normal(vec2$o.create(), line4);
    vec2$o.negate(vector, vector);
    return vector;
  };
  var direction_1$1 = direction$3;
  const vec2$n = vec2$E;
  const origin$4 = (line4) => vec2$n.scale(vec2$n.create(), line4, line4[2]);
  var origin_1$1 = origin$4;
  const vec2$m = vec2$E;
  const direction$2 = direction_1$1;
  const origin$3 = origin_1$1;
  const closestPoint$2 = (line4, point) => {
    const a = origin$3(line4);
    const b = direction$2(line4);
    const m1 = (b[1] - a[1]) / (b[0] - a[0]);
    const t1 = a[1] - m1 * a[0];
    const m2 = -1 / m1;
    const t2 = point[1] - m2 * point[0];
    const x = (t2 - t1) / (m1 - m2);
    const y = m1 * x + t1;
    const closest = vec2$m.fromValues(x, y);
    return closest;
  };
  var closestPoint_1$1 = closestPoint$2;
  const copy$3 = (out, line4) => {
    out[0] = line4[0];
    out[1] = line4[1];
    out[2] = line4[2];
    return out;
  };
  var copy_1$1 = copy$3;
  const vec2$l = vec2$E;
  const distanceToPoint$1 = (line4, point) => {
    let distance2 = vec2$l.dot(point, line4);
    distance2 = Math.abs(distance2 - line4[2]);
    return distance2;
  };
  var distanceToPoint_1$1 = distanceToPoint$1;
  const equals$3 = (line1, line22) => line1[0] === line22[0] && (line1[1] === line22[1] && line1[2] === line22[2]);
  var equals_1$2 = equals$3;
  const vec2$k = vec2$E;
  const fromPoints$3 = (out, point1, point2) => {
    const vector = vec2$k.subtract(vec2$k.create(), point2, point1);
    vec2$k.normal(vector, vector);
    vec2$k.normalize(vector, vector);
    const distance2 = vec2$k.dot(point1, vector);
    out[0] = vector[0];
    out[1] = vector[1];
    out[2] = distance2;
    return out;
  };
  var fromPoints_1$2 = fromPoints$3;
  const create$9 = create_1$2;
  const fromValues$1 = (x, y, d) => {
    const out = create$9();
    out[0] = x;
    out[1] = y;
    out[2] = d;
    return out;
  };
  var fromValues_1 = fromValues$1;
  const { NEPS: NEPS$1 } = constants$1;
  const aboutEqualNormals$3 = (a, b) => Math.abs(a[0] - b[0]) <= NEPS$1 && Math.abs(a[1] - b[1]) <= NEPS$1 && Math.abs(a[2] - b[2]) <= NEPS$1;
  var aboutEqualNormals_1 = aboutEqualNormals$3;
  const interpolateBetween2DPointsForY$1 = (point1, point2, y) => {
    let f1 = y - point1[1];
    let f2 = point2[1] - point1[1];
    if (f2 < 0) {
      f1 = -f1;
      f2 = -f2;
    }
    let t;
    if (f1 <= 0) {
      t = 0;
    } else if (f1 >= f2) {
      t = 1;
    } else if (f2 < 1e-10) {
      t = 0.5;
    } else {
      t = f1 / f2;
    }
    const result = point1[0] + t * (point2[0] - point1[0]);
    return result;
  };
  var interpolateBetween2DPointsForY_1 = interpolateBetween2DPointsForY$1;
  const intersect$4 = (p1, p2, p3, p4) => {
    if (p1[0] === p2[0] && p1[1] === p2[1] || p3[0] === p4[0] && p3[1] === p4[1]) {
      return void 0;
    }
    const denominator = (p4[1] - p3[1]) * (p2[0] - p1[0]) - (p4[0] - p3[0]) * (p2[1] - p1[1]);
    if (Math.abs(denominator) < Number.MIN_VALUE) {
      return void 0;
    }
    const ua = ((p4[0] - p3[0]) * (p1[1] - p3[1]) - (p4[1] - p3[1]) * (p1[0] - p3[0])) / denominator;
    const ub = ((p2[0] - p1[0]) * (p1[1] - p3[1]) - (p2[1] - p1[1]) * (p1[0] - p3[0])) / denominator;
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
      return void 0;
    }
    const x = p1[0] + ua * (p2[0] - p1[0]);
    const y = p1[1] + ua * (p2[1] - p1[1]);
    return [x, y];
  };
  var intersect_1$1 = intersect$4;
  const solve2Linear$2 = (a, b, c, d, u, v) => {
    const det = a * d - b * c;
    const invdet = 1 / det;
    let x = u * d - b * v;
    let y = -u * c + a * v;
    x *= invdet;
    y *= invdet;
    return [x, y];
  };
  var solve2Linear_1 = solve2Linear$2;
  var utils$1 = {
    aboutEqualNormals: aboutEqualNormals_1,
    area: area_1,
    cos: trigonometry.cos,
    interpolateBetween2DPointsForY: interpolateBetween2DPointsForY_1,
    intersect: intersect_1$1,
    sin: trigonometry.sin,
    solve2Linear: solve2Linear_1
  };
  const vec2$j = vec2$E;
  const { solve2Linear: solve2Linear$1 } = utils$1;
  const intersectToLine = (line1, line22) => {
    const point = solve2Linear$1(line1[0], line1[1], line22[0], line22[1], line1[2], line22[2]);
    return vec2$j.clone(point);
  };
  var intersectPointOfLines = intersectToLine;
  const vec2$i = vec2$E;
  const copy$2 = copy_1$1;
  const fromValues = fromValues_1;
  const reverse$2 = (out, line4) => {
    const normal2 = vec2$i.negate(vec2$i.create(), line4);
    const distance2 = -line4[2];
    return copy$2(out, fromValues(normal2[0], normal2[1], distance2));
  };
  var reverse_1$2 = reverse$2;
  const toString$2 = (line4) => `line2: (${line4[0].toFixed(7)}, ${line4[1].toFixed(7)}, ${line4[2].toFixed(7)})`;
  var toString_1$2 = toString$2;
  const vec2$h = vec2$E;
  const fromPoints$2 = fromPoints_1$2;
  const origin$2 = origin_1$1;
  const direction$1 = direction_1$1;
  const transform$3 = (out, line4, matrix) => {
    const org = origin$2(line4);
    const dir = direction$1(line4);
    vec2$h.transform(org, org, matrix);
    vec2$h.transform(dir, dir, matrix);
    return fromPoints$2(out, org, dir);
  };
  var transform_1$3 = transform$3;
  const origin$1 = origin_1$1;
  const xAtY = (line4, y) => {
    let x = (line4[2] - line4[1] * y) / line4[0];
    if (Number.isNaN(x)) {
      const org = origin$1(line4);
      x = org[0];
    }
    return x;
  };
  var xAtY_1 = xAtY;
  var line2$2 = {
    clone: clone_1$2,
    closestPoint: closestPoint_1$1,
    copy: copy_1$1,
    create: create_1$2,
    direction: direction_1$1,
    distanceToPoint: distanceToPoint_1$1,
    equals: equals_1$2,
    fromPoints: fromPoints_1$2,
    fromValues: fromValues_1,
    intersectPointOfLines,
    origin: origin_1$1,
    reverse: reverse_1$2,
    toString: toString_1$2,
    transform: transform_1$3,
    xAtY: xAtY_1
  };
  const vec3$G = vec3$Y;
  const create$8 = () => [
    vec3$G.fromValues(0, 0, 0),
    // origin
    vec3$G.fromValues(0, 0, 1)
    // direction
  ];
  var create_1$1 = create$8;
  const vec3$F = vec3$Y;
  const create$7 = create_1$1;
  const clone$1 = (line4) => {
    const out = create$7();
    vec3$F.copy(out[0], line4[0]);
    vec3$F.copy(out[1], line4[1]);
    return out;
  };
  var clone_1$1 = clone$1;
  const vec3$E = vec3$Y;
  const closestPoint$1 = (line4, point) => {
    const lpoint = line4[0];
    const ldirection = line4[1];
    const a = vec3$E.dot(vec3$E.subtract(vec3$E.create(), point, lpoint), ldirection);
    const b = vec3$E.dot(ldirection, ldirection);
    const t = a / b;
    const closestpoint = vec3$E.scale(vec3$E.create(), ldirection, t);
    vec3$E.add(closestpoint, closestpoint, lpoint);
    return closestpoint;
  };
  var closestPoint_1 = closestPoint$1;
  const vec3$D = vec3$Y;
  const copy$1 = (out, line4) => {
    vec3$D.copy(out[0], line4[0]);
    vec3$D.copy(out[1], line4[1]);
    return out;
  };
  var copy_1 = copy$1;
  const direction = (line4) => line4[1];
  var direction_1 = direction;
  const vec3$C = vec3$Y;
  const closestPoint = closestPoint_1;
  const distanceToPoint = (line4, point) => {
    const closest = closestPoint(line4, point);
    const distancevector = vec3$C.subtract(vec3$C.create(), point, closest);
    return vec3$C.length(distancevector);
  };
  var distanceToPoint_1 = distanceToPoint;
  const vec3$B = vec3$Y;
  const equals$2 = (line1, line22) => {
    if (!vec3$B.equals(line1[1], line22[1]))
      return false;
    if (!vec3$B.equals(line1[0], line22[0]))
      return false;
    return true;
  };
  var equals_1$1 = equals$2;
  const vec3$A = vec3$Y;
  const fromPointAndDirection$4 = (out, point, direction2) => {
    const unit = vec3$A.normalize(vec3$A.create(), direction2);
    vec3$A.copy(out[0], point);
    vec3$A.copy(out[1], unit);
    return out;
  };
  var fromPointAndDirection_1 = fromPointAndDirection$4;
  const vec3$z = vec3$Y;
  const { solve2Linear } = utils$1;
  const { EPS: EPS$e } = constants$1;
  const fromPointAndDirection$3 = fromPointAndDirection_1;
  const fromPlanes = (out, plane1, plane2) => {
    let direction2 = vec3$z.cross(vec3$z.create(), plane1, plane2);
    let length2 = vec3$z.length(direction2);
    if (length2 < EPS$e) {
      throw new Error("parallel planes do not intersect");
    }
    length2 = 1 / length2;
    direction2 = vec3$z.scale(direction2, direction2, length2);
    const absx = Math.abs(direction2[0]);
    const absy = Math.abs(direction2[1]);
    const absz = Math.abs(direction2[2]);
    let origin2;
    let r;
    if (absx >= absy && absx >= absz) {
      r = solve2Linear(plane1[1], plane1[2], plane2[1], plane2[2], plane1[3], plane2[3]);
      origin2 = vec3$z.fromValues(0, r[0], r[1]);
    } else if (absy >= absx && absy >= absz) {
      r = solve2Linear(plane1[0], plane1[2], plane2[0], plane2[2], plane1[3], plane2[3]);
      origin2 = vec3$z.fromValues(r[0], 0, r[1]);
    } else {
      r = solve2Linear(plane1[0], plane1[1], plane2[0], plane2[1], plane1[3], plane2[3]);
      origin2 = vec3$z.fromValues(r[0], r[1], 0);
    }
    return fromPointAndDirection$3(out, origin2, direction2);
  };
  var fromPlanes_1 = fromPlanes;
  const vec3$y = vec3$Y;
  const fromPointAndDirection$2 = fromPointAndDirection_1;
  const fromPoints$1 = (out, point1, point2) => {
    const direction2 = vec3$y.subtract(vec3$y.create(), point2, point1);
    return fromPointAndDirection$2(out, point1, direction2);
  };
  var fromPoints_1$1 = fromPoints$1;
  const vec3$x = vec3$Y;
  const intersectToPlane = (line4, plane2) => {
    const pnormal = plane2;
    const pw = plane2[3];
    const lpoint = line4[0];
    const ldirection = line4[1];
    const labda = (pw - vec3$x.dot(pnormal, lpoint)) / vec3$x.dot(pnormal, ldirection);
    const point = vec3$x.add(vec3$x.create(), lpoint, vec3$x.scale(vec3$x.create(), ldirection, labda));
    return point;
  };
  var intersectPointOfLineAndPlane = intersectToPlane;
  const origin = (line4) => line4[0];
  var origin_1 = origin;
  const vec3$w = vec3$Y;
  const fromPointAndDirection$1 = fromPointAndDirection_1;
  const reverse$1 = (out, line4) => {
    const point = vec3$w.clone(line4[0]);
    const direction2 = vec3$w.negate(vec3$w.create(), line4[1]);
    return fromPointAndDirection$1(out, point, direction2);
  };
  var reverse_1$1 = reverse$1;
  const toString$1 = (line4) => {
    const point = line4[0];
    const direction2 = line4[1];
    return `line3: point: (${point[0].toFixed(7)}, ${point[1].toFixed(7)}, ${point[2].toFixed(7)}) direction: (${direction2[0].toFixed(7)}, ${direction2[1].toFixed(7)}, ${direction2[2].toFixed(7)})`;
  };
  var toString_1$1 = toString$1;
  const vec3$v = vec3$Y;
  const fromPointAndDirection = fromPointAndDirection_1;
  const transform$2 = (out, line4, matrix) => {
    const point = line4[0];
    const direction2 = line4[1];
    const pointPlusDirection = vec3$v.add(vec3$v.create(), point, direction2);
    const newpoint = vec3$v.transform(vec3$v.create(), point, matrix);
    const newPointPlusDirection = vec3$v.transform(pointPlusDirection, pointPlusDirection, matrix);
    const newdirection = vec3$v.subtract(newPointPlusDirection, newPointPlusDirection, newpoint);
    return fromPointAndDirection(out, newpoint, newdirection);
  };
  var transform_1$2 = transform$2;
  var line3 = {
    clone: clone_1$1,
    closestPoint: closestPoint_1,
    copy: copy_1,
    create: create_1$1,
    direction: direction_1,
    distanceToPoint: distanceToPoint_1,
    equals: equals_1$1,
    fromPlanes: fromPlanes_1,
    fromPointAndDirection: fromPointAndDirection_1,
    fromPoints: fromPoints_1$1,
    intersectPointOfLineAndPlane,
    origin: origin_1,
    reverse: reverse_1$1,
    toString: toString_1$1,
    transform: transform_1$2
  };
  var maths = {
    constants: constants$1,
    line2: line2$2,
    line3,
    mat4: mat4$r,
    plane: plane$b,
    utils: utils$1,
    vec2: vec2$E,
    vec3: vec3$Y,
    vec4: vec4$1
  };
  const flatten$E = flatten_1;
  const geom2$I = geom2$K;
  const geom3$I = geom3$K;
  const path2$s = path2$u;
  const poly3$q = poly3$A;
  const cache$2 = /* @__PURE__ */ new WeakMap();
  const measureAreaOfPath2 = () => 0;
  const measureAreaOfGeom2 = (geometry) => {
    let area2 = cache$2.get(geometry);
    if (area2)
      return area2;
    const sides = geom2$I.toSides(geometry);
    area2 = sides.reduce((area3, side) => area3 + (side[0][0] * side[1][1] - side[0][1] * side[1][0]), 0);
    area2 *= 0.5;
    cache$2.set(geometry, area2);
    return area2;
  };
  const measureAreaOfGeom3 = (geometry) => {
    let area2 = cache$2.get(geometry);
    if (area2)
      return area2;
    const polygons = geom3$I.toPolygons(geometry);
    area2 = polygons.reduce((area3, polygon2) => area3 + poly3$q.measureArea(polygon2), 0);
    cache$2.set(geometry, area2);
    return area2;
  };
  const measureArea$1 = (...geometries2) => {
    geometries2 = flatten$E(geometries2);
    if (geometries2.length === 0)
      throw new Error("wrong number of arguments");
    const results = geometries2.map((geometry) => {
      if (path2$s.isA(geometry))
        return measureAreaOfPath2();
      if (geom2$I.isA(geometry))
        return measureAreaOfGeom2(geometry);
      if (geom3$I.isA(geometry))
        return measureAreaOfGeom3(geometry);
      return 0;
    });
    return results.length === 1 ? results[0] : results;
  };
  var measureArea_1 = measureArea$1;
  const flatten$D = flatten_1;
  const measureArea = measureArea_1;
  const measureAggregateArea = (...geometries2) => {
    geometries2 = flatten$D(geometries2);
    if (geometries2.length === 0)
      throw new Error("measureAggregateArea: no geometries supplied");
    const areas = measureArea(geometries2);
    if (geometries2.length === 1) {
      return areas;
    }
    const result = 0;
    return areas.reduce((result2, area2) => result2 + area2, result);
  };
  var measureAggregateArea_1 = measureAggregateArea;
  const flatten$C = flatten_1;
  const vec2$g = vec2$E;
  const vec3$u = vec3$Y;
  const geom2$H = geom2$K;
  const geom3$H = geom3$K;
  const path2$r = path2$u;
  const poly3$p = poly3$A;
  const cache$1 = /* @__PURE__ */ new WeakMap();
  const measureBoundingBoxOfPath2 = (geometry) => {
    let boundingBox = cache$1.get(geometry);
    if (boundingBox)
      return boundingBox;
    const points = path2$r.toPoints(geometry);
    let minpoint;
    if (points.length === 0) {
      minpoint = vec2$g.create();
    } else {
      minpoint = vec2$g.clone(points[0]);
    }
    let maxpoint = vec2$g.clone(minpoint);
    points.forEach((point) => {
      vec2$g.min(minpoint, minpoint, point);
      vec2$g.max(maxpoint, maxpoint, point);
    });
    minpoint = [minpoint[0], minpoint[1], 0];
    maxpoint = [maxpoint[0], maxpoint[1], 0];
    boundingBox = [minpoint, maxpoint];
    cache$1.set(geometry, boundingBox);
    return boundingBox;
  };
  const measureBoundingBoxOfGeom2 = (geometry) => {
    let boundingBox = cache$1.get(geometry);
    if (boundingBox)
      return boundingBox;
    const points = geom2$H.toPoints(geometry);
    let minpoint;
    if (points.length === 0) {
      minpoint = vec2$g.create();
    } else {
      minpoint = vec2$g.clone(points[0]);
    }
    let maxpoint = vec2$g.clone(minpoint);
    points.forEach((point) => {
      vec2$g.min(minpoint, minpoint, point);
      vec2$g.max(maxpoint, maxpoint, point);
    });
    minpoint = [minpoint[0], minpoint[1], 0];
    maxpoint = [maxpoint[0], maxpoint[1], 0];
    boundingBox = [minpoint, maxpoint];
    cache$1.set(geometry, boundingBox);
    return boundingBox;
  };
  const measureBoundingBoxOfGeom3 = (geometry) => {
    let boundingBox = cache$1.get(geometry);
    if (boundingBox)
      return boundingBox;
    const polygons = geom3$H.toPolygons(geometry);
    let minpoint = vec3$u.create();
    if (polygons.length > 0) {
      const points = poly3$p.toPoints(polygons[0]);
      vec3$u.copy(minpoint, points[0]);
    }
    let maxpoint = vec3$u.clone(minpoint);
    polygons.forEach((polygon2) => {
      poly3$p.toPoints(polygon2).forEach((point) => {
        vec3$u.min(minpoint, minpoint, point);
        vec3$u.max(maxpoint, maxpoint, point);
      });
    });
    minpoint = [minpoint[0], minpoint[1], minpoint[2]];
    maxpoint = [maxpoint[0], maxpoint[1], maxpoint[2]];
    boundingBox = [minpoint, maxpoint];
    cache$1.set(geometry, boundingBox);
    return boundingBox;
  };
  const measureBoundingBox$6 = (...geometries2) => {
    geometries2 = flatten$C(geometries2);
    if (geometries2.length === 0)
      throw new Error("wrong number of arguments");
    const results = geometries2.map((geometry) => {
      if (path2$r.isA(geometry))
        return measureBoundingBoxOfPath2(geometry);
      if (geom2$H.isA(geometry))
        return measureBoundingBoxOfGeom2(geometry);
      if (geom3$H.isA(geometry))
        return measureBoundingBoxOfGeom3(geometry);
      return [[0, 0, 0], [0, 0, 0]];
    });
    return results.length === 1 ? results[0] : results;
  };
  var measureBoundingBox_1 = measureBoundingBox$6;
  const flatten$B = flatten_1;
  const vec3min = min_1$1;
  const vec3max = max_1$1;
  const measureBoundingBox$5 = measureBoundingBox_1;
  const measureAggregateBoundingBox$2 = (...geometries2) => {
    geometries2 = flatten$B(geometries2);
    if (geometries2.length === 0)
      throw new Error("measureAggregateBoundingBox: no geometries supplied");
    const bounds = measureBoundingBox$5(geometries2);
    if (geometries2.length === 1) {
      return bounds;
    }
    const result = [[Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE], [-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE]];
    return bounds.reduce((result2, item) => {
      result2 = [vec3min(result2[0], result2[0], item[0]), vec3max(result2[1], result2[1], item[1])];
      return result2;
    }, result);
  };
  var measureAggregateBoundingBox_1 = measureAggregateBoundingBox$2;
  const { EPS: EPS$d } = constants$1;
  const calculateEpsilonFromBounds$2 = (bounds, dimensions) => {
    let total = 0;
    for (let i = 0; i < dimensions; i++) {
      total += bounds[1][i] - bounds[0][i];
    }
    return EPS$d * total / dimensions;
  };
  var calculateEpsilonFromBounds_1 = calculateEpsilonFromBounds$2;
  const flatten$A = flatten_1;
  const measureAggregateBoundingBox$1 = measureAggregateBoundingBox_1;
  const calculateEpsilonFromBounds$1 = calculateEpsilonFromBounds_1;
  const { geom2: geom2$G, geom3: geom3$G, path2: path2$q } = geometries;
  const measureAggregateEpsilon = (...geometries2) => {
    geometries2 = flatten$A(geometries2);
    if (geometries2.length === 0)
      throw new Error("measureAggregateEpsilon: no geometries supplied");
    const bounds = measureAggregateBoundingBox$1(geometries2);
    let dimensions = 0;
    dimensions = geometries2.reduce((dimensions2, geometry) => {
      if (path2$q.isA(geometry) || geom2$G.isA(geometry))
        return Math.max(dimensions2, 2);
      if (geom3$G.isA(geometry))
        return Math.max(dimensions2, 3);
      return 0;
    }, dimensions);
    return calculateEpsilonFromBounds$1(bounds, dimensions);
  };
  var measureAggregateEpsilon_1 = measureAggregateEpsilon;
  const flatten$z = flatten_1;
  const geom2$F = geom2$K;
  const geom3$F = geom3$K;
  const path2$p = path2$u;
  const poly3$o = poly3$A;
  const cache = /* @__PURE__ */ new WeakMap();
  const measureVolumeOfPath2 = () => 0;
  const measureVolumeOfGeom2 = () => 0;
  const measureVolumeOfGeom3 = (geometry) => {
    let volume = cache.get(geometry);
    if (volume)
      return volume;
    const polygons = geom3$F.toPolygons(geometry);
    volume = polygons.reduce((volume2, polygon2) => volume2 + poly3$o.measureSignedVolume(polygon2), 0);
    cache.set(geometry, volume);
    return volume;
  };
  const measureVolume$1 = (...geometries2) => {
    geometries2 = flatten$z(geometries2);
    if (geometries2.length === 0)
      throw new Error("wrong number of arguments");
    const results = geometries2.map((geometry) => {
      if (path2$p.isA(geometry))
        return measureVolumeOfPath2();
      if (geom2$F.isA(geometry))
        return measureVolumeOfGeom2();
      if (geom3$F.isA(geometry))
        return measureVolumeOfGeom3(geometry);
      return 0;
    });
    return results.length === 1 ? results[0] : results;
  };
  var measureVolume_1 = measureVolume$1;
  const flatten$y = flatten_1;
  const measureVolume = measureVolume_1;
  const measureAggregateVolume = (...geometries2) => {
    geometries2 = flatten$y(geometries2);
    if (geometries2.length === 0)
      throw new Error("measureAggregateVolume: no geometries supplied");
    const volumes = measureVolume(geometries2);
    if (geometries2.length === 1) {
      return volumes;
    }
    const result = 0;
    return volumes.reduce((result2, volume) => result2 + volume, result);
  };
  var measureAggregateVolume_1 = measureAggregateVolume;
  const flatten$x = flatten_1;
  const vec2$f = vec2$E;
  const vec3$t = vec3$Y;
  const geom2$E = geom2$K;
  const geom3$E = geom3$K;
  const path2$o = path2$u;
  const poly3$n = poly3$A;
  const cacheOfBoundingSpheres = /* @__PURE__ */ new WeakMap();
  const measureBoundingSphereOfPath2 = (geometry) => {
    let boundingSphere = cacheOfBoundingSpheres.get(geometry);
    if (boundingSphere !== void 0)
      return boundingSphere;
    const centroid = vec3$t.create();
    let radius = 0;
    const points = path2$o.toPoints(geometry);
    if (points.length > 0) {
      let numPoints = 0;
      const temp = vec3$t.create();
      points.forEach((point) => {
        vec3$t.add(centroid, centroid, vec3$t.fromVec2(temp, point, 0));
        numPoints++;
      });
      vec3$t.scale(centroid, centroid, 1 / numPoints);
      points.forEach((point) => {
        radius = Math.max(radius, vec2$f.squaredDistance(centroid, point));
      });
      radius = Math.sqrt(radius);
    }
    boundingSphere = [centroid, radius];
    cacheOfBoundingSpheres.set(geometry, boundingSphere);
    return boundingSphere;
  };
  const measureBoundingSphereOfGeom2 = (geometry) => {
    let boundingSphere = cacheOfBoundingSpheres.get(geometry);
    if (boundingSphere !== void 0)
      return boundingSphere;
    const centroid = vec3$t.create();
    let radius = 0;
    const sides = geom2$E.toSides(geometry);
    if (sides.length > 0) {
      let numPoints = 0;
      const temp = vec3$t.create();
      sides.forEach((side) => {
        vec3$t.add(centroid, centroid, vec3$t.fromVec2(temp, side[0], 0));
        numPoints++;
      });
      vec3$t.scale(centroid, centroid, 1 / numPoints);
      sides.forEach((side) => {
        radius = Math.max(radius, vec2$f.squaredDistance(centroid, side[0]));
      });
      radius = Math.sqrt(radius);
    }
    boundingSphere = [centroid, radius];
    cacheOfBoundingSpheres.set(geometry, boundingSphere);
    return boundingSphere;
  };
  const measureBoundingSphereOfGeom3 = (geometry) => {
    let boundingSphere = cacheOfBoundingSpheres.get(geometry);
    if (boundingSphere !== void 0)
      return boundingSphere;
    const centroid = vec3$t.create();
    let radius = 0;
    const polygons = geom3$E.toPolygons(geometry);
    if (polygons.length > 0) {
      let numPoints = 0;
      polygons.forEach((polygon2) => {
        poly3$n.toPoints(polygon2).forEach((point) => {
          vec3$t.add(centroid, centroid, point);
          numPoints++;
        });
      });
      vec3$t.scale(centroid, centroid, 1 / numPoints);
      polygons.forEach((polygon2) => {
        poly3$n.toPoints(polygon2).forEach((point) => {
          radius = Math.max(radius, vec3$t.squaredDistance(centroid, point));
        });
      });
      radius = Math.sqrt(radius);
    }
    boundingSphere = [centroid, radius];
    cacheOfBoundingSpheres.set(geometry, boundingSphere);
    return boundingSphere;
  };
  const measureBoundingSphere = (...geometries2) => {
    geometries2 = flatten$x(geometries2);
    const results = geometries2.map((geometry) => {
      if (path2$o.isA(geometry))
        return measureBoundingSphereOfPath2(geometry);
      if (geom2$E.isA(geometry))
        return measureBoundingSphereOfGeom2(geometry);
      if (geom3$E.isA(geometry))
        return measureBoundingSphereOfGeom3(geometry);
      return [[0, 0, 0], 0];
    });
    return results.length === 1 ? results[0] : results;
  };
  var measureBoundingSphere_1 = measureBoundingSphere;
  const flatten$w = flatten_1;
  const measureBoundingBox$4 = measureBoundingBox_1;
  const measureCenter = (...geometries2) => {
    geometries2 = flatten$w(geometries2);
    const results = geometries2.map((geometry) => {
      const bounds = measureBoundingBox$4(geometry);
      return [
        bounds[0][0] + (bounds[1][0] - bounds[0][0]) / 2,
        bounds[0][1] + (bounds[1][1] - bounds[0][1]) / 2,
        bounds[0][2] + (bounds[1][2] - bounds[0][2]) / 2
      ];
    });
    return results.length === 1 ? results[0] : results;
  };
  var measureCenter_1 = measureCenter;
  const flatten$v = flatten_1;
  const vec3$s = vec3$Y;
  const geom2$D = geom2$K;
  const geom3$D = geom3$K;
  const cacheOfCenterOfMass = /* @__PURE__ */ new WeakMap();
  const measureCenterOfMassGeom2 = (geometry) => {
    let centerOfMass = cacheOfCenterOfMass.get(geometry);
    if (centerOfMass !== void 0)
      return centerOfMass;
    const sides = geom2$D.toSides(geometry);
    let area2 = 0;
    let x = 0;
    let y = 0;
    if (sides.length > 0) {
      for (let i = 0; i < sides.length; i++) {
        const p1 = sides[i][0];
        const p2 = sides[i][1];
        const a = p1[0] * p2[1] - p1[1] * p2[0];
        area2 += a;
        x += (p1[0] + p2[0]) * a;
        y += (p1[1] + p2[1]) * a;
      }
      area2 /= 2;
      const f = 1 / (area2 * 6);
      x *= f;
      y *= f;
    }
    centerOfMass = vec3$s.fromValues(x, y, 0);
    cacheOfCenterOfMass.set(geometry, centerOfMass);
    return centerOfMass;
  };
  const measureCenterOfMassGeom3 = (geometry) => {
    let centerOfMass = cacheOfCenterOfMass.get(geometry);
    if (centerOfMass !== void 0)
      return centerOfMass;
    centerOfMass = vec3$s.create();
    const polygons = geom3$D.toPolygons(geometry);
    if (polygons.length === 0)
      return centerOfMass;
    let totalVolume = 0;
    const vector = vec3$s.create();
    polygons.forEach((polygon2) => {
      const vertices = polygon2.vertices;
      for (let i = 0; i < vertices.length - 2; i++) {
        vec3$s.cross(vector, vertices[i + 1], vertices[i + 2]);
        const volume = vec3$s.dot(vertices[0], vector) / 6;
        totalVolume += volume;
        vec3$s.add(vector, vertices[0], vertices[i + 1]);
        vec3$s.add(vector, vector, vertices[i + 2]);
        const weightedCenter = vec3$s.scale(vector, vector, 1 / 4 * volume);
        vec3$s.add(centerOfMass, centerOfMass, weightedCenter);
      }
    });
    vec3$s.scale(centerOfMass, centerOfMass, 1 / totalVolume);
    cacheOfCenterOfMass.set(geometry, centerOfMass);
    return centerOfMass;
  };
  const measureCenterOfMass = (...geometries2) => {
    geometries2 = flatten$v(geometries2);
    const results = geometries2.map((geometry) => {
      if (geom2$D.isA(geometry))
        return measureCenterOfMassGeom2(geometry);
      if (geom3$D.isA(geometry))
        return measureCenterOfMassGeom3(geometry);
      return [0, 0, 0];
    });
    return results.length === 1 ? results[0] : results;
  };
  var measureCenterOfMass_1 = measureCenterOfMass;
  const flatten$u = flatten_1;
  const measureBoundingBox$3 = measureBoundingBox_1;
  const measureDimensions = (...geometries2) => {
    geometries2 = flatten$u(geometries2);
    const results = geometries2.map((geometry) => {
      const boundingBox = measureBoundingBox$3(geometry);
      return [
        boundingBox[1][0] - boundingBox[0][0],
        boundingBox[1][1] - boundingBox[0][1],
        boundingBox[1][2] - boundingBox[0][2]
      ];
    });
    return results.length === 1 ? results[0] : results;
  };
  var measureDimensions_1 = measureDimensions;
  const flatten$t = flatten_1;
  const { geom2: geom2$C, geom3: geom3$C, path2: path2$n } = geometries;
  const calculateEpsilonFromBounds = calculateEpsilonFromBounds_1;
  const measureBoundingBox$2 = measureBoundingBox_1;
  const measureEpsilonOfPath2 = (geometry) => calculateEpsilonFromBounds(measureBoundingBox$2(geometry), 2);
  const measureEpsilonOfGeom2 = (geometry) => calculateEpsilonFromBounds(measureBoundingBox$2(geometry), 2);
  const measureEpsilonOfGeom3 = (geometry) => calculateEpsilonFromBounds(measureBoundingBox$2(geometry), 3);
  const measureEpsilon$7 = (...geometries2) => {
    geometries2 = flatten$t(geometries2);
    if (geometries2.length === 0)
      throw new Error("wrong number of arguments");
    const results = geometries2.map((geometry) => {
      if (path2$n.isA(geometry))
        return measureEpsilonOfPath2(geometry);
      if (geom2$C.isA(geometry))
        return measureEpsilonOfGeom2(geometry);
      if (geom3$C.isA(geometry))
        return measureEpsilonOfGeom3(geometry);
      return 0;
    });
    return results.length === 1 ? results[0] : results;
  };
  var measureEpsilon_1 = measureEpsilon$7;
  var measurements = {
    measureAggregateArea: measureAggregateArea_1,
    measureAggregateBoundingBox: measureAggregateBoundingBox_1,
    measureAggregateEpsilon: measureAggregateEpsilon_1,
    measureAggregateVolume: measureAggregateVolume_1,
    measureArea: measureArea_1,
    measureBoundingBox: measureBoundingBox_1,
    measureBoundingSphere: measureBoundingSphere_1,
    measureCenter: measureCenter_1,
    measureCenterOfMass: measureCenterOfMass_1,
    measureDimensions: measureDimensions_1,
    measureEpsilon: measureEpsilon_1,
    measureVolume: measureVolume_1
  };
  const isNumberArray$c = (array, dimension) => {
    if (Array.isArray(array) && array.length >= dimension) {
      return array.every((n) => Number.isFinite(n));
    }
    return false;
  };
  const isGT$d = (value, constant) => Number.isFinite(value) && value > constant;
  const isGTE$a = (value, constant) => Number.isFinite(value) && value >= constant;
  var commonChecks = {
    isNumberArray: isNumberArray$c,
    isGT: isGT$d,
    isGTE: isGTE$a
  };
  const { EPS: EPS$c, TAU: TAU$e } = constants$1;
  const vec2$e = vec2$E;
  const path2$m = path2$u;
  const { isGT: isGT$c, isGTE: isGTE$9, isNumberArray: isNumberArray$b } = commonChecks;
  const arc = (options) => {
    const defaults = {
      center: [0, 0],
      radius: 1,
      startAngle: 0,
      endAngle: TAU$e,
      makeTangent: false,
      segments: 32
    };
    let { center: center2, radius, startAngle, endAngle, makeTangent, segments } = Object.assign({}, defaults, options);
    if (!isNumberArray$b(center2, 2))
      throw new Error("center must be an array of X and Y values");
    if (!isGT$c(radius, 0))
      throw new Error("radius must be greater than zero");
    if (!isGTE$9(startAngle, 0))
      throw new Error("startAngle must be positive");
    if (!isGTE$9(endAngle, 0))
      throw new Error("endAngle must be positive");
    if (!isGTE$9(segments, 4))
      throw new Error("segments must be four or more");
    startAngle = startAngle % TAU$e;
    endAngle = endAngle % TAU$e;
    let rotation = TAU$e;
    if (startAngle < endAngle) {
      rotation = endAngle - startAngle;
    }
    if (startAngle > endAngle) {
      rotation = endAngle + (TAU$e - startAngle);
    }
    const minangle = Math.acos((radius * radius + radius * radius - EPS$c * EPS$c) / (2 * radius * radius));
    const centerv = vec2$e.clone(center2);
    let point;
    const pointArray = [];
    if (rotation < minangle) {
      point = vec2$e.fromAngleRadians(vec2$e.create(), startAngle);
      vec2$e.scale(point, point, radius);
      vec2$e.add(point, point, centerv);
      pointArray.push(point);
    } else {
      const numsteps = Math.max(1, Math.floor(segments * (rotation / TAU$e))) + 1;
      let edgestepsize = numsteps * 0.5 / rotation;
      if (edgestepsize > 0.25)
        edgestepsize = 0.25;
      const totalsteps = makeTangent ? numsteps + 2 : numsteps;
      for (let i = 0; i <= totalsteps; i++) {
        let step = i;
        if (makeTangent) {
          step = (i - 1) * (numsteps - 2 * edgestepsize) / numsteps + edgestepsize;
          if (step < 0)
            step = 0;
          if (step > numsteps)
            step = numsteps;
        }
        const angle2 = startAngle + step * (rotation / numsteps);
        point = vec2$e.fromAngleRadians(vec2$e.create(), angle2);
        vec2$e.scale(point, point, radius);
        vec2$e.add(point, point, centerv);
        pointArray.push(point);
      }
    }
    return path2$m.fromPoints({ closed: false }, pointArray);
  };
  var arc_1 = arc;
  const { EPS: EPS$b, TAU: TAU$d } = constants$1;
  const vec2$d = vec2$E;
  const geom2$B = geom2$K;
  const { sin: sin$4, cos: cos$4 } = trigonometry;
  const { isGTE: isGTE$8, isNumberArray: isNumberArray$a } = commonChecks;
  const ellipse$1 = (options) => {
    const defaults = {
      center: [0, 0],
      radius: [1, 1],
      startAngle: 0,
      endAngle: TAU$d,
      segments: 32
    };
    let { center: center2, radius, startAngle, endAngle, segments } = Object.assign({}, defaults, options);
    if (!isNumberArray$a(center2, 2))
      throw new Error("center must be an array of X and Y values");
    if (!isNumberArray$a(radius, 2))
      throw new Error("radius must be an array of X and Y values");
    if (!radius.every((n) => n > 0))
      throw new Error("radius values must be greater than zero");
    if (!isGTE$8(startAngle, 0))
      throw new Error("startAngle must be positive");
    if (!isGTE$8(endAngle, 0))
      throw new Error("endAngle must be positive");
    if (!isGTE$8(segments, 3))
      throw new Error("segments must be three or more");
    startAngle = startAngle % TAU$d;
    endAngle = endAngle % TAU$d;
    let rotation = TAU$d;
    if (startAngle < endAngle) {
      rotation = endAngle - startAngle;
    }
    if (startAngle > endAngle) {
      rotation = endAngle + (TAU$d - startAngle);
    }
    const minradius = Math.min(radius[0], radius[1]);
    const minangle = Math.acos((minradius * minradius + minradius * minradius - EPS$b * EPS$b) / (2 * minradius * minradius));
    if (rotation < minangle)
      throw new Error("startAngle and endAngle do not define a significant rotation");
    segments = Math.floor(segments * (rotation / TAU$d));
    const centerv = vec2$d.clone(center2);
    const step = rotation / segments;
    const points = [];
    segments = rotation < TAU$d ? segments + 1 : segments;
    for (let i = 0; i < segments; i++) {
      const angle2 = step * i + startAngle;
      const point = vec2$d.fromValues(radius[0] * cos$4(angle2), radius[1] * sin$4(angle2));
      vec2$d.add(point, centerv, point);
      points.push(point);
    }
    if (rotation < TAU$d)
      points.push(centerv);
    return geom2$B.fromPoints(points);
  };
  var ellipse_1 = ellipse$1;
  const { TAU: TAU$c } = constants$1;
  const ellipse = ellipse_1;
  const { isGT: isGT$b } = commonChecks;
  const circle$1 = (options) => {
    const defaults = {
      center: [0, 0],
      radius: 1,
      startAngle: 0,
      endAngle: TAU$c,
      segments: 32
    };
    let { center: center2, radius, startAngle, endAngle, segments } = Object.assign({}, defaults, options);
    if (!isGT$b(radius, 0))
      throw new Error("radius must be greater than zero");
    radius = [radius, radius];
    return ellipse({ center: center2, radius, startAngle, endAngle, segments });
  };
  var circle_1 = circle$1;
  const geom3$B = geom3$K;
  const poly3$m = poly3$A;
  const { isNumberArray: isNumberArray$9 } = commonChecks;
  const cuboid$1 = (options) => {
    const defaults = {
      center: [0, 0, 0],
      size: [2, 2, 2]
    };
    const { center: center2, size } = Object.assign({}, defaults, options);
    if (!isNumberArray$9(center2, 3))
      throw new Error("center must be an array of X, Y and Z values");
    if (!isNumberArray$9(size, 3))
      throw new Error("size must be an array of width, depth and height values");
    if (!size.every((n) => n > 0))
      throw new Error("size values must be greater than zero");
    const result = geom3$B.create(
      // adjust a basic shape to size
      [
        [[0, 4, 6, 2], [-1, 0, 0]],
        [[1, 3, 7, 5], [1, 0, 0]],
        [[0, 1, 5, 4], [0, -1, 0]],
        [[2, 6, 7, 3], [0, 1, 0]],
        [[0, 2, 3, 1], [0, 0, -1]],
        [[4, 5, 7, 6], [0, 0, 1]]
      ].map((info) => {
        const points = info[0].map((i) => {
          const pos = [
            center2[0] + size[0] / 2 * (2 * !!(i & 1) - 1),
            center2[1] + size[1] / 2 * (2 * !!(i & 2) - 1),
            center2[2] + size[2] / 2 * (2 * !!(i & 4) - 1)
          ];
          return pos;
        });
        return poly3$m.create(points);
      })
    );
    return result;
  };
  var cuboid_1 = cuboid$1;
  const cuboid = cuboid_1;
  const { isGT: isGT$a } = commonChecks;
  const cube = (options) => {
    const defaults = {
      center: [0, 0, 0],
      size: 2
    };
    let { center: center2, size } = Object.assign({}, defaults, options);
    if (!isGT$a(size, 0))
      throw new Error("size must be greater than zero");
    size = [size, size, size];
    return cuboid({ center: center2, size });
  };
  var cube_1 = cube;
  const { EPS: EPS$a, TAU: TAU$b } = constants$1;
  const vec3$r = vec3$Y;
  const geom3$A = geom3$K;
  const poly3$l = poly3$A;
  const { sin: sin$3, cos: cos$3 } = trigonometry;
  const { isGT: isGT$9, isGTE: isGTE$7, isNumberArray: isNumberArray$8 } = commonChecks;
  const cylinderElliptic$1 = (options) => {
    const defaults = {
      center: [0, 0, 0],
      height: 2,
      startRadius: [1, 1],
      startAngle: 0,
      endRadius: [1, 1],
      endAngle: TAU$b,
      segments: 32
    };
    let { center: center2, height, startRadius, startAngle, endRadius, endAngle, segments } = Object.assign({}, defaults, options);
    if (!isNumberArray$8(center2, 3))
      throw new Error("center must be an array of X, Y and Z values");
    if (!isGT$9(height, 0))
      throw new Error("height must be greater then zero");
    if (!isNumberArray$8(startRadius, 2))
      throw new Error("startRadius must be an array of X and Y values");
    if (!startRadius.every((n) => n >= 0))
      throw new Error("startRadius values must be positive");
    if (!isNumberArray$8(endRadius, 2))
      throw new Error("endRadius must be an array of X and Y values");
    if (!endRadius.every((n) => n >= 0))
      throw new Error("endRadius values must be positive");
    if (endRadius.every((n) => n === 0) && startRadius.every((n) => n === 0))
      throw new Error("at least one radius must be positive");
    if (!isGTE$7(startAngle, 0))
      throw new Error("startAngle must be positive");
    if (!isGTE$7(endAngle, 0))
      throw new Error("endAngle must be positive");
    if (!isGTE$7(segments, 4))
      throw new Error("segments must be four or more");
    startAngle = startAngle % TAU$b;
    endAngle = endAngle % TAU$b;
    let rotation = TAU$b;
    if (startAngle < endAngle) {
      rotation = endAngle - startAngle;
    }
    if (startAngle > endAngle) {
      rotation = endAngle + (TAU$b - startAngle);
    }
    const minradius = Math.min(startRadius[0], startRadius[1], endRadius[0], endRadius[1]);
    const minangle = Math.acos((minradius * minradius + minradius * minradius - EPS$a * EPS$a) / (2 * minradius * minradius));
    if (rotation < minangle)
      throw new Error("startAngle and endAngle do not define a significant rotation");
    const slices = Math.floor(segments * (rotation / TAU$b));
    const start = vec3$r.fromValues(0, 0, -(height / 2));
    const end = vec3$r.fromValues(0, 0, height / 2);
    const ray = vec3$r.subtract(vec3$r.create(), end, start);
    const axisX = vec3$r.fromValues(1, 0, 0);
    const axisY = vec3$r.fromValues(0, 1, 0);
    const v12 = vec3$r.create();
    const v22 = vec3$r.create();
    const v3 = vec3$r.create();
    const point = (stack, slice2, radius) => {
      const angle2 = slice2 * rotation + startAngle;
      vec3$r.scale(v12, axisX, radius[0] * cos$3(angle2));
      vec3$r.scale(v22, axisY, radius[1] * sin$3(angle2));
      vec3$r.add(v12, v12, v22);
      vec3$r.scale(v3, ray, stack);
      vec3$r.add(v3, v3, start);
      return vec3$r.add(vec3$r.create(), v12, v3);
    };
    const fromPoints2 = (...points) => {
      const newpoints = points.map((point2) => vec3$r.add(vec3$r.create(), point2, center2));
      return poly3$l.create(newpoints);
    };
    const polygons = [];
    for (let i = 0; i < slices; i++) {
      const t0 = i / slices;
      let t1 = (i + 1) / slices;
      if (rotation === TAU$b && i === slices - 1)
        t1 = 0;
      if (endRadius[0] === startRadius[0] && endRadius[1] === startRadius[1]) {
        polygons.push(fromPoints2(start, point(0, t1, endRadius), point(0, t0, endRadius)));
        polygons.push(fromPoints2(point(0, t1, endRadius), point(1, t1, endRadius), point(1, t0, endRadius), point(0, t0, endRadius)));
        polygons.push(fromPoints2(end, point(1, t0, endRadius), point(1, t1, endRadius)));
      } else {
        if (startRadius[0] > 0 && startRadius[1] > 0) {
          polygons.push(fromPoints2(start, point(0, t1, startRadius), point(0, t0, startRadius)));
        }
        if (startRadius[0] > 0 || startRadius[1] > 0) {
          polygons.push(fromPoints2(point(0, t0, startRadius), point(0, t1, startRadius), point(1, t0, endRadius)));
        }
        if (endRadius[0] > 0 && endRadius[1] > 0) {
          polygons.push(fromPoints2(end, point(1, t0, endRadius), point(1, t1, endRadius)));
        }
        if (endRadius[0] > 0 || endRadius[1] > 0) {
          polygons.push(fromPoints2(point(1, t0, endRadius), point(0, t1, startRadius), point(1, t1, endRadius)));
        }
      }
    }
    if (rotation < TAU$b) {
      polygons.push(fromPoints2(start, point(0, 0, startRadius), end));
      polygons.push(fromPoints2(point(0, 0, startRadius), point(1, 0, endRadius), end));
      polygons.push(fromPoints2(start, end, point(0, 1, startRadius)));
      polygons.push(fromPoints2(point(0, 1, startRadius), end, point(1, 1, endRadius)));
    }
    const result = geom3$A.create(polygons);
    return result;
  };
  var cylinderElliptic_1 = cylinderElliptic$1;
  const cylinderElliptic = cylinderElliptic_1;
  const { isGT: isGT$8 } = commonChecks;
  const cylinder = (options) => {
    const defaults = {
      center: [0, 0, 0],
      height: 2,
      radius: 1,
      segments: 32
    };
    const { center: center2, height, radius, segments } = Object.assign({}, defaults, options);
    if (!isGT$8(radius, 0))
      throw new Error("radius must be greater than zero");
    const newoptions = {
      center: center2,
      height,
      startRadius: [radius, radius],
      endRadius: [radius, radius],
      segments
    };
    return cylinderElliptic(newoptions);
  };
  var cylinder_1 = cylinder;
  const { TAU: TAU$a } = constants$1;
  const vec3$q = vec3$Y;
  const geom3$z = geom3$K;
  const poly3$k = poly3$A;
  const { sin: sin$2, cos: cos$2 } = trigonometry;
  const { isGTE: isGTE$6, isNumberArray: isNumberArray$7 } = commonChecks;
  const ellipsoid$1 = (options) => {
    const defaults = {
      center: [0, 0, 0],
      radius: [1, 1, 1],
      segments: 32,
      axes: [[1, 0, 0], [0, -1, 0], [0, 0, 1]]
    };
    const { center: center2, radius, segments, axes } = Object.assign({}, defaults, options);
    if (!isNumberArray$7(center2, 3))
      throw new Error("center must be an array of X, Y and Z values");
    if (!isNumberArray$7(radius, 3))
      throw new Error("radius must be an array of X, Y and Z values");
    if (!radius.every((n) => n > 0))
      throw new Error("radius values must be greater than zero");
    if (!isGTE$6(segments, 4))
      throw new Error("segments must be four or more");
    const xvector = vec3$q.scale(vec3$q.create(), vec3$q.normalize(vec3$q.create(), axes[0]), radius[0]);
    const yvector = vec3$q.scale(vec3$q.create(), vec3$q.normalize(vec3$q.create(), axes[1]), radius[1]);
    const zvector = vec3$q.scale(vec3$q.create(), vec3$q.normalize(vec3$q.create(), axes[2]), radius[2]);
    const qsegments = Math.round(segments / 4);
    let prevcylinderpoint;
    const polygons = [];
    const p1 = vec3$q.create();
    const p2 = vec3$q.create();
    for (let slice1 = 0; slice1 <= segments; slice1++) {
      const angle2 = TAU$a * slice1 / segments;
      const cylinderpoint = vec3$q.add(vec3$q.create(), vec3$q.scale(p1, xvector, cos$2(angle2)), vec3$q.scale(p2, yvector, sin$2(angle2)));
      if (slice1 > 0) {
        let prevcospitch, prevsinpitch;
        for (let slice2 = 0; slice2 <= qsegments; slice2++) {
          const pitch = TAU$a / 4 * slice2 / qsegments;
          const cospitch = cos$2(pitch);
          const sinpitch = sin$2(pitch);
          if (slice2 > 0) {
            let points = [];
            let point;
            point = vec3$q.subtract(vec3$q.create(), vec3$q.scale(p1, prevcylinderpoint, prevcospitch), vec3$q.scale(p2, zvector, prevsinpitch));
            points.push(vec3$q.add(point, point, center2));
            point = vec3$q.subtract(vec3$q.create(), vec3$q.scale(p1, cylinderpoint, prevcospitch), vec3$q.scale(p2, zvector, prevsinpitch));
            points.push(vec3$q.add(point, point, center2));
            if (slice2 < qsegments) {
              point = vec3$q.subtract(vec3$q.create(), vec3$q.scale(p1, cylinderpoint, cospitch), vec3$q.scale(p2, zvector, sinpitch));
              points.push(vec3$q.add(point, point, center2));
            }
            point = vec3$q.subtract(vec3$q.create(), vec3$q.scale(p1, prevcylinderpoint, cospitch), vec3$q.scale(p2, zvector, sinpitch));
            points.push(vec3$q.add(point, point, center2));
            polygons.push(poly3$k.create(points));
            points = [];
            point = vec3$q.add(vec3$q.create(), vec3$q.scale(p1, prevcylinderpoint, prevcospitch), vec3$q.scale(p2, zvector, prevsinpitch));
            points.push(vec3$q.add(vec3$q.create(), center2, point));
            point = vec3$q.add(point, vec3$q.scale(p1, cylinderpoint, prevcospitch), vec3$q.scale(p2, zvector, prevsinpitch));
            points.push(vec3$q.add(vec3$q.create(), center2, point));
            if (slice2 < qsegments) {
              point = vec3$q.add(point, vec3$q.scale(p1, cylinderpoint, cospitch), vec3$q.scale(p2, zvector, sinpitch));
              points.push(vec3$q.add(vec3$q.create(), center2, point));
            }
            point = vec3$q.add(point, vec3$q.scale(p1, prevcylinderpoint, cospitch), vec3$q.scale(p2, zvector, sinpitch));
            points.push(vec3$q.add(vec3$q.create(), center2, point));
            points.reverse();
            polygons.push(poly3$k.create(points));
          }
          prevcospitch = cospitch;
          prevsinpitch = sinpitch;
        }
      }
      prevcylinderpoint = cylinderpoint;
    }
    return geom3$z.create(polygons);
  };
  var ellipsoid_1 = ellipsoid$1;
  const geom3$y = geom3$K;
  const poly3$j = poly3$A;
  const { isNumberArray: isNumberArray$6 } = commonChecks;
  const polyhedron$1 = (options) => {
    const defaults = {
      points: [],
      faces: [],
      colors: void 0,
      orientation: "outward"
    };
    const { points, faces, colors: colors2, orientation } = Object.assign({}, defaults, options);
    if (!(Array.isArray(points) && Array.isArray(faces))) {
      throw new Error("points and faces must be arrays");
    }
    if (points.length < 3) {
      throw new Error("three or more points are required");
    }
    if (faces.length < 1) {
      throw new Error("one or more faces are required");
    }
    if (colors2) {
      if (!Array.isArray(colors2)) {
        throw new Error("colors must be an array");
      }
      if (colors2.length !== faces.length) {
        throw new Error("faces and colors must have the same length");
      }
    }
    points.forEach((point, i) => {
      if (!isNumberArray$6(point, 3))
        throw new Error(`point ${i} must be an array of X, Y, Z values`);
    });
    faces.forEach((face, i) => {
      if (face.length < 3)
        throw new Error(`face ${i} must contain 3 or more indexes`);
      if (!isNumberArray$6(face, face.length))
        throw new Error(`face ${i} must be an array of numbers`);
    });
    if (orientation !== "outward") {
      faces.forEach((face) => face.reverse());
    }
    const polygons = faces.map((face, findex) => {
      const polygon2 = poly3$j.create(face.map((pindex) => points[pindex]));
      if (colors2 && colors2[findex])
        polygon2.color = colors2[findex];
      return polygon2;
    });
    return geom3$y.create(polygons);
  };
  var polyhedron_1 = polyhedron$1;
  const mat4$c = mat4$r;
  const vec3$p = vec3$Y;
  const geom3$x = geom3$K;
  const polyhedron = polyhedron_1;
  const { isGT: isGT$7, isGTE: isGTE$5 } = commonChecks;
  const geodesicSphere = (options) => {
    const defaults = {
      radius: 1,
      frequency: 6
    };
    let { radius, frequency } = Object.assign({}, defaults, options);
    if (!isGT$7(radius, 0))
      throw new Error("radius must be greater than zero");
    if (!isGTE$5(frequency, 6))
      throw new Error("frequency must be six or more");
    frequency = Math.floor(frequency / 6);
    const ci = [
      // hard-coded data of icosahedron (20 faces, all triangles)
      [0.850651, 0, -0.525731],
      [0.850651, -0, 0.525731],
      [-0.850651, -0, 0.525731],
      [-0.850651, 0, -0.525731],
      [0, -0.525731, 0.850651],
      [0, 0.525731, 0.850651],
      [0, 0.525731, -0.850651],
      [0, -0.525731, -0.850651],
      [-0.525731, -0.850651, -0],
      [0.525731, -0.850651, -0],
      [0.525731, 0.850651, 0],
      [-0.525731, 0.850651, 0]
    ];
    const ti = [
      [0, 9, 1],
      [1, 10, 0],
      [6, 7, 0],
      [10, 6, 0],
      [7, 9, 0],
      [5, 1, 4],
      [4, 1, 9],
      [5, 10, 1],
      [2, 8, 3],
      [3, 11, 2],
      [2, 5, 4],
      [4, 8, 2],
      [2, 11, 5],
      [3, 7, 6],
      [6, 11, 3],
      [8, 7, 3],
      [9, 8, 4],
      [11, 10, 5],
      [10, 11, 6],
      [8, 9, 7]
    ];
    const geodesicSubDivide = (p, frequency2, offset3) => {
      const p1 = p[0];
      const p2 = p[1];
      const p3 = p[2];
      let n = offset3;
      const c = [];
      const f = [];
      for (let i = 0; i < frequency2; i++) {
        for (let j = 0; j < frequency2 - i; j++) {
          const t0 = i / frequency2;
          const t1 = (i + 1) / frequency2;
          const s0 = j / (frequency2 - i);
          const s1 = (j + 1) / (frequency2 - i);
          const s2 = frequency2 - i - 1 ? j / (frequency2 - i - 1) : 1;
          const q = [];
          q[0] = mix3(mix3(p1, p2, s0), p3, t0);
          q[1] = mix3(mix3(p1, p2, s1), p3, t0);
          q[2] = mix3(mix3(p1, p2, s2), p3, t1);
          for (let k = 0; k < 3; k++) {
            const r = vec3$p.length(q[k]);
            for (let l = 0; l < 3; l++) {
              q[k][l] /= r;
            }
          }
          c.push(q[0], q[1], q[2]);
          f.push([n, n + 1, n + 2]);
          n += 3;
          if (j < frequency2 - i - 1) {
            const s3 = frequency2 - i - 1 ? (j + 1) / (frequency2 - i - 1) : 1;
            q[0] = mix3(mix3(p1, p2, s1), p3, t0);
            q[1] = mix3(mix3(p1, p2, s3), p3, t1);
            q[2] = mix3(mix3(p1, p2, s2), p3, t1);
            for (let k = 0; k < 3; k++) {
              const r = vec3$p.length(q[k]);
              for (let l = 0; l < 3; l++) {
                q[k][l] /= r;
              }
            }
            c.push(q[0], q[1], q[2]);
            f.push([n, n + 1, n + 2]);
            n += 3;
          }
        }
      }
      return { points: c, triangles: f, offset: n };
    };
    const mix3 = (a, b, f) => {
      const _f = 1 - f;
      const c = [];
      for (let i = 0; i < 3; i++) {
        c[i] = a[i] * _f + b[i] * f;
      }
      return c;
    };
    let points = [];
    let faces = [];
    let offset2 = 0;
    for (let i = 0; i < ti.length; i++) {
      const g = geodesicSubDivide([ci[ti[i][0]], ci[ti[i][1]], ci[ti[i][2]]], frequency, offset2);
      points = points.concat(g.points);
      faces = faces.concat(g.triangles);
      offset2 = g.offset;
    }
    let geometry = polyhedron({ points, faces, orientation: "inward" });
    if (radius !== 1)
      geometry = geom3$x.transform(mat4$c.fromScaling(mat4$c.create(), [radius, radius, radius]), geometry);
    return geometry;
  };
  var geodesicSphere_1 = geodesicSphere;
  const path2$l = path2$u;
  const line = (points) => {
    if (!Array.isArray(points))
      throw new Error("points must be an array");
    return path2$l.fromPoints({}, points);
  };
  var line_1 = line;
  const geom2$A = geom2$K;
  const polygon = (options) => {
    const defaults = {
      points: [],
      paths: []
    };
    const { points, paths } = Object.assign({}, defaults, options);
    if (!(Array.isArray(points) && Array.isArray(paths)))
      throw new Error("points and paths must be arrays");
    let listofpolys = points;
    if (Array.isArray(points[0])) {
      if (!Array.isArray(points[0][0])) {
        listofpolys = [points];
      }
    }
    listofpolys.forEach((list, i) => {
      if (!Array.isArray(list))
        throw new Error("list of points " + i + " must be an array");
      if (list.length < 3)
        throw new Error("list of points " + i + " must contain three or more points");
      list.forEach((point, j) => {
        if (!Array.isArray(point))
          throw new Error("list of points " + i + ", point " + j + " must be an array");
        if (point.length < 2)
          throw new Error("list of points " + i + ", point " + j + " must contain by X and Y values");
      });
    });
    let listofpaths = paths;
    if (paths.length === 0) {
      let count = 0;
      listofpaths = listofpolys.map((list) => list.map((point) => count++));
    }
    const allpoints = [];
    listofpolys.forEach((list) => list.forEach((point) => allpoints.push(point)));
    let sides = [];
    listofpaths.forEach((path) => {
      const setofpoints = path.map((index) => allpoints[index]);
      const geometry = geom2$A.fromPoints(setofpoints);
      sides = sides.concat(geom2$A.toSides(geometry));
    });
    return geom2$A.create(sides);
  };
  var polygon_1 = polygon;
  const vec2$c = vec2$E;
  const geom2$z = geom2$K;
  const { isNumberArray: isNumberArray$5 } = commonChecks;
  const rectangle$1 = (options) => {
    const defaults = {
      center: [0, 0],
      size: [2, 2]
    };
    const { center: center2, size } = Object.assign({}, defaults, options);
    if (!isNumberArray$5(center2, 2))
      throw new Error("center must be an array of X and Y values");
    if (!isNumberArray$5(size, 2))
      throw new Error("size must be an array of X and Y values");
    if (!size.every((n) => n > 0))
      throw new Error("size values must be greater than zero");
    const point = [size[0] / 2, size[1] / 2];
    const pswap = [point[0], -point[1]];
    const points = [
      vec2$c.subtract(vec2$c.create(), center2, point),
      vec2$c.add(vec2$c.create(), center2, pswap),
      vec2$c.add(vec2$c.create(), center2, point),
      vec2$c.subtract(vec2$c.create(), center2, pswap)
    ];
    return geom2$z.fromPoints(points);
  };
  var rectangle_1 = rectangle$1;
  const { EPS: EPS$9, TAU: TAU$9 } = constants$1;
  const vec2$b = vec2$E;
  const vec3$o = vec3$Y;
  const geom3$w = geom3$K;
  const poly3$i = poly3$A;
  const { sin: sin$1, cos: cos$1 } = trigonometry;
  const { isGT: isGT$6, isGTE: isGTE$4, isNumberArray: isNumberArray$4 } = commonChecks;
  const createCorners = (center2, size, radius, segments, slice2, positive) => {
    const pitch = TAU$9 / 4 * slice2 / segments;
    const cospitch = cos$1(pitch);
    const sinpitch = sin$1(pitch);
    const layersegments = segments - slice2;
    let layerradius = radius * cospitch;
    let layeroffset = size[2] - (radius - radius * sinpitch);
    if (!positive)
      layeroffset = radius - radius * sinpitch - size[2];
    layerradius = layerradius > EPS$9 ? layerradius : 0;
    const corner0 = vec3$o.add(vec3$o.create(), center2, [size[0] - radius, size[1] - radius, layeroffset]);
    const corner1 = vec3$o.add(vec3$o.create(), center2, [radius - size[0], size[1] - radius, layeroffset]);
    const corner2 = vec3$o.add(vec3$o.create(), center2, [radius - size[0], radius - size[1], layeroffset]);
    const corner3 = vec3$o.add(vec3$o.create(), center2, [size[0] - radius, radius - size[1], layeroffset]);
    const corner0Points = [];
    const corner1Points = [];
    const corner2Points = [];
    const corner3Points = [];
    for (let i = 0; i <= layersegments; i++) {
      const radians = layersegments > 0 ? TAU$9 / 4 * i / layersegments : 0;
      const point2d = vec2$b.fromAngleRadians(vec2$b.create(), radians);
      vec2$b.scale(point2d, point2d, layerradius);
      const point3d = vec3$o.fromVec2(vec3$o.create(), point2d);
      corner0Points.push(vec3$o.add(vec3$o.create(), corner0, point3d));
      vec3$o.rotateZ(point3d, point3d, [0, 0, 0], TAU$9 / 4);
      corner1Points.push(vec3$o.add(vec3$o.create(), corner1, point3d));
      vec3$o.rotateZ(point3d, point3d, [0, 0, 0], TAU$9 / 4);
      corner2Points.push(vec3$o.add(vec3$o.create(), corner2, point3d));
      vec3$o.rotateZ(point3d, point3d, [0, 0, 0], TAU$9 / 4);
      corner3Points.push(vec3$o.add(vec3$o.create(), corner3, point3d));
    }
    if (!positive) {
      corner0Points.reverse();
      corner1Points.reverse();
      corner2Points.reverse();
      corner3Points.reverse();
      return [corner3Points, corner2Points, corner1Points, corner0Points];
    }
    return [corner0Points, corner1Points, corner2Points, corner3Points];
  };
  const stitchCorners = (previousCorners, currentCorners) => {
    const polygons = [];
    for (let i = 0; i < previousCorners.length; i++) {
      const previous = previousCorners[i];
      const current = currentCorners[i];
      for (let j = 0; j < previous.length - 1; j++) {
        polygons.push(poly3$i.create([previous[j], previous[j + 1], current[j]]));
        if (j < current.length - 1) {
          polygons.push(poly3$i.create([current[j], previous[j + 1], current[j + 1]]));
        }
      }
    }
    return polygons;
  };
  const stitchWalls = (previousCorners, currentCorners) => {
    const polygons = [];
    for (let i = 0; i < previousCorners.length; i++) {
      let previous = previousCorners[i];
      let current = currentCorners[i];
      const p0 = previous[previous.length - 1];
      const c0 = current[current.length - 1];
      const j = (i + 1) % previousCorners.length;
      previous = previousCorners[j];
      current = currentCorners[j];
      const p1 = previous[0];
      const c1 = current[0];
      polygons.push(poly3$i.create([p0, p1, c1, c0]));
    }
    return polygons;
  };
  const stitchSides = (bottomCorners, topCorners) => {
    bottomCorners = [bottomCorners[3], bottomCorners[2], bottomCorners[1], bottomCorners[0]];
    bottomCorners = bottomCorners.map((corner) => corner.slice().reverse());
    const bottomPoints = [];
    bottomCorners.forEach((corner) => {
      corner.forEach((point) => bottomPoints.push(point));
    });
    const topPoints = [];
    topCorners.forEach((corner) => {
      corner.forEach((point) => topPoints.push(point));
    });
    const polygons = [];
    for (let i = 0; i < topPoints.length; i++) {
      const j = (i + 1) % topPoints.length;
      polygons.push(poly3$i.create([bottomPoints[i], bottomPoints[j], topPoints[j], topPoints[i]]));
    }
    return polygons;
  };
  const roundedCuboid = (options) => {
    const defaults = {
      center: [0, 0, 0],
      size: [2, 2, 2],
      roundRadius: 0.2,
      segments: 32
    };
    let { center: center2, size, roundRadius, segments } = Object.assign({}, defaults, options);
    if (!isNumberArray$4(center2, 3))
      throw new Error("center must be an array of X, Y and Z values");
    if (!isNumberArray$4(size, 3))
      throw new Error("size must be an array of X, Y and Z values");
    if (!size.every((n) => n > 0))
      throw new Error("size values must be greater than zero");
    if (!isGT$6(roundRadius, 0))
      throw new Error("roundRadius must be greater than zero");
    if (!isGTE$4(segments, 4))
      throw new Error("segments must be four or more");
    size = size.map((v) => v / 2);
    if (roundRadius > size[0] - EPS$9 || roundRadius > size[1] - EPS$9 || roundRadius > size[2] - EPS$9)
      throw new Error("roundRadius must be smaller then the radius of all dimensions");
    segments = Math.floor(segments / 4);
    let prevCornersPos = null;
    let prevCornersNeg = null;
    let polygons = [];
    for (let slice2 = 0; slice2 <= segments; slice2++) {
      const cornersPos = createCorners(center2, size, roundRadius, segments, slice2, true);
      const cornersNeg = createCorners(center2, size, roundRadius, segments, slice2, false);
      if (slice2 === 0) {
        polygons = polygons.concat(stitchSides(cornersNeg, cornersPos));
      }
      if (prevCornersPos) {
        polygons = polygons.concat(
          stitchCorners(prevCornersPos, cornersPos),
          stitchWalls(prevCornersPos, cornersPos)
        );
      }
      if (prevCornersNeg) {
        polygons = polygons.concat(
          stitchCorners(prevCornersNeg, cornersNeg),
          stitchWalls(prevCornersNeg, cornersNeg)
        );
      }
      if (slice2 === segments) {
        let points = cornersPos.map((corner) => corner[0]);
        polygons.push(poly3$i.create(points));
        points = cornersNeg.map((corner) => corner[0]);
        polygons.push(poly3$i.create(points));
      }
      prevCornersPos = cornersPos;
      prevCornersNeg = cornersNeg;
    }
    return geom3$w.create(polygons);
  };
  var roundedCuboid_1 = roundedCuboid;
  const { EPS: EPS$8, TAU: TAU$8 } = constants$1;
  const vec3$n = vec3$Y;
  const geom3$v = geom3$K;
  const poly3$h = poly3$A;
  const { sin, cos } = trigonometry;
  const { isGT: isGT$5, isGTE: isGTE$3, isNumberArray: isNumberArray$3 } = commonChecks;
  const roundedCylinder = (options) => {
    const defaults = {
      center: [0, 0, 0],
      height: 2,
      radius: 1,
      roundRadius: 0.2,
      segments: 32
    };
    const { center: center2, height, radius, roundRadius, segments } = Object.assign({}, defaults, options);
    if (!isNumberArray$3(center2, 3))
      throw new Error("center must be an array of X, Y and Z values");
    if (!isGT$5(height, 0))
      throw new Error("height must be greater then zero");
    if (!isGT$5(radius, 0))
      throw new Error("radius must be greater then zero");
    if (!isGT$5(roundRadius, 0))
      throw new Error("roundRadius must be greater then zero");
    if (roundRadius > radius - EPS$8)
      throw new Error("roundRadius must be smaller then the radius");
    if (!isGTE$3(segments, 4))
      throw new Error("segments must be four or more");
    const start = [0, 0, -(height / 2)];
    const end = [0, 0, height / 2];
    const direction2 = vec3$n.subtract(vec3$n.create(), end, start);
    const length2 = vec3$n.length(direction2);
    if (2 * roundRadius > length2 - EPS$8)
      throw new Error("height must be larger than twice roundRadius");
    let defaultnormal;
    if (Math.abs(direction2[0]) > Math.abs(direction2[1])) {
      defaultnormal = vec3$n.fromValues(0, 1, 0);
    } else {
      defaultnormal = vec3$n.fromValues(1, 0, 0);
    }
    const zvector = vec3$n.scale(vec3$n.create(), vec3$n.normalize(vec3$n.create(), direction2), roundRadius);
    const xvector = vec3$n.scale(vec3$n.create(), vec3$n.normalize(vec3$n.create(), vec3$n.cross(vec3$n.create(), zvector, defaultnormal)), radius);
    const yvector = vec3$n.scale(vec3$n.create(), vec3$n.normalize(vec3$n.create(), vec3$n.cross(vec3$n.create(), xvector, zvector)), radius);
    vec3$n.add(start, start, zvector);
    vec3$n.subtract(end, end, zvector);
    const qsegments = Math.floor(0.25 * segments);
    const fromPoints2 = (points) => {
      const newpoints = points.map((point) => vec3$n.add(point, point, center2));
      return poly3$h.create(newpoints);
    };
    const polygons = [];
    const v12 = vec3$n.create();
    const v22 = vec3$n.create();
    let prevcylinderpoint;
    for (let slice1 = 0; slice1 <= segments; slice1++) {
      const angle2 = TAU$8 * slice1 / segments;
      const cylinderpoint = vec3$n.add(vec3$n.create(), vec3$n.scale(v12, xvector, cos(angle2)), vec3$n.scale(v22, yvector, sin(angle2)));
      if (slice1 > 0) {
        let points = [];
        points.push(vec3$n.add(vec3$n.create(), start, cylinderpoint));
        points.push(vec3$n.add(vec3$n.create(), start, prevcylinderpoint));
        points.push(vec3$n.add(vec3$n.create(), end, prevcylinderpoint));
        points.push(vec3$n.add(vec3$n.create(), end, cylinderpoint));
        polygons.push(fromPoints2(points));
        let prevcospitch, prevsinpitch;
        for (let slice2 = 0; slice2 <= qsegments; slice2++) {
          const pitch = TAU$8 / 4 * slice2 / qsegments;
          const cospitch = cos(pitch);
          const sinpitch = sin(pitch);
          if (slice2 > 0) {
            points = [];
            let point;
            point = vec3$n.add(vec3$n.create(), start, vec3$n.subtract(v12, vec3$n.scale(v12, prevcylinderpoint, prevcospitch), vec3$n.scale(v22, zvector, prevsinpitch)));
            points.push(point);
            point = vec3$n.add(vec3$n.create(), start, vec3$n.subtract(v12, vec3$n.scale(v12, cylinderpoint, prevcospitch), vec3$n.scale(v22, zvector, prevsinpitch)));
            points.push(point);
            if (slice2 < qsegments) {
              point = vec3$n.add(vec3$n.create(), start, vec3$n.subtract(v12, vec3$n.scale(v12, cylinderpoint, cospitch), vec3$n.scale(v22, zvector, sinpitch)));
              points.push(point);
            }
            point = vec3$n.add(vec3$n.create(), start, vec3$n.subtract(v12, vec3$n.scale(v12, prevcylinderpoint, cospitch), vec3$n.scale(v22, zvector, sinpitch)));
            points.push(point);
            polygons.push(fromPoints2(points));
            points = [];
            point = vec3$n.add(vec3$n.create(), vec3$n.scale(v12, prevcylinderpoint, prevcospitch), vec3$n.scale(v22, zvector, prevsinpitch));
            vec3$n.add(point, point, end);
            points.push(point);
            point = vec3$n.add(vec3$n.create(), vec3$n.scale(v12, cylinderpoint, prevcospitch), vec3$n.scale(v22, zvector, prevsinpitch));
            vec3$n.add(point, point, end);
            points.push(point);
            if (slice2 < qsegments) {
              point = vec3$n.add(vec3$n.create(), vec3$n.scale(v12, cylinderpoint, cospitch), vec3$n.scale(v22, zvector, sinpitch));
              vec3$n.add(point, point, end);
              points.push(point);
            }
            point = vec3$n.add(vec3$n.create(), vec3$n.scale(v12, prevcylinderpoint, cospitch), vec3$n.scale(v22, zvector, sinpitch));
            vec3$n.add(point, point, end);
            points.push(point);
            points.reverse();
            polygons.push(fromPoints2(points));
          }
          prevcospitch = cospitch;
          prevsinpitch = sinpitch;
        }
      }
      prevcylinderpoint = cylinderpoint;
    }
    const result = geom3$v.create(polygons);
    return result;
  };
  var roundedCylinder_1 = roundedCylinder;
  const { EPS: EPS$7, TAU: TAU$7 } = constants$1;
  const vec2$a = vec2$E;
  const geom2$y = geom2$K;
  const { isGT: isGT$4, isGTE: isGTE$2, isNumberArray: isNumberArray$2 } = commonChecks;
  const roundedRectangle = (options) => {
    const defaults = {
      center: [0, 0],
      size: [2, 2],
      roundRadius: 0.2,
      segments: 32
    };
    let { center: center2, size, roundRadius, segments } = Object.assign({}, defaults, options);
    if (!isNumberArray$2(center2, 2))
      throw new Error("center must be an array of X and Y values");
    if (!isNumberArray$2(size, 2))
      throw new Error("size must be an array of X and Y values");
    if (!size.every((n) => n > 0))
      throw new Error("size values must be greater than zero");
    if (!isGT$4(roundRadius, 0))
      throw new Error("roundRadius must be greater than zero");
    if (!isGTE$2(segments, 4))
      throw new Error("segments must be four or more");
    size = size.map((v) => v / 2);
    if (roundRadius > size[0] - EPS$7 || roundRadius > size[1] - EPS$7)
      throw new Error("roundRadius must be smaller then the radius of all dimensions");
    const cornersegments = Math.floor(segments / 4);
    const corner0 = vec2$a.add(vec2$a.create(), center2, [size[0] - roundRadius, size[1] - roundRadius]);
    const corner1 = vec2$a.add(vec2$a.create(), center2, [roundRadius - size[0], size[1] - roundRadius]);
    const corner2 = vec2$a.add(vec2$a.create(), center2, [roundRadius - size[0], roundRadius - size[1]]);
    const corner3 = vec2$a.add(vec2$a.create(), center2, [size[0] - roundRadius, roundRadius - size[1]]);
    const corner0Points = [];
    const corner1Points = [];
    const corner2Points = [];
    const corner3Points = [];
    for (let i = 0; i <= cornersegments; i++) {
      const radians = TAU$7 / 4 * i / cornersegments;
      const point = vec2$a.fromAngleRadians(vec2$a.create(), radians);
      vec2$a.scale(point, point, roundRadius);
      corner0Points.push(vec2$a.add(vec2$a.create(), corner0, point));
      vec2$a.rotate(point, point, vec2$a.create(), TAU$7 / 4);
      corner1Points.push(vec2$a.add(vec2$a.create(), corner1, point));
      vec2$a.rotate(point, point, vec2$a.create(), TAU$7 / 4);
      corner2Points.push(vec2$a.add(vec2$a.create(), corner2, point));
      vec2$a.rotate(point, point, vec2$a.create(), TAU$7 / 4);
      corner3Points.push(vec2$a.add(vec2$a.create(), corner3, point));
    }
    return geom2$y.fromPoints(corner0Points.concat(corner1Points, corner2Points, corner3Points));
  };
  var roundedRectangle_1 = roundedRectangle;
  const ellipsoid = ellipsoid_1;
  const { isGT: isGT$3 } = commonChecks;
  const sphere$1 = (options) => {
    const defaults = {
      center: [0, 0, 0],
      radius: 1,
      segments: 32,
      axes: [[1, 0, 0], [0, -1, 0], [0, 0, 1]]
    };
    let { center: center2, radius, segments, axes } = Object.assign({}, defaults, options);
    if (!isGT$3(radius, 0))
      throw new Error("radius must be greater than zero");
    radius = [radius, radius, radius];
    return ellipsoid({ center: center2, radius, segments, axes });
  };
  var sphere_1 = sphere$1;
  const rectangle = rectangle_1;
  const { isGT: isGT$2 } = commonChecks;
  const square = (options) => {
    const defaults = {
      center: [0, 0],
      size: 2
    };
    let { center: center2, size } = Object.assign({}, defaults, options);
    if (!isGT$2(size, 0))
      throw new Error("size must be greater than zero");
    size = [size, size];
    return rectangle({ center: center2, size });
  };
  var square_1 = square;
  const { TAU: TAU$6 } = constants$1;
  const vec2$9 = vec2$E;
  const geom2$x = geom2$K;
  const { isGT: isGT$1, isGTE: isGTE$1, isNumberArray: isNumberArray$1 } = commonChecks;
  const getRadiusRatio = (vertices, density) => {
    if (vertices > 0 && density > 1 && density < vertices / 2) {
      return Math.cos(Math.PI * density / vertices) / Math.cos(Math.PI * (density - 1) / vertices);
    }
    return 0;
  };
  const getPoints = (vertices, radius, startAngle, center2) => {
    const a = TAU$6 / vertices;
    const points = [];
    for (let i = 0; i < vertices; i++) {
      const point = vec2$9.fromAngleRadians(vec2$9.create(), a * i + startAngle);
      vec2$9.scale(point, point, radius);
      vec2$9.add(point, center2, point);
      points.push(point);
    }
    return points;
  };
  const star = (options) => {
    const defaults = {
      center: [0, 0],
      vertices: 5,
      outerRadius: 1,
      innerRadius: 0,
      density: 2,
      startAngle: 0
    };
    let { center: center2, vertices, outerRadius, innerRadius, density, startAngle } = Object.assign({}, defaults, options);
    if (!isNumberArray$1(center2, 2))
      throw new Error("center must be an array of X and Y values");
    if (!isGTE$1(vertices, 2))
      throw new Error("vertices must be two or more");
    if (!isGT$1(outerRadius, 0))
      throw new Error("outerRadius must be greater than zero");
    if (!isGTE$1(innerRadius, 0))
      throw new Error("innerRadius must be greater than zero");
    if (!isGTE$1(startAngle, 0))
      throw new Error("startAngle must be greater than zero");
    vertices = Math.floor(vertices);
    density = Math.floor(density);
    startAngle = startAngle % TAU$6;
    if (innerRadius === 0) {
      if (!isGTE$1(density, 2))
        throw new Error("density must be two or more");
      innerRadius = outerRadius * getRadiusRatio(vertices, density);
    }
    const centerv = vec2$9.clone(center2);
    const outerPoints = getPoints(vertices, outerRadius, startAngle, centerv);
    const innerPoints = getPoints(vertices, innerRadius, startAngle + Math.PI / vertices, centerv);
    const allPoints = [];
    for (let i = 0; i < vertices; i++) {
      allPoints.push(outerPoints[i]);
      allPoints.push(innerPoints[i]);
    }
    return geom2$x.fromPoints(allPoints);
  };
  var star_1 = star;
  const flatten$s = flatten_1;
  const mat4$b = mat4$r;
  const plane$5 = plane$b;
  const geom2$w = geom2$K;
  const geom3$u = geom3$K;
  const path2$k = path2$u;
  const mirror = (options, ...objects) => {
    const defaults = {
      origin: [0, 0, 0],
      normal: [0, 0, 1]
      // Z axis
    };
    const { origin: origin2, normal: normal2 } = Object.assign({}, defaults, options);
    objects = flatten$s(objects);
    if (objects.length === 0)
      throw new Error("wrong number of arguments");
    const planeOfMirror = plane$5.fromNormalAndPoint(plane$5.create(), normal2, origin2);
    if (Number.isNaN(planeOfMirror[0])) {
      throw new Error("the given origin and normal do not define a proper plane");
    }
    const matrix = mat4$b.mirrorByPlane(mat4$b.create(), planeOfMirror);
    const results = objects.map((object) => {
      if (path2$k.isA(object))
        return path2$k.transform(matrix, object);
      if (geom2$w.isA(object))
        return geom2$w.transform(matrix, object);
      if (geom3$u.isA(object))
        return geom3$u.transform(matrix, object);
      return object;
    });
    return results.length === 1 ? results[0] : results;
  };
  const mirrorX$1 = (...objects) => mirror({ normal: [1, 0, 0] }, objects);
  const mirrorY = (...objects) => mirror({ normal: [0, 1, 0] }, objects);
  const mirrorZ = (...objects) => mirror({ normal: [0, 0, 1] }, objects);
  var mirror_1 = {
    mirror,
    mirrorX: mirrorX$1,
    mirrorY,
    mirrorZ
  };
  const plane$4 = plane$b;
  const vec3$m = vec3$Y;
  const calculatePlane$1 = (slice2) => {
    const edges = slice2.edges;
    if (edges.length < 3)
      throw new Error("slices must have 3 or more edges to calculate a plane");
    const midpoint = edges.reduce((point, edge) => vec3$m.add(vec3$m.create(), point, edge[0]), vec3$m.create());
    vec3$m.scale(midpoint, midpoint, 1 / edges.length);
    let farthestEdge;
    let distance2 = 0;
    edges.forEach((edge) => {
      if (!vec3$m.equals(edge[0], edge[1])) {
        const d = vec3$m.squaredDistance(midpoint, edge[0]);
        if (d > distance2) {
          farthestEdge = edge;
          distance2 = d;
        }
      }
    });
    const beforeEdge = edges.find((edge) => vec3$m.equals(edge[1], farthestEdge[0]));
    return plane$4.fromPoints(plane$4.create(), beforeEdge[0], farthestEdge[0], farthestEdge[1]);
  };
  var calculatePlane_1 = calculatePlane$1;
  const create$6 = (edges) => {
    if (!edges) {
      edges = [];
    }
    return { edges };
  };
  var create_1 = create$6;
  const create$5 = create_1;
  const vec3$l = vec3$Y;
  const clone = (...params) => {
    let out;
    let slice2;
    if (params.length === 1) {
      out = create$5();
      slice2 = params[0];
    } else {
      out = params[0];
      slice2 = params[1];
    }
    out.edges = slice2.edges.map((edge) => [vec3$l.clone(edge[0]), vec3$l.clone(edge[1])]);
    return out;
  };
  var clone_1 = clone;
  const vec3$k = vec3$Y;
  const equals$1 = (a, b) => {
    const aedges = a.edges;
    const bedges = b.edges;
    if (aedges.length !== bedges.length) {
      return false;
    }
    const isEqual = aedges.reduce((acc, aedge, i) => {
      const bedge = bedges[i];
      const d = vec3$k.squaredDistance(aedge[0], bedge[0]);
      return acc && d < Number.EPSILON;
    }, true);
    return isEqual;
  };
  var equals_1 = equals$1;
  const vec3$j = vec3$Y;
  const create$4 = create_1;
  const fromPoints = (points) => {
    if (!Array.isArray(points))
      throw new Error("the given points must be an array");
    if (points.length < 3)
      throw new Error("the given points must contain THREE or more points");
    const edges = [];
    let prevpoint = points[points.length - 1];
    points.forEach((point) => {
      if (point.length === 2)
        edges.push([vec3$j.fromVec2(vec3$j.create(), prevpoint), vec3$j.fromVec2(vec3$j.create(), point)]);
      if (point.length === 3)
        edges.push([prevpoint, point]);
      prevpoint = point;
    });
    return create$4(edges);
  };
  var fromPoints_1 = fromPoints;
  const vec3$i = vec3$Y;
  const create$3 = create_1;
  const fromSides = (sides) => {
    if (!Array.isArray(sides))
      throw new Error("the given sides must be an array");
    const edges = [];
    sides.forEach((side) => {
      edges.push([vec3$i.fromVec2(vec3$i.create(), side[0]), vec3$i.fromVec2(vec3$i.create(), side[1])]);
    });
    return create$3(edges);
  };
  var fromSides_1 = fromSides;
  const isA = (object) => {
    if (object && typeof object === "object") {
      if ("edges" in object) {
        if (Array.isArray(object.edges)) {
          return true;
        }
      }
    }
    return false;
  };
  var isA_1 = isA;
  const create$2 = create_1;
  const reverse = (...params) => {
    let out;
    let slice2;
    if (params.length === 1) {
      out = create$2();
      slice2 = params[0];
    } else {
      out = params[0];
      slice2 = params[1];
    }
    out.edges = slice2.edges.map((edge) => [edge[1], edge[0]]);
    return out;
  };
  var reverse_1 = reverse;
  const toEdges = (slice2) => slice2.edges;
  var toEdges_1 = toEdges;
  const sortLinked$2 = (list, fn) => {
    let i, p, q, e, numMerges;
    let inSize = 1;
    do {
      p = list;
      list = null;
      let tail = null;
      numMerges = 0;
      while (p) {
        numMerges++;
        q = p;
        let pSize = 0;
        for (i = 0; i < inSize; i++) {
          pSize++;
          q = q.nextZ;
          if (!q)
            break;
        }
        let qSize = inSize;
        while (pSize > 0 || qSize > 0 && q) {
          if (pSize !== 0 && (qSize === 0 || !q || fn(p) <= fn(q))) {
            e = p;
            p = p.nextZ;
            pSize--;
          } else {
            e = q;
            q = q.nextZ;
            qSize--;
          }
          if (tail)
            tail.nextZ = e;
          else
            list = e;
          e.prevZ = tail;
          tail = e;
        }
        p = q;
      }
      tail.nextZ = null;
      inSize *= 2;
    } while (numMerges > 1);
    return list;
  };
  var linkedListSort = sortLinked$2;
  const sortLinked$1 = linkedListSort;
  let Node$3 = class Node {
    constructor(i, x, y) {
      this.i = i;
      this.x = x;
      this.y = y;
      this.prev = null;
      this.next = null;
      this.z = null;
      this.prevZ = null;
      this.nextZ = null;
      this.steiner = false;
    }
  };
  const insertNode$1 = (i, x, y, last) => {
    const p = new Node$3(i, x, y);
    if (!last) {
      p.prev = p;
      p.next = p;
    } else {
      p.next = last.next;
      p.prev = last;
      last.next.prev = p;
      last.next = p;
    }
    return p;
  };
  const removeNode$2 = (p) => {
    p.next.prev = p.prev;
    p.prev.next = p.next;
    if (p.prevZ)
      p.prevZ.nextZ = p.nextZ;
    if (p.nextZ)
      p.nextZ.prevZ = p.prevZ;
  };
  var linkedList = { Node: Node$3, insertNode: insertNode$1, removeNode: removeNode$2, sortLinked: sortLinked$1 };
  const pointInTriangle$2 = (ax, ay, bx, by, cx, cy, px, py) => (cx - px) * (ay - py) - (ax - px) * (cy - py) >= 0 && (ax - px) * (by - py) - (bx - px) * (ay - py) >= 0 && (bx - px) * (cy - py) - (cx - px) * (by - py) >= 0;
  const area$7 = (p, q, r) => (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
  var triangle$1 = { area: area$7, pointInTriangle: pointInTriangle$2 };
  const { Node: Node$2, insertNode, removeNode: removeNode$1 } = linkedList;
  const { area: area$6 } = triangle$1;
  const linkedPolygon$2 = (data, start, end, dim, clockwise) => {
    let last;
    if (clockwise === signedArea(data, start, end, dim) > 0) {
      for (let i = start; i < end; i += dim) {
        last = insertNode(i, data[i], data[i + 1], last);
      }
    } else {
      for (let i = end - dim; i >= start; i -= dim) {
        last = insertNode(i, data[i], data[i + 1], last);
      }
    }
    if (last && equals(last, last.next)) {
      removeNode$1(last);
      last = last.next;
    }
    return last;
  };
  const filterPoints$2 = (start, end) => {
    if (!start)
      return start;
    if (!end)
      end = start;
    let p = start;
    let again;
    do {
      again = false;
      if (!p.steiner && (equals(p, p.next) || area$6(p.prev, p, p.next) === 0)) {
        removeNode$1(p);
        p = end = p.prev;
        if (p === p.next)
          break;
        again = true;
      } else {
        p = p.next;
      }
    } while (again || p !== end);
    return end;
  };
  const cureLocalIntersections$1 = (start, triangles, dim) => {
    let p = start;
    do {
      const a = p.prev;
      const b = p.next.next;
      if (!equals(a, b) && intersects(a, p, p.next, b) && locallyInside$1(a, b) && locallyInside$1(b, a)) {
        triangles.push(a.i / dim);
        triangles.push(p.i / dim);
        triangles.push(b.i / dim);
        removeNode$1(p);
        removeNode$1(p.next);
        p = start = b;
      }
      p = p.next;
    } while (p !== start);
    return filterPoints$2(p);
  };
  const intersectsPolygon = (a, b) => {
    let p = a;
    do {
      if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i && intersects(p, p.next, a, b))
        return true;
      p = p.next;
    } while (p !== a);
    return false;
  };
  const locallyInside$1 = (a, b) => area$6(a.prev, a, a.next) < 0 ? area$6(a, b, a.next) >= 0 && area$6(a, a.prev, b) >= 0 : area$6(a, b, a.prev) < 0 || area$6(a, a.next, b) < 0;
  const middleInside = (a, b) => {
    let p = a;
    let inside = false;
    const px = (a.x + b.x) / 2;
    const py = (a.y + b.y) / 2;
    do {
      if (p.y > py !== p.next.y > py && p.next.y !== p.y && px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x) {
        inside = !inside;
      }
      p = p.next;
    } while (p !== a);
    return inside;
  };
  const splitPolygon$2 = (a, b) => {
    const a2 = new Node$2(a.i, a.x, a.y);
    const b2 = new Node$2(b.i, b.x, b.y);
    const an = a.next;
    const bp = b.prev;
    a.next = b;
    b.prev = a;
    a2.next = an;
    an.prev = a2;
    b2.next = a2;
    a2.prev = b2;
    bp.next = b2;
    b2.prev = bp;
    return b2;
  };
  const isValidDiagonal$1 = (a, b) => a.next.i !== b.i && a.prev.i !== b.i && !intersectsPolygon(a, b) && // doesn't intersect other edges
  (locallyInside$1(a, b) && locallyInside$1(b, a) && middleInside(a, b) && // locally visible
  (area$6(a.prev, a, b.prev) || area$6(a, b.prev, b)) || // does not create opposite-facing sectors
  equals(a, b) && area$6(a.prev, a, a.next) > 0 && area$6(b.prev, b, b.next) > 0);
  const intersects = (p1, q1, p2, q2) => {
    const o1 = Math.sign(area$6(p1, q1, p2));
    const o2 = Math.sign(area$6(p1, q1, q2));
    const o3 = Math.sign(area$6(p2, q2, p1));
    const o4 = Math.sign(area$6(p2, q2, q1));
    if (o1 !== o2 && o3 !== o4)
      return true;
    if (o1 === 0 && onSegment(p1, p2, q1))
      return true;
    if (o2 === 0 && onSegment(p1, q2, q1))
      return true;
    if (o3 === 0 && onSegment(p2, p1, q2))
      return true;
    if (o4 === 0 && onSegment(p2, q1, q2))
      return true;
    return false;
  };
  const onSegment = (p, q, r) => q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);
  const signedArea = (data, start, end, dim) => {
    let sum = 0;
    for (let i = start, j = end - dim; i < end; i += dim) {
      sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
      j = i;
    }
    return sum;
  };
  const equals = (p1, p2) => p1.x === p2.x && p1.y === p2.y;
  var linkedPolygon_1 = { cureLocalIntersections: cureLocalIntersections$1, filterPoints: filterPoints$2, isValidDiagonal: isValidDiagonal$1, linkedPolygon: linkedPolygon$2, locallyInside: locallyInside$1, splitPolygon: splitPolygon$2 };
  const { filterPoints: filterPoints$1, linkedPolygon: linkedPolygon$1, locallyInside, splitPolygon: splitPolygon$1 } = linkedPolygon_1;
  const { area: area$5, pointInTriangle: pointInTriangle$1 } = triangle$1;
  const eliminateHoles$1 = (data, holeIndices, outerNode, dim) => {
    const queue = [];
    for (let i = 0, len = holeIndices.length; i < len; i++) {
      const start = holeIndices[i] * dim;
      const end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
      const list = linkedPolygon$1(data, start, end, dim, false);
      if (list === list.next)
        list.steiner = true;
      queue.push(getLeftmost(list));
    }
    queue.sort((a, b) => a.x - b.x);
    for (let i = 0; i < queue.length; i++) {
      outerNode = eliminateHole(queue[i], outerNode);
      outerNode = filterPoints$1(outerNode, outerNode.next);
    }
    return outerNode;
  };
  const eliminateHole = (hole, outerNode) => {
    const bridge = findHoleBridge(hole, outerNode);
    if (!bridge) {
      return outerNode;
    }
    const bridgeReverse = splitPolygon$1(bridge, hole);
    const filteredBridge = filterPoints$1(bridge, bridge.next);
    filterPoints$1(bridgeReverse, bridgeReverse.next);
    return outerNode === bridge ? filteredBridge : outerNode;
  };
  const findHoleBridge = (hole, outerNode) => {
    let p = outerNode;
    const hx = hole.x;
    const hy = hole.y;
    let qx = -Infinity;
    let m;
    do {
      if (hy <= p.y && hy >= p.next.y && p.next.y !== p.y) {
        const x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);
        if (x <= hx && x > qx) {
          qx = x;
          if (x === hx) {
            if (hy === p.y)
              return p;
            if (hy === p.next.y)
              return p.next;
          }
          m = p.x < p.next.x ? p : p.next;
        }
      }
      p = p.next;
    } while (p !== outerNode);
    if (!m)
      return null;
    if (hx === qx)
      return m;
    const stop = m;
    const mx = m.x;
    const my = m.y;
    let tanMin = Infinity;
    p = m;
    do {
      if (hx >= p.x && p.x >= mx && hx !== p.x && pointInTriangle$1(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {
        const tan = Math.abs(hy - p.y) / (hx - p.x);
        if (locallyInside(p, hole) && (tan < tanMin || tan === tanMin && (p.x > m.x || p.x === m.x && sectorContainsSector(m, p)))) {
          m = p;
          tanMin = tan;
        }
      }
      p = p.next;
    } while (p !== stop);
    return m;
  };
  const sectorContainsSector = (m, p) => area$5(m.prev, m, p.prev) < 0 && area$5(p.next, m, m.next) < 0;
  const getLeftmost = (start) => {
    let p = start;
    let leftmost = start;
    do {
      if (p.x < leftmost.x || p.x === leftmost.x && p.y < leftmost.y)
        leftmost = p;
      p = p.next;
    } while (p !== start);
    return leftmost;
  };
  var eliminateHoles_1 = eliminateHoles$1;
  const eliminateHoles = eliminateHoles_1;
  const { removeNode, sortLinked } = linkedList;
  const { cureLocalIntersections, filterPoints, isValidDiagonal, linkedPolygon, splitPolygon } = linkedPolygon_1;
  const { area: area$4, pointInTriangle } = triangle$1;
  const triangulate = (data, holeIndices, dim = 2) => {
    const hasHoles = holeIndices && holeIndices.length;
    const outerLen = hasHoles ? holeIndices[0] * dim : data.length;
    let outerNode = linkedPolygon(data, 0, outerLen, dim, true);
    const triangles = [];
    if (!outerNode || outerNode.next === outerNode.prev)
      return triangles;
    let minX, minY, maxX, maxY, invSize;
    if (hasHoles)
      outerNode = eliminateHoles(data, holeIndices, outerNode, dim);
    if (data.length > 80 * dim) {
      minX = maxX = data[0];
      minY = maxY = data[1];
      for (let i = dim; i < outerLen; i += dim) {
        const x = data[i];
        const y = data[i + 1];
        if (x < minX)
          minX = x;
        if (y < minY)
          minY = y;
        if (x > maxX)
          maxX = x;
        if (y > maxY)
          maxY = y;
      }
      invSize = Math.max(maxX - minX, maxY - minY);
      invSize = invSize !== 0 ? 1 / invSize : 0;
    }
    earcutLinked(outerNode, triangles, dim, minX, minY, invSize);
    return triangles;
  };
  const earcutLinked = (ear, triangles, dim, minX, minY, invSize, pass) => {
    if (!ear)
      return;
    if (!pass && invSize)
      indexCurve(ear, minX, minY, invSize);
    let stop = ear;
    let prev;
    let next;
    while (ear.prev !== ear.next) {
      prev = ear.prev;
      next = ear.next;
      if (invSize ? isEarHashed(ear, minX, minY, invSize) : isEar(ear)) {
        triangles.push(prev.i / dim);
        triangles.push(ear.i / dim);
        triangles.push(next.i / dim);
        removeNode(ear);
        ear = next.next;
        stop = next.next;
        continue;
      }
      ear = next;
      if (ear === stop) {
        if (!pass) {
          earcutLinked(filterPoints(ear), triangles, dim, minX, minY, invSize, 1);
        } else if (pass === 1) {
          ear = cureLocalIntersections(filterPoints(ear), triangles, dim);
          earcutLinked(ear, triangles, dim, minX, minY, invSize, 2);
        } else if (pass === 2) {
          splitEarcut(ear, triangles, dim, minX, minY, invSize);
        }
        break;
      }
    }
  };
  const isEar = (ear) => {
    const a = ear.prev;
    const b = ear;
    const c = ear.next;
    if (area$4(a, b, c) >= 0)
      return false;
    let p = ear.next.next;
    while (p !== ear.prev) {
      if (pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) && area$4(p.prev, p, p.next) >= 0) {
        return false;
      }
      p = p.next;
    }
    return true;
  };
  const isEarHashed = (ear, minX, minY, invSize) => {
    const a = ear.prev;
    const b = ear;
    const c = ear.next;
    if (area$4(a, b, c) >= 0)
      return false;
    const minTX = a.x < b.x ? a.x < c.x ? a.x : c.x : b.x < c.x ? b.x : c.x;
    const minTY = a.y < b.y ? a.y < c.y ? a.y : c.y : b.y < c.y ? b.y : c.y;
    const maxTX = a.x > b.x ? a.x > c.x ? a.x : c.x : b.x > c.x ? b.x : c.x;
    const maxTY = a.y > b.y ? a.y > c.y ? a.y : c.y : b.y > c.y ? b.y : c.y;
    const minZ = zOrder(minTX, minTY, minX, minY, invSize);
    const maxZ = zOrder(maxTX, maxTY, minX, minY, invSize);
    let p = ear.prevZ;
    let n = ear.nextZ;
    while (p && p.z >= minZ && n && n.z <= maxZ) {
      if (p !== ear.prev && p !== ear.next && pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) && area$4(p.prev, p, p.next) >= 0)
        return false;
      p = p.prevZ;
      if (n !== ear.prev && n !== ear.next && pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, n.x, n.y) && area$4(n.prev, n, n.next) >= 0)
        return false;
      n = n.nextZ;
    }
    while (p && p.z >= minZ) {
      if (p !== ear.prev && p !== ear.next && pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) && area$4(p.prev, p, p.next) >= 0)
        return false;
      p = p.prevZ;
    }
    while (n && n.z <= maxZ) {
      if (n !== ear.prev && n !== ear.next && pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, n.x, n.y) && area$4(n.prev, n, n.next) >= 0)
        return false;
      n = n.nextZ;
    }
    return true;
  };
  const splitEarcut = (start, triangles, dim, minX, minY, invSize) => {
    let a = start;
    do {
      let b = a.next.next;
      while (b !== a.prev) {
        if (a.i !== b.i && isValidDiagonal(a, b)) {
          let c = splitPolygon(a, b);
          a = filterPoints(a, a.next);
          c = filterPoints(c, c.next);
          earcutLinked(a, triangles, dim, minX, minY, invSize);
          earcutLinked(c, triangles, dim, minX, minY, invSize);
          return;
        }
        b = b.next;
      }
      a = a.next;
    } while (a !== start);
  };
  const indexCurve = (start, minX, minY, invSize) => {
    let p = start;
    do {
      if (p.z === null)
        p.z = zOrder(p.x, p.y, minX, minY, invSize);
      p.prevZ = p.prev;
      p.nextZ = p.next;
      p = p.next;
    } while (p !== start);
    p.prevZ.nextZ = null;
    p.prevZ = null;
    sortLinked(p, (p2) => p2.z);
  };
  const zOrder = (x, y, minX, minY, invSize) => {
    x = 32767 * (x - minX) * invSize;
    y = 32767 * (y - minY) * invSize;
    x = (x | x << 8) & 16711935;
    x = (x | x << 4) & 252645135;
    x = (x | x << 2) & 858993459;
    x = (x | x << 1) & 1431655765;
    y = (y | y << 8) & 16711935;
    y = (y | y << 4) & 252645135;
    y = (y | y << 2) & 858993459;
    y = (y | y << 1) & 1431655765;
    return x | y << 1;
  };
  var earcut$1 = triangulate;
  const { area: area$3 } = utils$1;
  const { toOutlines } = geom2$K;
  const { arePointsInside } = poly2$1;
  const assignHoles$1 = (geometry) => {
    const outlines = toOutlines(geometry);
    const solids = [];
    const holes = [];
    outlines.forEach((outline, i) => {
      const a = area$3(outline);
      if (a < 0) {
        holes.push(i);
      } else if (a > 0) {
        solids.push(i);
      }
    });
    const children = [];
    const parents = [];
    solids.forEach((s, i) => {
      const solid = outlines[s];
      children[i] = [];
      holes.forEach((h, j) => {
        const hole = outlines[h];
        if (arePointsInside([hole[0]], { vertices: solid })) {
          children[i].push(h);
          if (!parents[j])
            parents[j] = [];
          parents[j].push(i);
        }
      });
    });
    holes.forEach((h, j) => {
      if (parents[j] && parents[j].length > 1) {
        const directParent = minIndex(parents[j], (p) => children[p].length);
        parents[j].forEach((p, i) => {
          if (i !== directParent) {
            children[p] = children[p].filter((c) => c !== h);
          }
        });
      }
    });
    return children.map((holes2, i) => ({
      solid: outlines[solids[i]],
      holes: holes2.map((h) => outlines[h])
    }));
  };
  const minIndex = (list, score) => {
    let bestIndex;
    let best;
    list.forEach((item, index) => {
      const value = score(item);
      if (best === void 0 || value < best) {
        bestIndex = index;
        best = value;
      }
    });
    return bestIndex;
  };
  var assignHoles_1 = assignHoles$1;
  const geom2$v = geom2$K;
  const plane$3 = plane$b;
  const vec2$8 = vec2$E;
  const vec3$h = vec3$Y;
  const calculatePlane = calculatePlane_1;
  const assignHoles = assignHoles_1;
  let PolygonHierarchy$1 = class PolygonHierarchy {
    constructor(slice2) {
      this.plane = calculatePlane(slice2);
      const rightvector = vec3$h.orthogonal(vec3$h.create(), this.plane);
      const perp = vec3$h.cross(vec3$h.create(), this.plane, rightvector);
      this.v = vec3$h.normalize(perp, perp);
      this.u = vec3$h.cross(vec3$h.create(), this.v, this.plane);
      this.basisMap = /* @__PURE__ */ new Map();
      const projected = slice2.edges.map((e) => e.map((v) => this.to2D(v)));
      const geometry = geom2$v.create(projected);
      this.roots = assignHoles(geometry);
    }
    /*
     * project a 3D point onto the 2D plane
     */
    to2D(vector3) {
      const vector2 = vec2$8.fromValues(vec3$h.dot(vector3, this.u), vec3$h.dot(vector3, this.v));
      this.basisMap.set(vector2, vector3);
      return vector2;
    }
    /*
     * un-project a 2D point back into 3D
     */
    to3D(vector2) {
      const original = this.basisMap.get(vector2);
      if (original) {
        return original;
      } else {
        console.log("Warning: point not in original slice");
        const v12 = vec3$h.scale(vec3$h.create(), this.u, vector2[0]);
        const v22 = vec3$h.scale(vec3$h.create(), this.v, vector2[1]);
        const planeOrigin = vec3$h.scale(vec3$h.create(), plane$3, plane$3[3]);
        const v3 = vec3$h.add(v12, v12, planeOrigin);
        return vec3$h.add(v22, v22, v3);
      }
    }
  };
  var polygonHierarchy = PolygonHierarchy$1;
  const poly3$g = poly3$A;
  const earcut = earcut$1;
  const PolygonHierarchy = polygonHierarchy;
  const toPolygons = (slice2) => {
    const hierarchy = new PolygonHierarchy(slice2);
    const polygons = [];
    hierarchy.roots.forEach(({ solid, holes }) => {
      let index = solid.length;
      const holesIndex = [];
      holes.forEach((hole, i) => {
        holesIndex.push(index);
        index += hole.length;
      });
      const vertices = [solid, ...holes].flat();
      const data = vertices.flat();
      const getVertex = (i) => hierarchy.to3D(vertices[i]);
      const indices = earcut(data, holesIndex);
      for (let i = 0; i < indices.length; i += 3) {
        const tri = indices.slice(i, i + 3).map(getVertex);
        polygons.push(poly3$g.fromPointsAndPlane(tri, hierarchy.plane));
      }
    });
    return polygons;
  };
  var toPolygons_1 = toPolygons;
  const vec3$g = vec3$Y;
  const edgesToString = (edges) => edges.reduce((result, edge) => result += `[${vec3$g.toString(edge[0])}, ${vec3$g.toString(edge[1])}], `, "");
  const toString = (slice2) => `[${edgesToString(slice2.edges)}]`;
  var toString_1 = toString;
  const vec3$f = vec3$Y;
  const create$1 = create_1;
  const transform$1 = (matrix, slice2) => {
    const edges = slice2.edges.map((edge) => [vec3$f.transform(vec3$f.create(), edge[0], matrix), vec3$f.transform(vec3$f.create(), edge[1], matrix)]);
    return create$1(edges);
  };
  var transform_1$1 = transform$1;
  var slice$5 = {
    calculatePlane: calculatePlane_1,
    clone: clone_1,
    create: create_1,
    equals: equals_1,
    fromPoints: fromPoints_1,
    fromSides: fromSides_1,
    isA: isA_1,
    reverse: reverse_1,
    toEdges: toEdges_1,
    toPolygons: toPolygons_1,
    toString: toString_1,
    transform: transform_1$1
  };
  const vec3$e = vec3$Y;
  const create = create_1;
  const repair = (slice2) => {
    if (!slice2.edges)
      return slice2;
    let edges = slice2.edges;
    const vertexMap = /* @__PURE__ */ new Map();
    const edgeCount = /* @__PURE__ */ new Map();
    edges = edges.filter((e) => !vec3$e.equals(e[0], e[1]));
    edges.forEach((edge) => {
      const inKey = edge[0].toString();
      const outKey = edge[1].toString();
      vertexMap.set(inKey, edge[0]);
      vertexMap.set(outKey, edge[1]);
      edgeCount.set(inKey, (edgeCount.get(inKey) || 0) + 1);
      edgeCount.set(outKey, (edgeCount.get(outKey) || 0) - 1);
    });
    const missingIn = [];
    const missingOut = [];
    edgeCount.forEach((count, vertex) => {
      if (count < 0)
        missingIn.push(vertex);
      if (count > 0)
        missingOut.push(vertex);
    });
    missingIn.forEach((key1) => {
      const v12 = vertexMap.get(key1);
      let bestDistance = Infinity;
      let bestReplacement;
      missingOut.forEach((key2) => {
        const v22 = vertexMap.get(key2);
        const distance2 = vec3$e.distance(v12, v22);
        if (distance2 < bestDistance) {
          bestDistance = distance2;
          bestReplacement = v22;
        }
      });
      console.warn(`slice.repair: repairing vertex gap ${v12} to ${bestReplacement} distance ${bestDistance}`);
      edges = edges.map((edge) => {
        if (edge[0].toString() === key1)
          return [bestReplacement, edge[1]];
        if (edge[1].toString() === key1)
          return [edge[0], bestReplacement];
        return edge;
      });
    });
    return create(edges);
  };
  var repair_1 = repair;
  const { EPS: EPS$6 } = constants$1;
  const vec3$d = vec3$Y;
  const poly3$f = poly3$A;
  const slice$4 = slice$5;
  const gcd = (a, b) => {
    if (a === b) {
      return a;
    }
    if (a < b) {
      return gcd(b, a);
    }
    if (b === 1) {
      return 1;
    }
    if (b === 0) {
      return a;
    }
    return gcd(b, a % b);
  };
  const lcm = (a, b) => a * b / gcd(a, b);
  const repartitionEdges = (newlength, edges) => {
    const multiple = newlength / edges.length;
    if (multiple === 1) {
      return edges;
    }
    const divisor = vec3$d.fromValues(multiple, multiple, multiple);
    const newEdges = [];
    edges.forEach((edge) => {
      const increment = vec3$d.subtract(vec3$d.create(), edge[1], edge[0]);
      vec3$d.divide(increment, increment, divisor);
      let prev = edge[0];
      for (let i = 1; i <= multiple; ++i) {
        const next = vec3$d.add(vec3$d.create(), prev, increment);
        newEdges.push([prev, next]);
        prev = next;
      }
    });
    return newEdges;
  };
  const EPSAREA = EPS$6 * EPS$6 / 2 * Math.sin(Math.PI / 3);
  const extrudeWalls$1 = (slice0, slice1) => {
    let edges0 = slice$4.toEdges(slice0);
    let edges1 = slice$4.toEdges(slice1);
    if (edges0.length !== edges1.length) {
      const newlength = lcm(edges0.length, edges1.length);
      if (newlength !== edges0.length)
        edges0 = repartitionEdges(newlength, edges0);
      if (newlength !== edges1.length)
        edges1 = repartitionEdges(newlength, edges1);
    }
    const walls = [];
    edges0.forEach((edge0, i) => {
      const edge1 = edges1[i];
      const poly0 = poly3$f.create([edge0[0], edge0[1], edge1[1]]);
      const poly0area = poly3$f.measureArea(poly0);
      if (Number.isFinite(poly0area) && poly0area > EPSAREA)
        walls.push(poly0);
      const poly1 = poly3$f.create([edge0[0], edge1[1], edge1[0]]);
      const poly1area = poly3$f.measureArea(poly1);
      if (Number.isFinite(poly1area) && poly1area > EPSAREA)
        walls.push(poly1);
    });
    return walls;
  };
  var extrudeWalls_1 = extrudeWalls$1;
  const mat4$a = mat4$r;
  const geom2$u = geom2$K;
  const geom3$t = geom3$K;
  const poly3$e = poly3$A;
  const slice$3 = slice$5;
  const repairSlice = repair_1;
  const extrudeWalls = extrudeWalls_1;
  const defaultCallback = (progress, index, base) => {
    let baseSlice = null;
    if (geom2$u.isA(base))
      baseSlice = slice$3.fromSides(geom2$u.toSides(base));
    if (poly3$e.isA(base))
      baseSlice = slice$3.fromPoints(poly3$e.toPoints(base));
    return progress === 0 || progress === 1 ? slice$3.transform(mat4$a.fromTranslation(mat4$a.create(), [0, 0, progress]), baseSlice) : null;
  };
  const extrudeFromSlices$3 = (options, base) => {
    const defaults = {
      numberOfSlices: 2,
      capStart: true,
      capEnd: true,
      close: false,
      repair: true,
      callback: defaultCallback
    };
    const { numberOfSlices, capStart, capEnd, close: close2, repair: repair2, callback: generate } = Object.assign({}, defaults, options);
    if (numberOfSlices < 2)
      throw new Error("numberOfSlices must be 2 or more");
    if (repair2) {
      base = repairSlice(base);
    }
    const sMax = numberOfSlices - 1;
    let startSlice = null;
    let endSlice = null;
    let prevSlice = null;
    let polygons = [];
    for (let s = 0; s < numberOfSlices; s++) {
      const currentSlice = generate(s / sMax, s, base);
      if (currentSlice) {
        if (!slice$3.isA(currentSlice))
          throw new Error("the callback function must return slice objects");
        const edges = slice$3.toEdges(currentSlice);
        if (edges.length === 0)
          throw new Error("the callback function must return slices with one or more edges");
        if (prevSlice) {
          polygons = polygons.concat(extrudeWalls(prevSlice, currentSlice));
        }
        if (s === 0)
          startSlice = currentSlice;
        if (s === numberOfSlices - 1)
          endSlice = currentSlice;
        prevSlice = currentSlice;
      }
    }
    if (capEnd) {
      const endPolygons = slice$3.toPolygons(endSlice);
      polygons = polygons.concat(endPolygons);
    }
    if (capStart) {
      const startPolygons = slice$3.toPolygons(startSlice).map(poly3$e.invert);
      polygons = polygons.concat(startPolygons);
    }
    if (!capStart && !capEnd) {
      if (close2 && !slice$3.equals(endSlice, startSlice)) {
        polygons = polygons.concat(extrudeWalls(endSlice, startSlice));
      }
    }
    return geom3$t.create(polygons);
  };
  var extrudeFromSlices_1 = extrudeFromSlices$3;
  const { TAU: TAU$5 } = constants$1;
  const mat4$9 = mat4$r;
  const { mirrorX } = mirror_1;
  const geom2$t = geom2$K;
  const slice$2 = slice$5;
  const extrudeFromSlices$2 = extrudeFromSlices_1;
  const extrudeRotate$1 = (options, geometry) => {
    const defaults = {
      segments: 12,
      startAngle: 0,
      angle: TAU$5,
      overflow: "cap"
    };
    let { segments, startAngle, angle: angle2, overflow } = Object.assign({}, defaults, options);
    if (segments < 3)
      throw new Error("segments must be greater then 3");
    startAngle = Math.abs(startAngle) > TAU$5 ? startAngle % TAU$5 : startAngle;
    angle2 = Math.abs(angle2) > TAU$5 ? angle2 % TAU$5 : angle2;
    let endAngle = startAngle + angle2;
    endAngle = Math.abs(endAngle) > TAU$5 ? endAngle % TAU$5 : endAngle;
    if (endAngle < startAngle) {
      const x = startAngle;
      startAngle = endAngle;
      endAngle = x;
    }
    let totalRotation = endAngle - startAngle;
    if (totalRotation <= 0)
      totalRotation = TAU$5;
    if (Math.abs(totalRotation) < TAU$5) {
      const anglePerSegment = TAU$5 / segments;
      segments = Math.floor(Math.abs(totalRotation) / anglePerSegment);
      if (Math.abs(totalRotation) > segments * anglePerSegment)
        segments++;
    }
    let shapeSides = geom2$t.toSides(geometry);
    if (shapeSides.length === 0)
      throw new Error("the given geometry cannot be empty");
    const pointsWithNegativeX = shapeSides.filter((s) => s[0][0] < 0);
    const pointsWithPositiveX = shapeSides.filter((s) => s[0][0] >= 0);
    const arePointsWithNegAndPosX = pointsWithNegativeX.length > 0 && pointsWithPositiveX.length > 0;
    if (arePointsWithNegAndPosX && overflow === "cap") {
      if (pointsWithNegativeX.length > pointsWithPositiveX.length) {
        shapeSides = shapeSides.map((side) => {
          let point0 = side[0];
          let point1 = side[1];
          point0 = [Math.min(point0[0], 0), point0[1]];
          point1 = [Math.min(point1[0], 0), point1[1]];
          return [point0, point1];
        });
        geometry = geom2$t.reverse(geom2$t.create(shapeSides));
        geometry = mirrorX(geometry);
      } else if (pointsWithPositiveX.length >= pointsWithNegativeX.length) {
        shapeSides = shapeSides.map((side) => {
          let point0 = side[0];
          let point1 = side[1];
          point0 = [Math.max(point0[0], 0), point0[1]];
          point1 = [Math.max(point1[0], 0), point1[1]];
          return [point0, point1];
        });
        geometry = geom2$t.create(shapeSides);
      }
    }
    const rotationPerSlice = totalRotation / segments;
    const isCapped = Math.abs(totalRotation) < TAU$5;
    const baseSlice = slice$2.fromSides(geom2$t.toSides(geometry));
    slice$2.reverse(baseSlice, baseSlice);
    const matrix = mat4$9.create();
    const createSlice = (progress, index, base) => {
      let Zrotation = rotationPerSlice * index + startAngle;
      if (totalRotation === TAU$5 && index === segments) {
        Zrotation = startAngle;
      }
      mat4$9.multiply(matrix, mat4$9.fromZRotation(matrix, Zrotation), mat4$9.fromXRotation(mat4$9.create(), TAU$5 / 4));
      return slice$2.transform(matrix, base);
    };
    options = {
      numberOfSlices: segments + 1,
      capStart: isCapped,
      capEnd: isCapped,
      close: !isCapped,
      callback: createSlice
    };
    return extrudeFromSlices$2(options, baseSlice);
  };
  var extrudeRotate_1 = extrudeRotate$1;
  const flatten$r = flatten_1;
  const mat4$8 = mat4$r;
  const geom2$s = geom2$K;
  const geom3$s = geom3$K;
  const path2$j = path2$u;
  const rotate$1 = (angles, ...objects) => {
    if (!Array.isArray(angles))
      throw new Error("angles must be an array");
    objects = flatten$r(objects);
    if (objects.length === 0)
      throw new Error("wrong number of arguments");
    angles = angles.slice();
    while (angles.length < 3)
      angles.push(0);
    const yaw = angles[2];
    const pitch = angles[1];
    const roll = angles[0];
    const matrix = mat4$8.fromTaitBryanRotation(mat4$8.create(), yaw, pitch, roll);
    const results = objects.map((object) => {
      if (path2$j.isA(object))
        return path2$j.transform(matrix, object);
      if (geom2$s.isA(object))
        return geom2$s.transform(matrix, object);
      if (geom3$s.isA(object))
        return geom3$s.transform(matrix, object);
      return object;
    });
    return results.length === 1 ? results[0] : results;
  };
  const rotateX = (angle2, ...objects) => rotate$1([angle2, 0, 0], objects);
  const rotateY = (angle2, ...objects) => rotate$1([0, angle2, 0], objects);
  const rotateZ = (angle2, ...objects) => rotate$1([0, 0, angle2], objects);
  var rotate_1 = {
    rotate: rotate$1,
    rotateX,
    rotateY,
    rotateZ
  };
  const flatten$q = flatten_1;
  const mat4$7 = mat4$r;
  const geom2$r = geom2$K;
  const geom3$r = geom3$K;
  const path2$i = path2$u;
  const translate$3 = (offset2, ...objects) => {
    if (!Array.isArray(offset2))
      throw new Error("offset must be an array");
    objects = flatten$q(objects);
    if (objects.length === 0)
      throw new Error("wrong number of arguments");
    offset2 = offset2.slice();
    while (offset2.length < 3)
      offset2.push(0);
    const matrix = mat4$7.fromTranslation(mat4$7.create(), offset2);
    const results = objects.map((object) => {
      if (path2$i.isA(object))
        return path2$i.transform(matrix, object);
      if (geom2$r.isA(object))
        return geom2$r.transform(matrix, object);
      if (geom3$r.isA(object))
        return geom3$r.transform(matrix, object);
      return object;
    });
    return results.length === 1 ? results[0] : results;
  };
  const translateX = (offset2, ...objects) => translate$3([offset2, 0, 0], objects);
  const translateY = (offset2, ...objects) => translate$3([0, offset2, 0], objects);
  const translateZ = (offset2, ...objects) => translate$3([0, 0, offset2], objects);
  var translate_1 = {
    translate: translate$3,
    translateX,
    translateY,
    translateZ
  };
  const { TAU: TAU$4 } = constants$1;
  const extrudeRotate = extrudeRotate_1;
  const { rotate } = rotate_1;
  const { translate: translate$2 } = translate_1;
  const circle = circle_1;
  const { isGT, isGTE } = commonChecks;
  const torus = (options) => {
    const defaults = {
      innerRadius: 1,
      innerSegments: 32,
      outerRadius: 4,
      outerSegments: 32,
      innerRotation: 0,
      startAngle: 0,
      outerRotation: TAU$4
    };
    const { innerRadius, innerSegments, outerRadius, outerSegments, innerRotation, startAngle, outerRotation } = Object.assign({}, defaults, options);
    if (!isGT(innerRadius, 0))
      throw new Error("innerRadius must be greater than zero");
    if (!isGTE(innerSegments, 3))
      throw new Error("innerSegments must be three or more");
    if (!isGT(outerRadius, 0))
      throw new Error("outerRadius must be greater than zero");
    if (!isGTE(outerSegments, 3))
      throw new Error("outerSegments must be three or more");
    if (!isGTE(startAngle, 0))
      throw new Error("startAngle must be positive");
    if (!isGT(outerRotation, 0))
      throw new Error("outerRotation must be greater than zero");
    if (innerRadius >= outerRadius)
      throw new Error("inner circle is two large to rotate about the outer circle");
    let innerCircle = circle({ radius: innerRadius, segments: innerSegments });
    if (innerRotation !== 0) {
      innerCircle = rotate([0, 0, innerRotation], innerCircle);
    }
    innerCircle = translate$2([outerRadius, 0], innerCircle);
    const extrudeOptions = {
      startAngle,
      angle: outerRotation,
      segments: outerSegments
    };
    return extrudeRotate(extrudeOptions, innerCircle);
  };
  var torus_1 = torus;
  const { NEPS } = constants$1;
  const vec2$7 = vec2$E;
  const geom2$q = geom2$K;
  const { isNumberArray } = commonChecks;
  const solveAngleFromSSS = (a, b, c) => Math.acos((a * a + b * b - c * c) / (2 * a * b));
  const solveSideFromSAS = (a, C, b) => {
    if (C > NEPS) {
      return Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(C));
    }
    return Math.sqrt((a - b) * (a - b) + a * b * C * C * (1 - C * C / 12));
  };
  const solveAAA = (angles) => {
    const eps = Math.abs(angles[0] + angles[1] + angles[2] - Math.PI);
    if (eps > NEPS)
      throw new Error("AAA triangles require angles that sum to PI");
    const A = angles[0];
    const B = angles[1];
    const C = Math.PI - A - B;
    const c = 1;
    const a = c / Math.sin(C) * Math.sin(A);
    const b = c / Math.sin(C) * Math.sin(B);
    return createTriangle(A, B, C, a, b, c);
  };
  const solveAAS = (values) => {
    const A = values[0];
    const B = values[1];
    const C = Math.PI + NEPS - A - B;
    if (C < NEPS)
      throw new Error("AAS triangles require angles that sum to PI");
    const a = values[2];
    const b = a / Math.sin(A) * Math.sin(B);
    const c = a / Math.sin(A) * Math.sin(C);
    return createTriangle(A, B, C, a, b, c);
  };
  const solveASA = (values) => {
    const A = values[0];
    const B = values[2];
    const C = Math.PI + NEPS - A - B;
    if (C < NEPS)
      throw new Error("ASA triangles require angles that sum to PI");
    const c = values[1];
    const a = c / Math.sin(C) * Math.sin(A);
    const b = c / Math.sin(C) * Math.sin(B);
    return createTriangle(A, B, C, a, b, c);
  };
  const solveSAS = (values) => {
    const c = values[0];
    const B = values[1];
    const a = values[2];
    const b = solveSideFromSAS(c, B, a);
    const A = solveAngleFromSSS(b, c, a);
    const C = Math.PI - A - B;
    return createTriangle(A, B, C, a, b, c);
  };
  const solveSSA = (values) => {
    const c = values[0];
    const a = values[1];
    const C = values[2];
    const A = Math.asin(a * Math.sin(C) / c);
    const B = Math.PI - A - C;
    const b = c / Math.sin(C) * Math.sin(B);
    return createTriangle(A, B, C, a, b, c);
  };
  const solveSSS = (lengths) => {
    const a = lengths[1];
    const b = lengths[2];
    const c = lengths[0];
    if (a + b <= c || b + c <= a || c + a <= b) {
      throw new Error("SSS triangle is incorrect, as the longest side is longer than the sum of the other sides");
    }
    const A = solveAngleFromSSS(b, c, a);
    const B = solveAngleFromSSS(c, a, b);
    const C = Math.PI - A - B;
    return createTriangle(A, B, C, a, b, c);
  };
  const createTriangle = (A, B, C, a, b, c) => {
    const p0 = vec2$7.fromValues(0, 0);
    const p1 = vec2$7.fromValues(c, 0);
    const p2 = vec2$7.fromValues(a, 0);
    vec2$7.add(p2, vec2$7.rotate(p2, p2, [0, 0], Math.PI - B), p1);
    return geom2$q.fromPoints([p0, p1, p2]);
  };
  const triangle = (options) => {
    const defaults = {
      type: "SSS",
      values: [1, 1, 1]
    };
    let { type, values } = Object.assign({}, defaults, options);
    if (typeof type !== "string")
      throw new Error("triangle type must be a string");
    type = type.toUpperCase();
    if (!((type[0] === "A" || type[0] === "S") && (type[1] === "A" || type[1] === "S") && (type[2] === "A" || type[2] === "S")))
      throw new Error("triangle type must contain three letters; A or S");
    if (!isNumberArray(values, 3))
      throw new Error("triangle values must contain three values");
    if (!values.every((n) => n > 0))
      throw new Error("triangle values must be greater than zero");
    switch (type) {
      case "AAA":
        return solveAAA(values);
      case "AAS":
        return solveAAS(values);
      case "ASA":
        return solveASA(values);
      case "SAS":
        return solveSAS(values);
      case "SSA":
        return solveSSA(values);
      case "SSS":
        return solveSSS(values);
      default:
        throw new Error("invalid triangle type, try again");
    }
  };
  var triangle_1 = triangle;
  var primitives = {
    arc: arc_1,
    circle: circle_1,
    cube: cube_1,
    cuboid: cuboid_1,
    cylinder: cylinder_1,
    cylinderElliptic: cylinderElliptic_1,
    ellipse: ellipse_1,
    ellipsoid: ellipsoid_1,
    geodesicSphere: geodesicSphere_1,
    line: line_1,
    polygon: polygon_1,
    polyhedron: polyhedron_1,
    rectangle: rectangle_1,
    roundedCuboid: roundedCuboid_1,
    roundedCylinder: roundedCylinder_1,
    roundedRectangle: roundedRectangle_1,
    sphere: sphere_1,
    square: square_1,
    star: star_1,
    torus: torus_1,
    triangle: triangle_1
  };
  var simplex = {
    height: 14,
    32: [16],
    33: [10, 5, 21, 5, 7, void 0, 5, 2, 4, 1, 5, 0, 6, 1, 5, 2],
    34: [16, 4, 21, 4, 14, void 0, 12, 21, 12, 14],
    35: [21, 11, 25, 4, -7, void 0, 17, 25, 10, -7, void 0, 4, 12, 18, 12, void 0, 3, 6, 17, 6],
    36: [20, 8, 25, 8, -4, void 0, 12, 25, 12, -4, void 0, 17, 18, 15, 20, 12, 21, 8, 21, 5, 20, 3, 18, 3, 16, 4, 14, 5, 13, 7, 12, 13, 10, 15, 9, 16, 8, 17, 6, 17, 3, 15, 1, 12, 0, 8, 0, 5, 1, 3, 3],
    37: [24, 21, 21, 3, 0, void 0, 8, 21, 10, 19, 10, 17, 9, 15, 7, 14, 5, 14, 3, 16, 3, 18, 4, 20, 6, 21, 8, 21, 10, 20, 13, 19, 16, 19, 19, 20, 21, 21, void 0, 17, 7, 15, 6, 14, 4, 14, 2, 16, 0, 18, 0, 20, 1, 21, 3, 21, 5, 19, 7, 17, 7],
    38: [26, 23, 12, 23, 13, 22, 14, 21, 14, 20, 13, 19, 11, 17, 6, 15, 3, 13, 1, 11, 0, 7, 0, 5, 1, 4, 2, 3, 4, 3, 6, 4, 8, 5, 9, 12, 13, 13, 14, 14, 16, 14, 18, 13, 20, 11, 21, 9, 20, 8, 18, 8, 16, 9, 13, 11, 10, 16, 3, 18, 1, 20, 0, 22, 0, 23, 1, 23, 2],
    39: [10, 5, 19, 4, 20, 5, 21, 6, 20, 6, 18, 5, 16, 4, 15],
    40: [14, 11, 25, 9, 23, 7, 20, 5, 16, 4, 11, 4, 7, 5, 2, 7, -2, 9, -5, 11, -7],
    41: [14, 3, 25, 5, 23, 7, 20, 9, 16, 10, 11, 10, 7, 9, 2, 7, -2, 5, -5, 3, -7],
    42: [16, 8, 21, 8, 9, void 0, 3, 18, 13, 12, void 0, 13, 18, 3, 12],
    43: [26, 13, 18, 13, 0, void 0, 4, 9, 22, 9],
    44: [10, 6, 1, 5, 0, 4, 1, 5, 2, 6, 1, 6, -1, 5, -3, 4, -4],
    45: [26, 4, 9, 22, 9],
    46: [10, 5, 2, 4, 1, 5, 0, 6, 1, 5, 2],
    47: [22, 20, 25, 2, -7],
    48: [20, 9, 21, 6, 20, 4, 17, 3, 12, 3, 9, 4, 4, 6, 1, 9, 0, 11, 0, 14, 1, 16, 4, 17, 9, 17, 12, 16, 17, 14, 20, 11, 21, 9, 21],
    49: [20, 6, 17, 8, 18, 11, 21, 11, 0],
    50: [20, 4, 16, 4, 17, 5, 19, 6, 20, 8, 21, 12, 21, 14, 20, 15, 19, 16, 17, 16, 15, 15, 13, 13, 10, 3, 0, 17, 0],
    51: [20, 5, 21, 16, 21, 10, 13, 13, 13, 15, 12, 16, 11, 17, 8, 17, 6, 16, 3, 14, 1, 11, 0, 8, 0, 5, 1, 4, 2, 3, 4],
    52: [20, 13, 21, 3, 7, 18, 7, void 0, 13, 21, 13, 0],
    53: [20, 15, 21, 5, 21, 4, 12, 5, 13, 8, 14, 11, 14, 14, 13, 16, 11, 17, 8, 17, 6, 16, 3, 14, 1, 11, 0, 8, 0, 5, 1, 4, 2, 3, 4],
    54: [20, 16, 18, 15, 20, 12, 21, 10, 21, 7, 20, 5, 17, 4, 12, 4, 7, 5, 3, 7, 1, 10, 0, 11, 0, 14, 1, 16, 3, 17, 6, 17, 7, 16, 10, 14, 12, 11, 13, 10, 13, 7, 12, 5, 10, 4, 7],
    55: [20, 17, 21, 7, 0, void 0, 3, 21, 17, 21],
    56: [20, 8, 21, 5, 20, 4, 18, 4, 16, 5, 14, 7, 13, 11, 12, 14, 11, 16, 9, 17, 7, 17, 4, 16, 2, 15, 1, 12, 0, 8, 0, 5, 1, 4, 2, 3, 4, 3, 7, 4, 9, 6, 11, 9, 12, 13, 13, 15, 14, 16, 16, 16, 18, 15, 20, 12, 21, 8, 21],
    57: [20, 16, 14, 15, 11, 13, 9, 10, 8, 9, 8, 6, 9, 4, 11, 3, 14, 3, 15, 4, 18, 6, 20, 9, 21, 10, 21, 13, 20, 15, 18, 16, 14, 16, 9, 15, 4, 13, 1, 10, 0, 8, 0, 5, 1, 4, 3],
    58: [10, 5, 14, 4, 13, 5, 12, 6, 13, 5, 14, void 0, 5, 2, 4, 1, 5, 0, 6, 1, 5, 2],
    59: [10, 5, 14, 4, 13, 5, 12, 6, 13, 5, 14, void 0, 6, 1, 5, 0, 4, 1, 5, 2, 6, 1, 6, -1, 5, -3, 4, -4],
    60: [24, 20, 18, 4, 9, 20, 0],
    61: [26, 4, 12, 22, 12, void 0, 4, 6, 22, 6],
    62: [24, 4, 18, 20, 9, 4, 0],
    63: [18, 3, 16, 3, 17, 4, 19, 5, 20, 7, 21, 11, 21, 13, 20, 14, 19, 15, 17, 15, 15, 14, 13, 13, 12, 9, 10, 9, 7, void 0, 9, 2, 8, 1, 9, 0, 10, 1, 9, 2],
    64: [27, 18, 13, 17, 15, 15, 16, 12, 16, 10, 15, 9, 14, 8, 11, 8, 8, 9, 6, 11, 5, 14, 5, 16, 6, 17, 8, void 0, 12, 16, 10, 14, 9, 11, 9, 8, 10, 6, 11, 5, void 0, 18, 16, 17, 8, 17, 6, 19, 5, 21, 5, 23, 7, 24, 10, 24, 12, 23, 15, 22, 17, 20, 19, 18, 20, 15, 21, 12, 21, 9, 20, 7, 19, 5, 17, 4, 15, 3, 12, 3, 9, 4, 6, 5, 4, 7, 2, 9, 1, 12, 0, 15, 0, 18, 1, 20, 2, 21, 3, void 0, 19, 16, 18, 8, 18, 6, 19, 5],
    65: [18, 9, 21, 1, 0, void 0, 9, 21, 17, 0, void 0, 4, 7, 14, 7],
    66: [21, 4, 21, 4, 0, void 0, 4, 21, 13, 21, 16, 20, 17, 19, 18, 17, 18, 15, 17, 13, 16, 12, 13, 11, void 0, 4, 11, 13, 11, 16, 10, 17, 9, 18, 7, 18, 4, 17, 2, 16, 1, 13, 0, 4, 0],
    67: [21, 18, 16, 17, 18, 15, 20, 13, 21, 9, 21, 7, 20, 5, 18, 4, 16, 3, 13, 3, 8, 4, 5, 5, 3, 7, 1, 9, 0, 13, 0, 15, 1, 17, 3, 18, 5],
    68: [21, 4, 21, 4, 0, void 0, 4, 21, 11, 21, 14, 20, 16, 18, 17, 16, 18, 13, 18, 8, 17, 5, 16, 3, 14, 1, 11, 0, 4, 0],
    69: [19, 4, 21, 4, 0, void 0, 4, 21, 17, 21, void 0, 4, 11, 12, 11, void 0, 4, 0, 17, 0],
    70: [18, 4, 21, 4, 0, void 0, 4, 21, 17, 21, void 0, 4, 11, 12, 11],
    71: [21, 18, 16, 17, 18, 15, 20, 13, 21, 9, 21, 7, 20, 5, 18, 4, 16, 3, 13, 3, 8, 4, 5, 5, 3, 7, 1, 9, 0, 13, 0, 15, 1, 17, 3, 18, 5, 18, 8, void 0, 13, 8, 18, 8],
    72: [22, 4, 21, 4, 0, void 0, 18, 21, 18, 0, void 0, 4, 11, 18, 11],
    73: [8, 4, 21, 4, 0],
    74: [16, 12, 21, 12, 5, 11, 2, 10, 1, 8, 0, 6, 0, 4, 1, 3, 2, 2, 5, 2, 7],
    75: [21, 4, 21, 4, 0, void 0, 18, 21, 4, 7, void 0, 9, 12, 18, 0],
    76: [17, 4, 21, 4, 0, void 0, 4, 0, 16, 0],
    77: [24, 4, 21, 4, 0, void 0, 4, 21, 12, 0, void 0, 20, 21, 12, 0, void 0, 20, 21, 20, 0],
    78: [22, 4, 21, 4, 0, void 0, 4, 21, 18, 0, void 0, 18, 21, 18, 0],
    79: [22, 9, 21, 7, 20, 5, 18, 4, 16, 3, 13, 3, 8, 4, 5, 5, 3, 7, 1, 9, 0, 13, 0, 15, 1, 17, 3, 18, 5, 19, 8, 19, 13, 18, 16, 17, 18, 15, 20, 13, 21, 9, 21],
    80: [21, 4, 21, 4, 0, void 0, 4, 21, 13, 21, 16, 20, 17, 19, 18, 17, 18, 14, 17, 12, 16, 11, 13, 10, 4, 10],
    81: [22, 9, 21, 7, 20, 5, 18, 4, 16, 3, 13, 3, 8, 4, 5, 5, 3, 7, 1, 9, 0, 13, 0, 15, 1, 17, 3, 18, 5, 19, 8, 19, 13, 18, 16, 17, 18, 15, 20, 13, 21, 9, 21, void 0, 12, 4, 18, -2],
    82: [21, 4, 21, 4, 0, void 0, 4, 21, 13, 21, 16, 20, 17, 19, 18, 17, 18, 15, 17, 13, 16, 12, 13, 11, 4, 11, void 0, 11, 11, 18, 0],
    83: [20, 17, 18, 15, 20, 12, 21, 8, 21, 5, 20, 3, 18, 3, 16, 4, 14, 5, 13, 7, 12, 13, 10, 15, 9, 16, 8, 17, 6, 17, 3, 15, 1, 12, 0, 8, 0, 5, 1, 3, 3],
    84: [16, 8, 21, 8, 0, void 0, 1, 21, 15, 21],
    85: [22, 4, 21, 4, 6, 5, 3, 7, 1, 10, 0, 12, 0, 15, 1, 17, 3, 18, 6, 18, 21],
    86: [18, 1, 21, 9, 0, void 0, 17, 21, 9, 0],
    87: [24, 2, 21, 7, 0, void 0, 12, 21, 7, 0, void 0, 12, 21, 17, 0, void 0, 22, 21, 17, 0],
    88: [20, 3, 21, 17, 0, void 0, 17, 21, 3, 0],
    89: [18, 1, 21, 9, 11, 9, 0, void 0, 17, 21, 9, 11],
    90: [20, 17, 21, 3, 0, void 0, 3, 21, 17, 21, void 0, 3, 0, 17, 0],
    91: [14, 4, 25, 4, -7, void 0, 5, 25, 5, -7, void 0, 4, 25, 11, 25, void 0, 4, -7, 11, -7],
    92: [14, 0, 21, 14, -3],
    93: [14, 9, 25, 9, -7, void 0, 10, 25, 10, -7, void 0, 3, 25, 10, 25, void 0, 3, -7, 10, -7],
    94: [16, 6, 15, 8, 18, 10, 15, void 0, 3, 12, 8, 17, 13, 12, void 0, 8, 17, 8, 0],
    95: [16, 0, -2, 16, -2],
    96: [10, 6, 21, 5, 20, 4, 18, 4, 16, 5, 15, 6, 16, 5, 17],
    97: [19, 15, 14, 15, 0, void 0, 15, 11, 13, 13, 11, 14, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3],
    98: [19, 4, 21, 4, 0, void 0, 4, 11, 6, 13, 8, 14, 11, 14, 13, 13, 15, 11, 16, 8, 16, 6, 15, 3, 13, 1, 11, 0, 8, 0, 6, 1, 4, 3],
    99: [18, 15, 11, 13, 13, 11, 14, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3],
    100: [19, 15, 21, 15, 0, void 0, 15, 11, 13, 13, 11, 14, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3],
    101: [18, 3, 8, 15, 8, 15, 10, 14, 12, 13, 13, 11, 14, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3],
    102: [12, 10, 21, 8, 21, 6, 20, 5, 17, 5, 0, void 0, 2, 14, 9, 14],
    103: [19, 15, 14, 15, -2, 14, -5, 13, -6, 11, -7, 8, -7, 6, -6, void 0, 15, 11, 13, 13, 11, 14, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3],
    104: [19, 4, 21, 4, 0, void 0, 4, 10, 7, 13, 9, 14, 12, 14, 14, 13, 15, 10, 15, 0],
    105: [8, 3, 21, 4, 20, 5, 21, 4, 22, 3, 21, void 0, 4, 14, 4, 0],
    106: [10, 5, 21, 6, 20, 7, 21, 6, 22, 5, 21, void 0, 6, 14, 6, -3, 5, -6, 3, -7, 1, -7],
    107: [17, 4, 21, 4, 0, void 0, 14, 14, 4, 4, void 0, 8, 8, 15, 0],
    108: [8, 4, 21, 4, 0],
    109: [30, 4, 14, 4, 0, void 0, 4, 10, 7, 13, 9, 14, 12, 14, 14, 13, 15, 10, 15, 0, void 0, 15, 10, 18, 13, 20, 14, 23, 14, 25, 13, 26, 10, 26, 0],
    110: [19, 4, 14, 4, 0, void 0, 4, 10, 7, 13, 9, 14, 12, 14, 14, 13, 15, 10, 15, 0],
    111: [19, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3, 16, 6, 16, 8, 15, 11, 13, 13, 11, 14, 8, 14],
    112: [19, 4, 14, 4, -7, void 0, 4, 11, 6, 13, 8, 14, 11, 14, 13, 13, 15, 11, 16, 8, 16, 6, 15, 3, 13, 1, 11, 0, 8, 0, 6, 1, 4, 3],
    113: [19, 15, 14, 15, -7, void 0, 15, 11, 13, 13, 11, 14, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3],
    114: [13, 4, 14, 4, 0, void 0, 4, 8, 5, 11, 7, 13, 9, 14, 12, 14],
    115: [17, 14, 11, 13, 13, 10, 14, 7, 14, 4, 13, 3, 11, 4, 9, 6, 8, 11, 7, 13, 6, 14, 4, 14, 3, 13, 1, 10, 0, 7, 0, 4, 1, 3, 3],
    116: [12, 5, 21, 5, 4, 6, 1, 8, 0, 10, 0, void 0, 2, 14, 9, 14],
    117: [19, 4, 14, 4, 4, 5, 1, 7, 0, 10, 0, 12, 1, 15, 4, void 0, 15, 14, 15, 0],
    118: [16, 2, 14, 8, 0, void 0, 14, 14, 8, 0],
    119: [22, 3, 14, 7, 0, void 0, 11, 14, 7, 0, void 0, 11, 14, 15, 0, void 0, 19, 14, 15, 0],
    120: [17, 3, 14, 14, 0, void 0, 14, 14, 3, 0],
    121: [16, 2, 14, 8, 0, void 0, 14, 14, 8, 0, 6, -4, 4, -6, 2, -7, 1, -7],
    122: [17, 14, 14, 3, 0, void 0, 3, 14, 14, 14, void 0, 3, 0, 14, 0],
    123: [14, 9, 25, 7, 24, 6, 23, 5, 21, 5, 19, 6, 17, 7, 16, 8, 14, 8, 12, 6, 10, void 0, 7, 24, 6, 22, 6, 20, 7, 18, 8, 17, 9, 15, 9, 13, 8, 11, 4, 9, 8, 7, 9, 5, 9, 3, 8, 1, 7, 0, 6, -2, 6, -4, 7, -6, void 0, 6, 8, 8, 6, 8, 4, 7, 2, 6, 1, 5, -1, 5, -3, 6, -5, 7, -6, 9, -7],
    124: [8, 4, 25, 4, -7],
    125: [14, 5, 25, 7, 24, 8, 23, 9, 21, 9, 19, 8, 17, 7, 16, 6, 14, 6, 12, 8, 10, void 0, 7, 24, 8, 22, 8, 20, 7, 18, 6, 17, 5, 15, 5, 13, 6, 11, 10, 9, 6, 7, 5, 5, 5, 3, 6, 1, 7, 0, 8, -2, 8, -4, 7, -6, void 0, 8, 8, 6, 6, 6, 4, 7, 2, 8, 1, 9, -1, 9, -3, 8, -5, 7, -6, 5, -7],
    126: [24, 3, 6, 3, 8, 4, 11, 6, 12, 8, 12, 10, 11, 14, 8, 16, 7, 18, 7, 20, 8, 21, 10, void 0, 3, 8, 4, 10, 6, 11, 8, 11, 10, 10, 14, 7, 16, 6, 18, 6, 20, 7, 21, 10, 21, 12]
  };
  const defaultFont = simplex;
  const defaultsVectorParams = {
    xOffset: 0,
    yOffset: 0,
    input: "?",
    align: "left",
    font: defaultFont,
    height: 14,
    // == old vector_xxx simplex font height
    lineSpacing: 2.142857142857143,
    // == 30/14 == old vector_xxx ratio
    letterSpacing: 1,
    extrudeOffset: 0
  };
  const vectorParams$2 = (options, input) => {
    if (!input && typeof options === "string") {
      options = { input: options };
    }
    options = options || {};
    const params = Object.assign({}, defaultsVectorParams, options);
    params.input = input || params.input;
    return params;
  };
  var vectorParams_1 = vectorParams$2;
  const vectorParams$1 = vectorParams_1;
  const vectorChar$1 = (options, char) => {
    const {
      xOffset,
      yOffset,
      input,
      font,
      height,
      extrudeOffset
    } = vectorParams$1(options, char);
    let code = input.charCodeAt(0);
    if (!code || !font[code]) {
      code = 63;
    }
    const glyph = [].concat(font[code]);
    const ratio = (height - extrudeOffset) / font.height;
    const extrudeYOffset = extrudeOffset / 2;
    const width = glyph.shift() * ratio;
    const segments = [];
    let polyline = [];
    for (let i = 0, il = glyph.length; i < il; i += 2) {
      const gx = ratio * glyph[i] + xOffset;
      const gy = ratio * glyph[i + 1] + yOffset + extrudeYOffset;
      if (glyph[i] !== void 0) {
        polyline.push([gx, gy]);
        continue;
      }
      segments.push(polyline);
      polyline = [];
      i--;
    }
    if (polyline.length) {
      segments.push(polyline);
    }
    return { width, height, segments };
  };
  var vectorChar_1 = vectorChar$1;
  const vectorChar = vectorChar_1;
  const vectorParams = vectorParams_1;
  const translateLine = (options, line4) => {
    const { x, y } = Object.assign({ x: 0, y: 0 }, options || {});
    const segments = line4.segments;
    let segment = null;
    let point = null;
    for (let i = 0, il = segments.length; i < il; i++) {
      segment = segments[i];
      for (let j = 0, jl = segment.length; j < jl; j++) {
        point = segment[j];
        segment[j] = [point[0] + x, point[1] + y];
      }
    }
    return line4;
  };
  const vectorText = (options, text2) => {
    const {
      xOffset,
      yOffset,
      input,
      font,
      height,
      align: align2,
      extrudeOffset,
      lineSpacing,
      letterSpacing
    } = vectorParams(options, text2);
    let [x, y] = [xOffset, yOffset];
    let i, il, char, vect, width, diff;
    let line4 = { width: 0, segments: [] };
    const lines = [];
    let output = [];
    let maxWidth = 0;
    const lineStart = x;
    const pushLine = () => {
      lines.push(line4);
      maxWidth = Math.max(maxWidth, line4.width);
      line4 = { width: 0, segments: [] };
    };
    for (i = 0, il = input.length; i < il; i++) {
      char = input[i];
      vect = vectorChar({ xOffset: x, yOffset: y, font, height, extrudeOffset }, char);
      if (char === "\n") {
        x = lineStart;
        y -= vect.height * lineSpacing;
        pushLine();
        continue;
      }
      width = vect.width * letterSpacing;
      line4.width += width;
      x += width;
      if (char !== " ") {
        line4.segments = line4.segments.concat(vect.segments);
      }
    }
    if (line4.segments.length) {
      pushLine();
    }
    for (i = 0, il = lines.length; i < il; i++) {
      line4 = lines[i];
      if (maxWidth > line4.width) {
        diff = maxWidth - line4.width;
        if (align2 === "right") {
          line4 = translateLine({ x: diff }, line4);
        } else if (align2 === "center") {
          line4 = translateLine({ x: diff / 2 }, line4);
        }
      }
      output = output.concat(line4.segments);
    }
    return output;
  };
  var vectorText_1 = vectorText;
  var text = {
    vectorChar: vectorChar_1,
    vectorText: vectorText_1
  };
  const geom2$p = geom2$K;
  const geom3$q = geom3$K;
  const path2$h = path2$u;
  const areAllShapesTheSameType$4 = (shapes) => {
    let previousType;
    for (const shape of shapes) {
      let currentType = 0;
      if (geom2$p.isA(shape))
        currentType = 1;
      if (geom3$q.isA(shape))
        currentType = 2;
      if (path2$h.isA(shape))
        currentType = 3;
      if (previousType && currentType !== previousType)
        return false;
      previousType = currentType;
    }
    return true;
  };
  var areAllShapesTheSameType_1 = areAllShapesTheSameType$4;
  const degToRad = (degrees) => degrees * 0.017453292519943295;
  var degToRad_1 = degToRad;
  const fnNumberSort$2 = (a, b) => a - b;
  var fnNumberSort_1 = fnNumberSort$2;
  const insertSorted$1 = (array, element, comparefunc) => {
    let leftbound = 0;
    let rightbound = array.length;
    while (rightbound > leftbound) {
      const testindex = Math.floor((leftbound + rightbound) / 2);
      const testelement = array[testindex];
      const compareresult = comparefunc(element, testelement);
      if (compareresult > 0) {
        leftbound = testindex + 1;
      } else {
        rightbound = testindex;
      }
    }
    array.splice(leftbound, 0, element);
  };
  var insertSorted_1 = insertSorted$1;
  const { TAU: TAU$3 } = constants$1;
  const radiusToSegments = (radius, minimumLength, minimumAngle) => {
    const ss = minimumLength > 0 ? radius * TAU$3 / minimumLength : 0;
    const as = minimumAngle > 0 ? TAU$3 / minimumAngle : 0;
    return Math.ceil(Math.max(ss, as, 4));
  };
  var radiusToSegments_1 = radiusToSegments;
  const radToDeg = (radians) => radians * 57.29577951308232;
  var radToDeg_1 = radToDeg;
  var utils = {
    areAllShapesTheSameType: areAllShapesTheSameType_1,
    degToRad: degToRad_1,
    flatten: flatten_1,
    fnNumberSort: fnNumberSort_1,
    insertSorted: insertSorted_1,
    radiusToSegments: radiusToSegments_1,
    radToDeg: radToDeg_1
  };
  const vec2$6 = vec2$E;
  const geom2$o = geom2$K;
  const fromFakePolygon = (epsilon, polygon2) => {
    if (polygon2.vertices.length < 4) {
      return null;
    }
    const vert1Indices = [];
    const points3D = polygon2.vertices.filter((vertex, i) => {
      if (vertex[2] > 0) {
        vert1Indices.push(i);
        return true;
      }
      return false;
    });
    if (points3D.length !== 2) {
      throw new Error("Assertion failed: fromFakePolygon: not enough points found");
    }
    const points2D = points3D.map((v3) => {
      const x = Math.round(v3[0] / epsilon) * epsilon + 0;
      const y = Math.round(v3[1] / epsilon) * epsilon + 0;
      return vec2$6.fromValues(x, y);
    });
    if (vec2$6.equals(points2D[0], points2D[1]))
      return null;
    const d = vert1Indices[1] - vert1Indices[0];
    if (d === 1 || d === 3) {
      if (d === 1) {
        points2D.reverse();
      }
    } else {
      throw new Error("Assertion failed: fromFakePolygon: unknown index ordering");
    }
    return points2D;
  };
  const fromFakePolygons$3 = (epsilon, polygons) => {
    const sides = polygons.map((polygon2) => fromFakePolygon(epsilon, polygon2)).filter((polygon2) => polygon2 !== null);
    return geom2$o.create(sides);
  };
  var fromFakePolygons_1 = fromFakePolygons$3;
  const vec3$c = vec3$Y;
  const geom2$n = geom2$K;
  const geom3$p = geom3$K;
  const poly3$d = poly3$A;
  const to3DWall = (z0, z1, side) => {
    const points = [
      vec3$c.fromVec2(vec3$c.create(), side[0], z0),
      vec3$c.fromVec2(vec3$c.create(), side[1], z0),
      vec3$c.fromVec2(vec3$c.create(), side[1], z1),
      vec3$c.fromVec2(vec3$c.create(), side[0], z1)
    ];
    return poly3$d.create(points);
  };
  const to3DWalls$3 = (options, geometry) => {
    const sides = geom2$n.toSides(geometry);
    const polygons = sides.map((side) => to3DWall(options.z0, options.z1, side));
    const result = geom3$p.create(polygons);
    return result;
  };
  var to3DWalls_1 = to3DWalls$3;
  const mat4$6 = mat4$r;
  const vec2$5 = vec2$E;
  const vec3$b = vec3$Y;
  const OrthoNormalBasis$1 = function(plane2, rightvector) {
    if (arguments.length < 2) {
      rightvector = vec3$b.orthogonal(vec3$b.create(), plane2);
    }
    this.v = vec3$b.normalize(vec3$b.create(), vec3$b.cross(vec3$b.create(), plane2, rightvector));
    this.u = vec3$b.cross(vec3$b.create(), this.v, plane2);
    this.plane = plane2;
    this.planeorigin = vec3$b.scale(vec3$b.create(), plane2, plane2[3]);
  };
  OrthoNormalBasis$1.GetCartesian = function(xaxisid, yaxisid) {
    const axisid = xaxisid + "/" + yaxisid;
    let planenormal, rightvector;
    if (axisid === "X/Y") {
      planenormal = [0, 0, 1];
      rightvector = [1, 0, 0];
    } else if (axisid === "Y/-X") {
      planenormal = [0, 0, 1];
      rightvector = [0, 1, 0];
    } else if (axisid === "-X/-Y") {
      planenormal = [0, 0, 1];
      rightvector = [-1, 0, 0];
    } else if (axisid === "-Y/X") {
      planenormal = [0, 0, 1];
      rightvector = [0, -1, 0];
    } else if (axisid === "-X/Y") {
      planenormal = [0, 0, -1];
      rightvector = [-1, 0, 0];
    } else if (axisid === "-Y/-X") {
      planenormal = [0, 0, -1];
      rightvector = [0, -1, 0];
    } else if (axisid === "X/-Y") {
      planenormal = [0, 0, -1];
      rightvector = [1, 0, 0];
    } else if (axisid === "Y/X") {
      planenormal = [0, 0, -1];
      rightvector = [0, 1, 0];
    } else if (axisid === "X/Z") {
      planenormal = [0, -1, 0];
      rightvector = [1, 0, 0];
    } else if (axisid === "Z/-X") {
      planenormal = [0, -1, 0];
      rightvector = [0, 0, 1];
    } else if (axisid === "-X/-Z") {
      planenormal = [0, -1, 0];
      rightvector = [-1, 0, 0];
    } else if (axisid === "-Z/X") {
      planenormal = [0, -1, 0];
      rightvector = [0, 0, -1];
    } else if (axisid === "-X/Z") {
      planenormal = [0, 1, 0];
      rightvector = [-1, 0, 0];
    } else if (axisid === "-Z/-X") {
      planenormal = [0, 1, 0];
      rightvector = [0, 0, -1];
    } else if (axisid === "X/-Z") {
      planenormal = [0, 1, 0];
      rightvector = [1, 0, 0];
    } else if (axisid === "Z/X") {
      planenormal = [0, 1, 0];
      rightvector = [0, 0, 1];
    } else if (axisid === "Y/Z") {
      planenormal = [1, 0, 0];
      rightvector = [0, 1, 0];
    } else if (axisid === "Z/-Y") {
      planenormal = [1, 0, 0];
      rightvector = [0, 0, 1];
    } else if (axisid === "-Y/-Z") {
      planenormal = [1, 0, 0];
      rightvector = [0, -1, 0];
    } else if (axisid === "-Z/Y") {
      planenormal = [1, 0, 0];
      rightvector = [0, 0, -1];
    } else if (axisid === "-Y/Z") {
      planenormal = [-1, 0, 0];
      rightvector = [0, -1, 0];
    } else if (axisid === "-Z/-Y") {
      planenormal = [-1, 0, 0];
      rightvector = [0, 0, -1];
    } else if (axisid === "Y/-Z") {
      planenormal = [-1, 0, 0];
      rightvector = [0, 1, 0];
    } else if (axisid === "Z/Y") {
      planenormal = [-1, 0, 0];
      rightvector = [0, 0, 1];
    } else {
      throw new Error("OrthoNormalBasis.GetCartesian: invalid combination of axis identifiers. Should pass two string arguments from [X,Y,Z,-X,-Y,-Z], being two different axes.");
    }
    return new OrthoNormalBasis$1(new Plane(new Vector3D(planenormal), 0), new Vector3D(rightvector));
  };
  OrthoNormalBasis$1.Z0Plane = function() {
    const plane2 = new Plane(new Vector3D([0, 0, 1]), 0);
    return new OrthoNormalBasis$1(plane2, new Vector3D([1, 0, 0]));
  };
  OrthoNormalBasis$1.prototype = {
    getProjectionMatrix: function() {
      return mat4$6.fromValues(
        this.u[0],
        this.v[0],
        this.plane[0],
        0,
        this.u[1],
        this.v[1],
        this.plane[1],
        0,
        this.u[2],
        this.v[2],
        this.plane[2],
        0,
        0,
        0,
        -this.plane[3],
        1
      );
    },
    getInverseProjectionMatrix: function() {
      const p = vec3$b.scale(vec3$b.create(), this.plane, this.plane[3]);
      return mat4$6.fromValues(
        this.u[0],
        this.u[1],
        this.u[2],
        0,
        this.v[0],
        this.v[1],
        this.v[2],
        0,
        this.plane[0],
        this.plane[1],
        this.plane[2],
        0,
        p[0],
        p[1],
        p[2],
        1
      );
    },
    to2D: function(point) {
      return vec2$5.fromValues(vec3$b.dot(point, this.u), vec3$b.dot(point, this.v));
    },
    to3D: function(point) {
      const v12 = vec3$b.scale(vec3$b.create(), this.u, point[0]);
      const v22 = vec3$b.scale(vec3$b.create(), this.v, point[1]);
      const v3 = vec3$b.add(v12, v12, this.planeorigin);
      const v4 = vec3$b.add(v22, v22, v3);
      return v4;
    },
    line3Dto2D: function(line3d) {
      const a = line3d.point;
      const b = line3d.direction.plus(a);
      const a2d = this.to2D(a);
      const b2d = this.to2D(b);
      return Line2D.fromPoints(a2d, b2d);
    },
    line2Dto3D: function(line2d) {
      const a = line2d.origin();
      const b = line2d.direction().plus(a);
      const a3d = this.to3D(a);
      const b3d = this.to3D(b);
      return Line3D.fromPoints(a3d, b3d);
    },
    transform: function(matrix4x4) {
      const newplane = this.plane.transform(matrix4x4);
      const rightpointTransformed = this.u.transform(matrix4x4);
      const originTransformed = new Vector3D(0, 0, 0).transform(matrix4x4);
      const newrighthandvector = rightpointTransformed.minus(originTransformed);
      const newbasis = new OrthoNormalBasis$1(newplane, newrighthandvector);
      return newbasis;
    }
  };
  var OrthoNormalBasis_1 = OrthoNormalBasis$1;
  const { EPS: EPS$5 } = constants$1;
  const line2$1 = line2$2;
  const vec2$4 = vec2$E;
  const OrthoNormalBasis = OrthoNormalBasis_1;
  const interpolateBetween2DPointsForY = interpolateBetween2DPointsForY_1;
  const { insertSorted, fnNumberSort: fnNumberSort$1 } = utils;
  const poly3$c = poly3$A;
  const reTesselateCoplanarPolygons$1 = (sourcepolygons) => {
    if (sourcepolygons.length < 2)
      return sourcepolygons;
    const destpolygons = [];
    const numpolygons = sourcepolygons.length;
    const plane2 = poly3$c.plane(sourcepolygons[0]);
    const orthobasis = new OrthoNormalBasis(plane2);
    const polygonvertices2d = [];
    const polygontopvertexindexes = [];
    const topy2polygonindexes = /* @__PURE__ */ new Map();
    const ycoordinatetopolygonindexes = /* @__PURE__ */ new Map();
    const ycoordinatebins = /* @__PURE__ */ new Map();
    const ycoordinateBinningFactor = 10 / EPS$5;
    for (let polygonindex = 0; polygonindex < numpolygons; polygonindex++) {
      const poly3d = sourcepolygons[polygonindex];
      let vertices2d = [];
      let numvertices = poly3d.vertices.length;
      let minindex = -1;
      if (numvertices > 0) {
        let miny;
        let maxy;
        for (let i = 0; i < numvertices; i++) {
          let pos2d = orthobasis.to2D(poly3d.vertices[i]);
          const ycoordinatebin = Math.floor(pos2d[1] * ycoordinateBinningFactor);
          let newy;
          if (ycoordinatebins.has(ycoordinatebin)) {
            newy = ycoordinatebins.get(ycoordinatebin);
          } else if (ycoordinatebins.has(ycoordinatebin + 1)) {
            newy = ycoordinatebins.get(ycoordinatebin + 1);
          } else if (ycoordinatebins.has(ycoordinatebin - 1)) {
            newy = ycoordinatebins.get(ycoordinatebin - 1);
          } else {
            newy = pos2d[1];
            ycoordinatebins.set(ycoordinatebin, pos2d[1]);
          }
          pos2d = vec2$4.fromValues(pos2d[0], newy);
          vertices2d.push(pos2d);
          const y = pos2d[1];
          if (i === 0 || y < miny) {
            miny = y;
            minindex = i;
          }
          if (i === 0 || y > maxy) {
            maxy = y;
          }
          let polygonindexes = ycoordinatetopolygonindexes.get(y);
          if (!polygonindexes) {
            polygonindexes = {};
            ycoordinatetopolygonindexes.set(y, polygonindexes);
          }
          polygonindexes[polygonindex] = true;
        }
        if (miny >= maxy) {
          vertices2d = [];
          numvertices = 0;
          minindex = -1;
        } else {
          let polygonindexes = topy2polygonindexes.get(miny);
          if (!polygonindexes) {
            polygonindexes = [];
            topy2polygonindexes.set(miny, polygonindexes);
          }
          polygonindexes.push(polygonindex);
        }
      }
      vertices2d.reverse();
      minindex = numvertices - minindex - 1;
      polygonvertices2d.push(vertices2d);
      polygontopvertexindexes.push(minindex);
    }
    const ycoordinates = [];
    ycoordinatetopolygonindexes.forEach((polylist, y) => ycoordinates.push(y));
    ycoordinates.sort(fnNumberSort$1);
    let activepolygons = [];
    let prevoutpolygonrow = [];
    for (let yindex = 0; yindex < ycoordinates.length; yindex++) {
      const newoutpolygonrow = [];
      const ycoordinate = ycoordinates[yindex];
      const polygonindexeswithcorner = ycoordinatetopolygonindexes.get(ycoordinate);
      for (let activepolygonindex = 0; activepolygonindex < activepolygons.length; ++activepolygonindex) {
        const activepolygon = activepolygons[activepolygonindex];
        const polygonindex = activepolygon.polygonindex;
        if (polygonindexeswithcorner[polygonindex]) {
          const vertices2d = polygonvertices2d[polygonindex];
          const numvertices = vertices2d.length;
          let newleftvertexindex = activepolygon.leftvertexindex;
          let newrightvertexindex = activepolygon.rightvertexindex;
          while (true) {
            let nextleftvertexindex = newleftvertexindex + 1;
            if (nextleftvertexindex >= numvertices)
              nextleftvertexindex = 0;
            if (vertices2d[nextleftvertexindex][1] !== ycoordinate)
              break;
            newleftvertexindex = nextleftvertexindex;
          }
          let nextrightvertexindex = newrightvertexindex - 1;
          if (nextrightvertexindex < 0)
            nextrightvertexindex = numvertices - 1;
          if (vertices2d[nextrightvertexindex][1] === ycoordinate) {
            newrightvertexindex = nextrightvertexindex;
          }
          if (newleftvertexindex !== activepolygon.leftvertexindex && newleftvertexindex === newrightvertexindex) {
            activepolygons.splice(activepolygonindex, 1);
            --activepolygonindex;
          } else {
            activepolygon.leftvertexindex = newleftvertexindex;
            activepolygon.rightvertexindex = newrightvertexindex;
            activepolygon.topleft = vertices2d[newleftvertexindex];
            activepolygon.topright = vertices2d[newrightvertexindex];
            let nextleftvertexindex = newleftvertexindex + 1;
            if (nextleftvertexindex >= numvertices)
              nextleftvertexindex = 0;
            activepolygon.bottomleft = vertices2d[nextleftvertexindex];
            let nextrightvertexindex2 = newrightvertexindex - 1;
            if (nextrightvertexindex2 < 0)
              nextrightvertexindex2 = numvertices - 1;
            activepolygon.bottomright = vertices2d[nextrightvertexindex2];
          }
        }
      }
      let nextycoordinate;
      if (yindex >= ycoordinates.length - 1) {
        activepolygons = [];
        nextycoordinate = null;
      } else {
        nextycoordinate = Number(ycoordinates[yindex + 1]);
        const middleycoordinate = 0.5 * (ycoordinate + nextycoordinate);
        const startingpolygonindexes = topy2polygonindexes.get(ycoordinate);
        for (const polygonindexKey in startingpolygonindexes) {
          const polygonindex = startingpolygonindexes[polygonindexKey];
          const vertices2d = polygonvertices2d[polygonindex];
          const numvertices = vertices2d.length;
          const topvertexindex = polygontopvertexindexes[polygonindex];
          let topleftvertexindex = topvertexindex;
          while (true) {
            let i = topleftvertexindex + 1;
            if (i >= numvertices)
              i = 0;
            if (vertices2d[i][1] !== ycoordinate)
              break;
            if (i === topvertexindex)
              break;
            topleftvertexindex = i;
          }
          let toprightvertexindex = topvertexindex;
          while (true) {
            let i = toprightvertexindex - 1;
            if (i < 0)
              i = numvertices - 1;
            if (vertices2d[i][1] !== ycoordinate)
              break;
            if (i === topleftvertexindex)
              break;
            toprightvertexindex = i;
          }
          let nextleftvertexindex = topleftvertexindex + 1;
          if (nextleftvertexindex >= numvertices)
            nextleftvertexindex = 0;
          let nextrightvertexindex = toprightvertexindex - 1;
          if (nextrightvertexindex < 0)
            nextrightvertexindex = numvertices - 1;
          const newactivepolygon = {
            polygonindex,
            leftvertexindex: topleftvertexindex,
            rightvertexindex: toprightvertexindex,
            topleft: vertices2d[topleftvertexindex],
            topright: vertices2d[toprightvertexindex],
            bottomleft: vertices2d[nextleftvertexindex],
            bottomright: vertices2d[nextrightvertexindex]
          };
          insertSorted(activepolygons, newactivepolygon, (el1, el2) => {
            const x1 = interpolateBetween2DPointsForY(el1.topleft, el1.bottomleft, middleycoordinate);
            const x2 = interpolateBetween2DPointsForY(el2.topleft, el2.bottomleft, middleycoordinate);
            if (x1 > x2)
              return 1;
            if (x1 < x2)
              return -1;
            return 0;
          });
        }
      }
      for (const activepolygonKey in activepolygons) {
        const activepolygon = activepolygons[activepolygonKey];
        let x = interpolateBetween2DPointsForY(activepolygon.topleft, activepolygon.bottomleft, ycoordinate);
        const topleft = vec2$4.fromValues(x, ycoordinate);
        x = interpolateBetween2DPointsForY(activepolygon.topright, activepolygon.bottomright, ycoordinate);
        const topright = vec2$4.fromValues(x, ycoordinate);
        x = interpolateBetween2DPointsForY(activepolygon.topleft, activepolygon.bottomleft, nextycoordinate);
        const bottomleft = vec2$4.fromValues(x, nextycoordinate);
        x = interpolateBetween2DPointsForY(activepolygon.topright, activepolygon.bottomright, nextycoordinate);
        const bottomright = vec2$4.fromValues(x, nextycoordinate);
        const outpolygon = {
          topleft,
          topright,
          bottomleft,
          bottomright,
          leftline: line2$1.fromPoints(line2$1.create(), topleft, bottomleft),
          rightline: line2$1.fromPoints(line2$1.create(), bottomright, topright)
        };
        if (newoutpolygonrow.length > 0) {
          const prevoutpolygon = newoutpolygonrow[newoutpolygonrow.length - 1];
          const d1 = vec2$4.distance(outpolygon.topleft, prevoutpolygon.topright);
          const d2 = vec2$4.distance(outpolygon.bottomleft, prevoutpolygon.bottomright);
          if (d1 < EPS$5 && d2 < EPS$5) {
            outpolygon.topleft = prevoutpolygon.topleft;
            outpolygon.leftline = prevoutpolygon.leftline;
            outpolygon.bottomleft = prevoutpolygon.bottomleft;
            newoutpolygonrow.splice(newoutpolygonrow.length - 1, 1);
          }
        }
        newoutpolygonrow.push(outpolygon);
      }
      if (yindex > 0) {
        const prevcontinuedindexes = /* @__PURE__ */ new Set();
        const matchedindexes = /* @__PURE__ */ new Set();
        for (let i = 0; i < newoutpolygonrow.length; i++) {
          const thispolygon = newoutpolygonrow[i];
          for (let ii = 0; ii < prevoutpolygonrow.length; ii++) {
            if (!matchedindexes.has(ii)) {
              const prevpolygon = prevoutpolygonrow[ii];
              if (vec2$4.distance(prevpolygon.bottomleft, thispolygon.topleft) < EPS$5) {
                if (vec2$4.distance(prevpolygon.bottomright, thispolygon.topright) < EPS$5) {
                  matchedindexes.add(ii);
                  const v12 = line2$1.direction(thispolygon.leftline);
                  const v22 = line2$1.direction(prevpolygon.leftline);
                  const d1 = v12[0] - v22[0];
                  const v3 = line2$1.direction(thispolygon.rightline);
                  const v4 = line2$1.direction(prevpolygon.rightline);
                  const d2 = v3[0] - v4[0];
                  const leftlinecontinues = Math.abs(d1) < EPS$5;
                  const rightlinecontinues = Math.abs(d2) < EPS$5;
                  const leftlineisconvex = leftlinecontinues || d1 >= 0;
                  const rightlineisconvex = rightlinecontinues || d2 >= 0;
                  if (leftlineisconvex && rightlineisconvex) {
                    thispolygon.outpolygon = prevpolygon.outpolygon;
                    thispolygon.leftlinecontinues = leftlinecontinues;
                    thispolygon.rightlinecontinues = rightlinecontinues;
                    prevcontinuedindexes.add(ii);
                  }
                  break;
                }
              }
            }
          }
        }
        for (let ii = 0; ii < prevoutpolygonrow.length; ii++) {
          if (!prevcontinuedindexes.has(ii)) {
            const prevpolygon = prevoutpolygonrow[ii];
            prevpolygon.outpolygon.rightpoints.push(prevpolygon.bottomright);
            if (vec2$4.distance(prevpolygon.bottomright, prevpolygon.bottomleft) > EPS$5) {
              prevpolygon.outpolygon.leftpoints.push(prevpolygon.bottomleft);
            }
            prevpolygon.outpolygon.leftpoints.reverse();
            const points2d = prevpolygon.outpolygon.rightpoints.concat(prevpolygon.outpolygon.leftpoints);
            const vertices3d = points2d.map((point2d) => orthobasis.to3D(point2d));
            const polygon2 = poly3$c.fromPointsAndPlane(vertices3d, plane2);
            if (polygon2.vertices.length)
              destpolygons.push(polygon2);
          }
        }
      }
      for (let i = 0; i < newoutpolygonrow.length; i++) {
        const thispolygon = newoutpolygonrow[i];
        if (!thispolygon.outpolygon) {
          thispolygon.outpolygon = {
            leftpoints: [],
            rightpoints: []
          };
          thispolygon.outpolygon.leftpoints.push(thispolygon.topleft);
          if (vec2$4.distance(thispolygon.topleft, thispolygon.topright) > EPS$5) {
            thispolygon.outpolygon.rightpoints.push(thispolygon.topright);
          }
        } else {
          if (!thispolygon.leftlinecontinues) {
            thispolygon.outpolygon.leftpoints.push(thispolygon.topleft);
          }
          if (!thispolygon.rightlinecontinues) {
            thispolygon.outpolygon.rightpoints.push(thispolygon.topright);
          }
        }
      }
      prevoutpolygonrow = newoutpolygonrow;
    }
    return destpolygons;
  };
  var reTesselateCoplanarPolygons_1 = reTesselateCoplanarPolygons$1;
  const geom3$o = geom3$K;
  const poly3$b = poly3$A;
  const aboutEqualNormals$2 = aboutEqualNormals_1;
  const reTesselateCoplanarPolygons = reTesselateCoplanarPolygons_1;
  const coplanar$1 = (plane1, plane2) => {
    if (Math.abs(plane1[3] - plane2[3]) < 15e-8) {
      return aboutEqualNormals$2(plane1, plane2);
    }
    return false;
  };
  const retessellate$4 = (geometry) => {
    if (geometry.isRetesselated) {
      return geometry;
    }
    const polygons = geom3$o.toPolygons(geometry);
    const polygonsPerPlane = [];
    polygons.forEach((polygon2) => {
      const mapping = polygonsPerPlane.find((element) => coplanar$1(element[0], poly3$b.plane(polygon2)));
      if (mapping) {
        const polygons2 = mapping[1];
        polygons2.push(polygon2);
      } else {
        polygonsPerPlane.push([poly3$b.plane(polygon2), [polygon2]]);
      }
    });
    let destpolygons = [];
    polygonsPerPlane.forEach((mapping) => {
      const sourcepolygons = mapping[1];
      const retesselayedpolygons = reTesselateCoplanarPolygons(sourcepolygons);
      destpolygons = destpolygons.concat(retesselayedpolygons);
    });
    const result = geom3$o.create(destpolygons);
    result.isRetesselated = true;
    return result;
  };
  var retessellate_1 = retessellate$4;
  const { EPS: EPS$4 } = constants$1;
  const measureBoundingBox$1 = measureBoundingBox_1;
  const mayOverlap$3 = (geometry1, geometry2) => {
    if (geometry1.polygons.length === 0 || geometry2.polygons.length === 0) {
      return false;
    }
    const bounds1 = measureBoundingBox$1(geometry1);
    const min1 = bounds1[0];
    const max1 = bounds1[1];
    const bounds2 = measureBoundingBox$1(geometry2);
    const min2 = bounds2[0];
    const max2 = bounds2[1];
    if (min2[0] - max1[0] > EPS$4)
      return false;
    if (min1[0] - max2[0] > EPS$4)
      return false;
    if (min2[1] - max1[1] > EPS$4)
      return false;
    if (min1[1] - max2[1] > EPS$4)
      return false;
    if (min2[2] - max1[2] > EPS$4)
      return false;
    if (min1[2] - max2[2] > EPS$4)
      return false;
    return true;
  };
  var mayOverlap_1 = mayOverlap$3;
  const plane$2 = plane$b;
  const poly3$a = poly3$A;
  let Node$1 = class Node2 {
    constructor(parent) {
      this.plane = null;
      this.front = null;
      this.back = null;
      this.polygontreenodes = [];
      this.parent = parent;
    }
    // Convert solid space to empty space and empty space to solid space.
    invert() {
      const queue = [this];
      let node;
      for (let i = 0; i < queue.length; i++) {
        node = queue[i];
        if (node.plane)
          node.plane = plane$2.flip(plane$2.create(), node.plane);
        if (node.front)
          queue.push(node.front);
        if (node.back)
          queue.push(node.back);
        const temp = node.front;
        node.front = node.back;
        node.back = temp;
      }
    }
    // clip polygontreenodes to our plane
    // calls remove() for all clipped PolygonTreeNodes
    clipPolygons(polygontreenodes, alsoRemovecoplanarFront) {
      let current = { node: this, polygontreenodes };
      let node;
      const stack = [];
      do {
        node = current.node;
        polygontreenodes = current.polygontreenodes;
        if (node.plane) {
          const plane2 = node.plane;
          const backnodes = [];
          const frontnodes = [];
          const coplanarfrontnodes = alsoRemovecoplanarFront ? backnodes : frontnodes;
          const numpolygontreenodes = polygontreenodes.length;
          for (let i = 0; i < numpolygontreenodes; i++) {
            const treenode = polygontreenodes[i];
            if (!treenode.isRemoved()) {
              treenode.splitByPlane(plane2, coplanarfrontnodes, backnodes, frontnodes, backnodes);
            }
          }
          if (node.front && frontnodes.length > 0) {
            stack.push({ node: node.front, polygontreenodes: frontnodes });
          }
          const numbacknodes = backnodes.length;
          if (node.back && numbacknodes > 0) {
            stack.push({ node: node.back, polygontreenodes: backnodes });
          } else {
            for (let i = 0; i < numbacknodes; i++) {
              backnodes[i].remove();
            }
          }
        }
        current = stack.pop();
      } while (current !== void 0);
    }
    // Remove all polygons in this BSP tree that are inside the other BSP tree
    // `tree`.
    clipTo(tree, alsoRemovecoplanarFront) {
      let node = this;
      const stack = [];
      do {
        if (node.polygontreenodes.length > 0) {
          tree.rootnode.clipPolygons(node.polygontreenodes, alsoRemovecoplanarFront);
        }
        if (node.front)
          stack.push(node.front);
        if (node.back)
          stack.push(node.back);
        node = stack.pop();
      } while (node !== void 0);
    }
    addPolygonTreeNodes(newpolygontreenodes) {
      let current = { node: this, polygontreenodes: newpolygontreenodes };
      const stack = [];
      do {
        const node = current.node;
        const polygontreenodes = current.polygontreenodes;
        if (polygontreenodes.length === 0) {
          current = stack.pop();
          continue;
        }
        if (!node.plane) {
          let index = 0;
          index = Math.floor(polygontreenodes.length / 2);
          const bestpoly = polygontreenodes[index].getPolygon();
          node.plane = poly3$a.plane(bestpoly);
        }
        const frontnodes = [];
        const backnodes = [];
        const n = polygontreenodes.length;
        for (let i = 0; i < n; ++i) {
          polygontreenodes[i].splitByPlane(node.plane, node.polygontreenodes, backnodes, frontnodes, backnodes);
        }
        if (frontnodes.length > 0) {
          if (!node.front)
            node.front = new Node2(node);
          const stopCondition = n === frontnodes.length && backnodes.length === 0;
          if (stopCondition)
            node.front.polygontreenodes = frontnodes;
          else
            stack.push({ node: node.front, polygontreenodes: frontnodes });
        }
        if (backnodes.length > 0) {
          if (!node.back)
            node.back = new Node2(node);
          const stopCondition = n === backnodes.length && frontnodes.length === 0;
          if (stopCondition)
            node.back.polygontreenodes = backnodes;
          else
            stack.push({ node: node.back, polygontreenodes: backnodes });
        }
        current = stack.pop();
      } while (current !== void 0);
    }
  };
  var Node_1 = Node$1;
  const vec3$a = vec3$Y;
  const splitLineSegmentByPlane$1 = (plane2, p1, p2) => {
    const direction2 = vec3$a.subtract(vec3$a.create(), p2, p1);
    let lambda = (plane2[3] - vec3$a.dot(plane2, p1)) / vec3$a.dot(plane2, direction2);
    if (Number.isNaN(lambda))
      lambda = 0;
    if (lambda > 1)
      lambda = 1;
    if (lambda < 0)
      lambda = 0;
    vec3$a.scale(direction2, direction2, lambda);
    vec3$a.add(direction2, p1, direction2);
    return direction2;
  };
  var splitLineSegmentByPlane_1 = splitLineSegmentByPlane$1;
  const { EPS: EPS$3 } = constants$1;
  const plane$1 = plane$b;
  const vec3$9 = vec3$Y;
  const poly3$9 = poly3$A;
  const splitLineSegmentByPlane = splitLineSegmentByPlane_1;
  const splitPolygonByPlane$1 = (splane, polygon2) => {
    const result = {
      type: null,
      front: null,
      back: null
    };
    const vertices = polygon2.vertices;
    const numvertices = vertices.length;
    const pplane = poly3$9.plane(polygon2);
    if (plane$1.equals(pplane, splane)) {
      result.type = 0;
    } else {
      let hasfront = false;
      let hasback = false;
      const vertexIsBack = [];
      const MINEPS = -EPS$3;
      for (let i = 0; i < numvertices; i++) {
        const t = vec3$9.dot(splane, vertices[i]) - splane[3];
        const isback = t < MINEPS;
        vertexIsBack.push(isback);
        if (t > EPS$3)
          hasfront = true;
        if (t < MINEPS)
          hasback = true;
      }
      if (!hasfront && !hasback) {
        const t = vec3$9.dot(splane, pplane);
        result.type = t >= 0 ? 0 : 1;
      } else if (!hasback) {
        result.type = 2;
      } else if (!hasfront) {
        result.type = 3;
      } else {
        result.type = 4;
        const frontvertices = [];
        const backvertices = [];
        let isback = vertexIsBack[0];
        for (let vertexindex = 0; vertexindex < numvertices; vertexindex++) {
          const vertex = vertices[vertexindex];
          let nextvertexindex = vertexindex + 1;
          if (nextvertexindex >= numvertices)
            nextvertexindex = 0;
          const nextisback = vertexIsBack[nextvertexindex];
          if (isback === nextisback) {
            if (isback) {
              backvertices.push(vertex);
            } else {
              frontvertices.push(vertex);
            }
          } else {
            const nextpoint = vertices[nextvertexindex];
            const intersectionpoint = splitLineSegmentByPlane(splane, vertex, nextpoint);
            if (isback) {
              backvertices.push(vertex);
              backvertices.push(intersectionpoint);
              frontvertices.push(intersectionpoint);
            } else {
              frontvertices.push(vertex);
              frontvertices.push(intersectionpoint);
              backvertices.push(intersectionpoint);
            }
          }
          isback = nextisback;
        }
        const EPS_SQUARED = EPS$3 * EPS$3;
        if (backvertices.length >= 3) {
          let prevvertex = backvertices[backvertices.length - 1];
          for (let vertexindex = 0; vertexindex < backvertices.length; vertexindex++) {
            const vertex = backvertices[vertexindex];
            if (vec3$9.squaredDistance(vertex, prevvertex) < EPS_SQUARED) {
              backvertices.splice(vertexindex, 1);
              vertexindex--;
            }
            prevvertex = vertex;
          }
        }
        if (frontvertices.length >= 3) {
          let prevvertex = frontvertices[frontvertices.length - 1];
          for (let vertexindex = 0; vertexindex < frontvertices.length; vertexindex++) {
            const vertex = frontvertices[vertexindex];
            if (vec3$9.squaredDistance(vertex, prevvertex) < EPS_SQUARED) {
              frontvertices.splice(vertexindex, 1);
              vertexindex--;
            }
            prevvertex = vertex;
          }
        }
        if (frontvertices.length >= 3) {
          result.front = poly3$9.fromPointsAndPlane(frontvertices, pplane);
        }
        if (backvertices.length >= 3) {
          result.back = poly3$9.fromPointsAndPlane(backvertices, pplane);
        }
      }
    }
    return result;
  };
  var splitPolygonByPlane_1 = splitPolygonByPlane$1;
  const { EPS: EPS$2 } = constants$1;
  const vec3$8 = vec3$Y;
  const poly3$8 = poly3$A;
  const splitPolygonByPlane = splitPolygonByPlane_1;
  let PolygonTreeNode$1 = class PolygonTreeNode2 {
    // constructor creates the root node
    constructor(parent, polygon2) {
      this.parent = parent;
      this.children = [];
      this.polygon = polygon2;
      this.removed = false;
    }
    // fill the tree with polygons. Should be called on the root node only; child nodes must
    // always be a derivate (split) of the parent node.
    addPolygons(polygons) {
      if (!this.isRootNode()) {
        throw new Error("Assertion failed");
      }
      const _this = this;
      polygons.forEach((polygon2) => {
        _this.addChild(polygon2);
      });
    }
    // remove a node
    // - the siblings become toplevel nodes
    // - the parent is removed recursively
    remove() {
      if (!this.removed) {
        this.removed = true;
        this.polygon = null;
        const parentschildren = this.parent.children;
        const i = parentschildren.indexOf(this);
        if (i < 0)
          throw new Error("Assertion failed");
        parentschildren.splice(i, 1);
        this.parent.recursivelyInvalidatePolygon();
      }
    }
    isRemoved() {
      return this.removed;
    }
    isRootNode() {
      return !this.parent;
    }
    // invert all polygons in the tree. Call on the root node
    invert() {
      if (!this.isRootNode())
        throw new Error("Assertion failed");
      this.invertSub();
    }
    getPolygon() {
      if (!this.polygon)
        throw new Error("Assertion failed");
      return this.polygon;
    }
    getPolygons(result) {
      let children = [this];
      const queue = [children];
      let i, j, l, node;
      for (i = 0; i < queue.length; ++i) {
        children = queue[i];
        for (j = 0, l = children.length; j < l; j++) {
          node = children[j];
          if (node.polygon) {
            result.push(node.polygon);
          } else {
            if (node.children.length > 0)
              queue.push(node.children);
          }
        }
      }
    }
    // split the node by a plane; add the resulting nodes to the frontnodes and backnodes array
    // If the plane doesn't intersect the polygon, the 'this' object is added to one of the arrays
    // If the plane does intersect the polygon, two new child nodes are created for the front and back fragments,
    //  and added to both arrays.
    splitByPlane(plane2, coplanarfrontnodes, coplanarbacknodes, frontnodes, backnodes) {
      if (this.children.length) {
        const queue = [this.children];
        let i;
        let j;
        let l;
        let node;
        let nodes;
        for (i = 0; i < queue.length; i++) {
          nodes = queue[i];
          for (j = 0, l = nodes.length; j < l; j++) {
            node = nodes[j];
            if (node.children.length > 0) {
              queue.push(node.children);
            } else {
              node._splitByPlane(plane2, coplanarfrontnodes, coplanarbacknodes, frontnodes, backnodes);
            }
          }
        }
      } else {
        this._splitByPlane(plane2, coplanarfrontnodes, coplanarbacknodes, frontnodes, backnodes);
      }
    }
    // only to be called for nodes with no children
    _splitByPlane(splane, coplanarfrontnodes, coplanarbacknodes, frontnodes, backnodes) {
      const polygon2 = this.polygon;
      if (polygon2) {
        const bound = poly3$8.measureBoundingSphere(polygon2);
        const sphereradius = bound[3] + EPS$2;
        const spherecenter = bound;
        const d = vec3$8.dot(splane, spherecenter) - splane[3];
        if (d > sphereradius) {
          frontnodes.push(this);
        } else if (d < -sphereradius) {
          backnodes.push(this);
        } else {
          const splitresult = splitPolygonByPlane(splane, polygon2);
          switch (splitresult.type) {
            case 0:
              coplanarfrontnodes.push(this);
              break;
            case 1:
              coplanarbacknodes.push(this);
              break;
            case 2:
              frontnodes.push(this);
              break;
            case 3:
              backnodes.push(this);
              break;
            case 4:
              if (splitresult.front) {
                const frontnode = this.addChild(splitresult.front);
                frontnodes.push(frontnode);
              }
              if (splitresult.back) {
                const backnode = this.addChild(splitresult.back);
                backnodes.push(backnode);
              }
              break;
          }
        }
      }
    }
    // PRIVATE methods from here:
    // add child to a node
    // this should be called whenever the polygon is split
    // a child should be created for every fragment of the split polygon
    // returns the newly created child
    addChild(polygon2) {
      const newchild = new PolygonTreeNode2(this, polygon2);
      this.children.push(newchild);
      return newchild;
    }
    invertSub() {
      let children = [this];
      const queue = [children];
      let i, j, l, node;
      for (i = 0; i < queue.length; i++) {
        children = queue[i];
        for (j = 0, l = children.length; j < l; j++) {
          node = children[j];
          if (node.polygon) {
            node.polygon = poly3$8.invert(node.polygon);
          }
          if (node.children.length > 0)
            queue.push(node.children);
        }
      }
    }
    // private method
    // remove the polygon from the node, and all parent nodes above it
    // called to invalidate parents of removed nodes
    recursivelyInvalidatePolygon() {
      this.polygon = null;
      if (this.parent) {
        this.parent.recursivelyInvalidatePolygon();
      }
    }
    clear() {
      let children = [this];
      const queue = [children];
      for (let i = 0; i < queue.length; ++i) {
        children = queue[i];
        const l = children.length;
        for (let j = 0; j < l; j++) {
          const node = children[j];
          if (node.polygon) {
            node.polygon = null;
          }
          if (node.parent) {
            node.parent = null;
          }
          if (node.children.length > 0)
            queue.push(node.children);
          node.children = [];
        }
      }
    }
    toString() {
      let result = "";
      let children = [this];
      const queue = [children];
      let i, j, l, node;
      for (i = 0; i < queue.length; ++i) {
        children = queue[i];
        const prefix = " ".repeat(i);
        for (j = 0, l = children.length; j < l; j++) {
          node = children[j];
          result += `${prefix}PolygonTreeNode (${node.isRootNode()}): ${node.children.length}`;
          if (node.polygon) {
            result += `
 ${prefix}polygon: ${node.polygon.vertices}
`;
          } else {
            result += "\n";
          }
          if (node.children.length > 0)
            queue.push(node.children);
        }
      }
      return result;
    }
  };
  var PolygonTreeNode_1 = PolygonTreeNode$1;
  const Node = Node_1;
  const PolygonTreeNode = PolygonTreeNode_1;
  let Tree$3 = class Tree {
    constructor(polygons) {
      this.polygonTree = new PolygonTreeNode();
      this.rootnode = new Node(null);
      if (polygons)
        this.addPolygons(polygons);
    }
    invert() {
      this.polygonTree.invert();
      this.rootnode.invert();
    }
    // Remove all polygons in this BSP tree that are inside the other BSP tree
    // `tree`.
    clipTo(tree, alsoRemovecoplanarFront = false) {
      this.rootnode.clipTo(tree, alsoRemovecoplanarFront);
    }
    allPolygons() {
      const result = [];
      this.polygonTree.getPolygons(result);
      return result;
    }
    addPolygons(polygons) {
      const polygontreenodes = new Array(polygons.length);
      for (let i = 0; i < polygons.length; i++) {
        polygontreenodes[i] = this.polygonTree.addChild(polygons[i]);
      }
      this.rootnode.addPolygonTreeNodes(polygontreenodes);
    }
    clear() {
      this.polygonTree.clear();
    }
    toString() {
      const result = "Tree: " + this.polygonTree.toString("");
      return result;
    }
  };
  var Tree_1 = Tree$3;
  var trees = {
    Tree: Tree_1
  };
  const geom3$n = geom3$K;
  const mayOverlap$2 = mayOverlap_1;
  const { Tree: Tree$2 } = trees;
  const intersectGeom3Sub = (geometry1, geometry2) => {
    if (!mayOverlap$2(geometry1, geometry2)) {
      return geom3$n.create();
    }
    const a = new Tree$2(geom3$n.toPolygons(geometry1));
    const b = new Tree$2(geom3$n.toPolygons(geometry2));
    a.invert();
    b.clipTo(a);
    b.invert();
    a.clipTo(b);
    b.clipTo(a);
    a.addPolygons(b.allPolygons());
    a.invert();
    const newpolygons = a.allPolygons();
    return geom3$n.create(newpolygons);
  };
  var intersectGeom3Sub_1 = intersectGeom3Sub;
  const flatten$p = flatten_1;
  const retessellate$3 = retessellate_1;
  const intersectSub = intersectGeom3Sub_1;
  const intersect$3 = (...geometries2) => {
    geometries2 = flatten$p(geometries2);
    let newgeometry = geometries2.shift();
    geometries2.forEach((geometry) => {
      newgeometry = intersectSub(newgeometry, geometry);
    });
    newgeometry = retessellate$3(newgeometry);
    return newgeometry;
  };
  var intersectGeom3$2 = intersect$3;
  const flatten$o = flatten_1;
  const geom3$m = geom3$K;
  const measureEpsilon$6 = measureEpsilon_1;
  const fromFakePolygons$2 = fromFakePolygons_1;
  const to3DWalls$2 = to3DWalls_1;
  const intersectGeom3$1 = intersectGeom3$2;
  const intersect$2 = (...geometries2) => {
    geometries2 = flatten$o(geometries2);
    const newgeometries = geometries2.map((geometry) => to3DWalls$2({ z0: -1, z1: 1 }, geometry));
    const newgeom3 = intersectGeom3$1(newgeometries);
    const epsilon = measureEpsilon$6(newgeom3);
    return fromFakePolygons$2(epsilon, geom3$m.toPolygons(newgeom3));
  };
  var intersectGeom2$1 = intersect$2;
  const flatten$n = flatten_1;
  const areAllShapesTheSameType$3 = areAllShapesTheSameType_1;
  const geom2$m = geom2$K;
  const geom3$l = geom3$K;
  const intersectGeom2 = intersectGeom2$1;
  const intersectGeom3 = intersectGeom3$2;
  const intersect$1 = (...geometries2) => {
    geometries2 = flatten$n(geometries2);
    if (geometries2.length === 0)
      throw new Error("wrong number of arguments");
    if (!areAllShapesTheSameType$3(geometries2)) {
      throw new Error("only intersect of the types are supported");
    }
    const geometry = geometries2[0];
    if (geom2$m.isA(geometry))
      return intersectGeom2(geometries2);
    if (geom3$l.isA(geometry))
      return intersectGeom3(geometries2);
    return geometry;
  };
  var intersect_1 = intersect$1;
  const vec3$7 = vec3$Y;
  const measureEpsilon$5 = measureEpsilon_1;
  const geom3$k = geom3$K;
  const sortNb = (array) => array.sort((a, b) => a - b).filter((item, pos, ary) => !pos || item !== ary[pos - 1]);
  const insertMapping = (map, point, index) => {
    const key = `${point}`;
    const mapping = map.get(key);
    if (mapping === void 0) {
      map.set(key, [index]);
    } else {
      mapping.push(index);
    }
  };
  const findMapping = (map, point) => {
    const key = `${point}`;
    return map.get(key);
  };
  const scissionGeom3$1 = (geometry) => {
    const eps = measureEpsilon$5(geometry);
    const polygons = geom3$k.toPolygons(geometry);
    const pl = polygons.length;
    const indexesPerPoint = /* @__PURE__ */ new Map();
    const temp = vec3$7.create();
    polygons.forEach((polygon2, index) => {
      polygon2.vertices.forEach((point) => {
        insertMapping(indexesPerPoint, vec3$7.snap(temp, point, eps), index);
      });
    });
    const indexesPerPolygon = polygons.map((polygon2) => {
      let indexes = [];
      polygon2.vertices.forEach((point) => {
        indexes = indexes.concat(findMapping(indexesPerPoint, vec3$7.snap(temp, point, eps)));
      });
      return { e: 1, d: sortNb(indexes) };
    });
    indexesPerPoint.clear();
    let merges = 0;
    const ippl = indexesPerPolygon.length;
    for (let i = 0; i < ippl; i++) {
      const mapi = indexesPerPolygon[i];
      if (mapi.e > 0) {
        const indexes = new Array(pl);
        indexes[i] = true;
        do {
          merges = 0;
          indexes.forEach((e, j) => {
            const mapj = indexesPerPolygon[j];
            if (mapj.e > 0) {
              mapj.e = -1;
              for (let d = 0; d < mapj.d.length; d++) {
                indexes[mapj.d[d]] = true;
              }
              merges++;
            }
          });
        } while (merges > 0);
        mapi.indexes = indexes;
      }
    }
    const newgeometries = [];
    for (let i = 0; i < ippl; i++) {
      if (indexesPerPolygon[i].indexes) {
        const newpolygons = [];
        indexesPerPolygon[i].indexes.forEach((e, p) => newpolygons.push(polygons[p]));
        newgeometries.push(geom3$k.create(newpolygons));
      }
    }
    return newgeometries;
  };
  var scissionGeom3_1 = scissionGeom3$1;
  const flatten$m = flatten_1;
  const geom3$j = geom3$K;
  const scissionGeom3 = scissionGeom3_1;
  const scission = (...objects) => {
    objects = flatten$m(objects);
    if (objects.length === 0)
      throw new Error("wrong number of arguments");
    const results = objects.map((object) => {
      if (geom3$j.isA(object))
        return scissionGeom3(object);
      return object;
    });
    return results.length === 1 ? results[0] : results;
  };
  var scission_1 = scission;
  const geom3$i = geom3$K;
  const mayOverlap$1 = mayOverlap_1;
  const { Tree: Tree$1 } = trees;
  const subtractGeom3Sub = (geometry1, geometry2) => {
    if (!mayOverlap$1(geometry1, geometry2)) {
      return geom3$i.clone(geometry1);
    }
    const a = new Tree$1(geom3$i.toPolygons(geometry1));
    const b = new Tree$1(geom3$i.toPolygons(geometry2));
    a.invert();
    a.clipTo(b);
    b.clipTo(a, true);
    a.addPolygons(b.allPolygons());
    a.invert();
    const newpolygons = a.allPolygons();
    return geom3$i.create(newpolygons);
  };
  var subtractGeom3Sub_1 = subtractGeom3Sub;
  const flatten$l = flatten_1;
  const retessellate$2 = retessellate_1;
  const subtractSub = subtractGeom3Sub_1;
  const subtract$5 = (...geometries2) => {
    geometries2 = flatten$l(geometries2);
    let newgeometry = geometries2.shift();
    geometries2.forEach((geometry) => {
      newgeometry = subtractSub(newgeometry, geometry);
    });
    newgeometry = retessellate$2(newgeometry);
    return newgeometry;
  };
  var subtractGeom3$2 = subtract$5;
  const flatten$k = flatten_1;
  const geom3$h = geom3$K;
  const measureEpsilon$4 = measureEpsilon_1;
  const fromFakePolygons$1 = fromFakePolygons_1;
  const to3DWalls$1 = to3DWalls_1;
  const subtractGeom3$1 = subtractGeom3$2;
  const subtract$4 = (...geometries2) => {
    geometries2 = flatten$k(geometries2);
    const newgeometries = geometries2.map((geometry) => to3DWalls$1({ z0: -1, z1: 1 }, geometry));
    const newgeom3 = subtractGeom3$1(newgeometries);
    const epsilon = measureEpsilon$4(newgeom3);
    return fromFakePolygons$1(epsilon, geom3$h.toPolygons(newgeom3));
  };
  var subtractGeom2$1 = subtract$4;
  const flatten$j = flatten_1;
  const areAllShapesTheSameType$2 = areAllShapesTheSameType_1;
  const geom2$l = geom2$K;
  const geom3$g = geom3$K;
  const subtractGeom2 = subtractGeom2$1;
  const subtractGeom3 = subtractGeom3$2;
  const subtract$3 = (...geometries2) => {
    geometries2 = flatten$j(geometries2);
    if (geometries2.length === 0)
      throw new Error("wrong number of arguments");
    if (!areAllShapesTheSameType$2(geometries2)) {
      throw new Error("only subtract of the types are supported");
    }
    const geometry = geometries2[0];
    if (geom2$l.isA(geometry))
      return subtractGeom2(geometries2);
    if (geom3$g.isA(geometry))
      return subtractGeom3(geometries2);
    return geometry;
  };
  var subtract_1 = subtract$3;
  const geom3$f = geom3$K;
  const mayOverlap = mayOverlap_1;
  const { Tree } = trees;
  const unionSub$1 = (geometry1, geometry2) => {
    if (!mayOverlap(geometry1, geometry2)) {
      return unionForNonIntersecting(geometry1, geometry2);
    }
    const a = new Tree(geom3$f.toPolygons(geometry1));
    const b = new Tree(geom3$f.toPolygons(geometry2));
    a.clipTo(b, false);
    b.clipTo(a);
    b.invert();
    b.clipTo(a);
    b.invert();
    const newpolygons = a.allPolygons().concat(b.allPolygons());
    const result = geom3$f.create(newpolygons);
    return result;
  };
  const unionForNonIntersecting = (geometry1, geometry2) => {
    let newpolygons = geom3$f.toPolygons(geometry1);
    newpolygons = newpolygons.concat(geom3$f.toPolygons(geometry2));
    return geom3$f.create(newpolygons);
  };
  var unionGeom3Sub$1 = unionSub$1;
  const flatten$i = flatten_1;
  const retessellate$1 = retessellate_1;
  const unionSub = unionGeom3Sub$1;
  const union$4 = (...geometries2) => {
    geometries2 = flatten$i(geometries2);
    let i;
    for (i = 1; i < geometries2.length; i += 2) {
      geometries2.push(unionSub(geometries2[i - 1], geometries2[i]));
    }
    let newgeometry = geometries2[i - 1];
    newgeometry = retessellate$1(newgeometry);
    return newgeometry;
  };
  var unionGeom3$2 = union$4;
  const flatten$h = flatten_1;
  const geom3$e = geom3$K;
  const measureEpsilon$3 = measureEpsilon_1;
  const fromFakePolygons = fromFakePolygons_1;
  const to3DWalls = to3DWalls_1;
  const unionGeom3$1 = unionGeom3$2;
  const union$3 = (...geometries2) => {
    geometries2 = flatten$h(geometries2);
    const newgeometries = geometries2.map((geometry) => to3DWalls({ z0: -1, z1: 1 }, geometry));
    const newgeom3 = unionGeom3$1(newgeometries);
    const epsilon = measureEpsilon$3(newgeom3);
    return fromFakePolygons(epsilon, geom3$e.toPolygons(newgeom3));
  };
  var unionGeom2$2 = union$3;
  const flatten$g = flatten_1;
  const areAllShapesTheSameType$1 = areAllShapesTheSameType_1;
  const geom2$k = geom2$K;
  const geom3$d = geom3$K;
  const unionGeom2$1 = unionGeom2$2;
  const unionGeom3 = unionGeom3$2;
  const union$2 = (...geometries2) => {
    geometries2 = flatten$g(geometries2);
    if (geometries2.length === 0)
      throw new Error("wrong number of arguments");
    if (!areAllShapesTheSameType$1(geometries2)) {
      throw new Error("only unions of the same type are supported");
    }
    const geometry = geometries2[0];
    if (geom2$k.isA(geometry))
      return unionGeom2$1(geometries2);
    if (geom3$d.isA(geometry))
      return unionGeom3(geometries2);
    return geometry;
  };
  var union_1 = union$2;
  var booleans = {
    intersect: intersect_1,
    scission: scission_1,
    subtract: subtract_1,
    union: union_1
  };
  const { EPS: EPS$1, TAU: TAU$2 } = constants$1;
  const intersect = intersect_1$1;
  const line2 = line2$2;
  const vec2$3 = vec2$E;
  const area$2 = area_1;
  const offsetFromPoints$4 = (options, points) => {
    const defaults = {
      delta: 1,
      corners: "edge",
      closed: false,
      segments: 16
    };
    let { delta, corners, closed, segments } = Object.assign({}, defaults, options);
    if (Math.abs(delta) < EPS$1)
      return points;
    let rotation = options.closed ? area$2(points) : 1;
    if (rotation === 0)
      rotation = 1;
    const orientation = rotation > 0 && delta >= 0 || rotation < 0 && delta < 0;
    delta = Math.abs(delta);
    let previousSegment = null;
    let newPoints = [];
    const newCorners = [];
    const of = vec2$3.create();
    const n = points.length;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      const p0 = points[i];
      const p1 = points[j];
      orientation ? vec2$3.subtract(of, p0, p1) : vec2$3.subtract(of, p1, p0);
      vec2$3.normal(of, of);
      vec2$3.normalize(of, of);
      vec2$3.scale(of, of, delta);
      const n0 = vec2$3.add(vec2$3.create(), p0, of);
      const n1 = vec2$3.add(vec2$3.create(), p1, of);
      const currentSegment = [n0, n1];
      if (previousSegment != null) {
        if (closed || !closed && j !== 0) {
          const ip = intersect(previousSegment[0], previousSegment[1], currentSegment[0], currentSegment[1]);
          if (ip) {
            newPoints.pop();
            currentSegment[0] = ip;
          } else {
            newCorners.push({ c: p0, s0: previousSegment, s1: currentSegment });
          }
        }
      }
      previousSegment = [n0, n1];
      if (j === 0 && !closed)
        continue;
      newPoints.push(currentSegment[0]);
      newPoints.push(currentSegment[1]);
    }
    if (closed && previousSegment != null) {
      const n0 = newPoints[0];
      const n1 = newPoints[1];
      const ip = intersect(previousSegment[0], previousSegment[1], n0, n1);
      if (ip) {
        newPoints[0] = ip;
        newPoints.pop();
      } else {
        const p0 = points[0];
        const cursegment = [n0, n1];
        newCorners.push({ c: p0, s0: previousSegment, s1: cursegment });
      }
    }
    if (corners === "edge") {
      const pointIndex = /* @__PURE__ */ new Map();
      newPoints.forEach((point, index) => pointIndex.set(point, index));
      const line0 = line2.create();
      const line1 = line2.create();
      newCorners.forEach((corner) => {
        line2.fromPoints(line0, corner.s0[0], corner.s0[1]);
        line2.fromPoints(line1, corner.s1[0], corner.s1[1]);
        const ip = line2.intersectPointOfLines(line0, line1);
        if (Number.isFinite(ip[0]) && Number.isFinite(ip[1])) {
          const p0 = corner.s0[1];
          const i = pointIndex.get(p0);
          newPoints[i] = ip;
          newPoints[(i + 1) % newPoints.length] = void 0;
        } else {
          const p0 = corner.s1[0];
          const i = pointIndex.get(p0);
          newPoints[i] = void 0;
        }
      });
      newPoints = newPoints.filter((p) => p !== void 0);
    }
    if (corners === "round") {
      let cornersegments = Math.floor(segments / 4);
      const v0 = vec2$3.create();
      newCorners.forEach((corner) => {
        let rotation2 = vec2$3.angle(vec2$3.subtract(v0, corner.s1[0], corner.c));
        rotation2 -= vec2$3.angle(vec2$3.subtract(v0, corner.s0[1], corner.c));
        if (orientation && rotation2 < 0) {
          rotation2 = rotation2 + Math.PI;
          if (rotation2 < 0)
            rotation2 = rotation2 + Math.PI;
        }
        if (!orientation && rotation2 > 0) {
          rotation2 = rotation2 - Math.PI;
          if (rotation2 > 0)
            rotation2 = rotation2 - Math.PI;
        }
        if (rotation2 !== 0) {
          cornersegments = Math.floor(segments * (Math.abs(rotation2) / TAU$2));
          const step = rotation2 / cornersegments;
          const start = vec2$3.angle(vec2$3.subtract(v0, corner.s0[1], corner.c));
          const cornerpoints = [];
          for (let i = 1; i < cornersegments; i++) {
            const radians = start + step * i;
            const point = vec2$3.fromAngleRadians(vec2$3.create(), radians);
            vec2$3.scale(point, point, delta);
            vec2$3.add(point, point, corner.c);
            cornerpoints.push(point);
          }
          if (cornerpoints.length > 0) {
            const p0 = corner.s0[1];
            let i = newPoints.findIndex((point) => vec2$3.equals(p0, point));
            i = (i + 1) % newPoints.length;
            newPoints.splice(i, 0, ...cornerpoints);
          }
        } else {
          const p0 = corner.s1[0];
          const i = newPoints.findIndex((point) => vec2$3.equals(p0, point));
          newPoints.splice(i, 1);
        }
      });
    }
    return newPoints;
  };
  var offsetFromPoints_1 = offsetFromPoints$4;
  const geom2$j = geom2$K;
  const offsetFromPoints$3 = offsetFromPoints_1;
  const expandGeom2$1 = (options, geometry) => {
    const defaults = {
      delta: 1,
      corners: "edge",
      segments: 16
    };
    const { delta, corners, segments } = Object.assign({}, defaults, options);
    if (!(corners === "edge" || corners === "chamfer" || corners === "round")) {
      throw new Error('corners must be "edge", "chamfer", or "round"');
    }
    const outlines = geom2$j.toOutlines(geometry);
    const newoutlines = outlines.map((outline) => {
      options = {
        delta,
        corners,
        closed: true,
        segments
      };
      return offsetFromPoints$3(options, outline);
    });
    const allsides = newoutlines.reduce((sides, newoutline) => sides.concat(geom2$j.toSides(geom2$j.fromPoints(newoutline))), []);
    return geom2$j.create(allsides);
  };
  var expandGeom2_1 = expandGeom2$1;
  const mat4$5 = mat4$r;
  const vec3$6 = vec3$Y;
  const geom3$c = geom3$K;
  const poly3$7 = poly3$A;
  const extrudePolygon$1 = (offsetvector, polygon1) => {
    const direction2 = vec3$6.dot(poly3$7.plane(polygon1), offsetvector);
    if (direction2 > 0) {
      polygon1 = poly3$7.invert(polygon1);
    }
    const newpolygons = [polygon1];
    const polygon2 = poly3$7.transform(mat4$5.fromTranslation(mat4$5.create(), offsetvector), polygon1);
    const numvertices = polygon1.vertices.length;
    for (let i = 0; i < numvertices; i++) {
      const nexti = i < numvertices - 1 ? i + 1 : 0;
      const sideFacePolygon = poly3$7.create([
        polygon1.vertices[i],
        polygon2.vertices[i],
        polygon2.vertices[nexti],
        polygon1.vertices[nexti]
      ]);
      newpolygons.push(sideFacePolygon);
    }
    newpolygons.push(poly3$7.invert(polygon2));
    return geom3$c.create(newpolygons);
  };
  var extrudePolygon_1 = extrudePolygon$1;
  const { EPS, TAU: TAU$1 } = constants$1;
  const mat4$4 = mat4$r;
  const vec3$5 = vec3$Y;
  const fnNumberSort = fnNumberSort_1;
  const geom3$b = geom3$K;
  const poly3$6 = poly3$A;
  const sphere = sphere_1;
  const retessellate = retessellate_1;
  const unionGeom3Sub = unionGeom3Sub$1;
  const extrudePolygon = extrudePolygon_1;
  const mapPlaneToVertex = (map, vertex, plane2) => {
    const key = vertex.toString();
    if (!map.has(key)) {
      const entry = [vertex, [plane2]];
      map.set(key, entry);
    } else {
      const planes = map.get(key)[1];
      planes.push(plane2);
    }
  };
  const mapPlaneToEdge = (map, edge, plane2) => {
    const key0 = edge[0].toString();
    const key1 = edge[1].toString();
    const key = key0 < key1 ? `${key0},${key1}` : `${key1},${key0}`;
    if (!map.has(key)) {
      const entry = [edge, [plane2]];
      map.set(key, entry);
    } else {
      const planes = map.get(key)[1];
      planes.push(plane2);
    }
  };
  const addUniqueAngle = (map, angle2) => {
    const i = map.findIndex((item) => item === angle2);
    if (i < 0) {
      map.push(angle2);
    }
  };
  const expandShell$1 = (options, geometry) => {
    const defaults = {
      delta: 1,
      segments: 12
    };
    const { delta, segments } = Object.assign({}, defaults, options);
    let result = geom3$b.create();
    const vertices2planes = /* @__PURE__ */ new Map();
    const edges2planes = /* @__PURE__ */ new Map();
    const v12 = vec3$5.create();
    const v22 = vec3$5.create();
    const polygons = geom3$b.toPolygons(geometry);
    polygons.forEach((polygon2, index) => {
      const extrudevector = vec3$5.scale(vec3$5.create(), poly3$6.plane(polygon2), 2 * delta);
      const translatedpolygon = poly3$6.transform(mat4$4.fromTranslation(mat4$4.create(), vec3$5.scale(vec3$5.create(), extrudevector, -0.5)), polygon2);
      const extrudedface = extrudePolygon(extrudevector, translatedpolygon);
      result = unionGeom3Sub(result, extrudedface);
      const vertices = polygon2.vertices;
      for (let i = 0; i < vertices.length; i++) {
        mapPlaneToVertex(vertices2planes, vertices[i], poly3$6.plane(polygon2));
        const j = (i + 1) % vertices.length;
        const edge = [vertices[i], vertices[j]];
        mapPlaneToEdge(edges2planes, edge, poly3$6.plane(polygon2));
      }
    });
    edges2planes.forEach((item) => {
      const edge = item[0];
      const planes = item[1];
      const startpoint = edge[0];
      const endpoint = edge[1];
      const zbase = vec3$5.subtract(vec3$5.create(), endpoint, startpoint);
      vec3$5.normalize(zbase, zbase);
      const xbase = planes[0];
      const ybase = vec3$5.cross(vec3$5.create(), xbase, zbase);
      let angles = [];
      for (let i = 0; i < segments; i++) {
        addUniqueAngle(angles, i * TAU$1 / segments);
      }
      for (let i = 0, iMax = planes.length; i < iMax; i++) {
        const planenormal = planes[i];
        const si = vec3$5.dot(ybase, planenormal);
        const co = vec3$5.dot(xbase, planenormal);
        let angle2 = Math.atan2(si, co);
        if (angle2 < 0)
          angle2 += TAU$1;
        addUniqueAngle(angles, angle2);
        angle2 = Math.atan2(-si, -co);
        if (angle2 < 0)
          angle2 += TAU$1;
        addUniqueAngle(angles, angle2);
      }
      angles = angles.sort(fnNumberSort);
      const numangles = angles.length;
      let prevp1;
      let prevp2;
      const startfacevertices = [];
      const endfacevertices = [];
      const polygons2 = [];
      for (let i = -1; i < numangles; i++) {
        const angle2 = angles[i < 0 ? i + numangles : i];
        const si = Math.sin(angle2);
        const co = Math.cos(angle2);
        vec3$5.scale(v12, xbase, co * delta);
        vec3$5.scale(v22, ybase, si * delta);
        vec3$5.add(v12, v12, v22);
        const p1 = vec3$5.add(vec3$5.create(), startpoint, v12);
        const p2 = vec3$5.add(vec3$5.create(), endpoint, v12);
        let skip = false;
        if (i >= 0) {
          if (vec3$5.distance(p1, prevp1) < EPS) {
            skip = true;
          }
        }
        if (!skip) {
          if (i >= 0) {
            startfacevertices.push(p1);
            endfacevertices.push(p2);
            const points = [prevp2, p2, p1, prevp1];
            const polygon2 = poly3$6.create(points);
            polygons2.push(polygon2);
          }
          prevp1 = p1;
          prevp2 = p2;
        }
      }
      endfacevertices.reverse();
      polygons2.push(poly3$6.create(startfacevertices));
      polygons2.push(poly3$6.create(endfacevertices));
      const cylinder2 = geom3$b.create(polygons2);
      result = unionGeom3Sub(result, cylinder2);
    });
    vertices2planes.forEach((item) => {
      const vertex = item[0];
      const planes = item[1];
      const xaxis = planes[0];
      let bestzaxis = null;
      let bestzaxisorthogonality = 0;
      for (let i = 1; i < planes.length; i++) {
        const normal2 = planes[i];
        const cross2 = vec3$5.cross(v12, xaxis, normal2);
        const crosslength = vec3$5.length(cross2);
        if (crosslength > 0.05) {
          if (crosslength > bestzaxisorthogonality) {
            bestzaxisorthogonality = crosslength;
            bestzaxis = normal2;
          }
        }
      }
      if (!bestzaxis) {
        bestzaxis = vec3$5.orthogonal(v12, xaxis);
      }
      const yaxis = vec3$5.cross(v12, xaxis, bestzaxis);
      vec3$5.normalize(yaxis, yaxis);
      const zaxis = vec3$5.cross(v22, yaxis, xaxis);
      const corner = sphere({
        center: [vertex[0], vertex[1], vertex[2]],
        radius: delta,
        segments,
        axes: [xaxis, yaxis, zaxis]
      });
      result = unionGeom3Sub(result, corner);
    });
    return retessellate(result);
  };
  var expandShell_1 = expandShell$1;
  const geom3$a = geom3$K;
  const union$1 = union_1;
  const expandShell = expandShell_1;
  const expandGeom3$1 = (options, geometry) => {
    const defaults = {
      delta: 1,
      corners: "round",
      segments: 12
    };
    const { delta, corners, segments } = Object.assign({}, defaults, options);
    if (!(corners === "round")) {
      throw new Error('corners must be "round" for 3D geometries');
    }
    const polygons = geom3$a.toPolygons(geometry);
    if (polygons.length === 0)
      throw new Error("the given geometry cannot be empty");
    options = { delta, corners, segments };
    const expanded = expandShell(options, geometry);
    return union$1(geometry, expanded);
  };
  var expandGeom3_1 = expandGeom3$1;
  const area$1 = area_1;
  const vec2$2 = vec2$E;
  const geom2$i = geom2$K;
  const path2$g = path2$u;
  const offsetFromPoints$2 = offsetFromPoints_1;
  const createGeometryFromClosedOffsets = (paths) => {
    let { external, internal } = paths;
    if (area$1(external) < 0) {
      external = external.reverse();
    } else {
      internal = internal.reverse();
    }
    const externalPath = path2$g.fromPoints({ closed: true }, external);
    const internalPath = path2$g.fromPoints({ closed: true }, internal);
    const externalSides = geom2$i.toSides(geom2$i.fromPoints(path2$g.toPoints(externalPath)));
    const internalSides = geom2$i.toSides(geom2$i.fromPoints(path2$g.toPoints(internalPath)));
    externalSides.push(...internalSides);
    return geom2$i.create(externalSides);
  };
  const createGeometryFromExpandedOpenPath = (paths, segments, corners, delta) => {
    const { points, external, internal } = paths;
    const capSegments = Math.floor(segments / 2);
    const e2iCap = [];
    const i2eCap = [];
    if (corners === "round" && capSegments > 0) {
      const step = Math.PI / capSegments;
      const eCorner = points[points.length - 1];
      const e2iStart = vec2$2.angle(vec2$2.subtract(vec2$2.create(), external[external.length - 1], eCorner));
      const iCorner = points[0];
      const i2eStart = vec2$2.angle(vec2$2.subtract(vec2$2.create(), internal[0], iCorner));
      for (let i = 1; i < capSegments; i++) {
        let radians = e2iStart + step * i;
        let point = vec2$2.fromAngleRadians(vec2$2.create(), radians);
        vec2$2.scale(point, point, delta);
        vec2$2.add(point, point, eCorner);
        e2iCap.push(point);
        radians = i2eStart + step * i;
        point = vec2$2.fromAngleRadians(vec2$2.create(), radians);
        vec2$2.scale(point, point, delta);
        vec2$2.add(point, point, iCorner);
        i2eCap.push(point);
      }
    }
    const allPoints = [];
    allPoints.push(...external, ...e2iCap, ...internal.reverse(), ...i2eCap);
    return geom2$i.fromPoints(allPoints);
  };
  const expandPath2$1 = (options, geometry) => {
    const defaults = {
      delta: 1,
      corners: "edge",
      segments: 16
    };
    options = Object.assign({}, defaults, options);
    const { delta, corners, segments } = options;
    if (delta <= 0)
      throw new Error("the given delta must be positive for paths");
    if (!(corners === "edge" || corners === "chamfer" || corners === "round")) {
      throw new Error('corners must be "edge", "chamfer", or "round"');
    }
    const closed = geometry.isClosed;
    const points = path2$g.toPoints(geometry);
    if (points.length === 0)
      throw new Error("the given geometry cannot be empty");
    const paths = {
      points,
      external: offsetFromPoints$2({ delta, corners, segments, closed }, points),
      internal: offsetFromPoints$2({ delta: -delta, corners, segments, closed }, points)
    };
    if (geometry.isClosed) {
      return createGeometryFromClosedOffsets(paths);
    } else {
      return createGeometryFromExpandedOpenPath(paths, segments, corners, delta);
    }
  };
  var expandPath2_1 = expandPath2$1;
  const flatten$f = flatten_1;
  const geom2$h = geom2$K;
  const geom3$9 = geom3$K;
  const path2$f = path2$u;
  const expandGeom2 = expandGeom2_1;
  const expandGeom3 = expandGeom3_1;
  const expandPath2 = expandPath2_1;
  const expand$2 = (options, ...objects) => {
    objects = flatten$f(objects);
    if (objects.length === 0)
      throw new Error("wrong number of arguments");
    const results = objects.map((object) => {
      if (path2$f.isA(object))
        return expandPath2(options, object);
      if (geom2$h.isA(object))
        return expandGeom2(options, object);
      if (geom3$9.isA(object))
        return expandGeom3(options, object);
      return object;
    });
    return results.length === 1 ? results[0] : results;
  };
  var expand_1 = expand$2;
  const geom2$g = geom2$K;
  const poly2 = poly2$1;
  const offsetFromPoints$1 = offsetFromPoints_1;
  const offsetGeom2$1 = (options, geometry) => {
    const defaults = {
      delta: 1,
      corners: "edge",
      segments: 0
    };
    const { delta, corners, segments } = Object.assign({}, defaults, options);
    if (!(corners === "edge" || corners === "chamfer" || corners === "round")) {
      throw new Error('corners must be "edge", "chamfer", or "round"');
    }
    const outlines = geom2$g.toOutlines(geometry);
    const newoutlines = outlines.map((outline) => {
      const level = outlines.reduce((acc, polygon2) => acc + poly2.arePointsInside(outline, poly2.create(polygon2)), 0);
      const outside = level % 2 === 0;
      options = {
        delta: outside ? delta : -delta,
        corners,
        closed: true,
        segments
      };
      return offsetFromPoints$1(options, outline);
    });
    const allsides = newoutlines.reduce((sides, newoutline) => sides.concat(geom2$g.toSides(geom2$g.fromPoints(newoutline))), []);
    return geom2$g.create(allsides);
  };
  var offsetGeom2_1 = offsetGeom2$1;
  const path2$e = path2$u;
  const offsetFromPoints = offsetFromPoints_1;
  const offsetPath2$1 = (options, geometry) => {
    const defaults = {
      delta: 1,
      corners: "edge",
      closed: geometry.isClosed,
      segments: 16
    };
    const { delta, corners, closed, segments } = Object.assign({}, defaults, options);
    if (!(corners === "edge" || corners === "chamfer" || corners === "round")) {
      throw new Error('corners must be "edge", "chamfer", or "round"');
    }
    options = { delta, corners, closed, segments };
    const newpoints = offsetFromPoints(options, path2$e.toPoints(geometry));
    return path2$e.fromPoints({ closed }, newpoints);
  };
  var offsetPath2_1 = offsetPath2$1;
  const flatten$e = flatten_1;
  const geom2$f = geom2$K;
  const path2$d = path2$u;
  const offsetGeom2 = offsetGeom2_1;
  const offsetPath2 = offsetPath2_1;
  const offset = (options, ...objects) => {
    objects = flatten$e(objects);
    if (objects.length === 0)
      throw new Error("wrong number of arguments");
    const results = objects.map((object) => {
      if (path2$d.isA(object))
        return offsetPath2(options, object);
      if (geom2$f.isA(object))
        return offsetGeom2(options, object);
      return object;
    });
    return results.length === 1 ? results[0] : results;
  };
  var offset_1 = offset;
  var expansions = {
    expand: expand_1,
    offset: offset_1
  };
  const mat4$3 = mat4$r;
  const vec3$4 = vec3$Y;
  const geom2$e = geom2$K;
  const slice$1 = slice$5;
  const extrudeFromSlices$1 = extrudeFromSlices_1;
  const extrudeGeom2 = (options, geometry) => {
    const defaults = {
      offset: [0, 0, 1],
      twistAngle: 0,
      twistSteps: 12,
      repair: true
    };
    let { offset: offset2, twistAngle, twistSteps, repair: repair2 } = Object.assign({}, defaults, options);
    if (twistSteps < 1)
      throw new Error("twistSteps must be 1 or more");
    if (twistAngle === 0) {
      twistSteps = 1;
    }
    const offsetv = vec3$4.clone(offset2);
    const baseSides = geom2$e.toSides(geometry);
    if (baseSides.length === 0)
      throw new Error("the given geometry cannot be empty");
    const baseSlice = slice$1.fromSides(baseSides);
    if (offsetv[2] < 0)
      slice$1.reverse(baseSlice, baseSlice);
    const matrix = mat4$3.create();
    const createTwist = (progress, index, base) => {
      const Zrotation = index / twistSteps * twistAngle;
      const Zoffset = vec3$4.scale(vec3$4.create(), offsetv, index / twistSteps);
      mat4$3.multiply(matrix, mat4$3.fromZRotation(matrix, Zrotation), mat4$3.fromTranslation(mat4$3.create(), Zoffset));
      return slice$1.transform(matrix, base);
    };
    options = {
      numberOfSlices: twistSteps + 1,
      capStart: true,
      capEnd: true,
      repair: repair2,
      callback: createTwist
    };
    return extrudeFromSlices$1(options, baseSlice);
  };
  var extrudeLinearGeom2$4 = extrudeGeom2;
  const geom2$d = geom2$K;
  const path2$c = path2$u;
  const extrudeLinearGeom2$3 = extrudeLinearGeom2$4;
  const extrudePath2 = (options, geometry) => {
    if (!geometry.isClosed)
      throw new Error("extruded path must be closed");
    const points = path2$c.toPoints(geometry);
    const geometry2 = geom2$d.fromPoints(points);
    return extrudeLinearGeom2$3(options, geometry2);
  };
  var extrudeLinearPath2$1 = extrudePath2;
  const flatten$d = flatten_1;
  const geom2$c = geom2$K;
  const path2$b = path2$u;
  const extrudeLinearGeom2$2 = extrudeLinearGeom2$4;
  const extrudeLinearPath2 = extrudeLinearPath2$1;
  const extrudeLinear = (options, ...objects) => {
    const defaults = {
      height: 1,
      twistAngle: 0,
      twistSteps: 1,
      repair: true
    };
    const { height, twistAngle, twistSteps, repair: repair2 } = Object.assign({}, defaults, options);
    objects = flatten$d(objects);
    if (objects.length === 0)
      throw new Error("wrong number of arguments");
    options = { offset: [0, 0, height], twistAngle, twistSteps, repair: repair2 };
    const results = objects.map((object) => {
      if (path2$b.isA(object))
        return extrudeLinearPath2(options, object);
      if (geom2$c.isA(object))
        return extrudeLinearGeom2$2(options, object);
      return object;
    });
    return results.length === 1 ? results[0] : results;
  };
  var extrudeLinear_1 = extrudeLinear;
  const path2$a = path2$u;
  const expand$1 = expand_1;
  const extrudeLinearGeom2$1 = extrudeLinearGeom2$4;
  const extrudeRectangularPath2$1 = (options, geometry) => {
    const defaults = {
      size: 1,
      height: 1
    };
    const { size, height } = Object.assign({}, defaults, options);
    options.delta = size;
    options.offset = [0, 0, height];
    const points = path2$a.toPoints(geometry);
    if (points.length === 0)
      throw new Error("the given geometry cannot be empty");
    const newgeometry = expand$1(options, geometry);
    return extrudeLinearGeom2$1(options, newgeometry);
  };
  var extrudeRectangularPath2_1 = extrudeRectangularPath2$1;
  const { area } = utils$1;
  const geom2$b = geom2$K;
  const path2$9 = path2$u;
  const expand = expand_1;
  const extrudeLinearGeom2 = extrudeLinearGeom2$4;
  const extrudeRectangularGeom2$1 = (options, geometry) => {
    const defaults = {
      size: 1,
      height: 1
    };
    const { size, height } = Object.assign({}, defaults, options);
    options.delta = size;
    options.offset = [0, 0, height];
    const outlines = geom2$b.toOutlines(geometry);
    if (outlines.length === 0)
      throw new Error("the given geometry cannot be empty");
    const newparts = outlines.map((outline) => {
      if (area(outline) < 0)
        outline.reverse();
      return expand(options, path2$9.fromPoints({ closed: true }, outline));
    });
    const allsides = newparts.reduce((sides, part) => sides.concat(geom2$b.toSides(part)), []);
    const newgeometry = geom2$b.create(allsides);
    return extrudeLinearGeom2(options, newgeometry);
  };
  var extrudeRectangularGeom2_1 = extrudeRectangularGeom2$1;
  const flatten$c = flatten_1;
  const geom2$a = geom2$K;
  const path2$8 = path2$u;
  const extrudeRectangularPath2 = extrudeRectangularPath2_1;
  const extrudeRectangularGeom2 = extrudeRectangularGeom2_1;
  const extrudeRectangular = (options, ...objects) => {
    const defaults = {
      size: 1,
      height: 1
    };
    const { size, height } = Object.assign({}, defaults, options);
    objects = flatten$c(objects);
    if (objects.length === 0)
      throw new Error("wrong number of arguments");
    if (size <= 0)
      throw new Error("size must be positive");
    if (height <= 0)
      throw new Error("height must be positive");
    const results = objects.map((object) => {
      if (path2$8.isA(object))
        return extrudeRectangularPath2(options, object);
      if (geom2$a.isA(object))
        return extrudeRectangularGeom2(options, object);
      return object;
    });
    return results.length === 1 ? results[0] : results;
  };
  var extrudeRectangular_1 = extrudeRectangular;
  const { TAU } = constants$1;
  const slice = slice$5;
  const mat4$2 = mat4$r;
  const extrudeFromSlices = extrudeFromSlices_1;
  const geom2$9 = geom2$K;
  const extrudeHelical = (options, geometry) => {
    const defaults = {
      angle: TAU,
      startAngle: 0,
      pitch: 10,
      endOffset: 0,
      segmentsPerRotation: 32
    };
    const { angle: angle2, endOffset, segmentsPerRotation, startAngle } = Object.assign({}, defaults, options);
    let pitch;
    if (!options.pitch && options.height) {
      pitch = options.height / (angle2 / TAU);
    } else {
      pitch = options.pitch ? options.pitch : defaults.pitch;
    }
    const minNumberOfSegments = 3;
    if (segmentsPerRotation < minNumberOfSegments)
      throw new Error(`The number of segments per rotation needs to be at least 3.`);
    let shapeSides = geom2$9.toSides(geometry);
    if (shapeSides.length === 0)
      throw new Error("the given geometry cannot be empty");
    const pointsWithPositiveX = shapeSides.filter((s) => s[0][0] >= 0);
    let baseSlice = slice.fromSides(shapeSides);
    if (pointsWithPositiveX.length === 0) {
      baseSlice = slice.reverse(baseSlice);
    }
    const calculatedSegments = Math.round(segmentsPerRotation / TAU * Math.abs(angle2));
    const segments = calculatedSegments >= 2 ? calculatedSegments : 2;
    const step1 = mat4$2.create();
    let matrix;
    const sliceCallback = (progress, index, base) => {
      const zRotation = startAngle + angle2 / segments * index;
      const xOffset = endOffset / segments * index;
      const zOffset = (zRotation - startAngle) / TAU * pitch;
      mat4$2.multiply(
        step1,
        // then apply offsets
        mat4$2.fromTranslation(mat4$2.create(), [xOffset, 0, zOffset * Math.sign(angle2)]),
        // first rotate "flat" 2D shape from XY to XZ plane
        mat4$2.fromXRotation(mat4$2.create(), -TAU / 4 * Math.sign(angle2))
        // rotate the slice correctly to not create inside-out polygon
      );
      matrix = mat4$2.create();
      mat4$2.multiply(
        matrix,
        // finally rotate around Z axis
        mat4$2.fromZRotation(mat4$2.create(), zRotation),
        step1
      );
      return slice.transform(matrix, base);
    };
    return extrudeFromSlices(
      {
        // "base" slice is counted as segment, so add one for complete final rotation
        numberOfSlices: segments + 1,
        callback: sliceCallback
      },
      baseSlice
    );
  };
  var extrudeHelical_1 = extrudeHelical;
  const flatten$b = flatten_1;
  const aboutEqualNormals$1 = aboutEqualNormals_1;
  const plane = plane$b;
  const mat4$1 = mat4$r;
  const geom2$8 = geom2$K;
  const geom3$8 = geom3$K;
  const poly3$5 = poly3$A;
  const measureEpsilon$2 = measureEpsilon_1;
  const unionGeom2 = unionGeom2$2;
  const projectGeom3 = (options, geometry) => {
    const projplane = plane.fromNormalAndPoint(plane.create(), options.axis, options.origin);
    if (Number.isNaN(projplane[0]) || Number.isNaN(projplane[1]) || Number.isNaN(projplane[2]) || Number.isNaN(projplane[3])) {
      throw new Error("project: invalid axis or origin");
    }
    const epsilon = measureEpsilon$2(geometry);
    const epsilonArea = epsilon * epsilon * Math.sqrt(3) / 4;
    if (epsilon === 0)
      return geom2$8.create();
    const polygons = geom3$8.toPolygons(geometry);
    let projpolys = [];
    for (let i = 0; i < polygons.length; i++) {
      const newpoints = polygons[i].vertices.map((v) => plane.projectionOfPoint(projplane, v));
      const newpoly = poly3$5.create(newpoints);
      const newplane = poly3$5.plane(newpoly);
      if (!aboutEqualNormals$1(projplane, newplane))
        continue;
      if (poly3$5.measureArea(newpoly) < epsilonArea)
        continue;
      projpolys.push(newpoly);
    }
    if (!aboutEqualNormals$1(projplane, [0, 0, 1])) {
      const rotation = mat4$1.fromVectorRotation(mat4$1.create(), projplane, [0, 0, 1]);
      projpolys = projpolys.map((p) => poly3$5.transform(rotation, p));
    }
    projpolys = projpolys.sort((a, b) => poly3$5.measureArea(b) - poly3$5.measureArea(a));
    const projgeoms = projpolys.map((p) => geom2$8.fromPoints(p.vertices));
    return unionGeom2(projgeoms);
  };
  const project = (options, ...objects) => {
    const defaults = {
      axis: [0, 0, 1],
      // Z axis
      origin: [0, 0, 0]
    };
    const { axis, origin: origin2 } = Object.assign({}, defaults, options);
    objects = flatten$b(objects);
    if (objects.length === 0)
      throw new Error("wrong number of arguments");
    options = { axis, origin: origin2 };
    const results = objects.map((object) => {
      if (geom3$8.isA(object))
        return projectGeom3(options, object);
      return object;
    });
    return results.length === 1 ? results[0] : results;
  };
  var project_1 = project;
  var extrusions = {
    extrudeFromSlices: extrudeFromSlices_1,
    extrudeLinear: extrudeLinear_1,
    extrudeRectangular: extrudeRectangular_1,
    extrudeRotate: extrudeRotate_1,
    extrudeHelical: extrudeHelical_1,
    project: project_1,
    slice: slice$5
  };
  const vec2$1 = vec2$E;
  const hullPoints2$2 = (uniquePoints) => {
    let min2 = vec2$1.fromValues(Infinity, Infinity);
    uniquePoints.forEach((point) => {
      if (point[1] < min2[1] || point[1] === min2[1] && point[0] < min2[0]) {
        min2 = point;
      }
    });
    const points = [];
    uniquePoints.forEach((point) => {
      const angle2 = fakeAtan2(point[1] - min2[1], point[0] - min2[0]);
      const distSq = vec2$1.squaredDistance(point, min2);
      points.push({ point, angle: angle2, distSq });
    });
    points.sort((pt1, pt2) => pt1.angle < pt2.angle ? -1 : pt1.angle > pt2.angle ? 1 : pt1.distSq < pt2.distSq ? -1 : pt1.distSq > pt2.distSq ? 1 : 0);
    const stack = [];
    points.forEach((point) => {
      let cnt = stack.length;
      while (cnt > 1 && ccw(stack[cnt - 2], stack[cnt - 1], point.point) <= Number.EPSILON) {
        stack.pop();
        cnt = stack.length;
      }
      stack.push(point.point);
    });
    return stack;
  };
  const ccw = (v12, v22, v3) => (v22[0] - v12[0]) * (v3[1] - v12[1]) - (v22[1] - v12[1]) * (v3[0] - v12[0]);
  const fakeAtan2 = (y, x) => {
    if (y === 0 && x === 0) {
      return -Infinity;
    } else {
      return -x / y;
    }
  };
  var hullPoints2_1 = hullPoints2$2;
  const geom2$7 = geom2$K;
  const geom3$7 = geom3$K;
  const path2$7 = path2$u;
  const toUniquePoints$3 = (geometries2) => {
    const found = /* @__PURE__ */ new Set();
    const uniquePoints = [];
    const addPoint = (point) => {
      const key = point.toString();
      if (!found.has(key)) {
        uniquePoints.push(point);
        found.add(key);
      }
    };
    geometries2.forEach((geometry) => {
      if (geom2$7.isA(geometry)) {
        geom2$7.toPoints(geometry).forEach(addPoint);
      } else if (geom3$7.isA(geometry)) {
        geom3$7.toPoints(geometry).forEach((points) => points.forEach(addPoint));
      } else if (path2$7.isA(geometry)) {
        path2$7.toPoints(geometry).forEach(addPoint);
      }
    });
    return uniquePoints;
  };
  var toUniquePoints_1 = toUniquePoints$3;
  const flatten$a = flatten_1;
  const path2$6 = path2$u;
  const hullPoints2$1 = hullPoints2_1;
  const toUniquePoints$2 = toUniquePoints_1;
  const hullPath2$1 = (...geometries2) => {
    geometries2 = flatten$a(geometries2);
    const unique = toUniquePoints$2(geometries2);
    const hullPoints = hullPoints2$1(unique);
    return path2$6.fromPoints({ closed: true }, hullPoints);
  };
  var hullPath2_1 = hullPath2$1;
  const flatten$9 = flatten_1;
  const geom2$6 = geom2$K;
  const hullPoints2 = hullPoints2_1;
  const toUniquePoints$1 = toUniquePoints_1;
  const hullGeom2$1 = (...geometries2) => {
    geometries2 = flatten$9(geometries2);
    const unique = toUniquePoints$1(geometries2);
    const hullPoints = hullPoints2(unique);
    if (hullPoints.length < 3)
      return geom2$6.create();
    return geom2$6.fromPoints(hullPoints);
  };
  var hullGeom2_1 = hullGeom2$1;
  const cross$2 = cross_1$1;
  const subtract$2 = subtract_1$3;
  const squaredLength = squaredLength_1$1;
  const distanceSquared = (p, a, b) => {
    const ab = [];
    const ap = [];
    const cr = [];
    subtract$2(ab, b, a);
    subtract$2(ap, p, a);
    const area2 = squaredLength(cross$2(cr, ap, ab));
    const s = squaredLength(ab);
    if (s === 0) {
      throw Error("a and b are the same point");
    }
    return area2 / s;
  };
  const pointLineDistance$1 = (point, a, b) => Math.sqrt(distanceSquared(point, a, b));
  var pointLineDistance_1 = pointLineDistance$1;
  const cross$1 = cross_1$1;
  const normalize$1 = normalize_1$1;
  const subtract$1 = subtract_1$3;
  const planeNormal = (out, point1, point2, point3) => {
    const tmp = [0, 0, 0];
    subtract$1(out, point1, point2);
    subtract$1(tmp, point2, point3);
    cross$1(out, out, tmp);
    return normalize$1(out, out);
  };
  var getPlaneNormal$1 = planeNormal;
  let VertexList$1 = class VertexList {
    constructor() {
      this.head = null;
      this.tail = null;
    }
    clear() {
      this.head = this.tail = null;
    }
    /**
     * Inserts a `node` before `target`, it's assumed that
     * `target` belongs to this doubly linked list
     *
     * @param {*} target
     * @param {*} node
     */
    insertBefore(target, node) {
      node.prev = target.prev;
      node.next = target;
      if (!node.prev) {
        this.head = node;
      } else {
        node.prev.next = node;
      }
      target.prev = node;
    }
    /**
     * Inserts a `node` after `target`, it's assumed that
     * `target` belongs to this doubly linked list
     *
     * @param {Vertex} target
     * @param {Vertex} node
     */
    insertAfter(target, node) {
      node.prev = target;
      node.next = target.next;
      if (!node.next) {
        this.tail = node;
      } else {
        node.next.prev = node;
      }
      target.next = node;
    }
    /**
     * Appends a `node` to the end of this doubly linked list
     * Note: `node.next` will be unlinked from `node`
     * Note: if `node` is part of another linked list call `addAll` instead
     *
     * @param {*} node
     */
    add(node) {
      if (!this.head) {
        this.head = node;
      } else {
        this.tail.next = node;
      }
      node.prev = this.tail;
      node.next = null;
      this.tail = node;
    }
    /**
     * Appends a chain of nodes where `node` is the head,
     * the difference with `add` is that it correctly sets the position
     * of the node list `tail` property
     *
     * @param {*} node
     */
    addAll(node) {
      if (!this.head) {
        this.head = node;
      } else {
        this.tail.next = node;
      }
      node.prev = this.tail;
      while (node.next) {
        node = node.next;
      }
      this.tail = node;
    }
    /**
     * Deletes a `node` from this linked list, it's assumed that `node` is a
     * member of this linked list
     *
     * @param {*} node
     */
    remove(node) {
      if (!node.prev) {
        this.head = node.next;
      } else {
        node.prev.next = node.next;
      }
      if (!node.next) {
        this.tail = node.prev;
      } else {
        node.next.prev = node.prev;
      }
    }
    /**
     * Removes a chain of nodes whose head is `a` and whose tail is `b`,
     * it's assumed that `a` and `b` belong to this list and also that `a`
     * comes before `b` in the linked list
     *
     * @param {*} a
     * @param {*} b
     */
    removeChain(a, b) {
      if (!a.prev) {
        this.head = b.next;
      } else {
        a.prev.next = b.next;
      }
      if (!b.next) {
        this.tail = a.prev;
      } else {
        b.next.prev = a.prev;
      }
    }
    first() {
      return this.head;
    }
    isEmpty() {
      return !this.head;
    }
  };
  var VertexList_1 = VertexList$1;
  let Vertex$1 = class Vertex {
    constructor(point, index) {
      this.point = point;
      this.index = index;
      this.next = null;
      this.prev = null;
      this.face = null;
    }
  };
  var Vertex_1 = Vertex$1;
  const distance = distance_1$1;
  const squaredDistance = squaredDistance_1$1;
  let HalfEdge$1 = class HalfEdge {
    constructor(vertex, face) {
      this.vertex = vertex;
      this.face = face;
      this.next = null;
      this.prev = null;
      this.opposite = null;
    }
    head() {
      return this.vertex;
    }
    tail() {
      return this.prev ? this.prev.vertex : null;
    }
    length() {
      if (this.tail()) {
        return distance(
          this.tail().point,
          this.head().point
        );
      }
      return -1;
    }
    lengthSquared() {
      if (this.tail()) {
        return squaredDistance(
          this.tail().point,
          this.head().point
        );
      }
      return -1;
    }
    setOpposite(edge) {
      this.opposite = edge;
      edge.opposite = this;
    }
  };
  var HalfEdge_1 = HalfEdge$1;
  const add = add_1$1;
  const copy = copy_1$4;
  const cross = cross_1$1;
  const dot$1 = dot_1$2;
  const length = length_1$1;
  const normalize = normalize_1$1;
  const scale$1 = scale_1$3;
  const subtract = subtract_1$3;
  const HalfEdge = HalfEdge_1;
  const VISIBLE$1 = 0;
  const NON_CONVEX$1 = 1;
  const DELETED$1 = 2;
  let Face$1 = class Face2 {
    constructor() {
      this.normal = [];
      this.centroid = [];
      this.offset = 0;
      this.outside = null;
      this.mark = VISIBLE$1;
      this.edge = null;
      this.nVertices = 0;
    }
    getEdge(i) {
      if (typeof i !== "number") {
        throw Error("requires a number");
      }
      let it = this.edge;
      while (i > 0) {
        it = it.next;
        i -= 1;
      }
      while (i < 0) {
        it = it.prev;
        i += 1;
      }
      return it;
    }
    computeNormal() {
      const e0 = this.edge;
      const e1 = e0.next;
      let e2 = e1.next;
      const v22 = subtract([], e1.head().point, e0.head().point);
      const t = [];
      const v12 = [];
      this.nVertices = 2;
      this.normal = [0, 0, 0];
      while (e2 !== e0) {
        copy(v12, v22);
        subtract(v22, e2.head().point, e0.head().point);
        add(this.normal, this.normal, cross(t, v12, v22));
        e2 = e2.next;
        this.nVertices += 1;
      }
      this.area = length(this.normal);
      this.normal = scale$1(this.normal, this.normal, 1 / this.area);
    }
    computeNormalMinArea(minArea) {
      this.computeNormal();
      if (this.area < minArea) {
        let maxEdge;
        let maxSquaredLength = 0;
        let edge = this.edge;
        do {
          const lengthSquared = edge.lengthSquared();
          if (lengthSquared > maxSquaredLength) {
            maxEdge = edge;
            maxSquaredLength = lengthSquared;
          }
          edge = edge.next;
        } while (edge !== this.edge);
        const p1 = maxEdge.tail().point;
        const p2 = maxEdge.head().point;
        const maxVector = subtract([], p2, p1);
        const maxLength = Math.sqrt(maxSquaredLength);
        scale$1(maxVector, maxVector, 1 / maxLength);
        const maxProjection = dot$1(this.normal, maxVector);
        scale$1(maxVector, maxVector, -maxProjection);
        add(this.normal, this.normal, maxVector);
        normalize(this.normal, this.normal);
      }
    }
    computeCentroid() {
      this.centroid = [0, 0, 0];
      let edge = this.edge;
      do {
        add(this.centroid, this.centroid, edge.head().point);
        edge = edge.next;
      } while (edge !== this.edge);
      scale$1(this.centroid, this.centroid, 1 / this.nVertices);
    }
    computeNormalAndCentroid(minArea) {
      if (typeof minArea !== "undefined") {
        this.computeNormalMinArea(minArea);
      } else {
        this.computeNormal();
      }
      this.computeCentroid();
      this.offset = dot$1(this.normal, this.centroid);
    }
    distanceToPlane(point) {
      return dot$1(this.normal, point) - this.offset;
    }
    /**
     * @private
     *
     * Connects two edges assuming that prev.head().point === next.tail().point
     *
     * @param {HalfEdge} prev
     * @param {HalfEdge} next
     */
    connectHalfEdges(prev, next) {
      let discardedFace;
      if (prev.opposite.face === next.opposite.face) {
        const oppositeFace = next.opposite.face;
        let oppositeEdge;
        if (prev === this.edge) {
          this.edge = next;
        }
        if (oppositeFace.nVertices === 3) {
          oppositeEdge = next.opposite.prev.opposite;
          oppositeFace.mark = DELETED$1;
          discardedFace = oppositeFace;
        } else {
          oppositeEdge = next.opposite.next;
          if (oppositeFace.edge === oppositeEdge.prev) {
            oppositeFace.edge = oppositeEdge;
          }
          oppositeEdge.prev = oppositeEdge.prev.prev;
          oppositeEdge.prev.next = oppositeEdge;
        }
        next.prev = prev.prev;
        next.prev.next = next;
        next.setOpposite(oppositeEdge);
        oppositeFace.computeNormalAndCentroid();
      } else {
        prev.next = next;
        next.prev = prev;
      }
      return discardedFace;
    }
    mergeAdjacentFaces(adjacentEdge, discardedFaces) {
      const oppositeEdge = adjacentEdge.opposite;
      const oppositeFace = oppositeEdge.face;
      discardedFaces.push(oppositeFace);
      oppositeFace.mark = DELETED$1;
      let adjacentEdgePrev = adjacentEdge.prev;
      let adjacentEdgeNext = adjacentEdge.next;
      let oppositeEdgePrev = oppositeEdge.prev;
      let oppositeEdgeNext = oppositeEdge.next;
      while (adjacentEdgePrev.opposite.face === oppositeFace) {
        adjacentEdgePrev = adjacentEdgePrev.prev;
        oppositeEdgeNext = oppositeEdgeNext.next;
      }
      while (adjacentEdgeNext.opposite.face === oppositeFace) {
        adjacentEdgeNext = adjacentEdgeNext.next;
        oppositeEdgePrev = oppositeEdgePrev.prev;
      }
      let edge;
      for (edge = oppositeEdgeNext; edge !== oppositeEdgePrev.next; edge = edge.next) {
        edge.face = this;
      }
      this.edge = adjacentEdgeNext;
      let discardedFace;
      discardedFace = this.connectHalfEdges(oppositeEdgePrev, adjacentEdgeNext);
      if (discardedFace) {
        discardedFaces.push(discardedFace);
      }
      discardedFace = this.connectHalfEdges(adjacentEdgePrev, oppositeEdgeNext);
      if (discardedFace) {
        discardedFaces.push(discardedFace);
      }
      this.computeNormalAndCentroid();
      return discardedFaces;
    }
    collectIndices() {
      const indices = [];
      let edge = this.edge;
      do {
        indices.push(edge.head().index);
        edge = edge.next;
      } while (edge !== this.edge);
      return indices;
    }
    static createTriangle(v0, v12, v22, minArea = 0) {
      const face = new Face2();
      const e0 = new HalfEdge(v0, face);
      const e1 = new HalfEdge(v12, face);
      const e2 = new HalfEdge(v22, face);
      e0.next = e2.prev = e1;
      e1.next = e0.prev = e2;
      e2.next = e1.prev = e0;
      face.edge = e0;
      face.computeNormalAndCentroid(minArea);
      return face;
    }
  };
  var Face_1 = {
    VISIBLE: VISIBLE$1,
    NON_CONVEX: NON_CONVEX$1,
    DELETED: DELETED$1,
    Face: Face$1
  };
  const dot = dot_1$2;
  const pointLineDistance = pointLineDistance_1;
  const getPlaneNormal = getPlaneNormal$1;
  const VertexList = VertexList_1;
  const Vertex = Vertex_1;
  const { Face, VISIBLE, NON_CONVEX, DELETED } = Face_1;
  const MERGE_NON_CONVEX_WRT_LARGER_FACE = 1;
  const MERGE_NON_CONVEX = 2;
  let QuickHull$1 = class QuickHull {
    constructor(points) {
      if (!Array.isArray(points)) {
        throw TypeError("input is not a valid array");
      }
      if (points.length < 4) {
        throw Error("cannot build a simplex out of <4 points");
      }
      this.tolerance = -1;
      this.nFaces = 0;
      this.nPoints = points.length;
      this.faces = [];
      this.newFaces = [];
      this.claimed = new VertexList();
      this.unclaimed = new VertexList();
      this.vertices = [];
      for (let i = 0; i < points.length; i += 1) {
        this.vertices.push(new Vertex(points[i], i));
      }
      this.discardedFaces = [];
      this.vertexPointIndices = [];
    }
    addVertexToFace(vertex, face) {
      vertex.face = face;
      if (!face.outside) {
        this.claimed.add(vertex);
      } else {
        this.claimed.insertBefore(face.outside, vertex);
      }
      face.outside = vertex;
    }
    /**
     * Removes `vertex` for the `claimed` list of vertices, it also makes sure
     * that the link from `face` to the first vertex it sees in `claimed` is
     * linked correctly after the removal
     *
     * @param {Vertex} vertex
     * @param {Face} face
     */
    removeVertexFromFace(vertex, face) {
      if (vertex === face.outside) {
        if (vertex.next && vertex.next.face === face) {
          face.outside = vertex.next;
        } else {
          face.outside = null;
        }
      }
      this.claimed.remove(vertex);
    }
    /**
     * Removes all the visible vertices that `face` is able to see which are
     * stored in the `claimed` vertext list
     *
     * @param {Face} face
     * @return {Vertex|undefined} If face had visible vertices returns
     * `face.outside`, otherwise undefined
     */
    removeAllVerticesFromFace(face) {
      if (face.outside) {
        let end = face.outside;
        while (end.next && end.next.face === face) {
          end = end.next;
        }
        this.claimed.removeChain(face.outside, end);
        end.next = null;
        return face.outside;
      }
    }
    /**
     * Removes all the visible vertices that `face` is able to see, additionally
     * checking the following:
     *
     * If `absorbingFace` doesn't exist then all the removed vertices will be
     * added to the `unclaimed` vertex list
     *
     * If `absorbingFace` exists then this method will assign all the vertices of
     * `face` that can see `absorbingFace`, if a vertex cannot see `absorbingFace`
     * it's added to the `unclaimed` vertex list
     *
     * @param {Face} face
     * @param {Face} [absorbingFace]
     */
    deleteFaceVertices(face, absorbingFace) {
      const faceVertices = this.removeAllVerticesFromFace(face);
      if (faceVertices) {
        if (!absorbingFace) {
          this.unclaimed.addAll(faceVertices);
        } else {
          let nextVertex;
          for (let vertex = faceVertices; vertex; vertex = nextVertex) {
            nextVertex = vertex.next;
            const distance2 = absorbingFace.distanceToPlane(vertex.point);
            if (distance2 > this.tolerance) {
              this.addVertexToFace(vertex, absorbingFace);
            } else {
              this.unclaimed.add(vertex);
            }
          }
        }
      }
    }
    /**
     * Reassigns as many vertices as possible from the unclaimed list to the new
     * faces
     *
     * @param {Faces[]} newFaces
     */
    resolveUnclaimedPoints(newFaces) {
      let vertexNext = this.unclaimed.first();
      for (let vertex = vertexNext; vertex; vertex = vertexNext) {
        vertexNext = vertex.next;
        let maxDistance = this.tolerance;
        let maxFace;
        for (let i = 0; i < newFaces.length; i += 1) {
          const face = newFaces[i];
          if (face.mark === VISIBLE) {
            const dist = face.distanceToPlane(vertex.point);
            if (dist > maxDistance) {
              maxDistance = dist;
              maxFace = face;
            }
            if (maxDistance > 1e3 * this.tolerance) {
              break;
            }
          }
        }
        if (maxFace) {
          this.addVertexToFace(vertex, maxFace);
        }
      }
    }
    /**
     * Computes the extremes of a tetrahedron which will be the initial hull
     *
     * @return {number[]} The min/max vertices in the x,y,z directions
     */
    computeExtremes() {
      const min2 = [];
      const max2 = [];
      const minVertices = [];
      const maxVertices = [];
      let i, j;
      for (i = 0; i < 3; i += 1) {
        minVertices[i] = maxVertices[i] = this.vertices[0];
      }
      for (i = 0; i < 3; i += 1) {
        min2[i] = max2[i] = this.vertices[0].point[i];
      }
      for (i = 1; i < this.vertices.length; i += 1) {
        const vertex = this.vertices[i];
        const point = vertex.point;
        for (j = 0; j < 3; j += 1) {
          if (point[j] < min2[j]) {
            min2[j] = point[j];
            minVertices[j] = vertex;
          }
        }
        for (j = 0; j < 3; j += 1) {
          if (point[j] > max2[j]) {
            max2[j] = point[j];
            maxVertices[j] = vertex;
          }
        }
      }
      this.tolerance = 3 * Number.EPSILON * (Math.max(Math.abs(min2[0]), Math.abs(max2[0])) + Math.max(Math.abs(min2[1]), Math.abs(max2[1])) + Math.max(Math.abs(min2[2]), Math.abs(max2[2])));
      return [minVertices, maxVertices];
    }
    /**
     * Compues the initial tetrahedron assigning to its faces all the points that
     * are candidates to form part of the hull
     */
    createInitialSimplex() {
      const vertices = this.vertices;
      const [min2, max2] = this.computeExtremes();
      let v22, v3;
      let i, j;
      let maxDistance = 0;
      let indexMax = 0;
      for (i = 0; i < 3; i += 1) {
        const distance2 = max2[i].point[i] - min2[i].point[i];
        if (distance2 > maxDistance) {
          maxDistance = distance2;
          indexMax = i;
        }
      }
      const v0 = min2[indexMax];
      const v12 = max2[indexMax];
      maxDistance = 0;
      for (i = 0; i < this.vertices.length; i += 1) {
        const vertex = this.vertices[i];
        if (vertex !== v0 && vertex !== v12) {
          const distance2 = pointLineDistance(
            vertex.point,
            v0.point,
            v12.point
          );
          if (distance2 > maxDistance) {
            maxDistance = distance2;
            v22 = vertex;
          }
        }
      }
      const normal2 = getPlaneNormal([], v0.point, v12.point, v22.point);
      const distPO = dot(v0.point, normal2);
      maxDistance = -1;
      for (i = 0; i < this.vertices.length; i += 1) {
        const vertex = this.vertices[i];
        if (vertex !== v0 && vertex !== v12 && vertex !== v22) {
          const distance2 = Math.abs(dot(normal2, vertex.point) - distPO);
          if (distance2 > maxDistance) {
            maxDistance = distance2;
            v3 = vertex;
          }
        }
      }
      const faces = [];
      if (dot(v3.point, normal2) - distPO < 0) {
        faces.push(
          Face.createTriangle(v0, v12, v22),
          Face.createTriangle(v3, v12, v0),
          Face.createTriangle(v3, v22, v12),
          Face.createTriangle(v3, v0, v22)
        );
        for (i = 0; i < 3; i += 1) {
          const j2 = (i + 1) % 3;
          faces[i + 1].getEdge(2).setOpposite(faces[0].getEdge(j2));
          faces[i + 1].getEdge(1).setOpposite(faces[j2 + 1].getEdge(0));
        }
      } else {
        faces.push(
          Face.createTriangle(v0, v22, v12),
          Face.createTriangle(v3, v0, v12),
          Face.createTriangle(v3, v12, v22),
          Face.createTriangle(v3, v22, v0)
        );
        for (i = 0; i < 3; i += 1) {
          const j2 = (i + 1) % 3;
          faces[i + 1].getEdge(2).setOpposite(faces[0].getEdge((3 - i) % 3));
          faces[i + 1].getEdge(0).setOpposite(faces[j2 + 1].getEdge(1));
        }
      }
      for (i = 0; i < 4; i += 1) {
        this.faces.push(faces[i]);
      }
      for (i = 0; i < vertices.length; i += 1) {
        const vertex = vertices[i];
        if (vertex !== v0 && vertex !== v12 && vertex !== v22 && vertex !== v3) {
          maxDistance = this.tolerance;
          let maxFace;
          for (j = 0; j < 4; j += 1) {
            const distance2 = faces[j].distanceToPlane(vertex.point);
            if (distance2 > maxDistance) {
              maxDistance = distance2;
              maxFace = faces[j];
            }
          }
          if (maxFace) {
            this.addVertexToFace(vertex, maxFace);
          }
        }
      }
    }
    reindexFaceAndVertices() {
      const activeFaces = [];
      for (let i = 0; i < this.faces.length; i += 1) {
        const face = this.faces[i];
        if (face.mark === VISIBLE) {
          activeFaces.push(face);
        }
      }
      this.faces = activeFaces;
    }
    collectFaces(skipTriangulation) {
      const faceIndices = [];
      for (let i = 0; i < this.faces.length; i += 1) {
        if (this.faces[i].mark !== VISIBLE) {
          throw Error("attempt to include a destroyed face in the hull");
        }
        const indices = this.faces[i].collectIndices();
        if (skipTriangulation) {
          faceIndices.push(indices);
        } else {
          for (let j = 0; j < indices.length - 2; j += 1) {
            faceIndices.push(
              [indices[0], indices[j + 1], indices[j + 2]]
            );
          }
        }
      }
      return faceIndices;
    }
    /**
     * Finds the next vertex to make faces with the current hull
     *
     * - let `face` be the first face existing in the `claimed` vertex list
     *  - if `face` doesn't exist then return since there're no vertices left
     *  - otherwise for each `vertex` that face sees find the one furthest away
     *  from `face`
     *
     * @return {Vertex|undefined} Returns undefined when there're no more
     * visible vertices
     */
    nextVertexToAdd() {
      if (!this.claimed.isEmpty()) {
        let eyeVertex, vertex;
        let maxDistance = 0;
        const eyeFace = this.claimed.first().face;
        for (vertex = eyeFace.outside; vertex && vertex.face === eyeFace; vertex = vertex.next) {
          const distance2 = eyeFace.distanceToPlane(vertex.point);
          if (distance2 > maxDistance) {
            maxDistance = distance2;
            eyeVertex = vertex;
          }
        }
        return eyeVertex;
      }
    }
    /**
     * Computes a chain of half edges in ccw order called the `horizon`, for an
     * edge to be part of the horizon it must join a face that can see
     * `eyePoint` and a face that cannot see `eyePoint`
     *
     * @param {number[]} eyePoint - The coordinates of a point
     * @param {HalfEdge} crossEdge - The edge used to jump to the current `face`
     * @param {Face} face - The current face being tested
     * @param {HalfEdge[]} horizon - The edges that form part of the horizon in
     * ccw order
     */
    computeHorizon(eyePoint, crossEdge, face, horizon) {
      this.deleteFaceVertices(face);
      face.mark = DELETED;
      let edge;
      if (!crossEdge) {
        edge = crossEdge = face.getEdge(0);
      } else {
        edge = crossEdge.next;
      }
      do {
        const oppositeEdge = edge.opposite;
        const oppositeFace = oppositeEdge.face;
        if (oppositeFace.mark === VISIBLE) {
          if (oppositeFace.distanceToPlane(eyePoint) > this.tolerance) {
            this.computeHorizon(eyePoint, oppositeEdge, oppositeFace, horizon);
          } else {
            horizon.push(edge);
          }
        }
        edge = edge.next;
      } while (edge !== crossEdge);
    }
    /**
     * Creates a face with the points `eyeVertex.point`, `horizonEdge.tail` and
     * `horizonEdge.tail` in ccw order
     *
     * @param {Vertex} eyeVertex
     * @param {HalfEdge} horizonEdge
     * @return {HalfEdge} The half edge whose vertex is the eyeVertex
     */
    addAdjoiningFace(eyeVertex, horizonEdge) {
      const face = Face.createTriangle(
        eyeVertex,
        horizonEdge.tail(),
        horizonEdge.head()
      );
      this.faces.push(face);
      face.getEdge(-1).setOpposite(horizonEdge.opposite);
      return face.getEdge(0);
    }
    /**
     * Adds horizon.length faces to the hull, each face will be 'linked' with the
     * horizon opposite face and the face on the left/right
     *
     * @param {Vertex} eyeVertex
     * @param {HalfEdge[]} horizon - A chain of half edges in ccw order
     */
    addNewFaces(eyeVertex, horizon) {
      this.newFaces = [];
      let firstSideEdge, previousSideEdge;
      for (let i = 0; i < horizon.length; i += 1) {
        const horizonEdge = horizon[i];
        const sideEdge = this.addAdjoiningFace(eyeVertex, horizonEdge);
        if (!firstSideEdge) {
          firstSideEdge = sideEdge;
        } else {
          sideEdge.next.setOpposite(previousSideEdge);
        }
        this.newFaces.push(sideEdge.face);
        previousSideEdge = sideEdge;
      }
      firstSideEdge.next.setOpposite(previousSideEdge);
    }
    /**
     * Computes the distance from `edge` opposite face's centroid to
     * `edge.face`
     *
     * @param {HalfEdge} edge
     * @return {number}
     * - A positive number when the centroid of the opposite face is above the
     *   face i.e. when the faces are concave
     * - A negative number when the centroid of the opposite face is below the
     *   face i.e. when the faces are convex
     */
    oppositeFaceDistance(edge) {
      return edge.face.distanceToPlane(edge.opposite.face.centroid);
    }
    /**
     * Merges a face with none/any/all its neighbors according to the strategy
     * used
     *
     * if `mergeType` is MERGE_NON_CONVEX_WRT_LARGER_FACE then the merge will be
     * decided based on the face with the larger area, the centroid of the face
     * with the smaller area will be checked against the one with the larger area
     * to see if it's in the merge range [tolerance, -tolerance] i.e.
     *
     *    dot(centroid smaller face, larger face normal) - larger face offset > -tolerance
     *
     * Note that the first check (with +tolerance) was done on `computeHorizon`
     *
     * If the above is not true then the check is done with respect to the smaller
     * face i.e.
     *
     *    dot(centroid larger face, smaller face normal) - smaller face offset > -tolerance
     *
     * If true then it means that two faces are non convex (concave), even if the
     * dot(...) - offset value is > 0 (that's the point of doing the merge in the
     * first place)
     *
     * If two faces are concave then the check must also be done on the other face
     * but this is done in another merge pass, for this to happen the face is
     * marked in a temporal NON_CONVEX state
     *
     * if `mergeType` is MERGE_NON_CONVEX then two faces will be merged only if
     * they pass the following conditions
     *
     *    dot(centroid smaller face, larger face normal) - larger face offset > -tolerance
     *    dot(centroid larger face, smaller face normal) - smaller face offset > -tolerance
     *
     * @param {Face} face
     * @param {number} mergeType - Either MERGE_NON_CONVEX_WRT_LARGER_FACE or
     * MERGE_NON_CONVEX
     */
    doAdjacentMerge(face, mergeType) {
      let edge = face.edge;
      let convex = true;
      let it = 0;
      do {
        if (it >= face.nVertices) {
          throw Error("merge recursion limit exceeded");
        }
        const oppositeFace = edge.opposite.face;
        let merge = false;
        if (mergeType === MERGE_NON_CONVEX) {
          if (this.oppositeFaceDistance(edge) > -this.tolerance || this.oppositeFaceDistance(edge.opposite) > -this.tolerance) {
            merge = true;
          }
        } else {
          if (face.area > oppositeFace.area) {
            if (this.oppositeFaceDistance(edge) > -this.tolerance) {
              merge = true;
            } else if (this.oppositeFaceDistance(edge.opposite) > -this.tolerance) {
              convex = false;
            }
          } else {
            if (this.oppositeFaceDistance(edge.opposite) > -this.tolerance) {
              merge = true;
            } else if (this.oppositeFaceDistance(edge) > -this.tolerance) {
              convex = false;
            }
          }
        }
        if (merge) {
          const discardedFaces = face.mergeAdjacentFaces(edge, []);
          for (let i = 0; i < discardedFaces.length; i += 1) {
            this.deleteFaceVertices(discardedFaces[i], face);
          }
          return true;
        }
        edge = edge.next;
        it += 1;
      } while (edge !== face.edge);
      if (!convex) {
        face.mark = NON_CONVEX;
      }
      return false;
    }
    /**
     * Adds a vertex to the hull with the following algorithm
     *
     * - Compute the `horizon` which is a chain of half edges, for an edge to
     *   belong to this group it must be the edge connecting a face that can
     *   see `eyeVertex` and a face which cannot see `eyeVertex`
     * - All the faces that can see `eyeVertex` have its visible vertices removed
     *   from the claimed VertexList
     * - A new set of faces is created with each edge of the `horizon` and
     *   `eyeVertex`, each face is connected with the opposite horizon face and
     *   the face on the left/right
     * - The new faces are merged if possible with the opposite horizon face first
     *   and then the faces on the right/left
     * - The vertices removed from all the visible faces are assigned to the new
     *   faces if possible
     *
     * @param {Vertex} eyeVertex
     */
    addVertexToHull(eyeVertex) {
      const horizon = [];
      this.unclaimed.clear();
      this.removeVertexFromFace(eyeVertex, eyeVertex.face);
      this.computeHorizon(eyeVertex.point, null, eyeVertex.face, horizon);
      this.addNewFaces(eyeVertex, horizon);
      for (let i = 0; i < this.newFaces.length; i += 1) {
        const face = this.newFaces[i];
        if (face.mark === VISIBLE) {
          while (this.doAdjacentMerge(face, MERGE_NON_CONVEX_WRT_LARGER_FACE)) {
          }
        }
      }
      for (let i = 0; i < this.newFaces.length; i += 1) {
        const face = this.newFaces[i];
        if (face.mark === NON_CONVEX) {
          face.mark = VISIBLE;
          while (this.doAdjacentMerge(face, MERGE_NON_CONVEX)) {
          }
        }
      }
      this.resolveUnclaimedPoints(this.newFaces);
    }
    build() {
      let eyeVertex;
      this.createInitialSimplex();
      while (eyeVertex = this.nextVertexToAdd()) {
        this.addVertexToHull(eyeVertex);
      }
      this.reindexFaceAndVertices();
    }
  };
  var QuickHull_1 = QuickHull$1;
  const QuickHull = QuickHull_1;
  const runner = (points, options = {}) => {
    const instance = new QuickHull(points);
    instance.build();
    return instance.collectFaces(options.skipTriangulation);
  };
  var quickhull$1 = runner;
  const flatten$8 = flatten_1;
  const geom3$6 = geom3$K;
  const poly3$4 = poly3$A;
  const quickhull = quickhull$1;
  const toUniquePoints = toUniquePoints_1;
  const hullGeom3$1 = (...geometries2) => {
    geometries2 = flatten$8(geometries2);
    if (geometries2.length === 1)
      return geometries2[0];
    const unique = toUniquePoints(geometries2);
    const faces = quickhull(unique, { skipTriangulation: true });
    const polygons = faces.map((face) => {
      const vertices = face.map((index) => unique[index]);
      return poly3$4.create(vertices);
    });
    return geom3$6.create(polygons);
  };
  var hullGeom3_1 = hullGeom3$1;
  const flatten$7 = flatten_1;
  const areAllShapesTheSameType = areAllShapesTheSameType_1;
  const geom2$5 = geom2$K;
  const geom3$5 = geom3$K;
  const path2$5 = path2$u;
  const hullPath2 = hullPath2_1;
  const hullGeom2 = hullGeom2_1;
  const hullGeom3 = hullGeom3_1;
  const hull$1 = (...geometries2) => {
    geometries2 = flatten$7(geometries2);
    if (geometries2.length === 0)
      throw new Error("wrong number of arguments");
    if (!areAllShapesTheSameType(geometries2)) {
      throw new Error("only hulls of the same type are supported");
    }
    const geometry = geometries2[0];
    if (path2$5.isA(geometry))
      return hullPath2(geometries2);
    if (geom2$5.isA(geometry))
      return hullGeom2(geometries2);
    if (geom3$5.isA(geometry))
      return hullGeom3(geometries2);
    return geometry;
  };
  var hull_1 = hull$1;
  const flatten$6 = flatten_1;
  const union = union_1;
  const hull = hull_1;
  const hullChain = (...geometries2) => {
    geometries2 = flatten$6(geometries2);
    if (geometries2.length < 2)
      throw new Error("wrong number of arguments");
    const hulls2 = [];
    for (let i = 1; i < geometries2.length; i++) {
      hulls2.push(hull(geometries2[i - 1], geometries2[i]));
    }
    return union(hulls2);
  };
  var hullChain_1 = hullChain;
  var hulls = {
    hull: hull_1,
    hullChain: hullChain_1
  };
  const vec3$3 = vec3$Y;
  const poly3$3 = poly3$A;
  const isValidPoly3 = (epsilon, polygon2) => {
    const area2 = Math.abs(poly3$3.measureArea(polygon2));
    return Number.isFinite(area2) && area2 > epsilon;
  };
  const snapPolygons$2 = (epsilon, polygons) => {
    let newpolygons = polygons.map((polygon2) => {
      const snapvertices = polygon2.vertices.map((vertice) => vec3$3.snap(vec3$3.create(), vertice, epsilon));
      const newvertices = [];
      for (let i = 0; i < snapvertices.length; i++) {
        const j = (i + 1) % snapvertices.length;
        if (!vec3$3.equals(snapvertices[i], snapvertices[j]))
          newvertices.push(snapvertices[i]);
      }
      const newpolygon = poly3$3.create(newvertices);
      if (polygon2.color)
        newpolygon.color = polygon2.color;
      return newpolygon;
    });
    const epsilonArea = epsilon * epsilon * Math.sqrt(3) / 4;
    newpolygons = newpolygons.filter((polygon2) => isValidPoly3(epsilonArea, polygon2));
    return newpolygons;
  };
  var snapPolygons_1 = snapPolygons$2;
  const aboutEqualNormals = aboutEqualNormals_1;
  const vec3$2 = vec3$Y;
  const poly3$2 = poly3$A;
  const createEdges = (polygon2) => {
    const points = poly3$2.toPoints(polygon2);
    const edges = [];
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      const edge = {
        v1: points[i],
        v2: points[j]
      };
      edges.push(edge);
    }
    for (let i = 0; i < edges.length; i++) {
      const j = (i + 1) % points.length;
      edges[i].next = edges[j];
      edges[j].prev = edges[i];
    }
    return edges;
  };
  const insertEdge = (edges, edge) => {
    const key = `${edge.v1}:${edge.v2}`;
    edges.set(key, edge);
  };
  const deleteEdge = (edges, edge) => {
    const key = `${edge.v1}:${edge.v2}`;
    edges.delete(key);
  };
  const findOppositeEdge = (edges, edge) => {
    const key = `${edge.v2}:${edge.v1}`;
    return edges.get(key);
  };
  const calculateAnglesBetween = (current, opposite, normal2) => {
    let v0 = current.prev.v1;
    let v12 = current.prev.v2;
    let v22 = opposite.next.v2;
    const angle1 = calculateAngle(v0, v12, v22, normal2);
    v0 = opposite.prev.v1;
    v12 = opposite.prev.v2;
    v22 = current.next.v2;
    const angle2 = calculateAngle(v0, v12, v22, normal2);
    return [angle1, angle2];
  };
  const v1 = vec3$2.create();
  const v2 = vec3$2.create();
  const calculateAngle = (prevpoint, point, nextpoint, normal2) => {
    const d0 = vec3$2.subtract(v1, point, prevpoint);
    const d1 = vec3$2.subtract(v2, nextpoint, point);
    vec3$2.cross(d0, d0, d1);
    return vec3$2.dot(d0, normal2);
  };
  const createPolygonAnd = (edge) => {
    let polygon2;
    const points = [];
    while (edge.next) {
      const next = edge.next;
      points.push(edge.v1);
      edge.v1 = null;
      edge.v2 = null;
      edge.next = null;
      edge.prev = null;
      edge = next;
    }
    if (points.length > 0)
      polygon2 = poly3$2.create(points);
    return polygon2;
  };
  const mergeCoplanarPolygons = (sourcepolygons) => {
    if (sourcepolygons.length < 2)
      return sourcepolygons;
    const normal2 = sourcepolygons[0].plane;
    const polygons = sourcepolygons.slice();
    const edgeList = /* @__PURE__ */ new Map();
    while (polygons.length > 0) {
      const polygon2 = polygons.shift();
      const edges = createEdges(polygon2);
      for (let i = 0; i < edges.length; i++) {
        const current = edges[i];
        const opposite = findOppositeEdge(edgeList, current);
        if (opposite) {
          const angles = calculateAnglesBetween(current, opposite, normal2);
          if (angles[0] >= 0 && angles[1] >= 0) {
            const edge1 = opposite.next;
            const edge2 = current.next;
            current.prev.next = opposite.next;
            current.next.prev = opposite.prev;
            opposite.prev.next = current.next;
            opposite.next.prev = current.prev;
            current.v1 = null;
            current.v2 = null;
            current.next = null;
            current.prev = null;
            deleteEdge(edgeList, opposite);
            opposite.v1 = null;
            opposite.v2 = null;
            opposite.next = null;
            opposite.prev = null;
            const mergeEdges = (list, e1, e2) => {
              const newedge = {
                v1: e2.v1,
                v2: e1.v2,
                next: e1.next,
                prev: e2.prev
              };
              e2.prev.next = newedge;
              e1.next.prev = newedge;
              deleteEdge(list, e1);
              e1.v1 = null;
              e1.v2 = null;
              e1.next = null;
              e1.prev = null;
              deleteEdge(list, e2);
              e2.v1 = null;
              e2.v2 = null;
              e2.next = null;
              e2.prev = null;
            };
            if (angles[0] === 0) {
              mergeEdges(edgeList, edge1, edge1.prev);
            }
            if (angles[1] === 0) {
              mergeEdges(edgeList, edge2, edge2.prev);
            }
          }
        } else {
          if (current.next)
            insertEdge(edgeList, current);
        }
      }
    }
    const destpolygons = [];
    edgeList.forEach((edge) => {
      const polygon2 = createPolygonAnd(edge);
      if (polygon2)
        destpolygons.push(polygon2);
    });
    edgeList.clear();
    return destpolygons;
  };
  const coplanar = (plane1, plane2) => {
    if (Math.abs(plane1[3] - plane2[3]) < 15e-8) {
      return aboutEqualNormals(plane1, plane2);
    }
    return false;
  };
  const mergePolygons$1 = (epsilon, polygons) => {
    const polygonsPerPlane = [];
    polygons.forEach((polygon2) => {
      const mapping = polygonsPerPlane.find((element) => coplanar(element[0], poly3$2.plane(polygon2)));
      if (mapping) {
        const polygons2 = mapping[1];
        polygons2.push(polygon2);
      } else {
        polygonsPerPlane.push([poly3$2.plane(polygon2), [polygon2]]);
      }
    });
    let destpolygons = [];
    polygonsPerPlane.forEach((mapping) => {
      const sourcepolygons = mapping[1];
      const retesselayedpolygons = mergeCoplanarPolygons(sourcepolygons);
      destpolygons = destpolygons.concat(retesselayedpolygons);
    });
    return destpolygons;
  };
  var mergePolygons_1 = mergePolygons$1;
  const constants = constants$1;
  const vec3$1 = vec3$Y;
  const poly3$1 = poly3$A;
  const getTag = (vertex) => `${vertex}`;
  const addSide = (sidemap, vertextag2sidestart, vertextag2sideend, vertex0, vertex1, polygonindex) => {
    const starttag = getTag(vertex0);
    const endtag = getTag(vertex1);
    const newsidetag = `${starttag}/${endtag}`;
    const reversesidetag = `${endtag}/${starttag}`;
    if (sidemap.has(reversesidetag)) {
      deleteSide(sidemap, vertextag2sidestart, vertextag2sideend, vertex1, vertex0, null);
      return null;
    }
    const newsideobj = {
      vertex0,
      vertex1,
      polygonindex
    };
    if (!sidemap.has(newsidetag)) {
      sidemap.set(newsidetag, [newsideobj]);
    } else {
      sidemap.get(newsidetag).push(newsideobj);
    }
    if (vertextag2sidestart.has(starttag)) {
      vertextag2sidestart.get(starttag).push(newsidetag);
    } else {
      vertextag2sidestart.set(starttag, [newsidetag]);
    }
    if (vertextag2sideend.has(endtag)) {
      vertextag2sideend.get(endtag).push(newsidetag);
    } else {
      vertextag2sideend.set(endtag, [newsidetag]);
    }
    return newsidetag;
  };
  const deleteSide = (sidemap, vertextag2sidestart, vertextag2sideend, vertex0, vertex1, polygonindex) => {
    const starttag = getTag(vertex0);
    const endtag = getTag(vertex1);
    const sidetag = `${starttag}/${endtag}`;
    let idx = -1;
    const sideobjs = sidemap.get(sidetag);
    for (let i = 0; i < sideobjs.length; i++) {
      const sideobj = sideobjs[i];
      let sidetag2 = getTag(sideobj.vertex0);
      if (sidetag2 !== starttag)
        continue;
      sidetag2 = getTag(sideobj.vertex1);
      if (sidetag2 !== endtag)
        continue;
      if (polygonindex !== null) {
        if (sideobj.polygonindex !== polygonindex)
          continue;
      }
      idx = i;
      break;
    }
    sideobjs.splice(idx, 1);
    if (sideobjs.length === 0) {
      sidemap.delete(sidetag);
    }
    idx = vertextag2sidestart.get(starttag).indexOf(sidetag);
    vertextag2sidestart.get(starttag).splice(idx, 1);
    if (vertextag2sidestart.get(starttag).length === 0) {
      vertextag2sidestart.delete(starttag);
    }
    idx = vertextag2sideend.get(endtag).indexOf(sidetag);
    vertextag2sideend.get(endtag).splice(idx, 1);
    if (vertextag2sideend.get(endtag).length === 0) {
      vertextag2sideend.delete(endtag);
    }
  };
  const insertTjunctions$1 = (polygons) => {
    const sidemap = /* @__PURE__ */ new Map();
    for (let polygonindex = 0; polygonindex < polygons.length; polygonindex++) {
      const polygon2 = polygons[polygonindex];
      const numvertices = polygon2.vertices.length;
      if (numvertices >= 3) {
        let vertex = polygon2.vertices[0];
        let vertextag = getTag(vertex);
        for (let vertexindex = 0; vertexindex < numvertices; vertexindex++) {
          let nextvertexindex = vertexindex + 1;
          if (nextvertexindex === numvertices)
            nextvertexindex = 0;
          const nextvertex = polygon2.vertices[nextvertexindex];
          const nextvertextag = getTag(nextvertex);
          const sidetag = `${vertextag}/${nextvertextag}`;
          const reversesidetag = `${nextvertextag}/${vertextag}`;
          if (sidemap.has(reversesidetag)) {
            const ar = sidemap.get(reversesidetag);
            ar.splice(-1, 1);
            if (ar.length === 0) {
              sidemap.delete(reversesidetag);
            }
          } else {
            const sideobj = {
              vertex0: vertex,
              vertex1: nextvertex,
              polygonindex
            };
            if (!sidemap.has(sidetag)) {
              sidemap.set(sidetag, [sideobj]);
            } else {
              sidemap.get(sidetag).push(sideobj);
            }
          }
          vertex = nextvertex;
          vertextag = nextvertextag;
        }
      } else {
        console.warn("warning: invalid polygon found during insertTjunctions");
      }
    }
    if (sidemap.size > 0) {
      const vertextag2sidestart = /* @__PURE__ */ new Map();
      const vertextag2sideend = /* @__PURE__ */ new Map();
      const sidesToCheck = /* @__PURE__ */ new Map();
      for (const [sidetag, sideobjs] of sidemap) {
        sidesToCheck.set(sidetag, true);
        sideobjs.forEach((sideobj) => {
          const starttag = getTag(sideobj.vertex0);
          const endtag = getTag(sideobj.vertex1);
          if (vertextag2sidestart.has(starttag)) {
            vertextag2sidestart.get(starttag).push(sidetag);
          } else {
            vertextag2sidestart.set(starttag, [sidetag]);
          }
          if (vertextag2sideend.has(endtag)) {
            vertextag2sideend.get(endtag).push(sidetag);
          } else {
            vertextag2sideend.set(endtag, [sidetag]);
          }
        });
      }
      const newpolygons = polygons.slice(0);
      while (true) {
        if (sidemap.size === 0)
          break;
        for (const sidetag of sidemap.keys()) {
          sidesToCheck.set(sidetag, true);
        }
        let donesomething = false;
        while (true) {
          const sidetags = Array.from(sidesToCheck.keys());
          if (sidetags.length === 0)
            break;
          const sidetagtocheck = sidetags[0];
          let donewithside = true;
          if (sidemap.has(sidetagtocheck)) {
            const sideobjs = sidemap.get(sidetagtocheck);
            const sideobj = sideobjs[0];
            for (let directionindex = 0; directionindex < 2; directionindex++) {
              const startvertex = directionindex === 0 ? sideobj.vertex0 : sideobj.vertex1;
              const endvertex = directionindex === 0 ? sideobj.vertex1 : sideobj.vertex0;
              const startvertextag = getTag(startvertex);
              const endvertextag = getTag(endvertex);
              let matchingsides = [];
              if (directionindex === 0) {
                if (vertextag2sideend.has(startvertextag)) {
                  matchingsides = vertextag2sideend.get(startvertextag);
                }
              } else {
                if (vertextag2sidestart.has(startvertextag)) {
                  matchingsides = vertextag2sidestart.get(startvertextag);
                }
              }
              for (let matchingsideindex = 0; matchingsideindex < matchingsides.length; matchingsideindex++) {
                const matchingsidetag = matchingsides[matchingsideindex];
                const matchingside = sidemap.get(matchingsidetag)[0];
                const matchingsidestartvertex = directionindex === 0 ? matchingside.vertex0 : matchingside.vertex1;
                directionindex === 0 ? matchingside.vertex1 : matchingside.vertex0;
                const matchingsidestartvertextag = getTag(matchingsidestartvertex);
                if (matchingsidestartvertextag === endvertextag) {
                  deleteSide(sidemap, vertextag2sidestart, vertextag2sideend, startvertex, endvertex, null);
                  deleteSide(sidemap, vertextag2sidestart, vertextag2sideend, endvertex, startvertex, null);
                  donewithside = false;
                  directionindex = 2;
                  donesomething = true;
                  break;
                } else {
                  const startpos = startvertex;
                  const endpos = endvertex;
                  const checkpos = matchingsidestartvertex;
                  const direction2 = vec3$1.subtract(vec3$1.create(), checkpos, startpos);
                  const t = vec3$1.dot(vec3$1.subtract(vec3$1.create(), endpos, startpos), direction2) / vec3$1.dot(direction2, direction2);
                  if (t > 0 && t < 1) {
                    const closestpoint = vec3$1.scale(vec3$1.create(), direction2, t);
                    vec3$1.add(closestpoint, closestpoint, startpos);
                    const distancesquared = vec3$1.squaredDistance(closestpoint, endpos);
                    if (distancesquared < constants.EPS * constants.EPS) {
                      const polygonindex = matchingside.polygonindex;
                      const polygon2 = newpolygons[polygonindex];
                      const insertionvertextag = getTag(matchingside.vertex1);
                      let insertionvertextagindex = -1;
                      for (let i = 0; i < polygon2.vertices.length; i++) {
                        if (getTag(polygon2.vertices[i]) === insertionvertextag) {
                          insertionvertextagindex = i;
                          break;
                        }
                      }
                      const newvertices = polygon2.vertices.slice(0);
                      newvertices.splice(insertionvertextagindex, 0, endvertex);
                      const newpolygon = poly3$1.create(newvertices);
                      newpolygons[polygonindex] = newpolygon;
                      deleteSide(sidemap, vertextag2sidestart, vertextag2sideend, matchingside.vertex0, matchingside.vertex1, polygonindex);
                      const newsidetag1 = addSide(sidemap, vertextag2sidestart, vertextag2sideend, matchingside.vertex0, endvertex, polygonindex);
                      const newsidetag2 = addSide(sidemap, vertextag2sidestart, vertextag2sideend, endvertex, matchingside.vertex1, polygonindex);
                      if (newsidetag1 !== null)
                        sidesToCheck.set(newsidetag1, true);
                      if (newsidetag2 !== null)
                        sidesToCheck.set(newsidetag2, true);
                      donewithside = false;
                      directionindex = 2;
                      donesomething = true;
                      break;
                    }
                  }
                }
              }
            }
          }
          if (donewithside) {
            sidesToCheck.delete(sidetagtocheck);
          }
        }
        if (!donesomething)
          break;
      }
      polygons = newpolygons;
    }
    sidemap.clear();
    return polygons;
  };
  var insertTjunctions_1 = insertTjunctions$1;
  const vec3 = vec3$Y;
  const poly3 = poly3$A;
  const triangulatePolygon = (epsilon, polygon2, triangles) => {
    const nv = polygon2.vertices.length;
    if (nv > 3) {
      if (nv > 4) {
        const midpoint = [0, 0, 0];
        polygon2.vertices.forEach((vertice) => vec3.add(midpoint, midpoint, vertice));
        vec3.snap(midpoint, vec3.divide(midpoint, midpoint, [nv, nv, nv]), epsilon);
        for (let i = 0; i < nv; i++) {
          const poly = poly3.create([midpoint, polygon2.vertices[i], polygon2.vertices[(i + 1) % nv]]);
          if (polygon2.color)
            poly.color = polygon2.color;
          triangles.push(poly);
        }
        return;
      }
      const poly0 = poly3.create([polygon2.vertices[0], polygon2.vertices[1], polygon2.vertices[2]]);
      const poly1 = poly3.create([polygon2.vertices[0], polygon2.vertices[2], polygon2.vertices[3]]);
      if (polygon2.color) {
        poly0.color = polygon2.color;
        poly1.color = polygon2.color;
      }
      triangles.push(poly0, poly1);
      return;
    }
    triangles.push(polygon2);
  };
  const triangulatePolygons$1 = (epsilon, polygons) => {
    const triangles = [];
    polygons.forEach((polygon2) => {
      triangulatePolygon(epsilon, polygon2, triangles);
    });
    return triangles;
  };
  var triangulatePolygons_1 = triangulatePolygons$1;
  const flatten$5 = flatten_1;
  const measureEpsilon$1 = measureEpsilon_1;
  const geom2$4 = geom2$K;
  const geom3$4 = geom3$K;
  const path2$4 = path2$u;
  const snapPolygons$1 = snapPolygons_1;
  const mergePolygons = mergePolygons_1;
  const insertTjunctions = insertTjunctions_1;
  const triangulatePolygons = triangulatePolygons_1;
  const generalizePath2 = (options, geometry) => geometry;
  const generalizeGeom2 = (options, geometry) => geometry;
  const generalizeGeom3 = (options, geometry) => {
    const defaults = {
      snap: false,
      simplify: false,
      triangulate: false
    };
    const { snap: snap2, simplify, triangulate: triangulate2 } = Object.assign({}, defaults, options);
    const epsilon = measureEpsilon$1(geometry);
    let polygons = geom3$4.toPolygons(geometry);
    if (snap2) {
      polygons = snapPolygons$1(epsilon, polygons);
    }
    if (simplify) {
      polygons = mergePolygons(epsilon, polygons);
    }
    if (triangulate2) {
      polygons = insertTjunctions(polygons);
      polygons = triangulatePolygons(epsilon, polygons);
    }
    const clone2 = Object.assign({}, geometry);
    clone2.polygons = polygons;
    return clone2;
  };
  const generalize = (options, ...geometries2) => {
    geometries2 = flatten$5(geometries2);
    if (geometries2.length === 0)
      throw new Error("wrong number of arguments");
    const results = geometries2.map((geometry) => {
      if (path2$4.isA(geometry))
        return generalizePath2(options, geometry);
      if (geom2$4.isA(geometry))
        return generalizeGeom2(options, geometry);
      if (geom3$4.isA(geometry))
        return generalizeGeom3(options, geometry);
      throw new Error("invalid geometry");
    });
    return results.length === 1 ? results[0] : results;
  };
  var generalize_1 = generalize;
  const flatten$4 = flatten_1;
  const vec2 = vec2$E;
  const geom2$3 = geom2$K;
  const geom3$3 = geom3$K;
  const path2$3 = path2$u;
  const measureEpsilon = measureEpsilon_1;
  const snapPolygons = snapPolygons_1;
  const snapPath2 = (geometry) => {
    const epsilon = measureEpsilon(geometry);
    const points = path2$3.toPoints(geometry);
    const newpoints = points.map((point) => vec2.snap(vec2.create(), point, epsilon));
    return path2$3.create(newpoints);
  };
  const snapGeom2 = (geometry) => {
    const epsilon = measureEpsilon(geometry);
    const sides = geom2$3.toSides(geometry);
    let newsides = sides.map((side) => [vec2.snap(vec2.create(), side[0], epsilon), vec2.snap(vec2.create(), side[1], epsilon)]);
    newsides = newsides.filter((side) => !vec2.equals(side[0], side[1]));
    return geom2$3.create(newsides);
  };
  const snapGeom3 = (geometry) => {
    const epsilon = measureEpsilon(geometry);
    const polygons = geom3$3.toPolygons(geometry);
    const newpolygons = snapPolygons(epsilon, polygons);
    return geom3$3.create(newpolygons);
  };
  const snap = (...geometries2) => {
    geometries2 = flatten$4(geometries2);
    if (geometries2.length === 0)
      throw new Error("wrong number of arguments");
    const results = geometries2.map((geometry) => {
      if (path2$3.isA(geometry))
        return snapPath2(geometry);
      if (geom2$3.isA(geometry))
        return snapGeom2(geometry);
      if (geom3$3.isA(geometry))
        return snapGeom3(geometry);
      return geometry;
    });
    return results.length === 1 ? results[0] : results;
  };
  var snap_1 = snap;
  var modifiers = {
    generalize: generalize_1,
    snap: snap_1
  };
  const padArrayToLength$1 = (anArray, padding, targetLength) => {
    anArray = anArray.slice();
    while (anArray.length < targetLength) {
      anArray.push(padding);
    }
    return anArray;
  };
  var padArrayToLength_1 = padArrayToLength$1;
  const flatten$3 = flatten_1;
  const padArrayToLength = padArrayToLength_1;
  const measureAggregateBoundingBox = measureAggregateBoundingBox_1;
  const { translate: translate$1 } = translate_1;
  const validateOptions = (options) => {
    if (!Array.isArray(options.modes) || options.modes.length > 3)
      throw new Error("align(): modes must be an array of length <= 3");
    options.modes = padArrayToLength(options.modes, "none", 3);
    if (options.modes.filter((mode) => ["center", "max", "min", "none"].includes(mode)).length !== 3)
      throw new Error('align(): all modes must be one of "center", "max" or "min"');
    if (!Array.isArray(options.relativeTo) || options.relativeTo.length > 3)
      throw new Error("align(): relativeTo must be an array of length <= 3");
    options.relativeTo = padArrayToLength(options.relativeTo, 0, 3);
    if (options.relativeTo.filter((alignVal) => Number.isFinite(alignVal) || alignVal == null).length !== 3)
      throw new Error("align(): all relativeTo values must be a number, or null.");
    if (typeof options.grouped !== "boolean")
      throw new Error("align(): grouped must be a boolean value.");
    return options;
  };
  const populateRelativeToFromBounds = (relativeTo, modes, bounds) => {
    for (let i = 0; i < 3; i++) {
      if (relativeTo[i] == null) {
        if (modes[i] === "center") {
          relativeTo[i] = (bounds[0][i] + bounds[1][i]) / 2;
        } else if (modes[i] === "max") {
          relativeTo[i] = bounds[1][i];
        } else if (modes[i] === "min") {
          relativeTo[i] = bounds[0][i];
        }
      }
    }
    return relativeTo;
  };
  const alignGeometries = (geometry, modes, relativeTo) => {
    const bounds = measureAggregateBoundingBox(geometry);
    const translation = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
      if (modes[i] === "center") {
        translation[i] = relativeTo[i] - (bounds[0][i] + bounds[1][i]) / 2;
      } else if (modes[i] === "max") {
        translation[i] = relativeTo[i] - bounds[1][i];
      } else if (modes[i] === "min") {
        translation[i] = relativeTo[i] - bounds[0][i];
      }
    }
    return translate$1(translation, geometry);
  };
  const align = (options, ...geometries2) => {
    const defaults = {
      modes: ["center", "center", "min"],
      relativeTo: [0, 0, 0],
      grouped: false
    };
    options = Object.assign({}, defaults, options);
    options = validateOptions(options);
    let { modes, relativeTo, grouped } = options;
    geometries2 = flatten$3(geometries2);
    if (geometries2.length === 0)
      throw new Error("align(): No geometries were provided to act upon");
    if (relativeTo.filter((val) => val == null).length) {
      const bounds = measureAggregateBoundingBox(geometries2);
      relativeTo = populateRelativeToFromBounds(relativeTo, modes, bounds);
    }
    if (grouped) {
      geometries2 = alignGeometries(geometries2, modes, relativeTo);
    } else {
      geometries2 = geometries2.map((geometry) => alignGeometries(geometry, modes, relativeTo));
    }
    return geometries2.length === 1 ? geometries2[0] : geometries2;
  };
  var align_1 = align;
  const flatten$2 = flatten_1;
  const geom2$2 = geom2$K;
  const geom3$2 = geom3$K;
  const path2$2 = path2$u;
  const measureBoundingBox = measureBoundingBox_1;
  const { translate } = translate_1;
  const centerGeometry = (options, object) => {
    const defaults = {
      axes: [true, true, true],
      relativeTo: [0, 0, 0]
    };
    const { axes, relativeTo } = Object.assign({}, defaults, options);
    const bounds = measureBoundingBox(object);
    const offset2 = [0, 0, 0];
    if (axes[0])
      offset2[0] = relativeTo[0] - (bounds[0][0] + (bounds[1][0] - bounds[0][0]) / 2);
    if (axes[1])
      offset2[1] = relativeTo[1] - (bounds[0][1] + (bounds[1][1] - bounds[0][1]) / 2);
    if (axes[2])
      offset2[2] = relativeTo[2] - (bounds[0][2] + (bounds[1][2] - bounds[0][2]) / 2);
    return translate(offset2, object);
  };
  const center = (options, ...objects) => {
    const defaults = {
      axes: [true, true, true],
      relativeTo: [0, 0, 0]
      // TODO: Add additional 'methods' of centering: midpoint, centroid
    };
    const { axes, relativeTo } = Object.assign({}, defaults, options);
    objects = flatten$2(objects);
    if (objects.length === 0)
      throw new Error("wrong number of arguments");
    if (relativeTo.length !== 3)
      throw new Error("relativeTo must be an array of length 3");
    options = { axes, relativeTo };
    const results = objects.map((object) => {
      if (path2$2.isA(object))
        return centerGeometry(options, object);
      if (geom2$2.isA(object))
        return centerGeometry(options, object);
      if (geom3$2.isA(object))
        return centerGeometry(options, object);
      return object;
    });
    return results.length === 1 ? results[0] : results;
  };
  const centerX = (...objects) => center({ axes: [true, false, false] }, objects);
  const centerY = (...objects) => center({ axes: [false, true, false] }, objects);
  const centerZ = (...objects) => center({ axes: [false, false, true] }, objects);
  var center_1 = {
    center,
    centerX,
    centerY,
    centerZ
  };
  const flatten$1 = flatten_1;
  const mat4 = mat4$r;
  const geom2$1 = geom2$K;
  const geom3$1 = geom3$K;
  const path2$1 = path2$u;
  const scale = (factors, ...objects) => {
    if (!Array.isArray(factors))
      throw new Error("factors must be an array");
    objects = flatten$1(objects);
    if (objects.length === 0)
      throw new Error("wrong number of arguments");
    factors = factors.slice();
    while (factors.length < 3)
      factors.push(1);
    if (factors[0] <= 0 || factors[1] <= 0 || factors[2] <= 0)
      throw new Error("factors must be positive");
    const matrix = mat4.fromScaling(mat4.create(), factors);
    const results = objects.map((object) => {
      if (path2$1.isA(object))
        return path2$1.transform(matrix, object);
      if (geom2$1.isA(object))
        return geom2$1.transform(matrix, object);
      if (geom3$1.isA(object))
        return geom3$1.transform(matrix, object);
      return object;
    });
    return results.length === 1 ? results[0] : results;
  };
  const scaleX = (factor, ...objects) => scale([factor, 1, 1], objects);
  const scaleY = (factor, ...objects) => scale([1, factor, 1], objects);
  const scaleZ = (factor, ...objects) => scale([1, 1, factor], objects);
  var scale_1 = {
    scale,
    scaleX,
    scaleY,
    scaleZ
  };
  const flatten = flatten_1;
  const geom2 = geom2$K;
  const geom3 = geom3$K;
  const path2 = path2$u;
  const transform = (matrix, ...objects) => {
    objects = flatten(objects);
    if (objects.length === 0)
      throw new Error("wrong number of arguments");
    const results = objects.map((object) => {
      if (path2.isA(object))
        return path2.transform(matrix, object);
      if (geom2.isA(object))
        return geom2.transform(matrix, object);
      if (geom3.isA(object))
        return geom3.transform(matrix, object);
      return object;
    });
    return results.length === 1 ? results[0] : results;
  };
  var transform_1 = transform;
  var transforms = {
    align: align_1,
    center: center_1.center,
    centerX: center_1.centerX,
    centerY: center_1.centerY,
    centerZ: center_1.centerZ,
    mirror: mirror_1.mirror,
    mirrorX: mirror_1.mirrorX,
    mirrorY: mirror_1.mirrorY,
    mirrorZ: mirror_1.mirrorZ,
    rotate: rotate_1.rotate,
    rotateX: rotate_1.rotateX,
    rotateY: rotate_1.rotateY,
    rotateZ: rotate_1.rotateZ,
    scale: scale_1.scale,
    scaleX: scale_1.scaleX,
    scaleY: scale_1.scaleY,
    scaleZ: scale_1.scaleZ,
    transform: transform_1,
    translate: translate_1.translate,
    translateX: translate_1.translateX,
    translateY: translate_1.translateY,
    translateZ: translate_1.translateZ
  };
  var src = {
    colors,
    curves,
    geometries,
    maths,
    measurements,
    primitives,
    text,
    utils,
    booleans,
    expansions,
    extrusions,
    hulls,
    modifiers,
    transforms
  };
  const CORNER_SEGMENTS = 16;
  function clampCornerRadius(sizeX, sizeY, radius) {
    const maxR = Math.max(0, Math.min(sizeX, sizeY) / 2 - 1e-3);
    return Math.min(radius, maxR);
  }
  function polygonArea(points) {
    let area2 = 0;
    for (let i = 0; i < points.length; i++) {
      const [x1, y1] = points[i];
      const [x2, y2] = points[(i + 1) % points.length];
      area2 += x1 * y2 - x2 * y1;
    }
    return area2 / 2;
  }
  function shapeToGeom2(shape) {
    switch (shape.kind) {
      case "circle":
        return src.primitives.circle({
          center: [shape.x, shape.y],
          radius: shape.radius,
          segments: 20
        });
      case "line":
        return shape;
      case "rectangle": {
        const sx = shape.sizeX;
        const sy = shape.sizeY;
        const radius = clampCornerRadius(sx, sy, shape.cornerRadius || 0);
        let rect = radius > 0 ? src.primitives.roundedRectangle({
          center: [shape.x, shape.y],
          size: [sx, sy],
          roundRadius: radius,
          segments: CORNER_SEGMENTS
        }) : src.primitives.rectangle({
          center: [shape.x, shape.y],
          size: [sx, sy]
        });
        for (let side of rect.sides) {
          for (let vert of side) {
            src.maths.vec2.rotate(
              vert,
              vert,
              [shape.x, shape.y],
              src.utils.degToRad(shape.rotation)
            );
          }
        }
        return rect;
      }
      case "photoshape":
        if (Array.isArray(shape.polygon) && Array.isArray(shape.polygon[0])) {
          let polygons = shape.polygon.map((contour, index) => {
            if (!Array.isArray(contour)) {
              console.error(
                `Contour at index ${index} is not an array:`,
                contour
              );
              return null;
            }
            let polygon2 = contour.slice().reverse().map(([x, y]) => [x, y]).map(
              (v) => src.maths.vec2.rotate(
                v,
                v,
                [0, 0],
                src.utils.degToRad(shape.rotation)
              )
            ).map(([x, y]) => [x + shape.x, y + shape.y]);
            return src.geometries.geom2.fromPoints(polygon2);
          }).filter(Boolean);
          return polygons;
        } else {
          console.error(
            "Expected an array of arrays for shape.polygon, but got:",
            shape.polygon
          );
          return [];
        }
      case "polygon": {
        if (!Array.isArray(shape.points) || shape.points.length < 3)
          return null;
        const basePts = shape.points.map(([x, y]) => [x, y]);
        if (Math.abs(polygonArea(basePts)) < 1e-6)
          return null;
        const tryBuild = (pts) => {
          let poly = pts.map(([x, y]) => [x, y]).map(
            (v) => src.maths.vec2.rotate(
              v,
              v,
              [0, 0],
              src.utils.degToRad(shape.rotation)
            )
          ).map(([x, y]) => [x + shape.x, y + shape.y]);
          return src.geometries.geom2.fromPoints(poly);
        };
        try {
          return tryBuild(basePts);
        } catch {
          try {
            return tryBuild(basePts.slice().reverse());
          } catch {
            return null;
          }
        }
      }
    }
  }
  function shapeToGeom3(shape) {
    let geom22 = shapeToGeom2(shape);
    if (!geom22)
      return null;
    if (Array.isArray(geom22)) {
      geom22 = geom22.filter((g) => {
        var _a;
        return (_a = g == null ? void 0 : g.sides) == null ? void 0 : _a.length;
      });
      if (!geom22.length)
        return null;
    } else if (!geom22.sides || !geom22.sides.length) {
      return null;
    }
    try {
      return src.extrusions.extrudeLinear(
        {
          height: shape.sizeZ
        },
        geom22
      );
    } catch {
      return null;
    }
  }
  onmessage = (e) => {
    const { id, foam, shapesArray } = e.data;
    const foamGeom3 = shapeToGeom3(foam);
    if (!foamGeom3) {
      postMessage({ id, geom: null });
      return;
    }
    const cutters = [];
    for (const shape of shapesArray) {
      if ((shape == null ? void 0 : shape.source) === "photoshape" && (shape == null ? void 0 : shape._draft))
        continue;
      let geom32 = shapeToGeom3(shape);
      if (!geom32)
        continue;
      geom32 = src.transforms.translateZ(foam.sizeZ - shape.sizeZ, geom32);
      cutters.push(geom32);
    }
    if (cutters.length === 0) {
      postMessage({ id, geom: foamGeom3 });
      return;
    }
    try {
      const result = src.booleans.subtract(foamGeom3, ...cutters);
      postMessage({ id, geom: result || foamGeom3 });
    } catch (err) {
      console.error("CSG subtract failed:", err);
      postMessage({ id, geom: foamGeom3 });
    }
  };
})();
//# sourceMappingURL=csg-2a71be5e.js.map
