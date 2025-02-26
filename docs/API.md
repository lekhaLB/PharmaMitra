# API Documentation

## 1. Process Image
**Endpoint:** `/process_image/`  
**Method:** `POST`  
**Description:** Extracts text from an uploaded prescription image and identifies medicines using LLaMA.

### Request
**Headers:**
- `Content-Type: multipart/form-data`

**Body:**
- `image` (file, required): The prescription image file.

### Response
**Success (200):**
```json
{
    "extracted_text": "Extracted text from image",
    "medicines": ["Medicine1", "Medicine2"]
}
```
**Error (400):**
```json
{
    "error": "No image uploaded"
}
```

---
## 2. Check Medicines
**Endpoint:** `/check_medicines/`  
**Method:** `POST`  
**Description:** Validates if the given medicines exist in the database.

### Request
**Headers:**
- `Content-Type: application/json`

**Body:**
```json
{
    "medicines": ["Paracetamol", "Aspirin"]
}
```

### Response
**Success (200):**
```json
{
    "valid_medicines": [
        {"name": "Paracetamol"},
        {"name": "Aspirin"}
    ]
}
```
**Error (400):**
```json
{
    "error": "No medicines provided"
}
```

---
## 3. Create Order
**Endpoint:** `/create_order/`  
**Method:** `POST`  
**Description:** Creates a new order for a user with selected medicines.

### Request
**Headers:**
- `Content-Type: application/json`

**Body:**
```json
{
    "user_id": 1,
    "medicines": [
        {"name": "Paracetamol", "quantity": 2},
        {"name": "Aspirin", "quantity": 1}
    ]
}
```

### Response
**Success (201):**
```json
{
    "message": "Order created successfully!"
}
```
**Error (400):**
```json
{
    "error": "User ID and medicines required"
}
```

---
## 4. Get Orders
**Endpoint:** `/get_orders/`  
**Method:** `GET`  
**Description:** Retrieves all orders.

### Response
**Success (200):**
```json
{
    "orders": [
        {"id": 1, "medicines": "Paracetamol", "quantity": 2, "created_at": "2025-02-26T12:00:00Z"}
    ]
}
```
**Error (405):**
```json
{
    "error": "Invalid request method"
}
```

---
## 5. Register User
**Endpoint:** `/register/`  
**Method:** `POST`  
**Description:** Registers a new user.

### Request
**Headers:**
- `Content-Type: application/json`

**Body:**
```json
{
    "username": "testuser",
    "email": "test@example.com",
    "password": "securepassword"
}
```

### Response
**Success (201):**
```json
{
    "message": "User registered successfully",
    "user_id": 1
}
```
**Error (400):**
```json
{
    "error": "Username already taken"
}
```

---
## 6. Login User
**Endpoint:** `/login/`  
**Method:** `POST`  
**Description:** Authenticates a user.

### Request
**Headers:**
- `Content-Type: application/json`

**Body:**
```json
{
    "username": "testuser",
    "password": "securepassword"
}
```

### Response
**Success (200):**
```json
{
    "message": "Login successful",
    "user_id": 1
}
```
**Error (401):**
```json
{
    "error": "Invalid credentials"
}
```

