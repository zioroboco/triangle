#![allow(unused_unsafe)]

use ultraviolet::Vec2;
use wasm_bindgen::prelude::*;
use web_sys::console;

const TRIANGLE: &str = "△";

/// The number of particles in the universe.
pub const N: usize = 2000;
pub const LINEAR_N: usize = N * DIM_N;

/// The index offset for the x dimension.
pub const DIM_X: usize = 0;

/// The index offset for the y dimension.
pub const DIM_Y: usize = 1;

/// The total number of spatial dimensions.
pub const DIM_N: usize = 2;

#[wasm_bindgen]
pub struct State {
  positions: [Vec2; N],
  velocities: [Vec2; N],
}

#[wasm_bindgen]
impl State {
  /// Initialise state from linear typed arrays of positions and velocities.
  pub fn init(ps: Box<[f32]>, vs: Box<[f32]>) -> State {
    State {
      positions: from_linear(ps),
      velocities: from_linear(vs),
    }
  }

  pub fn update(&mut self) -> () {
    let dt = 10.0 / 1000.0;

    for i in 0..N {
      let v: Vec2 = self.velocities[i];
      let p: Vec2 = self.positions[i];

      let a: Vec2 = -10.0 * p.normalized() / p.mag_sq();

      let v_next: Vec2 = v + a * dt;
      let p_next: Vec2 = p + v_next * dt;

      self.velocities[i] = v_next;
      self.positions[i] = p_next;
    }
  }

  /// Get a view of current positions as a linear typed array.
  pub fn positions(&self) -> Box<[f32]> {
    let mut linear_positions: [f32; LINEAR_N] = [0.0; LINEAR_N];
    for i in 0..N {
      linear_positions[i * DIM_N + DIM_X] = self.positions[i].x;
      linear_positions[i * DIM_N + DIM_Y] = self.positions[i].y;
    }
    Box::new(linear_positions)
  }

  /// Get a view of current velocities as a linear typed array.
  pub fn velocities(&self) -> Box<[f32]> {
    let mut linear_velocities: [f32; LINEAR_N] = [0.0; LINEAR_N];
    for i in 0..N {
      linear_velocities[i * DIM_N + DIM_X] = self.velocities[i].x;
      linear_velocities[i * DIM_N + DIM_Y] = self.velocities[i].y;
    }
    Box::new(linear_velocities)
  }
}

/// Destructure an array of `Vec2` elements from a linear `Float32Array`.
fn from_linear(array: Box<[f32]>) -> [Vec2; N] {
  let mut v = [Vec2::new(0.0, 0.0); N];
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
