import { createApp } from 'vue';
import { Button } from 'vant';
import { Toast } from 'vant';
import { Dialog } from 'vant';

import VV from './App.vue';
import router from './router/router';

import 'vant/lib/index.css';


const app = createApp(VV);
app.use(Button);
app.use(Toast);
app.use(router);
app.use(Dialog);

app.mount('#app');

