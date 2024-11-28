import mongoose from 'mongoose';

export async function mongooseConnect() {
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection.asPromise(); // Đã kết nối rồi, không cần kết nối lại
    } else {
      const uri = process.env.MONGODB_URI;
      console.log('Đang kết nối tới MongoDB...');
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      });
      console.log('Kết nối MongoDB thành công!');
    }
  } catch (error) {
    console.error('Lỗi khi kết nối MongoDB:', error);
    throw new Error('Kết nối MongoDB không thành công');
  }
}
