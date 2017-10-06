const mongoose = require('mongoose');
module.exports = function(mongoUrl) {
        mongoose.connect(mongoUrl);
        const waiterSchema = mongoose.Schema({
                waiterName: String,
                daysToWork: Object

        });

        waiterSchema.index({waiterName: 1}, {unique: true});

        const waiterInfo = mongoose.model('waiterInfo', waiterSchema);

        return {
                waiterInfo
        }
}
