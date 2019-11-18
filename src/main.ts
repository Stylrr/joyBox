import Vue from 'vue';

import '@mdi/font/css/materialdesignicons.min.css';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

import VueMeta from 'vue-meta';

import App from './App.vue';
import router from './router';
import store from './Store';

import SocketIO from 'socket.io-client';
import VueSocketIO from 'vue-socket.io';

import { Response as RpcResponse } from '@/Common';
import { RpcClientPlugin } from './Plugins/Rpc';

import { env } from '@/Env';
import { Theme } from './Theme';

Vue.config.productionTip = false;

const socket = SocketIO(env.Host);
const rpc = new RpcClientPlugin(socket);

Vue.mixin({
  beforeCreate() {
    const options = this.$options;
    if (options.rpc)
      this.$rpc = options.rpc;
    else if (options.parent && options.parent.$rpc)
      this.$rpc = options.parent.$rpc;
  }
});

Vue.use(Vuetify);

Vue.use(new VueSocketIO({
  debug: process.env.NODE_ENV === 'development',
  connection: socket,
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_'
  }
}));

Vue.use(VueMeta);

new Vue({
  router,
  rpc,
  store,
  vuetify: new Vuetify({
    theme: Theme
  }),
  sockets: {
    // https://www.npmjs.com/package/vue-socket.io#-component-level-usage
    rpc: (res: RpcResponse) => rpc.OnRpcResponse(res) // Handle SC data (all 'rpc' events)
  },
  render: h => h(App)
}).$mount('#app');
