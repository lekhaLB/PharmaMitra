import { useState, useEffect } from "react";

interface Medicine {
    name: string;
    quantity: number;
}

const Cart = () => {
    const [cartItems, setCartItems] = useState<Medicine[]>([]);
    const [orderStatus, setOrderStatus] = useState<string | null>(null);

    // Fetch medicines stored in cart
    useEffect(() => {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }
    }, []);

    // Handle quantity change
    const updateQuantity = (index: number, newQuantity: number) => {
        const updatedCart = [...cartItems];
        updatedCart[index].quantity = newQuantity;
        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    // Remove item from cart
    const removeItem = (index: number) => {
        const updatedCart = cartItems.filter((_, i) => i !== index);
        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    // Create Order
    const createOrder = async () => {
        const userId = localStorage.getItem("user_id"); // Retrieve user ID

        if (!userId) {
            setOrderStatus("User not logged in!");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/api/create-order/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: userId,
                    medicines: cartItems,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setOrderStatus("Order placed successfully!");
                localStorage.removeItem("cart"); // Clear cart after order
                setCartItems([]);
            } else {
                setOrderStatus(data.error || "Failed to place order.");
            }
        } catch (error) {
            console.error("Error creating order:", error);
            setOrderStatus("Failed to create order.");
        }
    };

    return (
        <div>
            <h2>Cart</h2>
            {cartItems.length === 0 ? (
                <p>No items in cart</p>
            ) : (
                <ul>
                    {cartItems.map((medicine, index) => (
                        <li key={index}>
                            {medicine.name} -
                            <input
                                type="number"
                                value={medicine.quantity}
                                onChange={(e) => updateQuantity(index, parseInt(e.target.value))}
                                min="1"
                            />
                            <button onClick={() => removeItem(index)}>Remove</button>
                        </li>
                    ))}
                </ul>
            )}
            <button onClick={createOrder} disabled={cartItems.length === 0}>Place Order</button>
            {orderStatus && <p>{orderStatus}</p>}
        </div>
    );
};

export default Cart;
