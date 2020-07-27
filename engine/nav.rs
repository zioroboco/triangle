use nalgebra::*;

pub fn from_soi(p: Vector2<f64>, soi: f64, size: usize) -> (usize, usize) {
  let positive_and_normalised = p.add_scalar(soi) / (2.0 * soi);
  let per_size = positive_and_normalised * ((size - 1) as f64);
  (per_size.x.floor() as usize, per_size.y.floor() as usize)
}

pub fn to_unit_soi(i: usize, j: usize, size: usize) -> Vector2<f64> {
  Vector2::new(to_centre_point(i, size), to_centre_point(j, size))
}

fn to_centre_point(a: usize, size: usize) -> f64 {
  let a = a as f64;
  let size = size as f64;

  let normalised = (a / size) * 2.0 - 1.0;

  if normalised.is_sign_positive() {
    return normalised - 1.0 / size;
  } else {
    return normalised + 1.0 / size;
  }
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn test_from_soi() {
    let (i, j) = from_soi(Vector2::new(1.0, -2.0), 4.0, 8);
    assert_eq!(i, 4);
    assert_eq!(j, 1);
  }

  #[test]
  fn test_from_soi_top_left() {
    let (i, j) = from_soi(Vector2::new(-2.0, 2.0), 2.0, 4);
    assert_eq!(i, 0);
    assert_eq!(j, 3);
  }

  #[test]
  fn test_from_soi_top_right() {
    let (i, j) = from_soi(Vector2::new(2.0, 2.0), 2.0, 4);
    assert_eq!(i, 3);
    assert_eq!(j, 3);
  }

  #[test]
  fn test_from_soi_bottom_left() {
    let (i, j) = from_soi(Vector2::new(-2.0, -2.0), 2.0, 4);
    assert_eq!(i, 0);
    assert_eq!(j, 0);
  }

  #[test]
  fn test_from_soi_bottom_right() {
    let (i, j) = from_soi(Vector2::new(2.0, -2.0), 2.0, 4);
    assert_eq!(i, 3);
    assert_eq!(j, 0);
  }

  #[test]
  fn test_from_centre() {
    let (i, j) = from_soi(Vector2::new(0.0, 0.0), 2.0, 4);
    assert_eq!(i, 1);
    assert_eq!(j, 1);
  }

  #[test]
  fn test_to_centre_point() {
    let result = to_centre_point(3, 4);
    assert!(result - 0.25 < f64::EPSILON);
  }

  #[test]
  fn test_to_unit_soi() {
    let result = to_unit_soi(4, 2, 4);
    assert!(result.x - 0.75 < f64::EPSILON);
    assert!(result.y - -0.25 < f64::EPSILON);
  }

  #[test]
  fn test_to_unit_soi_2() {
    let result = to_unit_soi(4, 2, 4);
    assert!(result.x - 0.75 < f64::EPSILON);
    assert!(result.y - -0.25 < f64::EPSILON);
  }

  #[test]
  fn test_sign_of_bottom_left() {
    let result = to_unit_soi(0, 0, 4);
    assert!(result.x < 0.0);
    assert!(result.y < 0.0);
  }

  #[test]
  fn test_sign_of_bottom_right() {
    let result = to_unit_soi(4, 0, 4);
    assert!(result.x > 0.0);
    assert!(result.y < 0.0);
  }

  #[test]
  fn test_sign_of_top_left() {
    let result = to_unit_soi(0, 4, 4);
    assert!(result.x < 0.0);
    assert!(result.y > 0.0);
  }

  #[test]
  fn test_sign_of_top_right() {
    let bottom_right = to_unit_soi(4, 0, 4);
    assert!(bottom_right.x > 0.0);
    assert!(bottom_right.y < 0.0);
  }
}
