/**
 * Original Repo: https://github.com/jwagner/simplex-noise.js
 *
 * A fast javascript implementation of simplex noise by Jonas Wagner
 */

// Improved readability with named constants
const PERMUTATION_TABLE_SIZE = 512;
const SIMPLEX_CORNER_SKEW_FACTOR = 1.0 / 3.0; // Skew factor for simplex corners in 3D
const SIMPLEX_UNSKEW_FACTOR = 1.0 / 6.0; // Unskew factor to convert back to (x,y,z) space

/**
 * Calculates the floor of a number more efficiently by using bitwise OR to truncate decimal places.
 * This optimization assumes the input is a 32-bit floating-point number and leverages the fact that
 * bitwise operations in JavaScript implicitly convert operands to 32-bit integers.
 *
 * @param x The number to floor.
 * @returns The floored integer part of x.
 */
const fastFloor = (x: number): number => Math.floor(x) | 0;

// Gradient for 3D simplex noise
const grad3 = new Float64Array([
  1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0,
  -1, 0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1,
]);

/**
 * A random() function, must return a number in the interval [0,1), just like Math.random().
 */
export type RandomFn = () => number;

/**
 * Samples the noise field in two dimensions
 *
 * Coordinates should be finite, bigger than -2^31 and smaller than 2^31.
 * @param x
 * @param y
 * @returns a number in the interval [-1, 1]
 */
export type NoiseFunction2D = (x: number, y: number) => number;

/**
 * Samples the noise field in three dimensions
 *
 * Coordinates should be finite, bigger than -2^31 and smaller than 2^31.
 * @param x
 * @param y
 * @param z
 * @returns a number in the interval [-1, 1]
 */
export type NoiseFunction3D = (x: number, y: number, z: number) => number;

/**
 * Creates a 3D noise function
 * @param random the random function that will be used to build the permutation table
 * @returns {NoiseFunction3D}
 */
