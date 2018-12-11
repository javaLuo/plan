<template>
  <div>

    <h1 id="toc_0">Trader API --go to
      <a href="https://www.rightbtc.com/ApiWeb/Public-API"
         target="_blank">Public API</a>
    </h1>

    <p>Every api call needs a valid apikey and signature. They should be provided in the request header and &#39;Content-Type: application/json&#39; is also needed. </p>

    <p>Response Style: {&quot;status&quot;:{&quot;success&quot;:1},&quot;result&quot;:null} success if success = 1 and result is the return data.</p>

    <p>Base URL: https://rightbtc.com/api/trader/ See Also: Apply apikey and signature</p>

    <hr>

    <h2 id="toc_1">ORDERS</h2>

    <h3 id="toc_2">ORDERS - CREATE ORDER</h3>

    <div>
      <pre><code class="language-none">Creates a new order</code></pre>
    </div>

    <p>
      <strong>POST</strong>
    </p>

    <blockquote>
      <p>/order</p>
    </blockquote>

    <p>Example Usage:</p>

    <blockquote>
      <p>curl -H&quot;apikey: your api key&quot; -H&quot;signature: your signature&quot; -H&quot;Content-Type: application/json&quot; -d&#39;{&quot;side&quot;:&quot;BUY&quot;,&quot;quantity&quot;:12300000,&quot;trading_pair&quot;:&quot;BTCCNY&quot;,&quot;limit&quot;:1000000000000,&quot;type&quot;:&quot;LIMIT&quot;}&#39; https://www.rightbtc.com/api/trader/order</p>
    </blockquote>

    <p>
      <strong>Success 200</strong>
    </p>

    <p>Parameter:</p>

    <table>
      <thead>
        <tr>
          <th>Field</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>trading_pair</td>
          <td>String</td>
          <td>see /trading
            <em>pairs for available trading</em>pair</td>
        </tr>
        <tr>
          <td>quantity</td>
          <td>Number</td>
          <td>buy/sell quantity, max decimal digits list at /trading_pairs, should multiply by 1E8</td>
        </tr>
        <tr>
          <td>limit</td>
          <td>Number</td>
          <td>buy/sell at price, max decimal digits list at /trading_pairs, should multiply by 1E8</td>
        </tr>
        <tr>
          <td>type</td>
          <td>String</td>
          <td>&quot;LIMIT&quot;</td>
        </tr>
        <tr>
          <td>side</td>
          <td>String</td>
          <td>&quot;BUY&quot; or &quot;SELL&quot;</td>
        </tr>
        <tr>
          <td>Field</td>
          <td>Type</td>
          <td>Description</td>
        </tr>
        <tr>
          <td>order_id</td>
          <td>Number</td>
          <td>order id</td>
        </tr>
        <tr>
          <td>message</td>
          <td>String</td>
          <td>error type: ERR
            <em>ASSET</em>NOT_EXISTS</td>
        </tr>
        <tr>
          <td>frozen</td>
          <td>Number</td>
          <td>frozen amount, should divide by 1E8</td>
        </tr>
      </tbody>
    </table>

    <p>Success-Response </p>

    <div>
      <pre><code class="language-none">{
    &quot;status&quot;: {
        &quot;success&quot;: 1,
        &quot;message&quot;: &quot;CREATE_ORDER&quot;
    },
    &quot;result&quot;: {
        &quot;frozen&quot;: &quot;150000000000000.00000000&quot;,
        &quot;order_id&quot;: &quot;608391&quot;
    }
}</code></pre>
    </div>

    <p>Error-Response</p>

    <div>
      <pre><code class="language-none">{
    &quot;status&quot;: {
        &quot;success&quot;: 0,
        &quot;message&quot;: &quot;ERR_CREATE_ORDER&quot;
    }
}</code></pre>
    </div>

    <h3 id="toc_3">ORDERS - CANCEL ORDERS</h3>

    <div>
      <pre><code class="language-none">Cancel orders.</code></pre>
    </div>

    <p>
      <strong>DELETE</strong>
    </p>

    <blockquote>
      <p>/order/:trading_pair/:id/:id:/:id/...</p>
    </blockquote>

    <p>Example Usage:</p>

    <blockquote>
      <p>curl -X DELETE -H&quot;apikey: your api key&quot; -H&quot;signature: your signature&quot; -H&quot;Content-Type: application/json&quot; https://www.rightbtc.com/api/trader/order/BTCCNY/10000</p>
    </blockquote>

    <p>
      <strong>Success 200</strong>
    </p>

    <p>Parameter:</p>

    <table>
      <thead>
        <tr>
          <th>Field</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>order_id</td>
          <td>Number</td>
          <td>return order_id if cancel request is accepted, wait to be processed</td>
        </tr>
      </tbody>
    </table>

    <p>Success-Response </p>

    <div>
      <pre><code class="language-none">{
    &quot;status&quot;: {
        &quot;success&quot;: 1,
        &quot;message&quot;: &quot;CANCEL_ORDER&quot;
    },
    &quot;result&quot;: {
        &quot;order_id&quot;: &quot;2345，2344，2342&quot;
    }
}</code></pre>
    </div>

    <h3 id="toc_4">ORDERS - LIST ACTIVE ORDERS IN PAGE</h3>

    <div>
      <pre><code class="language-none">Returns users active orders to the given trading pair as pages from the given cursor.</code></pre>
    </div>

    <p>
      <strong>GET</strong>
    </p>

    <blockquote>
      <p>/orderpage/:trading_pair/:page</p>
    </blockquote>

    <p>Example Usage:</p>

    <blockquote>
      <p>curl -H&quot;apikey: your api key&quot; -H&quot;signature: your signature&quot; -H&quot;Content-Type: application/json&quot; https://www.rightbtc.com/api/trader/orderpage/BTCCNY/0</p>
    </blockquote>

    <p>
      <strong>Success 200</strong>
    </p>

    <p>Parameter:</p>

    <table>
      <thead>
        <tr>
          <th>Field</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>cursor</td>
          <td>String</td>
          <td>new cursor for next api call if cursor != &quot;0&quot;</td>
        </tr>
        <tr>
          <td>orders</td>
          <td>Array</td>
          <td>see also /orders/:trading_pair/:id</td>
        </tr>
      </tbody>
    </table>

    <p>Success-Response </p>

    <div>
      <pre><code class="language-none">{
    &quot;status&quot;: {
        &quot;success&quot;: 1,
        &quot;message&quot;: &quot;SUC_LIST_AVTICE_ORDERS_PAGE&quot;
    },
    &quot;result&quot;: {
        &quot;cursor&quot;: &quot;0&quot;,
        &quot;orders&quot;: [
            {
                &quot;id&quot;: 4180528,
                &quot;quantity&quot;: 20000000,
                &quot;rest&quot;: 20000000,
                &quot;limit&quot;: 1000000,
                &quot;price&quot;: null,
                &quot;side&quot;: &quot;BUY&quot;,
                &quot;created&quot;: 1496005693738
            }
        ]
    }
}</code></pre>
    </div>

    <h3 id="toc_5">ORDERS - LIST ACTIVE ORDERS</h3>

    <div>
      <pre><code class="language-none">Returns users active orders to the given trading pair.</code></pre>
    </div>

    <p>
      <strong>GET</strong>
    </p>

    <blockquote>
      <p>/orders/:trading_pair/:id/:id:/id/...</p>
    </blockquote>

    <p>Example Usage:</p>

    <blockquote>
      <p>curl -H&quot;apikey: your api key&quot; -H&quot;signature: your signature&quot; -H&quot;Content-Type: application/json&quot; https://www.rightbtc.com/api/trader/orders/BTCCNY curl -H&quot;apikey: your api key&quot; -H&quot;signature: your signature&quot; -H&quot;Content-Type: application/json&quot; https://www.rightbtc.com/api/trader/orders/BTCCNY/10000</p>
    </blockquote>

    <p>
      <strong>Success 200</strong>
    </p>

    <p>Parameter:</p>

    <table>
      <thead>
        <tr>
          <th>Field</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>id</td>
          <td>Number</td>
          <td>order id</td>
        </tr>
        <tr>
          <td>quantity</td>
          <td>Number</td>
          <td>amount of original order, should divide by 1E8</td>
        </tr>
        <tr>
          <td>rest</td>
          <td>Number</td>
          <td>amount not matched, should divide by 1E8</td>
        </tr>
        <tr>
          <td>limit</td>
          <td>Number</td>
          <td>price of original orde, should divide by 1E8</td>
        </tr>
        <tr>
          <td>price</td>
          <td>Number</td>
          <td>average price, should divide by 1E8</td>
        </tr>
        <tr>
          <td>side</td>
          <td>String</td>
          <td>order direction</td>
        </tr>
        <tr>
          <td>created</td>
          <td>Number</td>
          <td>order created timestamp</td>
        </tr>
      </tbody>
    </table>

    <p>Success-Response </p>

    <div>
      <pre><code class="language-none">{
    &quot;status&quot;: {
        &quot;success&quot;: 1,
        &quot;message&quot;: &quot;SUC_LIST_AVTICE_ORDERS&quot;
    },
    &quot;result&quot;: [
        {
            &quot;id&quot;: 4180528,
            &quot;quantity&quot;: 20000000,
            &quot;rest&quot;: 20000000,
            &quot;limit&quot;: 1000000,
            &quot;price&quot;: null,
            &quot;side&quot;: &quot;BUY&quot;,
            &quot;created&quot;: 1496005693738
        }
    ]
}</code></pre>
    </div>

    <h3 id="toc_6">ORDERS - LIST HISTORY ORDERS</h3>

    <div>
      <pre><code class="language-none">Returns users history orders to the given trading pair.</code></pre>
    </div>

    <p>
      <strong>GET</strong>
    </p>

    <blockquote>
      <p>/history/:trading_pair/:id/:id/:id</p>
    </blockquote>

    <p>Example Usage:</p>

    <blockquote>
      <p>curl -H&quot;apikey: your api key&quot; -H&quot;signature: your signature&quot; -H&quot;Content-Type: application/json&quot; https://www.rightbtc.com/api/trader/history/BTCCNY/11060</p>
    </blockquote>

    <p>
      <strong>Success 200</strong>
    </p>

    <p>Parameter:</p>

    <table>
      <thead>
        <tr>
          <th>Field</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>id</td>
          <td>Number</td>
          <td>order id</td>
        </tr>
        <tr>
          <td>status</td>
          <td>String</td>
          <td>NEW:not matched order/TRADE:full filled or partial filled order/CANCEL:order canceled</td>
        </tr>
        <tr>
          <td>fee</td>
          <td>Number</td>
          <td>fee rate in percentage</td>
        </tr>
        <tr>
          <td>min_fee</td>
          <td>Number</td>
          <td>minumun fees,should divide by 1E8</td>
        </tr>
        <tr>
          <td>created_at</td>
          <td>String</td>
          <td>order created datetime</td>
        </tr>
        <tr>
          <td>cost</td>
          <td>Number</td>
          <td>total cost of the filled quantity</td>
        </tr>
        <tr>
          <td>limit</td>
          <td>Number</td>
          <td>price of original order, should divide by 1E8</td>
        </tr>
        <tr>
          <td>quantity</td>
          <td>Number</td>
          <td>amount of original order, should divide by 1E8</td>
        </tr>
        <tr>
          <td>filled_quantity</td>
          <td>Number</td>
          <td>matched amount, should divide by 1E8</td>
        </tr>
      </tbody>
    </table>

    <p>Success-Response </p>

    <div>
      <pre><code class="language-none">{
    &quot;status&quot;: {
        &quot;success&quot;: 1,
        &quot;message&quot;: null
    },
    &quot;result&quot;: [
        {
            &quot;trading_pair&quot;: &quot;ETPCNY&quot;,
            &quot;status&quot;: &quot;TRADE&quot;,
            &quot;fee&quot;: 0.23,
            &quot;min_fee&quot;: 10000000,
            &quot;created_at&quot;: &quot;2017-05-25T00:12:27.000Z&quot;,
            &quot;cost&quot;: 1152468000000,
            &quot;limit&quot;: 3600000000,
            &quot;id&quot;: 11060,
            &quot;quantity&quot;: 32013000000,
            &quot;filled_quantity&quot;: 32013000000
        }
    ]
}</code></pre>
    </div>

    <h2 id="toc_7">ACCOUNT</h2>

    <h3 id="toc_8">ACCOUNT - GET BALANCE</h3>

    <div>
      <pre><code class="language-none">Returns the users account balance for a specified asset(see /balances for available assets).</code></pre>
    </div>

    <p>
      <strong>GET</strong>
    </p>

    <blockquote>
      <p>/balance/:symbol</p>
    </blockquote>

    <p>Example Usage:</p>

    <blockquote>
      <p>curl -H&quot;apikey: your api key&quot; -H&quot;signature: your signature&quot; -H&quot;Content-Type: application/json&quot; https://www.rightbtc.com/api/trader/balance/CNY</p>
    </blockquote>

    <p>
      <strong>Success 200</strong>
    </p>

    <p>Parameter:</p>

    <table>
      <thead>
        <tr>
          <th>Field</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>symbol</td>
          <td>String</td>
          <td>asset symbol</td>
        </tr>
        <tr>
          <td>balance</td>
          <td>String</td>
          <td>available amount, should divide by 1E8.</td>
        </tr>
        <tr>
          <td>frozen</td>
          <td>String</td>
          <td>frozen amount, should divide by 1E8.</td>
        </tr>
      </tbody>
    </table>

    <p>Success-Response </p>

    <div>
      <pre><code class="language-none">{
    &quot;status&quot;: {
        &quot;success&quot;: 1,
        &quot;message&quot;: &quot;BALANCE&quot;
    },
    &quot;result&quot;: {
        &quot;symbol&quot;: &quot;CNY&quot;,
        &quot;balance&quot;: &quot;3530103600&quot;,
        &quot;frozen&quot;: &quot;240790000&quot;
    }
}</code></pre>
    </div>

    <h3 id="toc_9">ACCOUNT - LIST BALANCES</h3>

    <ul>
      <li>Returns the users account balances.</li>
    </ul>

    <p>
      <strong>GET</strong>
    </p>

    <blockquote>
      <p>/balances</p>
    </blockquote>

    <p>Example Usage:</p>

    <blockquote>
      <p>curl -H&quot;apikey: your api key&quot; -H&quot;signature: your signature&quot; -H&quot;Content-Type: application/json&quot; https://www.rightbtc.com/api/trader/balances</p>
    </blockquote>

    <p>
      <strong>Success 200</strong>
    </p>

    <p>Parameter:</p>

    <table>
      <thead>
        <tr>
          <th>Field</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>asset</td>
          <td>String</td>
          <td>asset symbol</td>
        </tr>
        <tr>
          <td>balance</td>
          <td>String</td>
          <td>available amount, should divide by 1E8.</td>
        </tr>
        <tr>
          <td>frozen</td>
          <td>String</td>
          <td>frozen amount, should divide by 1E8.</td>
        </tr>
      </tbody>
    </table>

    <p>Success-Response </p>

    <div>
      <pre><code class="language-none">{
    &quot;status&quot;: {
        &quot;success&quot;: 1,
        &quot;message&quot;: &quot;GET_BALANCES&quot;
    },
    &quot;result&quot;: [
        {
            &quot;asset&quot;: &quot;ETP&quot;,
            &quot;balance&quot;: &quot;5000000000000&quot;,
            &quot;frozen&quot;: &quot;0&quot;,
            &quot;state&quot;: &quot;1&quot;
        },
        {
            &quot;asset&quot;: &quot;CNY&quot;,
            &quot;balance&quot;: &quot;10000000000000&quot;,
            &quot;frozen&quot;: &quot;240790000&quot;,
            &quot;state&quot;: &quot;1&quot;
        }
    ]
}
</code></pre>
    </div>

    <h3 id="toc_10">ACCOUNT - LIST DEPOSIT</h3>

    <p>Returns deposits</p>

    <p>
      <strong>GET</strong>
    </p>

    <blockquote>
      <p>/deposits/:asset/:page</p>
    </blockquote>

    <p>Example Usage:</p>

    <blockquote>
      <p>curl -H&quot;apikey: your api key&quot; -H&quot;signature: your signature&quot; -H&quot;Content-Type: application/json&quot; https://www.rightbtc.com/api/trader/deposits/CNY/0</p>
    </blockquote>

    <p>
      <strong>Success 200</strong>
    </p>

    <p>Parameter:</p>

    <table>
      <thead>
        <tr>
          <th>Field</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>amount</td>
          <td>Number</td>
          <td>deposit amount, should divide by 1E8</td>
        </tr>
        <tr>
          <td>state</td>
          <td>String</td>
          <td>deposit state (PENDING</td>
        </tr>
        <tr>
          <td>created_at</td>
          <td>String</td>
          <td>deposit time</td>
        </tr>
      </tbody>
    </table>

    <p>Success-Response </p>

    <div>
      <pre><code class="language-none">{
    &quot;status&quot;: {
        &quot;success&quot;: 1,
        &quot;message&quot;: null
    },
    &quot;result&quot;: [
        {
            &quot;amount&quot;: 10000000000000,
            &quot;state&quot;: &quot;PENDING&quot;,
            &quot;created_at&quot;: &quot;2017-05-08T11:12:46.000Z&quot;
        },
        {
            &quot;amount&quot;: 10000000000000,
            &quot;state&quot;: &quot;COMPLETE&quot;,
            &quot;created_at&quot;: &quot;2016-10-18T04:31:13.000Z&quot;
        }
    ]
}</code></pre>
    </div>

    <h3 id="toc_11">ACCOUNT - LIST WITHDRAWAL</h3>

    <div>
      <pre><code class="language-none">Returns withdrawals</code></pre>
    </div>

    <p>
      <strong>GET</strong>
    </p>

    <blockquote>
      <p>/withdrawals/:asset/:page</p>
    </blockquote>

    <p>Example Usage:</p>

    <blockquote>
      <p>curl -H&quot;apikey: your api key&quot; -H&quot;signature: your signature&quot; -H&quot;Content-Type: application/json&quot; https://www.rightbtc.com/api/trader/withdrawals/BTC/0</p>
    </blockquote>

    <p>
      <strong>Success 200</strong>
    </p>

    <p>Parameter:</p>

    <table>
      <thead>
        <tr>
          <th>Field</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>amount</td>
          <td>Number</td>
          <td>withdrawal amount, should divide by 1E8</td>
        </tr>
        <tr>
          <td>state</td>
          <td>String</td>
          <td>withdrawal state (PENDING</td>
        </tr>
        <tr>
          <td>created_at</td>
          <td>String</td>
          <td>withdrawal time</td>
        </tr>
      </tbody>
    </table>

    <p>Success-Response </p>

    <div>
      <pre><code class="language-none">{
    &quot;status&quot;: {
        &quot;success&quot;: 1,
        &quot;message&quot;: null
    },
    &quot;result&quot;: [
        {
            &quot;amount&quot;: 30000000,
            &quot;status&quot;: &quot;PENDING&quot;,
            &quot;created_at&quot;: &quot;2017-02-15T23:30:03.000Z&quot;
        },
        {
            &quot;amount&quot;: 30000000,
            &quot;status&quot;: &quot;PENDING&quot;,
            &quot;created_at&quot;: &quot;2017-01-12T20:15:32.000Z&quot;
        },
        {
            &quot;amount&quot;: 100000000,
            &quot;status&quot;: &quot;PENDING&quot;,
            &quot;created_at&quot;: &quot;2017-01-12T01:47:38.000Z&quot;
        },
        {
            &quot;amount&quot;: 300000000,
            &quot;status&quot;: &quot;PENDING&quot;,
            &quot;created_at&quot;: &quot;2016-12-13T23:34:38.000Z&quot;
        },
        {
            &quot;amount&quot;: 100000000,
            &quot;status&quot;: &quot;COMPLETE&quot;,
            &quot;created_at&quot;: &quot;2016-12-13T23:26:54.000Z&quot;
        }
    ]
}
</code></pre>
    </div>

    <h3 id="toc_12">ORDERS - LIST HISTORY TRADES</h3>

    <div>
      <pre><code class="language-none">Returns users history trades to the given trading pair.</code></pre>
    </div>

    <p>
      <strong>GET</strong>
    </p>

    <blockquote>
      <p>/historys/:trading_pair/:page</p>
    </blockquote>

    <p>Example Usage:</p>

    <blockquote>
      <p>curl -H&quot;apikey: your api key&quot; -H&quot;signature: your signature&quot; -H&quot;Content-Type: application/json&quot; https://www.rightbtc.com/api/trader/historys/BTCCNY/0</p>
    </blockquote>

    <p>
      <strong>Success 200</strong>
    </p>

    <p>Parameter:</p>

    <table>
      <thead>
        <tr>
          <th>Field</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>order_id</td>
          <td>Number</td>
          <td>order id</td>
        </tr>
        <tr>
          <td>trade_id</td>
          <td>Number</td>
          <td>trade id</td>
        </tr>
        <tr>
          <td>side</td>
          <td>String</td>
          <td>&#39;B&#39; for &#39;BUY&#39; / &#39;S&#39; for &#39;SELL&#39;</td>
        </tr>
        <tr>
          <td>price</td>
          <td>Number</td>
          <td>deal price, should divide by 1E8</td>
        </tr>
        <tr>
          <td>quantity</td>
          <td>Number</td>
          <td>deal amount, should divide by 1E8</td>
        </tr>
        <tr>
          <td>created_at</td>
          <td>String</td>
          <td>order created datetime</td>
        </tr>
      </tbody>
    </table>

    <p>Success-Response </p>

    <div>
      <pre><code class="language-none">{
    &quot;status&quot;: {
        &quot;success&quot;: 1,
        &quot;message&quot;: null
    },
    &quot;result&quot;: [
        {
            &quot;order_id&quot;: 118735,
            &quot;trade_id&quot;: 7,
            &quot;trading_pair&quot;: &quot;BTCCNY&quot;,
            &quot;side&quot;: &quot;B&quot;,
            &quot;quantity&quot;: 1000000000,
            &quot;price&quot;: 900000000,
            &quot;created_at&quot;: &quot;2017-06-06T20:45:27.000Z&quot;
        },
        {
            &quot;order_id&quot;: 118734,
            &quot;trade_id&quot;: 7,
            &quot;trading_pair&quot;: &quot;BTCCNY&quot;,
            &quot;side&quot;: &quot;S&quot;,
            &quot;quantity&quot;: 1000000000,
            &quot;price&quot;: 900000000,
            &quot;created_at&quot;: &quot;2017-06-06T20:45:27.000Z&quot;
        }
    ]
}
</code></pre>
    </div>

    <h3 id="toc_13">ORDERS - LIST TRADING PAIRS</h3>

    <div>
      <pre><code class="language-none">Returns all trading pairs.</code></pre>
    </div>

    <p>
      <strong>GET</strong>
    </p>

    <blockquote>
      <p>/trading_pairs</p>
    </blockquote>

    <p>Example Usage:</p>

    <blockquote>
      <p>curl -H&quot;apikey: your api key&quot; -H&quot;signature: your signature&quot; -H&quot;Content-Type: application/json&quot; https://www.rightbtc.com/api/trader/trading_pairs</p>
    </blockquote>

    <p>
      <strong>Success 200</strong>
    </p>

    <p>Parameter:</p>

    <table>
      <thead>
        <tr>
          <th>Field</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>name</td>
          <td>String</td>
          <td>trading pair</td>
        </tr>
        <tr>
          <td>ask
            <em>asset</em>symbol</td>
          <td>String</td>
          <td>FIAT</td>
        </tr>
        <tr>
          <td>ask
            <em>asset</em>decimals</td>
          <td>String</td>
          <td>max decimal digits</td>
        </tr>
        <tr>
          <td>bid
            <em>asset</em>symbol</td>
          <td>String</td>
          <td>COIN</td>
        </tr>
        <tr>
          <td>bid
            <em>asset</em>decimals</td>
          <td>String</td>
          <td>max decimal digits</td>
        </tr>
      </tbody>
    </table>

    <p>Success-Response </p>

    <div>
      <pre><code class="language-none">{
    &quot;BTCCNY&quot;: {
        &quot;name&quot;: &quot;BTCCNY&quot;,
        &quot;ask_asset_symbol&quot;: &quot;CNY&quot;,
        &quot;ask_asset_decimals&quot;: 2,
        &quot;ask_asset_type&quot;: &quot;FIAT&quot;,
        &quot;bid_asset_symbol&quot;: &quot;BTC&quot;,
        &quot;bid_asset_decimals&quot;: 3,
        &quot;bid_asset_type&quot;: &quot;COIN&quot;
    },
    &quot;ETCCNY&quot;: {
        &quot;name&quot;: &quot;ETCCNY&quot;,
        &quot;ask_asset_symbol&quot;: &quot;CNY&quot;,
        &quot;ask_asset_decimals&quot;: 2,
        &quot;ask_asset_type&quot;: &quot;FIAT&quot;,
        &quot;bid_asset_symbol&quot;: &quot;ETC&quot;,
        &quot;bid_asset_decimals&quot;: 2,
        &quot;bid_asset_type&quot;: &quot;COIN&quot;
    },
    &quot;ETHCNY&quot;: {
        &quot;name&quot;: &quot;ETHCNY&quot;,
        &quot;ask_asset_symbol&quot;: &quot;CNY&quot;,
        &quot;ask_asset_decimals&quot;: 2,
        &quot;ask_asset_type&quot;: &quot;FIAT&quot;,
        &quot;bid_asset_symbol&quot;: &quot;ETH&quot;,
        &quot;bid_asset_decimals&quot;: 3,
        &quot;bid_asset_type&quot;: &quot;COIN&quot;
    },
    &quot;ETPCNY&quot;: {
        &quot;name&quot;: &quot;ETPCNY&quot;,
        &quot;ask_asset_symbol&quot;: &quot;CNY&quot;,
        &quot;ask_asset_decimals&quot;: 2,
        &quot;ask_asset_type&quot;: &quot;FIAT&quot;,
        &quot;bid_asset_symbol&quot;: &quot;ETP&quot;,
        &quot;bid_asset_decimals&quot;: 2,
        &quot;bid_asset_type&quot;: &quot;COIN&quot;
    },
    &quot;ZECCNY&quot;: {
        &quot;name&quot;: &quot;ZECCNY&quot;,
        &quot;ask_asset_symbol&quot;: &quot;CNY&quot;,
        &quot;ask_asset_decimals&quot;: 2,
        &quot;ask_asset_type&quot;: &quot;FIAT&quot;,
        &quot;bid_asset_symbol&quot;: &quot;ZEC&quot;,
        &quot;bid_asset_decimals&quot;: 3,
        &quot;bid_asset_type&quot;: &quot;COIN&quot;
    }
}
</code></pre>
    </div>

  </div>

</template>

<script>
export default {
  layout: 'apiLayout',
};
</script>


<style scoped>
@import '../../assets/css/api.css';
</style>
