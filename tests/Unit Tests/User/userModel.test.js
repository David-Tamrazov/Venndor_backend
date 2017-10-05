const expect = require('chai').expect;
const app = require('/Users/Dave/Documents/venndor_backend/server.js');
const User = require('/Users/Dave/Documents/venndor_backend/app/models').User;
const Item = require('/Users/Dave/Documents/venndor_backend/app/models').Item;
const ObjectID = require('mongodb').ObjectID;
const testSuite = require('./testSuite.js');


describe('User upsert', function () {

    before((done) => {
        User.model.remove({})
            .then(() => User.model.create(testSuite.testUser))
            .then(() => done())
            .catch((e) => done(e));
    });

    after((done) => {
        User.model.remove({})
            .then(() => done())
            .catch((e) => done(e));
    });

    it('should create a new document when passed params for a new user', (done) => {

        User.serialize(testSuite.upsertNewParams, (err, user) => {
            
            try {
                expect(err).to.be.null;
                expect(user._doc).to.deep.include(testSuite.upsertNewValidation);
                return done();

            } catch (e) {
                return done(e);
            }

        });
    
    });

    it('should update an existing document when passed params for an existing user', (done) => {
        
        User.serialize(testSuite.upsertOldParams, (err, user) => {

            try {
                expect(err).to.be.null;
                expect(user._doc.firstName).to.equal("Old upsert, New Name - User");
                expect(user._doc.pictureUrl).to.equal("newUrl");

                User.model.find({ fbId: testSuite.upsertOldParams.fbId }, (err, docs) => {
                   
                    try {
                        expect(user._doc.firstName).to.equal("Old upsert, New Name - User");
                        expect(user._doc.pictureUrl).to.equal("newUrl");
                        expect(docs.length).to.equal(1);
                        return done();
                    } catch (e) {
                        return done(e);
                    }   
            });

            } catch (e) {
                return done(e);
            }

        });

    });

    it('should return an error if bad parameters are passed', (done) => {
       
        var user = new User.model(testSuite.badUpsertParams);
        user.validate((err) => {

            try {
                expect(err.errors.bookmarks).to.exist;
                expect(err.errors.firstName).to.exist;
                return done();
            } catch (e) {
                return done(e);
            }

        });
        
    });

});

describe('User bookmarks create', function () {

    before((done) => {
        User.model.remove({})
            .then(() => User.model.create(testSuite.testUser))
            .then(() => Item.model.insertMany(testSuite.testItems))
            .then(() => done())
            .catch((e) => done(e));
    });

    after((done) => {
        User.model.remove({})
            .then(() => Item.model.remove({}))
            .then(() => done())
            .catch((e) => done(e));
    });

    it ('should push a new bookmark onto the Users bookmarks array given correct parameters', (done) => {
        User.createBookmark(testSuite.testUser._id, testSuite.createBookmarkParams, (err, bookmark) => {
            try {

                expect(err).to.be.null;
                expect(bookmark).to.deep.include(testSuite.createBookmarkParams);

                User.model.findOne({_id: testSuite.testUser._id}, (err, user) => {
                    if (err) {
                        return done (err);
                    }

                    try {
                        expect(user._doc.bookmarks.length).to.equal(3);
                        expect(user._doc.bookmarks[2]).to.exist;
                        return done();

                    } catch(e) {
                        return done(e)
                    }

                });

            } catch (e) {
                return done(e);
            }
        });
    });

    it('should return an error if we pass it bad bookmark parameters', (done) => {

        User.createBookmark(testSuite.testUser._id, testSuite.badBookmarkParams, (err, bookmark) => {
            try {
                expect(bookmark).to.be.null;
                expect(err).to.not.be.null;
                expect(err.status).to.equal(500);
                return done();
            } catch (e) {
                return done(e);
            }
        });

    });

    it('should return a 404 error if we pass it an _id of a user that does not exist', (done) => {

        User.createBookmark(new ObjectID(), testSuite.createBookmarkParams, (err, bookmark) => {
            try {
                expect(bookmark).to.be.null;
                expect(err).to.not.be.null;
                expect(err.status).to.equal(404);
                return done();
            } catch(e) {
                return done(e);
            }
        });

    });

});

describe('User bookmark fetch', function () {

    before((done) => {
        User.model.create(testSuite.testUser)
            .then(() => Item.model.insertMany(testSuite.testItems))
            .then(() => done())
            .catch((e) => done(e));
    });

    after((done) => {
        User.model.remove({})
            .then(() => Item.model.remove({}))
            .then(() => done())
            .catch((e) => done(e));
    })

    it('should retrieve the users bookmarks with the item docs embedded', (done) => {

        User.fetchBookmarks(testSuite.testUser._id, (err, bookmarks) => {

            try {

                let b1 = bookmarks[0]._doc.item;
                let b2 = bookmarks[1]._doc.item;

                expect(err).to.be.null;
                expect(bookmarks).to.not.be.null;
                expect(b1._doc).to.deep.include(testSuite.testItems[0]);
                expect(b2._doc).to.deep.include(testSuite.testItems[1]);
                return done()

            } catch (e) {
                return done(e);
            }

        });

    });

    it('should return a 404 error if no user is found whose bookmarks to retrieve', (done) => {

        User.fetchBookmarks(new ObjectID(), (err, bookmarks) => {
            
            try {

                expect(bookmarks).to.be.null;
                expect(err).to.not.be.null;
                expect(err.status).to.equal(404);
                return done();

            } catch (e) {
                return done(e);
            }
        
        });

    });
});


