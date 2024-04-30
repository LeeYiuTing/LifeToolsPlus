import { createApp } from 'vue';
import { Button } from 'vant';
import { Toast } from 'vant';
import { Dialog } from 'vant';
import { Col, Row } from 'vant';
import Vue from './App.vue';

import router from './router/router';
import common from './util/common';
import 'vant/lib/index.css';
import './app.less';
import 'vant/es/toast/style'


const app = createApp(Vue);
app.use(Button);
app.use(Toast);
app.use(router);
app.use(Dialog);
app.use(Col);
app.use(Row);
app.component(common);

app.mount('#app');

