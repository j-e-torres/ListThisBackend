const validationTester = async (
  modelBuild,
  modelProperty,
  modelPropertyAssignment,
  customErrorString,
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

  // console.log('----------', error);

  if (result) throw Error(`${customErrorString} validation failed.`);

  const notEmptyError = error.errors.find(
    (e) => e.validatorKey === validatorKeyInput
  );

  if (notEmptyError) expect(notEmptyError.message).toBe(expectedErrorMessage);
  else throw Error(`${errorString} validation failed.`);
};

const createdSeedInstances = (model, data) => {
  return Promise.all(data.map((instance) => model.create(instance)));
};

module.exports = { validationTester, createdSeedInstances };
