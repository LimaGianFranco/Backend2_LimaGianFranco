import { Cart } from '../dao/models/cart.model.js';
import { ProductModel } from '../dao/models/product.model.js';

export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id;

  try {
    const product = await ProductModel.findById(productId);
    if (!product || product.stock < quantity) {
      return res.status(400).json({ error: 'Producto fuera de stock o cantidad no disponible' });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, products: [] });
    }

    const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
    if (productIndex === -1) {
      cart.products.push({ productId, quantity });
    } else {
      cart.products[productIndex].quantity += quantity;
    }

    await cart.save();
    res.status(200).json({ message: 'Producto agregado al carrito', cart });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar al carrito' });
  }
};
