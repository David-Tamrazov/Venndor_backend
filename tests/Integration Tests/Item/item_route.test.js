const expect = require('expect');
const request = require('supertest');
const app = require('/Users/Dave/Documents/venndor_backend/server.js');
const Item = require('/Users/Dave/Documents/venndor_backend/app/models').Item;
const Match = require('/Users/Dave/Documents/venndor_backend/app/models').Match;
const testSuite = require('./testSuite.js');

describe('Item get', function () {

  this.timeout(5000);
  before((done) => {
    Item.model.remove({})
    .then(() => Item.model.insertMany(testSuite.testItems))
    .then(() => Match.model.insertMany(testSuite.testMatches))
    .then(() => done())
    .catch((e) => {
      done(e);
    });
  });

  after((done) => {
    Item.model.remove({})
    .then(() => Match.model.remove({}))
    .then(() => done())
    .catch((e) => done(e));
  });

  // it('should fetch an item feed for the specified user succesfully', (done) => {
  //
  //   request(app)
  //     .get('/item/')
  //     .set('Authorization', testSuite.tokenHeader)
  //     .send({
  //       params: {
  //         seenPosts: testSuite.seenPosts
  //       }
  //     })
  //     .expect(200)
  //     .expect((res) => {
  //       res.body.itemFeed.forEach(item => {
  //         expect(testSuite.fetchItems.map(item => item._id)).toInclude(item._id);
  //         expect(testSuite.matchItems.map(item => item._id)).toExclude(item._id);
  //         expect(testSuite.seenItems.map(item => item._id)).toExclude(item._id);
  //         expect(testSuite.ownedItems.map(item => item._id)).toExclude(item._id);
  //       });
  //     })
  //     .end(done);
  // });

  it('should return a 401 error when no token is provided for fetching the feed', (done) => {
    request(app)
      .get('/item/')
      .send({
        seenPosts: testSuite.seenPosts
      })
      .expect(401)
      .end(done);
  });

  it('should return a 400 error if no parameters are provided', (done) => {
    request(app)
      .get('/item/')
      .set('Authorization', testSuite.tokenHeader)
      .expect(400)
      .end(done);
  });

});

describe('Item post', function() {

  this.timeout(5000);
  beforeEach((done) => {
    Item.model.remove({})
    .then(() => done())
    .catch((e) => done(e));
  });

  afterEach((done) => {
    Item.model.remove({})
    .then(() => done())
    .catch((e) => done(e));
  });

  it('should succesfully post an item with the specified parameters.', (done) => {

    let parameters = testSuite.postParams;

    request(app)
      .post('/item/')
      .set('Authorization', testSuite.tokenHeader)
      .send({ params: parameters })
      .expect(200)
      .expect((res) => {
        expect(res.body.item).toInclude(parameters);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Item.model.find().then((items) => {
          expect(items.length).toBe(1);
          expect(items[0]).toInclude(testSuite.postParameters);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return a 500 error if bad item parameters are passed', (done) => {
    request(app)
    .post('/item/')
    .set('Authorization', testSuite.tokenHeader)
    .send({ params: testSuite.badPostParams})
    .expect(500)
    .end(done);
  });

  it('should return a 400 error if no parameters are passed', (done) =>{

    request(app)
    .post('/item/')
    .set('Authorization', testSuite.tokenHeader)
    .expect(400)
    .end(done);
  });

  it('should return a 400 error if undefined parameters are passed', (done) =>{

    request(app)
    .post('/item/')
    .set('Authorization', testSuite.tokenHeader)
    .send({ params: { test: "These are bad parameters."}})
    .expect(400)
    .end(done);
  });

});

describe('Item update', function () {

  this.timeout(5000);
  before((done) => {
    Item.model.remove({})
    .then(() => Item.model.create(testSuite.testItem))
    .then(() => done())
    .catch((e) => done(e));
  });

  after((done) => {
    Item.model.remove({})
    .then(() => done())
    .catch((e) => done(e));
  });

  it('should update testItem.category to Electronics', (done) => {

    request(app)
    .put(testSuite.realItemUrl)
    .set("Authorization", testSuite.tokenHeader)
    .send({ params: { category: "Electronics" }})
    .expect(200)
    .end((err, res) => {
      if (err) {
        return done(err);
      }

      Item.model.findOne({_id: testSuite.testItem._id})
      .then(item =>{
        expect(item.category).toBe("Electronics");
        done();
      })
      .catch((e) => done(e));
    });
  });

  it('should return a 500 error if bad update parameters are passed', (done) => {

    request(app)
    .put(testSuite.realItemUrl)
    .set("Authorization", testSuite.tokenHeader)
    .send({ params: { category: "Bad params" }})
    .expect(500)
    .end(done);
  });

  it('should return a 400 error if no parameters are passed', (done) => {

    request(app)
    .put(testSuite.realItemUrl)
    .set("Authorization", testSuite.tokenHeader)
    .expect(400)
    .end(done);
  });

  it('should return a 404 error not found if the specified item was not found', (done) => {

    request(app)
    .put(testSuite.fakeItemUrl)
    .set("Authorization", testSuite.tokenHeader)
    .send({ params: { category: "Furniture" }})
    .expect(404)
    .end(done);
  });

});

describe("Item delete", function() {

  this.timeout(5000);
  before((done) => {
    Item.model.remove({})
    .then(() => Item.model.create(testSuite.testItem))
    .then(() => Match.model.create(testSuite.testMatch))
    .then(() => done())
    .catch((e) => done(e));
  });

  after((done) => {
    Item.model.remove({})
    .then(() => Match.model.remove({}))
    .then(() => done())
    .catch((e) => done(e));
  });

  it("should delete the item and all matches associated with it", (done) =>{
    request(app)
    .delete(testSuite.realItemUrl)
    .set('Authorization', testSuite.tokenHeader)
    .expect(200)
    .end((err, res) => {
      if (err) {
        return done(err);
      }

      Item.model.find({})
      .then((items) => expect(items.length).toBe(0))
      .then(() => Match.model.find({}))
      .then((matches) => expect(matches.length).toBe(0))
      .then(() => done())
      .catch((e) => done(e));
    });
  });

  it("should return a 404 error if the specified item is not found.", (done) => {
    
    request(app)
    .delete(testSuite.fakeItemUrl)
    .set('Authorization', testSuite.tokenHeader)
    .expect(404)
    .end(done);
  });

});
