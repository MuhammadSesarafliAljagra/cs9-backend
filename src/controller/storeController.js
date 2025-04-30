const storeRepository = require("../repositories/storeRepository");
const responseFormatter = require("../utils/responseFormatter");

const getAllStores = async (req, res) => {
  try {
    const stores = await storeRepository.getAll();
    res.json(responseFormatter.success("Stores found", stores));
  } catch (error) {
    res.status(500).json(responseFormatter.error("Error fetching stores"));
  }
};

const createStore = async (req, res) => {
  try {
    const { name, address } = req.body;
    if (!name || !address) {
      return res
        .status(400)
        .json(responseFormatter.error("Missing store name or address"));
    }

    const newStore = await storeRepository.create({ name, address });
    res.status(201).json(responseFormatter.success("Store created", newStore));
  } catch (error) {
    res.status(500).json(responseFormatter.error("Error creating store"));
  }
};

const getStoreById = async (req, res) => {
  try {
    const store = await storeRepository.getById(req.params.id);
    if (!store) {
      return res.status(404).json(responseFormatter.error("Store not found"));
    }
    res.json(responseFormatter.success("Store found", store));
  } catch (error) {
    res.status(500).json(responseFormatter.error("Error fetching store"));
  }
};

const updateStore = async (req, res) => {
  try {
    const { id, name, address } = req.body;
    const updatedStore = await storeRepository.update({ id, name, address });

    if (!updatedStore) {
      return res.status(404).json(responseFormatter.error("Store not found"));
    }
    res.json(responseFormatter.success("Store updated", updatedStore));
  } catch (error) {
    res.status(500).json(responseFormatter.error("Error updating store"));
  }
};

const deleteStore = async (req, res) => {
  try {
    const deleted = await storeRepository.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json(responseFormatter.error("Store not found"));
    }
    res.json(responseFormatter.success("Store deleted", deleted));
  } catch (error) {
    res.status(500).json(responseFormatter.error("Error deleting store"));
  }
};

module.exports = {
  getAllStores,
  createStore,
  getStoreById,
  updateStore,
  deleteStore,
};