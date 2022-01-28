/* 使用 ESM 載入 Vue */
import {
    createApp
} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js';

/* 建立 Vue 的初始及實體化環境 */
const app = createApp({
    // 資料存放處
    data() {
        return {
            // 站點網址
            url: 'https://vue3-course-api.hexschool.io/',
            // 自己申請的 API 路徑
            api_path: 'ivy2846357',
            // 登入帳密儲存區
            user: {
                'username': '',
                'password': ''
            }
        }
    },
    methods: {
        login() {
            axios.post(`${this.url}v2/admin/signin`, this.user)
                .then(res => {
                    // 抓取 token 和 expired 的值
                    const {
                        token,
                        expired
                    } = res.data;
                    // 將兩個值放進 cookie 內
                    document.cookie = `myToken=${token}; expires=${new Date(expired)}`;
                    alert('登入成功');
                    window.location = 'product.html';
                })
                .catch(err => {
                    alert('登入失敗，請確認帳號、密碼是否輸入正確');
                })
        }
    }
})

app.mount('#app');