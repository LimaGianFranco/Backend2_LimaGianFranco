import { Cart } from '../dao/models/cart.model.js';
import { TicketModel } from '../dao/models/ticket.model.js';

export const createTicket = async (req, res) => {
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ userId }).populate('products.productId');
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ error: 'El carrito está vacío' });
    }
    const ticket = new TicketModel({
      userId,
      products: cart.products,
      total: cart.products.reduce((total, product) => total + product.productId.price * product.quantity, 0),
      createdAt: new Date(),
    });
    await ticket.save();
    await Cart.findOneAndUpdate({ userId }, { $set: { products: [] } });
    
    res.status(200).json({ message: 'Ticket generado exitosamente', ticket });
  } catch (error) {
    res.status(500).json({ error: 'Error al generar el ticket' });
  }
};
