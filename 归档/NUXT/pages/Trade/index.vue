<script>
import Configs from '~/common/config';
export default {
  asyncData({ redirect, router }) {
    redirect(`/trade/${Configs.DEFAULT.zi}_${Configs.DEFAULT.mu}`);
  },
};
</script>
