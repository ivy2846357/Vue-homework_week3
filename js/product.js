/* 使用 ESM 載入 Vue */
import {
    createApp
} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js';

// 有關產品的 modal（null 可以改為空字串）
let productModal = null;
// 有關刪除的 modal（null 可以改為空字串）
let delProductModal = null;

/* 建立 Vue 的初始及實體化環境 */
const app = createApp({
    data() {
        return {
            // 站點網址
            url: 'https://vue3-course-api.hexschool.io/',
            // 自己申請的 API 路徑
            api_path: 'ivy2846357',
            // 商品資料存放處
            products: [],
            // 商品明細資料存放處
            templateProduct: {
                imagesUrl: [],
            },
            // 確認 bootstrapModal 是新增商品還是編輯商品
            // false：表示編輯舊商品、true：表示新增商品
            isNew: true
        }
    },
    methods: {
        // 驗證使用者
        checkUser() {
            axios.post(`${this.url}v2/api/user/check`)
                // 驗證成功可以停留在後台，並取得商品資料 
                .then(res => {
                    console.log('使用者驗證成功');
                    this.getData();
                })
                // 驗證失敗則回到登入頁面   
                .catch(err => {
                    alert(err.data.message);
                    window.location = 'index.html'
                })
        },
        // 取得產品資料
        getData() {
            axios.get(`${this.url}v2/api/${this.api_path}/admin/products/all`)
                .then(res => {
                    this.products = res.data.products;
                    console.log(this.products);
                })
                .catch(err => {
                    console.log(err.data.message);
                })
        },
        // 點擊按鈕打開 bootstrapMpdal
        openModal(modalState, item) {
            // 新增產品的視窗
            if (modalState === 'new') {
                // 將資料及圖片的內容清空
                this.templateProduct = {
                    imagesUrl: [],
                };
                // 這裡 isNew 的狀態會影響到之後 API 是要接新增還是編輯
                this.isNew = true;
                // 打開 bootstrap modal
                productModal.show();

                // 編輯產品的視窗
            } else if (modalState === 'edit') {
                // 這裡使用淺層拷貝將 item 的資料放入物件中
                this.templateProduct = {
                    ...item
                };
                this.isNew = false;
                productModal.show();

                // 刪除產品的視窗
            } else if (modalState === 'delete') {
                // 這裡使用淺層拷貝是為了抓到該產品的名稱
                this.templateProduct = {
                    ...item
                };
                delProductModal.show();
            }
        },
        // 新增、編輯商品
        // 因為 post 和 put 的程式相似，所以可以寫在一起
        updateProduct() {
            // 預設 api 路徑和 api method 為空值
            let api_url = '';
            let api_methods = '';

            // 依據 isNew 的狀態進行判斷
            // isNew 為 true 就使用 post 新增商品，isNew 為 false 就使用 put 編輯商品
            if (this.isNew) {
                api_url = `${this.url}v2/api/${this.api_path}/admin/product`;
                api_methods = 'post';
            } else {
                api_url = `${this.url}v2/api/${this.api_path}/admin/product/${this.templateProduct.id}`
                api_methods = 'put';
            }

            // 帶入 api 路徑和 api method
            axios[api_methods](api_url, {
                    data: this.templateProduct
                })
                .then(res => {
                    // 如果程式是跑 put method，就顯示以下內容
                    if (api_methods === 'put') {
                        alert('商品資料變更成功');
                        // 成功後關閉 bootstrap modal
                        productModal.hide();
                        // 重新渲染商品資料
                        this.getData();

                        // 如果程式是另一個 method，就顯示以下內容
                    } else {
                        alert('商品資料新增成功');
                        // 成功後關閉 bootstrap modal
                        productModal.hide();
                        // 重新渲染商品資料
                        this.getData();
                    }
                })
                .catch(err => {
                    alert(err.data.message);
                })
        },
        //刪除商品
        deleteProduct() {
            axios.delete(`${this.url}v2/api/${this.api_path}/admin/product/${this.templateProduct.id}`)
                .then(res => {
                    alert('商品資料已刪除');
                    // 成功後關閉 bootstrap modal
                    delProductModal.hide();
                    // 重新渲染商品資料
                    this.getData();
                })
                .catch(err => {
                    alert(err.data.message);
                })
        }
    },
    mounted() {

        /* 使用者驗證設定 */

        // 取出 Token 的值
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)myToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        // 預設 headers 內夾帶 token 的值
        axios.defaults.headers.common.Authorization = token;

        // 進入網頁後，驗證使用者的身分，避免有人直接從後台網址進入
        this.checkUser();

        /* bootstrapModal 相關設定 */

        productModal = new bootstrap.Modal(document.getElementById('productModal'), {
            keyboard: false
        });
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
            keyboard: false
        });
    }
})

app.mount('#app');