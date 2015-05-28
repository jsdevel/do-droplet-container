'use strict';

describe('do-droplet-container', function() {
  var config = require('./helpers/do-config');
  var DO = require('digital-ocean-api');
  var api = new DO(config);
  var sut = require('../lib/container')(config);
  var container;

  this.timeout(0);

  beforeEach(function() {
    container = {
      specific: {
        dropletId: null,
        imageId: null,
      }
    };
  });

  describe('.start()', function() {
    describe('when the container has an associated dropletId', function() {
      var DROPLET_ID = 5451753;
      beforeEach(function() {
        container.specific.dropletId = DROPLET_ID;
      });

      afterEach(function(done) {
        api.powerOffDroplet(DROPLET_ID, done);
      });

      it('should start it', function(done) {
        sut.start('live', {}, {}, {}, container, {}, function(err, droplet) {
          droplet.status.should.equal('active');
          done(err);
        });
      });
    });

    describe('when the container has no associated dropletId', function() {
      describe('when the container has an imageId', function() {
        var dropletId;

        beforeEach(function() {
          container.specific.imageId = 'ubuntu-14-04-x64';
        });

        afterEach(function(done) {
          api.deleteDroplet(dropletId, done);
        });

        it('should create a new droplet', function(done) {
          sut.start('live', {}, {}, {}, container, {}, function(err, droplet) {
            dropletId = droplet.id;
            droplet.status.should.equal('active');
            done(err);
          });
        });
      });
    });
  });
});
