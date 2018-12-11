<script>
import Configs from '~/common/config';
export default {
  asyncData({ redirect, router }) {
    redirect(`/sliverexchange/${Configs.DEFAULT.szi}_${Configs.DEFAULT.smu}`);
  },
};
</script>
