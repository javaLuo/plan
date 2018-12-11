import Vue from 'vue';
// import VueBus from 'vue-bus'; //组件之间广播事件
import VueClipboards from 'vue-clipboards'; // 复制剪切板
import * as filters from '~/utils/filter';
import Moment from 'vue-moment';

import VueI18n from 'vue-i18n';
// import Iscroll from 'iscroll'
import language from '~/common/i18n';
import Configs from '~/common/config';
import AWSKinesis from '~/utils/AWSKinesis';
import vueTap from 'v-tap';

// import TLComponents from '~/components/TLComponents/'

// import AWS from 'aws-sdk'

// console.log(require("~/charting_libraray/charting_library.min.js"));
// import "~/plugins/datafeeds/udf/dist/polyfills.js"
// import "~/plugins/datafeeds/udf/dist/bundle.js"

// Vue.use(VueBus);
Vue.use(VueClipboards);
Vue.use(Moment);
Vue.use(VueI18n);
Vue.use(vueTap);

// Vue.prototype.$aws = AWS;
// Vue.use(TLComponents);
// process.browser && Vue.use(Iscroll);

const VI18n = new VueI18n({
  locale: Configs.DEFAULT.LOCALE,
  messages: language,
});

Vue.prototype.i18n = VI18n.messages.locale.App;
Vue.prototype.$saveSkinesis = AWSKinesis.putRecord;

Object.keys(filters).forEach(key => Vue.filter(key, filters[key])); //install filters
