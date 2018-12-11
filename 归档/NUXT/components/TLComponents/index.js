import TlButton from './Button/'
import TlSelect from './Select/'
import PwdInput from './PwdInput/index'
import CodeModal from './CodeModal/index'
import TlCheckBox from './CheckBox/'
import TlTable from './Table/'
import TwoFa from './TwoFa/'
import Currency from './Currency/'
import CopyAddress from './CopyAddress/'
import SelectAddress from './SelectAddress/'
import SendCodeBtn from './SendCodeBtn'
import AuthModal from './AuthModal/'


const components = [ 
  TlButton,
  TlSelect,
  PwdInput,
  CodeModal,
  TlCheckBox,
  TlTable,
  TwoFa,
  Currency,
  CopyAddress,
  SendCodeBtn,
  SelectAddress,
  AuthModal];

  const TLComponents = {
    install: function(Vue, opts = {}) {
      components.map((component, index) => {
        Vue.component(component.name, component);
      });
    }
  };
 
  export default  TLComponents;
  
