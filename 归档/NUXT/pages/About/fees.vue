<template>
  <div class="page">
    <div class="main">
      <div class="title">
        <span>Fees</span>
        <div class="round" style="left:-14px; bottom:-12px;" />
        <div class="round" style="right:-14px;; bottom:-12px;"/>
      </div>
      <div class="content">
        <h4>Trading Fee</h4>
        <p>For USD trading pairs, the transaction fees are paid by both the buyer and the seller at a fixed ratio of 0.1% USD.</p>
        <p>For BTC trading pairs, the transaction fees are paid by both the buyer and the seller at a fixed ratio of 0.1% BTC.</p>
        <p>For ETH trading pairs, the transaction fees are paid by both the buyer and the seller at a fixed ratio of 0.1% ETH.</p>
        <p>Active and passive transaction rates are the same.</p>

        <h4>Withdrawal fee</h4>
        <table class="fees-tbdes">
          <thead>
            <tr>
            <th>Currency</th>
            <th>Base</th>
            <th>Rate</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>USD</td>
              <td>10</td>
              <td>0.00%</td>
            </tr>
            <tr>
              <td>BTC</td>
              <td>0.001</td>
              <td>0.00%</td>
            </tr>
            <tr>
              <td>ETH</td>
              <td>0.01</td>
              <td>0.00%</td>
            </tr>
            <tr>
              <td>BCH</td>
              <td>0.001</td>
              <td>0.00%</td>
            </tr>
            <tr>
              <td>LTC</td>
              <td>0.001</td>
              <td>0.00%</td>
            </tr>
            <tr>
              <td>EOS</td>
              <td>0.1</td>
              <td>1.00%</td>
            </tr>
            <tr>
              <td>TRX</td>
              <td>0.1</td>
              <td>1.00%</td>
            </tr>
            <tr>
              <td>ETC</td>
              <td>0.01</td>
              <td>0.00%</td>
            </tr>
          </tbody>
        </table>
        <p>Tips: Withdrawal Fee = Base + (Withdrawal Number × Rate)</p>
        <div class="foot-note">RihgtBTC</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  
}
</script>

<style lang="scss" scoped>

</style>
