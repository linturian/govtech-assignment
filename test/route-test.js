const chai = require('chai');
const chatHttp = require("chai-http");
chai.use(chatHttp);
const app = require('../index');
const should = chai.should();
const expect = chai.expect;
const sinon = require('sinon');
const stub = sinon.stub;
const StudentService = require('../service/student-service.js');
const {
  DatabaseResultHandler
} = require('../helper/database-result-handler');
const {
  ErrorHandler
} = require('../helper/error-handler');

describe('POST /api/register', () => {
  afterEach(done => {
    StudentService.register.restore();
    done();
  });
  it('should return 204 status', done => {
    stub(StudentService, 'register').resolves({});
    chai
      .request(app)
      .post('/api/register')
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(204);
        done();
      });
  });
  it('should return error status when something is wrong in service layer', done => {
    stub(StudentService, 'register').throws(new ErrorHandler(422, ["Something went wrong"]));
    chai
      .request(app)
      .post('/api/register')
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(422);
        done();
      });
  });
});

describe('GET /api/getCommonStudents', () => {
  afterEach(done => {
    StudentService.getCommonStudents.restore();
    done();
  });
  it('should return 200 status', done => {
    const students = [
      "studentjon@gmail.com",
      "studenthon@gmail.com"
    ]
    stub(StudentService, 'getCommonStudents').resolves(students);
    chai
      .request(app)
      .get('/api/commonStudents?teacher=test')
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.a.property('students').that.deep.equal(students)
        done();
      });
  });
  it('should return error status when something is wrong in service layer', done => {
    stub(StudentService, 'getCommonStudents').throws(new ErrorHandler(422, ["Something went wrong"]));
    chai
      .request(app)
      .get('/api/commonStudents')
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(422);
        done();
      });
  });
});

describe('POST /api/suspend', () => {
  afterEach(done => {
    StudentService.suspend.restore();
    done();
  });
  it('should return 204 status', done => {
    stub(StudentService, 'suspend').resolves({});
    chai
      .request(app)
      .post('/api/suspend')
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(204);
        done();
      });
  });
  it('should return error status when something is wrong in service layer', done => {
    stub(StudentService, 'suspend').throws(new ErrorHandler(422, ["Something went wrong"]));
    chai
      .request(app)
      .post('/api/suspend')
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(422);
        done();
      });
  });
});

describe('POST /api/retrievefornotifications', () => {
  afterEach(done => {
    StudentService.getForNotifications.restore();
    done();
  });
  it('should return 200 status', done => {
    const recipients = [
      "studentjon@gmail.com",
      "studenthon@gmail.com"
    ]
    stub(StudentService, 'getForNotifications').resolves(recipients);
    chai
      .request(app)
      .post('/api/retrievefornotifications')
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.a.property('recipients').that.deep.equal(recipients)
        done();
      });
  });
  it('should return error status when something is wrong in service layer', done => {
    stub(StudentService, 'getForNotifications').throws(new ErrorHandler(422, ["Something went wrong"]));
    chai
      .request(app)
      .post('/api/retrievefornotifications')
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(422);
        done();
      });
  });
});
