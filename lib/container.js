/*
 * THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESSED OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING
 * IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

'use strict';

var async = require('async');
var _ = require('lodash');
var bunyan = require('bunyan');
var DO = require('digital-ocean-api');

module.exports = function(config, logger) {
  var api = new DO(config);
  var pollErrCount = 0;

  logger = logger || bunyan.createLogger({name: 'do-droplet-container'});


  /*---- start async utility functions ----*/

  function startDropletIfOff(droplet, cb) {
    var dropletId = droplet.id;
    if (droplet.status === 'active') {
      cb(null, droplet);
    } else {
      api.powerOnDroplet(dropletId, function pollDroplet(err, response) {
        if (response.status !== 'active') {
          api.getDroplet(dropletId, pollDroplet);
        } else {
          api.getDroplet(dropletId, cb);
        }
      });
    }
  }

  /*---- end async utility functions ----*/



  /**
   * build the container
   * cdef - contianer definition block
   * out - ouput stream
   * cb - complete callback
   */
  var build = function build(mode, system, cdef, out, cb) {
    // GOOD
    logger.info('building');
    out.stdout('building');
    cb();
  };



  /**
   * deploy the continaer
   * target - target to deploy to
   * system - the target system defintinion
   * cdef - the contianer definition
   * container - the container as defined in the system topology
   * out - ouput stream
   * cb - complete callback
   */
  var deploy = function deploy(mode, target, system, containerDef, container, out, cb) {
    // GOOD
    logger.info('deploying');
    out.stdout('deploying');
    cb();
  };



  /**
   * undeploy the container from the target
   * target - target to deploy to
   * system - the target system defintinion
   * cdef - the contianer definition
   * container - the container as defined in the system topology
   * out - ouput stream
   * cb - complete callback
   */
  var undeploy = function undeploy(mode, target, system, containerDef, container, out, cb) {
    // GOOD
    logger.info('undeploying');
    out.stdout('undeploying');
    cb();
  };

  /**
   * start the container on the target.  An image needs to be predefined.  This
   * operation will spin up droplets based on an image.
   *
   * mode - the mode nscale is currently running in
   * target - target to deploy to
   * system - the target system defintinion
   * cdef - the contianer definition
   * container - the container as defined in the system topology
   * out - ouput stream
   * cb - complete callback
   */
  var start = function start(mode, target, system, containerDef, container, out, cb) {
    // need to fire up a droplet instance here
    logger.info('starting');
    //out.stdout('starting');

    if (container.specific) {
       var dropletId = container.specific.dropletId;
       var imageId = container.specific.imageId;
    }

    if (dropletId) {
      // start the droplet
      async.waterfall([
        api.getDroplet.bind(api, dropletId),
        startDropletIfOff,
      ], cb);
    } else if (imageId) {
      // create the droplet and start it
      async.waterfall([
        api.createDroplet.bind(api, {
          // TODO externalize these
          name: 'do-droplet',
          region: 'sfo1',
          size: '512mb',
          image: imageId,
          ssh_keys: null,
          backups: false,
          ipv6: true,
          user_data: null,
          private_networking: null
        }),
        startDropletIfOff,
      ], cb);
    }
  };



  /**
   * stop the container on the target
   * target - target to deploy to
   * system - the target system defintinion
   * cdef - the contianer definition
   * container - the container as defined in the system topology
   * out - ouput stream
   * cb - complete callback
   */
  var stop = function stop(mode, target, system, containerDef, container, out, cb) {
    // GOOD
    logger.info('stopping');
    out.stdout('stopping');
    cb();
  };


  /**
   * link the container to the target
   * target - target to deploy to
   * system - the target system defintinion
   * cdef - the contianer definition
   * container - the container as defined in the system topology
   * out - ouput stream
   * cb - complete callback
   */
  var link = function link(mode, target, system, containerDef, container, out, cb) {
    // ignore for now.  LB isn't supported by DO.
    logger.info('linking');
    out.stdout('linking');

    cb(null, system);
  };



  /**
   * unlink the container from the target
   * target - target to deploy to
   * system - the target system defintinion
   * cdef - the contianer definition
   * container - the container as defined in the system topology
   * out - ouput stream
   * cb - complete callback
   */
  var unlink = function unlink(mode, target, system, containerDef, container, out, cb) {
    // ignore for now.  LB isn't supported by DO.
    logger.info('unlinking');
    out.stdout('unlinking');
    cb(null, target);
  };



  return {
    build: build,
    deploy: deploy,
    start: start,
    stop: stop,
    link: link,
    unlink: unlink,
    undeploy: undeploy,
    add: deploy,
    remove: undeploy
  };
};
