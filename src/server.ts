import app from "./app";
const bootstrap = () => {
  const port = process.env.PORT || 5000;
  try {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.log(`Error Express Server ${error}`);
  }
};

bootstrap();
