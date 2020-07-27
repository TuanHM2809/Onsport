'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    let pundit = [{
      name: 'Phan Thanh Hùng',
      slug: 'phan-thanh-hung',
      avatar: 'http://sohanews.sohacdn.com/k:2016/1-1455408205229/uan-khuc-sau-bom-tan-dau-2016-cua-bong-da-viet-nam.jpg',
      bio: 'Phan Thanh Hùng là cựu cầu thủ và huấn luyện viên bóng đá Việt Nam. Ông từng là huấn luyện viên trưởng đội tuyển quốc gia và đội tuyển U23 quốc gia Việt Nam năm 2012'
    },
    {
      name: 'Lê Thụy Hải',
      slug: 'le-thuy-hai',
      avatar: 'https://image.thanhnien.vn/1600/uploaded/letan/2016_05_18/thanhhoa20_hdww.jpg',
      bio: 'Lê Thụy Hải còn có biệt danh là "Hải lơ", quê ở Hà Tây, là một cầu thủ và huấn luyện viên bóng đá Việt Nam. Ông từng đá cho đội Đường Sắt thuộc Tổng cục Đường sắt và là tuyển thủ quốc gia Việt Nam'
    },
    {
      name: 'Nguyễn Hữu Thắng',
      slug: 'nguyen-huu-thang',
      avatar: 'http://cdn.baogiaothong.vn/files/baogiay1/2015/11/18/hlv-huu-thang-0054.jpg',
      bio: 'Nguyễn Hữu Thắng là cầu thủ bóng đá - hậu vệ kỳ cựu của câu lạc bộ Sông Lam Nghệ An. Anh từng là thành viên và đội trưởng Đội tuyển bóng đá quốc gia Việt Nam. Năm 2003, anh chuyển sang làm huấn luyện viên đội bóng Sông Lam Nghệ An'
    }
    ]
    return queryInterface.bulkInsert('pundits', pundit, {}).then(() => {
      let punditable = [{
        pundit_id: 1,
        punditable_type: 'article',
        punditable_id: 1
      },
      {
        pundit_id: 2,
        punditable_type: 'article',
        punditable_id: 2
      },
      {
        pundit_id: 3,
        punditable_type: 'article',
        punditable_id: 3
      }
      ]
      return queryInterface.bulkInsert('punditables', punditable, {})
    })
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
}
