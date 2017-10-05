const expect = require('chai').expect;
const app = require('/Users/Dave/Documents/venndor_backend/server.js');
const Event = require('/Users/Dave/Documents/venndor_backend/app/models').Event;
const testSuite = require('./testSuite.js');

describe('Event post', function () {

    afterEach((done) => {
        Event.model.remove({})
            .then(() => done())
            .catch((e) => done(e));
    });

    it('should create an event with the correct parameters', (done) => {

        Event.createEvent(testSuite.testUser, testSuite.postParams, (err, event) =>{

            try {
                expect(err).to.be.null;
                expect(event._doc).to.deep.include(testSuite.postParams);
                done();
            } catch (e) {
                done(e);
            }

        });
    
    });

    it('should return a server error if bad parameters are passed through', (done) => {
        
        Event.createEvent(testSuite.badUser, testSuite.badPostParams, (err, event) => {
            
            try {
                expect(err).to.not.be.null;
                expect(event).to.be.null;
                done();
            } catch (e) {
                done(e);
            }

        });
    
    });
    
});

describe('Event delete', function () {
    before((done) => {
        Event.model.insertMany(testSuite.testEvents)
            .then(() => done())
            .catch((e) => done(e));
    });

    after((done) =>{
        Event.model.remove({})
            .then(() => done())
            .catch((e) => done(e));
    })

    it('should delete all events associated with the test user', (done) => {

        Event.deleteUserEvents(testSuite.userId, (err, success) => {

            try {

                expect(err).to.be.null;
                expect(success).to.be.true;

                Event.model.find({ "userId": testSuite.userId }, (err, docs) => {
                 expect(docs.length).to.equal(0);
                    done();
                })
            } catch (e) {
                done(e);
            }
            

        });

    });
});