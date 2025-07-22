import { Cart } from '../dao/models/cart.model.js';
import { Ticket } from '../dao/models/ticket.model.js';
import { ProductModel } from '../dao/models/product.model.js'; 
export const checkout = async (req, res) => {
  const userId = req.user._id;
  try {
    const cart = await Cart.findOne({ userId }).populate('products.productId');
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ error: 'Carrito vacío' });
    }

    let total = 0;
    const productsToPurchase = [];

    for (const item of cart.products) {
      const product = item.productId;
      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `No hay suficiente stock de ${product.name}` });
      }
      total += product.price * item.quantity;
      productsToPurchase.push({
        productId: product._id,
        quantity: item.quantity,
        price: product.price
      });
      product.stock -= item.quantity;
      await product.save();
    }

    const ticket = new Ticket({ userId, products: productsToPurchase, total });
    await ticket.save();
    await Cart.deleteOne({ userId });

    res.status(200).json({ message: 'Compra realizada con éxito', ticket });
  } catch (error) {
    res.status(500).json({ error: 'Error al realizar la compra' });
  }
};
