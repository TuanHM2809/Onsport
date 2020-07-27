'use strict'
var Constant = require('../constants')
var faker = require('faker')
faker.locale = 'vi'
var _ = require('lodash')
var slug = require('slug')
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

    let arrayImages = [
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
    let arrayVideos = [
      'http://techslides.com/demos/sample-videos/small.mp4',
      'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4'
    ]
    var dataVideos = _.times(100, n => {
      let name = faker.lorem.sentence()
      let slugUrl = slug(name, { lower: true })
      let metadata = {
        'thumbnail': faker.random.arrayElement(arrayImages),
        'duration': faker.random.number({ min: 120, max: 1500 })
      }

      return {
        url: faker.random.arrayElement(arrayVideos),
        name: name,
        slug: slugUrl,
        content: faker.lorem.sentences(),
        featured: !(n > 1),
        status: 'PUBLISHED',
        date: null,
        metadata: JSON.stringify(metadata),
        file_type_id: 1
      }
    })
    var dataImages = _.times(100, n => {
      let name = faker.lorem.sentence()
      let slugUrl = slug(name, { lower: true })
      return {
        url: faker.random.arrayElement(arrayImages),
        name: name,
        slug: slugUrl,
        content: faker.lorem.sentences(),
        featured: false,
        status: true,
        date: null,
        metadata: null,
        file_type_id: 2
      }
    })
    return queryInterface.bulkInsert('files', dataVideos, {}).then(() => {
      return queryInterface.bulkInsert('files', dataImages, {}).then(() => {
        var dataPlatform = _.times(100, n => {
          return {
            platform_id: 1,
            item_type: Constant.FILE_TYPE,
            item_id: n + 1
          }
        })
        _.times(100, n => {
          dataPlatform.push({
            platform_id: 2,
            item_type: Constant.FILE_TYPE,
            item_id: n + 1
          })
        })
        return queryInterface.bulkInsert('platforms_has_items', dataPlatform, {})
      })
    })
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete('files', null, {})
  }
}
