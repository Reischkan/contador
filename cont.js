const express = require('express');
const XLSX = require('xlsx');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.post('/calculate-consumption', (req, res) => {
  // Obtener los datos de la solicitud
  const { date, period } = req.body;

  // Obtener los datos de consumo
  const consumptionData = getConsumptionData(date, period);

  // Calcular el consumo por hora o día según el período
  if (period === 'daily') {
    const consumptionByHour = [];
    for (let i = 0; i < 24; i++) {
      const hourStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), i);
      const hourEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), i + 1);
      consumptionByHour.push(calculateHourlyConsumption(consumptionData, hourStart, hourEnd));
    }
    res.send(consumptionByHour);
  } else if (period === 'weekly') {
    // Calcular el consumo por día para cada día de la semana
  } else if (period === 'monthly') {
    // Calcular el consumo por día para cada día del mes
  }
});

async function getConsumptionData(date, period) {
    // Leer el archivo de Excel con los datos de consumo
    const workbook = XLSX.readFile('query_result_2022-10-31T16_08_23.174531Z.xlsx');
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);
  
    // Convertir la fecha de la solicitud a un objeto Date
    const requestDate = new Date(date);
    console.log(requestDate);

    // Filtrar los datos por la fecha y el período especificados
    if (period === 'daily') {
      data = data.filter(d => {
        const meterTimestamp = Date.parse(d.meter_date);
        const meterDate = new Date(meterTimestamp);
        return meterDate.getDate() === requestDate.getDate();
      });
    } else if (period === 'weekly') {
      data = data.filter(d => {
        const meterTimestamp = Date.parse(d.meter_date);
        const meterDate = new Date(meterTimestamp);
        return meterDate.getWeek() === requestDate.getWeek();
      });
    } else if (period === 'monthly') {
      data = data.filter(d => {
        const meterTimestamp = Date.parse(d.meter_date);
        const meterDate = new Date(meterTimestamp);
        return meterDate.getMonth() === requestDate.getMonth();
      });
  } 
}

function calculateHourlyConsumption(consumptionData, startTime, endTime) {
  // Filtrar los datos de consumo por la hora especificada
  const filteredData = consumptionData.filter(d => d.timestamp >= startTime && d.timestamp < endTime);
  // Calcular el consumo total para la hora utilizando el último y el primer registro
  return filteredData[filteredData.length - 1].consumption - filteredData[0].consumption;
}

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});