describe('User bookmark update', function () { 

    before((done) => {
        User.model.create(testSuite.testUser)
            .then(() => done())
            .catch((e) => done());
    });

    after((done) => {
        User.model.remove({})
            .then(() => done())
            .catch((e) => done(e));
    });

    it('should update the first bookmark only, with the correct parameters', (done) => {

        User.updateBookmark(testSuite.testUser._id, testSuite.testItems[0]._id, testSuite.goodBmUpdate, 
        (err, success) => {

            try {

                expect(err).to.be.null;
                expect(success).to.be.true;

                User.model.findOne({ _id: testSuite.testUser._id }, (err, doc) => {

                    try {
                        expect(doc._doc.bookmarks[0].timeOfferMade).to.equal(testSuite.goodBmUpdate.timeOfferMade);
                        expect(doc._doc.bookmarks[0].lastOfferMade).to.equal(testSuite.goodBmUpdate.lastOfferMade);
                        return done();
                    } catch (e) {
                        return done(e);
                    }

                });

            } catch (e) {

                return done(e);

            }

        });
        
    });

    it('should return a 500 error if bad update parameters are passed', (done) => {

       User.updateBookmark(testSuite.testUser._id, testSuite.testItems[0]._id, testSuite.badBmUpdate, 
       (err, success) => {

            try {
                expect(success).to.be.false;
                expect(err).to.not.be.null;
                expect(err.status).to.equal(500);
                return done();

            } catch(e) {
                return done(e);
            }

       });

    });

});


describe('User bookmark delete', function () {

    beforeEach((done) => {
        User.model.create(testSuite.testUser)
            .then(() => done())
            .catch((e) => done(e));
    })

    afterEach((done) => {
        User.model.remove({})
            .then(() => done())
            .catch((e) => done(e));
    });
    
    it('should set the users bookmarks property to an empty array', (done) => {

        //testSuite.testUser._id
        User.deleteBookmarks(testSuite.testUser._id, (err, success) => {

            try {

                 expect(err).to.be.null;
                 expect(success).to.be.true;

                 User.model.findOne({ "_id" : testSuite.testUser._id}, (err, doc) => {

                    try {
                        expect(doc._doc.bookmarks).to.be.an('array').that.is.empty;
                        return done();
                    } catch (e) {
                        return done(e);
                    }

                 });

            } catch(e) {
                return done(e);
            }
        });
    });

    it('should delete only the first entry in the users bookmark array', (done) => {

        User.deleteBookmark(testSuite.testUser._id, testSuite.testItems[0]._id, 
        (err, success) => {

            try {
                expect(err).to.be.null;
                expect(success).to.be.true; 

                User.model.findOne({ "_id" : testSuite.testUser._id}, (err, doc) => {
                    
                    try {

                        let bookmarkId = doc._doc.bookmarks[0].item.toHexString()
                        let validId = testSuite.testItems[1]._id.toHexString()

                        expect(doc._doc.bookmarks.length).to.equal(1);
                        expect(bookmarkId).to.equal(validId);
                        return done();

                    } catch (e) {
                        return done(e);
                    }

                });

            } catch(e) {
                return done(e);
            }

        });

    });

});


describe('User update', function () {

    before((done) => {
        User.model.create(testSuite.testUser)
            .then(() => done())
            .catch((e) => done(e)); 
    })

    after((done) => {
        User.model.remove({})
            .then(() => done())
            .catch((e) => done(e));
    })


    it('should update the user with the correct parameters', (done) => {

        User.updateUser(testSuite.testUser._id, testSuite.goodUserUpdate, 
        (err, success) => {

            try {
                expect(err).to.be.null;
                expect(success).to.be.true;

                User.model.findOne({ "_id" : testSuite.testUser._id }, (err, doc) => {

                    try { 
                        expect(doc._doc.offersInCategory.Furniture).to.equal(100);
                        expect(doc._doc.offersInCategory.Household).to.equal(10);
                        expect(doc._doc.offersInCategory.Electronics).to.equal(15);
                        expect(doc._doc.offersInCategory.Other).to.equal(20);
                        expect(doc._doc.rejectionsInCategory.Furniture).to.equal(100);
                        expect(doc._doc.rejectionsInCategory.Household).to.equal(123);
                        expect(doc._doc.rejectionsInCategory.Electronics).to.equal(16);
                        expect(doc._doc.rejectionsInCategory.Other).to.equal(10)
                        expect(doc._doc.gender).to.equal('Female');
                        return done();
                    } catch(e) {
                        return done(e);
                    }

                });

            } catch(e) {
                return done(e);
            }

        });
    })

    it('should return a server error if passed bad update params', (done) => {

        User.updateUser(testSuite.testUser._id, testSuite.badUserUpdate,
        (err, success) => {

            try {
                expect(success).to.be.false;
                expect(err).to.not.be.null;
                return done();
            } catch (e) {
                return done(e);
            }
        });

    });

});

describe('User delete', function () {
    before((done) => {
        User.model.create(testSuite.testUser)
            .then(() => done())
            .catch((e) => done(e))
    })

    after(() => {
        User.model.remove({})
            .then(() => done())
            .catch((e) => done(e));
    });

    it('should remove the specified user succesfully', (done) => {

        User.deleteUser(testSuite.testUser._id, (err, success) => {

            try {
                expect(err).to.be.null;
                expect(success).to.be.true;

                User.model.find({ "_id" : testSuite.testUser._id}, (err, doc) => {

                    try {
                        expect(doc).to.be.empty;
                        return done();
                    } catch(e) {
                        return done(e);
                    }

                });

            } catch(e) {
                return done(e);
            }
        });
    })

    it('should return a 404 if a nonexistent userId is passed', (done) => {

        User.deleteUser(new ObjectID(), (err, success) => {

            try {
                expect(success).to.be.false;
                expect(err).to.not.be.null;
                expect(err.status).to.equal(404);
                return done();
            } catch(e) {
                return done(e);
            }
            
        });

    })
});

