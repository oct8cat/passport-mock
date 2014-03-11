(function() {
    'use strict';

    var inherits = require('util').inherits;

    module.exports = function(passport) {

        var exports = {};

        function TestStrategy(options, verify) {
            if (!options) {
                options = {};
            }
            if (typeof options === 'function') {
                verify = options;
                options = {};
            }
            this.name = 'test';
            this.verify = verify;
        }

        inherits(TestStrategy, passport.Strategy);

        TestStrategy.prototype.authenticate = function(req) {
            var self = this;
            function verified(err, user, info) {
                if (err) { self.error(err); return; }
                if (!user) { self.fail(info); return; }
                self.success(user, info);
            }

            self.verify(req.params.user, verified);
        };

        exports.Strategy = TestStrategy;

        return exports;
    };

})();
