const itemRepository = require("../repositories/item.repository");
const { cloudinary, uploadImage } = require("../utils/cloudinary");

const createItem = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Uploaded File:", req.file);

    const { name, price, store_id, stock } = req.body;
    if (!name || !price || !store_id) {
      return res.status(400).json({ success: false, message: "Missing data" });
    }

    let image_url = null;
    if (req.file) {
      try {
        console.log("Uploading image...");
        const result = await uploadImage(req.file.buffer);
        image_url = result.secure_url;
        console.log("Image uploaded successfully:", image_url);
      } catch (uploadError) {
        console.error("Error uploading image:", uploadError);
        return res
          .status(500)
          .json({ success: false, message: "Image upload failed" });
      }
    }

    console.log("Inserting into database...");
    const newItem = await itemRepository.createItem(
      name,
      price,
      store_id,
      image_url,
      stock
    );
    console.log("Item inserted successfully:", newItem);

    // Send a smaller response to avoid connection issues
    res.status(201).json({
      success: true,
      message: "Item created",
      payload: {
        id: newItem[0].id,
        name: newItem[0].name,
      },
    });
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({ success: false, message: "Error creating item" });
  }
};

const getAllItems = async (req, res) => {
  try {
    const items = await itemRepository.getAllItems();
    res.json({ success: true, message: "Items found", payload: items });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error retrieving items" });
  }
};

const getItemById = async (req, res) => {
  try {
    const item = await itemRepository.getItemById(req.params.id);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }
    res.json({ success: true, message: "Item found", payload: item });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error retrieving item" });
  }
};

const getItemsByStore = async (req, res) => {
  try {
    const items = await itemRepository.getItemsByStore(req.params.store_id);
    if (items.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Store doesn't exist" });
    }
    res.json({ success: true, message: "Items found", payload: items });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error retrieving items by store" });
  }
};

const updateItem = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Uploaded File:", req.file);

    const { id, name, price, store_id, stock } = req.body;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Item ID is required" });
    }

    let image_url = req.body.image_url || null;
    if (req.file) {
      try {
        console.log("Uploading new image...");
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "items" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(req.file.buffer);
        });
        image_url = result.secure_url;
        console.log("Image uploaded successfully:", image_url);
      } catch (uploadError) {
        console.error("Error uploading image:", uploadError);
        return res
          .status(500)
          .json({ success: false, message: "Image upload failed" });
      }
    }

    console.log("Updating item in database...");
    const updatedItem = await itemRepository.updateItem(
      id,
      name,
      price,
      store_id,
      image_url,
      stock
    );
    console.log("Updated Item:", updatedItem);

    if (!updatedItem) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }
    res.json({ success: true, message: "Item updated", payload: updatedItem });
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ success: false, message: "Error updating item" });
  }
};

const deleteItem = async (req, res) => {
  try {
    const deletedItem = await itemRepository.deleteItem(req.params.id);
    if (!deletedItem) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }
    res.json({ success: true, message: "Item deleted", payload: deletedItem });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting item" });
  }
};

module.exports = {
  createItem,
  getAllItems,
  getItemById,
  getItemsByStore,
  updateItem,
  deleteItem,
};
