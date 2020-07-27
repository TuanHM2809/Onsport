'use strict'
var faker = require('faker')
var _ = require('lodash')
faker.locale = 'vi'
module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

    let array_thumbnailMovie = [
      'https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/280h/6B3VYEQOGI.jpg',
      'https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/280h/EKLKJP8RVN.jpg',
      'https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/280h/V65L4TCEQU.jpg',
      'http://www.joshnizzi.com/wp-content/uploads/2016/10/FalconVsWarMachine_v04_JN.jpg',
      'http://www.joshnizzi.com/wp-content/uploads/2016/10/Redwing_v3_top_JoshNizzi.jpg',
      'http://conceptartworld.com/wp-content/uploads/2014/12/Pat_Presley_Concept_Art_M02-520x330.jpg',
      'http://conceptartworld.com/wp-content/uploads/2017/01/Ahmed-Aldoori-concept-art-illustratoin-0-M01-520x330.jpg',
      'http://conceptartworld.com/wp-content/uploads/2017/01/Patrick-Raines-Concept-Art-0-M02-520x330.jpg',
      'http://conceptartworld.com/wp-content/uploads/2016/11/edvige-faini-concept-art-illustration-alveon-w-680x382.jpeg',
      'http://conceptartworld.com/wp-content/uploads/2016/11/edvige-faini-concept-art-world-needs-mecha-680x368.jpeg',
      'http://conceptartworld.com/wp-content/uploads/2016/11/edvige-faini-concept-art-illustration-discharging-port-680x337.jpg',
      'http://conceptartworld.com/wp-content/uploads/2013/01/Edvige_Faini_19a.jpg',
      'http://conceptartworld.com/wp-content/uploads/2013/01/Edvige_Faini_12a.jpg',
      'http://conceptartworld.com/wp-content/uploads/2013/01/Edvige_Faini_18a.jpg',
      'http://conceptartworld.com/wp-content/uploads/2013/01/Edvige_Faini_15a.jpg',
      'http://conceptartworld.com/wp-content/uploads/2013/01/Edvige_Faini_09a.jpg',
      'http://conceptartworld.com/wp-content/uploads/2013/01/Edvige_Faini_11a.jpg',
      'http://conceptartworld.com/wp-content/uploads/2013/01/Edvige_Faini_16a.jpg',
      'http://conceptartworld.com/wp-content/uploads/2013/01/Edvige_Faini_03a.jpg',
      'http://conceptartworld.com/wp-content/uploads/2013/01/Edvige_Faini_10a.jpg',
      'http://conceptartworld.com/wp-content/uploads/2013/01/Edvige_Faini_06a.jpg',
      'http://conceptartworld.com/wp-content/uploads/2013/01/Edvige_Faini_01a.jpg',
      'http://conceptartworld.com/wp-content/uploads/2013/01/Edvige_Faini_21a.jpg',
      'http://conceptartworld.com/wp-content/uploads/2013/01/Edvige_Faini_04a.jpg',
      'http://conceptartworld.com/wp-content/uploads/2015/04/william-wu-concept-art-0-M01-520x330.jpeg',
      'http://conceptartworld.com/wp-content/uploads/2015/02/Greg_Semkow_Concept_Art_MA01-520x330.jpg',
      'http://conceptartworld.com/wp-content/uploads/2015/02/Greg_Semkow_Concept_Art_Mad_Max_Fan_Art_01-680x314.jpg',
      'http://conceptartworld.com/wp-content/uploads/2015/02/Greg_Semkow_Concept_Art_superstorm-680x274.jpg',
      'http://conceptartworld.com/wp-content/uploads/2015/02/Greg_Semkow_Concept_Art_AirForce_Base_mid-680x334.jpg',
      'http://conceptartworld.com/wp-content/uploads/2015/02/Greg_Semkow_Concept_Art_AirForce_Base_estab-680x361.jpg',
      'http://conceptartworld.com/wp-content/uploads/2015/02/Greg_Semkow_Concept_Art_Galactic_Clash_Folio_B-680x432.jpg',
      'http://conceptartworld.com/wp-content/uploads/2015/02/Greg_Semkow_Concept_Art_Ghosts_of_Aldebaran-680x326.jpg',
      'http://conceptartworld.com/wp-content/uploads/2015/04/william-wu-concept-art-temple-final-v3-small-680x363.jpeg',
      'http://cdn3-www.comingsoon.net/assets/uploads/2015/12/fassbenderheader-1.jpg',
      'http://cdn1-www.comingsoon.net/assets/uploads/2017/04/DraxBar640.jpg',
      'http://cdn3-www.comingsoon.net/assets/uploads/2017/04/PromiseBar640.jpg',
      'http://cdn3-www.comingsoon.net/assets/uploads/2017/04/FreeFire.jpg',
      'http://cdn3-www.comingsoon.net/assets/uploads/2017/04/kingsmantrailer.jpg',
      'http://cdn2-www.comingsoon.net/assets/uploads/2017/04/SummerMovie2017.jpg',
      'http://cdn1-www.comingsoon.net/assets/uploads/2016/12/lostcitytrailer.jpg',
      'http://cdn1-www.comingsoon.net/assets/uploads/2017/03/wonderWoman.jpg',
      'http://cdn1-www.comingsoon.net/assets/uploads/2017/04/shadowhunters-freeform-season-2-221906-1280x0.jpg',
      'http://cdn2-www.comingsoon.net/assets/uploads/2017/04/starwarsheader.jpg',
      'http://cdn2-www.comingsoon.net/assets/uploads/2017/04/thrones-season-7-1.jpg',
      'http://cdn1-www.comingsoon.net/assets/uploads/2017/04/arrow-sizzle-51.jpg',
      'http://cdn3-www.comingsoon.net/assets/uploads/2017/04/Fear2.jpg',
      'http://cdn1-www.comingsoon.net/assets/uploads/2017/04/splitfound-1.jpg',
      'http://cdn1-www.comingsoon.net/assets/uploads/2017/04/agents-of-hyrda-1.jpg',
      'https://s3-us-west-2.amazonaws.com/flx-editorial-wordpress/wp-content/uploads/2017/04/23131857/fate-fea1.jpg',
      'https://s3-us-west-2.amazonaws.com/flx-editorial-wordpress/wp-content/uploads/2017/04/09124141/bossbo-fea.jpg',
      'https://s3-us-west-2.amazonaws.com/flx-editorial-wordpress/wp-content/uploads/2017/04/02143749/boss-fea.jpg',
      'https://s3-us-west-2.amazonaws.com/flx-editorial-wordpress/wp-content/uploads/2017/03/13010608/kong-fea1.jpg',
      'https://s3-us-west-2.amazonaws.com/flx-editorial-wordpress/wp-content/uploads/2017/03/05131324/logan-fea-for-real.jpg',
      'https://s3-us-west-2.amazonaws.com/flx-editorial-wordpress/wp-content/uploads/2017/04/12155226/600FF.jpg',
      'https://s3-us-west-2.amazonaws.com/flx-editorial-wordpress/wp-content/uploads/2016/05/09081635/X-Movies.jpg',
      'https://s3-us-west-2.amazonaws.com/flx-editorial-wordpress/wp-content/uploads/2017/02/15155442/Zhang-Yimou-Total-Recall.jpg',
      'https://s3-us-west-2.amazonaws.com/flx-editorial-wordpress/wp-content/uploads/2013/09/Jake-Gyllenhaal-Source-Code.jpg',
      'https://s3-us-west-2.amazonaws.com/flx-editorial-wordpress/wp-content/uploads/2017/02/13165001/Batman-Movies-LEGO-Update.jpg',
      'https://s3-us-west-2.amazonaws.com/flx-editorial-wordpress/wp-content/uploads/2016/12/26162823/600RogueOne3.jpg',
      'https://s3-us-west-2.amazonaws.com/flx-editorial-wordpress/wp-content/uploads/2016/12/11121403/moana-disney-rep.jpg',
      'https://s3-us-west-2.amazonaws.com/flx-editorial-wordpress/wp-content/uploads/2016/11/06133306/doctor_strange600x262.jpg'
    ]

    let array_videos = [
      'https://vodhn.vtvplay.vn/streaming/728dd0dc-44f5-44af-b38e-e50b57f67c56.mp4/playlist.m3u8',
      'https://vodhn.vtvplay.vn/streaming/c4d113c8-9fe1-463e-9fb9-9d52a09e379d.mp4/playlist.m3u8',
      'https://vodhn.vtvplay.vn/streaming/005f7b60-d43d-4721-9ae9-baacd5638dc1.mp4/playlist.m3u8',
      'https://vodhn.vtvplay.vn/streaming/1503f2dc-f78a-45f8-8026-f243e618e357.mp4/playlist.m3u8',
      'https://vodhn.vtvplay.vn/streaming/ee055b72-fa71-4ee6-bdf0-b65a7d285ece.mp4/playlist.m3u8',
      'https://vodhn.vtvplay.vn/streaming/813e12c0-d280-4b5f-bfb1-df050dd22319.mp4/playlist.m3u8',
      'https://vodhn.vtvplay.vn/streaming/caa402f4-dda0-4cd0-b8c7-dd40a30bb8b7.mp4/playlist.m3u8',
      'https://vodhn.vtvplay.vn/streaming/e2f25f04-81f5-4044-9ba5-12e3b916dec1.mp4/playlist.m3u8',
      'https://vodhn.vtvplay.vn/streaming/67a40ec3-ea2b-4c81-813d-5e34702930d7.mp4/playlist.m3u8'
    ]

    var dataTest = _.times(100, n => {
      return {
        title: faker.lorem.sentence(),
        description: faker.lorem.sentence(),
        visible: 1,
        published: 1,
        thumbnail: faker.random.arrayElement(array_thumbnailMovie),
        video: faker.random.arrayElement(array_videos)
      }
    })
    // return queryInterface.bulkInsert('videos', dataTest, {}).then(() => {
    //   var test_data = _.times(100, n => {
    //     return {
    //       platform_id: faker.random.number({min: 1, max: 2}),
    //       item_type: 'videos',
    //       item_id: n + 1
    //     }
    //   })
    //   return queryInterface.bulkInsert('platforms_has_items', test_data, {})
    // })
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */

    // return queryInterface.bulkDelete('videos', null, {})
  }
}
