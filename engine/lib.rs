#![allow(unused_unsafe)]

use wasm_bindgen::prelude::*;
use web_sys::console;

const TRIANGLE: &str = "△";

#[wasm_bindgen(start)]
pub fn main() -> Result<(), JsValue> {
    #[cfg(debug_assertions)]
    console_error_panic_hook::set_once();

    unsafe {
        console::log_1(&JsValue::from_str(TRIANGLE));
    }

    Ok(())
}

#[wasm_bindgen]
pub fn rotation(delta_time: JsValue) -> JsValue {
    let dt = delta_time.as_f64().unwrap() / 1000.0;
    JsValue::from_f64(1.0 * dt)
}
