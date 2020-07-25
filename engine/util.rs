use super::N;
use nalgebra::Vector2;

/// The index offset for the x dimension.
pub const DIM_X: usize = 0;

/// The index offset for the y dimension.
pub const DIM_Y: usize = 1;

/// The total number of spatial dimensions.
pub const DIM_N: usize = 2;

/// Destructure an array of `Vector2` elements from a linear `Float64Array`.
pub fn from_linear(input: Box<[f64]>) -> [Vector2<f64>; N] {
    let mut v = [Vector2::new(0.0, 0.0); N];
    for i in 0..N {
        v[i].x = input[i * DIM_N + DIM_X];
        v[i].y = input[i * DIM_N + DIM_Y];
    }
    return v;
}

#[test]
fn test_from_linear() -> () {
    let linear = [1.0, 2.0, 3.0, 4.0];
    let input = Box::new(linear);

    let result = from_linear(input);

    assert_eq!(result[0].x, linear[0]);
    assert_eq!(result[0].y, linear[1]);
    assert_eq!(result[1].x, linear[2]);
    assert_eq!(result[1].y, linear[3]);
}
