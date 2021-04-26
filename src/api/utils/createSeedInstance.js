const createSeedInstances = (model, data) =>
  Promise.all(data.map((instance) => model.create(instance)));

module.exports = createSeedInstances;
