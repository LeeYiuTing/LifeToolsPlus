import {createApp} from 'vue';
import {Button, Toast, Dialog, Col, Row, Notify, ConfigProvider} from 'vant';
import router from './router/router';
import common from './util/common';

import 'vant/lib/index.css';
import './app.less';
import 'vant/es/toast/style'
import 'vant/es/notify/style'

import Vue from './App.vue';


const app = createApp(Vue);
app.use(Button);
app.use(Toast);
app.use(router);
app.use(Dialog);
app.use(Col);
app.use(Row);
app.use(Notify);
app.use(ConfigProvider);
app.component(common);

app.mount('#app');

