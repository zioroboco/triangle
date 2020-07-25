#![allow(unused_unsafe)]

mod util;
use util::*;

use js_sys::Float64Array;
use nalgebra::Vector2;
use wasm_bindgen::prelude::*;
use web_sys::console;

const TRIANGLE: &str = "△";

/// The number of particles in the universe.
pub const N: usize = 2;

static mut V_X: [f64; N] = [0.0; N];
static mut V_Y: [f64; N] = [0.0; N];
static mut P_X: [f64; N] = [0.0; N];
static mut P_Y: [f64; N] = [0.0; N];

#[wasm_bindgen(start)]
pub fn main() -> Result<(), JsValue> {
    #[cfg(debug_assertions)]
    console_error_panic_hook::set_once();

    unsafe {
        console::log_1(&JsValue::from_str(TRIANGLE));
        for i in 0..N {
            let d = ((i as i8) * 2 - 1) as f64; // ±1.0
            V_X[i] = 0.0;
            V_Y[i] = 1.5 * d;
            P_X[i] = 2.0 * d;
            P_Y[i] = 0.0;
        }
    }

    Ok(())
}

#[wasm_bindgen]
pub fn init(i: JsValue, x: JsValue, y: JsValue, v_x: JsValue, v_y: JsValue) -> () {
    let x: f64 = x.as_f64().unwrap();
    let y: f64 = y.as_f64().unwrap();
    let v_x: f64 = v_x.as_f64().unwrap();
    let v_y: f64 = v_y.as_f64().unwrap();
    unsafe {
        let i: usize = i.as_f64().unwrap().to_int_unchecked();
        P_X[i] = x;
        P_Y[i] = y;
        V_X[i] = v_x;
        V_Y[i] = v_y;
    }
}

static MU: f64 = 10.0;

#[wasm_bindgen]
pub fn update(delta_time: JsValue) -> () {
    let dt = delta_time.as_f64().unwrap() / 1000.0; // seconds
    for i in 0..N {
        unsafe {
            let p = Vector2::new(P_X[i], P_Y[i]);
            let v = Vector2::new(V_X[i], V_Y[i]);
            let a: f64 = MU / p.norm_squared();
            let v_next: Vector2<f64> = v + -p.normalize() * a * dt;
            V_X[i] = v_next.x;
            V_Y[i] = v_next.y;
            P_X[i] += v_next.x * dt;
            P_Y[i] += v_next.y * dt;
        }
    }
}

#[wasm_bindgen]
pub fn xs() -> Float64Array {
    unsafe { Float64Array::view(&P_X) }
}

#[wasm_bindgen]
pub fn ys() -> Float64Array {
    unsafe { Float64Array::view(&P_Y) }
}

#[wasm_bindgen]
pub fn v_xs() -> Float64Array {
    unsafe { Float64Array::view(&V_X) }
}

#[wasm_bindgen]
pub fn v_ys() -> Float64Array {
    unsafe { Float64Array::view(&V_Y) }
}

#[wasm_bindgen]
pub fn rotation(delta_time: JsValue) -> JsValue {
    let dt = delta_time.as_f64().unwrap() / 1000.0;
    JsValue::from_f64(1.0 * dt)
}
