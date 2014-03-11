(function() {
    'use strict';

    var _ = require('underscore');

    module.exports = function(passport, users) {

        var TestStrategy = require('./strategy')(passport).Strategy;

        function verify(id, done) {
            var user = _.findWhere(users, {id: Number(id)});
            var info = user ? null : 'User not found';
            done(null, user || false, info);
        }

        function PassportMock(app, options) {
            passport.use(new TestStrategy(options, verify));
            passport.serializeUser(function(user, done) { done(null, user.id); });
            passport.deserializeUser(function(id, done) { done(null, _.findWhere(users, {id: Number(id)})); });

            app.get('/login/test/:user', passport.authenticate('test'));
            return app;
        }

        return PassportMock;
    };

})();
