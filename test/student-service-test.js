const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const app = require('../index');
const should = chai.should();
const expect = chai.expect;
const sinon = require('sinon');
const stub = sinon.stub;
const StudentService = require('../service/student-service.js');
const Registry = require('../model/registry.js');
const Student = require('../model/student.js');
const {
  ErrorHandler
} = require('../helper/error-handler');
const { DatabaseResultHandler } = require('../helper/database-result-handler');

describe('student service - register()', () => {
  it('should throw error when required field is empty', done => {
    StudentService.register(undefined, undefined).should.be.rejectedWith(ErrorHandler);
    StudentService.register(undefined, []).should.be.rejectedWith(ErrorHandler);
    StudentService.register(undefined, ['test']).should.be.rejectedWith(ErrorHandler);
    StudentService.register('', ['test']).should.be.rejectedWith(ErrorHandler);
    StudentService.register('test', []).should.be.rejectedWith(ErrorHandler);
    StudentService.register('test', undefined).should.be.rejectedWith(ErrorHandler);
    done();
  });
  it('should throw error when student is already registered with the teacher', done => {
    const s = stub(Registry, 'register').callsFake(() => {
      return new DatabaseResultHandler(true, 'DUP_ENTRY')
    });
    StudentService.register('test', ['test']).should.be.rejectedWith(ErrorHandler);
    s.restore();
    done();
  });
  it('should throw error when there is no such student or teacher', done => {
    const s = stub(Registry, 'register').callsFake(() => {
      return new DatabaseResultHandler(true, 'NO_REFERENCED')
    });
    StudentService.register('test', ['test']).should.be.rejectedWith(ErrorHandler);
    s.restore();
    done();
  });
  it('should silently successful', done => {
    const s = stub(Registry, 'register').callsFake(() => 'something');
    let teacher = 'test';
    let students = ['test'];
    StudentService.register(teacher, students).should.be.fulfilled.notify(done);
    s.restore();
  });
});

describe('student service - getCommonStudents()', () => {
  it('should throw error when required field is empty', done => {
    StudentService.getCommonStudents(undefined).should.be.rejectedWith(ErrorHandler);
    StudentService.getCommonStudents('').should.be.rejectedWith(ErrorHandler);
    done();
  });
  it('should return a list of students', done => {
    const s = stub(Registry, 'getRegisteredStudents').callsFake(() => ['test']);
    StudentService.getCommonStudents('test').should.become(['test']).notify(done);
    s.restore();
  });
});

describe('student service - suspend()', () => {
  it('should throw error when required field is empty', done => {
    StudentService.suspend(undefined).should.be.rejectedWith(ErrorHandler);
    StudentService.suspend('').should.be.rejectedWith(ErrorHandler);
    done();
  });
  it('should throw error when there is no such student', done => {
    const s = stub(Student, 'updateSuspend').callsFake(() => {
      return {
        affectedRows: 0
      }
    });
    StudentService.suspend(['test']).should.be.rejectedWith(ErrorHandler);
    s.restore();
    done();
  });
  it('should silently successful', done => {
    const s = stub(Student, 'updateSuspend').callsFake(() => {
      return {
        affectedRows: 1
      }
    });
    StudentService.suspend(['test']).should.be.fulfilled.notify(done);
    s.restore();
  });
});

describe('student service - getForNotifications()', () => {
  it('should throw error when required field is empty', done => {
    StudentService.getForNotifications('', '').should.be.rejectedWith(ErrorHandler);
    StudentService.getForNotifications(undefined, '').should.be.rejectedWith(ErrorHandler);
    StudentService.getForNotifications('', undefined).should.be.rejectedWith(ErrorHandler);
    StudentService.getForNotifications(undefined, undefined).should.be.rejectedWith(ErrorHandler);
    done();
  });
  it('should return a list of students registered with teacher or mentioned in notification', done => {
    const s = stub(Registry, 'getNonSuspendedRegisteredStudents').callsFake(() => {
      return ['a@a.com', 'b@b.net']
    });
    const r = stub(Student, 'getNonSuspendedStudents').callsFake(() => {
      return ['b@b.net', 'c@c.co']
    });
    StudentService.getForNotifications('test', 'mentioned @b@b.net and @c@c.co @nonexiststudent')
    .should.become(['a@a.com', 'b@b.net', 'c@c.co']).notify(done);
    s.restore();
    r.restore()
  });
});
