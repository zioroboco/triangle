#![allow(unused_unsafe)]

mod nav;
use nav::*;

use js_sys::Float64Array;
use nalgebra::*;
// use typenum::U90;
use wasm_bindgen::prelude::*;
use web_sys::console;

const TRIANGLE: &str = "△";

/// The number of particles in the universe.
pub const N: usize = 2;

/// The index offset for the x dimension.
pub const DIM_X: usize = 0;

/// The index offset for the y dimension.
pub const DIM_Y: usize = 1;

/// The total number of spatial dimensions.
pub const DIM_N: usize = 2;

/// The degree of discretisation of space.
pub const NAV_N: usize = 90;

pub const SOI: f64 = 2.0;

#[wasm_bindgen]
pub struct State {
  positions: Matrix<f64, U2, U2, ArrayStorage<f64, U2, U2>>,
  velocities: Matrix<f64, U2, U2, ArrayStorage<f64, U2, U2>>,
  space: Matrix<Vector2<f64>, U90, U90, ArrayStorage<Vector2<f64>, U90, U90>>,
}

#[wasm_bindgen]
impl State {
  /// Initialise state from linear typed arrays of positions and velocities.
  pub fn init(ps: Box<[f64]>, vs: Box<[f64]>) -> State {
    fn to_a(i: usize, j: usize) -> Vector2<f64> {
      let p = to_unit_soi(i, j, NAV_N);
      let a = -10.0 * p * p.norm().powf(-3.0);
      return a;
    }

    State {
      positions: Matrix::from_columns(&from_linear(ps)),
      velocities: Matrix::from_columns(&from_linear(vs)),
      space: Matrix::from_fn(to_a),
    }
  }

  pub fn update(&mut self, delta_time: f64) -> () {
    let dt = delta_time / (1000.0 * 4.0); // seconds

    for n in 0..N {
      let v = self.velocities.column(n);
      let p = self.positions.column(n);

      let (i, j) = from_soi(p.into_owned(), SOI, NAV_N); // FIXME into_owned

      let v_next: Vector2<f64>;
      if i < NAV_N && j < NAV_N {
        unsafe {
          v_next = v + self.space.get_unchecked((i, j)) * dt;
        }
      } else {
        v_next = v.into_owned(); // FIXME into_owned
      }

      let p_next = p + v_next * dt;

      self.velocities.column_mut(n).copy_from(&v_next);
      self.positions.column_mut(n).copy_from(&p_next);
    }
  }

  /// Get a view of current positions as a linear typed array.
  pub fn positions(&self) -> Float64Array {
    unsafe { Float64Array::view(self.positions.as_slice()) }
  }

  /// Get a view of current velocities as a linear typed array.
  pub fn velocities(&self) -> Float64Array {
    unsafe { Float64Array::view(self.velocities.as_slice()) }
  }
}

/// Destructure an array of `Vector2` elements from a linear `Float64Array`.
fn from_linear(array: Box<[f64]>) -> [Vector2<f64>; N] {
  let mut v = [Vector2::new(0.0, 0.0); N];
  for i in 0..N {
    v[i].x = array[i * DIM_N + DIM_X];
    v[i].y = array[i * DIM_N + DIM_Y];
  }
  return v;
}

#[wasm_bindgen(start)]
pub fn main() -> Result<(), JsValue> {
  #[cfg(debug_assertions)]
  console_error_panic_hook::set_once();
  unsafe {
    console::log_1(&JsValue::from_str(TRIANGLE));
  }
  Ok(())
}
