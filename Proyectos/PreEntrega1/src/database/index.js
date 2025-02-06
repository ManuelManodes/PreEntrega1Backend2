import mongoose from "mongoose";

export default async function connectDb(uri) {
  try {
    await mongoose.connect(uri);
    console.info("✅ Conexión establecida correctamente con la base de datos.");
  } catch (error) {
    console.error(`❌ Error al establecer conexión con la base de datos: ${error.message}`);
  }
}
