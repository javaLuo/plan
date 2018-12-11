import Vue from 'vue';

import {
  Input,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  Row,
  Col,
  Checkbox,
  Dialog,
  Form,
  FormItem,
  Message,
  MessageBox,
  Popover,
  Pagination,
  Select,
  Option,
  Table,
  TableColumn,
  Radio,
  RadioGroup,
  RadioButton,
  Upload,
  Loading,
  Progress,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Autocomplete,
  Collapse,
  CollapseItem,
  TabPane,
  Tabs,
} from 'element-ui';

Vue.component(Button.name, Button);
Vue.component(Breadcrumb.name, Breadcrumb);
Vue.component(BreadcrumbItem.name, BreadcrumbItem);
Vue.component(Col.name, Col);
Vue.component(Checkbox.name, Checkbox);
Vue.component(Dialog.name, Dialog);
Vue.component(Form.name, Form);
Vue.component(FormItem.name, FormItem);
Vue.component(Input.name, Input);
Vue.component(Message.name, Message);
Vue.component(MessageBox.name, MessageBox);
Vue.component(Popover.name, Popover);
Vue.component(Pagination.name, Pagination);
Vue.component(Row.name, Row);
Vue.component(Select.name, Select);
Vue.component(Option.name, Option);
Vue.component(Table.name, Table);
Vue.component(TableColumn.name, TableColumn);
Vue.component(Radio.name, Radio);
Vue.component(RadioGroup.name, RadioGroup);
Vue.component(RadioButton.name, RadioButton);
Vue.component(Upload.name, Upload);
Vue.component(Progress.name, Progress);
Vue.component(Dropdown.name, Dropdown);
Vue.component(DropdownMenu.name, DropdownMenu);
Vue.component(DropdownItem.name, DropdownItem);
Vue.component(Autocomplete.name, Autocomplete);
Vue.component(Collapse.name, Collapse);
Vue.component(CollapseItem.name, CollapseItem);
Vue.component(Tabs.name, Tabs);
Vue.component(TabPane.name, TabPane);
Vue.use(Loading.directive);

//自定义组件
import TlButton from '~/components/TLComponents/Button/';
import TlSelect from '~/components/TLComponents/Select/';
import PwdInput from '~/components/TLComponents/PwdInput/index';
import CodeModal from '~/components/TLComponents/CodeModal/index';
import TlCheckBox from '~/components/TLComponents/CheckBox/';
import TlTable from '~/components/TLComponents/Table/';
import TwoFa from '~/components/TLComponents/TwoFa/';
import Currency from '~/components/TLComponents/Currency/';
import CopyAddress from '~/components/TLComponents/CopyAddress/';
import SelectAddress from '~/components/TLComponents/SelectAddress/';
import SendCodeBtn from '~/components/TLComponents/SendCodeBtn';
import AuthModal from '~/components/TLComponents/AuthModal/';
import TLMessage from '~/components/TLComponents/TLMessage/index.js';

Vue.component(TlButton.name, TlButton);
Vue.component(TlSelect.name, TlSelect);
Vue.component(PwdInput.name, PwdInput);
Vue.component(CodeModal.name, CodeModal);
Vue.component(TlCheckBox.name, TlCheckBox);
Vue.component(TlTable.name, TlTable);
Vue.component(TwoFa.name, TwoFa);
Vue.component(Currency.name, Currency);
Vue.component(CopyAddress.name, CopyAddress);
Vue.component(SendCodeBtn.name, SendCodeBtn);
Vue.component(SelectAddress.name, SelectAddress);
Vue.component(AuthModal.name, AuthModal);

Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$tlmessage = TLMessage;
