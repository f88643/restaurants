# restaurants

提供一些餐廳清單

## 功能介紹

- 可點擊任一餐廳你獲取更多資訊
* 輸入關鍵字以搜尋想要之餐廳
+ 點選左上角可返回首頁
- 編輯餐廳資訊
* 刪除不想要的餐廳
+ 新增喜歡的餐廳
- 提供分頁
* 搜尋餐廳
+ 餐廳排序
- 註冊及登入功能
* 利用Facebook登入
+ 加密密碼

## 使用說明

請確保有安裝node.js 和 npm並在終端機(Terminal)中進行以下操作:

1.複製檔案
```
git clone https://github.com/f88643/restaurants.git

```
2.前往資料夾restaurants
```
cd restaurants/
```
3.安裝套件
```
npm install
```
4.在SQL中建立DATABASE

```
CREATE DATABASE restaurant;
```
5.建立table以及種子資料

```
npm run seed
```
6.執行
```
npm run start
```
若看到以下訊息即為安裝成功，可在瀏覽器輸入http://localhost:3000 開始瀏覽
```
express server is running on http://localhost:3000
```

欲退出請連按兩次Ctrl + C
## 使用工具
- express: 4.18.2
- express-handlebars: 7.1.2
- method-override: 3.0.0
- mysql2: 3.2.0
- sequelize: 6.30.0
- sequelize-cli: 6.6.0
- bcryptjs: 2.4.3
- connect-flash: 0.1.1
- passport: 0.6.0
