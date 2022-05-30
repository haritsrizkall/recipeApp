const chai = require('chai')
const chaiHttp = require('chai-http')

const user_routes = "http://localhost:3000/"

chai.should();
chai.use(chaiHttp);

//test ping
describe('Test Ping',()=>{
    it('it should print ping', (done)=>{
        done()
    })
})