import { useState } from 'react';
import { Search, User, ShoppingCart, Package, Settings, FileText, Menu, Plus, Minus } from 'lucide-react';

export default function POSSystem() {
  const [items, setItems] = useState([
    { id: 1, name: 'Item 1', qty: 1, price: 5.00, discount: 0, total: 5.00 }
  ]);
  const [total, setTotal] = useState(5.00);
  
  const addItem = () => {
    const newItem = { 
      id: items.length + 1, 
      name: `Item ${items.length + 1}`, 
      qty: 1, 
      price: 5.00, 
      discount: 0, 
      total: 5.00 
    };
    setItems([...items, newItem]);
    setTotal(prev => prev + 5.00);
  };
  
  const removeItem = (id) => {
    const itemToRemove = items.find(item => item.id === id);
    if (itemToRemove) {
      setItems(items.filter(item => item.id !== id));
      setTotal(prev => prev - itemToRemove.total);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-purple-800 text-white p-2 flex justify-between items-center">
        <div className="flex items-center">
          <Menu className="mr-2" />
          <h1 className="text-xl font-bold">POS System</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded hover:bg-purple-700">
            <FileText size={20} />
          </button>
          <button className="p-2 rounded hover:bg-purple-700">
            <Settings size={20} />
          </button>
          <button className="p-2 rounded hover:bg-purple-700">
            <User size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Side - Order Section */}
        <div className="w-3/5 flex flex-col border-r border-gray-300 bg-white">
          {/* Customer Search */}
          <div className="p-4 border-b border-gray-300">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600">Customer Name</label>
                <div className="flex mt-1">
                  <input
                    type="text"
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                  />
                  <button className="bg-gray-200 px-3 ml-1 rounded">
                    <Search size={16} />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600">Mobile Number</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded px-3 py-2 w-full mt-1"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Invoice No</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded px-3 py-2 w-full mt-1"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Invoice Date</label>
                <input
                  type="date"
                  className="border border-gray-300 rounded px-3 py-2 w-full mt-1"
                />
              </div>
            </div>
          </div>

          {/* Order Table */}
          <div className="flex-1 overflow-auto">
            <table className="w-full">
              <thead className="bg-purple-100 sticky top-0">
                <tr>
                  <th className="py-2 px-4 text-left">Item</th>
                  <th className="py-2 px-4 text-left">Qty</th>
                  <th className="py-2 px-4 text-left">Price</th>
                  <th className="py-2 px-4 text-left">Discount</th>
                  <th className="py-2 px-4 text-left">Sub-Amount</th>
                  <th className="py-2 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200">
                    <td className="py-2 px-4">{item.name}</td>
                    <td className="py-2 px-4">{item.qty}</td>
                    <td className="py-2 px-4">${item.price.toFixed(2)}</td>
                    <td className="py-2 px-4">${item.discount.toFixed(2)}</td>
                    <td className="py-2 px-4">${item.total.toFixed(2)}</td>
                    <td className="py-2 px-4">
                      <button 
                        onClick={() => removeItem(item.id)} 
                        className="text-red-500 hover:text-red-700"
                      >
                        <Minus size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-300 p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600">MRP Value</label>
                <input
                  type="text"
                  value={total.toFixed(2)}
                  readOnly
                  className="border border-gray-300 rounded px-3 py-2 w-full mt-1 bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Bill Quantity</label>
                <input
                  type="text"
                  value={items.length}
                  readOnly
                  className="border border-gray-300 rounded px-3 py-2 w-full mt-1 bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Discount</label>
                <input
                  type="text"
                  value="0.00"
                  className="border border-gray-300 rounded px-3 py-2 w-full mt-1"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-between items-center">
              <div className="text-2xl font-bold">
                PAY - LKR : {total.toFixed(2)}
              </div>
              <div className="flex space-x-2">
                <button onClick={addItem} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                  <Plus size={16} />
                </button>
                <button className="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Customer Details */}
        <div className="w-2/5 bg-white p-4">
          <h2 className="text-lg font-semibold mb-4">Customer Details</h2>
          <div className="flex space-x-4 text-sm mb-4">
            <button className="text-blue-600 hover:underline">Contact</button>
            <button className="text-blue-600 hover:underline">Address</button>
            <button className="text-blue-600 hover:underline">Privacy</button>
            <button className="text-blue-600 hover:underline">Tax Details</button>
            <button className="text-blue-600 hover:underline">Purchase Loyalty</button>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-medium mb-3">Information</h3>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <label className="block text-xs text-gray-500">Customer Type</label>
                <select className="border border-gray-300 rounded px-2 py-1 w-full mt-1 text-sm">
                  <option>Retail</option>
                  <option>Wholesale</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500">Title</label>
                <select className="border border-gray-300 rounded px-2 py-1 w-full mt-1 text-sm">
                  <option>Mr.</option>
                  <option>Mrs.</option>
                  <option>Ms.</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500">First Name</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded px-2 py-1 w-full mt-1 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">Middle Name</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded px-2 py-1 w-full mt-1 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">Last Name</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded px-2 py-1 w-full mt-1 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">Mobile Number</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded px-2 py-1 w-full mt-1 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">Country</label>
                <select className="border border-gray-300 rounded px-2 py-1 w-full mt-1 text-sm">
                  <option>Sri Lanka</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500">Phone</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded px-2 py-1 w-full mt-1 text-sm"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-gray-500">Email</label>
                <input
                  type="email"
                  placeholder="example@email.com"
                  className="border border-gray-300 rounded px-2 py-1 w-full mt-1 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">District</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded px-2 py-1 w-full mt-1 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">Anniversary Date</label>
                <div className="flex items-center mt-1">
                  <input
                    type="date"
                    className="border border-gray-300 rounded px-2 py-1 w-full text-sm"
                  />
                  <button className="bg-blue-500 text-white px-2 py-1 ml-1 rounded text-sm">
                    Set
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500">State or Block</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded px-2 py-1 w-full mt-1 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">Zip</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded px-2 py-1 w-full mt-1 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">NIC</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded px-2 py-1 w-full mt-1 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">Pincode No</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded px-2 py-1 w-full mt-1 text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}