const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { getConsumptionData } = require('./cont');

chai.use(chaiAsPromised);
const { expect } = chai;

describe('getConsumptionData', () => {
  it('should return an array of consumption data objects', async () => {
    const date = '2022-10-31';
    const period = 'daily';
    const result = await getConsumptionData(date, period);
    expect(result).to.be.an('array');
    expect(result[0]).to.have.keys(['meter_date', 'meter_id', 'active_energy']);
  });
});