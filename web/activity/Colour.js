function Colour(r, g, b, a) {
    // assign any missing values
    this.r = typeof(r) === 'undefined' ? randomValue() : r;
    this.g = typeof(g) === 'undefined' ? randomValue() : g;
    this.b = typeof(b) === 'undefined' ? randomValue() : b;
    this.a = 'undefined' === typeof(a) ? 1 : a;

    var fade_timer;
    this.fadeThrough = function(start, finish) {
        this.r = Math.floor(start.r);
        this.g = Math.floor(start.g);
        this.b = Math.floor(start.b);
        // this.a = start.a <= 1 && start.a > 0 ? a : 1;
        this.a = 1;

        if (fade_timer) {
            clearInterval(fade_timer);
        }

        fade_timer = setInterval(function() {
            var changed = false;

            ['r', 'g', 'b'].forEach(function(pigment) {
                if (this[pigment] < finish[pigment]) {
                    this[pigment] += 1;
                    changed = true;
                } else if (this[pigment] > finish[pigment]) {
                    this[pigment] -= 1;
                    changed = true;
                }
            }.bind(this));

            // if (this.a < finish.a) this.a += 0.1;
            // else if (this.a > finish.a) this.a -= 0.1;
            // else changed = true;

            if (!changed) {
                clearInterval(fade_timer);
            }
        }.bind(this), 5);
    }

    function randomValue() {
        return Math.floor(255 * Math.random());
    }

    this.random = function() {
        this.r = randomValue();
        this.g = randomValue();
        this.b = randomValue();
    }

    this.toString = function() {
        return ['rgba(', [this.r, this.g, this.b, this.a].join(', '), ')'].join('');
    }
}

module.exports = Colour;
