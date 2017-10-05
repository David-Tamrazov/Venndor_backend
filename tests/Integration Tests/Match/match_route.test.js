const expect = require('expect');
const request = require('supertest');
const ObjectID = require('mongodb').ObjectID;
const jwt = require('jsonwebtoken');

const app = require('/Users/Dave/Documents/venndor_backend/server.js');
const Match = require('/Users/Dave/Documents/venndor_backend/app/models').Match;
const helper = require('/Users/Dave/Documents/venndor_backend/app/helpers');
const config = require('/Users/Dave/Documents/venndor_backend/app/config');
const testSuite = require('./testSuite.js');


describe("Match get", function() {
  this.timeout(5000);
  before((done) => {
    Match.model.remove({})
    .then(() => { return Match.model.insertMany(testSuite.testMatches) })
    .then(() => done()
    ).catch((e) => done(e));
  });

  after((done) => {
    Match.model.remove({})
    .then(() => {
      return Match.model.remove({})
    })
    .then(() => done())
    .catch((e) => done(e));
  });

  it('should return the matches of the user encoded in the token', (done) => {
    request(app)
      .get('/match/')
      .set('Authorization', testSuite.tokenHeader)
      .expect(200)
      .expect((res) => {
        res.body.matches.forEach((match) => {
          expect(testSuite.testMatches.map((el) => el._id)).toInclude(match._id);
        });
      })
      .end(done);
  });

});

describe("Match post", function() {
  this.timeout(5000);
  before((done) => {
    Match.model.remove({})
    .then(() => done())
    .catch((e) => done(e));
  });

  after((done) => {
    Match.model.remove({})
    .then(() => done())
    .catch((e) => done(e));
  });

  it('should succesfully post a match with the specified parameters', (done) => {

    request(app)
    .post('/match/')
    .set('Authorization', testSuite.tokenHeader)
    .send({ params: testSuite.postParameters })
    .expect(200)
    .expect((res) => {
      expect(res.body.match).toInclude(testSuite.postParams);
    })
    .end((err, res) => {
      if(err) {
        return done(err);
      }

      Match.model.find({}).then((matches) => {
        expect(matches.length).toBe(1);
        expect(matches[0]).toInclude(testSuite.postParams);
        done();
      }).catch((e) => done(e));
    })
  });

  it('should return a 500 error if bad match parameters are passed', (done) => {
    request(app)
    .post('/match/')
    .set('Authorization', testSuite.tokenHeader)
    .send({ params: testSuite.badPostParams})
    .expect(500)
    .end(done);
  });

  it('should return a 400 error if no parameters are passed', (done) =>{
    request(app)
    .post('/match/')
    .set('Authorization', testSuite.tokenHeader)
    .expect(400)
    .end(done);
  });

});

describe("Match update", function(){
  
  this.timeout(5000);
  before((done) => {
    Match.model.remove({})
    .then(() => Match.model.create(testSuite.testMatch))
    .then(() => done())
    .catch((e) => done(e));
  });

  after((done) => {
    Match.model.remove({})
    .then(() => done())
    .catch((e) => done(e));
  })

  it('should update testMatch.matchedPrice to 20', (done) =>{

    request(app)
    .put(testSuite.realMatchUrl)
    .set('Authorization', testSuite.tokenHeader)
    .send({ params: { matchedPrice: 20}})
    .expect(200)
    .end((err, res) => {
      if (err) {
        return done(err);
      }

      Match.model.findOne({ _id: testSuite.testMatch._id})
      .then(match => {
        expect(match.matchedPrice).toBe(20);
        done();
      })
      .catch((e) => done(e));
    });
  });

  it('should return a 500 error if bad update parameters are passed', (done) => {
    request(app)
    .put(testSuite.realMatchUrl)
    .set("Authorization", testSuite.tokenHeader)
    .send({ params: { matchedPrice: "Not a number"}})
    .expect(500)
    .end(done);
  });

  it('should return a 400 error if no parameters are passed', (done) =>{
    request(app)
    .put(testSuite.realMatchUrl)
    .set("Authorization", testSuite.tokenHeader)
    .expect(400)
    .end(done);
  });

  it('should return a 404 error not found if the specified match was not found', (done) => {

    request(app)
    .put(testSuite.fakeMatchUrl)
    .set("Authorization", testSuite.tokenHeader)
    .send({ params: { matchedPrice: 20 } })
    .expect(404)
    .end(done);
  });
});

describe("Match delete", function() {

  this.timeout(5000);
  before((done) => {
    Match.model.remove({})
    .then(() => Match.model.create(testSuite.testMatch))
    .then(() => Match.model.create(testSuite.testMatches))
    .then(() => done())
    .catch((e) => done(e))
  });

  after((done) => {
    Match.model.remove({})
    .then(() => done())
    .catch((e) => done(e))
  });

  it('should delete the specified match', (done) =>{

    request(app)
    .delete(testSuite.realMatchUrl)
    .set('Authorization', testSuite.tokenHeader)
    .expect(200)
    .end((err, res) =>{
      if (err) {
        return done(err);
      }

      Match.model.find({"_id": testSuite.testMatch._id})
      .then((matches) => expect(matches.length).toBe(0))
      .then(() => done())
      .catch((e) => done(e));
    });

  });

  it('should delete all of the test user matches', (done) => {
  
    request(app)
    .delete("/match/")
    .set('Authorization', testSuite.tokenHeader)
    .expect(200)
    .end((err, res) => {
      if(err) {
        return done(err);
      }

      Match.model.find({})
      .then((matches) => expect(matches.length).toBe(0))
      .then(() => done())
      .catch((e) => done(e));
    });
  });

  it('should return a 404 error if the match is not found', (done) =>{

    request(app)
    .delete(testSuite.fakeMatchUrl)
    .set('Authorization', testSuite.tokenHeader)
    .expect(404)
    .end(done());

  });

});
