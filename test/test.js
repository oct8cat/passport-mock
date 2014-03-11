(function() {
    'use strict';

    var passport = require('passport');
    var users = require('./users.json');
    var passportMock = require('../lib/passportMock')(passport, users);

    var express = require('express');
    var app = express();

    var session = {secret: 'secret'};


    app.use(express.cookieParser(session.secret));
    app.use(express.session(session));
    app.use(passport.initialize());
    app.use(passport.session(session));

    app.get('/anonymous', function(req, res) { res.send(200); });
    app.get('/user', function(req, res) { res.send(req.user ? 200 : 403); });
    app.get('/admin', function(req, res) { res.send(req.user && req.user.is_admin ? 200 : 403); });


    var supertest = require('supertest');
    var superagent = require('superagent');
    var request = supertest(passportMock(app));


    it('should allow all on /anonymous', function(done) {
        request.get('/anonymous').expect(200, done);
    });

    it('should deny anonymous on /user', function(done) {
        request.get('/user').expect(403, done);
    });

    it('should deny anonymous on /admin', function(done) {
        request.get('/user').expect(403, done);
    });

    it('should allow user on /user', function(done) {
        var agent = superagent.agent();
        request.get('/login/test/2').expect(200, function(err, res) {
            agent.saveCookies(res.res);
            var req = request.get('/user');
            agent.attachCookies(req);
            req.expect(200, done);
        });
    });

    it('should deny user on /admin', function(done) {
        var agent = superagent.agent();
        request.get('/login/test/2').expect(200, function(err, res) {
            agent.saveCookies(res.res);
            var req = request.get('/admin');
            agent.attachCookies(req);
            req.expect(403, done);
        });
    });

    it('should allow admin on /admin', function(done) {
        var agent = superagent.agent();
        request.get('/login/test/1').expect(200, function(err, res) {
            agent.saveCookies(res.res);
            var req = request.get('/admin');
            agent.attachCookies(req);
            req.expect(200, done);
        });
    });
})();
