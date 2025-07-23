import { Cart } from '../dao/models/cart.model.js';
import { TicketModel } from '../dao/models/ticket.model.js';
import { ProductModel } from '../dao/models/product.model.js';

export const createTicket = async (req, res) => {
  const userId = req.user._id;  
  console.log('User ID:', userId);  

  const cart = await Cart.findOne({ userId }).populate('products.productId');  

  if (!cart || cart.products.length === 0) {
    return res.status(400).json({ error: 'El carrito está vacío' });
  }

  let totalPrice = 0;
  const productsDetails = cart.products.map(item => {
    totalPrice += item.productId.price * item.quantity;
    return {
      productId: item.productId._id,
      quantity: item.quantity,
    };
  });

  const ticket = new TicketModel({
    userId,
    products: productsDetails,
    totalPrice,
  });

  try {
    await ticket.save();
    res.status(201).json({ message: 'Ticket creado exitosamente', ticket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al generar el ticket' });
  }
};
