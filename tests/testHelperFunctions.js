const validationTester = async (
  modelBuild,
  modelProperty,
  modelPropertyAssignment,
  errorString,
  validatorKeyInput,
  expectedErrorMessage
) => {
  modelBuild[modelProperty] = modelPropertyAssignment;

  let result, error;

  try {
    result = await modelBuild.validate();
  } catch (err) {
    error = err;
  }

  if (result) throw Error(`${errorString} validation failed.`);

  const notEmptyError = error.errors.find(
    e => e.validatorKey === validatorKeyInput
  );

  // if (modelPropertyAssignment === null) console.log(error);
  if (notEmptyError) expect(notEmptyError.message).toBe(expectedErrorMessage);
  else throw Error(`${errorString} validation failed.`);
};

module.exports = validationTester;
