const mongoose = require('mongoose');
const dotenv = require('dotenv');

// تحميل متغيرات البيئة
dotenv.config({ path: './config.env' });

const app = require('./app');

// التحقق من وجود متغيرات البيئة المهمة
if (!process.env.DATABASE || !process.env.DATABASE_PASSWORD) {
  console.error('❌ DATABASE or DATABASE_PASSWORD is missing in config.env');
  process.exit(1); // إنهاء التطبيق
}

// استبدال كلمة المرور في رابط قاعدة البيانات
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

// الاتصال بقاعدة البيانات
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true, // تحسين الأداء
  })
  .then(() => console.log('✅ DB connection successful!'))
  .catch((err) => {
    console.error(`❌ Database connection failed: ${err.message}`);
    process.exit(1); // إنهاء التطبيق إذا فشل الاتصال
  });

// تشغيل السيرفر
const port = process.env.PORT || 2000;
app.listen(port, () => {  
  console.log(`🚀 App running on port ${port}...`);
});
