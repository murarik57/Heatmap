import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FintiPlugin.css";

const FintiPlugin: React.FC = () => {
  const [formData, setFormData] = useState({
    secretKey: "",
    baseUrl: "http://localhost:4343/api/v1",
    successUrl: `${window.location.origin}/success`,
    errorUrl: `${window.location.origin}/error`,
    requestId: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Handle redirection logic
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const successRId = urlParams.get("rId");
    const errorMessage = urlParams.get("error");

    if (window.location.pathname === "/success" && successRId) {
      setSuccessMessage(
        `😀😀😀😀 Order Completed Successfully! Request ID: ${successRId}`
      );
    }

    if (window.location.pathname === "/error" && errorMessage) {
      setError(`Error: ${errorMessage}`);
    }
  }, []);

  const cartItems = [
    { name: "iPhone", sku: "12312312", unit_price: "400.50", quantity: "1" },
    { name: "MacBook", sku: "1111111", unit_price: "50.50", quantity: "2" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setError("");
    setFormData({ ...formData, [name]: value });
  };

  const generateRequestId = () => {
    const uniqueId = Math.random().toString(36).substr(2, 9);
    setFormData((prevData) => ({
      ...prevData,
      requestId: uniqueId,
      successUrl: `${prevData.successUrl}&rId=${uniqueId}`,
      errorUrl: `${prevData.errorUrl}&rId=${uniqueId}`,
    }));
  };

  const handlePayWithFinti = async () => {
    if (
      !formData.secretKey ||
      !formData.baseUrl ||
      !formData.successUrl ||
      !formData.errorUrl ||
      !formData.requestId
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    const payload = {
      secretKey: formData.secretKey,
      requestId: formData.requestId,
      source: window.location.origin,
      errorUrl: formData.errorUrl,
      successUrl: formData.successUrl,
      cartItems: [
        {
          name: "iPhone",
          quantity: "1",
          sku: "12312312",
          unit_price: "400.50",
        },
        { name: "MacBook", quantity: "2", sku: "1111111", unit_price: "50.50" },
      ],
    };

    try {
      const response = await axios.post(`${formData.baseUrl}/cart`, payload, {
        validateStatus: (status) => status >= 200 && status < 400,
      });
      if (response.request.responseURL)
        window.location.href = response.request.responseURL;

      //   console.log("API Response:", response);
    } catch (error: any) {
      console.log("API Error:", error?.response?.data ?? error);
      setError(error?.response?.data?.message);
    }
  };

  return (
    <div className="finti-plugin">
      <div className="header">
        <h1>Ebay Finti Plugin Test</h1>
        {successMessage && <p className="success">{successMessage}</p>}
        {error && <p className="error">{error}</p>}
      </div>

      <div className="content-wrap">
        <div className="form-section">
          <div className="form-group">
            <label>
              Secret Key:
              <input
                type="text"
                name="secretKey"
                value={formData.secretKey}
                onChange={handleInputChange}
                placeholder="Enter your secret key"
                required
              />
            </label>
            <div
              style={{
                paddingLeft: 10,
              }}
            >
              <span>Stage</span>
              <p className="note c0">
                Ebay Pacific: QjvEsBYjLObLvZff9Ly57sTp05rBCCi4VzBeOyVJYJse9
              </p>
              <p className="note c0">
                Ebay Atlantic: rYgAgq0jx3wNxjutXwy4RdIodzlrLSVnFrBgeNv5QHExC
              </p>
              <br />
              <span>Local</span>
              <p className="note c0">
                Myntra: WgL07GJLEbbUVCgWMPCA9dMYRcDglWUPwdQ3RKgzInQMS
              </p>
              <p className="note c0">
                Grocery: TbmtqDLQNZBYoCU9QAAHc9yeUjJhI2SYUmhFTiV5S8EsM
              </p>
            </div>
          </div>
          <div className="form-group">
            <label>
              Base URL:
              <input
                type="text"
                name="baseUrl"
                value={formData.baseUrl}
                onChange={handleInputChange}
                placeholder="Enter the base URL"
                required
              />
            </label>
            <div
              style={{
                paddingLeft: 10,
              }}
            >
              <p className="note">Local: http://localhost:4343/api/v1</p>
              <p className="note">
                Stage: https://stage-api.firstapp.io/api/v1
              </p>
              <p className="note">Prod: https://api.firstapp.io/api/v1</p>
            </div>
          </div>
          <div className="form-group">
            <label>
              Success URL:
              <input
                type="text"
                name="successUrl"
                value={formData.successUrl}
                onChange={handleInputChange}
                placeholder="Enter the success URL"
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              Error URL:
              <input
                type="text"
                name="errorUrl"
                value={formData.errorUrl}
                onChange={handleInputChange}
                placeholder="Enter the error URL"
                required
              />
            </label>
          </div>
          <div className="form-group request-id">
            <label>
              Request ID:
              <input
                type="text"
                name="requestId"
                value={formData.requestId}
                onChange={handleInputChange}
                placeholder="Enter the request ID"
                required
              />
            </label>
            <button style={{ padding: 5 }} onClick={generateRequestId}>
              Generate
            </button>
          </div>
        </div>

        <div className="content-section">
          <div className="cart-items">
            <h3>Cart Items</h3>
            {cartItems.map((item, index) => (
              <div key={index} className="cart-item">
                <p>Name: {item.name}</p>
                <p>SKU: {item.sku}</p>
                <p>Price: ${item.unit_price}</p>
                <p>Quantity: {item.quantity}</p>
              </div>
            ))}
          </div>

          <div className="pay-section">
            <h3>Total Items: {cartItems.length}</h3>
            <div className="total-amount">
              Total Amount: $
              {cartItems.reduce(
                (total, item) =>
                  total +
                  parseFloat(item.quantity) * parseFloat(item.unit_price),
                0
              )}
            </div>
            <button className="pay-button" onClick={handlePayWithFinti}>
              Pay with Finti
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FintiPlugin;
