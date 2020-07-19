#![allow(unused_unsafe)]

use js_sys::Uint8Array;
use wasm_bindgen::prelude::*;
use web_sys::console;

const TRIANGLE: &str = "△";

const BUFFER_SIZE: usize = 8;
static mut BUFFER: [u8; BUFFER_SIZE] = [0; BUFFER_SIZE];

#[wasm_bindgen(start)]
pub fn main() -> Result<(), JsValue> {
    #[cfg(debug_assertions)]
    console_error_panic_hook::set_once();

    unsafe {
        console::log_1(&JsValue::from_str(TRIANGLE));
        for n in 0..BUFFER_SIZE {
            BUFFER[n] = 10 + (n as u8);
            console::log_1(&JsValue::from_str(&format!(
                "{} -> BUFFER[{}]",
                BUFFER[n], n
            )));
        }
    }

    Ok(())
}

#[wasm_bindgen]
pub fn view() -> Uint8Array {
    unsafe { js_sys::Uint8Array::view(&BUFFER) }
}

#[wasm_bindgen]
pub fn rotation(delta_time: JsValue) -> JsValue {
    let dt = delta_time.as_f64().unwrap() / 1000.0;
    JsValue::from_f64(1.0 * dt)
}
