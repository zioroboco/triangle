#![allow(unused_unsafe)]

use js_sys::Float64Array;
use nalgebra::*;
use typenum::U800;
use wasm_bindgen::prelude::*;
use web_sys::console;

const TRIANGLE: &str = "△";

/// The number of particles in the universe.
pub const N: usize = 800;

/// The index offset for the x dimension.
pub const DIM_X: usize = 0;

/// The index offset for the y dimension.
pub const DIM_Y: usize = 1;

/// The total number of spatial dimensions.
pub const DIM_N: usize = 2;

#[wasm_bindgen]
pub struct State {
  positions: Matrix<f64, U2, U800, ArrayStorage<f64, U2, U800>>,
  velocities: Matrix<f64, U2, U800, ArrayStorage<f64, U2, U800>>,
}

#[wasm_bindgen]
impl State {
  /// Initialise state from linear typed arrays of positions and velocities.
  pub fn init(ps: Box<[f64]>, vs: Box<[f64]>) -> State {
    State {
      positions: Matrix::from_columns(&from_linear(ps)),
      velocities: Matrix::from_columns(&from_linear(vs)),
    }
  }

  pub fn update(&mut self, delta_time: f64) -> () {
    let dt = delta_time / 1000.0; // seconds

    for i in 0..N {
      let v = self.velocities.column(i);
      let p = self.positions.column(i);

      let a = -10.0 * p.normalize() / p.norm_squared();

      let v_next = v + a * dt;
      let p_next = p + v_next * dt;

      self.velocities.column_mut(i).copy_from(&v_next);
      self.positions.column_mut(i).copy_from(&p_next);
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
