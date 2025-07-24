import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number },
  }],
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const TicketModel = mongoose.model('Ticket', ticketSchema);

export { TicketModel };
