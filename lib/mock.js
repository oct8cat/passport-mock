'use strict';

var util = require('util'),
    _ = require('underscore')

module.exports = function(passport, users) {

/**
 * Retrieves an user from users array by ID.
 */
var getUser = function(id) { return _.findWhere(users, {id: Number(id)}) }

/**
 * @alias TestStrategy
 * @constructor
 */
var TestStrategy = function TestStrategy(options, verify) {
    if (typeof options === 'function') { verify = options; options = {} }
    this.name = 'test'
    this.verify = verify
}
util.inherits(TestStrategy, passport.Strategy)

TestStrategy.prototype.authenticate = function(req) {
    var that = this
    that.verify(req.params.user, function(err, user, info) {
        if (err) { that.error(err); return }
        if (!user) { that.fail(info); return }
        that.success(user, info)
    })
}


/**
 * @param {object} app Express application to be mocked.
 * @param {object} options
 */
return function mock(app, options) {
    passport.use(new TestStrategy(options, function(id, done) {
        var user = getUser(id),
            info = user ? null : 'User not found'
        done(null, user || false, info)
    }))
    passport.serializeUser(function(user, done) { done(null, user.id) })
    passport.deserializeUser(function(user, done) { done(null, getUser(user)) })

    app.get('/login/test/:user', passport.authenticate('test'), function(req, res) {
        res.send(req.user)
    })

    return app
}

}
