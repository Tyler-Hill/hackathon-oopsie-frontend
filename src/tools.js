const openai = require("openai");
require("dotenv").config();

openai.apiKey = process.env.OPENAI_KEY;

function generatePriceQuote(item_id, quantity) {
  // Add your logic here to generate a price quote based on the item_id and quantity
  const priceQuote = 0;
  return `The price quote for item ${item_id} with a quantity of ${quantity} is $${priceQuote}.`;
}

function scheduleMeeting(client_name, date, time) {
  return `Meeting scheduled with ${client_name} on ${date} at ${time}.`;
}

function processRefund(order_id) {
  return `Refund processed for order ${order_id}.`;
}

function updateInventory(product_id, new_quantity) {
  return `Inventory updated for product ${product_id}. New quantity: ${new_quantity}.`;
}

async function pickTool(conversation) {
  const interpretation = await openai.ChatCompletion.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a tool picker that identifies the appropriate action based on the user's conversation. " + "You can choose from the following tools: 'generate_price_quote', 'schedule_meeting', 'process_refund', 'update_inventory'. " + "Return the exact name of the tool. Mention only the word - no further explanations needed",
      },
      {
        role: "user",
        content: conversation,
      },
    ],
    temperature: 0.3,
    max_tokens: 50,
  });

  const toolName = interpretation.choices[0].message.content.trim();

  const tools = {
    generate_price_quote: generatePriceQuote,
    schedule_meeting: scheduleMeeting,
    process_refund: processRefund,
    update_inventory: updateInventory,
  };

  return tools[toolName] || null;
}

module.exports = {
  generatePriceQuote,
  scheduleMeeting,
  processRefund,
  updateInventory,
  pickTool,
};
