'use strict'
module.exports = function (sequelize, DataTypes) {
  var CrawlSchedule = sequelize.define('CrawlSchedule', {
    start_at: DataTypes.DATE,
    end_at: DataTypes.DATE,
    status: {
      type: DataTypes.BOOLEAN
    }
  }, {
    // classMethods: {
    //   associate: function (models) {
    //     // associations can be defined here
    //   }
    // }
    tableName: 'crawl_schedules',
    underscored: true,
    timestamp: false
  })

  return CrawlSchedule
}
