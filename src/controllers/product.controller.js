import { ProductModel } from '../dao/models/product.model.js';

export const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
};

export const addProduct = async (req, res) => {
  const { name, description, price, stock, category } = req.body;

  try {
    const newProduct = new ProductModel({
      name,
      description,
      price,
      stock,
      category,
    });

    await newProduct.save();
    res.status(201).json({ message: 'Producto agregado exitosamente', newProduct });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el producto' });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await ProductModel.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, category } = req.body;

  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id,
      { name, description, price, stock, category },
      { new: true } 
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.status(200).json({ message: 'Producto actualizado exitosamente', updatedProduct });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
};
