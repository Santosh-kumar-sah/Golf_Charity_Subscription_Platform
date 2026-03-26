import { app } from "./app.js";

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.get("/", (req, res) => {
  res.send("API is running...");
});