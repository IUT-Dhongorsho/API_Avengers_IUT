import axios from "axios";

export const proxyRequest = async (req, res, serviceUrl) => {
  try {
    const url = `${serviceUrl}${req.originalUrl}`;
    const method = req.method.toLowerCase();

    const response = await axios({
      method,
      url,
      data: req.body,
      headers: req.headers,
    });

    res.status(response.status).json(response.data);
  } catch (err) {
    console.error("Proxy Error:", err.message);
    res.status(err.response?.status || 500).json({
      error: err.response?.data || "Service unavailable",
    });
  }
};
