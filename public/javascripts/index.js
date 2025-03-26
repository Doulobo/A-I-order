// 用于选择用户类型 (买家或卖家) 并导航到不同页面
function userType(location) {
  localStorage.setItem('location', location);

  // 如果选择的是买家 (user)
  if (location === 'user') {
    window.location.href = 'location.html';  
  }
  // 如果选择的是卖家 (sells)
  else if (location === 'sells') {
    window.location.href = 'sellsmenu.html';  
  }
}

function selectLocation(location) {
  // 将地点信息存储到 localStorage 中
  localStorage.setItem('location', location);
  
  // 跳转到 restaurant.html 页面
  window.location.href = 'restaurant.html';
}
// 保存用户类型并跳转到指定页面
function selectUser(userType) {
  localStorage.setItem('userType', userType);
  window.location.href = 'location.html';
}

// 用于选择餐厅并导航到菜单页面
function selectRestaurant(restaurant) {
  localStorage.setItem('restaurant', restaurant);
  window.location.href = 'menu.html';
}

// 添加事件监听器，以确保在 DOM 完全加载后运行 fetch 请求来获取菜单数据
document.addEventListener('DOMContentLoaded', function() {
  // Fetch 请求来获取 /menu 路由的数据并显示在网页上
  fetch('/menu')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(menuData => {
      console.log(menuData); // 控制台输出菜单数据以供调试
      const menuContainer = document.getElementById('menu-container');

      // 遍历每个分类
      for (const category in menuData.menuItems) {
        const categoryTitle = document.createElement('h2');
        categoryTitle.className = 'menu-category';
        categoryTitle.textContent = category;
        menuContainer.appendChild(categoryTitle);

        // 创建分类下的行
        const row = document.createElement('div');
        row.className = 'row';
        
        // 遍历分类下的每个菜品
        menuData.menuItems[category].forEach(item => {
          const col = document.createElement('div');
          col.className = 'col-md-4';

          const card = document.createElement('div');
          card.className = 'card';

          const cardBody = document.createElement('div');
          cardBody.className = 'card-body';

          const itemName = document.createElement('h5');
          itemName.className = 'card-title';
          itemName.textContent = item.name;

          const itemPrice = document.createElement('p');
          itemPrice.className = 'card-text';
          itemPrice.textContent = `$${item.price}`;

          cardBody.appendChild(itemName);
          cardBody.appendChild(itemPrice);
          card.appendChild(cardBody);
          col.appendChild(card);
          row.appendChild(col);
        });

        menuContainer.appendChild(categoryTitle);
        menuContainer.appendChild(row);
      }
    })
    .catch(error => {
      console.error('Error fetching menu:', error);
    });
});
