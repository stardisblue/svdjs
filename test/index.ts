import { assert } from "chai";
import math, { Matrix } from "mathjs";

import SVD from "../src";

describe("SVD tests", () => {
  it("Should return an error when called with m < n", done => {
    let a: number[][] = [];
    for (let i = 0; i < 20; i++) {
      a[i] = new Array(21);
      for (let j = 0; j < 21; j++) {
        if (i > j) {
          a[i][j] = 0;
        } else if (i === j) {
          a[i][j] = 21 - i;
        } else {
          a[i][j] = -1;
        }
      }
    }
    assert.throws(() => SVD(a), TypeError, "Invalid matrix: m < n");
    done();
  });

  it("Should work with Golub and Reinsch first example", done => {
    let a = [
      [22, 10, 2, 3, 7],
      [14, 7, 10, 0, 8],
      [-1, 13, -1, -11, 3],
      [-3, -2, 13, -2, 4],
      [9, 8, 1, -2, 4],
      [9, 1, -7, 5, -1],
      [2, -6, 6, 5, 1],
      [4, 5, 0, -2, 2]
    ];

    let { u, v, q } = SVD(a);
    assert.approximately(q[0], Math.sqrt(1248), 1e-4);
    assert.approximately(q[1], 0, 1e-4);
    assert.approximately(q[2], 20, 1e-4);
    assert.approximately(q[3], Math.sqrt(384), 1e-4);
    assert.approximately(q[4], 0, 1e-4);

    let U: Matrix = math.matrix(u);
    let V: Matrix = math.matrix(v);

    let Ut = math.transpose(U) as Matrix;
    let Vt = math.transpose(V) as Matrix;

    let UtU = math.multiply(Ut, U) as Matrix;

    assert.deepEqual(UtU.size(), [5, 5]);

    // Check if it is an identity matrix
    for (let i = 0; i < UtU.size()[0]; i++) {
      for (let j = 0; j < UtU.size()[1]; j++) {
        assert.approximately(UtU.get([i, j]), i === j ? 1 : 0, 1e-4);
      }
    }

    let VtV = math.multiply(Vt, V) as Matrix;

    assert.deepEqual(VtV.size(), [5, 5]);

    // Check if it is an identity matrix
    for (let i = 0; i < VtV.size()[0]; i++) {
      for (let j = 0; j < VtV.size()[1]; j++) {
        assert.approximately(VtV.get([i, j]), i === j ? 1 : 0, 1e-4);
      }
    }

    done();
  });

  it("Should work with Golub and Reinsch first example without returning u and v", done => {
    let a = [
      [22, 10, 2, 3, 7],
      [14, 7, 10, 0, 8],
      [-1, 13, -1, -11, 3],
      [-3, -2, 13, -2, 4],
      [9, 8, 1, -2, 4],
      [9, 1, -7, 5, -1],
      [2, -6, 6, 5, 1],
      [4, 5, 0, -2, 2]
    ];

    let { v, q } = SVD(a, false, false);

    assert.approximately(q[0], Math.sqrt(1248), 1e-4);
    assert.approximately(q[1], 0, 1e-4);
    assert.approximately(q[2], 20, 1e-4);
    assert.approximately(q[3], Math.sqrt(384), 1e-4);
    assert.approximately(q[4], 0, 1e-4);

    assert.strictEqual(v.length, 5);
    assert.strictEqual(v[0].length, 5);

    // Check if v is an empty matrix
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        assert.strictEqual(v[i][j], 0);
      }
    }

    done();
  });

  it("Should work with Golub and Reinsch second example", done => {
    let a = [];
    for (let i = 0; i < 21; i++) {
      a[i] = new Array(20);
      for (let j = 0; j < 20; j++) {
        if (i > j) {
          a[i][j] = 0;
        } else if (i === j) {
          a[i][j] = 21 - i;
        } else {
          a[i][j] = -1;
        }
      }
    }

    let { u, v, q } = SVD(a);

    assert.approximately(q[0], 21.45, 1e-2);
    assert.approximately(q[1], 20.45, 1e-2);
    assert.approximately(q[2], 19.44, 1e-2);
    assert.approximately(q[3], 18.44, 1e-2);
    assert.approximately(q[4], 17.44, 1e-2);
    assert.approximately(q[5], 16.43, 1e-2);
    assert.approximately(q[6], 15.43, 1e-2);
    assert.approximately(q[7], 14.42, 1e-2);
    assert.approximately(q[8], 13.42, 1e-2);
    assert.approximately(q[9], 12.41, 1e-2);
    assert.approximately(q[10], 11.4, 1e-2);
    assert.approximately(q[11], 0.99, 1e-2);
    assert.approximately(q[12], 10.39, 1e-2);
    assert.approximately(q[13], 9.38, 1e-2);
    assert.approximately(q[14], 3.14, 1e-2);
    assert.approximately(q[15], 4.24, 1e-2);
    assert.approximately(q[16], 8.37, 1e-2);
    assert.approximately(q[17], 5.29, 1e-2);
    assert.approximately(q[18], 7.35, 1e-2);
    assert.approximately(q[19], 6.33, 1e-2);

    let U = math.matrix(u);
    let V = math.matrix(v);

    let Ut = math.transpose(U);
    let Vt = math.transpose(V);

    let UtU = math.multiply(Ut, U) as Matrix;

    assert.deepEqual(UtU.size(), [20, 20]);

    // Check if it is an identity matrix
    for (let i = 0; i < UtU.size()[0]; i++) {
      for (let j = 0; j < UtU.size()[1]; j++) {
        assert.approximately(UtU.get([i, j]), i === j ? 1 : 0, 1e-4);
      }
    }

    let VtV = math.multiply(Vt, V) as Matrix;

    assert.deepEqual(VtV.size(), [20, 20]);

    // Check if it is an identity matrix
    for (let i = 0; i < VtV.size()[0]; i++) {
      for (let j = 0; j < VtV.size()[1]; j++) {
        assert.approximately(VtV.get([i, j]), i === j ? 1 : 0, 1e-4);
      }
    }

    done();
  });

  it("Should work with Golub and Reinsch third example", done => {
    let a = [];
    for (let i = 0; i < 30; i++) {
      a[i] = new Array(30);
      for (let j = 0; j < 30; j++) {
        if (i > j) {
          a[i][j] = 0;
        } else if (i === j) {
          a[i][j] = 1;
        } else {
          a[i][j] = -1;
        }
      }
    }

    let { u, v, q } = SVD(a);

    assert.approximately(q[0], 18.2, 1e-2);
    assert.approximately(q[1], 6.22, 1e-2);
    assert.approximately(q[2], 3.91, 1e-2);
    assert.approximately(q[3], 2.97, 1e-2);
    assert.approximately(q[4], 2.49, 1e-2);
    assert.approximately(q[5], 0, 1e-2);
    assert.approximately(q[6], 2.2, 1e-2);
    assert.approximately(q[7], 2.01, 1e-2);
    assert.approximately(q[8], 1.89, 1e-2);
    assert.approximately(q[9], 1.8, 1e-2);
    assert.approximately(q[10], 1.74, 1e-2);
    assert.approximately(q[11], 1.69, 1e-2);
    assert.approximately(q[12], 1.65, 1e-2);
    assert.approximately(q[13], 1.62, 1e-2);
    assert.approximately(q[14], 1.6, 1e-2);
    assert.approximately(q[15], 1.58, 1e-2);
    assert.approximately(q[16], 1.56, 1e-2);
    assert.approximately(q[17], 1.55, 1e-2);
    assert.approximately(q[18], 1.54, 1e-2);
    assert.approximately(q[19], 1.53, 1e-2);
    assert.approximately(q[20], 1.52, 1e-2);
    assert.approximately(q[21], 1.52, 1e-2);
    assert.approximately(q[22], 1.51, 1e-2);
    assert.approximately(q[23], 1.51, 1e-2);
    assert.approximately(q[24], 1.5, 1e-2);
    assert.approximately(q[25], 1.5, 1e-2);
    assert.approximately(q[26], 1.5, 1e-2);
    assert.approximately(q[27], 1.5, 1e-2);
    assert.approximately(q[28], 1.5, 1e-2);
    assert.approximately(q[29], 1.5, 1e-2);

    let U = math.matrix(u);
    let V = math.matrix(v);

    let Ut = math.transpose(U);
    let Vt = math.transpose(V);

    let UtU = math.multiply(Ut, U) as Matrix;

    assert.deepEqual(UtU.size(), [30, 30]);

    // Check if it is an identity matrix
    for (let i = 0; i < UtU.size()[0]; i++) {
      for (let j = 0; j < UtU.size()[1]; j++) {
        assert.approximately(UtU.get([i, j]), i === j ? 1 : 0, 1e-4);
      }
    }

    let VtV = math.multiply(Vt, V) as Matrix;

    assert.deepEqual(VtV.size(), [30, 30]);

    // Check if it is an identity matrix
    for (let i = 0; i < VtV.size()[0]; i++) {
      for (let j = 0; j < VtV.size()[1]; j++) {
        assert.approximately(VtV.get([i, j]), i === j ? 1 : 0, 1e-4);
      }
    }

    done();
  });
});
