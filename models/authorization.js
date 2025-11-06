function can(user, feature) {
  let authorized = false;

  if (user.features.includes(feature)) {
    return true;
  }

  return authorized;
}

const authorization = {
  can,
};

export default authorization;
