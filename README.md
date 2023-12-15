# Designing-Web-applications

## Зависимости

- [atropos](https://www.npmjs.com/package/atropos) (^2.0.2)
- [axios](https://www.npmjs.com/package/axios) (^1.6.2)
- [ejs](https://www.npmjs.com/package/ejs) (^3.1.9)
- [express](https://www.npmjs.com/package/express) (^4.18.2)
- [mongoose](https://www.npmjs.com/package/mongoose) (^8.0.2)

## Mongoose-модели

### Модель обратной связи (Feedback)

```javascript
const FeedbackSchema = new mongoose.Schema({
  name: { type: String, required: false },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  messageType: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Feedback = mongoose.model('Feedback', FeedbackSchema);
```

### Модель квартиры (realEstate)
```javascript
const realEstateSchema = new mongoose.Schema({
  housingType: { type: String, required: true },
  price: { type: Number, required: true },
  id: { type: String, required: true },
  x: { type: Number, required: true }, 
  y: { type: Number, required: true } 
});

const RealEstate = mongoose.model('RealEstate', realEstateSchema);
```

### Модель дополнительной информации (Additional)
```javascript
const AdditionalDataSchema = new mongoose.Schema({
  squareMeters: {type: Number, required: true },
  bedrooms: {type: Number, required: true }, 
  price: {type: Number, required: true },
  id: {type: String, required: true } 
});
const AdditionalData = mongoose.model('AdditionalData', AdditionalDataSchema);
```