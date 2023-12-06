const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

import('atropos')

app.use(express.static('styles'));
mongoose.connect('mongodb://localhost/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Успешное подключение к базе данных');
  })
  .catch((error) => {
    console.error('Ошибка подключения к базе данных:', error);
  });

const FeedbackSchema = new mongoose.Schema({
  name: { type: String, required: false },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  messageType: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const realEstateSchema = new mongoose.Schema({
  housingType: { type: String, required: true },
  price: { type: Number, required: true },
  id: { type: String, required: true },
  x: { type: Number, required: true }, 
  y: { type: Number, required: true } 
});

const AdditionalDataSchema = new mongoose.Schema({
  squareMeters: {type: Number},
  bedrooms: {type: Number}, 
  price: {type: Number},
  id: {type: String} 
});

const RealEstate = mongoose.model('RealEstate', realEstateSchema);
const AdditionalData = mongoose.model('AdditionalData', AdditionalDataSchema);
const Feedback = mongoose.model('Feedback', FeedbackSchema);

/*
RealEstate.deleteMany({})
  .then(() => {
    console.log('Все данные удалены');
  })
  .catch((err) => {
    console.error(err);
  });
*/

/*
  Feedback.find({})
  .then(data => {
    console.log(data); 
  })
  .catch(error => {
    console.error(error);
  });
*/

/*
console.log(RealEstate);
  RealEstate.find({})
  .then(data => {
    console.log(data); 
  })
  .catch(error => {
    console.error(error);
  });
*/
  console.log(RealEstate);
  RealEstate.find({})
  .then(data => {
    console.log(data); 
  })
  .catch(error => {
    console.error(error);
  });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index', { schema: null, data: null });
});

app.post('/feedback', (req, res) => {
  const feedback = new Feedback(req.body);

  feedback.save()
    .then(() => {
      res.redirect('/');
    })
    .catch((error) => {
      console.error(error);
      res.redirect('/error');
    });
});

app.post('/realestate', (req, res) => {
  const realEstate = new RealEstate(req.body);

  realEstate.save()
    .then(() => {
      res.redirect('/');
    })
    .catch((error) => {
      console.error(error);
      res.redirect('/error');
    });
});

app.post('/additionaldata', (req, res) => {
  const additionaldata = new AdditionalData(req.body);
  additionaldata.save()
    .then(() => {
      res.redirect('/');
    })
    .catch((error) => {
      console.error(error);
      res.redirect('/error');
    });
});


app.get('/requests-per-day', (req, res) => {
  Feedback.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ])
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      console.error('Ошибка при получении данных:', error);
      res.status(500).json({ error: 'Произошла ошибка при получении данных' });
    });
});

app.get('/message-type-count', (req, res) => {
  Feedback.aggregate([
    {
      $group: {
        _id: "$messageType",
        count: { $sum: 1 }
      }
    }
  ])
    .then(data => {
      const messageTypeCount = {};
      data.forEach(item => {
        messageTypeCount[item._id] = item.count;
      });
      res.json(messageTypeCount);
    })
    .catch(error => {
      console.error('Ошибка при получении данных:', error);
      res.status(500).json({ error: 'Произошла ошибка при получении данных' });
    });
});

app.get('/real-estate-data', (req, res) => {
  RealEstate.find({})
    .then(data => res.json(data))
})

app.get('/additional-data', (req, res) => {
  AdditionalData.find({})
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      console.error('Ошибка при получении данных:', error);
      res.status(500).json({error: 'Произошла ошибка при получении данных'});
    });

});

app.get('/coordinates', (req, res) => {
  RealEstate.find({}, 'x y')
    .then(data => {
      const coordinates = data.map(item => ({ x: item.x, y: item.y }));
      res.json(coordinates);
    })
    .catch(error => {
      console.error('Ошибка при получении данных:', error);
      res.status(500).json({ error: 'Произошла ошибка при получении данных' });
    });
});



/* NEW */

app.post('/display', async (req, res) => {
  const selectedSchema = req.body.schema;
  let model;

  switch (selectedSchema) {
    case 'Feedback':
      model = Feedback;
      break;
    case 'RealEstate':
      model = RealEstate;
      break;
    case 'AdditionalData':
      model = AdditionalData;
      break;
    default:
      model = null;
  }


  app.post('/delete', async (req, res) => {
    const selectedSchema = req.body.schema;
    const idToDelete = req.body.id;
  
    let model;
  
    switch (selectedSchema) {
      case 'Feedback':
        model = Feedback;
        break;
      case 'RealEstate':
        model = RealEstate;
        break;
      case 'AdditionalData':
        model = AdditionalData;
        break;
      default:
        model = null;
    }
  
    if (model) {
      try {
        await model.findByIdAndDelete(idToDelete);
        res.redirect('/'); // Redirect to the main page or another appropriate page
      } catch (error) {
        console.error('Error deleting record:', error);
        res.status(500).send('Internal Server Error');
      }
    } else {
      res.status(400).send('Invalid schema');
    }
  });
  

  if (model) {
    const data = await model.find();
    res.render('index', { schema: selectedSchema, data });
  } else {
    res.render('index', { schema: null, data: null });
  }
});


app.post('/update', async (req, res) => {
  const updateSchema = req.body.schema;
  const updateId = req.body.id;
  const columnName = req.body.columnName;
  const columnValue = req.body.columnValue;

  let updateModel;

  switch (updateSchema) {
    case 'Feedback':
      updateModel = Feedback;
      break;
    case 'RealEstate':
      updateModel = RealEstate;
      break;
    case 'AdditionalData':
      updateModel = AdditionalData;
      break;
    default:
      updateModel = null;
  }

  if (updateModel) {
    try {
      const updateFields = {};
      updateFields[columnName] = columnValue;

      // Use findOneAndUpdate to find and update a specific record based on ID
      const updatedRecord = await updateModel.findOneAndUpdate({ _id: updateId }, updateFields, { new: true });

      if (updatedRecord) {
        console.log(`Successfully updated record with ID ${updateId} in schema ${updateSchema}`);
        // Redirect to the display page after update
        res.redirect('/');
      } else {
        console.log(`Record with ID ${updateId} not found in schema ${updateSchema}`);
        res.send('Record not found');
      }
    } catch (error) {
      console.error('Error updating record:', error);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.status(400).send('Invalid schema for update');
  }
});


app.listen(3000, () => {
  console.log('Сервер запущен на порту 3000');
});
