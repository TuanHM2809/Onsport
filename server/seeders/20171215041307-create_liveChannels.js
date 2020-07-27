'use strict'

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
    // name: DataTypes.STRING,
    // display_name: DataTypes.STRING,
    // short_description: DataTypes.STRING,
    // description: DataTypes.STRING,
    // link_type: DataTypes.ENUM('youtube', 'stream'),
    // link: DataTypes.STRING,
    // thumbnail: DataTypes.STRING,
    let live_channels = [{
      name: 'VTVcab16 HD web',
      slug: 'vtvcab-16-hd',
      display_name: 'Bóng Đá TV',
      short_description: '<p>Kênh Bóng đá TV – Kênh truyền hình chuyên biệt về Bóng đá đầu tiên tại Việt Nam. Bóng đá TV do Truyền hình Cáp Việt Nam sản xuất.</p>',
      description: '<p>Kênh Bóng đá TV – Kênh truyền hình chuyên biệt về Bóng đá đầu tiên tại Việt Nam. Bóng đá TV do Truyền hình Cáp Việt Nam sản xuất.</p>',
      link_type: 'stream',
      link: 'https://sss1.vtvplay.vn:8081/livechannel/drmhcmvtvcab16hdnoepl_170828/playlist.m3u8',
      thumbnail: 'https://vodhn.vtvplay.vn/storage/users/files/33179009-2689-4b03-bbab-7c065edb5611.png'
    },
    {
      name: 'VTVcab3_Thể thao TV HD',
      slug: 'vtvcab3-the-thao-tv-hd',
      display_name: 'Thể thao TV',
      short_description: '<p>VTVcab 3 - Kênh thể thao TV là kênh chuyên biệt về thể thao, ...',
      description: '<p>VTVcab 3 - Kênh thể thao TV là kênh chuyên biệt về thể thao, mang đến cho khán giả những món ăn tinh thần không &nbsp; &nbsp; &nbsp;thể thiếu, thoả mãn mọi đối tượng, mọi sở thích ở tất cả các lĩnh vực thể thao khác nhau. Đến với kênh Thể thao TV, người xem sẽ được tiếp cận đa dạng các môn thể thao như: bóng đá, tennis, quần vợt, golf, đua xe, cầu lông, cầu mây, bóng bàn. ….</p>',
      link_type: 'stream',
      link: 'https://sss1.vtvplay.vn:8081/livechannel/drmhcmvtvcab3hdnoepl_170828/playlist.m3u8',
      thumbnail: 'https://vodhn.vtvplay.vn/storage/users/files/4779e037-832c-4cbd-95bf-9e912ec1ff83.png'
    },
    {
      name: 'VTVcab3 SD web',
      slug: 'vtvcab3-sd',
      display_name: 'Thể thao Tv sd',
      short_description: '<p>VTVcab 3 - Kênh thể thao TV là kênh chuyên biệt về thể thao, ...</p>',
      description: '<p>VTVcab 3 - Kênh thể thao TV là kênh chuyên biệt về thể thao, mang đến cho khán giả những món ăn tinh thần không &nbsp; &nbsp; &nbsp;thể thiếu, thoả mãn mọi đối tượng, mọi sở thích ở tất cả các lĩnh vực thể thao khác nhau. Đến với kênh Thể thao TV, người xem sẽ được tiếp cận đa dạng các môn thể thao như: bóng đá, tennis, quần vợt, golf, đua xe, cầu lông, cầu mây, bóng bàn. ….</p>',
      link_type: 'stream',
      link: 'https://sss1.vtvplay.vn:8081/livechannel/drmhcmvtvcab3sdnoepl_170828/playlist.m3u8',
      thumbnail: 'https://vodhn.vtvplay.vn/storage/users/files/f8eec585-b595-4135-8b83-ae9b062e6bea.png'
    },
    {
      name: 'ON Golf',
      slug: 'on-golf',
      display_name: 'ON Golf',
      short_description: '<p>Kênh Bóng đá TV – Kênh truyền hình chuyên biệt về Bóng đá đầu tiên tại Việt Nam. Bóng đá TV do Truyền hình Cáp Việt Nam sản xuất.</p>',
      description: '<p>Kênh Bóng đá TV – Kênh truyền hình chuyên biệt về Bóng đá đầu tiên tại Việt Nam. Bóng đá TV do Truyền hình Cáp Việt Nam sản xuất.</p>',
      link_type: 'stream',
      link: 'https://sss1.vtvplay.vn:8081/livechannel/drmhcmvtvcab16hdnoepl_170828/playlist.m3u8',
      thumbnail: 'https://vodhn.vtvplay.vn/storage/users/files/33179009-2689-4b03-bbab-7c065edb5611.png'
    },
    {
      name: 'ONsport',
      slug: 'onsport',
      display_name: 'ONsport TV',
      short_description: '<p>Kênh ONSPORT – Kênh truyền hình chuyên biệt về Bóng đá đầu tiên tại Việt Nam. Bóng đá TV do Truyền hình Cáp Việt Nam sản xuất.</p>',
      description: '<p>Kênh ONSPORT – Kênh truyền hình chuyên biệt về Bóng đá đầu tiên tại Việt Nam. Bóng đá TV do Truyền hình Cáp Việt Nam sản xuất.</p>',
      link_type: 'stream',
      link: 'https://sss1.vtvplay.vn:8081/livechannel/drmhcmvtvcab16hdnoepl_170828/playlist.m3u8',
      thumbnail: 'https://vodhn.vtvplay.vn/storage/users/files/33179009-2689-4b03-bbab-7c065edb5611.png'
    }
    ]

    return queryInterface.bulkInsert('live_channels', live_channels, {})
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
}
