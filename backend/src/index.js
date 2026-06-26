import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
  console.log(`✅ InnerHue Backend running`);
  console.log(`📝 Environment: ${NODE_ENV}`);
  console.log(`🔌 http://localhost:${PORT}`);
});