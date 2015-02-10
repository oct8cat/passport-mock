'use strict';

/* global describe, it, before */

var supertest = require('supertest'),
    express = require('express'),
    expressSession = require('express-session'),
    app = express(),
    passport = require('passport'),
    users = require('./fixtures.json'),
    mock = require('../lib/mock')(passport, users)

app.use(expressSession({secret: 'secret', saveUninitialized: true, resave: true}))
app.use(passport.initialize())
app.use(passport.session())

app.get('/anonymous', function(req, res) { res.status(200).end() })
app.get('/user', function(req, res) { res.status(req.user ? 200 : 403).end() })
app.get('/admin', function(req, res) { res.status(req.user && req.user.is_admin ? 200 : 403).end() })

mock(app)

describe('anonymous', function() {
    var agent = supertest.agent(app)
    it('can access /anonymous', function(done) {
        agent.get('/anonymous').expect(200, done)
    })
    it('cannot access /user', function(done) {
        agent.get('/user').expect(403, done)
    })
    it('cannot access /admin', function(done) {
        agent.get('/admin').expect(403, done)
    })
})

describe('user', function() {
    var agent = supertest.agent(app)
    before(function(done) { agent.get('/login/test/2').expect(200, done) })
    it('can access /anonymous', function(done) {
        agent.get('/anonymous').expect(200, done)
    })
    it('can access /user', function(done) {
        agent.get('/user').expect(200, done)
    })
    it('cannot access /admin', function(done) {
        agent.get('/admin').expect(403, done)
    })
})

describe('admin', function() {
    var agent = supertest.agent(app)
    before(function(done) { agent.get('/login/test/1').expect(200, done) })
    it('can access /anonymous', function(done) {
        agent.get('/anonymous').expect(200, done)
    })
    it('can access /user', function(done) {
        agent.get('/user').expect(200, done)
    })
    it('can access /admin', function(done) {
        agent.get('/admin').expect(200, done)
    })
})