export function createNoise3D(random: RandomFn = Math.random): NoiseFunction3D {
  const perm = buildPermutationTable(random);
  // precalculating these seems to yield a speedup of over 15%
  const permGrad3x = new Float64Array(perm).map((v) => grad3[(v % 12) * 3]);
  const permGrad3y = new Float64Array(perm).map((v) => grad3[(v % 12) * 3 + 1]);
  const permGrad3z = new Float64Array(perm).map((v) => grad3[(v % 12) * 3 + 2]);

  return function noise3D(x: number, y: number, z: number): number {
    let n0, n1, n2, n3; // Noise contributions from the four corners
    // Skew the input space to determine which simplex cell we're in
    const s = (x + y + z) * SIMPLEX_CORNER_SKEW_FACTOR; // Very nice and simple skew factor for 3D
    const i = fastFloor(x + s);
    const j = fastFloor(y + s);
    const k = fastFloor(z + s);
    const t = (i + j + k) * SIMPLEX_UNSKEW_FACTOR;
    const X0 = i - t; // Unskew the cell origin back to (x,y,z) space
    const Y0 = j - t;
    const Z0 = k - t;
    const x0 = x - X0; // The x,y,z distances from the cell origin
    const y0 = y - Y0;
    const z0 = z - Z0;
    // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
    // Determine which simplex we are in.
    let i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords
    let i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords
    if (x0 >= y0) {
      if (y0 >= z0) {
        i1 = 1;
        j1 = 0;
        k1 = 0;
        i2 = 1;
        j2 = 1;
        k2 = 0;
      } // X Y Z order
      else if (x0 >= z0) {
        i1 = 1;
        j1 = 0;
        k1 = 0;
        i2 = 1;
        j2 = 0;
        k2 = 1;
      } // X Z Y order
      else {
        i1 = 0;
        j1 = 0;
        k1 = 1;
        i2 = 1;
        j2 = 0;
        k2 = 1;
      } // Z X Y order
    } else {
      // x0<y0
      if (y0 < z0) {
        i1 = 0;
        j1 = 0;
        k1 = 1;
        i2 = 0;
        j2 = 1;
        k2 = 1;
      } // Z Y X order
      else if (x0 < z0) {
        i1 = 0;
        j1 = 1;
        k1 = 0;
        i2 = 0;
        j2 = 1;
        k2 = 1;
      } // Y Z X order
      else {
        i1 = 0;
        j1 = 1;
        k1 = 0;
        i2 = 1;
        j2 = 1;
        k2 = 0;
      } // Y X Z order
    }
    // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
    // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
    // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
    // c = 1/6.
    const x1 = x0 - i1 + SIMPLEX_UNSKEW_FACTOR; // Offsets for second corner in (x,y,z) coords
    const y1 = y0 - j1 + SIMPLEX_UNSKEW_FACTOR;
    const z1 = z0 - k1 + SIMPLEX_UNSKEW_FACTOR;
    const x2 = x0 - i2 + 2.0 * SIMPLEX_UNSKEW_FACTOR; // Offsets for third corner in (x,y,z) coords
    const y2 = y0 - j2 + 2.0 * SIMPLEX_UNSKEW_FACTOR;
    const z2 = z0 - k2 + 2.0 * SIMPLEX_UNSKEW_FACTOR;
    const x3 = x0 - 1.0 + 3.0 * SIMPLEX_UNSKEW_FACTOR; // Offsets for last corner in (x,y,z) coords
    const y3 = y0 - 1.0 + 3.0 * SIMPLEX_UNSKEW_FACTOR;
    const z3 = z0 - 1.0 + 3.0 * SIMPLEX_UNSKEW_FACTOR;
    // Work out the hashed gradient indices of the four simplex corners
    const ii = i & 255;
    const jj = j & 255;
    const kk = k & 255;
    // Calculate the contribution from the four corners
    let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
    if (t0 < 0) n0 = 0.0;
    else {
      const gi0 = ii + perm[jj + perm[kk]];
      t0 *= t0;
      n0 =
        t0 *
        t0 *
        (permGrad3x[gi0] * x0 + permGrad3y[gi0] * y0 + permGrad3z[gi0] * z0);
    }
    let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
    if (t1 < 0) n1 = 0.0;
    else {
      const gi1 = ii + i1 + perm[jj + j1 + perm[kk + k1]];
      t1 *= t1;
      n1 =
        t1 *
        t1 *
        (permGrad3x[gi1] * x1 + permGrad3y[gi1] * y1 + permGrad3z[gi1] * z1);
    }
    let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
    if (t2 < 0) n2 = 0.0;
    else {
      const gi2 = ii + i2 + perm[jj + j2 + perm[kk + k2]];
      t2 *= t2;
      n2 =
        t2 *
        t2 *
        (permGrad3x[gi2] * x2 + permGrad3y[gi2] * y2 + permGrad3z[gi2] * z2);
    }
    let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
    if (t3 < 0) n3 = 0.0;
    else {
      const gi3 = ii + 1 + perm[jj + 1 + perm[kk + 1]];
      t3 *= t3;
      n3 =
        t3 *
        t3 *
        (permGrad3x[gi3] * x3 + permGrad3y[gi3] * y3 + permGrad3z[gi3] * z3);
    }
    // Add contributions from each corner to get the final noise value.
    // The result is scaled to stay just inside [-1,1]
    return 32.0 * (n0 + n1 + n2 + n3);
  };
}

/**
 * Builds a random permutation table.
 */
const buildPermutationTable = (random: RandomFn): Uint8Array => {
  const p = new Uint8Array(PERMUTATION_TABLE_SIZE);

  // Initialize array
  for (let i = 0; i < 256; i++) {
    p[i] = i;
  }
  for (let i = 0; i < PERMUTATION_TABLE_SIZE / 2 - 1; i++) {
    const r = i + ~~(random() * (256 - i));
    const aux = p[i];
    p[i] = p[r];
    p[r] = aux;
  }
  // Duplicate the permutation to avoid overflow
  for (let i = 256; i < PERMUTATION_TABLE_SIZE; i++) {
    p[i] = p[i - 256];
  }
  return p;
};
